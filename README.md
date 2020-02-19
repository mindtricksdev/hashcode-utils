# hashcode-utils

1. Place input data into `/in/` folder.

- Note that the set file names should start with `a`, `b`, `c`, `d` and `e`. Example: `a_example.in` or `c_medium.txt`

2. Open `solution.js` and start typing your solution.

- You'll get `firstLine` and `input` as input parameters (values will be `number` if `parseInt` succeeds or `string`).

- Return the output data you want to be dumped to the output file,
  - either as a string (whole file as string) OR
  - as an array (rows of strings) OR
  - as an array of arrays (rows and columns of strings or numbers).
- Example:
  `solution.js` - copies the input to the output
  ```js
  const run = (firstLine, input) => {
    return [firstLine, input];
  };
  ```

3. Run the code and inspect the `/out/` folder

   - using vscode targets in debug (all sets at once or specific sets).
   - using CLI (run `node index` for all sets or `node index a,b,c` to execute the solution for specific set/s)

4. Scoring (optional)

   - if you write the `score` function in `score.js` file, it will also keep a history of your rans and it will be accessible at `https://hashcodeutils.web.app/`.
   - install and launch `node index {YOUR_NAME}` from `utils/watcher/background` to start the watcher. Leave this open in the background while running your solution.
   - note that you need the secret key in `utils/watcher/background/private` to write to our firestore db.
