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
      id: lIdx,
      N,
      T,
      M,
      books
    });
  }

  //--- CODE HERE

  //--- CODE HERE

  const libs = [
    {
      id: 1,
      books: [5, 2, 3]
    },
    {
      id: 0,
      books: [0, 1, 2, 3, 4]
    }
  ];

  //dump
  const result = [[libs.length]];
  for (let lIdx = 0; lIdx < libs.length; lIdx++) {
    let lib = libs[lIdx];
    result.push([lib.id, lib.books.length]);
    result.push(lib.books);
  }

  return result;
};

module.exports = run;
