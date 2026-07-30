/*=========================================
        Career OS AI STUDENT MANAGEMENT
==========================================*/

document.addEventListener("DOMContentLoaded", () => {

    const searchInput = document.getElementById("studentSearch");
    const studentTable = document.getElementById("studentTable");
    const refreshBtn = document.querySelector(".refresh-btn");
    const exportBtn = document.querySelector(".export-btn");

    updateStudentCount();

    /*=========================================
                LIVE SEARCH
    ==========================================*/

    searchInput.addEventListener("keyup", function () {

        const value = this.value.toLowerCase().trim();

        const rows = studentTable.querySelectorAll("tbody tr");

        rows.forEach(row => {

            const text = row.textContent.toLowerCase();

            if (text.includes(value)) {

                row.style.display = "";

            } else {

                row.style.display = "none";

            }

        });

        updateStudentCount();

    });

    /*=========================================
                REFRESH BUTTON
    ==========================================*/

    refreshBtn.addEventListener("click", () => {

        searchInput.value = "";

        const rows = studentTable.querySelectorAll("tbody tr");

        rows.forEach(row => {

            row.style.display = "";

        });

        updateStudentCount();

        showToast("Table Refreshed");

    });

    /*=========================================
                EXPORT CSV
    ==========================================*/

    exportBtn.addEventListener("click", exportTable);

});


/*=========================================
        UPDATE STUDENT COUNT
==========================================*/

function updateStudentCount() {

    const rows = document.querySelectorAll("#studentTable tbody tr");

    let visible = 0;

    rows.forEach(row => {

        if (row.style.display!== "none") {

            visible++;

        }

    });

    document.getElementById("totalStudents").innerText = visible;

}


/*=========================================
            EXPORT TABLE TO CSV
==========================================*/

function exportTable() {

    let csv = [];

    const rows = document.querySelectorAll("#studentTable tr");

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


/*=========================================
            DOWNLOAD CSV
==========================================*/

function downloadCSV(csv) {

    const blob = new Blob([csv], {

        type: "text/csv"});

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "students.csv";

    a.click();

}


/*=========================================
            TOAST MESSAGE
==========================================*/

function showToast(message) {

    const toast = document.createElement("div");

    toast.innerHTML = message;

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
/*=========================================
        VIEW STUDENT DETAILS
=========================================*/

const modal = document.getElementById("studentModal");
const closeModal = document.querySelector(".close-modal");

const modalImage = document.getElementById("modalImage");
const modalName = document.getElementById("modalName");
const modalCollege = document.getElementById("modalCollege");
const modalId = document.getElementById("modalId");
const modalEmail = document.getElementById("modalEmail");


document.querySelectorAll(".view-btn").forEach(button=>{

    button.addEventListener("click",function(){

        const row=this.closest("tr");

        const image=row.querySelector(".student-img").src;

        const id=row.cells[1].innerText;

        const name=row.cells[2].innerText;

        const email=row.cells[3].innerText;

        const college=row.cells[4].innerText;

        const branch=row.cells[5].innerText;

        modalImage.src=image;

        modalName.innerText=name;

        modalCollege.innerText=college+" • "+branch;

        modalId.innerText=id;

        modalEmail.innerText=email;

        modal.style.display="flex";

        document.body.style.overflow="hidden";

    });

});


/*=========================================
            CLOSE MODAL
=========================================*/

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


/*=========================================
            DELETE STUDENT
=========================================*/

document.querySelectorAll(".delete-btn").forEach(button=>{

    button.addEventListener("click",function(){

        const confirmDelete=confirm("Delete this student?");

        if(!confirmDelete) return;

        const row=this.closest("tr");

        row.remove();

        updateStudentCount();

        showToast("Student Deleted Successfully");

    });

});


/*=========================================
            EDIT STUDENT
=========================================*/

document.querySelectorAll(".edit-btn").forEach(button=>{

    button.addEventListener("click",function(){

        const row=this.closest("tr");

        const studentName=row.cells[2].innerText;

        alert("Edit Page for: "+studentName

        );

        // Future
        // window.location="edit-student.html?id=STU001";

    });

});


/*=========================================
            EMAIL STUDENT
=========================================*/

const emailBtn=document.querySelector(".email-btn");

emailBtn.addEventListener("click",()=>{

    const email=modalEmail.innerText;

    window.location.href="mailto:"+email;

});


/*=========================================
        ESC CLOSES MODAL
=========================================*/

document.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        modal.style.display="none";

        document.body.style.overflow="auto";

    }

});
/*=========================================
        FILTER STUDENTS
=========================================*/

const collegeFilter=document.getElementById("collegeFilter");
const branchFilter=document.getElementById("branchFilter");
const yearFilter=document.getElementById("yearFilter");
const statusFilter=document.getElementById("statusFilter");

collegeFilter.addEventListener("change",filterStudents);
branchFilter.addEventListener("change",filterStudents);
yearFilter.addEventListener("change",filterStudents);
statusFilter.addEventListener("change",filterStudents);

function filterStudents(){

    const rows=document.querySelectorAll("#studentTable tbody tr");

    rows.forEach(row=>{

        const college=row.cells[4].innerText.trim();
        const branch=row.cells[5].innerText.trim();
        const year=row.cells[6].innerText.trim();
        const status=row.cells[9].innerText.trim();

        let visible=true;

        if(collegeFilter.value!=="" && college!==collegeFilter.value){

            visible=false;

        }

        if(branchFilter.value!=="" && branch!==branchFilter.value){

            visible=false;

        }

        if(yearFilter.value!=="" && year!==yearFilter.value){

            visible=false;

        }

        if(statusFilter.value!=="" && status!==statusFilter.value){

            visible=false;

        }

        row.style.display=visible?"":"none";

    });

    updateStudentCount();

}


