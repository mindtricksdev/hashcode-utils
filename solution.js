//Use the helpers below to run a genetic algorithm
// const genetic = require("./utils/genetic");
// genetic.Individual.prototype.calculateFitness = function() {};
// genetic.Individual.prototype.seed = function() {};
// genetic.Individual.prototype.mutate = function() {};
// genetic.Individual.prototype.crossover = function(partner) {};

// genetic.start({
//   mutationRate: 0.01,
//   maxIndividuals: 200,
//   generations: 900,
//   individualSize: 20,
//   settings: {}
// });

const run = (firstLine, input) => {
  const [B, L, D] = firstLine;
  const scores = input[0];

  const libraries = [];
  for (let lIdx = 0; lIdx < L; lIdx++) {
    const [N, T, M] = input[lIdx * 2 + 1];
    const books = input[lIdx * 2 + 2];
    libraries.push({
      index: lIdx,
      N,
      T,
      M,
      books
    });
  }

  return [[3], [0, 2, 3]];
};

module.exports = run;
