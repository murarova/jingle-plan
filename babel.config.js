module.exports = function (api) {
  api.cache.using(() => process.env.NODE_ENV);
  const isTest = process.env.NODE_ENV === "test";
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      ...(isTest ? [] : [["module:react-native-dotenv"]]),
      "react-native-reanimated/plugin", // THIS HAS TO BE LISTED LAST
    ],
  };
};
