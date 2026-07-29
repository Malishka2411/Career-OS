/*=========================================================
            XTRAGRAD AI — AUTH.JS
      Connected to FastAPI Backend (port 8000)
=========================================================*/

document.addEventListener("DOMContentLoaded", () => {
    initializeApp();
});


/*=========================================================
            INITIALIZE
=========================================================*/

function initializeApp() {
    currentYear();
    passwordToggle();
    loginValidation();
    rememberUser();
    socialLogin();
    loader();
}


/*=========================================================
            CURRENT YEAR
=========================================================*/

function currentYear() {
    const year = document.getElementById("year");
    if (year) {
        year.textContent = new Date().getFullYear();
    }
}


/*=========================================================
            PASSWORD TOGGLE
=========================================================*/

function passwordToggle() {
    const password = document.getElementById("password");
    const toggle = document.getElementById("togglePassword");
    if (!password || !toggle) return;

    toggle.addEventListener("click", () => {
        if (password.type === "password") {
            password.type = "text";
            toggle.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
        } else {
            password.type = "password";
            toggle.innerHTML = '<i class="fa-solid fa-eye"></i>';
        }
    });
}


/*=========================================================
            LOGIN VALIDATION
=========================================================*/

function loginValidation() {
    const form = document.getElementById("loginForm");
    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (email === "") {
            showToast("Email is required", "error");
            return;
        }
        if (!validateEmail(email)) {
            showToast("Invalid Email Address", "error");
            return;
        }
        if (password === "") {
            showToast("Password is required", "error");
            return;
        }
        if (password.length < 6) {
            showToast("Password must be at least 6 characters", "error");
            return;
        }
        loginUser(email, password);
    });
}


/*=========================================================
            LOGIN — Connected to FastAPI Backend
=========================================================*/

async function loginUser(email, password) {
    const button = document.querySelector(".login-btn");
    const original = button.innerHTML;
    button.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Signing In...';
    button.disabled = true;

    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || "Login failed");
        }

        // Store auth data
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("user_email", data.email);
        localStorage.setItem("user_name", data.full_name);
        localStorage.setItem("user_role", data.role);
        localStorage.setItem("studentEmail", data.email);

        showToast("Login Successful! Redirecting...", "success");

        setTimeout(() => {
            window.location.href = "student-dashboard.html";
        }, 1200);

    } catch (error) {
        showToast(error.message || "Login Failed — Check credentials", "error");
    } finally {
        button.innerHTML = original;
        button.disabled = false;
    }
}


/*=========================================================
            EMAIL VALIDATION
=========================================================*/

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}


/*=========================================================
            REMEMBER USER
=========================================================*/

function rememberUser() {
    const remember = document.querySelector("input[type='checkbox']");
    const email = document.getElementById("email");
    if (!remember || !email) return;

    const saved = localStorage.getItem("rememberEmail");
    if (saved) {
        email.value = saved;
        remember.checked = true;
    }

    remember.addEventListener("change", () => {
        if (remember.checked) {
            localStorage.setItem("rememberEmail", email.value);
        } else {
            localStorage.removeItem("rememberEmail");
        }
    });
}


/*=========================================================
            SOCIAL LOGIN
=========================================================*/

function socialLogin() {
    const google = document.querySelector(".google-btn");
    const linkedin = document.querySelector(".linkedin-btn");

    if (google) {
        google.addEventListener("click", () => {
            showToast("Google Login Coming Soon", "info");
        });
    }
    if (linkedin) {
        linkedin.addEventListener("click", () => {
            showToast("LinkedIn Login Coming Soon", "info");
        });
    }
}


/*=========================================================
            TOAST
=========================================================*/

function showToast(message, type) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    const icon = toast.querySelector("i");
    const text = toast.querySelector("span");
    text.innerText = message;

    if (type === "success") {
        toast.style.background = "#16a34a";
        icon.className = "fa-solid fa-circle-check";
    } else if (type === "error") {
        toast.style.background = "#dc2626";
        icon.className = "fa-solid fa-circle-xmark";
    } else {
        toast.style.background = "#2563eb";
        icon.className = "fa-solid fa-circle-info";
    }

    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}


/*=========================================================
            LOADER
=========================================================*/

function loader() {
    window.addEventListener("load", () => {
        const loader = document.querySelector(".loader");
        if (!loader) return;
        loader.style.opacity = "0";
        setTimeout(() => {
            loader.style.display = "none";
        }, 600);
    });
}


/*=========================================================
            ENTER KEY
=========================================================*/

document.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const form = document.getElementById("loginForm");
        if (form) {
            form.requestSubmit();
        }
    }
});


/*=========================================================
            CONSOLE
=========================================================*/

console.log("✅ XTRAGRAD AI Authentication Loaded — Backend Connected");