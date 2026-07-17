/*====================================================
                XTRAGRAD AI SETTINGS
====================================================*/

document.addEventListener("DOMContentLoaded", () => {

    initializeSettings();

});


/*====================================================
                INITIALIZE
====================================================*/

function initializeSettings(){

    loadSavedSettings();

    initializeMenu();

    initializeTheme();

    initializeToggles();

}


/*====================================================
                LEFT MENU ACTIVE
====================================================*/

function initializeMenu(){

    const menuItems = document.querySelectorAll(".menu-item");

    menuItems.forEach(item=>{

        item.addEventListener("click",()=>{

            menuItems.forEach(btn=>{

                btn.classList.remove("active");

            });

            item.classList.add("active");

        });

    });

}


/*====================================================
                SAVE PROFILE
====================================================*/

const saveButton=document.querySelector(".save-btn");

if(saveButton){

    saveButton.addEventListener("click",()=>{

        showToast("Profile Updated Successfully","success");

    });

}


/*====================================================
                THEME
====================================================*/

function initializeTheme(){

    const themeSelect=document.querySelectorAll("select")[0];

    if(!themeSelect) return;

    themeSelect.addEventListener("change",(e)=>{

        const theme=e.target.value;

        localStorage.setItem("theme",theme);

        applyTheme(theme);

    });

}


function applyTheme(theme){

    if(theme==="Light"){

        document.body.style.background="#F3F4F6";

        document.body.style.color="#111827";

    }

    else{

        document.body.style.background="#08111F";

        document.body.style.color="#FFFFFF";

    }

}


function loadSavedSettings(){

    const theme=localStorage.getItem("theme");

    if(theme){

        applyTheme(theme);

    }

}


/*====================================================
                TOGGLE SWITCHES
====================================================*/

function initializeToggles(){

    const toggles=document.querySelectorAll(

        '.switch input'

    );

    toggles.forEach(toggle=>{

        toggle.addEventListener("change",

            ()=>{

                const state=

                toggle.checked? "Enabled": "Disabled";

                showToast(

                    state,"info");

            }

        );

    });

}
/*====================================================
                ACCENT COLOR
====================================================*/

function initializeAccentColor(){

    const colorPicker=document.querySelector(

        'input[type="color"]'

    );

    if(!colorPicker) return;

    const savedColor=

    localStorage.getItem("accentColor");

    if(savedColor){

        colorPicker.value=savedColor;

        document.documentElement.style.setProperty("--primary-color",

            savedColor

        );

    }

    colorPicker.addEventListener("input",

        function(){

            const color=this.value;

            document.documentElement.style.setProperty("--primary-color",

                color

            );

            localStorage.setItem("accentColor",

                color

            );

            showToast("Accent Color Updated","success");

        }

    );

}


/*====================================================
                FONT SIZE
====================================================*/

function initializeFontSize(){

    const selects=document.querySelectorAll("select");

    const fontSizeSelect=selects[1];

    if(!fontSizeSelect) return;

    const savedSize=

    localStorage.getItem("fontSize");

    if(savedSize){

        fontSizeSelect.value=savedSize;

        applyFontSize(savedSize);

    }

    fontSizeSelect.addEventListener("change",

        function(){

            applyFontSize(this.value);

            localStorage.setItem("fontSize",

                this.value

            );

            showToast("Font Size Updated","success");

        }

    );

}

function applyFontSize(size){

    switch(size){

        case "Small":

            document.body.style.fontSize="14px";

            break;

        case "Medium":

            document.body.style.fontSize="16px";

            break;

        case "Large":

            document.body.style.fontSize="18px";

            break;

    }

}


/*====================================================
                PROFILE PHOTO
====================================================*/

const profileButton=

document.querySelector(".profile-section button");

if(profileButton){

    profileButton.addEventListener("click",

        ()=>{

            showToast("Profile Photo Upload Coming Soon","info");

        }

    );

}


/*====================================================
                CONNECT BUTTONS
====================================================*/

document.querySelectorAll(".connect-btn").forEach(button=>{

    button.addEventListener("click",

        ()=>{

            if(

                button.textContent.trim()

                ==="Connect"){

                button.textContent="Connected";

                showToast("Account Connected","success");

            }

            else{

                button.textContent="Connect";

                showToast("Account Disconnected","info");

            }

        }

    );

});


/*====================================================
                UPDATE INITIALIZE
====================================================*/

function initializeSettings(){

    loadSavedSettings();

    initializeMenu();

    initializeTheme();

    initializeAccentColor();

    initializeFontSize();

    initializeToggles();

}
/*====================================================
                ACTION BUTTONS
====================================================*/

initializeActionButtons();

function initializeActionButtons(){

    const buttons=document.querySelectorAll(".action-btn");

    buttons.forEach(button=>{

        button.addEventListener("click",()=>{

            const text=button.textContent.trim();

            if(text.includes("Export")){

                exportData();

            }

            else if(text.includes("Resume")){

                downloadResume();

            }

            else if(text.includes("Analytics")){

                downloadAnalytics();

            }

            else if(text.includes("Delete")){

                deleteAccount();

            }

            else if(text.includes("Documentation")){

                showToast("Opening Documentation...","info");

            }

            else if(text.includes("Support")){

                showToast("Redirecting to Support...","info");

            }

            else if(text.includes("Bug")){

                showToast("Bug Report Submitted","success");

            }

        });

    });

}


