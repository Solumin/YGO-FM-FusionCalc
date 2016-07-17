require "json"

cards = []

nonmons = ["Equip", "Field", "Magic", "Ritual", "Trap"]
stars = ["Moon", "Mercury", "Sun", "Venus",
         "Jupiter", "Mars", "Neptune", "Pluto", "Saturn", "Uranus"]

File.readlines("data/ygo_fm_cardDB.txt").each do |line|
    fields = line.split
    props = {}
    # rindex in case the card has "Monster" in the name
    if fields.rindex "Monster"
        ctindex = fields.rindex "Monster" # index of the card type field
        # OK the following line is a bit weird: We're looking for the first
        # Guardian Star field, because the Monster Type can be multiple words.
        # fields.index could fail if the name contains a star, e.g. "Moon Envoy"
        sindex = fields.rindex {|x| stars.include? x} - 1 # index of star1 field
        puts fields if sindex.nil?
        props[:number] = fields[0]
        props[:name] = fields[1,ctindex-1].join(" ")
        props[:cardtype] = fields[ctindex]
        props[:type] = fields[ctindex+1,sindex-(ctindex+1)].join(" ")
        props[:star1] = fields[sindex]
        props[:star2] = fields[sindex+1]
        props[:level] = fields[sindex+2]
        props[:attack] = fields[sindex+3]
        props[:defense] = fields[sindex+4]
        # These will be nil if the card doesn't have them
        props[:password] = fields[sindex+5]
        props[:cost] = fields[sindex+6]
    else # other card types
        ctindex = fields.rindex{|x| nonmons.include? x}
        props[:number] = fields[0]
        props[:name] = fields[1,ctindex-1].join(" ")
        props[:cardtype] = fields[ctindex]
        props[:password] = fields[ctindex+1]
        props[:cost] = fields[ctindex+2]
    end
    cards << props
end

puts "Processed #{cards.count} cards"

File.open("data/ygo_fm_cardDB.js", "w") {|file|
    file.write("var cardDB = TAFFY(#{JSON.pretty_generate(cards)})")
}

puts "Wrote JSON DB js file"
