const {
  withProjectBuildGradle,
  withAppBuildGradle,
} = require("expo/config-plugins");

const METADATA_FLAG = '-Xskip-metadata-version-check';

module.exports = function withAndroidBuildFixes(config) {
  config = withAppBuildGradle(config, (gradleConfig) => {
    let contents = gradleConfig.modResults.contents;
    if (!contents.includes(METADATA_FLAG)) {
      contents = contents.replace(
        /androidResources\s*\{[^}]*\}\s*\n\}/,
        (match) =>
          `${match.replace(/\n\}$/, "")}
    kotlinOptions {
        jvmTarget = "17"
        freeCompilerArgs += ["${METADATA_FLAG}"]
    }
}`
      );
    }
    gradleConfig.modResults.contents = contents;
    return gradleConfig;
  });

  return withProjectBuildGradle(config, (gradleConfig) => {
    if (!gradleConfig.modResults.contents.includes("kotlin-stdlib:2.1.20")) {
      gradleConfig.modResults.contents += `
allprojects {
  configurations.configureEach {
    resolutionStrategy {
      force "org.jetbrains.kotlin:kotlin-stdlib:2.1.20"
      force "org.jetbrains.kotlin:kotlin-stdlib-jdk7:2.1.20"
      force "org.jetbrains.kotlin:kotlin-stdlib-jdk8:2.1.20"
    }
  }
}
`;
    }
    return gradleConfig;
  });
};
