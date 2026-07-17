/*====================================================
        XTRAGRAD AI ASSISTANT
====================================================*/

document.addEventListener("DOMContentLoaded", () => {

    initializeAssistant();

});

/*====================================================
        GLOBAL ELEMENTS
====================================================*/

const chatMessages = document.getElementById("chatMessages");

const messageInput = document.getElementById("messageInput");

const sendBtn = document.getElementById("sendBtn");

const clearBtn = document.getElementById("clearBtn");

const newChatBtn = document.querySelector(".new-chat-btn");

const promptCards = document.querySelectorAll(".prompt-card");


/*====================================================
        INITIALIZE
====================================================*/

function initializeAssistant(){

    loadChat();

    registerEvents();

}


/*====================================================
        EVENTS
====================================================*/

function registerEvents(){

    sendBtn.addEventListener("click",

        sendMessage

    );

    messageInput.addEventListener("keydown",

        function(e){

            if(

                e.key==="Enter"&&!e.shiftKey

            ){

                e.preventDefault();

                sendMessage();

            }

        }

    );

    clearBtn.addEventListener("click",

        clearChat

    );

    newChatBtn.addEventListener("click",

        clearChat

    );

    promptCards.forEach(card=>{

        card.addEventListener("click",

            ()=>{

                const text=

                card.querySelector("h4").textContent;

                messageInput.value=text;

                sendMessage();

            }

        );

    });

}


/*====================================================
        SEND MESSAGE
====================================================*/

function sendMessage(){

    const text=messageInput.value.trim();

    if(text==="") return;

    addUserMessage(text);

    messageInput.value="";

    showTyping();

    setTimeout(()=>{

        removeTyping();

        generateReply(text);

    },1500);

}


/*====================================================
        USER MESSAGE
====================================================*/

function addUserMessage(text){

    const html=`<div class="message user-message">

      <div class="message-content">

          <h4>You</h4>

          <p>${text}</p>

      </div>

      <div class="message-avatar user">

          <i class="fa-solid fa-user"></i>

      </div>

  </div>`;

    chatMessages.insertAdjacentHTML("beforeend",

        html

    );

    scrollBottom();

}
/*====================================================
        AI TYPING INDICATOR
====================================================*/

function showTyping(){

    const typing=`<div class="message ai-message typing-message">

      <div class="message-avatar">

          <i class="fa-solid fa-robot"></i>

      </div>

      <div class="message-content">

          <h4>XTRAGRAD AI</h4>

          <div class="typing-indicator">

              <span></span>

              <span></span>

              <span></span>

          </div>

      </div>

  </div>`;

    chatMessages.insertAdjacentHTML("beforeend",

        typing

    );

    scrollBottom();

}


/*====================================================
        REMOVE TYPING
====================================================*/

function removeTyping(){

    const typing=

    document.querySelector(".typing-message");

    if(typing){

        typing.remove();

    }

}


/*====================================================
        AI RESPONSE
====================================================*/

function generateReply(question){

    let reply="";

    const q=question.toLowerCase();

    if(

        q.includes("resume")

    ){

        reply="I can analyze your resume, calculate ATS score, identify missing skills, and suggest improvements. Once the backend is connected, you can upload your PDF resume for detailed feedback.";

    }

    else if(

        q.includes("interview")

    ){

        reply="I can conduct HR, Technical, DSA, and System Design mock interviews. I'll ask questions, evaluate your answers, and provide personalized feedback.";

    }

    else if(

        q.includes("roadmap")

    ){

        reply="I can generate a personalized learning roadmap based on your goals, current skills, and available study time.";

    }

    else if(

        q.includes("project")

    ){

        reply="I can generate final-year project ideas, architecture diagrams, tech stacks, implementation plans, and deployment guidance.";

    }

    else if(

        q.includes("job")

    ){

        reply="I can recommend jobs based on your skills, analyze job descriptions, identify skill gaps, and help you prepare for interviews.";

    }

    else if(

        q.includes("code")

    ){

        reply="Paste your code here and I'll review it for bugs, suggest optimizations, explain the logic, and recommend best practices.";

    }

    else{

        reply="I'm your XTRAGRAD AI Assistant. I can help with programming, AI, placements, resumes, career guidance, interview preparation, coding practice, and project development.";

    }

    addAIMessage(reply);

}


/*====================================================
        AI MESSAGE
====================================================*/

function addAIMessage(text){

    const html=`<div class="message ai-message">

      <div class="message-avatar">

          <i class="fa-solid fa-robot"></i>

      </div>

      <div class="message-content">

          <h4>XTRAGRAD AI</h4>

          <p>${text}</p>

      </div>

  </div>`;

    chatMessages.insertAdjacentHTML("beforeend",

        html

    );

    scrollBottom();

    saveChat();

}


/*====================================================
        SCROLL TO BOTTOM
====================================================*/

function scrollBottom(){

    chatMessages.scrollTop=

    chatMessages.scrollHeight;

}
/*====================================================
        SAVE CHAT
====================================================*/

