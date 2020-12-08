var fuses = card.Fusions.map((i) => {
    return { card1: card, card2: getCardById(i._card2), result: getCardById(i._result) };
});

if (card.Fusions.length > 0 && card.Fusions) {
    var fuses = card.Fusions.map((i) => {
        return { card1: card, card2: getCardById(i._card2), result: getCardById(i._result) };
    });
    outputLeft.innerHTML = "<h2 class='text-center my-4'>Fusions</h2>";
    outputLeft.innerHTML += fusesToHTML(fuses);
}
