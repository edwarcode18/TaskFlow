module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'js'],
  testMatch: ['**/src/tests/**/*.test.ts'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/services/**/*.ts',
    'src/controllers/**/*.ts',
    'src/middlewares/**/*.ts',
    'src/schemas/**/*.ts',
    'src/routes/**/*.ts',
    'src/models/**/*.ts',
    '!**/*.test.ts'
  ]
};
