module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  entry: "./src/main.ts",
  output: {
    filename: "main.js",
  },
  target: "electron-main",
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [".ts", ".tsx", ".js"],
    // Add support for TypeScripts fully qualified ESM imports.
    extensionAlias: {
      ".js": [".js", ".ts"],
      ".cjs": [".cjs", ".cts"],
      ".mjs": [".mjs", ".mts"],
    },
  },
  module: {
    rules: [
      // all files with a `.ts`, `.cts`, `.mts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.([cm]?ts|tsx)$/, loader: "ts-loader" },
    ],
  },
};
