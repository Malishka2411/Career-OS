/*=========================================================
                PROFILE IMAGE UPLOAD
=========================================================*/

const uploadBtn = document.querySelector(".upload-btn");
const profileImage = document.querySelector(".profile-image img");

// Create hidden file input
const fileInput = document.createElement("input");

fileInput.type = "file";
fileInput.accept = "image/png,image/jpeg,image/jpg";
fileInput.style.display = "none";

document.body.appendChild(fileInput);

// Open file explorer
uploadBtn.addEventListener("click", () => {

    fileInput.click();

});

// Preview selected image
fileInput.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {

        profileImage.src = e.target.result;

        localStorage.setItem("adminProfileImage",
            e.target.result
        );

        showToast("Profile photo updated successfully");

    };

    reader.readAsDataURL(file);

});

// Load saved image
window.addEventListener("load", () => {

    const savedImage =
        localStorage.getItem("adminProfileImage");

    if (savedImage) {

        profileImage.src = savedImage;

    }

});


/*=========================================================
                    LIVE SEARCH
=========================================================*/

const searchInput =
document.getElementById("settingsSearch");

searchInput.addEventListener("keyup", function () {

    const value =
    this.value.toLowerCase();

    const cards =
    document.querySelectorAll(".settings-card");

    cards.forEach(card => {

        const text =
        card.innerText.toLowerCase();

        if (text.includes(value)) {

            card.style.display = "block";

        }

        else {

            card.style.display = "none";

        }

    });

});


/*=========================================================
                TOAST NOTIFICATION
=========================================================*/

