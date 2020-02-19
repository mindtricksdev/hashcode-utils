const Individual = require("./individual");

function Population(maxIndividuals, mutationRate, individualSize) {
  this.population = [];
  this.matingPool = null;
  this.fittest = null;
  this.generations = 0;
  this.mutationRate = mutationRate;

  for (let i = 0; i < maxIndividuals; i++) {
    this.population[i] = new Individual(individualSize);
  }
}

Population.prototype.calculateFitness = () => {
  let MAX_FITNESS = -1;
  //calculate fitness for each individual
  for (let i = 0; i < this.population.length; i++) {
    this.population[i].calculateFitness();

    if (this.population[i].fitness > MAX_FITNESS)
      this.fittest = this.population[i];
  }
};

Population.prototype.naturalSelection = () => {
  //perform natural selection, generate mating pool

  this.matingPool = [];
  for (let i = 0; i < this.population.length; i++) {
    const mate = this.population[i];
    //individuals with higher fitness get selected more often
    const normalizedFitness = Math.floor(
      (100 * this.population[i].fitness) / this.fittest.fitness
    );
    const N = normalizedFitness;
    for (let j = 0; j < N; j++) {
      this.matingPool.push(mate);
    }
  }
};

Population.prototype.generate = () => {
  //next generation from mating pool created by natural selection
  for (let i = 0; i < this.population.length; i++) {
    const a = Math.floor(Math.random(this.matingPool.length));
    const b = Math.floor(Math.random(this.matingPool.length));
    const partnerA = this.matingPool[a];
    const partnerB = this.matingPool[b];
    const child = partnerA.crossOver(partnerB);
    child.mutate(this.mutationRate);

    this.population[i] = child;
  }

  this.generations++;
};

Population.prototype.evaluate = () => {
  //are we done?
};

module.exports = Population;
