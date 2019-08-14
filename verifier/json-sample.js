var s = readFile(arg[1]);
var log = JSON.parse(s.replace(/\r?\n/g, ""))
print(JSON.stringify(log))
