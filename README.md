# hashcode-utils

## 1. Place input data into `/in/` folder.

- Note that the set file names should start with `a`, `b`, `c`, `d` and `e`. Example: `a_example.in` or `c_medium.txt`

## 2. Open `solution.js` and start typing your solution.

- You'll get `firstLine` and `input` as input parameters (individual values will be `number` if `parseInt` succeeds or `string`).

- Return the output data you want to be dumped to the output file,

  - either as a string (whole file as string) OR
  - as an array (rows of strings) OR
  - as an array of arrays (rows and columns of strings or numbers).

- Dummy example:
  `solution.js` - copies the input to the output

  ```js
  const run = (firstLine, input) => {
    return [firstLine].concat(input);
  };
  ```

## 3. Run the code and inspect the `/out/` folder

- Use in debug with vscode targets (run all sets at once or one specific set).
- Use as CLI (run `node index` for all sets or `node index a,b,c` to execute the solution for specific set/s)

## 4. Using a genetic algorithm (optional)

- Use the helpers that are available in `/utils/genetic` folder.
- Implement (by overriding) some or all of the following prototype functions:

`solution.js` - using a simple genetic algorithm

```js
const genetic = require("./utils/genetic");

genetic.Individual.prototype.calculateFitness = function() {
  //TODO:
};
genetic.Individual.prototype.seed = function() {
  //TODO:
};
genetic.Individual.prototype.mutate = function() {
  //TODO:
};
genetic.Individual.prototype.crossover = function(partner) {
  //TODO:
};

const decode = individual => {
  //TODO:
};

const run = (firstLine, input) => {
  const fittest = genetic.start({
    mutationRate: 0.01,
    maxIndividuals: 200,
    generations: 900,
    individualSize: 20,
    settings: {}
  });

  //decode the individual into solution
  return decode(fittest);
};

module.exports = run;
```

## 5. Scoring (optional)

- Write the `score` function in `score.js` file to see a nice output in the console debug.

- Collaborative

  - If you have a scoring function, the tool will keep the history of your rans and it will be accessible at `https://hashcodeutils.web.app/`.
  - Install and launch `node index {YOUR_NAME}` from `/utils/watcher/background` to start the watcher
    - Leave this open in the background while writing and running your solution.
    - Note that you need the secret key in `/utils/watcher/background/private` to write to our firestore db.
