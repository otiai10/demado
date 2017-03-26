
module.exports = {
  entry: {
    background:     './src/js/entrypoints/background.js',
    content_script: './src/js/entrypoints/content_script.js',
    configs:        './src/js/entrypoints/pages/configs.js',
    popup:          './src/js/entrypoints/pages/popup.js',
    dashboard:      './src/js/entrypoints/pages/dashboard.js',
  },
  output: {
    filename: './dest/js/[name].js',
  },
  module: {
    loaders: [
      {test: /\.js$/,loaders: ['babel-loader']},
      {test: /\.(sa|c)ss$/,loaders: ['style-loader', 'css-loader', 'sass-loader']},
      {test: /\.(eot|woff|woff2|ttf|svg)$/,loaders:['url-loader']},
    ]
  },
  resolve: {
    extensions: ['.js']
  },
  plugins: []
};
