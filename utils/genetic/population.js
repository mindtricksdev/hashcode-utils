const Individual = require("./individual");

const DEFAULT_OPTIONS = {
  mutationRate: 0.01,
  maxIndividuals: 100,
  generations: 200,
  individualSize: 20,
  settings: {}
};

function Population(options = DEFAULT_OPTIONS) {
  this.options = options;

  this.generations = 0;

  this.population = [];
  this.fittest = null;

  this.matingPool = null;
}

Population.prototype.seed = function() {
  for (let i = 0; i < this.options.maxIndividuals; i++) {
    this.population[i] = new Individual(this);
    this.population[i].seed();
  }
};

Population.prototype.calculateFitness = function() {
  let MAX_FITNESS = -1;
  //calculate fitness for each individual
  for (let i = 0; i < this.population.length; i++) {
    this.population[i].calculateFitness();

    if (typeof this.population[i].fitness !== "number")
      throw "Individual fitness should be a number but received " +
        this.population[i].fitness;

    if (this.population[i].fitness > MAX_FITNESS) {
      this.fittest = this.population[i];
      MAX_FITNESS = this.fittest.fitness;
    }
  }
};

Population.prototype.naturalSelection = function() {
  //perform natural selection, generate mating pool
  this.matingPool = [];
  for (let i = 0; i < this.population.length; i++) {
    const mate = this.population[i];
    if (this.fittest && this.fittest.fitness > 0) {
      //individuals with higher fitness get selected more often
      const normalizedFitness = Math.floor(
        (100 * this.population[i].fitness) / this.fittest.fitness
      );
      const N = normalizedFitness;
      for (let j = 0; j < N; j++) {
        this.matingPool.push(mate);
      }
    } else {
      this.matingPool.push(mate);
    }
  }
};

Population.prototype.generate = function() {
  //next generation from mating pool created by natural selection
  for (let i = 0; i < this.population.length; i++) {
    const a = Math.floor(this.matingPool.length * Math.random());
    const b = Math.floor(this.matingPool.length * Math.random());
    const partnerA = this.matingPool[a];
    const partnerB = this.matingPool[b];
    const child = partnerA.crossover(partnerB);
    if (!child)
      throw "A child should result from crossover. Check that you implemented the crossover function or use the default function.";

    child.mutate();

    this.population[i] = child;
  }

  this.matingPool = [];

  this.generations++;
};

module.exports = Population;
