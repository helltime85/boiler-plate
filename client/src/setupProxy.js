const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://helltime85.synology.me:5024',
      changeOrigin: true,
    })
  );
};