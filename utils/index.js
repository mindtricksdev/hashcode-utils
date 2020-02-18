// Place input data into `/in/` folder
//  The sets should start with 'a', 'b', 'c', 'd', 'e'.
// Give the processing function as an argument to `run`
//  The returned value should be a list that will be dumped into `/out/` folder.

const parser = require("./parser");
const dumper = require("./dumper");

const run = solver => {
  let arg = process.argv[2];
  if (!arg) arg = "a,b,c,d,e";

  const sets = arg.split(",");

  parser(sets, ({ set, file }, firstLine, input) => {
    const start = Date.now();
    console.log("Solving " + set + "...");
    const output = solver(firstLine, input);
    const end = Date.now();
    console.log(
      "Finished " + set + ". Took " + ((end - start) / 1000).toFixed(2) + "s"
    );

    dumper({ set, file }, output);
  });
};

module.exports = run;
