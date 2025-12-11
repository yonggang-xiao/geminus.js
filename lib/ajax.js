/**
 * AJAX Request Module
 * Handle AJAX requests for non-form operations (button clicks, status toggles, deletions, etc.)
 * 
 * AJAX 请求模块 - 用于非表单操作（按钮点击、状态切换、删除等）
 */

import { sendRequest, handleResponse } from './core/http.js';
import { getCsrfToken } from './core/csrf.js';
import { toggleLoading, confirm as uiConfirm, NOTIFICATION_DURATION } from './core/ui.js';

/**
 * AJAX request wrapper for non-form operations
 * Suitable for button clicks, status toggles, deletion operations, etc.
 * 
 * AJAX 请求函数 - 用于按钮、删除、状态切换等非表单操作
 * 
 * @param {string} url - Request URL
 * @param {Object} options - Configuration options
 * @param {string} options.method - HTTP method, default 'POST'
 * @param {Object} options.data - Request data (JSON), default {}
 * @param {Function} options.onSuccess - Success callback function(data) {}
 * @param {Function} options.onError - Error callback function(error) {}
 * @param {Function} options.onCancel - Cancel callback when user clicks cancel
 * @param {boolean} options.autoNotify - Auto-show notifications, default true
 * @param {string|null} options.confirmMessage - Confirmation message (shows dialog before request)
 * @param {HTMLElement|string|null} options.loadingTarget - Loading target element
 * @param {string|null} options.redirectUrl - Auto-redirect URL after success
 * @param {number} options.redirectDelay - Redirect delay in milliseconds, default 3000
 * @param {boolean} options.reloadAfterSuccess - Auto-reload page after success, default false
 * @param {number} options.reloadDelay - Reload delay in milliseconds, default 3000
 * 
 * @example
 * // Basic usage
 * ajaxRequest('/admin/users/toggle-status', {
 *     method: 'POST',
 *     data: { id: 1, active: true },
 *     onSuccess: (data) => {
 *         console.log('Success');
 *     }
 * });
 * 
 * @example
 * // Delete with confirmation and auto-reload
 * ajaxRequest('/admin/users/delete/1', {
 *     method: 'DELETE',
 *     confirmMessage: 'Are you sure?',
 *     reloadAfterSuccess: true
 * });
 */
export async function ajaxRequest(url, options = {}) {
    const {
        method = 'POST',
        data = {},
        onSuccess = null,
        onError = null,
        onCancel = null,
        autoNotify = true,
        confirmMessage = null,
        loadingTarget = null,
        redirectUrl = null,
        redirectDelay = NOTIFICATION_DURATION,
        reloadAfterSuccess = false,
        reloadDelay = NOTIFICATION_DURATION
    } = options;
    
    // 1. Confirmation dialog
    if (confirmMessage) {
        const confirmed = await uiConfirm(confirmMessage);
        if (!confirmed) {
            if (onCancel) {
                onCancel();
            }
            return;
        }
    }
    
    // 2. Get CSRF token
    const csrf = getCsrfToken();
    if (csrf) {
        data[csrf.name] = csrf.value;
    }
    
    // 3. Handle loading state
    let targetElement = null;
    
    if (loadingTarget) {
        targetElement = typeof loadingTarget === 'string' 
            ? document.querySelector(loadingTarget) 
            : loadingTarget;
        
        toggleLoading(targetElement, true);
    }
    
    // 4. Build request config
    const fetchOptions = {
        method: method.toUpperCase(),
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        }
    };
    
    // GET requests should not have a body
    if (method.toUpperCase() !== 'GET') {
        fetchOptions.body = JSON.stringify(data);
    } else if (Object.keys(data).length > 0) {
        const params = new URLSearchParams(data);
        url = url.includes('?') ? `${url}&${params}` : `${url}?${params}`;
    }
    
    try {
        // 5. Send request
        const { response, data: result, error } = await sendRequest(url, fetchOptions);
        
        // 6. Handle response
        handleResponse(response, result, error, {
            autoNotify,
            onSuccess: (data) => {
                if (onSuccess) {
                    onSuccess(data);
                }
            },
            onError,
            redirectUrl,
            redirectDelay,
            reloadAfterSuccess,
            reloadDelay
        });
    } finally {
        // 7. Restore loading state
        toggleLoading(targetElement, false);
    }
}
