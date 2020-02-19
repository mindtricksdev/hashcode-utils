document.addEventListener("DOMContentLoaded", function() {
  const db = firebase.firestore();

  db.collection("users").onSnapshot(function(querySnapshot) {
    const users = [];
    querySnapshot.forEach(function(doc) {
      const userSet = doc.data();
      const crtName = userSet.name;
      const crtSet = doc.id.replace(crtName + "_", "");

      let user = users.find(u => u.name === crtName);
      if (!user) {
        user = {
          name: crtName,
          sets: {}
        };
        users.push(user);
      }

      user.sets[crtSet] = userSet;
    });

    render(users);
  });
});

const render = users => {
  const rootEl = document.getElementById("root");

  rootEl.innerHTML = `<table>
	<tr>
		<td></td>
		<td>A</td>
		<td>B</td>
		<td>C</td>
		<td>D</td>
		<td>E</td>
	</tr>
	${users.map(renderUserRow)}
	</table>`;
};

const renderUserRow = user => {
  return `<tr>
		<td>${user.name}</td>
		<td>${renderScoreCell(user.sets.a)}</td>
		<td>${renderScoreCell(user.sets.b)}</td>
		<td>${renderScoreCell(user.sets.c)}</td>
		<td>${renderScoreCell(user.sets.d)}</td>
		<td>${renderScoreCell(user.sets.e)}</td>
	</tr>`;
};

const renderScoreCell = userSet => {
  if (!userSet) return "-";

  return `<div>${userSet.max}</div><div>${userSet.last}</div>`;
};
