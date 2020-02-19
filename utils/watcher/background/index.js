const chokidar = require("chokidar");
const admin = require("firebase-admin");
const serviceAccount = require("./private/hashcodeutils-99b5eae7c765.json");

const NAME = process.argv[2] || "test";

console.log("Started watching " + NAME + "...");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();

chokidar
  .watch(".", {
    cwd: "../../../history"
  })
  .on("add", file => {
    let [set, score, sets] = file.split("__");
    score = parseInt(score);
    console.log("Set " + set + " scored " + score);

    let docRef = db.collection("users").doc(NAME + "_" + set);

    docRef.get().then(doc => {
      let prev = {
        max: -1
      };
      if (!doc.exists) {
      } else {
        prev = doc.data();

        if (prev.last === score) return;
      }

      const next = {
        ...prev,
        last: score,
        focus: sets,
        name: NAME
      };

      if (!prev.max) next.max = score;
      if (score > prev.max) next.max = score;

      docRef
        .set(next)
        .then(() => console.log(" Updated set " + set + " scored " + score));
    });
  });
