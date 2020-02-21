const Population = require("./population");
const Individual = require("./individual");

const DEFAULT_OPTIONS = {
  mutationRate: 0.01,
  maxIndividuals: 100,
  generations: 200,
  individualSize: 20,
  settings: {}
};

const TOOK = {
  fitness: 0,
  naturalSelection: 0,
  generate: 0,
  seed: 0
};

const start = (options = DEFAULT_OPTIONS) => {
  //create population of N, with random DNA
  let start = Date.now();
  const population = new Population(options);
  population.seed();
  TOOK.seed += Date.now() - start;

  let maxFitness = 0;
  const run = () => {
    //evaluate fitness of each individual
    start = Date.now();
    population.calculateFitness();
    TOOK.fitness += Date.now() - start;

    //build a mating pool
    start = Date.now();
    population.naturalSelection();
    TOOK.naturalSelection += Date.now() - start;

    //pick two parents
    //crossover
    //mutation
    //add child to a new population
    //replace the old population with the new and return to selection
    start = Date.now();
    population.generate();
    TOOK.generate += Date.now() - start;

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
    "%s\x1b[42m\x1b[30m %s \x1b[0m",
    " > End " + population.generations + " generations ",
    population.fittestEver.fitness
  );

  console.log(
    " > Took ",
    (TOOK.seed / 1000).toFixed(2) + "s seed ",
    (TOOK.fitness / 1000).toFixed(2) + "s fitness ",
    (TOOK.generate / 1000).toFixed(2) + "s generate ",
    (TOOK.naturalSelection / 1000).toFixed(2) + "s naturalSelection "
  );

  return population.fittestEver;
};

exports.start = start;
exports.Population = Population;
exports.Individual = Individual;
