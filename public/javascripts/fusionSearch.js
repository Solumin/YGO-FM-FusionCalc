var nameInput = document.getElementById('cardname');
var outputLeft = document.getElementById('outputarealeft');
var outputRight = document.getElementById('outputarearight');
var outputCard = document.getElementById('outputcard');
const startCard = `<div class="card border-dark mb-3" style="max-width: 18rem;">
<div class="card-body text-dark">`;
const endCard = `</div></div>`;

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

// Creates a div for each fusion
function fusesToHTML(fuselist) {
    return fuselist.map(function(fusion) {
        var res = `${startCard} <p class="card-text"><strong>Input:</strong> ` +
        fusion.card1.Name +
        `<p class="card-text"><strong>Input:</strong> ` +
        fusion.card2.Name;
      if (fusion.result) {
        // Equips and Results don't have a result field
        res += `<p class="card-text"><strong>Result:</strong> ` + fusion.result.Name;
        res += ' (' + fusion.result.Attack + '/' + fusion.result.Defense + ')';
      }
      return res + endCard;
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

// Returns true if the given card is a monster, false if it is magic, ritual,
// trap or equip
function isMonster(card) {
    return card.Type < 20;
}

function searchByName() {
    if (nameInput.value === "") {
        $("#search-msg").html("Please enter a search term");
        return;
    }

    var card = cardDB({Name:{isnocase:nameInput.value}}).first();
    if (!card) {
        $("#search-msg").html("No card for '" + nameInput.value + "' found");
        return;
    } else {
        // Display card beside search bar
        if (isMonster(card)) {
            outputCard.innerHTML = `${startCard} 
            <p class="card-text"><strong>Name:</strong> ` +
            card.Name +
            `<p class="card-text"><strong>ATK/DEF:</strong> ` +
            card.Attack +
            '/' +
            card.Defense +
            `<p class="card-text"><strong>Type:</strong> ` +
            cardTypes[card.Type] + endCard;
        } else {
          outputCard.innerHTML =
          `<div class="card border-dark my-3" style="max-width: 18rem;">
          <div class="card-body text-dark">
            <p class="card-text"><strong>Name:</strong> ` +
            card.Name +
            `<p class="card-text"><strong>Type:</strong> ` +
            cardTypes[card.Type] + endCard;
        }
    }

    // Get the list of fusions and equips
    var fuses = fusionsList[card.Id].map(f => {
        return {card1: card, card2: getCardById(f.card), result: getCardById(f.result)};
    });
    var equips = equipsList[card.Id].map(e => {
        return {card1: card, card2: getCardById(e)};
    });

    outputLeft.innerHTML = "<h2 class='text-center my-4'>Fusions</h2>";
    outputLeft.innerHTML += fusesToHTML(fuses);

    outputRight.innerHTML = "<h2 class='text-center my-4'>Equips</h2>";
    outputRight.innerHTML += fusesToHTML(equips);
}

function searchForResult() {
    if (nameInput.value === "") {
        $("#search-msg").html("Please enter a search term");
        return;
    }

    var card = cardDB({Name:{isnocase:nameInput.value}}).first();
    if (!card) {
        $("#search-msg").html("No card for '" + nameInput.value + "' found");
        return;
    } else {
        // Display card beside search bar
        if (isMonster(card)) {
            outputCard.innerHTML = `${startCard} <p class="card-text"><strong>Name:</strong> ` +
            card.Name +
            `<p class="card-text"><strong>ATK/DEF:</strong> ` +
            card.Attack +
            '/' +
            card.Defense +
            `<p class="card-text"><strong>Type:</strong> ` +
            cardTypes[card.Type] + endCard;
        } else {
          outputCard.innerHTML =
          `${startCard} <p class="card-text"><strong>Name:</strong> ` +
            card.Name +
            `<p class="card-text"><strong>Type:</strong> ` +
            cardTypes[card.Type] + endCard;
        }
    }

    var results = resultsList[card.Id].map(f => {
        return {card1: getCardById(f.card1), card2: getCardById(f.card2)};
    });

    outputLeft.innerHTML = "<h2 class='text-center my-4'>Fusions</h2>";
    outputLeft.innerHTML += fusesToHTML(results);
}

document.getElementById("searchNameBtn").onclick = function() {
    $("#search-msg").html("");
    cardNameCompletion.select(); // select the currently highlighted item
    resultsClear();
    searchByName();
}

document.getElementById("searchResultsBtn").onclick = function() {
    $("#search-msg").html("");
    cardNameCompletion.select(); // select the currently highlighted item
    resultsClear();
    searchForResult();
}

// runs search function on every keypress in #cardname input field
// $("#cardname").keyup(function (){
//     searchDB();
// });

document.getElementById("resetBtn").onclick = function() {
    nameInput.value = "";
    outputLeft.innerHTML = "";
    outputRight.innerHTML = "";
    outputCard.innerHTML = "";
    $("#search-msg").html("");
}

function resultsClear(){
    outputLeft.innerHTML = "";
    outputRight.innerHTML = "";
}
