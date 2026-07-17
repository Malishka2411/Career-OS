/*=========================================================
                XTRAGRAD AI
            COMPANIES MANAGEMENT
=========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    const searchInput = document.getElementById("companySearch");
    const companyTable = document.getElementById("companyTable");
    const refreshBtn = document.querySelector(".refresh-btn");
    const exportBtn = document.querySelector(".export-btn");

    updateCompanyCount();

    /*=========================================
                LIVE SEARCH
    =========================================*/

    searchInput.addEventListener("keyup", function () {

        const value = this.value.toLowerCase().trim();

        const rows = companyTable.querySelectorAll("tbody tr");

        rows.forEach(row => {

            const text = row.textContent.toLowerCase();

            if (text.includes(value)) {

                row.style.display = "";

            } else {

                row.style.display = "none";

            }

        });

        updateCompanyCount();

    });

    /*=========================================
                REFRESH
    =========================================*/

    refreshBtn.addEventListener("click", () => {

        searchInput.value = "";

        companyTable.querySelectorAll("tbody tr").forEach(row => {

            row.style.display = "";

        });

        updateCompanyCount();

        showToast("Company list refreshed");

    });

    /*=========================================
                EXPORT
    =========================================*/

    exportBtn.addEventListener("click", exportTable);

});


/*=========================================================
            UPDATE DASHBOARD COUNT
=========================================================*/

function updateCompanyCount() {

    const rows = document.querySelectorAll("#companyTable tbody tr");

    let total = 0;
    let active = 0;
    let openings = 0;

    rows.forEach(row => {

        if (row.style.display === "none") return;

        total++;

        const status = row.cells[8].innerText.trim();

        const openingsCount = parseInt(row.cells[5].innerText);

        openings += openingsCount;

        if (status === "Open") {

            active++;

        }

    });

    document.getElementById("totalCompanies").innerText = total;

    document.getElementById("activeCompanies").innerText = active;

    document.getElementById("jobOpenings").innerText = openings;

}


/*=========================================================
                EXPORT CSV
=========================================================*/

function exportTable() {

    let csv = [];

    const rows = document.querySelectorAll("#companyTable tr");

    rows.forEach(row => {

        let cols = row.querySelectorAll("th,td");

        let data = [];

        cols.forEach(col => {

            if (!col.querySelector("button") &&!col.querySelector("img")) {

                data.push(col.innerText.trim());

            }

        });

        csv.push(data.join(","));

    });

    downloadCSV(csv.join("\n"));

}


/*=========================================================
                DOWNLOAD CSV
=========================================================*/

function downloadCSV(csv) {

    const blob = new Blob([csv], {

        type: "text/csv"});

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "companies.csv";

    a.click();

}


/*=========================================================
                TOAST
=========================================================*/

function showToast(message) {

    const toast = document.createElement("div");

    toast.innerText = message;

    toast.style.position = "fixed";
    toast.style.top = "30px";
    toast.style.right = "30px";
    toast.style.background = "#10B981";
    toast.style.color = "#fff";
    toast.style.padding = "15px 25px";
    toast.style.borderRadius = "10px";
    toast.style.fontWeight = "600";
    toast.style.zIndex = "99999";

    document.body.appendChild(toast);

    setTimeout(() => {

        toast.remove();

    }, 2500);

}
/*=========================================================
                COMPANY MODAL
=========================================================*/

const modal = document.getElementById("companyModal");
const closeModal = document.querySelector(".close-modal");

const modalLogo = document.getElementById("modalLogo");
const modalCompany = document.getElementById("modalCompany");
const modalCompanyName = document.getElementById("modalCompanyName");
const modalLocation = document.getElementById("modalLocation");
const modalHR = document.getElementById("modalHR");
const modalEmail = document.getElementById("modalEmail");
const modalRole = document.getElementById("modalRole");
const modalPackage = document.getElementById("modalPackage");
const modalOpenings = document.getElementById("modalOpenings");
const modalDeadline = document.getElementById("modalDeadline");


/*=========================================================
                VIEW COMPANY
=========================================================*/

document.querySelectorAll(".view-btn").forEach(button=>{

    button.addEventListener("click",function(){

        const row=this.closest("tr");

        const logo=row.querySelector(".company-logo").src;

        const company=row.cells[1].innerText;

        const hr=row.cells[2].innerText;

        const role=row.cells[3].innerText;

        const salary=row.cells[4].innerText;

        const openings=row.cells[5].innerText;

        const location=row.cells[6].innerText;

        const deadline=row.cells[7].innerText;

        modalLogo.src=logo;

        modalCompany.innerText=company;

        modalCompanyName.innerText=company;

        modalLocation.innerText=location;

        modalHR.innerText=hr;

        modalRole.innerText=role;

        modalPackage.innerText=salary;

        modalOpenings.innerText=openings;

        modalDeadline.innerText=deadline;

        modalEmail.innerText=
            hr.toLowerCase().replace(/ /g,".") +"@company.com";

        modal.style.display="flex";

        document.body.style.overflow="hidden";

    });

});


