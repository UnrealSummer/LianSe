module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: [
    '**/*.test.ts',
    '**/__tests__/**/*.ts'
  ],
  collectCoverageFrom: [
    '../assets/scripts/**/*.ts',
    '!../assets/scripts/**/*.test.ts',
    '!../assets/scripts/AutoTest.ts',
    '!../assets/scripts/TestRunner.ts',
    '!../assets/scripts/GameTest.ts',
    '!../assets/scripts/IntegrationTest.ts'
  ],
  moduleNameMapper: {
    '^cc$': '<rootDir>/mocks/cocos.mock.ts'
  },
  setupFilesAfterEnv: ['<rootDir>/setup.ts']
};
