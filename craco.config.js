const path = require("path");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const zlib = require("zlib");

module.exports = {
  ignore: ["public/images/video/", "public/models/"],
  webpack: {
    alias: {
      "@babylon": path.resolve(__dirname, "./src/components/Babylon"),
      "@screens": path.resolve(__dirname, "./src/components/Screens"),
      "@images": path.resolve(__dirname, "./src/assets/images"),
      "@store": path.resolve(__dirname, "./src/store"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@utils": path.resolve(__dirname, "./src/utils"),
    },
    configure: (webpackConfig, { env, paths }) => {
      if (env === "production") {
        // Remove the existing compression-webpack-plugin
        webpackConfig.plugins = webpackConfig.plugins.filter(
          (plugin) => !(plugin instanceof CompressionWebpackPlugin),
        );

        // Apply TerserPlugin for code minification
        webpackConfig.optimization.minimize = true;
        webpackConfig.optimization.minimizer = [
          new TerserPlugin({
            terserOptions: {
              ecma: 6,
              keep_classnames: true,
              keep_fnames: true,
              mangle: {
                keep_classnames: true,
                keep_fnames: true,
              },
              sourceMap: false, // Disable source map generation
            },
          }),
        ];

        // Add CompressionWebpackPlugin for gzip compression
        webpackConfig.plugins.push(
          new CompressionWebpackPlugin({
            filename: "[path][base].br",
            algorithm: "brotliCompress",
            test: /\.(js|css|html|svg)$/,
            compressionOptions: {
              params: {
                [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
              },
            },
            threshold: 10240,
            minRatio: 0.8,
            deleteOriginalAssets: false,
          }),
        );
      }
      return webpackConfig;
    },
  },
  resolve: {
    fallback: {
      buffer: require.resolve("buffer/"),
    },
  },
};
