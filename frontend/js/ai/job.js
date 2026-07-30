/*=====================================================
            Career OS AI JOB RECOMMENDATIONS
=====================================================*/

document.addEventListener("DOMContentLoaded", () => {

    initializeJobs();

});


/*=====================================================
            GLOBAL VARIABLES
=====================================================*/

const jobCards = document.querySelectorAll(".job-card");

const searchInput = document.getElementById("jobSearch");

const companyFilter = document.getElementById("companyFilter");

const locationFilter = document.getElementById("locationFilter");

const experienceFilter = document.getElementById("experienceFilter");

const salaryFilter = document.getElementById("salaryFilter");

const skillsFilter = document.getElementById("skillsFilter");


/*=====================================================
            INITIALIZE
=====================================================*/

function initializeJobs(){

    setupFilters();

    setupButtons();

}


/*=====================================================
            FILTER EVENTS
=====================================================*/

function setupFilters(){

    searchInput.addEventListener("keyup",filterJobs);

    companyFilter.addEventListener("change",filterJobs);

    locationFilter.addEventListener("change",filterJobs);

    experienceFilter.addEventListener("change",filterJobs);

    salaryFilter.addEventListener("change",filterJobs);

    skillsFilter.addEventListener("keyup",filterJobs);

}


/*=====================================================
            FILTER JOBS
=====================================================*/

function filterJobs(){

    const search = searchInput.value.toLowerCase();

    const company = companyFilter.value.toLowerCase();

    const location = locationFilter.value.toLowerCase();

    const skill = skillsFilter.value.toLowerCase();

    jobCards.forEach(card=>{

        const text = card.innerText.toLowerCase();

        const matchSearch = text.includes(search);

        const matchCompany =

            company==="all companies"|| text.includes(company);

        const matchLocation =

            location==="anywhere"|| text.includes(location);

        const matchSkill =

            skill===""|| text.includes(skill);

        if(

            matchSearch

            && matchCompany

            && matchLocation

            && matchSkill

        ){

            card.style.display="block";

        }

        else{

            card.style.display="none";

        }

    });

}


/*=====================================================
            BUTTON EVENTS
=====================================================*/

function setupButtons(){

    document.querySelector(".ai-match-btn").addEventListener("click",

        generateMatches

    );

    document.querySelector(".clear-filter-btn").addEventListener("click",

        clearFilters

    );

}
/*=====================================================
            AI MATCH SIMULATION
=====================================================*/

function generateMatches(){

    showToast("AI is analyzing your profile...","info");

    setTimeout(()=>{

        document.getElementById("matchScore").textContent="96%";

        document.getElementById("jobsFound").textContent="168";

        document.getElementById("companies").textContent="48";

        document.getElementById("salaryRange").textContent="₹22 LPA";

        showToast("AI Recommendations Updated","success");

    },2000);

}


/*=====================================================
            CLEAR FILTERS
=====================================================*/

function clearFilters(){

    searchInput.value="";

    companyFilter.selectedIndex=0;

    locationFilter.selectedIndex=0;

    experienceFilter.selectedIndex=0;

    salaryFilter.selectedIndex=0;

    skillsFilter.value="";

    filterJobs();

    showToast("Filters Cleared","success");

}


/*=====================================================
            VIEW DETAILS
=====================================================*/

document.querySelectorAll(".details-btn").forEach(button=>{

    button.addEventListener("click",

        function(){

            const card=this.closest(".job-card");

            const title=

                card.querySelector(".job-info h3").textContent;

            const company=

                card.querySelector(".job-info p").textContent;

            const match=

                card.querySelector(".match-badge").textContent;

            alert(`${title}

Company: ${company}

AI Match: ${match}

This page will later open a complete Job Details page powered by FastAPI.`);

        }

    );

});


/*=====================================================
            APPLY BUTTON
=====================================================*/

document.querySelectorAll(".apply-btn").forEach(button=>{

    button.addEventListener("click",

        ()=>{

            showToast("Application Submitted Successfully (Demo)","success");

        }

    );

});


/*=====================================================
            SAVE FAVORITES
=====================================================*/

document.querySelectorAll(".job-card").forEach(card=>{

    card.addEventListener("dblclick",

        ()=>{

            card.classList.toggle("favorite");

            if(card.classList.contains("favorite")){

                card.style.borderColor="#FFD700";

                showToast("⭐ Added to Favorites","success");

            }

            else{

                card.style.borderColor="rgba(255,255,255,.08)";

                showToast("Removed from Favorites","info");

            }

        }

    );

});
/*=====================================================
            DOWNLOAD CAREER REPORT
=====================================================*/

document.querySelector(".download-btn").addEventListener("click",

    ()=>{

        const report=`=========================================

        Career OS AI CAREER REPORT

=========================================

Matching Jobs:

${document.getElementById("jobsFound").textContent}

Best Match:

${document.getElementById("matchScore").textContent}

Companies:

${document.getElementById("companies").textContent}

Average Salary:

${document.getElementById("salaryRange").textContent}

Generated By:

Career OS AI Career Assistant`;

        const blob=new Blob(

            [report],

            {

                type:"text/plain"}

        );

        const url=URL.createObjectURL(blob);

        const a=document.createElement("a");

        a.href=url;

        a.download="Career_Report.txt";

        a.click();

        URL.revokeObjectURL(url);

        showToast("Career Report Downloaded","success");

    }

);


/*=====================================================
            REFRESH RECOMMENDATIONS
=====================================================*/

document.querySelector(".refresh-btn").addEventListener("click",

    ()=>{

        showToast("Refreshing AI Recommendations...","info");

        setTimeout(()=>{

            location.reload();

        },1500);

    }

);


/*=====================================================
            BACK TO DASHBOARD
=====================================================*/

document.querySelector(".dashboard-btn").addEventListener("click",

    ()=>{

        window.location.href="student-dashboard.html";

    }

);


/*=====================================================
            SAVE RECOMMENDATION HISTORY
=====================================================*/

function saveHistory(){

    const history={

        jobs:document.getElementById("jobsFound").textContent,

        match:document.getElementById("matchScore").textContent,

        companies:document.getElementById("companies").textContent,

        salary:document.getElementById("salaryRange").textContent,

        date:new Date().toLocaleString()

    };

    localStorage.setItem("Career OSCareerHistory",

        JSON.stringify(history)

    );

}

saveHistory();


/*=====================================================
            TOAST NOTIFICATION
=====================================================*/

function showToast(message,type){

    const toast=document.createElement("div");

    toast.innerHTML=message;

    toast.style.position="fixed";

    toast.style.top="20px";

    toast.style.right="20px";

    toast.style.padding="15px 22px";

    toast.style.borderRadius="12px";

    toast.style.color="#ffffff";

    toast.style.fontWeight="600";

    toast.style.zIndex="9999";

    toast.style.boxShadow="0 12px 25px rgba(0,0,0,.3)";

    if(type==="success"){

        toast.style.background="#16A34A";

    }

    else if(type==="error"){

        toast.style.background="#DC2626";

    }

    else{

        toast.style.background="#2563EB";

    }

    document.body.appendChild(toast);

    setTimeout(()=>{

        toast.remove();

    },3000);

}


/*=====================================================
            PAGE LOAD
=====================================================*/

window.addEventListener("load",

    ()=>{

        console.log("Career OS  AI Job Recommendation Module Loaded");

        showToast("Welcome to AI Job Recommendations","success");

    }

);