/*=========================================================
            Career OS AI — API Configuration
  Auto-detects environment:
    • Local dev  → http://localhost:8000
    • Production → Render backend URL
=========================================================*/

/**
 * Detect API base URL automatically.
 * On Netlify (or any non-localhost host), use the Render backend.
 * Locally, use http://localhost:8000.
 *
 * To override, set window.__API_BASE__ before this script loads,
 * or change the RENDER_BACKEND_URL below after deploying to Render.
 */
const RENDER_BACKEND_URL = "https://ai-careeros.onrender.com";

const API_BASE = (function () {
    // Allow manual override
    if (window.__API_BASE__) return window.__API_BASE__;
    // Local development
    if (
        location.hostname === "localhost" ||
        location.hostname === "127.0.0.1" ||
        location.protocol === "file:"
    ) {
        return "http://localhost:8000";
    }
    // Production (Netlify / any deployed frontend)
    return RENDER_BACKEND_URL;
})();

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

console.log("✅ Career OS AI API Config Loaded — Backend:", API_BASE);
