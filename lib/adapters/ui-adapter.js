/**
 * UI Adapter Interface (Abstract)
 * Define UI interaction interface for different frameworks
 * 
 * UI 适配器接口 - 定义不同 UI 框架的交互规范
 */

export class UIAdapter {
    /**
     * Toggle loading state for an element
     * 切换元素的 Loading 状态
     * 
     * @param {HTMLElement} element - Target element
     * @param {boolean} isLoading - True to show loading, false to restore
     * @param {string} [loadingHtml] - Custom loading HTML (optional)
     */
    toggleLoading(element, isLoading, loadingHtml = null) {
        throw new Error('UIAdapter.toggleLoading() must be implemented');
    }

    /**
     * Render field-level errors to a container
     * 将字段级错误渲染到容器
     * 
     * @param {HTMLElement} container - Form or container element
     * @param {Object} errors - Error object { fieldName: errorMessage }
     */
    showFieldErrors(container, errors) {
        throw new Error('UIAdapter.showFieldErrors() must be implemented');
    }

    /**
     * Clear all error states from a container
     * 清除容器内的所有错误状态
     * 
     * @param {HTMLElement} container - Form or container element
     */
    clearFieldErrors(container) {
        throw new Error('UIAdapter.clearFieldErrors() must be implemented');
    }

    /**
     * Show notification
     * 显示通知
     * 
     * @param {string} message - Notification message
     * @param {string} type - Notification type (success, info, warning, danger)
     * @param {number} duration - Display duration in milliseconds
     */
    showNotification(message, type = 'info', duration = 3000) {
        const prefix = `[${type.toUpperCase()}]`;
        console.log(`${prefix} ${message}`);
    }

    /**
     * Show confirmation dialog
     * 显示确认对话框
     * 
     * @param {string} message - Confirmation message
     * @returns {Promise<boolean>} - True if confirmed, false otherwise
     */
    confirm(message) {
        return Promise.resolve(window.confirm(message));
    }
}
