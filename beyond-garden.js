// get buttons
var btns = document.getElementsByClassName("borough-btn");

// get page areas
var title = document.getElementById("selected-borough");
var listBox = document.getElementById("parks-list");


// show parks when click
async function showParks(borough) {
//I use innerHTML to put text (or simple HTML) inside an element, so the page updates with the new park results.
  title.innerHTML = "Selected: " + borough;

  // borough code
  var bCode = "M";
  if (borough == "brooklyn") bCode = "B";
  if (borough == "queens") bCode = "Q";
  if (borough == "bronx") bCode = "X";
  if (borough == "staten") bCode = "R";

  var apiUrl =
    "https://data.cityofnewyork.us/resource/enfh-gkve.json?$where=borough='" +
    bCode +
    "'&$limit=8";

  var res = await fetch(apiUrl);
  var data = await res.json();

  if (data.length == 0) {
    listBox.innerHTML = "No parks";
    return;
  }

  var html = "";

  for (var i = 0; i < data.length; i++) {

    var parkName = data[i].signname || "No name";
    var parkAddr = data[i].address || "";
    var parkSize = data[i].acres || "";

    html +=
      "<div class='park-card'>" +
      "<b>" + parkName + "</b><br>" +
      parkAddr + "<br>" +
      parkSize +
      "</div>";
  }

  listBox.innerHTML = html;
}


// add click to buttons
for (var i = 0; i < btns.length; i++) {
  btns[i].onclick = function () {

    for (var j = 0; j < btns.length; j++) {
      btns[j].className = "borough-btn";
    }

    this.className = "borough-btn active";
    showParks(this.getAttribute("data-borough"));
  };
}
