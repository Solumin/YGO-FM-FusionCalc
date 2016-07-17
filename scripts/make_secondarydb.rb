require "json"

secondaries = []
File.readlines("data/ygo_fm_secondaryDB.txt").each do |line|
    fields = line.split
    bindex = fields.rindex "|"
    props = {}
    props[:name] = fields[0,bindex].join " "
    props[:secondarytypes] = fields[bindex+1..-1].join(" ").split(", ")
    secondaries << props
end

puts "Processed #{secondaries.count} cards"

File.open("data/ygo_fm_secondaryDB.js", "w") {|file|
    file.write("var secondaryDB = TAFFY(#{secondaries.to_json})")
}

puts "Wrote JSON DB js file"
