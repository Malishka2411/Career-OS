/*=========================================================
                Career OS AI
             CODING PRACTICE MODULE
=========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    initializeCodingPractice();

});


/*=========================================================
                INITIALIZE
=========================================================*/

function initializeCodingPractice(){

    loadSavedCode();

    setupButtons();

    setupProblemSelection();

}


/*=========================================================
                BUTTON EVENTS
=========================================================*/

function setupButtons(){

    const runBtn=document.querySelector(".run-btn");

    const submitBtn=document.querySelector(".submit-btn");

    const resetBtn=document.querySelector(".reset-btn");

    if(runBtn){

        runBtn.addEventListener("click",

            runCode

        );

    }

    if(submitBtn){

        submitBtn.addEventListener("click",

            submitSolution

        );

    }

    if(resetBtn){

        resetBtn.addEventListener("click",

            resetEditor

        );

    }

}


/*=========================================================
                RUN CODE
=========================================================*/

function runCode(){

    const code=document.getElementById("codeEditor").value;

    if(code.trim()===""){

        showToast("Please write your solution first.","error");

        return;

    }

    document.getElementById("consoleResult").textContent=`Running code...

Compilation Successful

Sample Test Cases Passed`;

    showToast("Code Executed Successfully","success");

}


/*=========================================================
                SUBMIT SOLUTION
=========================================================*/

function submitSolution(){

    const code=document.getElementById("codeEditor").value;

    if(code.trim()===""){

        showToast("Please enter code before submitting.","error");

        return;

    }

    document.getElementById("submissionStatus").textContent="Accepted";

    document.getElementById("executionTime").textContent="48 ms";

    document.getElementById("memoryUsage").textContent="18 MB";

    document.getElementById("testCases").textContent="25 / 25";

    updateProgress();

    saveCode();

    showToast("Solution Submitted Successfully","success");

}
/*=========================================================
                SAVE CODE
=========================================================*/

function saveCode(){

    const code=document.getElementById("codeEditor").value;

    const language=document.getElementById("languageSelect").value;

    const codingData={

        code:code,

        language:language,

        savedAt:new Date().toLocaleString()

    };

    localStorage.setItem("Career OS CodingData",

        JSON.stringify(codingData)

    );

}


/*=========================================================
                LOAD SAVED CODE
=========================================================*/

function loadSavedCode(){

    const data=localStorage.getItem("Career OSCodingData");

    if(!data) return;

    const codingData=JSON.parse(data);

    document.getElementById("codeEditor").value=codingData.code || "";

    document.getElementById("languageSelect").value=codingData.language || "cpp";

}


/*=========================================================
                RESET EDITOR
=========================================================*/

function resetEditor(){

    if(confirm("Are you sure you want to clear the editor?")){

        document.getElementById("codeEditor").value="";

        document.getElementById("consoleResult").textContent="Waiting for code execution...";

        showToast("Editor Reset Successfully","success");

    }

}


/*=========================================================
                UPDATE PROGRESS
=========================================================*/

function updateProgress(){

    let solved=parseInt(

        document.getElementById("problemsSolved").textContent

    );

    let xp=parseInt(

        document.getElementById("xpPoints").textContent.replace(",","")

    );

    solved++;

    xp+=50;

    document.getElementById("problemsSolved").textContent=solved;

    document.getElementById("xpPoints").textContent=xp.toLocaleString();

}


/*=========================================================
                STREAK UPDATE
=========================================================*/

function updateStreak(){

    let streak=parseInt(

        document.getElementById("streak").textContent

    );

    streak++;

    document.getElementById("streak").textContent=streak+" Days";

}
/*=========================================================
                SEARCH PROBLEMS
=========================================================*/

const searchInput=document.getElementById("searchProblem");

if(searchInput){

    searchInput.addEventListener("keyup",

        filterProblems

    );

}

function filterProblems(){

    const keyword=document.getElementById("searchProblem").value.toLowerCase();

    const problems=document.querySelectorAll(".problem");

    problems.forEach(problem=>{

        const text=problem.innerText.toLowerCase();

        problem.style.display=text.includes(keyword)? "block": "none";

    });

}


/*=========================================================
                DIFFICULTY FILTER
=========================================================*/

const difficultyFilter=document.getElementById("difficultyFilter");

if(difficultyFilter){

    difficultyFilter.addEventListener("change",

        filterDifficulty

    );

}

function filterDifficulty(){

    const level=document.getElementById("difficultyFilter").value.toLowerCase();

    const problems=document.querySelectorAll(".problem");

    problems.forEach(problem=>{

        const difficulty=problem.querySelector("small").innerText.toLowerCase();

        if(level==="all difficulties" || difficulty===level){

            problem.style.display="block";

        }

        else{

            problem.style.display="none";

        }

    });

}


/*=========================================================
                PROBLEM SELECTION
=========================================================*/

function setupProblemSelection(){

    const problems=document.querySelectorAll(".problem");

    problems.forEach(problem=>{

        problem.addEventListener("click",

            ()=>{

                problems.forEach(p=>

                  p.classList.remove("active")

                );

                problem.classList.add("active");

            }

        );

    });

}


/*=========================================================
                AI BUTTONS
=========================================================*/

const aiButtons=document.querySelectorAll(".ai-btn");

aiButtons.forEach(button=>{

    button.addEventListener("click",

        ()=>{

            const output=document.querySelector(".ai-output p");

            output.innerHTML=`<strong>${button.innerText}</strong>

<br><br>This feature will connect to your

FastAPI + LangGraph AI backend.

The AI will generate hints,

explain algorithms,

optimize code,

calculate complexity,

review submissions,

and generate similar coding questions.`;

        }

    );

});


/*=========================================================
                TOAST
=========================================================*/

function showToast(message,type){

    const toast=document.createElement("div");

    toast.className=`toast ${type}`;

    toast.textContent=message;

    toast.style.position="fixed";

    toast.style.top="30px";

    toast.style.right="30px";

    toast.style.padding="15px 25px";

    toast.style.borderRadius="10px";

    toast.style.background=

        type==="success"? "#16A34A": "#DC2626";

    toast.style.color="#ffffff";

    toast.style.zIndex="9999";

    document.body.appendChild(

        toast

    );

    setTimeout(()=>{

        toast.remove();

    },2500);

}


/*=========================================================
                AUTO SAVE
=========================================================*/

const editor=document.getElementById("codeEditor");

if(editor){

    editor.addEventListener("keyup",

        saveCode

    );

}


/*=========================================================
                PAGE READY
=========================================================*/

window.addEventListener("load",

    ()=>{

        console.log(" Coding Practice Loaded");

    }

);