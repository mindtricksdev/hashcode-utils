const Population = require("./population");

//setup
const MUTATION_RATE = 0.03;
const POP_MAX = 300;
const RUNS = 900;

const start = (size, scoreTarget, fitnessWeights) => {
  //create population of N, with random DNA
  const population = new Population(POP_MAX, MUTATION_RATE, size, {
    scoreTarget,
    fitnessWeights
  }); //TODO: size
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

    console.log(population.generations, population.fittest.score);
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