function saveChat(){

    localStorage.setItem("xtragrad_chat",

        chatMessages.innerHTML

    );

}


/*====================================================
        LOAD CHAT
====================================================*/

function loadChat(){

    const chat=

    localStorage.getItem("xtragrad_chat");

    if(chat){

        chatMessages.innerHTML=chat;

        scrollBottom();

    }

}


/*====================================================
        CLEAR CHAT
====================================================*/

function clearChat(){

    if(!confirm("Clear all chat history?")

    ) return;

    chatMessages.innerHTML="";

    localStorage.removeItem("xtragrad_chat");

    showToast("Chat Cleared","success");

}


/*====================================================
        FILE UPLOAD
====================================================*/

const uploadBtn=

document.getElementById("uploadBtn");

const fileInput=

document.getElementById("fileInput");

uploadBtn.addEventListener("click",

    ()=>{

        fileInput.click();

    }

);

fileInput.addEventListener("change",

    ()=>{

        if(fileInput.files.length>0){

            const file=

            fileInput.files[0];

            addUserMessage("Uploaded: "+file.name

            );

            showToast("File uploaded successfully","success");

        }

    }

);


/*====================================================
        EXPORT CHAT
====================================================*/

const exportBtn=

document.getElementById("exportBtn");

exportBtn.addEventListener("click",

    exportChat

);

function exportChat(){

    const text=

    chatMessages.innerText;

    const blob=

    new Blob(

        [text],

        {

            type:"text/plain"}

    );

    const url=

    URL.createObjectURL(blob);

    const a=

    document.createElement("a");

    a.href=url;

    a.download="XTRAGRAD_AI_Chat.txt";

    a.click();

    URL.revokeObjectURL(url);

    showToast("Chat exported","success");

}


/*====================================================
        TOAST NOTIFICATION
====================================================*/

function showToast(

    message,

    type

){

    const toast=

    document.createElement("div");

    toast.textContent=message;

    toast.style.position="fixed";

    toast.style.top="20px";

    toast.style.right="20px";

    toast.style.padding="15px 22px";

    toast.style.borderRadius="12px";

    toast.style.color="#fff";

    toast.style.fontWeight="600";

    toast.style.zIndex="9999";

    toast.style.boxShadow="0 10px 25px rgba(0,0,0,.25)";

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
/*====================================================
        VOICE RECOGNITION
====================================================*/

const voiceBtn = document.getElementById("voiceBtn");

if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.interimResults = false;

    recognition.continuous = false;

    voiceBtn.addEventListener("click", () => {

        recognition.start();

        showToast("Listening...","info");

    });

    recognition.onresult = (event) => {

        messageInput.value =
            event.results[0][0].transcript;

    };

    recognition.onerror = () => {

        showToast("Voice recognition failed","error");

    };

}


/*====================================================
        STOP BUTTON
====================================================*/

const stopBtn =
document.getElementById("stopBtn");

stopBtn.addEventListener("click",

    () => {

        removeTyping();

        showToast("Generation Stopped","info");

    }

);


/*====================================================
        HISTORY BUTTON
====================================================*/

const historyBtn =
document.getElementById("historyBtn");

historyBtn.addEventListener("click",

    () => {

        loadChat();

        showToast("Previous chat loaded","success");

    }

);


/*====================================================
        TOOL CARDS
====================================================*/

document.querySelectorAll(".tool-card").forEach(card => {

    card.addEventListener("click",

        () => {

            const tool =
                card.innerText.trim();

            messageInput.value ="Open " + tool;

            sendMessage();

        }

    );

});


/*====================================================
        KEYBOARD SHORTCUTS
====================================================*/

document.addEventListener("keydown",

    function(e){

        if(

            e.ctrlKey

            &&

            e.key.toLowerCase()==="k"){

            e.preventDefault();

            clearChat();

        }

        if(

            e.ctrlKey

            &&

            e.key.toLowerCase()==="n"){

            e.preventDefault();

            messageInput.value="";

            showToast("New Chat Started","success");

        }

    }

);


/*====================================================
        AUTO RESIZE TEXTAREA
====================================================*/

messageInput.addEventListener("input",

    function(){

        this.style.height="auto";

        this.style.height=

        this.scrollHeight+"px";

    }

);


/*====================================================
        PAGE LOAD
====================================================*/

window.addEventListener("load",

    ()=>{

        showToast(" Welcome to XTRAGRAD AI Assistant","success");

        console.log("XTRAGRAD AI Assistant Loaded");

    }

);


/*====================================================
        FUTURE FASTAPI CONNECTION
====================================================*/

/*

Later replace

generateReply()

with:

fetch("http://127.0.0.1:8000/chat",{

    method:"POST",

    headers:{"Content-Type":"application/json"},

    body:JSON.stringify({

        message:text

    })

}).then(res=>res.json()).then(data=>{

    addAIMessage(data.response);

});

*/


/*====================================================
        END OF FILE
====================================================*/