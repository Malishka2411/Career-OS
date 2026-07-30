/*=========================================================
                LIVE SEARCH
=========================================================*/

const searchInput = document.getElementById("serviceSearch");

searchInput.addEventListener("keyup", function () {

    const value = this.value.toLowerCase();

    const cards = document.querySelectorAll(".service-card");

    cards.forEach(card => {

        const text = card.innerText.toLowerCase();

        if (text.includes(value)) {

            card.style.display = "block";

        } else {

            card.style.display = "none";

        }

    });

});

/*=========================================================
                COUNT ANIMATION
=========================================================*/

function animateCounter(id, target) {

    const element = document.getElementById(id);

    let count = 0;

    const increment = Math.ceil(target / 100);

    const timer = setInterval(() => {

        count += increment;

        if (count >= target) {

            count = target;

            clearInterval(timer);

        }

        element.innerText = count.toLocaleString();

    }, 20);

}

animateCounter("totalRequests", 15842);
animateCounter("successfulRequests", 15326);
animateCounter("failedRequests", 516);

/*=========================================================
            HEALTH BAR ANIMATION
=========================================================*/

window.addEventListener("load", () => {

    const progress = document.querySelector(".progress-fill");

    progress.style.width = "0%";

    setTimeout(() => {

        progress.style.transition = "1.5s";

        progress.style.width = "96%";

    }, 300);

});

/*=========================================================
                TOAST MESSAGE
=========================================================*/

