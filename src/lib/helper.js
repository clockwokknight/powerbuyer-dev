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

/*
  var obj = {a: 3, b: 5, c: 9};
  filter(obj, function(key, value) {
    return value < 6;
  }); // {a: 3, b: 5}
  var obj = {a1: 3, b1: 5, a2: 9};
  filter(obj, function(key, value) {
    return key[0] == 'a';
  }); // {a1: 3, a2: 9}
  var obj = {a: 3, b: 5, c: null};
  filter(obj, function(key, value) {
    return value;
  }); // {a: 3, b: 5}
*/
export function objectFilter(obj, predicate) {
  let result = {};
  let keys = Object.keys(obj);
  let len = keys.length;
  for (let i = 0; i < len; i++) {
    let key = keys[i];
    if (predicate(key, obj[key])) {
      result[key] = obj[key];
    }
  }
  return result;
}

/*
  var obj = {a: 3, b: 5, c: 9};
  omit(obj, ['a', 'c']); // {b: 5}
  omit(obj, a, c); // {b: 5}
  omit(obj, ['a', 'b', 'd']); // {c: 9}
  omit(obj, ['a', 'a']); // {b: 5, c: 9}
*/

export function omit(obj, remove) {
  let result = {};
  if (typeof remove === "string") {
    remove = [].slice.call(arguments, 1);
  }
  for (let prop in obj) {
    if (!obj.hasOwnProperty || obj.hasOwnProperty(prop)) {
      if (remove.indexOf(prop) === -1) {
        result[prop] = obj[prop];
      }
    }
  }
  return result;
}

/*
  Deep clones all properties except functions
  var arr = [1, 2, 3];
  var subObj = {aa: 1};
  var obj = {a: 3, b: 5, c: arr, d: subObj};
  var objClone = clone(obj);
  arr.push(4);
  subObj.bb = 2;
  obj; // {a: 3, b: 5, c: [1, 2, 3, 4], d: {aa: 1}}
  objClone; // {a: 3, b: 5, c: [1, 2, 3], d: {aa: 1, bb: 2}}
*/

export function clone(obj) {
  if (typeof obj == "function") {
    return obj;
  }
  var result = Array.isArray(obj) ? [] : {};
  for (var key in obj) {
    // include prototype properties
    var value = obj[key];
    var type = {}.toString.call(value).slice(8, -1);
    if (type == "Array" || type == "Object") {
      result[key] = clone(value);
    } else if (type == "Date") {
      result[key] = new Date(value.getTime());
    } else if (type == "RegExp") {
      result[key] = RegExp(value.source, getRegExpFlags(value));
    } else {
      result[key] = value;
    }
  }
  return result;
}

function getRegExpFlags(regExp) {
  if (typeof regExp.source.flags == "string") {
    return regExp.source.flags;
  } else {
    var flags = [];
    regExp.global && flags.push("g");
    regExp.ignoreCase && flags.push("i");
    regExp.multiline && flags.push("m");
    regExp.sticky && flags.push("y");
    regExp.unicode && flags.push("u");
    return flags.join("");
  }
}
