/*=========================================================
                XTRAGRAD AI
                LEARNING.JS
=========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    initializeLearningRoadmap();

});


/*=========================================================
                INITIALIZE
=========================================================*/

function initializeLearningRoadmap(){

    initializeGenerateButton();

    initializeMilestones();

    loadRoadmapData();

}


/*=========================================================
                GENERATE ROADMAP
=========================================================*/

function initializeGenerateButton(){

    const generateBtn=document.querySelector(".generate-btn");

    if(generateBtn){

        generateBtn.addEventListener("click",

            generateRoadmap

        );

    }

}


function generateRoadmap(){

    const career=document.getElementById("careerGoal").value;

    const level=document.getElementById("currentLevel").value;

    const duration=document.getElementById("duration").value;

    if(career===""){

        showNotification("Please select a Career Goal","error");

        return;

    }

    showNotification("AI Roadmap Generated Successfully","success");

    updateTimeline(career,level,duration);

}


/*=========================================================
                UPDATE TIMELINE
=========================================================*/

function updateTimeline(career,level,duration){

    const heading=document.querySelector(".section-header h2");

    if(heading){

        heading.innerHTML=`<i class="fa-solid fa-map-location-dot"></i>

          ${career} Learning Roadmap`;

    }

    console.log("Career:",career,"Level:",level,"Duration:",duration

    );

}
/*=========================================================
                SAVE ROADMAP
=========================================================*/

function saveRoadmap(){

    const roadmap={

        career:document.getElementById("careerGoal").value,

        level:document.getElementById("currentLevel").value,

        duration:document.getElementById("duration").value,

        studyHours:document.getElementById("studyHours").value,

        skills:document.getElementById("skills").value,

        progress:getCurrentProgress()

    };

    localStorage.setItem("learningRoadmap",

        JSON.stringify(roadmap)

    );

    showNotification("Roadmap Saved Successfully","success");

}


/*=========================================================
                LOAD ROADMAP
=========================================================*/

function loadRoadmapData(){

    const data=localStorage.getItem("learningRoadmap");

    if(!data) return;

    const roadmap=JSON.parse(data);

    document.getElementById("careerGoal").value=

        roadmap.career || "";

    document.getElementById("currentLevel").value=

        roadmap.level || "Beginner";

    document.getElementById("duration").value=

        roadmap.duration || "6 Months";

    document.getElementById("studyHours").value=

        roadmap.studyHours || "";

    document.getElementById("skills").value=

        roadmap.skills || "";

}


/*=========================================================
                PROGRESS TRACKER
=========================================================*/

function getCurrentProgress(){

    const completed=document.querySelectorAll(".milestone-card.completed").length;

    const total=document.querySelectorAll(".milestone-card").length;

    return Math.round(

        (completed/total)*100

    );

}


function updateProgress(){

    const progress=getCurrentProgress();

    const value=document.querySelector(".progress-value");

    if(value){

        value.textContent=progress+"%";

    }

    const circle=document.querySelector(".progress-circle");

    if(circle){

        circle.style.background=`conic-gradient(

                #5B5FFB ${progress}%,

                rgba(255,255,255,.08) ${progress}%

            )`;

    }

}


/*=========================================================
                MILESTONES
=========================================================*/

function initializeMilestones(){

    const cards=document.querySelectorAll(".milestone-card");

    cards.forEach(card=>{

        card.addEventListener("click",()=>{

            card.classList.toggle("completed");

            updateProgress();

            saveRoadmap();

        });

    });

}
/*=========================================================
                EXPORT ROADMAP
=========================================================*/

function exportRoadmap(){

    const roadmap=localStorage.getItem("learningRoadmap");

    if(!roadmap){

        showNotification("Generate a roadmap before exporting.","error");

        return;

    }

    const blob=new Blob(

        [roadmap],

        {

            type:"application/json"}

    );

    const url=URL.createObjectURL(blob);

    const link=document.createElement("a");

    link.href=url;

    link.download="learning-roadmap.json";

    link.click();

    URL.revokeObjectURL(url);

}


/*=========================================================
                RESET ROADMAP
=========================================================*/

function resetRoadmap(){

    localStorage.removeItem("learningRoadmap");

    document.getElementById("roadmapForm").reset();

    updateProgress();

    showNotification("Roadmap Reset Successfully","success");

}


/*=========================================================
                AI RECOMMENDATIONS
=========================================================*/

function updateRecommendations(){

    const recommendations=document.querySelector(".recommendation-list");

    if(!recommendations) return;

    const hours=parseInt(

        document.getElementById("studyHours").value

    ) || 0;

    let html="";

    if(hours<10){

        html+=`<li>

           Increase study time to at least 10 hours/week.

        </li>`;

    }

    html+=`<li>

           Build one AI project every month.

        </li>

      <li>

           Solve at least 5 coding problems daily.

        </li>

      <li>

           Keep updating your resume and portfolio.

        </li>`;

    recommendations.innerHTML=html;

}


/*=========================================================
                NOTIFICATIONS
=========================================================*/

function showNotification(message,type){

    const toast=document.createElement("div");

    toast.className=`toast ${type}`;

    toast.innerHTML=`<span>${message}</span>`;

    document.body.appendChild(toast);

    setTimeout(()=>{

        toast.classList.add("show");

    },100);

    setTimeout(()=>{

        toast.classList.remove("show");

        setTimeout(()=>{

            toast.remove();

        },300);

    },3000);

}


/*=========================================================
                BUTTON EVENTS
=========================================================*/

document.querySelectorAll(".secondary-btn").forEach(button=>{

    if(

        button.textContent.includes("Export")

    ){

        button.addEventListener("click",

            exportRoadmap

        );

    }

});


const generateAgain=document.querySelector(".primary-btn");

if(generateAgain){

    generateAgain.addEventListener("click",

        generateRoadmap

    );

}


/*=========================================================
                PAGE LOAD
=========================================================*/

window.addEventListener("load",()=>{

    updateProgress();

    updateRecommendations();

    console.log(" Learning Roadmap Loaded Successfully");

});