/*=========================================
        CLEAR FILTERS
=========================================*/

document.getElementById("clearFilters").addEventListener("click",()=>{

    collegeFilter.selectedIndex=0;
    branchFilter.selectedIndex=0;
    yearFilter.selectedIndex=0;
    statusFilter.selectedIndex=0;

    document.getElementById("studentSearch").value="";

    document.querySelectorAll("#studentTable tbody tr").forEach(row=>{

        row.style.display="";

    });

    updateStudentCount();

    showToast("Filters Cleared");

});


/*=========================================
        UPDATE STATISTICS
=========================================*/

function updateStatistics(){

    const rows=document.querySelectorAll("#studentTable tbody tr");

    let active=0;
    let placed=0;
    let inactive=0;

    rows.forEach(row=>{

        if(row.style.display==="none") return;

        const status=row.cells[9].innerText.trim();

        if(status==="Active") active++;

        if(status==="Placed") placed++;

        if(status==="Inactive") inactive++;

    });

    document.getElementById("activeStudents").innerText=active;

    document.getElementById("placedStudents").innerText=placed;

    document.getElementById("pendingStudents").innerText=inactive;

}

updateStatistics();


/*=========================================
        REFRESH COUNTERS
=========================================*/

const oldUpdate=updateStudentCount;

updateStudentCount=function(){

    oldUpdate();

    updateStatistics();

}


/*=========================================
        KEYBOARD SHORTCUT
=========================================*/

document.addEventListener("keydown",(e)=>{

    if(e.ctrlKey && e.key==="f"){

        e.preventDefault();

        document.getElementById("studentSearch").focus();

    }

});


/*=========================================
        DOUBLE CLICK TO VIEW
=========================================*/

document.querySelectorAll("#studentTable tbody tr").forEach(row=>{

    row.addEventListener("dblclick",()=>{

        row.querySelector(".view-btn").click();

    });

});


/*=========================================
        LOADING EFFECT
=========================================*/

window.addEventListener("load",()=>{

    document.body.style.opacity="0";

    setTimeout(()=>{

        document.body.style.transition=".5s";

        document.body.style.opacity="1";

    },200);

});
/*=========================================
        PAGINATION
=========================================*/

const rowsPerPage = 5;
let currentPage = 1;

function getVisibleRows() {

    return [...document.querySelectorAll("#studentTable tbody tr")].filter(row => row.style.display!== "none");

}

function showPage(page) {

    const rows = getVisibleRows();

    const totalPages = Math.ceil(rows.length / rowsPerPage);

    if (page < 1) page = 1;

    if (page > totalPages) page = totalPages || 1;

    currentPage = page;

    rows.forEach((row, index) => {

        row.style.visibility = "collapse";

        if (
            index >= (currentPage - 1) * rowsPerPage &&
            index < currentPage * rowsPerPage
        ) {

            row.style.visibility = "visible";

        }

    });

}

showPage(1);


/*=========================================
        PREVIOUS PAGE
=========================================*/

document.getElementById("prevPage").addEventListener("click", () => {

    showPage(currentPage - 1);

});


/*=========================================
        NEXT PAGE
=========================================*/

document.getElementById("nextPage").addEventListener("click", () => {

    showPage(currentPage + 1);

});


/*=========================================
        SAVE SEARCH
=========================================*/

const searchBox = document.getElementById("studentSearch");

searchBox.addEventListener("input", () => {

    localStorage.setItem("studentSearch", searchBox.value);

});


window.addEventListener("load", () => {

    const oldValue = localStorage.getItem("studentSearch");

    if (oldValue) {

        searchBox.value = oldValue;

        searchBox.dispatchEvent(new Event("keyup"));

    }

});


/*=========================================
        SAVE FILTERS
=========================================*/

[collegeFilter, branchFilter, yearFilter, statusFilter].forEach(select => {

    select.addEventListener("change", () => {

        localStorage.setItem(select.id, select.value);

    });

});


window.addEventListener("load", () => {

    [collegeFilter, branchFilter, yearFilter, statusFilter].forEach(select => {

        const value = localStorage.getItem(select.id);

        if (value) {

            select.value = value;

        }

    });

    filterStudents();

});


/*=========================================
        REFRESH TABLE
=========================================*/

function refreshTable() {

    updateStudentCount();

    updateStatistics();

    showPage(currentPage);

}

setInterval(refreshTable, 30000);


/*=========================================
        EXPORT EXCEL (CSV)
=========================================*/

function exportExcel() {

    exportTable();

}

document.querySelector(".table-btn").addEventListener("click", exportExcel);


/*=========================================
        PAGE BUTTONS
=========================================*/

document.querySelectorAll(".page-numbers button").forEach((button, index) => {

    button.addEventListener("click", () => {

        showPage(index + 1);

    });

});


/*=========================================
        UPDATE PAGINATION
=========================================*/

const oldFilter = filterStudents;

filterStudents = function () {

    oldFilter();

    showPage(1);

};

const oldSearch = searchInput.onkeyup;

searchInput.addEventListener("keyup", () => {

    showPage(1);

});


/*=========================================
        SUCCESS MESSAGE
=========================================*/

console.log(" Student Management System Loaded Successfully");