/*=========================================================
                CLOSE MODAL
=========================================================*/

closeModal.addEventListener("click",()=>{

    modal.style.display="none";

    document.body.style.overflow="auto";

});

window.addEventListener("click",(e)=>{

    if(e.target===modal){

        modal.style.display="none";

        document.body.style.overflow="auto";

    }

});


/*=========================================================
                ESC KEY
=========================================================*/

document.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        modal.style.display="none";

        document.body.style.overflow="auto";

    }

});


/*=========================================================
                DELETE COMPANY
=========================================================*/

document.querySelectorAll(".delete-btn").forEach(button=>{

    button.addEventListener("click",function(){

        if(!confirm("Delete this company?")) return;

        const row=this.closest("tr");

        row.remove();

        updateCompanyCount();

        showToast("Company deleted successfully");

    });

});


/*=========================================================
                EDIT COMPANY
=========================================================*/

document.querySelectorAll(".edit-btn").forEach(button=>{

    button.addEventListener("click",function(){

        const row=this.closest("tr");

        const company=row.cells[1].innerText;

        alert("Edit Company: "+company);

        // Future:
        // window.location="edit-company.html?id=001";

    });

});


/*=========================================================
                CONTACT HR
=========================================================*/

document.querySelectorAll(".email-btn").forEach(button=>{

    button.addEventListener("click",function(){

        let email="";

        const row=this.closest("tr");

        if(row){

            const hr=row.cells[2].innerText;

            email=hr.toLowerCase().replace(/ /g,".")+"@company.com";

        }else{

            email=modalEmail.innerText;

        }

        window.location.href="mailto:"+email;

    });

});


/*=========================================================
                DOUBLE CLICK
=========================================================*/

document.querySelectorAll("#companyTable tbody tr").forEach(row=>{

    row.addEventListener("dblclick",()=>{

        row.querySelector(".view-btn").click();

    });

});
/*=========================================================
                COMPANY FILTERS
=========================================================*/

const companyTypeFilter = document.getElementById("companyTypeFilter");
const jobTypeFilter = document.getElementById("jobTypeFilter");
const locationFilter = document.getElementById("locationFilter");
const statusFilter = document.getElementById("statusFilter");

companyTypeFilter.addEventListener("change", filterCompanies);
jobTypeFilter.addEventListener("change", filterCompanies);
locationFilter.addEventListener("change", filterCompanies);
statusFilter.addEventListener("change", filterCompanies);


/*=========================================================
                FILTER COMPANIES
=========================================================*/

function filterCompanies() {

    const rows = document.querySelectorAll("#companyTable tbody tr");

    rows.forEach(row => {

        let show = true;

        const location = row.cells[6].innerText.trim();
        const status = row.cells[8].innerText.trim();

        /*-------------------------------------------------
            Company Type
            (Demo mapping)
        --------------------------------------------------*/

        const company = row.cells[1].innerText;

        let companyType = "";

        if (["Google","Microsoft","Amazon"].includes(company))
            companyType = "Product Based";

        else if (["Infosys","TCS","Wipro","Accenture"].includes(company))
            companyType = "Service Based";

        else
            companyType = "Startup";


        /*-------------------------------------------------
            Job Type
            (Demo mapping)
        --------------------------------------------------*/

        let jobType = "Full Time";

        if(company==="Amazon")
            jobType="Internship";

        if(company==="Google")
            jobType="Hybrid";

        if(company==="Microsoft")
            jobType="Remote";


        if(companyTypeFilter.value!== "" &&
           companyTypeFilter.value!== companyType)

            show = false;


        if(jobTypeFilter.value!== "" &&
           jobTypeFilter.value!== jobType)

            show = false;


        if(locationFilter.value!== "" &&
           locationFilter.value!== location)

            show = false;


        if(statusFilter.value!== "" &&
           statusFilter.value!== status)

            show = false;


        row.style.display = show? "": "none";

    });

    updateCompanyCount();

}


/*=========================================================
                CLEAR FILTERS
=========================================================*/

document.getElementById("clearFilters").addEventListener("click",()=>{

    companyTypeFilter.selectedIndex=0;
    jobTypeFilter.selectedIndex=0;
    locationFilter.selectedIndex=0;
    statusFilter.selectedIndex=0;

    document.getElementById("companySearch").value="";

    document.querySelectorAll("#companyTable tbody tr").forEach(row=>{

        row.style.display="";

    });

    updateCompanyCount();

    showToast("Filters Cleared");

});


/*=========================================================
            CTRL + F SEARCH
=========================================================*/

document.addEventListener("keydown",(e)=>{

    if(e.ctrlKey && e.key==="f"){

        e.preventDefault();

        document.getElementById("companySearch").focus();

    }

});


/*=========================================================
            SAVE SEARCH
=========================================================*/

