/**
 * UI Utility Module
 * Handle common UI interactions like loading states
 * 
 * UI 工具模块 - 处理 Loading 状态等通用交互
 */

import { UIAdapter } from '../adapters/ui-adapter.js';

export const NOTIFICATION_DURATION = 3000;

// Minimal default adapter to prevent crashes and remove dependency on specific UI
class DefaultUIAdapter extends UIAdapter {
    toggleLoading(element, isLoading) { /* No-op */ }
    showFieldErrors(container, errors) { console.warn('[Geminus] UI Adapter not set. Errors:', errors); }
    clearFieldErrors(container) { /* No-op */ }
    showNotification(message, type) { console.log(`[Geminus] ${type.toUpperCase()}: ${message}`); }
    confirm(message) { return window.confirm(message); }
}

// Global UI adapter instance
let uiAdapter = new DefaultUIAdapter();

/**
 * Set custom UI adapter
 * 设置自定义 UI 适配器
 * 
 * @param {UIAdapter} adapter - Custom UI adapter instance
 */
export function setUIAdapter(adapter) {
    if (!(adapter instanceof UIAdapter)) {
        throw new Error('Invalid UI adapter. Must extend UIAdapter.');
    }
    uiAdapter = adapter;
}

/**
 * Get current UI adapter
 * 获取当前 UI 适配器
 * 
 * @returns {UIAdapter}
 */
export function getUIAdapter() {
    return uiAdapter;
}

/**
 * Toggle loading state for an element (button/container)
 * 切换元素的 Loading 状态
 * 
 * @param {HTMLElement} element - Target element
 * @param {boolean} isLoading - True to show loading, false to restore
 * @param {string} loadingHtml - Custom loading HTML (optional)
 */
export function toggleLoading(element, isLoading, loadingHtml = null) {
    return uiAdapter.toggleLoading(element, isLoading, loadingHtml);
}

/**
 * Render field-level errors to a container (usually a form)
 * 将字段级错误渲染到容器（通常是表单）
 * 
 * @param {HTMLElement} container - Form or container element
 * @param {Object} errors - Error object { fieldName: errorMessage }
 */
export function showFieldErrors(container, errors) {
    return uiAdapter.showFieldErrors(container, errors);
}

/**
 * Clear all error states from a container
 * 清除容器内的所有错误状态
 * 
 * @param {HTMLElement} container - Form or container element
 */
export function clearFieldErrors(container) {
    return uiAdapter.clearFieldErrors(container);
}

/**
 * Show notification using current UI adapter
 * 使用当前 UI 适配器显示通知
 * 
 * @param {string} message - Notification message
 * @param {string} type - Notification type
 * @param {number} duration - Display duration
 */
export function showNotification(message, type = 'info', duration = 3000) {
    return uiAdapter.showNotification(message, type, duration);
}

/**
 * Show confirmation dialog using current UI adapter
 * 使用当前 UI 适配器显示确认对话框
 * 
 * @param {string} message - Confirmation message
 * @returns {Promise<boolean>}
 */
export function confirm(message) {
    return uiAdapter.confirm(message);
}

