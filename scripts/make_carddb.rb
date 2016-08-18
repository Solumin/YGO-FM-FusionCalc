require "json"

cards = []

File.readlines("data/ygo_fm_cardDB.csv").each do |line|
    fields = line.strip.split ";"
    props = {
        :number => fields[0],
        :name => fields[1],
        :cardtype => fields[2],
        :password => fields[3],
        :cost => fields[4]
    }
    if fields[2] == "Monster"
        props[:type] = fields[5]
        props[:star1] = fields[6]
        props[:star2] = fields[7]
        props[:level] = fields[8].to_i
        props[:attack] = fields[9].to_i
        props[:defense] = fields[10].to_i
        props[:secondarytypes] = fields[11][1..-2].split ", "
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
