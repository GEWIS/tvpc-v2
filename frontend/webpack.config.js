const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  entry: {
    main: "./src/index.ts",
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: "index.js",
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,         // Target al .ts files
        use: 'ts-loader',        // Use the ts-loader
        exclude: /node_modules/, // Ignore the node_modules
      },
    ],
  },

  // Syntactic sugar
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },

  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: "src/resources", to: "resources" },
        { from: "src/index.html", to: "" }
      ],
    }),
  ],
};
