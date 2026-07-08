var subjects = [];
var previousSemesters = [];
var futureSubjects = [];

var subjectForm = document.getElementById("subjectForm");
var previousForm = document.getElementById("previousForm");
var futureForm = document.getElementById("futureForm");

var subjectNameInput = document.getElementById("subjectName");
var subjectCreditsInput = document.getElementById("subjectCredits");
var subjectGradeInput = document.getElementById("subjectGrade");

var previousGpaInput = document.getElementById("previousGpa");
var previousCreditsInput = document.getElementById("previousCredits");

var futureSubjectNameInput = document.getElementById("futureSubjectName");
var futureSubjectCreditsInput = document.getElementById("futureSubjectCredits");
var futureSubjectGradeInput = document.getElementById("futureSubjectGrade");

var subjectTable = document.getElementById("subjectTable");
var previousList = document.getElementById("previousList");
var futureSubjectTable = document.getElementById("futureSubjectTable");

var subjectBreakdownList = document.getElementById("subjectBreakdownList");
var futureBreakdownList = document.getElementById("futureBreakdownList");

var semesterGpaText = document.getElementById("semesterGpa");
var runningCgpaText = document.getElementById("runningCgpa");
var futurePlanGpaText = document.getElementById("futurePlanGpa");
var graduationCgpaText = document.getElementById("graduationCgpa");

var resetButton = document.getElementById("resetButton");

var gradeMap = {
  "A": 4.0,
  "A-": 3.7,
  "B+": 3.3,
  "B": 3.0,
  "B-": 2.7,
  "C+": 2.3,
  "C": 2.0,
  "C-": 1.7,
  "D+": 1.3,
  "D": 1.0,
  "F": 0.0
};

function parseGradeValue(value) {
  var raw = String(value).trim();

  if (!raw) {
    return null;
  }

  var numericValue = Number(raw);
  if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 4.5) {
    return numericValue;
  }

  var normalized = raw.toUpperCase().replace(/\s+/g, "");
  if (gradeMap[normalized] !== undefined) {
    return gradeMap[normalized];
  }

  return null;
}

function formatGradeLabel(item) {
  if (item.gradeLabel) {
    return item.gradeLabel;
  }
  return item.grade.toFixed(1);
}

subjectForm.addEventListener("submit", function (event) {
  event.preventDefault();

  var gradeValue = parseGradeValue(subjectGradeInput.value);

  if (gradeValue === null) {
    alert("Please enter a valid grade such as A, B+, or 4.0.");
    return;
  }

  var subject = {
    name: subjectNameInput.value.trim(),
    credits: Number(subjectCreditsInput.value),
    grade: gradeValue,
    gradeLabel: subjectGradeInput.value.trim()
  };

  subjects.push(subject);
  subjectForm.reset();
  subjectCreditsInput.value = 3;
  subjectGradeInput.value = "4.0";
  subjectNameInput.focus();

  updateScreen();
});

previousForm.addEventListener("submit", function (event) {
  event.preventDefault();

  var semester = {
    gpa: Number(previousGpaInput.value),
    credits: Number(previousCreditsInput.value)
  };

  previousSemesters.push(semester);
  previousForm.reset();
  previousGpaInput.value = 3.5;
  previousCreditsInput.value = 15;

  updateScreen();
});

futureForm.addEventListener("submit", function (event) {
  event.preventDefault();

  var gradeValue = parseGradeValue(futureSubjectGradeInput.value);

  if (gradeValue === null) {
    alert("Please enter a valid grade such as A, B+, or 4.0.");
    return;
  }

  var futureSubject = {
    name: futureSubjectNameInput.value.trim(),
    credits: Number(futureSubjectCreditsInput.value),
    grade: gradeValue,
    gradeLabel: futureSubjectGradeInput.value.trim()
  };

  futureSubjects.push(futureSubject);
  futureForm.reset();
  futureSubjectCreditsInput.value = 3;
  futureSubjectGradeInput.value = "4.0";
  futureSubjectNameInput.focus();

  updateScreen();
});

