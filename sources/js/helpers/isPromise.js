// https://stackoverflow.com/a/53955664/10424385

const isPromise = (value) => Boolean(value && typeof value.then === 'function');

export default isPromise;
