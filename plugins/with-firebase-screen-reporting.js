const { withAndroidManifest, AndroidConfig } = require("expo/config-plugins");

const META_NAME = "google_analytics_automatic_screen_reporting_enabled";

module.exports = function withFirebaseScreenReporting(config) {
  return withAndroidManifest(config, (manifestConfig) => {
    const manifest = manifestConfig.modResults;
    AndroidConfig.Manifest.ensureToolsAvailable(manifest);
    const application = AndroidConfig.Manifest.getMainApplicationOrThrow(manifest);
    AndroidConfig.Manifest.addMetaDataItemToMainApplication(
      application,
      META_NAME,
      "false"
    );
    const item = application["meta-data"].find(
      (entry) => entry.$["android:name"] === META_NAME
    );
    item.$["tools:replace"] = "android:value";
    return manifestConfig;
  });
};
