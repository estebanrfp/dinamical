const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
const CopyPlugin = require('copy-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const BrotliPlugin = require('brotli-webpack-plugin')

const TerserPlugin = require('terser-webpack-plugin')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const HtmlWebpackPlugin = require('html-webpack-plugin')

const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  output: {
    path: `${ __dirname }/dist`,
    filename: '[name].[hash].js',
    publicPath: '/',
    chunkFilename: '[name].[hash].js'
  },
  optimization: {
    nodeEnv: 'production',
    mangleWasmImports: true,
    removeAvailableModules: true,
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'commons',
          chunks: 'all'
        }
      }
    },
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true, // Must be set to true if using source-maps in production
        terserOptions: {
          compress: {
            drop_console: true
          }
        }
      }),
      // new UglifyJSPlugin({
      //   cache: true,
      //   parallel: true,
      //   sourceMap: true // set to true if you want JS source maps
      // }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: true,
      options: {
        postcss: [
          autoprefixer()
        ]
      }
    }),
    new webpack.optimize.AggressiveMergingPlugin(), // Merge chunks
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[name].[hash].css'
    }),
    new CopyPlugin([{
      context: `${ __dirname }/static`,
      from: '**/*',
      to: `${ __dirname }/dist`
    }]),
    new ManifestPlugin({ fileName: `${ __dirname }/dist/manifest.json` }),
    new HtmlWebpackPlugin({
      title: 'Custom template',
      template: 'src/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        conservativeCollapse: true
      }
    }),
    new CompressionPlugin({
      test: /\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/,
      algorithm: 'gzip',
      threshold: 10240,
      minRatio: 0.8
    }),
    new BrotliPlugin({
      asset: '[path].br[query]',
      test: /\.(js|css|html|svg)$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ]
})
