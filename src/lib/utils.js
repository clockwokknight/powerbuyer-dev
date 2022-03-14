export var log = (...args) => console.log(...args);
log.clear = () => console.clear();
log.label = (label, msg) => console.log(label, msg);
log.red = (msg) => console.log('\x1b[91m%s\x1b[0m', msg);
log.yellow = (msg) => console.log('\x1b[33m%s\x1b[0m', msg);
log.green = (msg) => console.log('\x1b[32m%s\x1b[0m', msg);
log.cyan = (msg) => console.log('\x1b[36m%s\x1b[0m', msg);
log.blue = (msg) => console.log('\x1b[94m%s\x1b[0m', msg);

export const utils = {
    sort2d: (arr, index) => arr.sort((a, b) => a[index] - b[index]),
    random: (min, max) => Math.random() * ((max - min) + min),
    unique: (arr) => Array.from(new Set(arr)),
    uniqueKeys: (arr, key) => {
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
    timeString: (timestamp, style) => {
      return new Date(timestamp).toLocaleTimeString("en", {
        timeStyle: style || "long",
        hour12: true,
        timeZone: "UTC",
      });
    },
    timeDifference: (timestamp1, timestamp2, unit) => {
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
    formatPhoneNumber(phone) {
      var cleaned = ('' + phone).replace(/\D/g, '');
      var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
      if (match) {
        var intlCode = (match[1] ? '+1 ' : '');
        return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
      }
      return null;
    }
};