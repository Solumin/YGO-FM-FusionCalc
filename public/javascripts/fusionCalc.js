var nameInput = document.getElementById("cardname");
var typeInput = document.getElementById("monstertype");
var cardTypeInput = document.getElementById("cardtype");

var output = document.getElementById("outputarea");

formatStr = "Left Input:  {left}<br>Right Input: {right}<br>Output: {output} ({attack}/{defense})<br><br>";

function searchByName() {
    if (nameInput.value === "") {
        console.log("Please enter a search term");
        $("#search-msg").html("Please enter a search term");
        return;
    }

    var card = cardDB({name:{isnocase:nameInput.value}}).first();

    if (!card) {
        console.log(nameInput.value + " is an invalid name");
        $("#search-msg").html("No card for '" + nameInput.value + "' found");
        return;
    }

    // Get the list of monster-to-monster fusions
    var monfuses = monsterfuseDB({left:{isnocase:card.name}});

    // Get the list of general fusions
    var secondaries = secondaryDB({name:{isnocase:card.name}}).select("secondarytypes");
    var genterm = [card.name, card.type].concat(secondaries[0]);
    var genfuses = genfuseDB({left:{isnocase:genterm}},{attack:{gt:card.attack}},{minattack:{lte:card.attack}});

    if (monfuses.count() > 0) {
        output.innerHTML = "<h2>Monster Fuses:</h2>";
        output.innerHTML += monfuses.supplant(formatStr);
    }
    if (genfuses.count() > 0) {
        output.innerHTML += "<h2>General Fuses:</h2>";
        output.innerHTML += genfuses.supplant(formatStr);
    }
}

function searchByType() {
    var term = "";

    if (typeInput.value !== "") {
        term = typeInput.value;
    }

    if (cardTypeInput.value !== "") {
        term = cardTypeInput.value;
    }

    if (term === "") {
        console.log("Please enter a search term");
        $("#search-msg").html("Please enter a search term");
        return;
    }

    var leftfuses = genfuseDB({left:{isnocase:term}});
    var rightfuses = genfuseDB({right:{isnocase:term}});
    if (leftfuses) {
        output.innerHTML = "<h2>As Left Input:</h2>";
        output.innerHTML += leftfuses.supplant(formatStr);
    }
    if (rightfuses) {
        output.innerHTML += "<br><h2>As Right Input:</h2>";
        output.innerHTML += rightfuses.supplant(formatStr);
    }
}

document.getElementById("searchNameBtn").onclick = function() { searchByName(); }
document.getElementById("searchTypeBtn").onclick = function() { searchByType(); }

// runs search function on every keypress in #cardname input field
// $("#cardname").keyup(function (){
//     searchDB();
// });

document.getElementById("resetBtn").onclick = function() {
    nameInput.value = "";
    typeInput.value = "";
    cardTypeInput.value = "";
    output.innerHTML = "";
    $("#search-msg").html("");
}

