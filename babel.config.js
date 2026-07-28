module.exports = function (api) {
  api.cache.using(() => process.env.NODE_ENV);
  const isTest = process.env.NODE_ENV === "test";
  return {
    presets: isTest
      ? ["babel-preset-expo"]
      : [
          ["babel-preset-expo", { jsxImportSource: "nativewind" }],
          "nativewind/babel",
        ],
    plugins: [
      ...(isTest
        ? []
        : [
            [
              "module-resolver",
              {
                root: ["."],
                alias: {
                  "@": ".",
                },
              },
            ],
            ["module:react-native-dotenv"],
          ]),
      "react-native-reanimated/plugin",
    ],
  };
};
