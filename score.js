//return an integer

const score = (output, firstInputLine, input) => {
  const pizzaTypes = input[0];

  const sum = output[1].reduce(
    (sum, pizzaType) => sum + pizzaTypes[pizzaType],
    0
  );
  return sum;
};

module.exports = score;
