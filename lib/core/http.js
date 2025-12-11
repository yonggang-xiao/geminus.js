/**
 * HTTP Request Module - Core HTTP layer (zero dependency)
 * Handles fetch wrapper, JSON parsing, and error capturing
 * 
 * 核心 HTTP 请求模块 - 无依赖，可独立使用
 */

import { updateCsrfToken } from './csrf.js';
import { showNotification, NOTIFICATION_DURATION } from './ui.js';

/**
 * Unified fetch wrapper with error handling
 * 统一的 fetch 包装器，处理响应解析和网络错误
 * 
 * @param {string} url - Request URL
 * @param {Object} fetchOptions - fetch config options
 * @returns {Promise<{response: Response|null, data: Object|null, error: Error|null}>}
 */
export async function sendRequest(url, fetchOptions) {
    try {
        const response = await fetch(url, fetchOptions);
        
        // Try to parse JSON
        let data = null;
        const contentType = response.headers.get('Content-Type') || '';
        if (contentType.includes('application/json')) {
            try {
                data = await response.json();
            } catch (e) {
                console.error('[HTTP] JSON parse error:', e);
                data = null;
            }
        }
        
        return { response, data, error: null };
    } catch (error) {
        console.error('[HTTP] Network request error:', error);
        return { response: null, data: null, error };
    }
}

/**
 * Handle unified response with notifications and callbacks
 * 统一处理响应 - 通知、字段错误、回调
 * 
 * @param {Response} response - Fetch response object
 * @param {Object} data - Parsed JSON data
 * @param {Error} error - Network error
 * @param {Object} options - Configuration options
 */
export function handleResponse(response, data, error, options = {}) {
    const {
        autoNotify = true,
        onSuccess = null,
        onError = null,
        onFieldErrors = null,
        redirectUrl = null,
        redirectDelay = NOTIFICATION_DURATION,
        reloadAfterSuccess = false,
        reloadDelay = NOTIFICATION_DURATION
    } = options;
    
    // Network error
    if (error) {
        if (autoNotify) {
            showNotification('Network request failed, please try again', 'danger');
        }
        if (onError) {
            onError({ message: error.message, error });
        }
        return;
    }
    
    // Auto-update CSRF token if provided
    if (data && data.csrf) {
        updateCsrfToken(data.csrf);
    }
    
    // HTTP response handling
    if (response.ok) {
        // Success (2xx)
        if (autoNotify && data && data.message) {
            showNotification(data.message, 'success');
        }
        if (onSuccess) {
            onSuccess(data?.data || data);
        }

        // Handle Redirect / Reload
        // Priority: Response root > Response data > Config
        const finalRedirectUrl = data?.redirectUrl || (data?.data && data.data.redirectUrl) || redirectUrl;
        
        if (finalRedirectUrl) {
            setTimeout(() => {
                window.location.href = finalRedirectUrl;
            }, redirectDelay);
        } else if (reloadAfterSuccess) {
            setTimeout(() => {
                window.location.reload();
            }, reloadDelay);
        }
    } else {
        // Failure (4xx/5xx)
        const message = data?.message || 'Operation failed';
        if (autoNotify) {
            showNotification(message, 'danger');
        }
        
        // Handle field-level errors
        if (data && data.errors && onFieldErrors) {
            onFieldErrors(data.errors);
        }
        
        if (onError) {
            onError(data || { message, status: response.status });
        }
    }
}
