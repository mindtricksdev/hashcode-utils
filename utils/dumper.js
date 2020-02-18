const fs = require("fs");

const FOLDER = "out/";

const dumper = ({ file }, data) => {
  const content = getContent(data);

  fs.writeFile(FOLDER + file, content, err => {
    if (err) throw err;

    console.log(
      "Write " + file + " (" + (content.length / 1024).toFixed(2) + " KB)"
    );
  });
};

const getContent = data => {
  if (!data)
    throw "Output data not found. You should return the output in order to be dumped!";

  if (typeof data === "string") return data;
  if (data.length) {
    //lines as array
    let output = "";
    data.forEach(line => {
      if (output) output += "\n";
      output += serializeLine(line);
    });
    return output;
  }

  throw "Unknown output data type";
};

const serializeLine = line => {
  if (typeof line === "string") return line;

  if (line.length) {
    //columns as array
    let output = "";
    line.forEach(col => {
      if (output) output += " ";
      output += col;
    });
    return output;
  }

  throw "Unknown output data type row";
};

module.exports = dumper;