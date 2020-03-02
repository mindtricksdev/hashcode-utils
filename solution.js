const run = (firstLine, input, env) => {
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

  env.global = {
    libraries,
    scores,
    B,
    L,
    D
  };

  //--- CODE HERE

  //--- CODE HERE

  const libs = [
    {
      id: 1,
      books: [5, 2, 3]
    },
    {
      id: 0,
      books: [0, 1, 2, 3, 4]
    }
  ];

  const crtScore = score(env, libs);
  env.log.green(crtScore);

  //dump
  const result = [[libs.length]];
  for (let lIdx = 0; lIdx < libs.length; lIdx++) {
    let lib = libs[lIdx];
    result.push([lib.id, lib.books.length]);
    result.push(lib.books);
  }

  return result;
};

const score = (env, libs) => {
  return 5;
};

module.exports = run;
