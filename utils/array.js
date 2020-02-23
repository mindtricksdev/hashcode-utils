exports.shuffle = a => {
  a.sort(() => 0.5 - Math.random());
  return a;
};
exports.shuffleRandomPart = a => {
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

exports.arrayOfIncrements = n => {
  const a = [];
  for (let i = 0; i < n; i++) {
    a.push(i);
  }
  return a;
};
