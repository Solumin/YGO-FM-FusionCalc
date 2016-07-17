var nameInput = document.getElementById("cardname");
var typeInput = document.getElementById("monstertype");
var cardTypeInput = document.getElementById("cardtype");

var outputMonster = document.getElementById("outputarealeft");
var outputGeneral = document.getElementById("outputarearight");

var formatStr = "<div class='result-div'>Left Input:  {left}<br>Right Input: {right}<br>Output: {output} ({attack}/{defense})<br><br></div>";
var typeStr = "<div class='result-div'>Left Input:  {left}<br>Right Input: {right}<br>Output: {output} ({type})<br><br></div>";

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
        outputMonster.innerHTML = "<h2 class='center'>Monster Fuses:</h2>";
        outputMonster.innerHTML += monfuses.supplant(formatStr);
    }
    if (genfuses.count() > 0) {
        outputGeneral.innerHTML += "<h2 class='center'>General Fuses:</h2>";
        outputGeneral.innerHTML += genfuses.supplant(formatStr);
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

    console.log(term);
    var monfuses = monsterfuseDB({type:term});
    var genfuses = genfuseDB({left:term});
    console.log(monfuses.count());
    if (monfuses.count() > 0) {
        outputMonster.innerHTML = "<h2>Monster Fuses:</h2>";
        outputMonster.innerHTML += monfuses.supplant(typeStr);
    }
    if (genfuses.count() > 0) {
        outputGeneral.innerHTML += "<h2>General Fuses:</h2>";
        outputGeneral.innerHTML += genfuses.supplant(typeStr);
    }
}

document.getElementById("searchNameBtn").onclick = function() {
    $("#search-msg").html("");
    searchByName();
}
document.getElementById("searchTypeBtn").onclick = function() {
    $("#search-msg").html("");
    searchByType();
}

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
