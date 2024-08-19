module.exports = {
    transform: {
      "^.+\\.(js|jsx|ts|tsx)$": "babel-jest", 
    },
    transformIgnorePatterns: [
      "node_modules/(?!(axios|other-module)/)" 
    ],
    moduleNameMapper: {
      "\\.(css|less|scss|sass)$": "identity-obj-proxy", 
      "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js" 
    },
    moduleFileExtensions: ['js', 'jsx', 'json', 'node'], 
    testEnvironment: "jsdom", 
  };
  