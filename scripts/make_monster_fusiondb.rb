require "json"

# The approach here is a simple state machine. There are 4 kinds of lines in the
# file:
# 1) Monster headers: Monster Name (Att/Def) ###
# These can also be equips, traps, etc.: Card Name (Type) ###
# 2) Horizontal lines: Follow immediately after monster headers. Just a bunch of
# hyphens in a row.
# 3) Fusion entries: Monster Name (Att/Def) = Monster Name (Att/Def)
# Or for nonmonsters: Card Name (Type) = Card Name (Type)
# Some are just "monster can equip this": Card Name (Type)
# Of course these can mix and match.
# 4) Blank lines. These separate entries and reset the state machine.
# File format is therefore:
#   Monster Header
#   --------------
#   Entries...
#   <blank line>
# And so on.
# The fusion database is as so: (left, right, output, attack, defense, type)

fusions = []
equips = []
# States: :header, :sep, :entries. Empty line resets.
state = :header
header = ""

def process_entry(line, leftside)
    if line.include? "=" # it's a full fusion
        rightside, output = line.split("=").map(&:strip)
        # We only care about the name of the right input
        rpindex = rightside.rindex " "
        rname = rightside[0..(rpindex-1)]
        # We *do* care about the output's stats, if it has any
        opindex = output.rindex " "
        out_name = output[0..(opindex)].strip
        if output.include? "/" # it's a monster
            stats = (output.match /\((\d+)\/(\d+)\)/)[1,2].map(&:to_i)
            {:left => leftside, :right => rname, :output => out_name, :attack =>
             stats[0], :defense => stats[1], :type => "Monster"}
        else # it's not a monster
            matches = (output.match /\(([^)]+)\)/)
            type = matches[1]
            {:left => leftside, :right => rname, :output => out_name, :attack =>
             0, :defense => 0, :type => type}
        end
    else # It's just an equipment "fusion"
        pindex = line.rindex " "
        name = line[0..(pindex-1)]
        {:left => leftside, :right => name, :type => "Equippable"}
    end
end

File.open("data/monster_fusions_raw.txt").each do |line|
    line.strip!
    if state == :header
        pindex = line.index "("
        header = line[0..(pindex-2)]
        state = :sep
    elsif state == :sep
        raise "Desyncronized while reading the file" unless line[0] == "-"
        state = :entries
    elsif line == "" # empty line, get ready for next block
        state = :header
    else
        entry = process_entry(line, header)
        if entry[:type] == "Equippable"
            equips << entry
        else
            fusions << entry
        end
    end
end

puts "Processed #{fusions.count} fusions"

File.open("data/ygo_fm_monsterfuseDB.js", "w") {|file|
    file.write("var monsterfuseDB = TAFFY(#{JSON.pretty_generate(fusions)})")
}

File.open("data/ygo_fm_monsterfuseDB.json", "w") {|file|
    file.write(JSON.pretty_generate fusions)
}

puts "Wrote JSON DB js file"

puts "Processed #{equips.count} equipment fusions"

File.open("data/ygo_fm_equipDB.js", "w") {|file|
    file.write("var equipDB = TAFFY(#{JSON.pretty_generate(equips)})")
}

File.open("data/ygo_fm_equipDB.json", "w") {|file|
    file.write(JSON.pretty_generate equips)
}

puts "Wrote JSON DB js file"
