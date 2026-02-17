/**
 * Stub for 'jsdom' - only used by webpack to satisfy fabric.js require().
 * This code path runs only in Node when document/window are undefined;
 * in the browser it is never executed.
 */
function JSDOM() {
  return {
    window: {
      document: {},
      DOMParser: function DOMParser() {},
    },
  };
}

module.exports = { JSDOM };
