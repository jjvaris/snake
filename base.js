export const mod = (n, m) => ((n % m) + m) % m;
export const rnd = max => Math.floor(Math.random() * max + 1);
export const removeFirst = array => array.slice(1);
export const isSamePosition = (pos1, pos2) =>
  pos1.x === pos2.x && pos1.y === pos2.y;
