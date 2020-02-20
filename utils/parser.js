const fs = require("fs");

const FOLDER = "in/";

const parser = (sets, onSet) => {
  sets.map(set => {
    readInputSet(set, (firstLine, parsedInput, file) => {
      onSet({ set, file }, firstLine, parsedInput);
    });
  });
};

const readInputSet = (set, cb) => {
  fs.readdir(FOLDER, (err, files) => {
    if (err) throw err;

    files.forEach(file => {
      if (!file.startsWith(set)) return;

      fs.readFile(FOLDER + file, "utf8", (err, data) => {
        if (err) throw err;

        console.log(
          "\x1b[32m%s\x1b[0m",
          "-> Read " + file + " (" + (data.length / 1024).toFixed(2) + " KB)"
        );

        //remove rows that are empty
        data = data.split("\n").filter(r => !!r);

        const firstLineStr = data.shift();
        const firstLine = parseLine(firstLineStr);

        const parsedInput = data.map(line => parseLine(line));
        cb(firstLine, parsedInput, file);
      });
    });
  });
};

const parseLine = lineStr => {
  const values = lineStr.split(" ");

  return values.map(v => {
    const intVal = parseInt(v, 10);
    if (isNaN(intVal)) return v;
    return intVal;
  });
};

module.exports = parser;
