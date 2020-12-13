let inputCard = document.getElementById("cardname");
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
        let firstMessage = `<div class="alert alert-danger">Please enter a search term</div>`;
        return firstMessage;
    } else {
        let secondMessage = `<div class="alert alert-danger">No card for ${input} found</div>`;
        return secondMessage;
    }
}

// Display card beside search bar
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
    if (isMonster(card) === true) {
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
var cardNameCompletion = new Awesomplete(inputCard, {
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
            var res = `<div class="card border-dark mb-3" style="max-width: 18rem;">
        <div class="card-body text-dark">
        <p class="card-text">${fusion.card1.Name}<strong> + </strong>${fusion.card2.Name}</p>`;
            if (fusion.result) {
                // Equips and Results don't have a result field
                res += `<p class="card-text"><strong>Result:</strong> ${fusion.result.Name}</p>`;
            }
            return res + `</div></div>`;
        })
        .join("\n");
}

function searchByName() {
    let card = getCardByName(inputCard.value);
    if (!card) {
        searchMessage.innerHTML = createDangerMessage(inputCard.value);
        return;
    } else {
        outputCard.innerHTML = createSideCard(card);

        if (card.Fusions.length > 0 || equipsList[card.Id].length > 0) {
            let fuses = card.Fusions.map((i) => {
                return { card1: card, card2: getCardById(i._card2), result: getCardById(i._result) };
            });
            let equips = equipsList[card.Id].map((e) => {
                return { card1: card, card2: getCardById(e) };
            });

            outputLeft.innerHTML = "<h2 class='text-center mb-4'>Fusions</h2>";
            outputLeft.innerHTML += fusesToHTML(fuses);
            outputRight.innerHTML = "<h2 class='text-center mb-4'>Fusions</h2>";
            outputRight.innerHTML += fusesToHTML(equips);
        }
    }
}

function searchForResult() {
    let card = getCardByName(inputCard.value);
    if (!card) {
        searchMessage.innerHTML = createDangerMessage(inputCard.value);
        return;
    } else {
        outputCard.innerHTML = createSideCard(card);

        if (resultsList[card.Id].length > 0) {
            let results = resultsList[card.Id].map((f) => {
                return { card1: getCardById(f.card1), card2: getCardById(f.card2) };
            });
            outputLeft.innerHTML = "<h2 class='text-center mb-4'>Fusions</h2>";
            outputLeft.innerHTML += fusesToHTML(results);
        }
    }
}

searchNameBtn.onclick = function () {
    if (checkInput(inputCard) === true) {
        searchMessage.innerHTML = createDangerMessage();
        return;
    } else {
        resultsClear();
        searchByName();
    }
};

searchResultsBtn.onclick = function () {
    if (checkInput(inputCard) === true) {
        searchMessage.innerHTML = createDangerMessage();
        return;
    } else {
        resultsClear();
        searchForResult();
    }
};

resetBtn.onclick = function () {
    resultsClear();
    inputCard.value = "";
};
