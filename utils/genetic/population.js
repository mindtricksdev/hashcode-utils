const Individual = require("./individual");

function Population(maxIndividuals, mutationRate, individualSize, options) {
  this.population = [];
  this.matingPool = null;
  this.fittest = null;
  this.generations = 0;
  this.mutationRate = mutationRate;
  this.maxIndividuals = maxIndividuals;
  this.individualSize = individualSize;
  this.options = options;
}

Population.prototype.seed = function() {
  for (let i = 0; i < this.maxIndividuals; i++) {
    this.population[i] = new Individual(this, this.individualSize);
    this.population[i].seed();
  }
};

Population.prototype.calculateFitness = function() {
  let MAX_FITNESS = -1;
  //calculate fitness for each individual
  for (let i = 0; i < this.population.length; i++) {
    this.population[i].calculateFitness();

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
    if (this.fittest) {
      //individuals with higher fitness get selected more often
      const normalizedFitness = Math.floor(
        (100 * mate.fitness) / this.fittest.fitness
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
    child.mutate(this.mutationRate);

    this.population[i] = child;
  }

  this.matingPool = [];
  this.fitness = null;

  this.generations++;
};

Population.prototype.evaluate = function() {
  //are we done?
};

module.exports = Population;
