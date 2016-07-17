## Yu-Gi-Oh! Forbidden Memories Fusion Calculator

Version: 0.1  
Current status: Complete card database, only supports general fusions.

Yu-Gi-Oh! Forbidden Memories is a terrible game with a terrible mechanic called
"fusions." Fusions allow the player to fuse two cards together to get a new,
hopefully more powerful card.

But, since it's a terrible game, YGO:FM does nothing to actually _tell_ you
about the fusions. Your options are to either try every card against every other
card (and by the way there's over 770 cards in the game) or to look it up
online. Oh, and the game doesn't try to record the fusions at all. And since
one card might fuse with a few _hundred_ other cards, trying to find out which
ones are worth it is tedious.

The real motivation for this project is Giver336's LP of the game on Something
Awful. His co-commentator, General Yeti, mused about the possibility of a
program to find the fusions for you. Here it is!

**How to Use the Calculator**

Open `index.html` in your preferred web browser. It should work in Chrome,
Firefox, and IE 10+.

Currently, the calculator is basic as can be. Enter the name, monster type or
card type that you want to look up, and the script will spit out the appropriate
fusions. It's really ugly and unformatted, but it works.

**Note:** The calculator currently only supports general fusions! So it'll tell
you if you can combine a Dragon and a Zombie and what you'll get, but it can't
tell you if your card can be fused with anything specific. This means the "name"
field doesn't work that great, but I'll fix that soon.

It's not case sensitive but it is punctuation sensitive, so cards like
"30,000-Year White Turtle" need to spelled exactly as shown.

### What's Next?

- Better support for looking up monsters by name
- All monster-to-monster fusions
- More exact fusion checks. Every general fusion limits the attack stat of the
  inputs, and some also have a minimum attack stat that is based on other
  fusions of the same input type (see Zombie + Dragon)
- Better formatting of output, I guess
- Making all the input files CSVs (may not be possible for secondary DB)

### Contributing

Feel free to fork and send in pull requests. This is my first "real" JavaScript
project, and I know it's ugly. I'll add a license sooner or later.

### Project Notes

The `data` directory contains the raw text dumps of the cards and fusions.

- `ygo_fm_cardDB.txt` is the card database, pulled from the Yu-Gi-Oh! Wikia
- `ygo_fm_secondaryDB.txt` is a DB containing extra notes for some of the cards.
  (See below.)
- `ygo_fm_genfuseDB.txt` is the general fusions list, pulled from the Fusion
  FAQ.

Each of this has an associated .js file that loads it into TaffyDB for use in
the script.

These .js scripts are generated using the scripts located in the
appropriately-named `scripts` directory. They expect to be run from the project
directory, e.g. `ruby scripts/make_general_fusionDB.rb`. Since the database
files are now fairly readable JSON (instead of massive blobs of unreadable JSON)
these scripts and their inputs should be considered deprecated.

Each Monster card in Forbidden Memories has an associated Type, such as Beast,
Dragon, Fish, Insect and so on. However, some cards count as multiple types: 
Angelwitch, for example, counts as Dark Magic, Dark Spellcaster, Female and
Special-A types! The card DB only has room for a single type, so the secondary
DB handles these extra types. I'm debating folding the secondary types into the
main card DB.

## Special Thanks:

- Steve Kalynuik, Dylan Birtolo and Miguel Balauag, for the [Fusion
  FAQ](https://www.gamefaqs.com/ps/561010-yu-gi-oh-forbidden-memories/faqs/16613), an invaluable resource
- The Yu-Gi-Oh! Wikia, for the list of cards that I turned into the card
  database