resetButton.addEventListener("click", function () {
  subjects = [];
  previousSemesters = [];
  futureSubjects = [];

  updateScreen();
});

function calculateSubjectGpa(subjectList) {
  var totalPoints = 0;
  var totalCredits = 0;

  for (var i = 0; i < subjectList.length; i++) {
    totalPoints = totalPoints + subjectList[i].credits * subjectList[i].grade;
    totalCredits = totalCredits + subjectList[i].credits;
  }

  if (totalCredits === 0) {
    return 0;
  }

  return totalPoints / totalCredits;
}

function calculateTotalCredits(subjectList) {
  var totalCredits = 0;

  for (var i = 0; i < subjectList.length; i++) {
    totalCredits = totalCredits + subjectList[i].credits;
  }

  return totalCredits;
}

function calculateCgpa(semesters) {
  var totalPoints = 0;
  var totalCredits = 0;

  for (var i = 0; i < semesters.length; i++) {
    totalPoints = totalPoints + semesters[i].gpa * semesters[i].credits;
    totalCredits = totalCredits + semesters[i].credits;
  }

  if (totalCredits === 0) {
    return 0;
  }

  return totalPoints / totalCredits;
}

function getAllCompletedSemesters() {
  var allSemesters = previousSemesters.slice();
  var currentGpa = calculateSubjectGpa(subjects);
  var currentCredits = calculateTotalCredits(subjects);

  if (currentCredits > 0) {
    allSemesters.push({
      gpa: currentGpa,
      credits: currentCredits
    });
  }

  return allSemesters;
}

function updateScreen() {
  showSubjects();
  showSemesterList(previousList, previousSemesters, "Semester", deletePreviousSemester);
  showFutureSubjects();
  showBreakdown(subjectBreakdownList, subjects, "No subjects added yet.");
  showBreakdown(futureBreakdownList, futureSubjects, "No future subjects planned.");
  showResults();
}

function showSubjects() {
  subjectTable.innerHTML = "";

  if (subjects.length === 0) {
    var emptyRow = document.createElement("tr");
    var emptyCell = document.createElement("td");
    emptyCell.colSpan = 4;
    emptyCell.className = "empty-message";
    emptyCell.textContent = "No subjects added yet.";
    emptyRow.appendChild(emptyCell);
    subjectTable.appendChild(emptyRow);
    return;
  }

  for (var i = 0; i < subjects.length; i++) {
    var row = document.createElement("tr");

    var nameCell = document.createElement("td");
    var creditsCell = document.createElement("td");
    var gradeCell = document.createElement("td");
    var actionCell = document.createElement("td");

    nameCell.textContent = subjects[i].name;
    creditsCell.textContent = subjects[i].credits;
    gradeCell.textContent = formatGradeLabel(subjects[i]);

    var deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "Remove";
    deleteButton.addEventListener("click", function (index) {
      return function () {
        deleteSubject(index);
      };
    }(i));

    actionCell.appendChild(deleteButton);
    row.appendChild(nameCell);
    row.appendChild(creditsCell);
    row.appendChild(gradeCell);
    row.appendChild(actionCell);

    subjectTable.appendChild(row);
  }
}

function showSemesterList(listElement, semesters, title, deleteFunction) {
  listElement.innerHTML = "";

  if (semesters.length === 0) {
    var emptyItem = document.createElement("li");
    emptyItem.className = "empty-message";
    emptyItem.textContent = "No entries yet.";
    listElement.appendChild(emptyItem);
    return;
  }

  for (var i = 0; i < semesters.length; i++) {
    var item = document.createElement("li");

    var info = document.createElement("div");
    var strong = document.createElement("strong");
    var span = document.createElement("span");

    strong.textContent = title + " " + (i + 1);
    span.textContent = "GPA: " + semesters[i].gpa.toFixed(2) + " | Credits: " + semesters[i].credits;

    info.appendChild(strong);
    info.appendChild(span);

    var button = document.createElement("button");
    button.className = "delete-button";
    button.type = "button";
    button.textContent = "Remove";
    button.addEventListener("click", function (index) {
      return function () {
        deleteFunction(index);
      };
    }(i));

    item.appendChild(info);
    item.appendChild(button);
    listElement.appendChild(item);
  }
}

