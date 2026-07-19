/*=========================================================
            XTRAGRAD AI — API Configuration
=========================================================*/

const API_BASE = "http://localhost:8000";

/**
 * Helper: get stored JWT token.
 */
function getToken() {
    return localStorage.getItem("access_token");
}

/**
 * Helper: make authenticated API request.
 */
async function apiFetch(path, options = {}) {
    const token = getToken();
    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
    };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers,
    });
    return response;
}

/**
 * Auth guard — redirect to login if no token.
 */
function requireAuth() {
    const token = getToken();
    if (!token) {
        window.location.href = "login.html";
        return false;
    }
    return true;
}

/**
 * Logout — clear all stored data and redirect.
 */
function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_role");
    localStorage.removeItem("studentEmail");
    window.location.href = "login.html";
}

console.log("✅ XTRAGRAD AI API Config Loaded — Backend:", API_BASE);
