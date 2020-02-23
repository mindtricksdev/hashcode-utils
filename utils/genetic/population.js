const Individual = require("./individual");

const DEFAULT_OPTIONS = {
  keepFittestAlive: false,
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
  this.fittestEver = null;

  this.matingPool = null;
}

Population.prototype.seed = function() {
  for (let i = 0; i < this.options.maxIndividuals; i++) {
    this.population[i] = new Individual(this);
    this.population[i].seed(i);
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

  if (!this.fittestEver) this.fittestEver = this.fittest;
  if (this.fittest.fitness > this.fittestEver.fitness) {
    this.fittestEver = this.fittest;
  }

  this.population = this.population.sort((a, b) => b.fitness - a.fitness);
};

Population.prototype.naturalSelection = function() {
  //perform natural selection, generate mating pool
  this.matingPool = [];
  for (let i = 0; i < this.population.length; i++) {
    const mate = this.population[i];
    if (this.fittest && this.fittest.fitness > 0) {
      //individuals with higher fitness get selected more often
      const normalizedFitness = Math.floor(
        (100 * this.population[i].fitness) / this.fittestEver.fitness
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

  let startFrom = 0;
  if (this.options.keepFittestAlive) {
    startFrom = 1;
    this.population[0] = this.fittestEver;
    if (this.fittest !== this.fittestEver) {
      this.population[1] = this.fittest;
      startFrom = 2;
    }
  }

  this.population = this.population.sort((a, b) => b.fitness - a.fitness);

  for (let i = startFrom; i < startFrom + 5; i++) {
    //preserve
  }
  startFrom = startFrom + 3;

  for (let i = startFrom; i < this.population.length; i++) {
    const a = Math.floor(this.matingPool.length * Math.random());
    let b = Math.floor(this.matingPool.length * Math.random());
    const partnerA = this.matingPool[a];
    let partnerB = this.matingPool[b];
    while (partnerA === partnerB) {
      b = Math.floor(this.matingPool.length * Math.random());
      partnerB = this.matingPool[b];
    }
    const child = partnerA.crossover(partnerB);
    if (!child)
      throw "A child should result from crossover. Check that you implemented the crossover function or use the default function.";

    child.calculateFitness();

    // if (child.fitness > this.fittest.fitness)
    // console.log("c", child.fitness, this.fittest.fitness);

    // const before = child.fitness;
    child.mutate();
    child.calculateFitness();
    // const after = child.fitness;
    // if (after > before) console.log("m", after, before);

    this.population[i] = child;
  }

  this.matingPool = [];

  this.generations++;
};

module.exports = Population;
