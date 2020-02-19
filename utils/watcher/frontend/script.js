document.addEventListener("DOMContentLoaded", function() {
  const db = firebase.firestore();

  db.collection("users").onSnapshot(function(querySnapshot) {
    var cities = [];
    querySnapshot.forEach(function(doc) {
      cities.push(doc.data().name);
    });
    console.log("Current cities in CA: ", cities.join(", "));
  });
});
