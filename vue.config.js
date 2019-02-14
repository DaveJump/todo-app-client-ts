const path = require('path')

module.exports = {
  devServer: {
    port: 5000,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000/',
        changeOrigin: true
      }
    }
  },

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        path.resolve(__dirname, 'src/assets/sass/var.scss'),
        path.resolve(__dirname, 'src/assets/sass/placeholder.scss')
      ]
    }
  }
}
