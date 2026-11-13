const { withAndroidManifest, AndroidConfig } = require("expo/config-plugins");

const META_NAME = "google_analytics_automatic_screen_reporting_enabled";

module.exports = function withFirebaseScreenReporting(config) {
  return withAndroidManifest(config, (manifestConfig) => {
    const application = AndroidConfig.Manifest.getMainApplicationOrThrow(
      manifestConfig.modResults
    );
    AndroidConfig.Manifest.addMetaDataItemToMainApplication(
      application,
      META_NAME,
      "false"
    );
    return manifestConfig;
  });
};
