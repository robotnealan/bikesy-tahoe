const path = require('path');

module.exports = {
  async rewrites() {
    return [
      {
        source: '/api.php',
        destination: '/api/route',
      },
    ];
  },
  webpack(config) {
    config.resolve.alias['appConfig'] = path.join(__dirname, 'src/appConfig');
    config.resolve.alias['components'] = path.join(__dirname, 'src/components');
    config.resolve.alias['lib'] = path.join(__dirname, 'src/lib');
    config.resolve.alias['pages'] = path.join(__dirname, 'src/pages');
    config.resolve.alias['@redux'] = path.join(__dirname, 'src/redux');
    config.resolve.alias['slices'] = path.join(__dirname, 'src/redux/slices');
    config.resolve.alias['@styles'] = path.join(__dirname, 'src/styles');

    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};
