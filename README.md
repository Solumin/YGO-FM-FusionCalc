## Yu-Gi-Oh! Forbidden Memories Fusion Calculator

Version: 0.8

Yu-Gi-Oh! Forbidden Memories is a terrible game with a terrible mechanic called
"fusions." Fusions allow the player to fuse two cards together to get a new,
hopefully more powerful card.

But, since it's a terrible game, YGO:FM does nothing to actually _tell_ you
about the fusions. Your options are to either try every card against every other
card (and by the way there's over 720 cards in the game) or to look it up
online. Oh, and the game doesn't try to record the fusions at all. And since
one card might fuse with a few _hundred_ other cards, trying to find out which
ones are worth it is tedious.

The real motivation for this project is Giver336's LP of the game on Something
Awful. His co-commentator, General Yeti, mused about the possibility of a
program to find the fusions for you. Here it is!

**How to Use the Calculator**

Visit the Fusion Search and Calculator on [GitHub
Pages!](https://solumin.github.io/YGO-FM-FusionCalc/)

### What's Next?

-   [ ] Better formatting of output, I guess
-   [ ] Sorting of fusions, probably

### Contributing

Feel free to fork and send in pull requests. This is my first "real" JavaScript
project, and I know it's ugly. I'll add a license sooner or later.

### Project Notes

All data for the project is in the `data` directory, and it is all derived from
`Cards.json` into a series of lists, using `scripts/make_databases.rb`.

-   `cards.js` loads `Cards.json` into a [TaffyDB](http://www.taffydb.com/)
    instance
-   `fusions.js` loads the list of fusions for each card into a list.
-   `equips.js` loads the list of equips for each card into a list. If the card
    can _equip_ items, its entry is the list of Equip-type cards that it can be
    used with. If the card is an _Equip-type_ card, its entry is the list of cards
    it can be equipped onto.
-   `results.js` loads the list of fusions for each card that the card is the
    result of.
-   `types_and_stars.js` has two lists that map indexes to the card types (Beast,
    Spellcaster, Dragon, etc.) and to star names. (Neptune, Moon, etc.)

## Special Thanks:

-   Steve Kalynuik, Dylan Birtolo and Miguel Balauag, for the [Fusion
    FAQ](https://www.gamefaqs.com/ps/561010-yu-gi-oh-forbidden-memories/faqs/16613), an invaluable resource
-   The Yu-Gi-Oh! Wikia, for the list of cards that I turned into the card
    database
-   [CathodeRaymond](https://github.com/CathodeRaymond) for work with CSS and making the project actually look good
-   [duke1102](https://github.com/duke1102) for providing `Cards.json`, without which this project would be
    _very_ innacurate.
-   marcos0000 for Forbidden Memories Logo in HD [devianart profile](https://www.deviantart.com/marcos0000) and Carlos123321 for vrains background [devianart profile](https://www.deviantart.com/carlos123321)
-   Giver336 for the .gif
