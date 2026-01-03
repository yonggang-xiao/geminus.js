# Geminus.js - Usage Guide

A lightweight, native ESM JavaScript library for handling forms, AJAX, and notifications. Zero dependencies, Tabler UI ready.

## Directory Structure

```
lib/
├── core/
│   ├── http.js          # HTTP Request (sendRequest)
│   ├── csrf.js          # CSRF Management (getCsrfToken, updateCsrfToken)
│   └── ui.js            # UI Proxy (toggleLoading, showNotification)
├── adapters/
│   ├── ui-adapter.js    # UI Interface (Abstract)
│   └── ui-tabler.js     # Tabler Implementation
├── form.js              # Form Submission (submitForm)
├── ajax.js              # AJAX Request (ajaxRequest)
└── index.js             # Main Entry Point
```

---

## Quick Start

### 0. Using jsDelivr (ESM, no bundling)

Geminus.js is a native ESM library, so the simplest CDN usage is to import it directly from jsDelivr.

**Recommended (pin a tag or commit for stability):**

```html
<script type="module">
    import { submitForm, showNotification } from 'https://cdn.jsdelivr.net/gh/yonggang-xiao/geminus.js@v1.1.0/lib/index.js';

    showNotification('Hello from jsDelivr', 'info', 2000);
    submitForm('#myForm');
</script>
```

**Alternatively (tracks main branch, not recommended for production):**

```html
<script type="module">
    import { submitForm } from 'https://cdn.jsdelivr.net/gh/yonggang-xiao/geminus.js@main/lib/index.js';
    submitForm('#myForm');
</script>
```

### 1. Using Tabler UI (Default)

```html
<!DOCTYPE html>
<html>
<head>
    <link href="https://cdn.jsdelivr.net/npm/tabler@1.4.0/dist/css/tabler.min.css" rel="stylesheet">
    <meta name="csrf-hash" content="your-csrf-token">
    <meta name="csrf-name" content="csrf_test_name">
</head>
<body>
    <form id="myForm" action="/submit" method="post">
        <input type="hidden" name="csrf_test_name" value="your-csrf-token">
        <input type="text" name="username" required>
        <button type="submit">Submit</button>
    </form>

    <script src="https://cdn.jsdelivr.net/npm/@tabler/core@1.4.0/dist/js/tabler.min.js"></script>
    
    <script type="module">
        // Import library
        import { submitForm } from './lib/index.js';
        // TablerUIAdapter is used by default, no setup needed!

        // Use form submission
        submitForm('#myForm', {
            onSuccess: (data) => {
                console.log('Success:', data);
            },
            onError: (error) => {
                console.error('Error:', error);
            }
        });
    </script>
</body>
</html>
```

---

### 2. Using HTTP Layer Only (No Notification Dependency)

```html
<script type="module">
    import { sendRequest, getCsrfToken } from './lib/index.js';

    // Send GET request
    const { response, data, error } = await sendRequest('/api/users', {
        method: 'GET'
    });

    if (!error && response.ok) {
        console.log('Users:', data);
    }
</script>
```

---

### 3. Custom UI Adapter

```html
<script type="module">
    import { 
        setUIAdapter, 
        UIAdapter,
        submitForm 
    } from './lib/index.js';

    // Custom UI adapter (extends UIAdapter)
    class MyCustomUI extends UIAdapter {
        // Implement required methods...
        toggleLoading(element, isLoading) { /* ... */ }
        showFieldErrors(container, errors) { /* ... */ }
        clearFieldErrors(container) { /* ... */ }
        
        // Implement notification
        showNotification(message, type = 'info', duration = 3000) {
            // Use your notification library (e.g., Toastr, SweetAlert2, etc.)
            if (type === 'success') {
                alert(`✓ ${message}`);
            } else if (type === 'danger') {
                alert(`✗ ${message}`);
            } else {
                console.log(`[${type}] ${message}`);
            }
        }
    }

    // Set custom adapter
    setUIAdapter(new MyCustomUI());

    // All operations now use custom UI logic
    submitForm('#myForm');
</script>
```

---

## API Documentation

### Core API

#### `sendRequest(url, fetchOptions)` 
Low-level fetch wrapper (zero dependency)

```javascript
import { sendRequest } from './lib/index.js';

const { response, data, error } = await sendRequest('/api/data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'John' })
});

if (!error && response.ok) {
    console.log('Response data:', data);
}
```

---

#### `getCsrfToken()` / `updateCsrfToken(csrf)`
CSRF Token Management

```javascript
import { getCsrfToken, updateCsrfToken } from './lib/index.js';

// Get CSRF token
const csrf = getCsrfToken();
if (csrf) {
    console.log(`Token: ${csrf.value}`);
}

// Update token (automatically called when response contains new token)
updateCsrfToken({ name: 'csrf_test_name', hash: 'new-token' });
```

---

### UI & Notification API

#### `showNotification(message, type, duration)`
Show notification (delegates to current UI adapter)

```javascript
import { showNotification } from './lib/index.js';

showNotification('Success!', 'success', 3000);
showNotification('Error occurred', 'danger');
showNotification('Warning message', 'warning');
showNotification('Info message', 'info');
```

---

#### `setUIAdapter(adapter)`
Set custom UI adapter (for Notifications, Loading states and Form errors)

