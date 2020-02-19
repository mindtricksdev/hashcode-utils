const Population = require("./population");

//setup
const MUTATION_RATE = 0.01;
const POP_MAX = 100;
const RUNS = 200;

const start = () => {
  //create population of N, with random DNA
  const population = new Population(POP_MAX, MUTATION_RATE, 200); //TODO: size

  const run = () => {
    //evaluate fitness of each individual
    population.calculateFitness();
    //build a mating pool
    population.naturalSelection();
    //pick two parents
    //crossover
    //mutation
    //add child to a new population
    //replace the old population with the new and return to selection
    population.generate();
  };

  let runs = 0;
  while (runs < RUNS) {
    run();
    runs++;
  }
  console.log("Genetic algorithm finished after " + RUNS + " runs.");

  //TODO: transform to indexes
  return population.fittest;
};

module.exports = start;
