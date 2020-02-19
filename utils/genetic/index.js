const Population = require("./population");

//setup
const MUTATION_RATE = 0.01;
const POP_MAX = 100;
const RUNS = 200;

const start = (size, fitnessTarget, fitnessWeights) => {
  //create population of N, with random DNA
  const population = new Population(POP_MAX, MUTATION_RATE, size); //TODO: size
  population.seed();

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

    console.log(population.generations, population.fittest.fitness);
  };

  while (population.generations < RUNS) {
    run();
  }

  console.log(
    "Genetic algorithm finished after " + population.generations + " runs."
  );

  //CUSTOM: transform to indexes
  return population.fittest;
};

module.exports = start;
