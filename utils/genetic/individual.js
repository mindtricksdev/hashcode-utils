/**
 * @param {import('./population')} population
 */
function Individual(population) {
  this.population = population;

  this.genes = [];
  this.size = this.population.options.individualSize;
  this.fitness = null;
}

Individual.prototype.seed = function() {
  for (let i = 0; i < this.size; i++) {
    //CUSTOM: seed
    this.genes[i] = Math.random() > 0.5 ? true : false;
  }
};

Individual.prototype.calculateFitness = function() {
  //CUSTOM: score function
  this.fitness = 0;
};

Individual.prototype.crossover = function(partner) {
  const child = new Individual(this.population);

  const midpoint = Math.floor(Math.random() * this.genes.length);

  for (let i = 0; i < this.genes.length; i++) {
    if (i > midpoint) child.genes[i] = this.genes[i];
    else child.genes[i] = partner.genes[i];
  }
  return child;
};

Individual.prototype.mutate = function() {
  for (let i = 0; i < this.genes.length; i++) {
    if (Math.random() < this.population.options.mutationRate) {
      this.genes[i] = true; //CUSTOM: new gene
    }
  }
};

module.exports = Individual;
