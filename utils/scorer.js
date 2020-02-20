const fs = require("fs");
const scoreFn = require("../score");

const FOLDER = "history/";

const scorer = ({ sets, set, file }, firstInputLine, input, output) => {
  try {
    const score = scoreFn(output, firstInputLine, input);
    if (score === null || typeof score === "undefined") return;

    if (isNaN(score)) throw "Invalid output or score.";

    console.log(
      "\x1b[42m\x1b[30m%s\x1b[0m",
      "=> Score for " + set + ": " + score
    );

    const fileName =
      set +
      "__" +
      score +
      "__" +
      sets.join("") +
      "__" +
      Math.floor(Math.random() * 100000);

    const scorePath = FOLDER + fileName;

    if (!fs.existsSync(FOLDER)) fs.mkdirSync(FOLDER);
    fs.writeFile(scorePath, "", err => {
      if (err) throw err;
    });
  } catch (e) {
    console.error(e);
  }
};

module.exports = scorer;
