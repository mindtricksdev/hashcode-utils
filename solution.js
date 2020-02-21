const genetic = require("./utils/genetic");

genetic.Individual.prototype.seed = function(index) {
  const libCount = this.population.options.settings.L;
  const libraries = this.population.options.settings.libraries;

  let libs = null;
  if (index > 0) libs = shuffleRandomPart(arrayOfIncrements(libCount));
  else
    libs = arrayOfIncrements(libCount).sort(
      (a, b) => libraries[a].T - libraries[b].T
      // (a, b) => libraries[b].M - libraries[a].M
    );

  this.genes = [libs];
  for (let i = 0; i < libs.length; i++) {
    //add library
    const crtLibrary = libraries[libs[i]];

    //add books
    const books = [];
    const libBooks = [...crtLibrary.books];
    if (index > 0) shuffleRandomPart(libBooks);

    for (let b = 0; b < libBooks.length; b++) {
      books.push(libBooks[b]);
    }
    this.genes.push(books);
  }
};

genetic.Individual.prototype.crossover = function(partner) {
  const child = new genetic.Individual(this.population);

  const thisSegmentSize = Math.floor(Math.random() * this.genes.length);
  //take first segment of libraries from this
  child.genes[0] = [];
  for (let i = 0; i < thisSegmentSize; i++) {
    const libId = this.genes[0][i];
    child.genes[0].push(libId);

    //pick books from both parents
    let libraryBooks = [];
    if (Math.random() > 0.5) {
      libraryBooks = [...this.genes[1 + i]];
    } else {
      const libIdxInPartner = 1 + partner.genes[0].indexOf(libId);
      libraryBooks = [...partner.genes[libIdxInPartner]];
    }

    child.genes.push(libraryBooks);
  }

  //the other segment from partner
  for (let i = 0; i < partner.genes[0].length; i++) {
    //pick the remaining libraries from the partner
    const libId = partner.genes[0][i];
    if (child.genes[0].indexOf(libId) > -1) continue;

    child.genes[0].push(libId);

    //pick books from both parents
    let libraryBooks = [];
    if (Math.random() > 0.5) {
      libraryBooks = [...partner.genes[1 + i]];
    } else {
      const libIdxInMe = 1 + this.genes[0].indexOf(libId);
      libraryBooks = [...this.genes[libIdxInMe]];
    }

    child.genes.push(libraryBooks);
  }

  //optimize child?

  return child;
};

genetic.Individual.prototype.calculateFitness = function() {
  const { D, scores, libraries } = this.population.options.settings;
  const libsToScan = decode(this);

  const scannedBooks = {};

  let score = 0;
  const timeline = arrayOfIncrements(D);

  let canSignUpLibs = true;
  timeline.forEach(timeSlot => {
    libsToScan.forEach(libToScan => {
      if (libToScan.done) return;

      if (!libToScan.startedSignUp) {
        if (canSignUpLibs) {
          //start sign up
          libToScan.startedSignUp = true;
          libToScan.startedSignUpAt = timeSlot;
          canSignUpLibs = false;
        }
        return;
      }

      const library = libraries[libToScan.id];
      const perDay = library.M;

      if (!libToScan.endedSignUp) {
        //finish sign up
        const daysToSignUp = library.T;
        if (libToScan.startedSignUpAt + daysToSignUp === timeSlot) {
          //signing finished in the previous timeslot
          libToScan.endedSignUp = true;
          libToScan.endedSignUpAt = timeSlot - 1;
          canSignUpLibs = true;

          //process first books
          const dayBooks = arrayOfIncrements(perDay);
          dayBooks.forEach(idx => {
            const book = libToScan.books[idx];

            if (typeof book === "undefined") return; //no more books to scan
            if (scannedBooks[book]) return; //already scanned

            scannedBooks[book] = true;
            score += scores[book];
          });
        }
        return;
      }

      //start scanning books
      const daysElapsedAfterSignUp = timeSlot - libToScan.endedSignUpAt;
      const dayBooks = arrayOfIncrements(perDay);
      dayBooks.forEach(idx => {
        const book =
          libToScan.books[(daysElapsedAfterSignUp - 1) * perDay + idx];

        if (typeof book === "undefined") {
          libToScan.done = true;
          return; //no more books to scan
        }
        if (scannedBooks[book]) return; //already scanned

        scannedBooks[book] = true;
        score += scores[book];
      });
    });
  });

  this.fitness = score;
};

const decode = individual => {
  const libsToScan = individual.genes[0].map((id, index) => {
    return {
      id,
      books: individual.genes[1 + index]
    };
  });
  return libsToScan;
};

genetic.Individual.prototype.mutate = function() {
  if (Math.random() > this.population.options.mutationRate) return;

  if (Math.random() > 0.5) {
    //shuffle random libraries book order
    const libCount = this.genes.length - 1;
    let libsToMutate = Math.floor(Math.random() * libCount);
    while (libsToMutate >= 0) {
      const randomLibIdx = 1 + Math.floor(Math.random() * libCount);
      shuffle(this.genes[randomLibIdx]);
      libsToMutate--;
    }
  } else {
    //change library order
    const libs = this.genes[0];
    const aIdx = Math.floor(Math.random() * libs.length);
    const bIdx = Math.floor(Math.random() * libs.length);

    //swap a with b
    [libs[aIdx], libs[bIdx]] = [libs[bIdx], libs[aIdx]];
    //swap book segments
    [this.genes[1 + aIdx], this.genes[1 + bIdx]] = [
      this.genes[1 + bIdx],
      this.genes[1 + aIdx]
    ];
  }
};

const run = (firstLine, input) => {
  const [B, L, D] = firstLine;
  const scores = input[0];

  const libraries = [];
  for (let lIdx = 0; lIdx < L; lIdx++) {
    const [N, T, M] = input[lIdx * 2 + 1];
    const books = input[lIdx * 2 + 2];
    const library = {
      id: lIdx,
      N,
      T,
      M,
      books: books.sort((a, b) => scores[b] - scores[a])
    };
    libraries.push(library);
  }

  //--- CODE HERE

  const fittest = genetic.start({
    keepFittestAlive: true,
    mutationRate: 0.15,
    maxIndividuals: 30,
    generations: 200,
    individualSize: 1 + L,
    settings: {
      libraries,
      B,
      L,
      D,
      scores
    }
  });

  //--- CODE HERE

  const libsToUse = decode(fittest);
  return dumpLibs(libsToUse);
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

const shuffle = a => {
  a.sort(() => 0.5 - Math.random());
  return a;
};
const shuffleRandomPart = a => {
  let start = Math.floor(Math.random() * a.length);
  let end = Math.floor(Math.random() * a.length);
  if (start > end) [start, end] = [end, start];

  const slice = shuffle(a.slice(start, end));
  a.splice(start, slice.length, ...slice);
  return a;
};

const arrayOfIncrements = n => {
  const a = [];
  for (let i = 0; i < n; i++) {
    a.push(i);
  }
  return a;
};

module.exports = run;
