var outputMonster = document.getElementById("outputarealeft");
var outputEquips = document.getElementById("outputarearight");

function fusesToHTML(fuselist) {
    return fuselist.map(function(fusion) {
        var res = "<div class='result-div'>Left Input: " + fusion.left + "<br>Right Input: " + fusion.right;
        if (fusion.type === "Monster") {
            res += ["<br>Output:", fusion.output, formatStats(fusion.attack, fusion.defense)].join(" ");
        } else if  (fusion.type !== "Equippable") {
            res += "<br>Output: " + fusion.output + " (" + fusion.type + ")";
        } // Equippable fusions (from equipDB) have no output, just left and right
        return res + "<br><br></div>";
    }).join("\n");
}

function lookupCard(cardname) {
    return cardDB({name:{isnocase:cardname}}).first();
}

function formatStats(attack, defense) {
    return "(" + attack + "/" + defense + ")";
}

function checkCard(cardname, infoname) {
    var info = $("#" + infoname);
    var card = lookupCard(cardname);
    if (!card) {
        info.html("Invalid card name");
    } else if (card.cardtype === "Monster") {
        var secondaries = secondaryDB({name:{isnocase:card.name}}).select("secondarytypes");
        // If there are any secondaries, they'll be in the first element of the
        // array. Otherwise the array is empty and can safely be concated.
        if (secondaries[0]) {
            secondaries = secondaries[0];
        }
        info.html(formatStats(card.attack, card.defense) + " [" + [card.type].concat(secondaries).join(", ") + "]");
    } else {
        info.html("(" + card.cardtype + ")");
    }
}

function findFusions() {
    var cards = [];
    var monsters = [];
    var others = [];

    for (i = 1; i <= 5; i++) {
        var name = $("#hand" + i).val();
        var card = lookupCard(name);
        if (card) {
            cards.push(card);
            if (card.cardtype === "Monster") {
                monsters.push(card);
            } else {
                others.push(card);
            }
        }
    }

    // Compare the ith card against the remaining n-i cards
    // Assumes the data is perfect, i.e. each fusion is reciprocated.
    // This does not take into account equipment
    // (So we'll get Beast Fang + Megamorph, but not Aqua Dragon + Beast Fangs)
    var monsterFuses = [];
    for (i = 0; i < cards.length - 1; i++) {
        var curr = cards[i].name;
        var names = cards.slice(i+1).map(c => c.name);
        monsterFuses = monsterFuses.concat(monsterfuseDB({left:{isnocase:curr}},{right:{isnocase:names}}).get());
    }
    // Get just the monsters and their equipment fusions
    var leftTerm = {left:{isnocase:monsters.map(c => c.name)}};
    var rightTerm = {right:{isnocase:others.map(c => c.name)}};
    var equipFuses = equipDB(leftTerm, rightTerm).get();

    if (monsterFuses.length > 0) {
        outputMonster.innerHTML = "<h2 class='center'>Monster Fuses:</h2>";
        outputMonster.innerHTML += fusesToHTML(monsterFuses.sort((a,b) => b.attack - a.attack));
    }
    if (equipFuses.length > 0) {
        outputEquips.innerHTML = "<h2 class='center'>Equippables:</h2>";
        outputEquips.innerHTML += fusesToHTML(equipFuses);
    }
}

function resultsClear() {
    outputMonster.innerHTML = "";
    outputEquips.innerHTML = "";
}

function inputsClear() {
    for(i = 1; i <= 5; i++) {
        $("#hand" + i).val("");
        $("#hand" + i + "-info").html("");
    }
}

// Set up event listeners for each card input
for (i = 1; i <= 5; i++) {
    $("#hand" + i).on("change", function() {
        checkCard(this.value, this.id + "-info");
        resultsClear();
        findFusions();
    });
}

$("#resetBtn").on("click", function() {
    resultsClear();
    inputsClear();
});
