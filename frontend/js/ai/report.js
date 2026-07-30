/*=========================================================
                Career OS AI
              REPORTS MANAGEMENT
=========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    const searchInput = document.getElementById("reportSearch");
    const reportTable = document.getElementById("reportTable");
    const refreshBtn = document.querySelector(".refresh-btn");
    const exportBtn = document.querySelector(".export-btn");

    updateReportCount();

    /*=========================================
                LIVE SEARCH
    =========================================*/

    searchInput.addEventListener("keyup", function () {

        const value = this.value.toLowerCase().trim();

        const rows = reportTable.querySelectorAll("tbody tr");

        rows.forEach(row => {

            const text = row.textContent.toLowerCase();

            if (text.includes(value)) {

                row.style.display = "";

            } else {

                row.style.display = "none";

            }

        });

        updateReportCount();

    });

    /*=========================================
                REFRESH
    =========================================*/

    refreshBtn.addEventListener("click", () => {

        searchInput.value = "";

        reportTable.querySelectorAll("tbody tr").forEach(row => {

            row.style.display = "";

        });

        updateReportCount();

        showToast("Reports refreshed successfully");

    });

    /*=========================================
                EXPORT CSV
    =========================================*/

    exportBtn.addEventListener("click", exportTable);

});


/*=========================================================
            UPDATE DASHBOARD
=========================================================*/

function updateReportCount() {

    const rows = document.querySelectorAll("#reportTable tbody tr");

    let total = 0;
    let completed = 0;
    let downloads = 0;
    let pending = 0;

    rows.forEach(row => {

        if (row.style.display === "none") return;

        total++;

        const status = row.cells[7].innerText.trim();

        const count = parseInt(row.cells[9].innerText);

        downloads += count;

        if (status === "Completed") {

            completed++;

        }

        if (status === "Pending") {

            pending++;

        }

    });

    document.getElementById("totalReports").innerText = total;

    document.getElementById("generatedToday").innerText = completed;

    document.getElementById("downloads").innerText = downloads;

    document.getElementById("pendingReports").innerText = pending;

}


/*=========================================================
                EXPORT CSV
=========================================================*/

