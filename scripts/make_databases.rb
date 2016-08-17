require 'json'

# Fusion Format:
# { :card => Y, :result => Z }
# Equip Format: Just list of card #s
# Result Format:
# { :card1 => X, :card2 => Y } preferably with X < Y

cards = JSON.parse(File.read("data/Cards.json"))

fusions = []
results = []
equips = []

cards.each do |card|
    id = card["Id"].to_i
    if not card["Fusions"].nil?
        # Set up the card's entry in the array if necessary
        fusions[id] = [] if fusions[id].nil?
        card["Fusions"].each do |fuse|
            # Get the indices of the other input card and the result
            card2 = fuse["_card2"].to_i
            result = fuse["_result"].to_i

            fusions[card2] = [] if fusions[card2].nil?

            # Add the new fusions
            fusions[id] << {:card => card2, :result => result}
            fusions[card2] << {:card => id, :result => result}

            results[result] = [] if results[result].nil?
            results[result] = {:card1 => id, :card2 => card2}
        end
    end

    if not card["Equip"].nil?
        equips[id] = [] if equips[id].nil?
        card["Equip"].each do |equip|
            target = equip.to_i
            equips[target] = [] if equips[target].nil?
            equips[target] << id
            equips[id] << target
        end
    end
end

output = JSON.pretty_generate fusions
File.open("data/fusions.json", "w") { |file|
    file.write(output)
}
File.open("data/fusions.js", "w") { |file|
    file.write("var fusionsDB = TAFFY(#{output})")
}

output = JSON.pretty_generate results
File.open("data/results.json", "w") { |file|
    file.write(output)
}
File.open("data/results.js", "w") { |file|
    file.write("var resultsDB = TAFFY(#{output})")
}

output = JSON.pretty_generate equips
File.open("data/equips.json", "w") { |file|
    file.write(output)
}
File.open("data/equips.js", "w") { |file|
    file.write("var equipsDB = TAFFY(#{output})")
}

put "STATS: #{fusions.size} fusions, #{equips.size} equips, #{results.size} results"
put "Wrote JS and JSON files for each"
