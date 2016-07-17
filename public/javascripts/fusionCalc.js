var searchButton = document.getElementById("searchBtn");

var searchName = document.getElementById("cardname");
var searchType = document.getElementById("monstertype");
var searchCardType = document.getElementById("cardtype");

var output = document.getElementById("outputarea");

formatStr = "Left Input:  {left}<br>Right Input: {right}<br>Output: {output} ({attack}/{defense})<br><br>";

function searchDB() {
    var term = "";
    var card = null;
    if (searchName.value !== "") {
        card = cardDB({name:{isnocase:searchName.value}}).first();
        // Returns an array containing the column contents, which is itself
        // an array of monster types
        var secondaries = secondaryDB({name:{isnocase:card.name}}).select("secondarytypes");
        term = [card.name, card.type].concat(secondaries[0]);
    }
    if (searchType.value !== "") {
        term = searchType.value;
    }

    if (searchCardType.value !== "") {
        term = searchCardType.value;
    }

    if (term !== "") {
        var leftfuses = genfuseDB({left:{isnocase:term}});
        if (card) {
            leftfuses =
                leftfuses.filter({attack:{gt:card.attack}},{minattack:{lte:card.attack}});
        }
        if (leftfuses) {
            output.innerHTML = "<h2>As Left Input:</h2>"
                output.innerHTML += leftfuses.supplant(formatStr);
        }
        var rightfuses = genfuseDB({right:{isnocase:term}});
        if (card) {
            rightfuses =
                rightfuses.filter({attack:{gt:card.attack}},{minattack:{lte:card.attack}});
        }
        if (rightfuses) {
            output.innerHTML += "<br><h2>As Right Input:</h2>"
                output.innerHTML += rightfuses.supplant(formatStr);
        }
    } else {
        $("#search-msg").innerHTML = "Please enter a search term";
    }
    console.log("We ran the search");
}
searchBtn.onclick = function() { searchDB(); }
var searchField = searchName.value;

// runs search function on every keypress in #cardname input field
$("#cardname").keyup(function (){
    searchDB();
});

document.getElementById("resetBtn").onclick = function() {
    searchName.value = "";
    searchType.value = "";
    searchCardType.value = "";
    output.innerHTML = "";
}

