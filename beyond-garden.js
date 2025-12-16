// 1) Get all borough buttons (DOM: find elements by class name)

var buttons = document.getElementsByClassName("borough-btn");

// Debug: check we found 5 buttons
console.log("buttons:", buttons.length);


// 2) Get the text area + list area (DOM: find elements by id)

var selectedText = document.getElementById("selected-borough");
var parksList = document.getElementById("parks-list");


// 3) Function: runs when user clicks a borough button

async function onClickBorough(boroughName) {

  // Update the page to show which borough was clicked
  selectedText.innerHTML = "Selected: " + boroughName;

  // Convert the borough name (from button) into the borough code used in the dataset
  // Dataset uses: M, B, Q, X, R
  var code = "";

  // Use if/else to match the clicked borough name to the dataset code
  if (boroughName == "manhattan") {
    code = "M";
  } else if (boroughName == "brooklyn") {
    code = "B";
  } else if (boroughName == "queens") {
    code = "Q";
  } else if (boroughName == "bronx") {
    code = "X";
  } else if (boroughName == "staten") {
    code = "R";
  }

  // Build the API URL (NYC Open Data)
  
  var url =
    "https://data.cityofnewyork.us/resource/enfh-gkve.json?$where=borough=%27" +
    code +
    "%27&$limit=5";

  // Fetch data from the API
  
  var response = await fetch(url);
  var jsonData = await response.json();

  // If the API returned no results, show a message and stop the function
  if (jsonData.length == 0) {
    parksList.innerHTML = "<p>No parks found.</p>";
    return;
  }

  // Sort by acres (largest to smallest) using two loops

  for (var a = 0; a < jsonData.length; a++) {
    for (var b = a + 1; b < jsonData.length; b++) {

      // Get acres for two records
      var acresA = jsonData[a].acres;
      var acresB = jsonData[b].acres;

      // If acres is missing, treat it as 0
      if (acresA == undefined) { acresA = 0; }
      if (acresB == undefined) { acresB = 0; }

      // Convert to number
      // If the lecture did not show this trick, you can remove sorting to be safer.
      acresA = acresA * 1;
      acresB = acresB * 1;

      // If B is bigger than A, swap their positions
      if (acresB > acresA) {
        var temp = jsonData[a];
        jsonData[a] = jsonData[b];
        jsonData[b] = temp;
      }
    }
  }

  // Build HTML to show on page
  var html = "";

  // Show at most 8 parks
  var maxShow = 8;
  if (jsonData.length < maxShow) {
    maxShow = jsonData.length;
  }

  // Loop through the first maxShow items
  for (var i = 0; i < maxShow; i++) {

    // Read fields from the API record
    // Park name field in this dataset is "signname"
    var name = jsonData[i].signname;
    var address = jsonData[i].address;
    var acres = jsonData[i].acres;

    // If a field is missing, show fallback text instead of breaking the page
    if (name == undefined) {
      name = "(No name)";
    }
    if (address == undefined) {
      address = "(No address)";
    }
    if (acres == undefined) {
      acres = "";
    } else {
      acres = acres + " acres";
    }

    // Add one "card" for each park into the HTML string

    html = html + "<div class='park-card'>";
    html = html + "<b>" + name + "</b><br>";
    html = html + address + "<br>";
    html = html + acres;
    html = html + "</div>";
  }

  // Put the final HTML into the page
  // Use innerHTML to show a message on the webpage (inside the results box).
  parksList.innerHTML = html;

  // Debug logs (optional)
  console.log("boroughName:", boroughName);
  console.log("code:", code);
}


// 4) Attach onclick to every button (OUTSIDE function)
// We do this once when the page loads
for (var i = 0; i < buttons.length; i++) {
  buttons[i].onclick = function () {

    // Reset all buttons to their default class.
// This removes the "active" style so only the clicked button can be highlighted.
    for (var j = 0; j < buttons.length; j++) {
  buttons[j].className = "borough-btn";
}


    // Add "active" to the clicked button
    this.className = "borough-btn active";


    // Read the borough name from the button's data-borough attribute
    // Then call the API function
    onClickBorough(this.getAttribute("data-borough"));
  };
}
