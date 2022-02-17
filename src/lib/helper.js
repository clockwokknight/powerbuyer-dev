/*
  var obj = {a: 3, b: 5, c: 9};
  pick(obj, ['a', 'c']); // {a: 3, c: 9}
  pick(obj, 'a', 'c'); // {a: 3, c: 9}
  pick(obj, ['a', 'b', 'd']); // {a: 3, b: 5}
  pick(obj, ['a', 'a']); // {a: 3}
*/

export function pick(obj, select) {
  let result = {};
  if (typeof select === "string") {
    select = [].slice.call(arguments, 1);
  }
  let len = select.length;
  for (let i = 0; i < len; i++) {
    let key = select[i];
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}
