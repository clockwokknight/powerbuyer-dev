export const utils = {
    log: (msg) => console.log(msg),
    wait: (callback, duration) => setTimeout(callback(), duration),
};