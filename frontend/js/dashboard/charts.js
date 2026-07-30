/*====================================================
                AI ANALYTICS DASHBOARD
====================================================*/

document.addEventListener("DOMContentLoaded", () => {

    initializeDashboard();

});

/*====================================================
                INITIALIZE
====================================================*/

function initializeDashboard(){

    animateCounters();

    createProgressChart();

    createCodingChart();

}

/*====================================================
                KPI COUNTER ANIMATION
====================================================*/

function animateCounter(id,target){

    const element=document.getElementById(id);

    let current=0;

    const timer=setInterval(()=>{

        current++;

        element.textContent=current+"%";

        if(current>=target){

            clearInterval(timer);

        }

    },20);

}

function animateCounters(){

    animateCounter("resumeScore",92);

    animateCounter("codingScore",84);

    animateCounter("interviewScore",88);

    animateCounter("jobMatch",96);

}

/*====================================================
                WEEKLY PROGRESS CHART
====================================================*/

function createProgressChart(){

    const ctx=document.getElementById("progressChart");

    new Chart(ctx,{

        type:"line",

        data:{

            labels:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],

            datasets:[{

                label:"Learning Progress",

                data:[
                    20,
                    35,
                    45,
                    60,
                    70,
                    82,
                    90
                ],

                borderColor:"#00D4FF",

                backgroundColor:"rgba(0,212,255,.15)",

                fill:true,

                tension:.4

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            plugins:{

                legend:{

                    labels:{

                        color:"#ffffff"}

                }

            },

            scales:{

                x:{

                    ticks:{

                        color:"#A5B4D4"}

                },

                y:{

                    beginAtZero:true,

                    ticks:{

                        color:"#A5B4D4"}

                }

            }

        }

    });

}

/*====================================================
                CODING ACTIVITY CHART
====================================================*/

function createCodingChart(){

    const ctx=document.getElementById("codingChart");

    new Chart(ctx,{

        type:"bar",

        data:{

            labels:["Easy","Medium","Hard"],

            datasets:[{

                label:"Problems Solved",

                data:[
                    140,
                    95,
                    28
                ],

                backgroundColor:["#22C55E","#FACC15","#EF4444"]

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            plugins:{

                legend:{

                    labels:{

                        color:"#ffffff"}

                }

            },

            scales:{

                x:{

                    ticks:{

                        color:"#A5B4D4"}

                },

                y:{

                    beginAtZero:true,

                    ticks:{

                        color:"#A5B4D4"}

                }

            }

        }

    });

}
/*====================================================
                SKILL RADAR CHART
====================================================*/

function createSkillRadarChart(){

    const ctx=document.getElementById("skillRadarChart");

    new Chart(ctx,{

        type:"radar",

        data:{

            labels:["Python","Java","DSA","AI/ML","Web Dev","SQL"],

            datasets:[{

                label:"Skill Level",

                data:[

                    95,
                    75,
                    82,
                    92,
                    88,
                    70

                ],

                backgroundColor:"rgba(91,95,251,0.2)",

                borderColor:"#5B5FFB",

                borderWidth:2,

                pointBackgroundColor:"#00D4FF",

                pointRadius:4

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            plugins:{

                legend:{

                    labels:{

                        color:"#ffffff"}

                }

            },

            scales:{

                r:{

                    min:0,

                    max:100,

                    ticks:{

                        color:"#A5B4D4",

                        backdropColor:"transparent"},

                    grid:{

                        color:"rgba(255,255,255,.15)"},

                    angleLines:{

                        color:"rgba(255,255,255,.15)"},

                    pointLabels:{

                        color:"#ffffff"}

                }

            }

        }

    });

}


/*====================================================
            TECHNOLOGY PIE CHART
====================================================*/

function createTechnologyChart(){

    const ctx=document.getElementById("technologyChart");

    new Chart(ctx,{

        type:"doughnut",

        data:{

            labels:["Python","JavaScript","FastAPI","Machine Learning","React"],

            datasets:[{

                data:[

                    35,
                    20,
                    15,
                    20,
                    10

                ],

                backgroundColor:["#5B5FFB","#00D4FF","#22C55E","#FACC15","#EF4444"],

                borderWidth:2,

                borderColor:"#08111F"}]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

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


/*====================================================
        PROGRESS BAR ANIMATION
====================================================*/

function animateProgressBars(){

    const bars=document.querySelectorAll(".progress-fill");

    bars.forEach(bar=>{

        const width=bar.style.width;

        bar.style.width="0%";

        setTimeout(()=>{

            bar.style.transition="width 1.5s ease";

            bar.style.width=width;

        },300);

    });

}


/*====================================================
        UPDATE INITIALIZE
====================================================*/

function initializeDashboard(){

    animateCounters();

    createProgressChart();

    createCodingChart();

    createSkillRadarChart();

    createTechnologyChart();

    animateProgressBars();

}
/*====================================================
                DOWNLOAD REPORT
====================================================*/

const downloadReportBtn =
document.getElementById("downloadReport");

if(downloadReportBtn){

    downloadReportBtn.addEventListener("click",

        downloadAnalyticsReport

    );

}

function downloadAnalyticsReport(){

    const report=`===============================
        Career OS AI REPORT
===============================

Resume Score: 92%

Coding Score: 84%

Interview Score: 88%

Job Match: 96%

Career Readiness: 82%

ATS Score: 91%

AI Skill Score: 89%

--------------------------------

Top Skills

• Python
• Generative AI
• FastAPI
• JavaScript
• Machine Learning

--------------------------------

Recommendations

• Improve DSA

• Learn Docker

• Practice System Design

• Continue Mock Interviews

Generated by Career OS AI`;

    const blob=new Blob(

        [report],

        {

            type:"text/plain"}

    );

    const url=

    URL.createObjectURL(blob);

    const a=

    document.createElement("a");

    a.href=url;

    a.download="Career OS_AI_Report.txt";

    a.click();

    URL.revokeObjectURL(url);

    showToast("Analytics Report Downloaded","success");

}


/*====================================================
            ACHIEVEMENT ANIMATION
====================================================*/

function animateAchievements(){

    const cards=

    document.querySelectorAll(".achievement-card");

    cards.forEach(

        (card,index)=>{

            card.style.opacity="0";

            card.style.transform="translateY(40px)";

            setTimeout(()=>{

                card.style.transition=".6s";

                card.style.opacity="1";

                card.style.transform="translateY(0)";

            },index*200);

        }

    );

}


/*====================================================
            LIVE ANALYTICS UPDATE
====================================================*/

function startLiveUpdates(){

    setInterval(()=>{

        const scores=["resumeScore","codingScore","interviewScore","jobMatch"];

        const random=

        scores[

            Math.floor(

                Math.random()

                *

                scores.length

            )

        ];

        const element=

        document.getElementById(random);

        let value=

        parseInt(

            element.textContent

        );

        if(value<99){

            value++;

            element.textContent=

            value+"%";

        }

    },8000);

}


/*====================================================
            TOAST
====================================================*/

function showToast(

    message,

    type

){

    const toast=

    document.createElement("div");

    toast.textContent=message;

    toast.style.position="fixed";

    toast.style.top="25px";

    toast.style.right="25px";

    toast.style.padding="15px 22px";

    toast.style.borderRadius="12px";

    toast.style.color="#fff";

    toast.style.fontWeight="600";

    toast.style.zIndex="9999";

    toast.style.boxShadow="0 15px 35px rgba(0,0,0,.3)";

    if(type==="success"){

        toast.style.background="#22C55E";

    }

    else{

        toast.style.background="#2563EB";

    }

    document.body.appendChild(toast);

    setTimeout(()=>{

        toast.remove();

    },3000);

}


/*====================================================
        UPDATE INITIALIZE
====================================================*/

function initializeDashboard(){

    animateCounters();

    createProgressChart();

    createCodingChart();

    createSkillRadarChart();

    createTechnologyChart();

    animateProgressBars();

    animateAchievements();

    startLiveUpdates();

}
/*====================================================
                SCROLL ANIMATION
====================================================*/

const observer = new IntersectionObserver(

    (entries)=>{

        entries.forEach(entry=>{

            if(entry.isIntersecting){

                entry.target.classList.add("show-card");

            }

        });

    },

    {

        threshold:0.15

    }

);

document.querySelectorAll(".analytics-card,.chart-card,.performance-card,.table-card,.timeline-card,.recommendation-card,.achievement-card,.report-card").forEach(card=>{

    observer.observe(card);

});


/*====================================================
                CARD HOVER EFFECT
====================================================*/

document.querySelectorAll(".analytics-card,.achievement-card").forEach(card=>{

    card.addEventListener("mouseenter",

        ()=>{

            card.style.transform="translateY(-8px) scale(1.03)";

        }

    );

    card.addEventListener("mouseleave",

        ()=>{

            card.style.transform="translateY(0) scale(1)";

        }

    );

});


/*====================================================
                REFRESH DASHBOARD
====================================================*/

const reportBtn = document.querySelector(".report-btn");

if(reportBtn){

    reportBtn.addEventListener("dblclick",

        ()=>{

            location.reload();

        }

    );

}


/*====================================================
                RESET ANALYTICS
====================================================*/

function resetAnalytics(){

    localStorage.removeItem("analyticsData");

    showToast("Analytics Reset Successfully","success");

}


/*====================================================
                KEYBOARD SHORTCUTS
====================================================*/

document.addEventListener("keydown",

    function(e){

        if(

            e.ctrlKey &&

            e.key.toLowerCase()==="r"){

            e.preventDefault();

            location.reload();

        }

        if(

            e.ctrlKey &&

            e.key.toLowerCase()==="d"){

            e.preventDefault();

            downloadAnalyticsReport();

        }

    }

);


/*====================================================
                WELCOME MESSAGE
====================================================*/

window.addEventListener("load",

    ()=>{

        setTimeout(()=>{

            showToast(" Welcome to Career OS AI Analytics","success");

        },700);

        console.log("Career OS AI Analytics Loaded Successfully");

    }

);


/*====================================================
                FUTURE API INTEGRATION

Example:

fetch("http://127.0.0.1:8000/analytics").then(res=>res.json()).then(data=>{

    // Update Charts

    // Update KPI Cards

    // Update AI Recommendations

});
*/
