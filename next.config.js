const withImages = require('next-images');

module.exports = {
  compress: false,
}

const redirects = {
  async redirects() {
    return [
      {
        source: '/dashboards',
        destination: '/dashboards/tasks',
        permanent: true
      }
    ];
  }
};

module.exports = withImages(redirects, {
  compress: true,
  images: {
    minimumCacheTTL: 60, // Cache optimized images for 60 seconds
  },
});
