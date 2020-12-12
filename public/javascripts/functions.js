function checkInput() {
    if (inputCard.value === "") {
        return true;
    } else {
        return null;
    }
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
