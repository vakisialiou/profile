const path = require('path');

module.exports = {
  lintOnSave: false,
  runtimeCompiler: true,
  configureWebpack: {
    resolve: {
      alias: {
        '@components': path.resolve(__dirname, 'src/components/'),
        '@scene': path.resolve(__dirname, 'src/scene/'),
        '@routes': path.resolve(__dirname, 'src/routes/')
      }
    },
    module: {
      rules: [
        { test: /\.(frag|vert|glsl|md)$/, use: 'raw-loader' }
      ]
    }
  },
  devServer: {
    // contentBase: path.join(__dirname, 'dist'),
    // compress: true,
    port: 9005
  },
}