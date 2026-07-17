/*=====================================================
            XTRAGRAD AI MOCK INTERVIEW
=====================================================*/

document.addEventListener("DOMContentLoaded", () => {

    initializeInterview();

});


/*=====================================================
            GLOBAL VARIABLES
=====================================================*/

let timer;

let seconds = 0;

let currentQuestion = 0;

const totalQuestions = 10;


/*=====================================================
            QUESTIONS
=====================================================*/

const questions = ["Tell me about yourself.","What are your strengths?","Explain Object-Oriented Programming.","What is the difference between SQL and NoSQL?","Explain REST API.","What is Machine Learning?","Difference between Stack and Queue?","Explain Time Complexity.","Tell me about one challenging project.","Why should we hire you?"];


/*=====================================================
            INITIALIZE
=====================================================*/

function initializeInterview(){

    setupButtons();

}


/*=====================================================
            BUTTON EVENTS
=====================================================*/

function setupButtons(){

    document.getElementById("startInterview").addEventListener("click",startInterview);

    document.querySelector(".next-btn").addEventListener("click",nextQuestion);

    document.querySelector(".skip-btn").addEventListener("click",skipQuestion);

    document.querySelector(".end-btn").addEventListener("click",endInterview);

}


/*=====================================================
            START INTERVIEW
=====================================================*/

function startInterview(){

    currentQuestion=0;

    seconds=0;

    document.getElementById("interviewerStatus").innerHTML="Interview Started";

    loadQuestion();

    startTimer();

    updateProgress();

    showToast("Interview Started","success");

}
/*=====================================================
            TIMER
=====================================================*/

function startTimer(){

    clearInterval(timer);

    timer = setInterval(() => {

        seconds++;

        const mins = Math.floor(seconds / 60);

        const secs = seconds % 60;

        document.getElementById("timer").textContent =`${String(mins).padStart(2,"0")}: ${String(secs).padStart(2,"0")}`;

    },1000);

}


/*=====================================================
            LOAD QUESTION
=====================================================*/

function loadQuestion(){

    if(currentQuestion >= totalQuestions){

        endInterview();

        return;

    }

    document.getElementById("questionText").textContent =

        questions[currentQuestion];

}


/*=====================================================
            NEXT QUESTION
=====================================================*/

function nextQuestion(){

    const answer = document.getElementById("answerBox").value.trim();

    if(answer === ""){

        showToast("Please answer the question before continuing.","error");

        return;

    }

    currentQuestion++;

    document.getElementById("answerBox").value = "";

    loadQuestion();

    updateProgress();

    updateScores();

}


/*=====================================================
            SKIP QUESTION
=====================================================*/

function skipQuestion(){

    currentQuestion++;

    document.getElementById("answerBox").value = "";

    loadQuestion();

    updateProgress();

    showToast("Question Skipped","warning");

}


/*=====================================================
            UPDATE PROGRESS
=====================================================*/

function updateProgress(){

    document.getElementById("currentQuestion").textContent =

        currentQuestion + 1;

    const percentage =

        ((currentQuestion + 1) / totalQuestions) * 100;

    document.getElementById("progressFill").style.width =

        percentage + "%";

}


/*=====================================================
            UPDATE AI SCORES
=====================================================*/

function updateScores(){

    document.getElementById("confidence").textContent =

        Math.floor(Math.random()*20+80) + "%";

    document.getElementById("communication").textContent =

        Math.floor(Math.random()*20+75) + "%";

    document.getElementById("technical").textContent =

        Math.floor(Math.random()*20+78) + "%";

    document.getElementById("grammar").textContent =

        Math.floor(Math.random()*10+90) + "%";

}
/*=====================================================
            RECORD ANSWER (Demo)
=====================================================*/

const recordBtn = document.querySelector(".record-btn");

if(recordBtn){

    recordBtn.addEventListener("click", () => {

        showToast(" Voice recording will be enabled after backend integration.","info");

    });

}


/*=====================================================
            END INTERVIEW
=====================================================*/

function endInterview(){

    clearInterval(timer);

    document.getElementById("interviewerStatus").innerHTML ="Interview Completed";

    generateReport();

    saveInterviewHistory();

    showToast("Interview Completed Successfully","success");

}


/*=====================================================
            GENERATE REPORT
=====================================================*/

function generateReport(){

    document.getElementById("overallScore").textContent = "88%";

    document.getElementById("questionsAnswered").textContent =`${currentQuestion}/${totalQuestions}`;

    document.getElementById("interviewLevel").textContent ="Excellent";

    document.getElementById("recommendation").textContent ="Recommended";

    document.getElementById("aiFeedback").innerHTML = `<ul>

      <li> Good communication skills.</li>

      <li> Strong technical understanding.</li>

      <li> Try giving shorter and more structured answers.</li>

      <li> Add more real-world project examples.</li>

  </ul>`;

}


/*=====================================================
            SAVE INTERVIEW
=====================================================*/

function saveInterviewHistory(){

    const history={

        company:document.getElementById("company").value,

        interviewType:document.getElementById("interviewType").value,

        score:document.getElementById("overallScore").textContent,

        date:new Date().toLocaleString()

    };

    localStorage.setItem("xtragradInterview",

        JSON.stringify(history)

    );

}


/*=====================================================
            DOWNLOAD REPORT
=====================================================*/

document.querySelector(".download-report").addEventListener("click",

    ()=>{

        const report=`XTRAGRAD AI MOCK INTERVIEW REPORT

-----------------------------------

Company:
${document.getElementById("company").value}

Interview Type:
${document.getElementById("interviewType").value}

Overall Score:
${document.getElementById("overallScore").textContent}

Recommendation:
${document.getElementById("recommendation").textContent}

Generated by XTRAGRAD AI`;

        const blob=new Blob(

            [report],

            {type:"text/plain"}

        );

        const url=URL.createObjectURL(blob);

        const a=document.createElement("a");

        a.href=url;

        a.download="Interview_Report.txt";

        a.click();

        URL.revokeObjectURL(url);

    }

);


/*=====================================================
            RETRY INTERVIEW
=====================================================*/

document.querySelector(".retry-btn").addEventListener("click",

    ()=>{

        location.reload();

    }

);


/*=====================================================
            DASHBOARD
=====================================================*/

document.querySelector(".dashboard-btn").addEventListener("click",

    ()=>{

        window.location.href="./student-dashboard.html";

    }

);


/*=====================================================
            TOAST MESSAGE
=====================================================*/

function showToast(message,type){

    const toast=document.createElement("div");

    toast.className="toast";

    toast.innerHTML=message;

    toast.style.position="fixed";

    toast.style.top="25px";

    toast.style.right="25px";

    toast.style.padding="15px 22px";

    toast.style.borderRadius="12px";

    toast.style.color="#fff";

    toast.style.fontWeight="600";

    toast.style.zIndex="9999";

    toast.style.boxShadow="0 10px 25px rgba(0,0,0,.3)";

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
            PAGE READY
=====================================================*/

window.addEventListener("load",()=>{

    console.log(" XTRAGRAD AI Mock Interview Loaded");

});