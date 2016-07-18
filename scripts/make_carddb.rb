require "json"

cards = []

nonmons = ["Equip", "Field", "Magic", "Ritual", "Trap"]
stars = ["Moon", "Mercury", "Sun", "Venus",
         "Jupiter", "Mars", "Neptune", "Pluto", "Saturn", "Uranus"]

File.readlines("data/ygo_fm_cardDB.csv").each do |line|
    fields = line.strip.split ";"
    props = {:number => fields[0], :name => fields[1], :cardtype => fields[2]}
    # rindex in case the card has "Monster" in the name
    if fields[2] == "Monster"
        props[:type] = fields[3]
        props[:star1] = fields[4]
        props[:star2] = fields[5]
        props[:level] = fields[6].to_i
        props[:attack] = fields[7].to_i
        props[:defense] = fields[8].to_i
        # These will be nil if the card doesn't have them
        props[:password] = fields[9]
        props[:cost] = fields[10]
    else # other card types
        # These will be nil if the card doesn't have them
        props[:password] = fields[3]
        props[:cost] = fields[4]
    end
    cards << props
end

puts "Processed #{cards.count} cards"

File.open("data/ygo_fm_cardDB.js", "w") {|file|
    file.write("var cardDB = TAFFY(#{JSON.pretty_generate(cards)})")
}

File.open("data/ygo_fm_cardDB.json", "w") {|file|
    file.write(JSON.pretty_generate(cards))
}

puts "Wrote JS and JSON files"
