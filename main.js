/*water is the first button, pre-selected */
var a = "Water";
/*a is the activity i choose*/
function select(choice, event) {
    a = choice;

// need to clear the section every time when user select a button//
var buttons = document.getElementsByClassName("button");
for (var i = 0; i < buttons.length; i++) {
buttons[i].className = "button";
}
//clear everything, i ask it to check every buttons, and turn it from "selected"to origanal"button", with a for loop//
//then set the current selected button, so only one button will be selcted once//
event.currentTarget.className = "button selected";
}

//save diary entry, and in case ppl enter nothing,use reture to stop it from creat a new empty card,warn users with pop-out//
function saveDiary() {
             //get the text from the input box，save things in text area to "text", and use the text for later card output//
    var diary = document.getElementById("text");
    var text = diary.value;

    if (text == "") {
        alert("You need to write first.");
        return;// stop the function if no text entered,or it will creat an ampty card//
    }
            //create a new div block for the diary entry card, by using a DOM(createElement), this part is teached by Chatgp, about how to use correct DOM//
    var entry = document.createElement("div");
    entry.className = "entry-card"; //use css style "entry-card" for the new div//
            //before i can;t get the date to be print with other info, so i ask ai how to make it turing to string or text//
            // it gets today's date, and format it to local date style//  
    var today = new Date().toLocaleDateString();
            //need innerHTML to set the content of the new div, so i can have breaks and edit the text format//
    entry.innerHTML = a + "<br>" + today + "<br>" + text;
            // make a list to hold all the diary entry cards, and put the new card on the top of the list//
    var list = document.getElementById("diaryList");
    list.innerHTML = entry.outerHTML + list.innerHTML;
            //clear the text area after saving//
    document.getElementById("text").value = "";
}
