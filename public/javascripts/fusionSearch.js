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
            list: cardDB().get().map(c => c.Name),  // list is all the cards in the DB
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
        var res = "<div class='result-div'>Input: " + fusion.card1.Name + "<br>Input: " + fusion.card2.Name;
        if (fusion.result) { // Equips and Results don't have a result field
            res += "<br>Result: " + fusion.result.Name;
            res += " (" + fusion.result.Attack + "/" + fusion.result.Defense + ")";
        }
        return res + "<br><br></div>";
    }).join("\n");
}

// Returns the card with a given ID
function getCardById(id) {
    var card = cardDB({Id:id}).first();
    if (!card) {
        return null;
    }
    return card;
}

function isMonster(card) {
    return card.Type < 20;
}

function searchByName() {
    resultsClear();

    if (nameInput.value === "") {
        console.log("Please enter a search term");
        $("#search-msg").html("Please enter a search term");
        return;
    }

    var card = cardDB({Name:{isnocase:nameInput.value}}).first();
    if (!card) {
        console.log(nameInput.value + " is an invalid name");
        $("#search-msg").html("No card for '" + nameInput.value + "' found");
        return;
    } else {
        if (isMonster(card)) {
            // Display card beside search bar
            outputCard.innerHTML = "<div class='result-div'>" + "Name: " +
                card.Name + "<br>" + "ATK/DEF: " + card.Attack + "/" +
                card.Defense + "<br>" + "Type: " + cardTypes[card.Type] + "</div>";
        } else {
            outputCard.innerHTML = "<div class='result-div'>" + "Name: " +
                card.Name + "<br>" + "Type: " + cardTypes[card.Type] + "</div>";
        }
    }

    // Get the list of fusions and equips
    var fuses = fusionsList[card.Id].map(f => {
        return {card1: card, card2: getCardById(f.card), result: getCardById(f.result)};
    });
    var equips = equipsList[card.Id].map(e => {
        return {card1: card, card2: getCardById(e)};
    });

    // var results = resultsList[card.Id].map(r => {
    //     return {card1: getCardById(r.card1), card2: getCardById(r.card2)};
    // });

        outputMonster.innerHTML = "<h2 class='center'>Fusions:</h2>";
        outputMonster.innerHTML += fusesToHTML(fuses);

        outputGeneral.innerHTML = "<h2 class='center'>Equips:</h2>";
        outputGeneral.innerHTML += fusesToHTML(equips);

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
    outputCard.innerHTML = "";
    $("#search-msg").html("");
}

function resultsClear(){
    outputMonster.innerHTML = "";
    outputGeneral.innerHTML = "";
}
