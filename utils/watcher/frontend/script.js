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
      userSet.set = crtSet;
    });

    const uiMarkers = getUIMarkers(users);

    render(users, uiMarkers);
  });
});

const getUIMarkers = users => {
  const markers = {
    highest: {
      a: -1,
      b: -1,
      c: -1,
      d: -1,
      e: -1
    }
  };

  users.map(user => {
    Object.keys(user.sets).map(set => {
      if (user.sets[set]) {
        const highest = user.sets[set].max;
        if (highest >= markers.highest[set]) markers.highest[set] = highest;
      }
    });
  });

  return markers;
};

const render = (users, uiMarkers) => {
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
	${users.map(user => renderUserRow(user, uiMarkers)).join("")}
	${renderFooter(users, uiMarkers)}
	</table>`;
};

const renderUserRow = (user, uiMarkers) => {
  return `<tr>
		<td>${user.name}</td>
		<td class="score">${renderScoreCell(user.sets.a, uiMarkers)}</td>
		<td class="score">${renderScoreCell(user.sets.b, uiMarkers)}</td>
		<td class="score">${renderScoreCell(user.sets.c, uiMarkers)}</td>
		<td class="score">${renderScoreCell(user.sets.d, uiMarkers)}</td>
		<td class="score">${renderScoreCell(user.sets.e, uiMarkers)}</td>
	</tr>`;
};

const renderScoreCell = (userSet, uiMarkers) => {
  if (!userSet) return "-";

  const lastHidden = userSet.max === userSet.last;
  const isHighest = userSet.max >= uiMarkers.highest[userSet.set];

  return `<div class="max${isHighest ? " highest" : ""}">${
    userSet.max
  }</div><div class="last${lastHidden ? " hidden" : ""}">${userSet.last}</div>`;
};

const renderFooter = (users, uiMarkers) => {
  const total =
    uiMarkers.highest.a +
    uiMarkers.highest.b +
    uiMarkers.highest.c +
    uiMarkers.highest.d +
    uiMarkers.highest.e;

  return `<tr class="footer">
		<td>max</td>
		<td class="score">${uiMarkers.highest.a}</td>
		<td class="score">${uiMarkers.highest.b}</td>
		<td class="score">${uiMarkers.highest.c}</td>
		<td class="score">${uiMarkers.highest.d}</td>
		<td class="score">${uiMarkers.highest.e}</td>
	</tr><tr>
	<td>total</td>
	<td colspan="5" class="total score">${total}</td>
</tr>`;
};
