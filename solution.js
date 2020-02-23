const genetic = require("./utils/genetic");

genetic.Individual.prototype.seed = function(index) {
  const libraries = this.population.options.settings.librariesById;

  const clone = () => {
    return this.population.options.settings.libraries.map(l => l.id);
  };

  let libs = null;
  if (index === 0) {
    //by sign up time
    libs = clone();
  } else if (index === 1) {
    //by sign up time
    libs = clone().sort((a, b) => libraries[a].T - libraries[b].T);
  } else if (index === 2) {
    //by books count
    libs = clone().sort((a, b) => libraries[b].N - libraries[a].N);
  } else if (index === 3) {
    //by books per day
    libs = clone().sort((a, b) => libraries[b].M - libraries[a].M);
  } else if (index === 4) {
    //by books to scan
    libs = clone().sort(
      (a, b) =>
        (libraries[b].N - libraries[b].N * libraries[b].M) / libraries[b].M -
        (libraries[a].N - libraries[a].N * libraries[a].M) / libraries[a].M
    );
  } else if (index === 5) {
    //by sign up time
    libs = clone().sort((a, b) => libraries[a].T - libraries[b].T);
  } else {
    if (Math.random() > 0.5)
      libs = clone().sort((a, b) => libraries[b].M - libraries[a].M);
    else libs = clone().sort((a, b) => libraries[b].N - libraries[a].N);
    libs = shuffleRandomPart(libs);
  }

  this.genes = [libs];
  for (let i = 0; i < libs.length; i++) {
    //add library
    const crtLibrary = libraries[libs[i]];

    //add books
    const books = [];
    let libBooks = [...crtLibrary.books];
    if (index <= 5) {
      //keep sorted
    } else {
      libBooks = shuffle(libBooks);
    }

    for (let b = 0; b < libBooks.length; b++) {
      let book = libBooks[b];
      books.push(book);
    }

    if (books.length === 0) debugger;

    this.genes.push(books);
  }
};

genetic.Individual.prototype.crossover = function(partner) {
  const child = new genetic.Individual(this.population);

  // if (this === partner) console.log(".");

  const thisSegmentSize = Math.floor(Math.random() * this.genes.length);
  //take first segment of libraries from this
  child.genes[0] = [];
  for (let i = 0; i < thisSegmentSize; i++) {
    const libId = this.genes[0][i];
    child.genes[0].push(libId);

    //pick books from both parents
    let libraryBooks = [];
    // if (Math.random() > 0.5) {
    libraryBooks = [...this.genes[1 + i]];
    // } else {
    //   const libIdxInPartner = 1 + partner.genes[0].indexOf(libId);
    //   libraryBooks = [...partner.genes[libIdxInPartner]];
    // }

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
    // if (Math.random() > 0.5) {
    libraryBooks = [...partner.genes[1 + i]];
    // } else {
    //   const libIdxInMe = 1 + this.genes[0].indexOf(libId);
    //   libraryBooks = [...this.genes[libIdxInMe]];
    // }

    child.genes.push(libraryBooks);
  }

  return child;
};

