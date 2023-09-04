module.exports = {
  assets: ['./src/app/assets/fonts'],
  dependencies: {
    // Required for Expo CLI to be used with platforms (such as Apple TV) that are not supported in Expo SDK
    expo: {
      platforms: {
        android: null,
        ios: null,
        macos: null,
      },
    },
  },
};
