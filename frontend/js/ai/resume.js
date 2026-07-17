/*=========================================================
                XTRAGRAD AI
                RESUME.JS
=========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    initializeResumeBuilder();

});


/*=========================================================
                INITIALIZE
=========================================================*/

function initializeResumeBuilder(){

    enableLivePreview();

    initializeSkillSystem();

    initializeButtons();

}


/*=========================================================
                LIVE PREVIEW
=========================================================*/

function enableLivePreview(){

    const inputs=document.querySelectorAll("input, textarea");

    inputs.forEach(input=>{

        input.addEventListener("input",updatePreview);

    });

}


function updatePreview(){

    const name=document.getElementById("fullname")?.value || "Your Name";

    const summary=document.getElementById("summary")?.value ||"Professional Summary";

    const previewHeader=document.querySelector(".preview-header h1");

    const previewContent=document.querySelector(".preview-content");

    previewHeader.textContent=name;

    previewContent.innerHTML=`<h3>Professional Summary</h3>

      <p>${summary}</p>`;

}


/*=========================================================
                BUTTON EVENTS
=========================================================*/

function initializeButtons(){

    const aiBtn=document.querySelector(".ai-btn");

    if(aiBtn){

        aiBtn.addEventListener("click",generateAISummary);

    }

}
/*=========================================================
                AI SUMMARY GENERATOR
=========================================================*/

function generateAISummary(){

    const fullname=document.getElementById("fullname").value;

    const degree=document.getElementById("degree").value;

    const skills=document.getElementById("skillInput").value;

    const summary=document.getElementById("summary");

    const aiSummary=`Passionate ${degree || "Computer Science"} student with strong
problem-solving skills and practical experience in
${skills || "software development"}.
Interested in Artificial Intelligence, Full Stack Development,
and scalable software systems. Quick learner with the ability
to build innovative projects and collaborate effectively
within development teams.`;

    summary.value=aiSummary.trim();

    updatePreview();

    showNotification("AI Summary Generated Successfully","success");

}


/*=========================================================
                SKILL MANAGEMENT
=========================================================*/

function initializeSkillSystem(){

    const addButton=document.querySelector(".skills-box.secondary-btn");

    const skillInput=document.getElementById("skillInput");

    if(!addButton ||!skillInput) return;

    addButton.addEventListener("click",()=>{

        const skill=skillInput.value.trim();

        if(skill==="") return;

        addSkill(skill);

        skillInput.value="";

    });

}


/*=========================================================
                ADD SKILL
=========================================================*/

function addSkill(skill){

    const container=document.querySelector(".skill-tags");

    const tag=document.createElement("span");

    tag.textContent=skill;

    tag.title="Click to Remove";

    tag.addEventListener("click",()=>{

        tag.remove();

        updatePreview();

    });

    container.appendChild(tag);

    updatePreview();

}


/*=========================================================
                UPDATE SKILLS IN PREVIEW
=========================================================*/

function updatePreview(){

    const name=document.getElementById("fullname")?.value || "Your Name";

    const summary=document.getElementById("summary")?.value ||"Professional Summary";

    const previewHeader=document.querySelector(".preview-header h1");

    const previewContent=document.querySelector(".preview-content");

    const skillElements=document.querySelectorAll(".skill-tags span");

    let skillsHTML="";

    skillElements.forEach(skill=>{

        skillsHTML+=`<li>${skill.textContent}</li>`;

    });

    previewHeader.textContent=name;

    previewContent.innerHTML=`<h3>Professional Summary</h3>

      <p>${summary}</p>

      <h3>Skills</h3>

      <ul>

          ${skillsHTML}

        </ul>`;

}
/*=========================================================
                AI SUMMARY GENERATOR
=========================================================*/

function generateAISummary(){

    const fullname=document.getElementById("fullname").value;

    const degree=document.getElementById("degree").value;

    const skills=document.getElementById("skillInput").value;

    const summary=document.getElementById("summary");

    const aiSummary=`Passionate ${degree || "Computer Science"} student with strong
problem-solving skills and practical experience in
${skills || "software development"}.
Interested in Artificial Intelligence, Full Stack Development,
and scalable software systems. Quick learner with the ability
to build innovative projects and collaborate effectively
within development teams.`;

    summary.value=aiSummary.trim();

    updatePreview();

    showNotification("AI Summary Generated Successfully","success");

}


/*=========================================================
                SKILL MANAGEMENT
=========================================================*/

function initializeSkillSystem(){

    const addButton=document.querySelector(".skills-box.secondary-btn");

    const skillInput=document.getElementById("skillInput");

    if(!addButton ||!skillInput) return;

    addButton.addEventListener("click",()=>{

        const skill=skillInput.value.trim();

        if(skill==="") return;

        addSkill(skill);

        skillInput.value="";

    });

}


/*=========================================================
                ADD SKILL
=========================================================*/

function addSkill(skill){

    const container=document.querySelector(".skill-tags");

    const tag=document.createElement("span");

    tag.textContent=skill;

    tag.title="Click to Remove";

    tag.addEventListener("click",()=>{

        tag.remove();

        updatePreview();

    });

    container.appendChild(tag);

    updatePreview();

}


/*=========================================================
                UPDATE SKILLS IN PREVIEW
=========================================================*/

function updatePreview(){

    const name=document.getElementById("fullname")?.value || "Your Name";

    const summary=document.getElementById("summary")?.value ||"Professional Summary";

    const previewHeader=document.querySelector(".preview-header h1");

    const previewContent=document.querySelector(".preview-content");

    const skillElements=document.querySelectorAll(".skill-tags span");

    let skillsHTML="";

    skillElements.forEach(skill=>{

        skillsHTML+=`<li>${skill.textContent}</li>`;

    });

    previewHeader.textContent=name;

    previewContent.innerHTML=`<h3>Professional Summary</h3>

      <p>${summary}</p>

      <h3>Skills</h3>

      <ul>

          ${skillsHTML}

        </ul>`;

}