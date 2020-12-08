let nameInput = document.getElementById("cardname");
let outputLeft = document.getElementById("output-area-left");
let outputRight = document.getElementById("output-area-right");
let outputCard = document.getElementById("outputcard");
let searchMessage = document.getElementById("search-msg");
let resetBtn = document.getElementById("reset-btn");
let searchResultsBtn = document.getElementById("search-results-btn");
let searchNameBtn = document.getElementById("search-name-btn");

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
    let modelCard = `<div class="card ml-1" style="max-width: 540px">
                    <div class="row no-gutters">
                    <div class="col">
                    <div class="card-body">
                    <h5 class="card-title">${card.Name}</h5>
                    <p class="card-text">${card.Description}</p>
                    <p class="card-text"><strong>ATK / DEF:</strong> ${card.Attack} / ${card.Defense}</p>
                    <p class="card-text"><strong>Type:</strong> ${cardTypes[card.Type]}</p>
                    <p class="card-text"><strong>Stars:</strong> ${card.Stars}</p>
                    <p class="card-text"><strong>Password:</strong> ${card.CardCode}</p>
                    </div>
                    </div>
                    </div>
                  </div>`;

    if (card.Type < 20) {
        return modelCard;
    } else {
        let notMonsterCard = modelCard.replace(
            `<p class="card-text"><strong>ATK / DEF:</strong> ${card.Attack} / ${card.Defense}</p>`,
            ""
        );
        return notMonsterCard;
    }
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
    return fuselist.map(function (fusion) {
        var res = `<div class="card border-dark mb-3" style="max-width: 18rem;">
        <div class="card-body text-dark"><p class="card-text"><strong>Input:</strong> ${fusion.card1.Name}
        <p class="card-text"><strong>Input:</strong> ${fusion.card2.Name}`;
        if (fusion.result) {
            // Equips and Results don't have a result field
            res += `<p class="card-text"><strong>Result:</strong> ` + fusion.result.Name;
            res += " (" + fusion.result.Attack + "/" + fusion.result.Defense + ")";
        }
        return res + `</div></div>`;
    });
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

            var fuses = card.Fusions.map((i) => {
                return { card1: card, card2: getCardById(i._card2), result: getCardById(i._result) };
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
            outputCard.innerHTML = createSideCard(card);

            if (resultsList[card.Id].length > 0) {
                var results = resultsList[card.Id].map((f) => {
                    return { card1: getCardById(f.card1), card2: getCardById(f.card2) };
                });
                outputLeft.innerHTML = "<h2 class='text-center my-4'>Fusions</h2>";
                outputLeft.innerHTML += fusesToHTML(results);
            }
        }
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
