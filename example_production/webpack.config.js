module.exports = {
  entry: [
    './index.js'
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js']
  },
  output: {
    path: __dirname + '/',
    publicPath: '/',
    filename: 'index.js'
  },
  devServer: {
    contentBase: './'
  }
};