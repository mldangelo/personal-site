const config = {
  // All the playwright options can be found here: https://github.com/playwright-community/jest-playwright#options
  preset: 'jest-playwright-preset',
  moduleNameMapper: {
    '^.+\\.(css|less|scss)$': 'babel-jest',
    '^.+\\.md$': 'markdown-to-jsx',
  },
  transform: {
    '^.+\\.ts?$': 'ts-jest',
    '^.+\\.jsx?$': 'babel-jest',
  },
};

module.exports = config;
