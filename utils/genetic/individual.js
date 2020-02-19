function Individual(population, size) {
  this.population = population;
  this.genes = [];
  this.fitness = null;
}

Individual.prototype.seed = function() {
  for (let i = 0; i < size; i++) {
    //CUSTOM: seed
    this.genes[i] = Math.random() > 0.5 ? true : false;
  }
};

Individual.prototype.calculateFitness = function() {
  //CUSTOM: score function
  this.fitness = -1;
};

Individual.prototype.crossover = function(partner) {
  const child = new Individual(this.population, this.genes.length);

  const midpoint = Math.floor(Math.random() * this.genes.length);

  for (let i = 0; i < this.genes.length; i++) {
    if (i > midpoint) child.genes[i] = this.genes[i];
    else child.genes[i] = partner.genes[i];
  }
  return child;
};

Individual.prototype.mutate = function(mutationRate) {
  for (let i = 0; i < this.genes.length; i++) {
    if (Math.random() < mutationRate) {
      this.genes[i] = true; //CUSTOM: new gene
    }
  }
};

module.exports = Individual;
