/*=========================================================
                XTRAGRAD AI
                DASHBOARD.JS
                PART 1
=========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    initializeDashboard();

});


/*=========================================================
                INITIALIZE
=========================================================*/

function initializeDashboard(){

    animateCounters();

    initializeCharts();

    initializeSearch();

    initializeDarkMode();

    initializeQuickActions();

}


/*=========================================================
                ANIMATED COUNTERS
=========================================================*/

function animateCounters(){

    animateValue("resumeScore",0,92,2000,"%");

    animateValue("placementScore",0,87,2200,"%");

}

function animateValue(id,start,end,duration,suffix=""){

    const element=document.getElementById(id);

    if(!element) return;

    let startTime=null;

    function animation(currentTime){

        if(!startTime){

            startTime=currentTime;

        }

        const progress=Math.min((currentTime-startTime)/duration,1);

        const value=Math.floor(progress*(end-start)+start);

        element.textContent=value+suffix;

        if(progress<1){

            requestAnimationFrame(animation);

        }

    }

    requestAnimationFrame(animation);

}


/*=========================================================
                CHARTS
=========================================================*/

function initializeCharts(){

    resumeChart();

    codingChart();

    analyticsChart();

}


/*=========================================================
                RESUME CHART
=========================================================*/

function resumeChart(){

    const canvas=document.getElementById("resumeChart");

    if(!canvas) return;

    new Chart(canvas,{

        type:"line",

        data:{

            labels:["Jan","Feb","Mar","Apr","May","Jun"],

            datasets:[{

                label:"Resume Score",

                data:[65,72,76,82,88,92],

                borderColor:"#00D4FF",

                backgroundColor:"rgba(0,212,255,.2)",

                borderWidth:3,

                tension:.4,

                fill:true

            }]

        },

        options:{

            responsive:true,

            plugins:{

                legend:{

                    labels:{

                        color:"#ffffff"}

                }

            },

            scales:{

                x:{

                    ticks:{color:"#cccccc"}

                },

                y:{

                    ticks:{color:"#cccccc"}

                }

            }

        }

    });

}


/*=========================================================
                CODING CHART
=========================================================*/

function codingChart(){

    const canvas=document.getElementById("codingChart");

    if(!canvas) return;

    new Chart(canvas,{

        type:"bar",

        data:{

            labels:["Arrays","DP","Graphs","Trees","Strings"],

            datasets:[{

                label:"Problems Solved",

                data:[40,28,15,34,50],

                backgroundColor:["#5B5FFB","#00D4FF","#7B61FF","#5B5FFB","#00D4FF"]

            }]

        },

        options:{

            responsive:true,

            plugins:{

                legend:{

                    labels:{

                        color:"#ffffff"}

                }

            },

            scales:{

                x:{

                    ticks:{color:"#cccccc"}

                },

                y:{

                    ticks:{color:"#cccccc"}

                }

            }

        }

    });

}
/*=========================================================
                WEEKLY ANALYTICS CHART
=========================================================*/

function analyticsChart(){

    const canvas=document.getElementById("analyticsChart");

    if(!canvas) return;

    new Chart(canvas,{

        type:"doughnut",

        data:{

            labels:["Resume","Coding","Interview","Projects"],

            datasets:[{

                data:[92,85,88,95],

                backgroundColor:["#00D4FF","#5B5FFB","#7B61FF","#2DD4BF"],

                borderWidth:0

            }]

        },

        options:{

            responsive:true,

            cutout:"70%",

            plugins:{

                legend:{

                    position:"bottom",

                    labels:{
                        color:"#ffffff",
                        padding:20
                    }

                }

            }

        }

    });

}


/*=========================================================
                SEARCH
=========================================================*/

function initializeSearch(){

    const input=document.querySelector(".search-box input");

    if(!input) return;

    input.addEventListener("keyup",function(){

        const value=this.value.toLowerCase();

        console.log("Searching:",value);

    });

}


/*=========================================================
                DARK MODE
=========================================================*/

function initializeDarkMode(){

    const button=document.querySelector(".fa-moon");

    if(!button) return;

    button.parentElement.addEventListener("click",()=>{

        document.body.classList.toggle("light-mode");

        if(document.body.classList.contains("light-mode")){

            button.classList.remove("fa-moon");

            button.classList.add("fa-sun");

        }

        else{

            button.classList.remove("fa-sun");

            button.classList.add("fa-moon");

        }

    });

}


/*=========================================================
                QUICK ACTIONS
=========================================================*/

function initializeQuickActions(){

    const buttons=document.querySelectorAll(".quick-actions button");

    buttons.forEach(button=>{

        button.addEventListener("click",()=>{

            const text=button.innerText.trim();

            showToast(text+" Clicked");

        });

    });

}


