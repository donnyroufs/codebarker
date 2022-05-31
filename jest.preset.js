const nxPreset = require('@nrwl/jest/preset').default;

module.exports = { ...nxPreset, setupFiles: ['./setupJest.ts'] };