function showToast(message) {

    const toast =
    document.createElement("div");

    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i>
      <span>${message}</span>`;

    toast.style.position = "fixed";
    toast.style.top = "25px";
    toast.style.right = "25px";
    toast.style.background = "#10B981";
    toast.style.color = "#fff";
    toast.style.padding = "15px 22px";
    toast.style.borderRadius = "12px";
    toast.style.display = "flex";
    toast.style.alignItems = "center";
    toast.style.gap = "10px";
    toast.style.fontWeight = "600";
    toast.style.zIndex = "99999";
    toast.style.boxShadow ="0 15px 30px rgba(0,0,0,.30)";

    document.body.appendChild(toast);

    setTimeout(() => {

        toast.remove();

    }, 2500);

}

showToast("Settings Loaded Successfully");
/*=========================================================
                SAVE SETTINGS
=========================================================*/

const saveBtn = document.querySelector(".save-btn");

saveBtn.addEventListener("click", () => {

    const settings = {

        name: document.getElementById("adminName").value,

        email: document.getElementById("adminEmail").value,

        phone: document.getElementById("adminPhone").value,

        theme: document.getElementById("theme").value,

        accent: document.getElementById("accentColor").value,

        fontSize: document.getElementById("fontSize").value,

        layout: document.getElementById("layout").value

    };

    localStorage.setItem("adminSettings",
        JSON.stringify(settings)
    );

    showToast("Settings Saved Successfully");

});


/*=========================================================
                LOAD SETTINGS
=========================================================*/

window.addEventListener("load", () => {

    const saved =
        JSON.parse(localStorage.getItem("adminSettings"));

    if (!saved) return;

    document.getElementById("adminName").value =
        saved.name || "";

    document.getElementById("adminEmail").value =
        saved.email || "";

    document.getElementById("adminPhone").value =
        saved.phone || "";

    document.getElementById("theme").value =
        saved.theme || "Dark";

    document.getElementById("accentColor").value =
        saved.accent || "Blue";

    document.getElementById("fontSize").value =
        saved.fontSize || "Medium";

    document.getElementById("layout").value =
        saved.layout || "Default";

});


/*=========================================================
                THEME SWITCH
=========================================================*/

const theme =
document.getElementById("theme");

theme.addEventListener("change", function(){

    if(this.value === "Light"){

        document.body.style.background="#F8FAFC";
        document.body.style.color="#111827";

    }

    else{

        document.body.style.background="#0F172A";
        document.body.style.color="#FFFFFF";

    }

});


/*=========================================================
                FONT SIZE
=========================================================*/

const font =
document.getElementById("fontSize");

font.addEventListener("change",function(){

    if(this.value==="Small"){

        document.body.style.fontSize="14px";

    }

    else if(this.value==="Medium"){

        document.body.style.fontSize="16px";

    }

    else{

        document.body.style.fontSize="18px";

    }

});


/*=========================================================
                RESET SETTINGS
=========================================================*/

const resetBtn =
document.querySelector(".reset-btn");

resetBtn.addEventListener("click",()=>{

    if(confirm("Reset all settings?")){

        localStorage.removeItem("adminSettings");

        location.reload();

    }

});
/*=========================================================
                PASSWORD VALIDATION
=========================================================*/

const newPassword = document.getElementById("newPassword");
const confirmPassword = document.getElementById("confirmPassword");

function validatePassword() {

    if (
        confirmPassword.value!== "" &&
        newPassword.value!== confirmPassword.value
    ) {

        confirmPassword.style.border = "2px solid #EF4444";

    } else {

        confirmPassword.style.border = "2px solid #10B981";

    }

}

newPassword.addEventListener("keyup", validatePassword);
confirmPassword.addEventListener("keyup", validatePassword);

/*=========================================================
                SHOW / HIDE PASSWORD
=========================================================*/

[newPassword, confirmPassword].forEach(input => {

    input.addEventListener("dblclick", () => {

        input.type =
            input.type === "password"? "text": "password";

    });

});

/*=========================================================
                AI TEMPERATURE VALUE
=========================================================*/

const temperature =
document.getElementById("temperature");

// Create value label
const tempValue = document.createElement("span");

tempValue.style.marginLeft = "10px";
tempValue.style.fontWeight = "600";
tempValue.style.color = "#4F46E5";

temperature.parentElement.appendChild(tempValue);

function updateTemperature() {

    tempValue.innerText = temperature.value;

}

updateTemperature();

temperature.addEventListener("input", updateTemperature);

/*=========================================================
                SAVE AI SETTINGS
=========================================================*/

function saveAISettings() {

    const aiSettings = {

        provider:
            document.getElementById("aiProvider").value,

        model:
            document.getElementById("aiModel").value,

        temperature:
            temperature.value,

        maxTokens:
            document.getElementById("maxTokens").value

    };

    localStorage.setItem("aiSettings",
        JSON.stringify(aiSettings)
    );

}

document.getElementById("aiProvider").addEventListener("change", saveAISettings);

document.getElementById("aiModel").addEventListener("change", saveAISettings);

temperature.addEventListener("change", saveAISettings);

document.getElementById("maxTokens").addEventListener("change", saveAISettings);

/*=========================================================
                LOAD AI SETTINGS
=========================================================*/

const savedAI =
JSON.parse(localStorage.getItem("aiSettings"));

if(savedAI){

    document.getElementById("aiProvider").value =
        savedAI.provider;

    document.getElementById("aiModel").value =
        savedAI.model;

    temperature.value =
        savedAI.temperature;

    document.getElementById("maxTokens").value =
        savedAI.maxTokens;

    updateTemperature();

}

/*=========================================================
            SAVE NOTIFICATION SETTINGS
=========================================================*/

document.querySelectorAll(".notification-grid input").forEach((toggle,index)=>{

    const key = "notification_" + index;

    toggle.checked =
        localStorage.getItem(key) === "true";

    toggle.addEventListener("change",()=>{

        localStorage.setItem(key,toggle.checked);

        showToast("Notification Settings Updated");

    });

});
/*=========================================================
                EXPORT SETTINGS
=========================================================*/

const exportBtn = document.querySelector(".export-btn");

exportBtn.addEventListener("click", () => {

    const data = {
        adminSettings: JSON.parse(localStorage.getItem("adminSettings")),
        aiSettings: JSON.parse(localStorage.getItem("aiSettings"))
    };

    const blob = new Blob(
        [JSON.stringify(data, null, 4)],
        { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "XTRAGRAD_Settings.json";
    a.click();

    URL.revokeObjectURL(url);

    showToast("Settings Exported");

});


/*=========================================================
                IMPORT SETTINGS
=========================================================*/

const importBtn = document.querySelector(".import-btn");

const importInput = document.createElement("input");

importInput.type = "file";
importInput.accept = ".json";
importInput.style.display = "none";

document.body.appendChild(importInput);

importBtn.addEventListener("click", () => {

    importInput.click();

});

importInput.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {

        try {

            const data = JSON.parse(e.target.result);

            if (data.adminSettings)
                localStorage.setItem("adminSettings",
                    JSON.stringify(data.adminSettings)
                );

            if (data.aiSettings)
                localStorage.setItem("aiSettings",
                    JSON.stringify(data.aiSettings)
                );

            showToast("Settings Imported");

            setTimeout(() => {

                location.reload();

            }, 1000);

        } catch {

            alert("Invalid JSON File");

        }

    };

    reader.readAsText(file);

});


/*=========================================================
                BACKUP & RESTORE
=========================================================*/

document.querySelector(".backup-btn").addEventListener("click", () => {

    showToast("Database Backup Created");

});

document.querySelector(".restore-btn").addEventListener("click", () => {

    if (confirm("Restore previous backup?")) {

        showToast("Database Restored");

    }

});


/*=========================================================
            ACCOUNT MANAGEMENT
=========================================================*/

document.querySelector(".logout-all-btn").addEventListener("click", () => {

    if (confirm("Logout from all devices?")) {

        showToast("Logged out from all devices");

    }

});

document.querySelector(".reset-system-btn").addEventListener("click", () => {

    if (confirm("Reset entire system?")) {

        localStorage.clear();

        showToast("System Reset Complete");

        setTimeout(() => {

            location.reload();

        }, 1500);

    }

});

document.querySelector(".delete-account-btn").addEventListener("click", () => {

    const confirmDelete = prompt(
        'Type "DELETE" to confirm'
    );

    if (confirmDelete === "DELETE") {

        showToast("Account Deleted (Demo)");

    }

});


/*=========================================================
                AUTO SAVE
=========================================================*/

setInterval(() => {

    document.querySelector(".save-btn").click();

}, 30000);


/*=========================================================
                KEYBOARD SHORTCUT
=========================================================*/

document.addEventListener("keydown", (e) => {

    if (e.ctrlKey && e.key.toLowerCase() === "s") {

        e.preventDefault();

        document.querySelector(".save-btn").click();

    }

});


/*=========================================================
                INITIALIZATION
=========================================================*/

window.addEventListener("load", () => {

    showToast("Admin Settings Ready");

    console.log("XTRAGRAD AI Admin Settings Loaded");

});
