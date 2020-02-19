function Individual(size) {
  this.genes = [];
  this.fitness = null;

  for (let i = 0; i < size; i++) {
    //TODO: seed
    this.genes[i] = Math.random() > 0.5 ? true : false;
  }
}

Individual.prototype.calculateFitness = () => {
  //TODO: score function
  this.fitness = -1;
};

Individual.prototype.crossover = partner => {
  const child = new Individual(this.genes.length);

  const midpoint = Math.floor(Math.random() * this.genes.length);

  for (let i = 0; i < this.genes.length; i++) {
    if (i > midpoint) child.genes[i] = this.genes[i];
    else child.genes[i] = partner.genes[i];
  }
  return child;
};

Individual.prototype.mutate = mutationRate => {
  for (let i = 0; i < this.genes.length; i++) {
    if (Math.random() < mutationRate) {
      this.genes[i] = true; //TODO: new gene
    }
  }
};

module.exports = Individual;
