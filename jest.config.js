module.exports = {
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.jest.json',
    }
  },
  preset: 'ts-jest',
  setupFilesAfterEnv: ['./test/setupFramework.ts'],
};
