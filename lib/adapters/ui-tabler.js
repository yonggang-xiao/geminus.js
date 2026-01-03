/**
 * Tabler UI Adapter
 * Implementation for Tabler 1.4.0
 * 
 * Tabler UI 适配器实现
 */

import { UIAdapter } from './ui-adapter.js';

export class TablerUIAdapter extends UIAdapter {
    constructor() {
        super();
        this.defaultSpinner = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>';
        this.typeStyles = {
            success: 'alert-success',
            info: 'alert-info',
            warning: 'alert-warning',
            danger: 'alert-danger'
        };
    }

    getNotificationIconSvg(type = 'info') {
        // Matches Tabler docs: https://docs.tabler.io/ui/components/alerts ("Alerts with icons")
        const base = 'xmlns="http://www.w3.org/2000/svg" class="icon alert-icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
        const resetPath = '<path stroke="none" d="M0 0h24v24H0z" fill="none" />';

        switch (type) {
            case 'success':
                return `<svg ${base}>${resetPath}<path d="M5 12l5 5l10 -10" /></svg>`;
            case 'info':
                return `<svg ${base}>${resetPath}<circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12.01" y2="8" /><polyline points="11 12 12 12 12 16 13 16" /></svg>`;
            case 'warning':
                return `<svg ${base}>${resetPath}<path d="M12 9v4" /><path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0" /><path d="M12 16h.01" /></svg>`;
            case 'danger':
                return `<svg ${base}>${resetPath}<circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>`;
            default:
                return `<svg ${base}>${resetPath}<circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12.01" y2="8" /><polyline points="11 12 12 12 12 16 13 16" /></svg>`;
        }
    }

    toggleLoading(element, isLoading, loadingHtml = null) {
        if (!element) return;

        if (isLoading) {
            if (!element.hasAttribute('data-original-html')) {
                element.setAttribute('data-original-html', element.innerHTML);
            }
            
            element.disabled = true;
            element.classList.add('disabled');
            
            const spinner = loadingHtml || this.defaultSpinner;
            element.innerHTML = spinner;
        } else {
            if (element.hasAttribute('data-original-html')) {
                element.innerHTML = element.getAttribute('data-original-html');
                element.removeAttribute('data-original-html');
            }
            
            element.disabled = false;
            element.classList.remove('disabled');
        }
    }

    showFieldErrors(container, errors) {
        if (!container || !errors) return;
        
        let firstErrorInput = null;
        
        Object.keys(errors).forEach(field => {
            let fieldContainer = container.querySelector(`[data-field-name="${field}"]`);
            let input = null;
            
            if (!fieldContainer) {
                input = container.querySelector(`[name="${field}"]`);
            }
            
            // Handle checkbox/radio arrays
            if (!input && !fieldContainer) {
                input = container.querySelector(`[name="${field}[]"]`);
                if (input) {
                    input = null;
                    const arrayInputs = container.querySelectorAll(`[name="${field}[]"]`);
                    if (arrayInputs.length > 0) {
                        let parent = arrayInputs[0].parentElement;
                        while (parent && parent !== container) {
                            if (parent.hasAttribute('data-field-name') || 
                                parent.classList.contains('form-selectgroup')) {
                                fieldContainer = parent;
                                break;
                            }
                            parent = parent.parentElement;
                        }
                    }
                }
            }
            
            let feedback = null;
            
            if (fieldContainer) {
                feedback = document.getElementById(`${field}-error`);
                
                if (!feedback && fieldContainer.parentElement) {
                    feedback = fieldContainer.parentElement.querySelector('.invalid-feedback');
                }
                
                if (!feedback) {
                    let sibling = fieldContainer.nextElementSibling;
                    while (sibling) {
                        if (sibling.classList && sibling.classList.contains('invalid-feedback')) {
                            feedback = sibling;
                            break;
                        }
                        sibling = sibling.nextElementSibling;
                    }
                }
                
                fieldContainer.classList.add('border', 'border-danger', 'rounded');
                
                if (!firstErrorInput) firstErrorInput = fieldContainer;
            } else if (input) {
                input.classList.add('is-invalid');
                
                let feedbackContainer = input.parentElement;
                if (feedbackContainer.classList.contains('input-group')) {
                    feedbackContainer.classList.add('has-invalid');
                    feedbackContainer = feedbackContainer.parentElement;
                }
                
                feedback = feedbackContainer.querySelector('.invalid-feedback');
                if (!feedback) {
                    feedback = document.createElement('div');
                    feedback.className = 'invalid-feedback';
                    feedback.style.display = 'block';
                    feedbackContainer.appendChild(feedback);
                }
                
                if (!firstErrorInput) firstErrorInput = input;
            }
            
            if (feedback) {
                feedback.textContent = errors[field];
                feedback.style.display = 'block';
            }
        });
        
        if (firstErrorInput) {
            const offset = 100;
            const elementPosition = firstErrorInput.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            
            setTimeout(() => {
                if (firstErrorInput.focus) firstErrorInput.focus();
            }, 300);
        }
    }

    clearFieldErrors(container) {
        if (!container) return;
        
        container.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
        container.querySelectorAll('.has-invalid').forEach(el => el.classList.remove('has-invalid'));
        
        container.querySelectorAll('.invalid-feedback').forEach(el => {
            el.textContent = '';
            el.style.display = 'none';
        });
        
        container.querySelectorAll('[data-field-name]').forEach(el => {
            el.classList.remove('border', 'border-danger', 'rounded');
        });
    }

    showNotification(message, type = 'info', duration = 3000) {
        // Ensure container exists
        let container = document.querySelector('.alert-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'alert-container position-fixed top-0 end-0 p-3';
            document.body.appendChild(container);
        }

        // Create Tabler alert element (matches Tabler docs for alerts with icons)
        const alert = document.createElement('div');
        const alertClass = this.typeStyles[type] || this.typeStyles.info;
        alert.className = `alert ${alertClass} alert-dismissible`;
        alert.setAttribute('role', 'alert');

        const iconWrap = document.createElement('div');
        iconWrap.className = 'alert-icon';
        iconWrap.innerHTML = this.getNotificationIconSvg(type);

        const messageWrap = document.createElement('div');
        messageWrap.textContent = String(message ?? '');

        alert.appendChild(iconWrap);
        alert.appendChild(messageWrap);

        // Tabler docs use <a class="btn-close" data-bs-dismiss="alert" ...>
        // We keep a JS fallback so it works without Tabler JS.
        const closeButton = document.createElement('a');
        closeButton.className = 'btn-close';
        closeButton.setAttribute('data-bs-dismiss', 'alert');
        closeButton.setAttribute('aria-label', 'close');
        closeButton.href = '#';
        closeButton.addEventListener('click', (e) => {
            e.preventDefault();
            alert.remove();
        });
        alert.appendChild(closeButton);

        container.appendChild(alert);

        // Auto-dismiss after duration
        const delay = Number.isFinite(duration) ? duration : 3000;
        if (delay > 0) {
            setTimeout(() => {
                alert.remove();
            }, delay);
        }
    }
}
