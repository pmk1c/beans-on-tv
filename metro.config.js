const { getSentryExpoConfig } = require("@sentry/react-native/metro");

const config = getSentryExpoConfig(__dirname, {
  autoWrapExpoRouterErrorBoundary: true,
});

module.exports = config;