/*====================================================
                EXPORT DATA
====================================================*/

function exportData(){

    const data={

        name:"Sai Swaroop",

        email:"student@gmail.com",

        college:"NSRIT",

        branch:"CSE (AI & ML)",

        theme:localStorage.getItem("theme") || "Dark",

        accentColor:localStorage.getItem("accentColor") || "#5B5FFB",

        exportedAt:new Date().toLocaleString()

    };

    const blob=new Blob(

        [

            JSON.stringify(data,null,4)

        ],

        {

            type:"application/json"}

    );

    const url=URL.createObjectURL(blob);

    const a=document.createElement("a");

    a.href=url;

    a.download="xtragrad_settings.json";

    a.click();

    URL.revokeObjectURL(url);

    showToast("Settings Exported","success");

}


/*====================================================
                DOWNLOAD RESUME
====================================================*/

function downloadResume(){

    showToast("Resume Download Started","success");

}


/*====================================================
                DOWNLOAD ANALYTICS
====================================================*/

function downloadAnalytics(){

    showToast("Analytics Download Started","success");

}


/*====================================================
                DELETE ACCOUNT
====================================================*/

function deleteAccount(){

    const confirmDelete=confirm("Are you sure you want to delete your account?");

    if(confirmDelete){

        showToast("Account Deleted Successfully","success");

    }

    else{

        showToast("Deletion Cancelled","info");

    }

}


/*====================================================
                LOGOUT
====================================================*/

const logoutButton=document.querySelector(".logout-btn");

if(logoutButton){

    logoutButton.addEventListener("click",

        ()=>{

            const logout=confirm("Do you want to logout?");

            if(logout){

                showToast("Logged Out Successfully","success");

                setTimeout(()=>{

                    window.location.href="login.html";

                },1500);

            }

        }

    );

}
/*====================================================
                TOAST NOTIFICATION
====================================================*/

function showToast(message,type="success"){

    const oldToast=document.querySelector(".toast");

    if(oldToast){

        oldToast.remove();

    }

    const toast=document.createElement("div");

    toast.className="toast";

    toast.innerHTML=`<i class="fa-solid ${
            type==="success"? "fa-circle-check": type==="error"? "fa-circle-xmark": "fa-circle-info"}"></i>
      <span>${message}</span>`;

    toast.style.position="fixed";
    toast.style.top="30px";
    toast.style.right="30px";
    toast.style.padding="16px 22px";
    toast.style.borderRadius="12px";
    toast.style.display="flex";
    toast.style.alignItems="center";
    toast.style.gap="12px";
    toast.style.color="#fff";
    toast.style.fontWeight="600";
    toast.style.zIndex="99999";
    toast.style.animation="slideIn.4s ease";

    if(type==="success"){

        toast.style.background="#22C55E";

    }

    else if(type==="error"){

        toast.style.background="#EF4444";

    }

    else{

        toast.style.background="#3B82F6";

    }

    document.body.appendChild(toast);

    setTimeout(()=>{

        toast.style.opacity="0";

        toast.style.transition=".4s";

        setTimeout(()=>{

            toast.remove();

        },400);

    },3000);

}


/*====================================================
                CARD HOVER EFFECT
====================================================*/

document.querySelectorAll(".settings-card").forEach(card=>{

    card.addEventListener("mouseenter",()=>{

        card.style.transform="translateY(-8px)";

    });

    card.addEventListener("mouseleave",()=>{

        card.style.transform="translateY(0)";

    });

});


/*====================================================
                KEYBOARD SHORTCUTS
====================================================*/

document.addEventListener("keydown",(e)=>{

    if(e.ctrlKey && e.key.toLowerCase()==="s"){

        e.preventDefault();

        showToast("Settings Saved","success");

    }

    if(e.ctrlKey && e.key.toLowerCase()==="l"){

        e.preventDefault();

        localStorage.clear();

        showToast("Local Settings Cleared","info");

    }

});


/*====================================================
                AUTO SAVE INPUTS
====================================================*/

document.querySelectorAll("input,select").forEach((element,index)=>{

    const key=`setting_${index}`;

    const saved=localStorage.getItem(key);

    if(saved!==null){

        if(element.type==="checkbox"){

            element.checked=saved==="true";

        }

        else{

            element.value=saved;

        }

    }

    element.addEventListener("change",()=>{

        if(element.type==="checkbox"){

            localStorage.setItem(key,element.checked);

        }

        else{

            localStorage.setItem(key,element.value);

        }

    });

});


/*====================================================
                PAGE LOAD
====================================================*/

window.addEventListener("load",()=>{

    setTimeout(()=>{

        showToast(" Welcome to XTRAGRAD AI Settings","success");

    },600);

});


/*====================================================
                FUTURE FASTAPI API

fetch("http://127.0.0.1:8000/settings").then(res=>res.json()).then(data=>{

    console.log(data);

});

====================================================*/


/*====================================================
                END OF FILE
====================================================*/