module.exports = {
  preset: '@testing-library/react-native',
  clearMocks: true,
  fakeTimers: {
    enableGlobally: true,
  },
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/asset.ts',
  },
  randomize: true,
  setupFilesAfterEnv: ['<rootDir>/jest/setup/failOnConsole.ts'],
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!@react-native|react-native|react-native-pixel-perfect|react-redux)',
  ],
};
