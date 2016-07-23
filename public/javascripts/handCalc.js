var outputMonster = document.getElementById("outputarealeft");
var outputEquips = document.getElementById("outputarearight");
var $grid;

// Initialize Awesomplete
var _awesompleteOpts = {
    list: cardDB().get().map(c => c.name),  // List is all the cards in the DB
    autoFirst: true,                        // The first item in the list is selected
    filter: Awesomplete.FILTER_STARTSWITH   // Case insensitive from start of word
};
var handCompletions = {}
for (i = 1; i <= 5; i++) {
    var hand = document.getElementById("hand" + i);
    handCompletions["hand"+i] = new Awesomplete(hand, _awesompleteOpts);
}

function fusesToHTML(fuselist) {
    return fuselist.map(function(fusion) {
        var res = "<div class='result-div card-item'>Left Input: " + fusion.left + "<br>Right Input: " + fusion.right;
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

function lookupSecondaries(cardname) {
    var secondaries = secondaryDB({name:{isnocase:cardname}}).select("secondarytypes");
    // If there are any secondaries, they'll be in the first element of the
    // array. Otherwise the array is empty and can safely be used
    if (secondaries[0]) {
        return secondaries[0];
    } else {
        return [];
    }
}

// Format stat string with classes for isotope sorting
function formatStats(attack, defense) {
    return "(<span class='attack'>" + attack + "</span>" + "/" + "<span class='defense'>" + defense + "</span>" + ")";
}

function checkCard(cardname, infoname) {
    var info = $("#" + infoname);
    var card = lookupCard(cardname);
    if (!card) {
        info.html("Invalid card name");
    } else if (card.cardtype === "Monster") {
        var secondaries = lookupSecondaries(card.name);
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
    // Also finds general fusions based on types
    var monsterFuses = [];

    for (i = 0; i < cards.length -1; i++) {
        var curr = cards[i].name;
        var lterm = [curr, cards[i].type].concat(lookupSecondaries(curr));
        for (j = i+1; j < cards.length; j++) {
            var other = cards[j].name;
            var rterm = [other, cards[j].type].concat(lookupSecondaries(other));
            monsterFuses = monsterFuses.concat(monsterfuseDB({left:{isnocase:curr}},{right:{isnocase:other}}).get());
            var genfuses = genfuseDB({left:{isnocase:lterm}}, {right:{isnocase:rterm}}).get();
            monsterFuses = monsterFuses.concat(genfuses.map(function(fusion) {
                fusion.left = curr;
                fusion.right = other;
                return fusion;
            }));
        }
    }

    // Get just the monsters and their equipment fusions
    var leftTerm = {left:{isnocase:monsters.map(c => c.name)}};
    var rightTerm = {right:{isnocase:others.map(c => c.name)}};
    var equipFuses = equipDB(leftTerm, rightTerm).get();

    if (monsterFuses.length > 0) {
        // outputMonster.innerHTML = "<h2 class='center'>Monster Fuses:</h2>";
        outputMonster.innerHTML = fusesToHTML(monsterFuses.sort((a,b) => b.attack - a.attack));
    }
    if (equipFuses.length > 0) {
        // outputEquips.innerHTML = "<h2 class='center'>Equippables:</h2>";
        outputEquips.innerHTML = fusesToHTML(equipFuses);
    }
    // Destroy previous (outdated) isotope grid
    // Initialize a new isotope grid with new elements
    if ($grid) {
      gridRenew();
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

// Clears/reinitializes isotope grid for sorting after search
function gridRenew() {
    $grid.isotope('destroy');

    $grid = $('#outputarealeft').isotope({
      itemSelector: '.card-item',
      layoutMode: 'fitRows',
      getSortData: {
        defense: function( card ) {
          var defense = $( card).find('.defense').text();
          return parseFloat( defense.replace( /[\(\)]/g, '') * -1 );
        },
        attack: function( card ) {
          var attack = $( card).find('.attack').text();
          return parseFloat( attack.replace( /[\(\)]/g, '') * -1 );
        }
      }
    });
}

// Set up event listeners for each card input
for (i = 1; i <= 5; i++) {
    $("#hand" + i).on("change", function() {
        handCompletions[this.id].select(); // select the currently highlighted element
        if (this.value === "") { // If the box is cleared, remove the card info
            $("#" + this.id + "-info").html("");
        } else {
            checkCard(this.value, this.id + "-info");
        }
        resultsClear();
        findFusions();
    });

    $("#hand" + i).on("awesomplete-selectcomplete", function() {
        checkCard(this.value, this.id + "-info");
        resultsClear();
        findFusions();
    });
}

$("#resetBtn").on("click", function() {
    resultsClear();
    inputsClear();
    console.log('results cleared')
});
