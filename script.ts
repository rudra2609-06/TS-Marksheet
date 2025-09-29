document.addEventListener("DOMContentLoaded", () => {
  interface CandidateGenralDetail {
    name: string;
    regNo: string;
    enrollNo: string;
    trainingCentreNo: string;
  }

  interface SubjectAndMarks {
    subject: string;
    theoryMark: number;
    practicalMark: number;
    totalMark: number;
  }

  interface Marksheet {
    subjects: SubjectAndMarks[];
    generalInfo: CandidateGenralDetail;
    date: string;
  }

  const inputDate = document.querySelector("#date") as HTMLInputElement;
  const displayTotal3 = document.querySelector("#total3") as HTMLTableCellElement;
  const inputPractical3 = document.querySelector("#practical3") as HTMLInputElement;
  const inputTheory3 = document.querySelector("#theory3") as HTMLInputElement;
  const displayTotal2 = document.querySelector("#total2") as HTMLTableCellElement;
  const inputPractical2 = document.querySelector("#practical2") as HTMLInputElement;
  const inputTheory2 = document.querySelector("#theory2") as HTMLInputElement;
  const displayTotal1 = document.querySelector("#total1") as HTMLTableCellElement;
  const inputPractical1 = document.querySelector("#practical1") as HTMLInputElement;
  const inputTheory1 = document.querySelector("#theory1") as HTMLInputElement;
  const inputEnrollmentNo = document.querySelector("#candidateEnrollmentNo") as HTMLInputElement;
  const inputRegNo = document.querySelector("#candidateRegNo") as HTMLInputElement;
  const inputname = document.querySelector("#candidateName") as HTMLInputElement;
  const inputTrainingCenter = document.querySelector("#candidateTrainingCentre") as HTMLInputElement;
  const generateMarksheetBtn = document.querySelector("#generateMarksheetBtn") as HTMLButtonElement;

  function renderDetails(marksheet: Marksheet): void {
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
    const allInputs = document.querySelectorAll("tbody input[type='number']");
    allInputs.forEach((input) => {
      (input as HTMLInputElement).disabled = true;
    });

    // Change button text and disable it
    generateMarksheetBtn.textContent = "Marksheet Generated";
    generateMarksheetBtn.disabled = true;
    generateMarksheetBtn.classList.remove("hover:bg-blue-700");
    generateMarksheetBtn.classList.add("bg-gray-400", "cursor-not-allowed");
  }

  function saveCandidateDetails(marksheet: Marksheet): void {
    localStorage.setItem("marksheet", JSON.stringify(marksheet));
  }

  function loadSavedMarksheet(): Marksheet | null {
    const saved = localStorage.getItem("marksheet");
    if (saved) {
      return JSON.parse(saved) as Marksheet;
    }
    return null;
  }

  // Load saved marksheet on page load
  const savedMarksheet = loadSavedMarksheet();
  if (savedMarksheet) {
    // Populate the subject marks in the table
    savedMarksheet.subjects.forEach((subject, index) => {
      const theoryInput = document.querySelector(`#theory${index + 1}`) as HTMLInputElement;
      const practicalInput = document.querySelector(`#practical${index + 1}`) as HTMLInputElement;
      const totalCell = document.querySelector(`#total${index + 1}`) as HTMLTableCellElement;

      if (theoryInput) theoryInput.value = subject.theoryMark.toString();
      if (practicalInput) practicalInput.value = subject.practicalMark.toString();
      if (totalCell) totalCell.innerText = subject.totalMark.toString();
    });

    // Render and lock the form
    renderDetails(savedMarksheet);
    console.log("Loaded saved marksheet:", savedMarksheet);
  }

  generateMarksheetBtn.addEventListener("click", () => {
    let storedMarks: SubjectAndMarks[] = [];
    const rows = document.querySelectorAll("tbody tr");

    rows.forEach((row) => {
      const subjectNameCell = row.querySelector("td:nth-child(2)") as HTMLTableCellElement;
      const subjectName = subjectNameCell ? subjectNameCell.innerText : "Unknown";
      const theoryInput = row.querySelector("input[id^='theory']") as HTMLInputElement;
      const practicalInput = row.querySelector("input[id^='practical']") as HTMLInputElement;
      const totalCell = row.querySelector(".total-cell") as HTMLTableCellElement;

      const theoryMark = parseFloat(theoryInput?.value.trim() || "0") || 0;
      const practicalMark = parseFloat(practicalInput?.value.trim() || "0") || 0;
      const totalMark = theoryMark + practicalMark;

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

    const marksheet: Marksheet = {
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