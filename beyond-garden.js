// 1) Get all borough buttons
var buttons = document.getElementsByClassName("borough-btn");
console.log("buttons:", buttons.length);

// 2) Get the text area + list area
var selectedText = document.getElementById("selected-borough");
var parksList = document.getElementById("parks-list");


// 3) Function: runs when user clicks a borough button
async function onClickBorough(boroughName) {

  // Show which borough was clicked
  selectedText.innerHTML = "Selected: " + boroughName;

  // Convert boroughName -> borough code used in NYC Parks dataset
  var code = "";

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

  // NYC Open Data URL (filter by borough code + limit 5)
  var url =
    "https://data.cityofnewyork.us/resource/enfh-gkve.json?$where=borough=%27" +
    code +
    "%27&$limit=5";

  // Fetch data
  var response = await fetch(url);
  var jsonData = await response.json();

  // If no results
  if (jsonData.length == 0) {
    parksList.innerHTML = "<p>No parks found.</p>";
    return;
  }

// Sort by acres (largest to smallest) using loops (no .sort)
for (var a = 0; a < jsonData.length; a++) {
  for (var b = a + 1; b < jsonData.length; b++) {

    var acresA = jsonData[a].acres;
    var acresB = jsonData[b].acres;

    if (acresA == undefined) { acresA = 0; }
    if (acresB == undefined) { acresB = 0; }

    // convert to number (simple)
    acresA = acresA * 1;
    acresB = acresB * 1;

    // if B is bigger, swap
    if (acresB > acresA) {
      var temp = jsonData[a];
      jsonData[a] = jsonData[b];
      jsonData[b] = temp;
    }
  }
}


  // Build HTML to show on page
  var html = "";

  var maxShow = 8;
if (jsonData.length < maxShow) {
  maxShow = jsonData.length;
}

for (var i = 0; i < maxShow; i++) {


    // Park name field is "signname"
    var name = jsonData[i].signname;
    var address = jsonData[i].address;
    var acres = jsonData[i].acres;

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

    html = html + "<div class='park-card'>";
html = html + "<b>" + name + "</b><br>";
html = html + address + "<br>";
html = html + acres;
html = html + "</div>";

  }

  parksList.innerHTML = html;

  console.log("boroughName:", boroughName);
  console.log("code:", code);
}

// 4) Attach onclick to every button (OUTSIDE function)
for (var i = 0; i < buttons.length; i++) {
  buttons[i].onclick = function () {

    // remove active from all buttons
    for (var j = 0; j < buttons.length; j++) {
      buttons[j].classList.remove("active");
    }

    // add active to the clicked button
    this.classList.add("active");

    // run the API function
    onClickBorough(this.getAttribute("data-borough"));
  };
}

