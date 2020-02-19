const genetic = require("./utils/genetic");

const run = (firstLine, input) => {
  const pizzaTypesCount = firstLine[1];
  const target = firstLine[0];
  const pizzaTypes = input[0];

  const solution = genetic(pizzaTypesCount, target, pizzaTypes);

  const output = [];
  solution.genes.map((val, idx) => {
    if (val) {
      output.push(idx);
    }
  });

  return [output.length, output];
};

module.exports = run;
