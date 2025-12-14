// dropdown menu //
function dropdown(id) {
// Find the HTML element with this id/
  var option = document.getElementById(id);
  if (option.style.display === "none") {
    option.style.display = "block";
  } else {
    option.style.display = "none";
  }
}
// Click an option to see if it's correct//
function checkAnswer(questionId, box, correct) {
  var options = document
    .getElementById(questionId)
    .getElementsByClassName("option");
// Reset all options' background colors to white//
// Find the question container by id, then find its 3 options//
  options[0].style.background = "white";
  options[1].style.background = "white";
  options[2].style.background = "white";
// Highlight the selected option based on correctness//
  if (correct) {
    box.style.background = "#c8f7c5";
  } else {
    box.style.background = "#f7c5c5";
  }
}