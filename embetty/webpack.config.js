let {
  author,
  contributors,
  homepage,
  license,
  name,
  title,
  version,
} = require('./package.json')
let ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

let BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin
let path = require('path')
let webpack = require('webpack')

let devMode = process.env.NODE_ENV !== 'production'

/**
 * @type {webpack.Configuration}
 */
module.exports = {
  entry: {
    embetty: './src/index.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    chunkFilename: `js/[name].js`,
    filename: '[name].js',
    clean: true,
  },
  devtool: devMode ? 'inline-source-map' : 'nosources-source-map',
  mode: devMode ? 'development' : 'production',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              configFile: 'tsconfig.build.json',
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: ['css-loader', 'postcss-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /vertx/,
    }), // see https://github.com/parcel-bundler/parcel/issues/141
    new ForkTsCheckerWebpackPlugin(),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
    }),
    new webpack.BannerPlugin({
      banner: `${title || name} - v${version} - ${new Date().toGMTString()}
${homepage}
Copyright (c) ${new Date().getFullYear()} Heise Medien GmbH & Co. KG
Contributors: ${author.name}, ${contributors.map((c) => c.name).join(', ')}
Licensed under the ${license} license`,
    }),
  ],
}
