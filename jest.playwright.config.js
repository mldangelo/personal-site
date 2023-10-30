module.exports = {
  // All the playwright options can be found here: https://github.com/playwright-community/jest-playwright#options
  preset: 'jest-playwright-preset',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
    '^.+\\.jsx?$': 'babel-jest',
  },
};
