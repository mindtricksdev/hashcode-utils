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

  let maxFitness = 0;
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

    if (population.fittestEver.fitness > maxFitness) {
      //new high score
      console.log(
        "\x1b[30m\x1b[42m %s \x1b[0m%s +%d%",
        population.fittestEver.fitness,
        " (gen " + population.generations + ")",
        100 - (100 * maxFitness) / population.fittestEver.fitness
      );
    } else {
      console.log(
        "\x1b[37m %s \x1b[0m-%d%",
        population.fittest.fitness + "  (gen " + population.generations + ")",
        100 -
          (100 * population.fittest.fitness) / population.fittestEver.fitness
      );
    }

    maxFitness = population.fittestEver.fitness;
  };

  while (population.generations < options.generations) {
    run();
  }

  console.log(
    "%s\x1b[1m\x1b[42m\x1b[30m %s \x1b[0m",
    " > End " + population.generations + " generations ",
    population.fittestEver.fitness
  );

  //CUSTOM: transform to indexes
  return population.fittestEver;
};

exports.start = start;
exports.Population = Population;
exports.Individual = Individual;
