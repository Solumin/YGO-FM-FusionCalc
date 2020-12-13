// Returns true if the input is empty
function checkInput(input) {
    return input.value === "";
}

// Returns true if the given card is a monster, false if it is magic, ritual, trap or equip
function isMonster(card) {
    return card.Type < 20;
}

// Returns the card info from database
function getCardByName(cardname) {
    return card_db({ Name: { isnocase: cardname } }).first();
}

// Returns the card with a given ID
function getCardById(id) {
    var card = card_db({ Id: id }).first();
    if (!card) {
        return null;
    }
    return card;
}

// Returns true if the given card can be equiped
function equipCard() {
    return equipsList[card.Id].length > 0;
}
