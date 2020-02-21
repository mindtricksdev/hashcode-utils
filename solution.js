const genetic = require("./utils/genetic");
// const calculateScore = require("./score");

const calculateScore = function(libs, settings) {
  const { D, scores, libraries } = settings;

  let signingThreadDays = 0;

  const scanned = [];

  let score = 0;
  libs.forEach(lib => {
    const library = libraries.find(l => l.id === lib.id);
    const daysToSignUp = library.T;
    const perDay = library.M;

    //sign up
    signingThreadDays += daysToSignUp;
    const daysLeft = D - signingThreadDays;
    let bIdx = 0;
    for (let d = 0; d < daysLeft; d++) {
      if (typeof lib.books[bIdx] === "undefined") break;
      for (let b = 0; b < perDay; b++) {
        if (typeof lib.books[bIdx] === "undefined") break;

        score +=
          scanned.indexOf(lib.books[bIdx]) > -1 ? scores[lib.books[bIdx]] : 0;
        bIdx++;
        scanned.push(lib.books[bIdx]);
      }
    }
  });

  return score;
};

genetic.Individual.prototype.seed = function() {
  const libCount = this.population.options.settings.L;
  const libraries = this.population.options.settings.libraries;
  // const scores = this.population.options.settings.scores;

  const libs = [];
  for (let i = 0; i < libCount; i++) {
    libs.push(i);
  }
  shuffle(libs);

  this.genes = [];
  for (let i = 0; i < libCount; i++) {
    const crtLib = libs[i];
    this.genes.push("L" + crtLib);
    //add books
    const libBooks = [...libraries[crtLib].books];
    // libBooks.sort((a, b) => scores[b] - scores[a]);
    shuffle(libBooks);
    for (let b = 0; b < libBooks.length; b++) {
      this.genes.push(libBooks[b]);
    }
  }
};

genetic.Individual.prototype.calculateFitness = function() {
  const libs = decode(this);
  this.fitness = calculateScore(libs, this.population.options.settings);
};

const decode = individual => {
  const libs = [];

  let crtLib = null;
  for (let gIdx = 0; gIdx < individual.genes.length; gIdx++) {
    const gene = individual.genes[gIdx];
    if (typeof gene === "string") {
      crtLib = {
        id: parseInt(gene.replace("L", ""), 10),
        books: []
      };
      libs.push(crtLib);
    } else {
      crtLib.books.push(gene);
    }
  }

  return libs;
};

genetic.Individual.prototype.mutate = function() {
  if (Math.random() > this.population.options.mutationRate) return;

  //shuffle books in lib
  const libIdxs = [];
  for (let gIdx = 0; gIdx < this.genes.length; gIdx++) {
    const gene = this.genes[gIdx];
    if (typeof gene === "string") {
      libIdxs.push(gIdx);
    }
  }

  if (libIdxs.length > 1) {
    const randomLib = Math.floor((libIdxs.length - 1) * Math.random());
    const gIdxStart = libIdxs[randomLib];
    if (typeof gIdxStart !== "undefined" && libIdxs[randomLib + 1]) {
      const gIdxEnd = libIdxs[randomLib + 1];

      const slice = this.genes.slice(gIdxStart, gIdxEnd);
      const l = slice.shift();
      shuffle(slice);
      this.genes.splice(gIdxStart, slice.length + 1, l, ...slice);
    }
  }
};
genetic.Individual.prototype.crossover = function(partner) {
  const aLibIdxs = [];
  for (let gIdx = 0; gIdx < this.genes.length; gIdx++) {
    const gene = this.genes[gIdx];
    if (typeof gene === "string") {
      aLibIdxs.push({
        start: gIdx,
        id: parseInt(gene.replace("L", ""))
      });
    }
  }
  const aLibs = [];
  for (let i = 0; i < aLibIdxs.length; i++) {
    if (aLibIdxs[i + 1]) {
      aLibs.push({
        id: aLibIdxs[i].id,
        start: aLibIdxs[i].start,
        end: aLibIdxs[i + 1].start
      });
    } else {
      aLibs.push({
        id: aLibIdxs[i].id,
        start: aLibIdxs[i].start,
        end: this.genes.length
      });
    }
  }

  const bLibIdxs = [];
  for (let gIdx = 0; gIdx < partner.genes.length; gIdx++) {
    const gene = partner.genes[gIdx];
    if (typeof gene === "string") {
      bLibIdxs.push({
        start: gIdx,
        id: parseInt(gene.replace("L", ""))
      });
    }
  }
  const bLibs = [];
  for (let i = 0; i < bLibIdxs.length; i++) {
    if (bLibIdxs[i + 1]) {
      bLibs.push({
        id: bLibIdxs[i].id,
        start: bLibIdxs[i].start,
        end: bLibIdxs[i + 1].start
      });
    } else {
      bLibs.push({
        id: bLibIdxs[i].id,
        start: bLibIdxs[i].start,
        end: partner.genes.length
      });
    }
  }

  const child = new genetic.Individual(this.population);
  child.genes = [];
  const ids = aLibs.map(i => i.id);
  shuffle(ids);

  // const prevSegments = [];
  for (let i = 0; i < ids.length; i++) {
    const libId = ids[i];
    let segment;
    if (Math.random() > 0.5) {
      let slice = aLibs.find(l => l.id === libId);
      segment = this.genes.slice(slice.start, slice.end);
    } else {
      let slice = bLibs.find(l => l.id === libId);
      segment = partner.genes.slice(slice.start, slice.end);
    }

    const libI = segment.shift();
    // segment = smartShuffle(segment, prevSegments);

    child.genes.push(libI);
    child.genes = child.genes.concat(segment);
    // prevSegments.push(segment);
  }
  return child;
};

const smartShuffle = (segment, prevSegments) => {
  const out = [];

  for (let i = 0; i < segment.length; i++) {
    const gene = segment[i];
    let last = false;
    for (let s = 0; s < prevSegments.length; s++) {
      const bookIdx = prevSegments[s].indexOf(gene);
      if (bookIdx > -1 && bookIdx < prevSegments[s].length / 2) {
        last = true;
        break;
      }
    }

    if (last) out.push(gene);
    else out.unshift(gene);
  }

  return out;
};

const run = (firstLine, input) => {
  const [B, L, D] = firstLine;
  const scores = input[0];

  const libraries = [];
  for (let lIdx = 0; lIdx < L; lIdx++) {
    const [N, T, M] = input[lIdx * 2 + 1];
    const books = input[lIdx * 2 + 2];
    libraries.push({
      id: lIdx,
      N,
      T,
      M,
      books
    });
  }

  //--- CODE HERE

  const fittest = genetic.start({
    mutationRate: 0.05,
    maxIndividuals: 10,
    generations: 10,
    individualSize: B + L,
    settings: {
      libraries,
      B,
      L,
      D,
      scores,
      firstLine,
      input
    }
  });

  //--- CODE HERE

  const libs = decode(fittest);
  return dumpLibs(libs);
};

const dumpLibs = libs => {
  const result = [[libs.length]];
  for (let lIdx = 0; lIdx < libs.length; lIdx++) {
    let lib = libs[lIdx];
    result.push([lib.id, lib.books.length]);
    result.push(lib.books);
  }
  return result;
};

function shuffle(a) {
  a.sort(function() {
    return 0.5 - Math.random();
  });
}

module.exports = run;
