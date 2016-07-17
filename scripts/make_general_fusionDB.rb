require 'json'

fusions = []

def getName(name)
    name.strip!

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

# Expects a "Name (attack/defense)" string
def getStats(name)
    m = name.match /\((\d+)\/(\d+)\)/
    {:attack => m[1].to_i, :defense => m[2].to_i}
end


File.readlines("data/ygo_fm_genfuseDB.txt").each do |line|
    fields = line.split " + "
    left = fields[0]

    fields = fields[1].split " = "
    right = fields.shift
    output = fields.shift

    fuse = getStats(output)
    fuse[:left] = getName(left)
    fuse[:right] = getName(right)
    fuse[:output] = getName(output)

    fusions << fuse
end

puts "Processed #{fusions.count} fusions"

File.open("data/ygo_fm_genfuseDB.js", "w") {|file|
    file.write("var genfuseDB = TAFFY(#{JSON.pretty_generate(fusions)})")
}

puts "Wrote JSON DB js file"