```javascript
import { setUIAdapter } from './lib/index.js';
import { TablerUIAdapter } from './lib/adapters/ui-tabler.js';

// Default is TablerUIAdapter, but you can set it explicitly
setUIAdapter(new TablerUIAdapter());

// Or implement your own for Tailwind/Bulma/etc.
// class TailwindUIAdapter extends UIAdapter { ... }
// setUIAdapter(new TailwindUIAdapter());
```

---

### Business Logic API

#### `submitForm(formSelector, options)`
Form submission function

```javascript
import { submitForm } from './lib/index.js';

submitForm('#myForm', {
    // Pre-submit callback (return false to cancel)
    beforeSubmit: (formData) => {
        console.log('Form data:', formData);
        return true;  // Continue submission
    },
    
    // Success callback
    onSuccess: (data) => {
        console.log('Form submitted:', data);
    },
    
    // Error callback
    onError: (error) => {
        console.error('Form error:', error);
    },
    
    // Show notifications
    showSuccessNotification: true,
    showErrorNotification: true,
    
    // Redirect after success
    redirectUrl: '/dashboard',
    redirectDelay: 3000,
    
    // Or reload page after success
    // reloadAfterSuccess: true,
    // reloadDelay: 3000
});
```

---

#### `ajaxRequest(url, options)`
AJAX request function (non-form operations)

```javascript
import { ajaxRequest } from './lib/index.js';

// Basic usage
ajaxRequest('/admin/users/toggle-status', {
    method: 'POST',
    data: { id: 1, active: true },
    onSuccess: (data) => console.log('Toggled:', data)
});

// With confirmation dialog
ajaxRequest('/admin/users/delete/1', {
    method: 'DELETE',
    confirmMessage: 'Are you sure you want to delete this user?',
    loadingTarget: '#deleteBtn',  // Show loading state
    reloadAfterSuccess: true      // Reload page after success
});

// Custom handling
ajaxRequest('/admin/status/update', {
    method: 'PATCH',
    data: { status: 'active' },
    onSuccess: (data) => {
        // Custom response handling
        window.location.href = data.redirectUrl;
    },
    onCancel: () => {
        console.log('Operation cancelled');
    }
});
```

---

## Common Scenarios

### Scenario 1: Form Submission with Field Validation

```html
<form id="userForm" action="/users/create">
    <input type="text" name="username" required>
    <input type="email" name="email" required>
    <div class="invalid-feedback"></div>
    <button type="submit">Create User</button>
</form>

<script type="module">
    import { submitForm } from './lib/index.js';

    submitForm('#userForm', {
        onSuccess: () => {
            window.location.href = '/users';
        }
    });
    
    // Backend response format (validation failed):
    // {
    //   "status": 422,
    //   "message": "Validation failed",
    //   "errors": {
    //     "username": "Username is required",
    //     "email": "Invalid email format"
    //   }
    // }
</script>
```

---

### Scenario 2: Delete Button with Confirmation

```html
<button class="btn btn-danger" data-delete-url="/users/1">
    Delete User
</button>

<script type="module">
    import { ajaxRequest } from './lib/index.js';

    document.querySelectorAll('[data-delete-url]').forEach(btn => {
        btn.addEventListener('click', async () => {
            const url = btn.dataset.deleteUrl;
            
            await ajaxRequest(url, {
                method: 'DELETE',
                confirmMessage: 'Delete this user permanently?',
                loadingTarget: btn,
                reloadAfterSuccess: true
            });
        });
    });
</script>
```

---

### Scenario 3: HTTP Layer Only (No UI)

```javascript
// Pure data request, no notifications
import { sendRequest, getCsrfToken } from './lib/index.js';

async function fetchUserData(userId) {
    const { response, data, error } = await sendRequest(`/api/users/${userId}`);
    
    if (error) {
        throw new Error('Network error');
    }
    
    if (!response.ok) {
        throw new Error(data?.message || 'Request failed');
    }
    
    return data;
}

async function updateUserStatus(userId, status) {
    const csrf = getCsrfToken();
    const body = { status };
    if (csrf) {
        body[csrf.name] = csrf.value;
    }
    
    const { response, data, error } = await sendRequest(
        `/api/users/${userId}/status`,
        {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        }
    );
    
    if (!error && response.ok) {
        return data;
    }
}
```

---

## Response Format Convention

### Success Response (2xx)

```json
{
    "message": "Operation successful",
    "data": {
        "id": 1,
        "name": "John Doe"
    },
    "csrf": {
        "name": "csrf_test_name",
        "hash": "new-token-value"
    }
}
```

### Failure Response (4xx/5xx)

```json
{
    "message": "Validation failed",
    "errors": {
        "email": "Email is required",
        "password": "Password must be at least 8 characters"
    }
}
```

---

## Bundling and Publishing

### Using as Local Module

Import directly in your project:

```html
<script type="module">
    import { submitForm } from '/path/to/lib/index.js';
</script>
```

---

## Browser Compatibility

- Requires ES6 module support
- Requires fetch API support
- Requires DOM API support

Compatible with Edge 15+, Chrome 61+, Firefox 67+, Safari 11+

---

## Contribution Guide

Issues and Pull Requests are welcome!

---

## License

MIT License
