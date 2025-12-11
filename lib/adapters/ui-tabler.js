/**
 * Tabler/Bootstrap UI Adapter
 * Implementation for Tabler and Bootstrap 5
 * 
 * Tabler/Bootstrap UI 适配器实现
 */

import { UIAdapter } from './ui-adapter.js';

export class TablerUIAdapter extends UIAdapter {
    constructor() {
        super();
        this.defaultSpinner = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>';
        this.typeStyles = {
            success: 'bg-success text-white',
            info: 'bg-info text-white',
            warning: 'bg-warning text-dark',
            danger: 'bg-danger text-white'
        };
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
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container position-fixed top-0 end-0 p-3';
            container.style.zIndex = '1055';
            document.body.appendChild(container);
        }

        // Create toast element
        const toast = document.createElement('div');
        const closeClass = type === 'warning' ? 'btn-close' : 'btn-close btn-close-white';
        toast.className = `toast align-items-center ${this.typeStyles[type] || this.typeStyles.info} border-0`;
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="${closeClass} me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;

        container.appendChild(toast);

        // Initialize Bootstrap Toast
        // Check if bootstrap is available globally
        if (typeof bootstrap !== 'undefined' && bootstrap.Toast) {
            const bsToast = new bootstrap.Toast(toast, { delay: duration });
            bsToast.show();
            
            toast.addEventListener('hidden.bs.toast', () => {
                toast.remove();
            });
        } else {
            // Fallback if bootstrap JS is not loaded
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, duration);
        }
    }
}
