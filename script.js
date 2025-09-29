document.addEventListener("DOMContentLoaded", function () {
    var inputDate = document.querySelector("#date");
    var displayTotal3 = document.querySelector("#total3");
    var inputPractical3 = document.querySelector("#practical3");
    var inputTheory3 = document.querySelector("#theory3");
    var displayTotal2 = document.querySelector("#total2");
    var inputPractical2 = document.querySelector("#practical2");
    var inputTheory2 = document.querySelector("#theory2");
    var displayTotal1 = document.querySelector("#total1");
    var inputPractical1 = document.querySelector("#practical1");
    var inputTheory1 = document.querySelector("#theory1");
    var inputEnrollmentNo = document.querySelector("#candidateEnrollmentNo");
    var inputRegNo = document.querySelector("#candidateRegNo");
    var inputname = document.querySelector("#candidateName");
    var inputTrainingCenter = document.querySelector("#candidateTrainingCentre");
    var generateMarksheetBtn = document.querySelector("#generateMarksheetBtn");
    function renderDetails(marksheet) {
        // Disable and populate candidate info inputs
        inputname.value = marksheet.generalInfo.name;
        inputname.disabled = true;
        inputRegNo.value = marksheet.generalInfo.regNo;
        inputRegNo.disabled = true;
        inputEnrollmentNo.value = marksheet.generalInfo.enrollNo;
        inputEnrollmentNo.disabled = true;
        inputTrainingCenter.value = marksheet.generalInfo.trainingCentreNo;
        inputTrainingCenter.disabled = true;
        inputDate.value = marksheet.date;
        inputDate.disabled = true;
        // Disable all theory and practical inputs
        var allInputs = document.querySelectorAll("tbody input[type='number']");
        allInputs.forEach(function (input) {
            input.disabled = true;
        });
        // Change button text and disable it
        generateMarksheetBtn.textContent = "Marksheet Generated";
        generateMarksheetBtn.disabled = true;
        generateMarksheetBtn.classList.remove("hover:bg-blue-700");
        generateMarksheetBtn.classList.add("bg-gray-400", "cursor-not-allowed");
    }
    function saveCandidateDetails(marksheet) {
        localStorage.setItem("marksheet", JSON.stringify(marksheet));
    }
    function loadSavedMarksheet() {
        var saved = localStorage.getItem("marksheet");
        if (saved) {
            return JSON.parse(saved);
        }
        return null;
    }
    // Load saved marksheet on page load
    var savedMarksheet = loadSavedMarksheet();
    if (savedMarksheet) {
        // Populate the subject marks in the table
        savedMarksheet.subjects.forEach(function (subject, index) {
            var theoryInput = document.querySelector("#theory".concat(index + 1));
            var practicalInput = document.querySelector("#practical".concat(index + 1));
            var totalCell = document.querySelector("#total".concat(index + 1));
            if (theoryInput)
                theoryInput.value = subject.theoryMark.toString();
            if (practicalInput)
                practicalInput.value = subject.practicalMark.toString();
            if (totalCell)
                totalCell.innerText = subject.totalMark.toString();
        });
        // Render and lock the form
        renderDetails(savedMarksheet);
        console.log("Loaded saved marksheet:", savedMarksheet);
    }
    generateMarksheetBtn.addEventListener("click", function () {
        var storedMarks = [];
        var rows = document.querySelectorAll("tbody tr");
        rows.forEach(function (row) {
            var subjectNameCell = row.querySelector("td:nth-child(2)");
            var subjectName = subjectNameCell ? subjectNameCell.innerText : "Unknown";
            var theoryInput = row.querySelector("input[id^='theory']");
            var practicalInput = row.querySelector("input[id^='practical']");
            var totalCell = row.querySelector(".total-cell");
            var theoryMark = parseFloat((theoryInput === null || theoryInput === void 0 ? void 0 : theoryInput.value.trim()) || "0") || 0;
            var practicalMark = parseFloat((practicalInput === null || practicalInput === void 0 ? void 0 : practicalInput.value.trim()) || "0") || 0;
            var totalMark = theoryMark + practicalMark;
            if (totalCell) {
                totalCell.innerText = totalMark.toString();
            }
            storedMarks.push({
                subject: subjectName,
                theoryMark: theoryMark,
                practicalMark: practicalMark,
                totalMark: totalMark,
            });
        });
        var marksheet = {
            subjects: storedMarks,
            generalInfo: {
                name: inputname.value,
                regNo: inputRegNo.value,
                enrollNo: inputEnrollmentNo.value,
                trainingCentreNo: inputTrainingCenter.value,
            },
            date: inputDate.value,
        };
        saveCandidateDetails(marksheet);
        renderDetails(marksheet);
        console.log("Marksheet saved:", marksheet);
    });
});
