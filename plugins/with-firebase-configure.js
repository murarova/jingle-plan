const { withAppDelegate } = require("expo/config-plugins");

const CONFIGURE_CALL = "FirebaseApp.configure()";
const ANCHOR =
  /^([ \t]*)return\s+super\.application\(\s*application\s*,\s*didFinishLaunchingWithOptions:\s*launchOptions\s*\)/m;

module.exports = function withFirebaseConfigure(config) {
  return withAppDelegate(config, (appDelegateConfig) => {
    const { language, contents } = appDelegateConfig.modResults;
    if (language !== "swift" || contents.includes(CONFIGURE_CALL)) {
      return appDelegateConfig;
    }
    if (!ANCHOR.test(contents)) {
      throw new Error(
        "with-firebase-configure: could not find didFinishLaunchingWithOptions return in AppDelegate.swift"
      );
    }
    let updated = contents.replace(
      ANCHOR,
      (match, indent) => `${indent}${CONFIGURE_CALL}\n${match}`
    );
    if (!/^[ \t]*import\s+FirebaseCore[ \t]*$/m.test(updated)) {
      updated = `import FirebaseCore\n${updated}`;
    }
    appDelegateConfig.modResults.contents = updated;
    return appDelegateConfig;
  });
};
