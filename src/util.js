export function type(value) {
  return Object.prototype.toString
    .call(value)
    .match(/\[object\ (.*)\]/)[1]
    .toLowerCase();
}

export function removeWhiteSpace(array) {
  const dirtyData = ['', ' '];
  return array.filter(item => !dirtyData.includes(item));
}

export function getNumbers(str) {
  const reg = /\d+/g;
  console.info(str.match(reg));
  return str.match(reg);
}
