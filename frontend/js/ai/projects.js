/*=========================================================
                Career OS AI
                PROJECT GENERATOR
=========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    initializeProjectGenerator();

});


/*=========================================================
                INITIALIZE
=========================================================*/

function initializeProjectGenerator(){

    const generateButton=document.getElementById("generateProject");

    if(generateButton){

        generateButton.addEventListener("click",

            generateProject

        );

    }

}


/*=========================================================
                GENERATE PROJECT
=========================================================*/

function generateProject(){

    const title=document.getElementById("projectTitle").value.trim();

    const domain=document.getElementById("domain").value;

    const technology=document.getElementById("aiTechnology").value;

    const language=document.getElementById("language").value;

    const framework=document.getElementById("framework").value;

    const database=document.getElementById("database").value;

    const difficulty=document.getElementById("difficulty").value;

    if(title===""){

        showToast("Please enter a project title.","error");

        return;

    }

    document.getElementById("projectOverview").innerHTML=`<h4>${title}</h4>

      <p>

          ${title} is an AI-powered ${domain}

            application developed using

            ${technology}, ${framework},

            ${language}, and ${database}.

            This project targets ${difficulty}

            level implementation with modern

            software architecture.

        </p>`;

    generateTechStack(

        technology,

        framework,

        language,

        database

    );

    saveProject();

    showToast("Project Generated Successfully","success");

}
/*=========================================================
                SAVE PROJECT
=========================================================*/

function saveProject(){

    const project={

        title:document.getElementById("projectTitle").value,

        domain:document.getElementById("domain").value,

        technology:document.getElementById("aiTechnology").value,

        language:document.getElementById("language").value,

        framework:document.getElementById("framework").value,

        database:document.getElementById("database").value,

        difficulty:document.getElementById("difficulty").value,

        duration:document.getElementById("duration").value,

        description:document.getElementById("description").value,

        features:document.getElementById("features").value

    };

    localStorage.setItem("generatedProject",

        JSON.stringify(project)

    );

}


/*=========================================================
                LOAD SAVED PROJECT
=========================================================*/

function loadProject(){

    const data=localStorage.getItem("generatedProject");

    if(!data) return;

    const project=JSON.parse(data);

    document.getElementById("projectTitle").value=project.title || "";

    document.getElementById("domain").value=project.domain || "";

    document.getElementById("aiTechnology").value=project.technology || "";

    document.getElementById("language").value=project.language || "";

    document.getElementById("framework").value=project.framework || "";

    document.getElementById("database").value=project.database || "";

    document.getElementById("difficulty").value=project.difficulty || "";

    document.getElementById("duration").value=project.duration || "";

    document.getElementById("description").value=project.description || "";

    document.getElementById("features").value=project.features || "";

}


/*=========================================================
                TECH STACK
=========================================================*/

function generateTechStack(

    technology,

    framework,

    language,

    database

){

    const techStack=document.getElementById("techStack");

    techStack.innerHTML="";

    const stack=[

        language,

        framework,

        database,

        technology,"Git","Docker"];

    stack.forEach(item=>{

        const badge=document.createElement("div");

        badge.className="tech-badge";

        badge.textContent=item;

        techStack.appendChild(badge);

    });

}


/*=========================================================
                FOLDER STRUCTURE
=========================================================*/

function generateFolderStructure(projectName){

    const folder=document.getElementById("folderStructure");

    folder.textContent=`${projectName}/

├── frontend/

├── backend/

├── ai/

├── api/

├── database/

├── models/

├── assets/

├── docs/

├── tests/

└── README.md`;

}


/*=========================================================
                DATABASE SCHEMA
=========================================================*/

function generateDatabaseSchema(){

    const schema=document.getElementById("databaseSchema");

    schema.innerHTML=`<ul>

          <li>Users</li>

          <li>Projects</li>

          <li>Project_History</li>

          <li>Notifications</li>

          <li>AI_Generated_Content</li>

          <li>Settings</li>

      </ul>`;

}


/*=========================================================
                LOAD ON PAGE START
=========================================================*/

window.addEventListener("load",

    ()=>{

        loadProject();

    }

);
/*=========================================================
                API ENDPOINT GENERATOR
=========================================================*/

function generateApiEndpoints(){

    const api=document.getElementById("apiEndpoints");

    api.textContent=`POST   /api/auth/login

POST   /api/auth/register

GET    /api/projects

POST   /api/projects

GET    /api/projects/{id}

PUT    /api/projects/{id}

DELETE /api/projects/{id}

POST   /api/ai/generate

GET    /api/users/profile

PUT    /api/users/profile`;

}


/*=========================================================
                COPY PROJECT DETAILS
=========================================================*/

function copyProjectDetails(){

    const text=document.querySelector(".project-output").innerText;

    navigator.clipboard.writeText(text).then(()=>{

        showToast("Project copied successfully.","success");

    }).catch(()=>{

        showToast("Copy failed.","error");

    });

}


/*=========================================================
                DOWNLOAD PROJECT REPORT
=========================================================*/

function downloadReport(){

    const report=document.querySelector(".project-output").innerText;

    const blob=new Blob(

        [report],

        {

            type:"text/plain"}

    );

    const url=URL.createObjectURL(blob);

    const link=document.createElement("a");

    link.href=url;

    link.download="AI_Project_Report.txt";

    link.click();

    URL.revokeObjectURL(url);

}


/*=========================================================
                TOAST NOTIFICATION
=========================================================*/

function showToast(message,type){

    const toast=document.createElement("div");

    toast.className=`toast ${type}`;

    toast.innerHTML=message;

    document.body.appendChild(

        toast

    );

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

document.querySelector(".download-btn").addEventListener("click",

    downloadReport

);


document.querySelector(".copy-btn").addEventListener("click",

    copyProjectDetails

);


/*=========================================================
                GENERATE COMPLETE PROJECT
=========================================================*/

function generateProject(){

    const title=document.getElementById("projectTitle").value.trim();

    const technology=document.getElementById("aiTechnology").value;

    const framework=document.getElementById("framework").value;

    const language=document.getElementById("language").value;

    const database=document.getElementById("database").value;

    if(title===""){

        showToast("Please enter project title.","error");

        return;

    }

    document.getElementById("projectOverview").innerHTML=`<h3>${title}</h3>

      <p>

          ${title} is an AI-powered application

            built using ${technology},

            ${framework},

            ${language},

            and ${database}.

            The system follows modern software

            architecture with scalable backend,

            responsive frontend,

            authentication,

            dashboards,

            analytics,

            and AI modules.

        </p>`;

    generateTechStack(

        technology,

        framework,

        language,

        database

    );

    generateFolderStructure(

        title.replace(/\s+/g,"-")

    );

    generateDatabaseSchema();

    generateApiEndpoints();

    saveProject();

    showToast("AI Project Generated Successfully","success");

}


/*=========================================================
                PAGE LOADED
=========================================================*/

window.addEventListener("load",

    ()=>{

        loadProject();

        console.log(" AI Project Generator Loaded");

    }

);