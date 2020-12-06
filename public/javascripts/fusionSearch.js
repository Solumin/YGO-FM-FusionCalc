let nameInput = document.getElementById("cardname");
let outputLeft = document.getElementById("output-area-left");
let outputRight = document.getElementById("output-area-right");
let outputCard = document.getElementById("outputcard");
let searchMessage = document.getElementById("search-msg");
let resetBtn = document.getElementById("reset-btn");
let searchResultsBtn = document.getElementById("search-results-btn");
let searchNameBtn = document.getElementById("search-name-btn");

// component card
let startCard = `<div class="card border-dark mb-3" style="max-width: 18rem;">
<div class="card-body text-dark"><p class="card-text"><strong>Input:</strong> `;
const componentCardEnd = `</div></div>`;

// FUNCTIONS

function resultsClear() {
    outputLeft.innerHTML = "";
    outputRight.innerHTML = "";
    outputCard.innerHTML = "";
    searchMessage.innerHTML = "";
}

function createDangerMessage(input) {
    if (!input) {
        let firstMessage = `<div class="alert alert-danger" role="alert">Please enter a search term</div>`;
        return firstMessage;
    } else {
        let secondMessage = `<div class="alert alert-danger" role="alert">No card for ${input} found</div>`;
        return secondMessage;
    }
}

function createSideCard(card) {
    if (card.Type < 20) {
        let monsterCard = `<div class="card text-white bg-dark mb-3" style="max-width: 18rem;">
        <div class="card-header text-center">${card.Name}</div>
        <div class="card-body text-dark bg-light">
        <p class="card-text"><strong>Description:</strong> ${card.Description}</p>
        <p class="card-text"><strong>ATK / DEF:</strong> ${card.Attack} / ${card.Defense}</p>
        <p class="card-text"><strong>Type:</strong> ${cardTypes[card.Type]}</p>
        <p class="card-text"><strong>Stars:</strong> ${card.Stars}</p>
        <p class="card-text"><strong>Password:</strong> ${card.CardCode}</p>
        </div>
       </div>`;
        return monsterCard;
    } else {
        let notMonsterCard = `<div class="card text-white bg-dark mb-3" style="max-width: 18rem;">
        <div class="card-header text-center">${card.Name}</div>
        <div class="card-body text-dark bg-light">
        <p class="card-text"><strong>Description:</strong> ${card.Description}</p>
        <p class="card-text"><strong>Type:</strong> ${cardTypes[card.Type]}</p>
        <p class="card-text"><strong>Stars:</strong> ${card.Stars}</p>
        <p class="card-text"><strong>Password:</strong> ${card.CardCode}</p>
        </div>
       </div>`;
        return notMonsterCard;
    }
}

// Returns true if the given card is a monster, false if it is magic, ritual,
// trap or equip
function isMonster(card) {
    return card.Type < 20;
}

// Initialize awesomplete
var cardNameCompletion = new Awesomplete(nameInput, {
    list: card_db()
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
                startCard +
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
    var card = card_db({ Id: id }).first();
    if (!card) {
        return null;
    }
    return card;
}

function searchByName() {
    if (nameInput.value === "") {
        searchMessage.innerHTML = createDangerMessage();
        return;
    } else {
        let card = card_db({ Name: { isnocase: nameInput.value } }).first();
        if (!card) {
            searchMessage.innerHTML = createDangerMessage(nameInput.value);
            return;
        } else {
            // Display card beside search bar
            outputCard.innerHTML = createSideCard(card);

            // Get the list of fusions and equips
            var fuses = fusionsList[card.Id].map((f) => {
                return { card1: card, card2: getCardById(f.card), result: getCardById(f.result) };
            });

            var equips = equipsList[card.Id].map((e) => {
                return { card1: card, card2: getCardById(e) };
            });

            outputRight.innerHTML = "<h2 class='text-center my-4'>Can be equiped</h2>";
            outputRight.innerHTML += fusesToHTML(equips);

            outputLeft.innerHTML = "<h2 class='text-center my-4'>Fusions</h2>";
            outputLeft.innerHTML += fusesToHTML(fuses);
        }
    }
}

function searchForResult() {
    if (nameInput.value === "") {
        searchMessage.innerHTML = createDangerMessage();
        return;
    } else {
        var card = card_db({ Name: { isnocase: nameInput.value } }).first();
        if (!card) {
            searchMessage.innerHTML = createDangerMessage(nameInput.value);
            return;
        } else {
            // Display card beside search bar
            if (isMonster(card)) {
                outputCard.innerHTML = createSideCard(card);
            } else {
                outputCard.innerHTML = createSideCard(card);
            }
        }

        var results = resultsList[card.Id].map((f) => {
            return { card1: getCardById(f.card1), card2: getCardById(f.card2) };
        });

        outputLeft.innerHTML = "<h2 class='text-center my-4'>Fusions</h2>";
        outputLeft.innerHTML += fusesToHTML(results);
    }
}

searchNameBtn.onclick = function () {
    cardNameCompletion.select(); // select the currently highlighted item
    resultsClear();
    searchByName();
};

searchResultsBtn.onclick = function () {
    cardNameCompletion.select(); // select the currently highlighted item
    resultsClear();
    searchForResult();
};

resetBtn.onclick = function () {
    resultsClear();
    nameInput.value = "";
};

// runs search function on every keypress in #cardname input field
// $("#cardname").keyup(function (){
//     searchDB();
// });
