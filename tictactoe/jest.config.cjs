// eslint-disable-next-line no-undef
module.exports = {
  moduleNameMapper: {
    '\\.(css|less)$': '<rootDir>/__mocks__/styleMock.js',
  },
  testEnvironment: 'jsdom',
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
};