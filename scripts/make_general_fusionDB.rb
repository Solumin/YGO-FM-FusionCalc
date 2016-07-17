require 'json'

fusions = []

def getName(name)
    # if the name starts with "[" then it's a group, e.g. [Fish]
    # Return the group as the name
    if name[0] == '['
        return name[1..-2]
    end

    # Otherwise it's actually a name and may have a stat field
    # "Name (stats)"
    pindex = name.index "("
    if pindex
        return name[0..(pindex-2)]
    else
        return name
    end
end

File.readlines("data/ygo_fm_genfuseDB.txt").each do |line|
    fields = line.strip.split ","

    fuse = {}
    fuse[:left] = getName(fields[0])
    fuse[:right] = getName(fields[1])
    fuse[:output] = fields[2]
    fuse[:attack] = fields[3].to_i
    fuse[:defense] = fields[4].to_i
    fuse[:minattack] = fields[5].to_i

    fusions << fuse
end

puts "Processed #{fusions.count} fusions"

File.open("data/ygo_fm_genfuseDB.js", "w") {|file|
    file.write("var genfuseDB = TAFFY(#{JSON.pretty_generate(fusions)})")
}

puts "Wrote JSON DB js file"
