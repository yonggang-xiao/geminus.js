/**
 * Form Submission Module
 * Handle form submission with AJAX, validation, error rendering, and notifications
 * 
 * 表单提交模块 - AJAX 提交、字段验证、错误渲染
 */

import { sendRequest, handleResponse } from './core/http.js';
import { getCsrfToken } from './core/csrf.js';
import { toggleLoading, showFieldErrors, clearFieldErrors, NOTIFICATION_DURATION } from './core/ui.js';

/**
 * Form submission wrapper
 * Auto-handles AJAX submission, CSRF, validation, error display, and notifications
 * 
 * 表单提交函数 - 自动处理 AJAX 提交、CSRF、验证、错误显示
 * 
 * @param {string|HTMLFormElement} formSelector - Form selector or element
 * @param {Object} options - Configuration options
 * @param {Function} options.onSuccess - Success callback function(data) {}
 * @param {Function} options.onError - Error callback function(data) {}
 * @param {Function} options.beforeSubmit - Pre-submit callback, return false to cancel
 * @param {boolean} options.showSuccessNotification - Show success notification, default true
 * @param {boolean} options.showErrorNotification - Show error notification, default true
 * @param {string|null} options.redirectUrl - Auto-redirect URL after success
 * @param {number} options.redirectDelay - Redirect delay in milliseconds, default 3000
 * @param {boolean} options.reloadAfterSuccess - Auto-reload page after success, default false
 * @param {number} options.reloadDelay - Reload delay in milliseconds, default 3000
 */
export function submitForm(formSelector, options = {}) {
    const form = typeof formSelector === 'string' 
        ? document.querySelector(formSelector) 
        : formSelector;
    
    if (!form) {
        console.error('[Form] Form not found:', formSelector);
        return;
    }
    
    // Inject CSRF token if missing
    const csrf = getCsrfToken();
    if (csrf) {
        let csrfInput = form.querySelector(`input[name="${csrf.name}"]`);
        if (!csrfInput) {
            csrfInput = document.createElement('input');
            csrfInput.type = 'hidden';
            csrfInput.name = csrf.name;
            csrfInput.value = csrf.value;
            form.appendChild(csrfInput);
        }
    }

    const config = {
        onSuccess: null,
        onError: null,
        beforeSubmit: null,
        showSuccessNotification: true,
        showErrorNotification: true,
        redirectUrl: null,
        redirectDelay: NOTIFICATION_DURATION,
        reloadAfterSuccess: false,
        reloadDelay: NOTIFICATION_DURATION,
        ...options
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Clear previous error states
        clearFieldErrors(form);
        
        // Prepare form data
        const formData = new FormData(form);
        
        // Execute pre-submit callback
        if (config.beforeSubmit && config.beforeSubmit(formData) === false) {
            return;
        }
        
        // Get and disable submit button
        const submitBtn = form.querySelector('button[type="submit"]');
        toggleLoading(submitBtn, true);
        
        // Get action URL
        let actionUrl = form.getAttribute('action') || window.location.pathname;
        
        // Complete relative paths
        if (!actionUrl.startsWith('http') && !actionUrl.startsWith('/')) {
            const currentPath = window.location.pathname;
            const pathBase = currentPath.endsWith('/') ? currentPath : currentPath + '/';
            actionUrl = pathBase + actionUrl;
        }
        
        // Send request
        try {
            const { response, data, error } = await sendRequest(actionUrl, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            // Handle response
            handleResponse(response, data, error, {
                autoNotify: config.showSuccessNotification || config.showErrorNotification,
                form,
                onSuccess: (result) => {
                    if (config.onSuccess) {
                        config.onSuccess(result);
                    }
                },
                onError: config.onError,
                onFieldErrors: (errors) => {
                    showFieldErrors(form, errors);
                },
                redirectUrl: config.redirectUrl,
                redirectDelay: config.redirectDelay,
                reloadAfterSuccess: config.reloadAfterSuccess,
                reloadDelay: config.reloadDelay
            });
        } finally {
            // Restore submit button
            toggleLoading(submitBtn, false);
        }
    };
    
    form.addEventListener('submit', handleSubmit);
    
    // Auto-clear errors on reset
    form.addEventListener('reset', () => {
        // Use setTimeout to allow form to reset values first (optional, but good practice)
        setTimeout(() => clearFieldErrors(form), 0);
    });
}
