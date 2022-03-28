export var log = (...args) => console.log(...args);
log.clear = () => console.clear();
log.red = (...args) => console.log('\x1b[91m%s\x1b[0m', ...args);
log.yellow = (...args) => console.log('\x1b[33m%s\x1b[0m', ...args);
log.green = (...args) => console.log('\x1b[32m%s\x1b[0m', ...args);
log.cyan = (...args) => console.log('\x1b[36m%s\x1b[0m', ...args);
log.blue = (...args) => console.log('\x1b[94m%s\x1b[0m', ...args);

export const utils = {
    sort2d: (arr, index) => arr.sort((a, b) => a[index] - b[index]),
    getRandom: (min, max) => Math.random() * ((max - min) + min),
    getUnique: (arr) => Array.from(new Set(arr)),
    getKeys: (obj) => Object.entries(obj).map(kv => kv[0]),
    filterKeys: (obj, callback) => Object.entries(obj).filter((entry) => callback(entry)).map(kv => kv[0]),
    getUniqueKeys: (arr, key) => {
      var flags = [],
        output = [],
        l = arr.length,
        i;
      for (i = 0; i < l; i++) {
        if (flags[arr[i][key]]) continue;
        flags[arr[i][key]] = true;
        output.push(arr[i][key]);
      }
      return output;
    },
    getTimeString: (timestamp, style) => {
      return new Date(timestamp).toLocaleTimeString("en", {
        timeStyle: style || "long",
        hour12: true,
        timeZone: "UTC",
      });
    },
    getTimeDifference: (timestamp1, timestamp2, unit) => {
      if (unit === "ms") return Math.abs(timestamp1 - timestamp2);
      else if (unit === "s") return Math.abs((timestamp1 - timestamp2) / 1000 );
      else if (unit === "m") return Math.abs((timestamp1 - timestamp2) / 1000 / 60 );
      else if (unit === "h") return Math.abs((timestamp1 - timestamp2) / 1000 / 60 / 60 );
      else if (unit === "d") return Math.abs((timestamp1 - timestamp2) / 1000 / 60 / 60 / 24 );
      else return Math.abs(timestamp1 - timestamp2);
    },
    parsePhoneNumber: (phone) => {
      return Array.from(phone).filter(digit => /\b\d\b/.test(digit)).join('');
    },
    formatPhoneNumber: (phone) => {
      var cleaned = ('' + phone).replace(/\D/g, '');
      var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
      if (match) {
        var intlCode = (match[1] ? '+1 ' : '');
        return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
      }
      return null;
    }
};