
module.exports = {
  entry: {
    background: './src/js/entrypoints/background.js',
    configs:    './src/js/entrypoints/pages/configs.js',
  },
  output: {
    filename: './dest/js/[name].js',
  },
  module: {
    loaders: [
      {test: /\.js$/,  loaders: ['babel-loader']},
      {test: /\.sass$/,loaders: ['style-loader', 'css-loader', 'sass-loader']}
    ]
  },
  resolve: {
    extensions: ['.js']
  },
  plugins: []
};
