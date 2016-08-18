require 'json'
# Cards.json uses 1-indexing for card IDs and fusion lists, but 0-indexing for
# Equips and Rituals. This script corrects this by incrementing the IDs for
# Equip and Ritual blocks.

cards = JSON.parse(File.read("data/Cards.json"))

cards = cards.each do |card|
    card["Equip"].map! {|e| e.to_i + 1} unless card["Equip"].nil?
    card["Ritual"].each { |k,i| card["Ritual"][k] = i + 1 } unless card["Ritual"].nil?
end

# Try to match the original output by putting empty arrays together
output = JSON.pretty_generate(cards).gsub(/\[\s*\]/, "[]")
File.open("data/Cards.json", "w") { |file|
    file.write(output)
}

