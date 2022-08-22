/* eslint-disable */
export default {
  displayName: 'infrastructure',
  preset: '../../jest.preset.js',
  testMatch: ['**/tests/**/*.integration-spec.ts'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js'],
};
