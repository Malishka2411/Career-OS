/*==================================================
            XTRAGRAD AI ROLE LOGIN
==================================================*/

document.addEventListener("DOMContentLoaded", () => {

    initializePasswordToggle();

    initializeStudentLogin();

    initializeAdminLogin();

});


/*==================================================
            PASSWORD SHOW / HIDE
==================================================*/

function initializePasswordToggle(){

    const toggles=document.querySelectorAll(".toggle-password");

    toggles.forEach(toggle=>{

        toggle.addEventListener("click",()=>{

            const input=toggle.previousElementSibling;

            if(input.type==="password"){

                input.type="text";

                toggle.classList.remove("fa-eye");

                toggle.classList.add("fa-eye-slash");

            }

            else{

                input.type="password";

                toggle.classList.remove("fa-eye-slash");

                toggle.classList.add("fa-eye");

            }

        });

    });

}


/*==================================================
            STUDENT LOGIN
==================================================*/

function initializeStudentLogin(){

    const form=document.getElementById("studentLoginForm");

    if(!form) return;

    form.addEventListener("submit",(e)=>{

        e.preventDefault();

        const email=document.getElementById("studentEmail").value.trim();

        const password=document.getElementById("studentPassword").value.trim();

        if(email==="" || password===""){

            showToast("Please enter email and password","error");

            return;

        }

        showToast("Student Login Successful","success");

        setTimeout(()=>{

            window.location.href="./student-dashboard.html";

        },1200);

    });

}


/*==================================================
            ADMIN LOGIN
==================================================*/

function initializeAdminLogin(){

    const form=document.getElementById("adminLoginForm");

    if(!form) return;

    form.addEventListener("submit",(e)=>{

        e.preventDefault();

        const email=document.getElementById("adminEmail").value.trim();

        const password=document.getElementById("adminPassword").value.trim();

        if(email==="" || password===""){

            showToast("Please enter admin credentials","error");

            return;

        }

        showToast("Admin Login Successful","success");

        setTimeout(()=>{

            window.location.href="./admin-dashboard.html";

        },1200);

    });

}


/*==================================================
            TOAST NOTIFICATION
==================================================*/

function showToast(message,type){

    const old=document.querySelector(".toast");

    if(old){

        old.remove();

    }

    const toast=document.createElement("div");

    toast.className="toast";

    let bg="#22C55E";

    let icon="fa-circle-check";

    if(type==="error"){

        bg="#EF4444";

        icon="fa-circle-xmark";

    }

    toast.innerHTML=`<i class="fa-solid ${icon}"></i>

      <span>${message}</span>`;

    toast.style.position="fixed";

    toast.style.top="25px";

    toast.style.right="25px";

    toast.style.padding="16px 24px";

    toast.style.background=bg;

    toast.style.color="#fff";

    toast.style.borderRadius="14px";

    toast.style.display="flex";

    toast.style.alignItems="center";

    toast.style.gap="12px";

    toast.style.fontWeight="600";

    toast.style.boxShadow="0 15px 40px rgba(0,0,0,.25)";

    toast.style.zIndex="99999";

    document.body.appendChild(toast);

    setTimeout(()=>{

        toast.style.opacity="0";

        toast.style.transition=".4s";

        setTimeout(()=>{

            toast.remove();

        },400);

    },2500);

}


/*==================================================
            ENTER KEY SUPPORT
==================================================*/

document.addEventListener("keydown",(e)=>{

    if(e.key==="Enter"){

        const active=document.activeElement;

        if(

            active.closest("#studentLoginForm")

        ){

            document.querySelector(".student-btn").click();

        }

        if(

            active.closest("#adminLoginForm")

        ){

            document.querySelector(".admin-btn").click();

        }

    }

});


/*==================================================
            FUTURE FASTAPI LOGIN

fetch("http://localhost:8000/api/login",{

    method:"POST",

    headers:{"Content-Type":"application/json"},

    body:JSON.stringify({

        email,

        password

    })

});

==================================================*/
