var subjects = [];
var previousSemesters = [];
var futureSemesters = [];

var subjectForm = document.getElementById("subjectForm");
var previousForm = document.getElementById("previousForm");
var futureForm = document.getElementById("futureForm");

var subjectNameInput = document.getElementById("subjectName");
var subjectCreditsInput = document.getElementById("subjectCredits");
var subjectGradeInput = document.getElementById("subjectGrade");

var previousGpaInput = document.getElementById("previousGpa");
var previousCreditsInput = document.getElementById("previousCredits");
var futureGpaInput = document.getElementById("futureGpa");
var futureCreditsInput = document.getElementById("futureCredits");

var subjectTable = document.getElementById("subjectTable");
var previousList = document.getElementById("previousList");
var futureList = document.getElementById("futureList");

var semesterGpaText = document.getElementById("semesterGpa");
var runningCgpaText = document.getElementById("runningCgpa");
var graduationCgpaText = document.getElementById("graduationCgpa");

subjectForm.addEventListener("submit", function (event) {
  event.preventDefault();

  var subject = {
    name: subjectNameInput.value,
    credits: Number(subjectCreditsInput.value),
    grade: Number(subjectGradeInput.value)
  };

  subjects.push(subject);
  subjectForm.reset();
  subjectCreditsInput.value = 3;
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

  updateScreen();
});

futureForm.addEventListener("submit", function (event) {
  event.preventDefault();

  var semester = {
    gpa: Number(futureGpaInput.value),
    credits: Number(futureCreditsInput.value)
  };

  futureSemesters.push(semester);
  futureForm.reset();

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
  showSemesterList(futureList, futureSemesters, "What If", deleteFutureSemester);
  showResults();
}

function showSubjects() {
  subjectTable.innerHTML = "";

  if (subjects.length === 0) {
    subjectTable.innerHTML = '<tr><td colspan="4" class="empty-message">No subjects added yet.</td></tr>';
    return;
  }

  for (var i = 0; i < subjects.length; i++) {
    var row = document.createElement("tr");
    var nameCell = document.createElement("td");
    var creditsCell = document.createElement("td");
    var gradeCell = document.createElement("td");
    var actionCell = document.createElement("td");
    var deleteButton = document.createElement("button");

    nameCell.textContent = subjects[i].name;
    creditsCell.textContent = subjects[i].credits;
    gradeCell.textContent = subjects[i].grade;
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Remove";
    deleteButton.onclick = function (index) {
      return function () {
        deleteSubject(index);
      };
    }(i);

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
    emptyItem.innerHTML = '<span>No entries yet.</span>';
    listElement.appendChild(emptyItem);
    return;
  }

  for (var i = 0; i < semesters.length; i++) {
    var item = document.createElement("li");
    var button = document.createElement("button");

    button.className = "delete-button";
    button.textContent = "Remove";
    button.onclick = function (index) {
      return function () {
        deleteFunction(index);
      };
    }(i);

    item.innerHTML =
      "<div>" +
      "<strong>" + title + " " + (i + 1) + "</strong>" +
      "<span>GPA: " + semesters[i].gpa.toFixed(2) + " | Credits: " + semesters[i].credits + "</span>" +
      "</div>";

    item.appendChild(button);
    listElement.appendChild(item);
  }
}

function showResults() {
  var currentGpa = calculateSubjectGpa(subjects);
  var completedSemesters = getAllCompletedSemesters();
  var runningCgpa = calculateCgpa(completedSemesters);
  var graduationSemesters = completedSemesters.concat(futureSemesters);
  var graduationCgpa = calculateCgpa(graduationSemesters);

  semesterGpaText.textContent = currentGpa.toFixed(2);
  runningCgpaText.textContent = runningCgpa.toFixed(2);
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

function deleteFutureSemester(index) {
  futureSemesters.splice(index, 1);
  updateScreen();
}

updateScreen();
