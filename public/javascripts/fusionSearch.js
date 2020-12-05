var nameInput = document.getElementById("cardname");
var outputLeft = document.getElementById("outputarealeft");
var outputRight = document.getElementById("outputarearight");
var outputCard = document.getElementById("outputcard");
var searchMessage = document.getElementById("search-msg");

// component card
const startCard = `<div class="card border-dark mb-3" style="max-width: 18rem;">
<div class="card-body text-dark">`;

const componentCardStart = `<div class="card text-white bg-dark mb-3" style="max-width: 18rem;">
<div class="card-header text-center">`;
const componentCardBody = `</div><div class="card-body text-dark bg-light">`;
const componentCardEnd = `</div></div>`;

// danger div

const dangerDiv = `<div class="alert alert-danger" role="alert">`;

// messagesForAlerts

const messageForNoValue = "Please enter a search term";
const messageForNoCardStart = "No card for ";
const messageForNoCardEnd = " found";

// divs
const descriptionDiv = `<p class="card-text"><strong>Description:</strong> `;
const typeDiv = `</p><p class="card-text"><strong>Type:</strong> `;
const attackAndDefenseDiv = `</p><p class="card-text"><strong>ATK / DEF:</strong> `;
const starsDiv = `</p><p class="card-text"><strong>Stars:</strong> `;

const cardCodeDiv = `</p><p class="card-text"><strong>Password:</strong> `;
const endPTag = "</p>";
const endDivTag = "</div>";

// Initialize awesomplete
var cardNameCompletion = new Awesomplete(nameInput, {
    list: cardDB()
        .get()
        .map((c) => c.Name), // list is all the cards in the DB
    autoFirst: true, // The first item in the list is selected
    filter: Awesomplete.FILTER_STARTSWITH, // case insensitive from start of word
});
$("#cardname").on("change", function () {
    cardNameCompletion.select(); // select the currently highlighted item, e.g. if user tabs
    resultsClear();
    searchByName();
});
$("#cardname").on("awesomplete-selectcomplete", function () {
    resultsClear();
    searchByName();
});

// Creates a div for each fusion
function fusesToHTML(fuselist) {
    return fuselist
        .map(function (fusion) {
            var res =
                `${startCard} <p class="card-text"><strong>Input:</strong> ` +
                fusion.card1.Name +
                `<p class="card-text"><strong>Input:</strong> ` +
                fusion.card2.Name;
            if (fusion.result) {
                // Equips and Results don't have a result field
                res += `<p class="card-text"><strong>Result:</strong> ` + fusion.result.Name;
                res += " (" + fusion.result.Attack + "/" + fusion.result.Defense + ")";
            }
            return res + componentCardEnd;
        })
        .join("\n");
}

// Returns the card with a given ID
function getCardById(id) {
    var card = cardDB({ Id: id }).first();
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
        searchMessage.innerHTML = dangerDiv + messageForNoValue + endDivTag;
        return;
    }

    var card = cardDB({ Name: { isnocase: nameInput.value } }).first();
    if (!card) {
        searchMessage.innerHTML =
            dangerDiv + messageForNoCardStart + nameInput.value + messageForNoCardEnd + endDivTag;
        return;
    } else {
        // Display card beside search bar
        if (isMonster(card)) {
            outputCard.innerHTML =
                componentCardStart +
                card.Name +
                componentCardBody +
                descriptionDiv +
                card.Description +
                attackAndDefenseDiv +
                card.Attack +
                " / " +
                card.Defense +
                typeDiv +
                cardTypes[card.Type] +
                starsDiv +
                card.Stars +
                cardCodeDiv +
                card.CardCode +
                endPTag +
                componentCardEnd;
        } else {
            outputCard.innerHTML =
                componentCardStart +
                card.Name +
                componentCardBody +
                descriptionDiv +
                card.Description +
                typeDiv +
                cardTypes[card.Type] +
                endPTag +
                componentCardEnd;
        }
    }

    // Get the list of fusions and equips
    var fuses = fusionsList[card.Id].map((f) => {
        return { card1: card, card2: getCardById(f.card), result: getCardById(f.result) };
    });
    var equips = equipsList[card.Id].map((e) => {
        return { card1: card, card2: getCardById(e) };
    });

    outputLeft.innerHTML = "<h2 class='text-center my-4'>Fusions</h2>";
    outputLeft.innerHTML += fusesToHTML(fuses);

    outputRight.innerHTML = "<h2 class='text-center my-4'>Equips</h2>";
    outputRight.innerHTML += fusesToHTML(equips);
}

function searchForResult() {
    if (nameInput.value === "") {
        searchMessage.innerHTML = dangerDiv + messageForNoValue + endDivTag;
        return;
    }

    var card = cardDB({ Name: { isnocase: nameInput.value } }).first();
    if (!card) {
        searchMessage.innerHTML =
            dangerDiv + messageForNoCardStart + nameInput.value + messageForNoCardEnd + endDivTag;
        return;
    } else {
        // Display card beside search bar
        if (isMonster(card)) {
            outputCard.innerHTML =
                componentCardStart +
                card.Name +
                componentCardBody +
                descriptionDiv +
                card.Description +
                attackAndDefenseDiv +
                card.Attack +
                " / " +
                card.Defense +
                typeDiv +
                cardTypes[card.Type] +
                componentCardEnd;
        } else {
            outputCard.innerHTML =
                componentCardStart +
                card.Name +
                componentCardBody +
                descriptionDiv +
                card.Description +
                typeDiv +
                cardTypes[card.Type] +
                componentCardEnd;
        }
    }

    var results = resultsList[card.Id].map((f) => {
        return { card1: getCardById(f.card1), card2: getCardById(f.card2) };
    });

    outputLeft.innerHTML = "<h2 class='text-center my-4'>Fusions</h2>";
    outputLeft.innerHTML += fusesToHTML(results);
}

document.getElementById("searchNameBtn").onclick = function () {
    $("#search-msg").html("");
    cardNameCompletion.select(); // select the currently highlighted item
    resultsClear();
    searchByName();
};

document.getElementById("searchResultsBtn").onclick = function () {
    $("#search-msg").html("");
    cardNameCompletion.select(); // select the currently highlighted item
    resultsClear();
    searchForResult();
};

// runs search function on every keypress in #cardname input field
// $("#cardname").keyup(function (){
//     searchDB();
// });

document.getElementById("resetBtn").onclick = function () {
    nameInput.value = "";
    outputLeft.innerHTML = "";
    outputRight.innerHTML = "";
    outputCard.innerHTML = "";
    $("#search-msg").html("");
};

function resultsClear() {
    outputLeft.innerHTML = "";
    outputRight.innerHTML = "";
}
