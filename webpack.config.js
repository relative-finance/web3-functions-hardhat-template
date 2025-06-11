const path = require('path');

module.exports = {
  // Entry point of your application
  entry: './web3-functions/rfx-pyth-automation/index.ts',
  
  // Output configuration
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true // Clean the output directory before emit
  },
  
  // Enable sourcemaps for debugging
  devtool: 'source-map',
  
  // Resolve .ts and .js extensions
  resolve: {
    extensions: ['.ts', '.js']
  },
  
  // Module rules for handling files
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  
  // Set mode to production for optimized bundle
  mode: 'production'
};