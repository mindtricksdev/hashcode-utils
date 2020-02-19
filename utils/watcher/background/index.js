const admin = require("firebase-admin");
const serviceAccount = require("./private/hashcodeutils-99b5eae7c765.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();