function exportTable() {

    let csv = [];

    const rows = document.querySelectorAll("#reportTable tr");

    rows.forEach(row => {

        let cols = row.querySelectorAll("th,td");

        let data = [];

        cols.forEach(col => {

            if (!col.querySelector("button")) {

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

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "reports.csv";

    a.click();

    URL.revokeObjectURL(url);

}


/*=========================================================
                TOAST MESSAGE
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
    toast.style.boxShadow = "0 10px 25px rgba(0,0,0,.3)";
    toast.style.zIndex = "99999";

    document.body.appendChild(toast);

    setTimeout(() => {

        toast.remove();

    }, 2500);

}
/*=========================================================
                    REPORT MODAL
=========================================================*/

const modal = document.getElementById("reportModal");
const closeModal = document.querySelector(".close-modal");

const modalID = document.getElementById("modalID");
const modalReportName = document.getElementById("modalReportName");
const modalCategory = document.getElementById("modalCategory");
const modalReportCategory = document.getElementById("modalReportCategory");
const modalDepartment = document.getElementById("modalDepartment");
const modalGeneratedBy = document.getElementById("modalGeneratedBy");
const modalDate = document.getElementById("modalDate");
const modalSize = document.getElementById("modalSize");
const modalStatus = document.getElementById("modalStatus");
const modalDownloads = document.getElementById("modalDownloads");


/*=========================================================
                    VIEW REPORT
=========================================================*/

document.querySelectorAll(".view-btn").forEach(button => {

    button.addEventListener("click", function () {

        const row = this.closest("tr");

        modalID.innerText = row.cells[0].innerText;
        modalReportName.innerText = row.cells[1].innerText;
        modalCategory.innerText = row.cells[2].innerText;
        modalReportCategory.innerText = row.cells[2].innerText;
        modalDepartment.innerText = row.cells[3].innerText;
        modalGeneratedBy.innerText = row.cells[4].innerText;
        modalDate.innerText = row.cells[5].innerText;
        modalSize.innerText = row.cells[6].innerText;
        modalStatus.innerText = row.cells[7].innerText;
        modalDownloads.innerText = row.cells[9].innerText;

        modal.style.display = "flex";
        document.body.style.overflow = "hidden";

    });

});


/*=========================================================
                    CLOSE MODAL
=========================================================*/

closeModal.addEventListener("click", () => {

    modal.style.display = "none";
    document.body.style.overflow = "auto";

});

window.addEventListener("click", (e) => {

    if (e.target === modal) {

        modal.style.display = "none";
        document.body.style.overflow = "auto";

    }

});

document.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {

        modal.style.display = "none";
        document.body.style.overflow = "auto";

    }

});


/*=========================================================
                DOWNLOAD REPORT
=========================================================*/

document.querySelectorAll(".download-btn").forEach(button => {

    button.addEventListener("click", function () {

        let reportName = "Report";

        const row = this.closest("tr");

        if (row) {

            reportName = row.cells[1].innerText;

        } else {

            reportName = modalReportName.innerText;

        }

        showToast(reportName + " downloaded");

    });

});


/*=========================================================
                    PRINT REPORT
=========================================================*/

document.querySelectorAll(".print-btn").forEach(button => {

    button.addEventListener("click", function () {

        window.print();

    });

});


/*=========================================================
                    DELETE REPORT
=========================================================*/

document.querySelectorAll(".delete-btn").forEach(button => {

    button.addEventListener("click", function () {

        if (!confirm("Are you sure you want to delete this report?"))
            return;

        const row = this.closest("tr");

        if (row) {

            row.remove();

            updateReportCount();

            showToast("Report deleted successfully");

            return;

        }

        modal.style.display = "none";

        showToast("Report deleted successfully");

    });

});


/*=========================================================
                DOUBLE CLICK ROW
=========================================================*/

document.querySelectorAll("#reportTable tbody tr").forEach(row => {

    row.addEventListener("dblclick", () => {

        row.querySelector(".view-btn").click();

    });

});
/*=========================================================
                FILTERS
=========================================================*/

const reportTypeFilter = document.getElementById("reportTypeFilter");
const departmentFilter = document.getElementById("departmentFilter");
const statusFilter = document.getElementById("statusFilter");
const reportDate = document.getElementById("reportDate");

reportTypeFilter.addEventListener("change", filterReports);
departmentFilter.addEventListener("change", filterReports);
statusFilter.addEventListener("change", filterReports);
reportDate.addEventListener("change", filterReports);

/*=========================================================
                FILTER REPORTS
=========================================================*/

function filterReports() {

    const rows = document.querySelectorAll("#reportTable tbody tr");

    rows.forEach(row => {

        let show = true;

        const category = row.cells[2].innerText.trim();
        const department = row.cells[3].innerText.trim();
        const status = row.cells[7].innerText.trim();
        const date = row.cells[5].innerText.trim();

        if (reportTypeFilter.value!== "" &&
            reportTypeFilter.value!== category) {
            show = false;
        }

        if (departmentFilter.value!== "" &&
            departmentFilter.value!== department) {
            show = false;
        }

        if (statusFilter.value!== "" &&
            statusFilter.value!== status) {
            show = false;
        }

        if (reportDate.value!== "") {

            const selectedDate = new Date(reportDate.value).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"});

            if (date!== selectedDate) {
                show = false;
            }
        }

        row.style.display = show? "": "none";

    });

    updateReportCount();

}

/*=========================================================
                CLEAR FILTERS
=========================================================*/

document.getElementById("clearFilters").addEventListener("click", () => {

    reportTypeFilter.selectedIndex = 0;
    departmentFilter.selectedIndex = 0;
    statusFilter.selectedIndex = 0;
    reportDate.value = "";
    document.getElementById("reportSearch").value = "";

    document.querySelectorAll("#reportTable tbody tr").forEach(row => {

        row.style.display = "";

    });

    updateReportCount();

    showToast("Filters cleared");

});

/*=========================================================
                GENERATE REPORT
=========================================================*/

document.querySelector(".generate-report-btn").addEventListener("click", () => {

    const type = document.getElementById("generateType").value;
    const format = document.getElementById("exportFormat").value;

    showToast(type + " generated successfully (" + format + ")");

});

/*=========================================================
                PREVIEW REPORT
=========================================================*/

document.querySelector(".preview-report-btn").addEventListener("click", () => {

    showToast("Report preview opened");

});

/*=========================================================
            SAVE SEARCH & FILTERS
=========================================================*/

const reportSearch = document.getElementById("reportSearch");

reportSearch.addEventListener("input", () => {

    localStorage.setItem("reportSearch", reportSearch.value);

});

[
    reportTypeFilter,
    departmentFilter,
    statusFilter
].forEach(filter => {

    filter.addEventListener("change", () => {

        localStorage.setItem(filter.id, filter.value);

    });

});

/*=========================================================
            LOAD SAVED FILTERS
=========================================================*/

window.addEventListener("load", () => {

    const savedSearch = localStorage.getItem("reportSearch");

    if (savedSearch) {

        reportSearch.value = savedSearch;

        reportSearch.dispatchEvent(new Event("keyup"));

    }

    [
        reportTypeFilter,
        departmentFilter,
        statusFilter
    ].forEach(filter => {

        const value = localStorage.getItem(filter.id);

        if (value) {

            filter.value = value;

        }

    });

    filterReports();

});

/*=========================================================
            CTRL + F SHORTCUT
=========================================================*/

document.addEventListener("keydown", (e) => {

    if (e.ctrlKey && e.key === "f") {

        e.preventDefault();

        reportSearch.focus();

    }

});
/*=========================================================
                    PAGINATION
=========================================================*/

const rowsPerPage = 5;
let currentPage = 1;

function getVisibleRows() {

    return [...document.querySelectorAll("#reportTable tbody tr")].filter(row => row.style.display!== "none");

}

function showPage() {

    const rows = getVisibleRows();

    rows.forEach((row, index) => {

        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        row.style.display =
            (index >= start && index < end)? "": "none";

    });

    updatePagination();

}

function updatePagination() {

    const container = document.querySelector(".page-numbers");

    container.innerHTML = "";

    const totalPages =
        Math.ceil(getVisibleRows().length / rowsPerPage) || 1;

    for (let i = 1; i <= totalPages; i++) {

        const btn = document.createElement("button");

        btn.innerText = i;

        if (i === currentPage)
            btn.classList.add("active");

        btn.onclick = () => {

            currentPage = i;

            showPage();

        };

        container.appendChild(btn);

    }

}

/*=========================================================
                PREVIOUS PAGE
=========================================================*/

document.getElementById("prevPage").addEventListener("click", () => {

    if (currentPage > 1) {

        currentPage--;

        showPage();

    }

});

/*=========================================================
                NEXT PAGE
=========================================================*/

document.getElementById("nextPage").addEventListener("click", () => {

    const totalPages =
        Math.ceil(getVisibleRows().length / rowsPerPage);

    if (currentPage < totalPages) {

        currentPage++;

        showPage();

    }

});

/*=========================================================
                EXPORT ALL
=========================================================*/

document.querySelector(".table-btn").addEventListener("click", () => {

    exportTable();

    showToast("All reports exported");

});

/*=========================================================
                AUTO REFRESH
=========================================================*/

function refreshDashboard() {

    updateReportCount();

    showPage();

}

setInterval(refreshDashboard, 30000);

/*=========================================================
                PREMIUM TOAST
=========================================================*/

function premiumToast(message, color = "#10B981") {

    const toast = document.createElement("div");

    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i>
      <span>${message}</span>`;

    toast.style.position = "fixed";
    toast.style.top = "25px";
    toast.style.right = "25px";
    toast.style.background = color;
    toast.style.color = "#fff";
    toast.style.padding = "15px 22px";
    toast.style.borderRadius = "12px";
    toast.style.display = "flex";
    toast.style.alignItems = "center";
    toast.style.gap = "10px";
    toast.style.fontWeight = "600";
    toast.style.boxShadow = "0 15px 30px rgba(0,0,0,.30)";
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
            INITIALIZE PAGE
=========================================================*/

window.addEventListener("load", () => {

    updateReportCount();

    updatePagination();

    showPage();

    premiumToast("Reports Dashboard Loaded");

});

/*=========================================================
            CONSOLE MESSAGE
=========================================================*/

console.log(`
==========================================
        Career OS AI REPORTS MODULE
==========================================
 Live Search
 Advanced Filters
 Generate Report
 Preview Report
 View Report
 Download Report
 Print Report
 Delete Report
 CSV Export
 Export All
 Pagination
 Auto Refresh
 Local Storage
==========================================
`);