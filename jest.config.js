const config = {
  moduleNameMapper: {
    '^.+\\.(css|less|scss)$': 'babel-jest',
    // map markdown
    '^.+\\.md$': 'markdown-to-jsx',
  },
};

module.exports = config;