/*=========================================================
                FLOATING AI ASSISTANT
=========================================================*/

const aiButton=document.querySelector(".ai-assistant button");

if(aiButton){

    aiButton.addEventListener("click",()=>{

        showToast("Opening AI Assistant");

        setTimeout(() => {
            window.location.href = "./assistant.html";
        }, 1500);

    });

}


/*=========================================================
                NOTIFICATION BUTTON
=========================================================*/

const bell=document.querySelector(".fa-bell");

if(bell){

    bell.parentElement.addEventListener("click",()=>{

        showToast("You have 5 new notifications.");

    });

}


/*=========================================================
                TOAST MESSAGE
=========================================================*/

function showToast(message){

    let toast=document.createElement("div");

    toast.className="dashboard-toast";

    toast.innerHTML=`<i class="fa-solid fa-circle-check"></i>

      <span>${message}</span>`;

    document.body.appendChild(toast);

    setTimeout(()=>{

        toast.classList.add("show");

    },100);

    setTimeout(()=>{

        toast.classList.remove("show");

        setTimeout(()=>{

            toast.remove();

        },500);

    },3000);

}
/*=========================================================
                DASHBOARD.JS
                PART 3
=========================================================*/


/*=========================================================
                CARD ANIMATION
=========================================================*/

function animateCards(){

    const cards=document.querySelectorAll(".dashboard-card,.card");

    const observer=new IntersectionObserver((entries)=>{

        entries.forEach(entry=>{

            if(entry.isIntersecting){

                entry.target.style.opacity="1";

                entry.target.style.transform="translateY(0)";

            }

        });

    },{

        threshold:.2

    });

    cards.forEach(card=>{

        card.style.opacity="0";

        card.style.transform="translateY(40px)";

        card.style.transition=".7s";

        observer.observe(card);

    });

}

animateCards();


/*=========================================================
                LIVE CLOCK
=========================================================*/

function liveClock(){

    const clock=document.createElement("div");

    clock.className="live-clock";

    document.querySelector(".topbar").appendChild(clock);

    setInterval(()=>{

        const now=new Date();

        clock.innerHTML=now.toLocaleTimeString();

    },1000);

}

liveClock();


/*=========================================================
                SAVE THEME
=========================================================*/

if(localStorage.getItem("theme")=="light"){

    document.body.classList.add("light-mode");

}

document.addEventListener("click",(e)=>{

    if(e.target.classList.contains("fa-sun")){

        localStorage.setItem("theme","light");

    }

    if(e.target.classList.contains("fa-moon")){

        localStorage.setItem("theme","dark");

    }

});


/*=========================================================
                PROFILE MENU
=========================================================*/

const profile=document.querySelector(".profile");

if(profile){

    profile.addEventListener("click",()=>{

        showToast("Profile Page Coming Soon");

    });

}


/*=========================================================
                JOB APPLY BUTTONS
=========================================================*/

document.querySelectorAll(".job-item button").forEach(button=>{

    button.addEventListener("click",()=>{

        button.innerHTML="Applied";

        button.style.background="#16a34a";

        showToast("Application Submitted Successfully");

    });

});


/*=========================================================
                AI RECOMMENDATION CLICK
=========================================================*/

document.querySelectorAll(".recommend-item").forEach(item=>{

    item.addEventListener("click",()=>{

        showToast("Opening AI Recommendation");

    });

});


/*=========================================================
                BADGES
=========================================================*/

document.querySelectorAll(".badge-card").forEach(card=>{

    card.addEventListener("click",()=>{

        showToast("Achievement Details");

    });

});


/*=========================================================
                NOTIFICATION AUTO UPDATE
=========================================================*/

setInterval(()=>{

    const badge=document.querySelector(".badge");

    if(!badge) return;

    let count=parseInt(badge.innerHTML);

    count++;

    if(count>9){

        count=1;

    }

    badge.innerHTML=count;

},30000);


/*=========================================================
                LOGOUT
=========================================================*/

const logout=document.querySelector(".menu li:last-child a");

if(logout){

    logout.addEventListener("click",(e)=>{

        e.preventDefault();

        if(confirm("Are you sure you want to logout?")){

            localStorage.clear();

            window.location.href="./role-login.html";

        }

    });

}


/*=========================================================
                WELCOME MESSAGE
=========================================================*/

setTimeout(()=>{

    showToast("Welcome to XTRAGRAD AI ");

},1200);


/*=========================================================
                CONSOLE
=========================================================*/

console.log(" XTRAGRAD AI Dashboard Loaded Successfully");