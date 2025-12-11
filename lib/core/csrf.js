/**
 * CSRF Token Management Module
 * Handle CSRF token retrieval and updates
 * 
 * CSRF Token 管理模块 - 获取和更新 token
 */

/**
 * Get CSRF token from hidden input or meta tag
 * 优先从隐藏 input 读取，回退到 meta 标签
 * 
 * @returns {Object|null} { name: string, value: string } or null
 */
export function getCsrfToken() {
    // Priority 1: Hidden input (for pages with forms)
    const csrfInput = document.querySelector('input[type="hidden"][name^="csrf_"]');
    if (csrfInput) {
        return {
            name: csrfInput.name,
            value: csrfInput.value
        };
    }
    
    // Priority 2: Meta tags (for pages without forms)
    const csrfHashMeta = document.querySelector('meta[name="csrf-hash"]');
    if (csrfHashMeta) {
        const csrfNameMeta = document.querySelector('meta[name="csrf-name"]');
        return {
            name: csrfNameMeta ? csrfNameMeta.content : 'csrf_test_name',
            value: csrfHashMeta.content
        };
    }
    
    console.warn('[CSRF] Token not found');
    return null;
}

/**
 * Update CSRF token in all forms and meta tags
 * 同时更新所有表单中的 CSRF input 和 meta 标签
 * 
 * @param {Object} csrf - CSRF object { name: string, hash: string }
 */
export function updateCsrfToken(csrf) {
    if (!csrf || !csrf.name || !csrf.hash) return;
    
    // Update all form inputs
    document.querySelectorAll(`input[name="${csrf.name}"]`).forEach(input => {
        input.value = csrf.hash;
    });
    
    // Update meta tag
    const csrfHashMeta = document.querySelector('meta[name="csrf-hash"]');
    if (csrfHashMeta) {
        csrfHashMeta.content = csrf.hash;
    }
}
