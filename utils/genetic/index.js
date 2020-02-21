const Population = require("./population");
const Individual = require("./individual");

const DEFAULT_OPTIONS = {
  mutationRate: 0.01,
  maxIndividuals: 100,
  generations: 200,
  individualSize: 20,
  settings: {}
};

const start = (options = DEFAULT_OPTIONS) => {
  //create population of N, with random DNA
  const population = new Population(options);
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

    if (!population.fittest) throw "Fittest individual could not be determined";
    console.log(
      "\x1b[36m%s\x1b[0m",
      population.fittest.fitness +
        " / " +
        population.fittestEver.fitness +
        " (" +
        population.generations +
        " generation)"
    );
  };

  while (population.generations < options.generations) {
    run();
  }

  console.log(
    "\x1b[34m%s\x1b[0m",
    " > Genetic algorithm finished after " + population.generations + " runs."
  );

  //CUSTOM: transform to indexes
  return population.fittestEver;
};

exports.start = start;
exports.Population = Population;
exports.Individual = Individual;
