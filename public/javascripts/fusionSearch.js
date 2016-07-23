var nameInput = document.getElementById("cardname");
var typeInput = document.getElementById("monstertype");
var cardTypeInput = document.getElementById("cardtype");

var outputMonster = document.getElementById("outputarealeft");
var outputGeneral = document.getElementById("outputarearight");
var outputCard = document.getElementById("outputcard");

var formatStr = "<div class='result-div'>Left Input:  {left}<br>Right Input: {right}<br>Output: {output} ({attack}/{defense})<br><br></div>";
var typeStr = "<div class='result-div'>Left Input:  {left}<br>Right Input: {right}<br>Output: {output} ({type})<br><br></div>";

// Initialize awesomplete
var cardNameCompletion = new Awesomplete(nameInput,
        {
            list: cardDB().get().map(c => c.name),  // list is all the cards in the DB
            autoFirst: true,                        // The first item in the list is selected
            filter: Awesomplete.FILTER_STARTSWITH   // case insensitive from start of word
        });
$("#cardname").on("change", function() {
    cardNameCompletion.select(); // select the currently highlighted item, e.g. if user tabs
    resultsClear();
    searchByName();
});
$("#cardname").on("awesomplete-selectcomplete", function() {
    resultsClear();
    searchByName();
});

function fusesToHTML(fuselist) {
    return fuselist.map(function(fusion) {
        var res = "<div class='result-div'>Left Input: " + fusion.left + "<br>Right Input: " + fusion.right;
        if (fusion.type === "Monster") {
            res += "<br>Output: " + fusion.output;
            res += " (" + fusion.attack + "/" + fusion.defense + ")";
        } else if  (fusion.type !== "Equippable") {
            res += "<br>Output: " + fusion.output + " (" + fusion.type + ")";
        } // Equippable fusions (from equipDB) have no output, just left and right
        return res + "<br><br></div>";
    }).join("\n");
}

function searchByName() {
    resultsClear();

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
    } else {
        if (card.cardtype === "Monster") {
            // Display card beside search bar
            outputCard.innerHTML = "<div class='result-div'>" + "Name: " +
                card.name + "<br>" + "ATK/DEF: " + card.attack + "/" +
                card.defense + "<br>" + "Type: " +
                [card.type].concat(card.secondarytypes).join(", ") + "</div>";
        } else {
            outputCard.innerHTML = "<div class='result-div'>" + "Name: " +
                card.name + "<br>" + "Type: " + card.cardtype + "</div>";
        }
    }

    // Get the list of monster-to-monster fusions
    var monfuses = monsterfuseDB({left:{isnocase:card.name}});

    var genterm = [card.name, card.type].concat(card.secondarytypes);
    var genfuses = genfuseDB({left:{isnocase:genterm}},{attack:{gt:card.attack}},{minattack:{lte:card.attack}});

    if (monfuses.count() > 0) {
        outputMonster.innerHTML = "<h2 class='center'>Monster Fuses:</h2>";
        outputMonster.innerHTML += fusesToHTML(monfuses.get());
    }
    if (genfuses.count() > 0) {
        outputGeneral.innerHTML = "<h2 class='center'>General Fuses:</h2>";
        outputGeneral.innerHTML += fusesToHTML(genfuses.get());
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

    var monfuses = monsterfuseDB({type:term});
    var genfuses = genfuseDB({left:term});
    if (monfuses.count() > 0) {
        outputMonster.innerHTML = "<h2 class='center'>Monster Fuses:</h2>";
        outputMonster.innerHTML += monfuses.supplant(typeStr);
    }
    if (genfuses.count() > 0) {
        outputGeneral.innerHTML += "<h2 class='center'>General Fuses:</h2>";
        outputGeneral.innerHTML += genfuses.supplant(formatStr);
    }
    if (monfuses.count() == 0 && genfuses.count() == 0) {
        $("#search-msg").html("There are no general fusions for that type");
    }
}

document.getElementById("searchNameBtn").onclick = function() {
    $("#search-msg").html("");
    cardNameCompletion.select(); // select the currently highlighted item
    resultsClear();
    searchByName();
}
document.getElementById("searchTypeBtn").onclick = function() {
    $("#search-msg").html("");
    resultsClear();
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
    outputMonster.innerHTML = "";
    outputGeneral.innerHTML = "";
    $("#search-msg").html("");
}

function resultsClear(){
    outputMonster.innerHTML = "";
    outputGeneral.innerHTML = "";
}
