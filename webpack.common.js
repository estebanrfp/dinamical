const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OfflinePlugin = require('offline-plugin')

module.exports = {
  entry: {
    app: './lib/index.ts'
  },
  plugins: [
    new OfflinePlugin({
      publicPath: '/',
      appShell: '/',
      externals: [
        '/'
      ],
      ServiceWorker: {
        events: true
      },
      AppCache: {
        events: true
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(css|styl)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader?importLoaders=true',
          'postcss-loader',
          'stylus-loader'
        ]
      },
      {
        test: /\.html$/,
        use: ['html-loader']
      },
      {
        test: /\.pug$/,
        use: ['pug-loader?pretty=true']
      }
    ]
  }
}
