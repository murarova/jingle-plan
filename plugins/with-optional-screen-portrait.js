const { withAndroidManifest } = require("expo/config-plugins");

const FEATURE_NAME = "android.hardware.screen.portrait";

module.exports = function withOptionalScreenPortrait(config) {
  return withAndroidManifest(config, (manifestConfig) => {
    const manifest = manifestConfig.modResults.manifest;
    const features = manifest["uses-feature"] ?? [];
    const list = Array.isArray(features) ? features : [features];
    const existing = list.find(
      (item) => item.$["android:name"] === FEATURE_NAME
    );
    if (existing) {
      existing.$["android:required"] = "false";
    } else {
      list.push({
        $: {
          "android:name": FEATURE_NAME,
          "android:required": "false",
        },
      });
    }
    manifest["uses-feature"] = list;
    return manifestConfig;
  });
};
