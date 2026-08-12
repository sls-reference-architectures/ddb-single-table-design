module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.[cm]?[tj]sx?$': '@swc/jest',
  },
  transformIgnorePatterns: ['node_modules/(?!(config|@faker-js/faker)/)'],
  setupFilesAfterEnv: ['./test/setupFramework.js'],
};
