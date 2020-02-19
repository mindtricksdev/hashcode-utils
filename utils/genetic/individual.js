function Individual(population, size) {
  this.population = population;
  this.size = size;
  this.genes = [];
  this.fitness = null;
}

Individual.prototype.seed = function() {
  this.score = 0;
  for (let i = 0; i < this.size; i++) {
    //CUSTOM: seed
    this.genes[i] = Math.random() > 0.5 ? true : false;

    if (this.genes[i]) {
      if (
        this.score + this.population.options.fitnessWeights[i] >
        this.population.options.scoreTarget
      )
        //exceeds limit
        break;

      this.score += this.population.options.fitnessWeights[i];
    }
  }
};

Individual.prototype.calculateFitness = function() {
  //CUSTOM: score function

  this.score = 0;
  for (let i = 0; i < this.size; i++) {
    if (this.genes[i]) this.score += this.population.options.fitnessWeights[i];
  }

  this.fitness = this.score / this.population.options.scoreTarget;
};

Individual.prototype.crossover = function(partner) {
  const child = new Individual(this.population, this.genes.length);

  if (this.score === this.population.options.scoreTarget) return this; //preserve perfect specimen
  if (partner.score === this.population.options.scoreTarget) return partner; //preserve perfect specimen

  const midpoint = Math.floor(Math.random() * this.genes.length);

  let score = 0;
  for (let i = 0; i < this.genes.length; i++) {
    if (i > midpoint) child.genes[i] = this.genes[i];
    else child.genes[i] = partner.genes[i];

    if (child.genes[i]) score += this.population.options.fitnessWeights[i];

    if (score > this.population.options.scoreTarget) child.genes[i] = false;
  }
  return child;
};

Individual.prototype.mutate = function() {
  if (this.score === this.population.options.scoreTarget) return; //preserve perfect specimen

  for (let i = 0; i < this.genes.length; i++) {
    if (Math.random() < this.population.mutationRate) {
      this.genes[i] = true; //CUSTOM: new gene
    }
  }
  this.calculateFitness();
  if (this.score > this.population.options.scoreTarget) {
    for (let i = 0; i < this.genes.length; i++) {
      if (this.genes[i]) {
        this.genes[i] = false;
        this.score -= this.population.options.fitnessWeights[i];
        if (this.score <= this.population.options.scoreTarget) break;
      }
    }
  }
};

module.exports = Individual;