const companySearch =
document.getElementById("companySearch");

companySearch.addEventListener("input",()=>{

    localStorage.setItem("companySearch",
        companySearch.value
    );

});


/*=========================================================
            SAVE FILTERS
=========================================================*/

[
 companyTypeFilter,
 jobTypeFilter,
 locationFilter,
 statusFilter

].forEach(select=>{

    select.addEventListener("change",()=>{

        localStorage.setItem(
            select.id,
            select.value
        );

    });

});


/*=========================================================
            LOAD SAVED DATA
=========================================================*/

window.addEventListener("load",()=>{

    const search=
    localStorage.getItem("companySearch");

    if(search){

        companySearch.value=search;

        companySearch.dispatchEvent(
            new Event("keyup")
        );

    }

    [
        companyTypeFilter,
        jobTypeFilter,
        locationFilter,
        statusFilter

    ].forEach(select=>{

        const value=
        localStorage.getItem(select.id);

        if(value){

            select.value=value;

        }

    });

    filterCompanies();

});


/*=========================================================
            UPDATE DASHBOARD
=========================================================*/

const oldUpdateCompanyCount = updateCompanyCount;

updateCompanyCount = function(){

    oldUpdateCompanyCount();

    let placed = 0;

    document.querySelectorAll("#companyTable tbody tr").forEach(row=>{

        if(row.style.display==="none") return;

        const openings=
        parseInt(row.cells[5].innerText);

        placed += Math.floor(openings*0.4);

    });

    document.getElementById("placedStudents").innerText=placed;

};


/*=========================================================
            PAGE LOADING EFFECT
=========================================================*/

window.addEventListener("load",()=>{

    document.body.style.opacity="0";

    setTimeout(()=>{

        document.body.style.transition=".5s";

        document.body.style.opacity="1";

    },150);

});
/*=========================================================
                    PAGINATION
=========================================================*/

const rowsPerPage = 5;
let currentPage = 1;

function getVisibleRows() {

    return [...document.querySelectorAll("#companyTable tbody tr")].filter(row => row.style.display!== "none");

}

function updatePagination() {

    const pageContainer = document.querySelector(".page-numbers");
    const rows = getVisibleRows();

    const totalPages = Math.ceil(rows.length / rowsPerPage) || 1;

    pageContainer.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {

        const btn = document.createElement("button");

        btn.innerText = i;

        if (i === currentPage)
            btn.classList.add("active");

        btn.addEventListener("click", () => {

            currentPage = i;

            showPage();

        });

        pageContainer.appendChild(btn);

    }

}

function showPage() {

    const rows = getVisibleRows();

    rows.forEach((row, index) => {

        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        row.style.visibility =
            (index >= start && index < end)? "visible": "collapse";

    });

    updatePagination();

}

document.getElementById("prevPage").addEventListener("click", () => {

    if (currentPage > 1) {

        currentPage--;

        showPage();

    }

});

document.getElementById("nextPage").addEventListener("click", () => {

    const totalPages =
        Math.ceil(getVisibleRows().length / rowsPerPage);

    if (currentPage < totalPages) {

        currentPage++;

        showPage();

    }

});


/*=========================================================
                REFRESH PAGINATION
=========================================================*/

const oldFilterCompanies = filterCompanies;

filterCompanies = function () {

    oldFilterCompanies();

    currentPage = 1;

    showPage();

};


/*=========================================================
                    AUTO REFRESH
=========================================================*/

function refreshDashboard() {

    updateCompanyCount();

    showPage();

}

setInterval(refreshDashboard, 30000);


/*=========================================================
                BETTER TOAST
=========================================================*/

function premiumToast(message, color = "#10B981") {

    const toast = document.createElement("div");

    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i>
      ${message}`;

    toast.style.position = "fixed";
    toast.style.top = "25px";
    toast.style.right = "25px";
    toast.style.background = color;
    toast.style.color = "#fff";
    toast.style.padding = "15px 24px";
    toast.style.borderRadius = "12px";
    toast.style.fontWeight = "600";
    toast.style.display = "flex";
    toast.style.alignItems = "center";
    toast.style.gap = "10px";
    toast.style.boxShadow = "0 15px 30px rgba(0,0,0,.3)";
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


/*=========================================================
            REPLACE OLD TOAST
=========================================================*/

showToast = premiumToast;


/*=========================================================
                INITIALIZE
=========================================================*/

window.addEventListener("load", () => {

    updateCompanyCount();

    updatePagination();

    showPage();

    premiumToast("Companies Dashboard Loaded");

});


/*=========================================================
                CONSOLE MESSAGE
=========================================================*/

console.log(`
==========================================
      XTRAGRAD AI - Companies Module
==========================================
 Live Search
 Filters
 View Company
 Delete Company
 Edit Company
 Contact HR
 CSV Export
 Pagination
 Auto Refresh
 Local Storage
==========================================
`);