function showToast(message) {

    const toast = document.createElement("div");

    toast.className = "toast";

    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i>
      ${message}`;

    toast.style.position = "fixed";
    toast.style.top = "30px";
    toast.style.right = "30px";
    toast.style.background = "#10B981";
    toast.style.color = "#fff";
    toast.style.padding = "15px 22px";
    toast.style.borderRadius = "10px";
    toast.style.fontWeight = "600";
    toast.style.zIndex = "9999";

    document.body.appendChild(toast);

    setTimeout(() => {

        toast.remove();

    }, 2500);

}

showToast("AI Monitoring Dashboard Loaded");
/*=========================================================
                RESTART AI
=========================================================*/

const restartBtn = document.querySelector(".restart-btn");

restartBtn.addEventListener("click", () => {

    showToast("Restarting AI Services...");

    restartBtn.disabled = true;
    restartBtn.innerHTML =`<i class="fa-solid fa-spinner fa-spin"></i> Restarting`;

    setTimeout(() => {

        restartBtn.disabled = false;
        restartBtn.innerHTML =`<i class="fa-solid fa-rotate"></i> Restart AI`;

        showToast("All AI Services Restarted Successfully");

    },3000);

});


/*=========================================================
                REFRESH DASHBOARD
=========================================================*/

const refreshBtn = document.querySelector(".refresh-btn");

refreshBtn.addEventListener("click",()=>{

    location.reload();

});


/*=========================================================
                EXPORT LOGS
=========================================================*/

const exportBtn = document.querySelector(".logs-btn");

exportBtn.addEventListener("click",()=>{

    const logs = `
Time,Student,Service,Status
10:15,Sai Swaroop,Resume Analyzer,Success
10:22,Rahul,Career Chatbot,Success
10:40,Kiran,Interview AI,Failed
`;

    const blob = new Blob([logs],{

        type:"text/csv"});

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "AI_Logs.csv";

    a.click();

    URL.revokeObjectURL(url);

    showToast("AI Logs Exported");

});


/*=========================================================
                PAUSE AI
=========================================================*/

const pauseBtn = document.querySelector(".pause-ai");

pauseBtn.addEventListener("click",()=>{

    document.querySelectorAll(".online").forEach(status=>{

        status.innerHTML="Paused";
        status.style.color="#FBBF24";

    });

    showToast("AI Services Paused");

});


/*=========================================================
                RESUME AI
=========================================================*/

const resumeBtn=document.querySelector(".resume-ai");

resumeBtn.addEventListener("click",()=>{

    document.querySelectorAll(".online").forEach(status=>{

        status.innerHTML="Online";
        status.style.color="#34D399";

    });

    showToast("AI Services Resumed");

});


/*=========================================================
                CLEAR CACHE
=========================================================*/

const clearCacheBtn=document.querySelector(".clear-cache");

clearCacheBtn.addEventListener("click",()=>{

    showToast("AI Cache Cleared Successfully");

});


/*=========================================================
            SERVICE CARD CLICK
=========================================================*/

document.querySelectorAll(".service-card").forEach(card=>{

    card.addEventListener("click",()=>{

        document.getElementById("serviceTitle").innerText=
        card.querySelector("h3").innerText;

        document.getElementById("serviceStatus").innerText=
        card.querySelector("span").innerText;

        document.getElementById("serviceModal").style.display="flex";

    });

});
/*=========================================================
                CLOSE MODAL
=========================================================*/

const modal = document.getElementById("serviceModal");
const closeModal = document.querySelector(".close-modal");

closeModal.addEventListener("click", () => {

    modal.style.display = "none";

});

window.addEventListener("click", (e) => {

    if (e.target === modal) {

        modal.style.display = "none";

    }

});

document.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {

        modal.style.display = "none";

    }

});


/*=========================================================
            LIVE PERFORMANCE UPDATE
=========================================================*/

function updatePerformance() {

    const cards = document.querySelectorAll(".performance-grid p");

    cards[0].innerText = Math.floor(Math.random() * 30 + 30) + "%";

    cards[1].innerText = Math.floor(Math.random() * 30 + 50) + "%";

    cards[2].innerText = Math.floor(Math.random() * 30 + 40) + "%";

    cards[3].innerText = Math.random() > 0.1? "Stable": "Slow";

}

setInterval(updatePerformance, 5000);


/*=========================================================
            LIVE REQUEST COUNTERS
=========================================================*/

function updateStatistics() {

    const total =
        document.getElementById("totalRequests");

    const success =
        document.getElementById("successfulRequests");

    const failed =
        document.getElementById("failedRequests");

    total.innerText =
        (parseInt(total.innerText.replace(/,/g, "")) + Math.floor(Math.random() * 5)).toLocaleString();

    success.innerText =
        (parseInt(success.innerText.replace(/,/g, "")) + Math.floor(Math.random() * 4)).toLocaleString();

    failed.innerText =
        (parseInt(failed.innerText.replace(/,/g, "")) + Math.floor(Math.random() * 2)).toLocaleString();

}

setInterval(updateStatistics, 4000);


/*=========================================================
            AI HEALTH UPDATE
=========================================================*/

function updateHealth() {

    const score =
        Math.floor(Math.random() * 6) + 94;

    document.querySelector(".health-score h1").innerText =
        score + "%";

    document.querySelector(".progress-fill").style.width =
        score + "%";

}

setInterval(updateHealth, 7000);


/*=========================================================
            RANDOM ERROR SIMULATION
=========================================================*/

const errors = ["API Timeout","Model Busy","Rate Limit Exceeded","GPU Overloaded","Connection Lost"];

function generateError() {

    const cards =
        document.querySelectorAll(".error-card");

    const random =
        errors[Math.floor(Math.random() * errors.length)];

    cards[0].querySelector("p").innerText =
        random + " - " + new Date().toLocaleTimeString();

}

setInterval(generateError, 12000);


/*=========================================================
            AI STATUS CHECK
=========================================================*/

function updateStatus() {

    document.querySelectorAll(".service-card span").forEach(status => {

        const value = Math.random();

        if (value > 0.8) {

            status.className = "busy";
            status.innerHTML = "Busy";

        }

        else if (value < 0.1) {

            status.className = "offline";
            status.innerHTML = "Offline";

        }

        else {

            status.className = "online";
            status.innerHTML = "Online";

        }

    });

}

setInterval(updateStatus, 8000);
/*=========================================================
            ACTIVITY LOG AUTO UPDATE
=========================================================*/

const students = ["Sai Swaroop","Rahul","Priya","Kiran","Anjali","Arjun","Sneha"
];

const services = ["Resume Analyzer","Career Chatbot","Placement Prediction","Interview AI","Company Recommendation"
];

function addActivityLog() {

    const tbody = document.querySelector("#activityTable tbody");

    const row = document.createElement("tr");

    const student =
        students[Math.floor(Math.random() * students.length)];

    const service =
        services[Math.floor(Math.random() * services.length)];

    const success = Math.random() > 0.15;

    row.innerHTML = `<td>${new Date().toLocaleTimeString()}</td>
      <td>${student}</td>
      <td>${service}</td>
      <td>AI Request</td>
      <td>
          <span class="${success? "success": "failed"}">
              ${success? "Success": "Failed"}
            </span>
      </td>
      <td>${(Math.random() * 2 + 0.5).toFixed(1)} s</td>`;

    tbody.prepend(row);

    if (tbody.rows.length > 10) {

        tbody.deleteRow(10);

    }

}

setInterval(addActivityLog, 10000);


/*=========================================================
            PREMIUM TOAST
=========================================================*/

function premiumToast(message, color = "#10B981") {

    const toast = document.createElement("div");

    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i>
      <span>${message}</span>`;

    toast.style.position = "fixed";
    toast.style.top = "25px";
    toast.style.right = "25px";
    toast.style.background = color;
    toast.style.color = "#fff";
    toast.style.padding = "15px 22px";
    toast.style.borderRadius = "12px";
    toast.style.display = "flex";
    toast.style.alignItems = "center";
    toast.style.gap = "10px";
    toast.style.fontWeight = "600";
    toast.style.boxShadow = "0 15px 30px rgba(0,0,0,.30)";
    toast.style.zIndex = "99999";
    toast.style.opacity = "0";
    toast.style.transition = ".3s";

    document.body.appendChild(toast);

    setTimeout(() => {

        toast.style.opacity = "1";

    }, 100);

    setTimeout(() => {

        toast.style.opacity = "0";

        setTimeout(() => {

            toast.remove();

        }, 300);

    }, 2500);

}

/* Replace old toast function */
showToast = premiumToast;


/*=========================================================
            KEYBOARD SHORTCUTS
=========================================================*/

document.addEventListener("keydown", (e) => {

    if (e.ctrlKey && e.key.toLowerCase() === "f") {

        e.preventDefault();

        document.getElementById("serviceSearch").focus();

    }

    if (e.ctrlKey && e.key.toLowerCase() === "r") {

        e.preventDefault();

        location.reload();

    }

});


/*=========================================================
            AUTO REFRESH DASHBOARD
=========================================================*/

setInterval(() => {

    updatePerformance();
    updateStatistics();
    updateHealth();

}, 30000);


/*=========================================================
            INITIALIZE DASHBOARD
=========================================================*/

window.addEventListener("load", () => {

    premiumToast("AI Monitoring Dashboard Loaded Successfully");

    updatePerformance();
    updateStatistics();
    updateHealth();

});


/*=========================================================
            CONSOLE MESSAGE
=========================================================*/

console.log(`
===========================================
       Career OS AI MONITORING SYSTEM
===========================================
 Live Search
 Animated Counters
 AI Health Monitor
 Restart AI
 Pause / Resume AI
 Export AI Logs
 Service Details Modal
 Live Performance Monitor
 Random Error Simulation
 Auto Activity Logs
 Keyboard Shortcuts
 Auto Refresh
===========================================
`);