function showFutureSubjects() {
  futureSubjectTable.innerHTML = "";

  if (futureSubjects.length === 0) {
    var emptyRow = document.createElement("tr");
    var emptyCell = document.createElement("td");
    emptyCell.colSpan = 4;
    emptyCell.className = "empty-message";
    emptyCell.textContent = "No future subject goals added yet.";
    emptyRow.appendChild(emptyCell);
    futureSubjectTable.appendChild(emptyRow);
    return;
  }

  for (var i = 0; i < futureSubjects.length; i++) {
    var row = document.createElement("tr");

    var nameCell = document.createElement("td");
    var creditsCell = document.createElement("td");
    var gradeCell = document.createElement("td");
    var actionCell = document.createElement("td");

    nameCell.textContent = futureSubjects[i].name;
    creditsCell.textContent = futureSubjects[i].credits;
    gradeCell.textContent = formatGradeLabel(futureSubjects[i]);

    var deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "Remove";
    deleteButton.addEventListener("click", function (index) {
      return function () {
        deleteFutureSubject(index);
      };
    }(i));

    actionCell.appendChild(deleteButton);
    row.appendChild(nameCell);
    row.appendChild(creditsCell);
    row.appendChild(gradeCell);
    row.appendChild(actionCell);

    futureSubjectTable.appendChild(row);
  }
}

function showBreakdown(listElement, subjectList, emptyMessage) {
  listElement.innerHTML = "";

  if (subjectList.length === 0) {
    var emptyItem = document.createElement("li");
    emptyItem.className = "empty-message";
    emptyItem.textContent = emptyMessage;
    listElement.appendChild(emptyItem);
    return;
  }

  for (var i = 0; i < subjectList.length; i++) {
    var item = document.createElement("li");
    var subjectName = document.createElement("span");
    var subjectMeta = document.createElement("span");

    subjectName.textContent = subjectList[i].name;
    subjectMeta.textContent =
      subjectList[i].credits + " cr • " + formatGradeLabel(subjectList[i]) + " • " +
      (subjectList[i].credits * subjectList[i].grade).toFixed(2) + " pts";

    item.appendChild(subjectName);
    item.appendChild(subjectMeta);
    listElement.appendChild(item);
  }
}

function showResults() {
  var currentGpa = calculateSubjectGpa(subjects);
  var completedSemesters = getAllCompletedSemesters();
  var runningCgpa = calculateCgpa(completedSemesters);

  var futureGpa = calculateSubjectGpa(futureSubjects);
  var futureCredits = calculateTotalCredits(futureSubjects);

  var graduationSemesters = completedSemesters.slice();

  if (futureCredits > 0) {
    graduationSemesters.push({
      gpa: futureGpa,
      credits: futureCredits
    });
  }

  var graduationCgpa = calculateCgpa(graduationSemesters);

  semesterGpaText.textContent = currentGpa.toFixed(2);
  runningCgpaText.textContent = runningCgpa.toFixed(2);
  futurePlanGpaText.textContent = futureGpa.toFixed(2);
  graduationCgpaText.textContent = graduationCgpa.toFixed(2);
}

function deleteSubject(index) {
  subjects.splice(index, 1);
  updateScreen();
}

function deletePreviousSemester(index) {
  previousSemesters.splice(index, 1);
  updateScreen();
}

function deleteFutureSubject(index) {
  futureSubjects.splice(index, 1);
  updateScreen();
}

updateScreen();