const calculateScore = (libsToScan, settings) => {
  const { D, scores, librariesById } = settings;

  const STATE = {};

  const scannedBooks = {};

  let score = 0;
  const timeline = arrayOfIncrements(D);

  let canSignUpLibs = true;
  timeline.forEach(timeSlot => {
    libsToScan.forEach(libToScan => {
      const id = libToScan.id;
      if (STATE[id] && STATE[id].done) return;

      if (!STATE[id] || (STATE[id] && !STATE[id].startedSignUp)) {
        if (canSignUpLibs) {
          //start sign up
          STATE[id] = {};
          STATE[id].startedSignUp = true;
          STATE[id].startedSignUpAt = timeSlot;
          canSignUpLibs = false;
        }
        return;
      }

      if (!STATE[id]) return;

      const library = librariesById[libToScan.id];
      const perDay = library.M;

      if (!STATE[id].endedSignUp) {
        //finish sign up
        const daysToSignUp = library.T;
        if (STATE[id].startedSignUpAt + daysToSignUp === timeSlot) {
          //signing finished in the previous timeslot
          STATE[id].endedSignUp = true;
          STATE[id].endedSignUpAt = timeSlot - 1;
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
      const daysElapsedAfterSignUp = timeSlot - STATE[id].endedSignUpAt;
      const dayBooks = arrayOfIncrements(perDay);
      dayBooks.forEach(idx => {
        const book =
          libToScan.books[(daysElapsedAfterSignUp - 1) * perDay + idx];

        if (typeof book === "undefined") {
          STATE[id].done = true;
          return; //no more books to scan
        }
        if (scannedBooks[book]) return; //already scanned

        scannedBooks[book] = true;
        score += scores[book];
      });
    });
  });

  return score;
};

genetic.Individual.prototype.calculateFitness = function() {
  const libsToScan = decode(this);
  this.fitness = calculateScore(libsToScan, this.population.options.settings);
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
  const rate = this.population.options.mutationRate;
  if (true) {
    //shuffle random libraries book order
    const libCount = this.genes.length - 1;
    let libsToMutate = Math.floor((Math.random() * libCount * rate) / 3);
    while (libsToMutate >= 1) {
      const randomLibIdx = 1 + Math.floor(Math.random() * libCount);
      shuffle(this.genes[randomLibIdx]);
      libsToMutate--;
    }
  }
  if (true) {
    //change library order
    const libs = this.genes[0];

    const libCount = this.genes.length - 1;
    let libsToMutate = Math.floor((Math.random() * libCount * rate) / 2);

    while (libsToMutate >= 1) {
      const aIdx = Math.floor(Math.random() * libs.length);
      const bIdx = Math.floor(Math.random() * libs.length);

      //swap a with b
      [libs[aIdx], libs[bIdx]] = [libs[bIdx], libs[aIdx]];
      //swap book segments
      [this.genes[1 + aIdx], this.genes[1 + bIdx]] = [
        this.genes[1 + bIdx],
        this.genes[1 + aIdx]
      ];
      libsToMutate--;
    }
  }
};

const run = (firstLine, input, env) => {
  const [B, L, D] = firstLine;
  const scores = input[0];

  let libraries = [];
  for (let lIdx = 0; lIdx < L; lIdx++) {
    const [N, T, M] = input[lIdx * 2 + 1];
    const books = input[lIdx * 2 + 2];
    const library = {
      id: lIdx,
      N, //number of books
      T, //signup duration
      M, //scanned books per day
      books: books.sort((a, b) => scores[b] - scores[a])
    };
    libraries.push(library);
  }

  const librariesById = {};
  libraries.forEach(lib => {
    librariesById[lib.id] = lib;
  });

  libraries = libraries.sort((a, b) => b.M - a.M);

  const settings = {
    libraries,
    librariesById,
    B, //books
    L, //libraries
    D, //days to scan
    scores
  };

  //--- CODE HERE

  //remove duplicates
  // const BOOKS_USED = {};
  // for (let i = 0; i < libraries.length; i++) {
  //   const lib = libraries[i];
  //   lib.books = lib.books.filter(book => {
  //     if (BOOKS_USED[book]) {
  //       return false;
  //     } else {
  //       BOOKS_USED[book] = true;
  //       return true;
  //     }
  //   });
  //   lib.N = lib.books.length;
  // }
  // settings.libraries = libraries.filter((l, idx) => l.N > 100);

  // optimize(settings);

  const score = calculateScore(settings.libraries, settings);
  console.log("\x1b[42m\x1b[30m %s \x1b[0m", score);

  env.return(dumpLibs(settings.libraries));

  const fittest = genetic.start({
    keepFittestAlive: true,
    mutationRate: 0.05,
    maxIndividuals: 20,
    generations: 50000,
    individualSize: 1 + settings.libraries.length,
    settings,
    onFittest: fittest => {
      const libsToUse = decode(fittest);
      env.return(dumpLibs(libsToUse));
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
  if (start > end) {
    const left = shuffle(a.slice(0, end));
    const right = shuffle(a.slice(start));
    a.splice(0, left.length, ...left);
    a.splice(start, right.length, ...right);
    return a;
  }

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

const optimize = settings => {
  //tree exploration

  settings.root = {
    timeSlot: 0,
    score: 0,
    library: null,
    usedLibraries: []
  };
  createChildren(settings.root, settings);

  settings.libraries = settings.bestLibraries;
};

let highestScore = 0;
let nodesCreated = 0;
const createChildren = (parent, settings) => {
  for (let i = 0; i < settings.libraries.length; i++) {
    const lib = settings.libraries[i];
    if (parent.usedLibraries.indexOf(lib) > -1) continue;

    const child = {
      parent: parent,
      timeSlot: parent.timeSlot + lib.T,
      score: 0,
      library: lib
    };
    if (child.timeSlot > settings.D) {
      continue;
    }

    child.usedLibraries = parent.usedLibraries.concat(lib);

    child.score = calculateScore(child.usedLibraries, settings);
    if (child.score > highestScore) {
      highestScore = child.score;
      settings.bestLibraries = child.usedLibraries;
      console.log(highestScore, child.timeSlot);
    }

    parent.children = parent.children || [];
    parent.children.push(child);
    nodesCreated++;
  }

  if (parent.children) {
    parent.children = parent.children.sort((a, b) => b.score - a.score);

    //take only top nodes
    parent.children = parent.children.filter(
      (c, idx) => idx < (Math.random() > 0.999999 ? 2 : 1)
    );
    for (let c = 0; c < parent.children.length; c++) {
      createChildren(parent.children[c], settings);
    }
  }

  return parent;
};

module.exports = run;
