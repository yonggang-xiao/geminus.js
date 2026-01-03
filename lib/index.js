/**
 * Geminus.js - Main Entry Point
 * 
 * 主入口 - 导出所有公共 API
 */

// Core HTTP layer (zero dependency)
export { sendRequest } from './core/http.js';
export { getCsrfToken, updateCsrfToken } from './core/csrf.js';

// UI Adapters
export { UIAdapter } from './adapters/ui-adapter.js';

// Import and re-export TablerUIAdapter to use it locally
import { TablerUIAdapter } from './adapters/ui-tabler.js';
export { TablerUIAdapter };

// Import and re-export UI functions to use setUIAdapter locally
import { setUIAdapter, getUIAdapter, showNotification, confirm } from './core/ui.js';
export { setUIAdapter, getUIAdapter, showNotification, confirm };

// Set default UI adapter to Tabler (Convention over Configuration)
setUIAdapter(new TablerUIAdapter());

// Business functions
export { submitForm } from './form.js';
export { ajaxRequest } from './ajax.js';

// Version
export const VERSION = '1.1.0';
