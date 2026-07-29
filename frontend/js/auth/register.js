/*=========================================================
            XTRAGRAD AI — REGISTER.JS
      Connected to FastAPI Backend (port 8000)
=========================================================*/

document.addEventListener("DOMContentLoaded", () => {
    initRegister();
});


function initRegister() {
    passwordToggles();
    registerValidation();
    loader();
}


/*=========================================================
            PASSWORD TOGGLE
=========================================================*/

function passwordToggles() {
    document.querySelectorAll(".toggle-password").forEach(toggle => {
        toggle.addEventListener("click", function () {
            const targetId = this.getAttribute("data-target");
            const input = document.getElementById(targetId);
            if (!input) return;
            if (input.type === "password") {
                input.type = "text";
                this.className = "fa-solid fa-eye-slash toggle-password";
            } else {
                input.type = "password";
                this.className = "fa-solid fa-eye toggle-password";
            }
        });
    });
}


/*=========================================================
            REGISTER FORM VALIDATION & SUBMIT
=========================================================*/

function registerValidation() {
    const form = document.getElementById("registerForm");
    if (!form) return;

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const fullname = document.getElementById("fullname")?.value.trim();
        const email = document.getElementById("email")?.value.trim();
        const phone = document.getElementById("phone")?.value.trim();
        const college = document.getElementById("college")?.value.trim();
        const branch = document.getElementById("branch")?.value;
        const year = document.getElementById("yearOfStudy")?.value || "";
        const password = document.getElementById("password")?.value;
        const confirmPassword = document.getElementById("confirmPassword")?.value;
        const terms = document.getElementById("terms")?.checked;

        // Validation
        if (!fullname || fullname.length < 2) {
            showToast("Full name is required", "error");
            return;
        }
        if (!email || !validateEmail(email)) {
            showToast("Enter a valid email address", "error");
            return;
        }
        if (!password || password.length < 6) {
            showToast("Password must be at least 6 characters", "error");
            return;
        }
        if (password !== confirmPassword) {
            showToast("Passwords do not match", "error");
            return;
        }
        if (!terms) {
            showToast("Accept Terms & Conditions", "error");
            return;
        }

        // Submit registration
        await registerUser({
            full_name: fullname,
            email: email,
            phone: phone || "",
            college: college || "",
            branch: branch || "",
            year_of_study: year || "",
            password: password,
        });
    });
}


/*=========================================================
            REGISTER — Call FastAPI /auth/register
=========================================================*/

async function registerUser(data) {
    const button = document.querySelector(".register-btn");
    const original = button.innerHTML;
    button.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating Account...';
    button.disabled = true;

    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.detail || "Registration failed");
        }

        // Store auth data (auto-login after register)
        localStorage.setItem("access_token", result.access_token);
        localStorage.setItem("user_id", result.user_id);
        localStorage.setItem("user_email", result.email);
        localStorage.setItem("user_name", result.full_name);
        localStorage.setItem("user_role", result.role);
        localStorage.setItem("studentEmail", result.email);

        showToast("Account Created Successfully! Redirecting...", "success");

        setTimeout(() => {
            window.location.href = "student-dashboard.html";
        }, 1500);

    } catch (error) {
        showToast(error.message || "Registration Failed", "error");
    } finally {
        button.innerHTML = original;
        button.disabled = false;
    }
}


/*=========================================================
            HELPERS
=========================================================*/

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


/*=========================================================
            TOAST NOTIFICATION
=========================================================*/

function showToast(message, type) {
    // Try existing toast element
    let toast = document.getElementById("toast");

    // Create toast if page doesn't have one
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        toast.className = "toast";
        toast.innerHTML = '<i class="fa-solid fa-circle-check"></i> <span></span>';
        toast.style.cssText = `
            position: fixed; top: 30px; right: 30px; z-index: 9999;
            padding: 14px 28px; border-radius: 12px; color: #fff;
            display: flex; align-items: center; gap: 10px;
            font-family: 'Poppins', sans-serif; font-size: 14px;
            transform: translateX(120%); transition: transform 0.4s ease;
            box-shadow: 0 8px 30px rgba(0,0,0,.3);
        `;
        document.body.appendChild(toast);
    }

    const icon = toast.querySelector("i");
    const text = toast.querySelector("span");
    if (text) text.innerText = message;

    if (type === "success") {
        toast.style.background = "#16a34a";
        if (icon) icon.className = "fa-solid fa-circle-check";
    } else if (type === "error") {
        toast.style.background = "#dc2626";
        if (icon) icon.className = "fa-solid fa-circle-xmark";
    } else {
        toast.style.background = "#2563eb";
        if (icon) icon.className = "fa-solid fa-circle-info";
    }

    toast.style.transform = "translateX(0)";
    setTimeout(() => {
        toast.style.transform = "translateX(120%)";
    }, 3500);
}


/*=========================================================
            LOADER
=========================================================*/

function loader() {
    window.addEventListener("load", () => {
        const ldr = document.querySelector(".loader");
        if (!ldr) return;
        ldr.style.opacity = "0";
        setTimeout(() => { ldr.style.display = "none"; }, 600);
    });
}


console.log("✅ XTRAGRAD AI Register Module Loaded");
