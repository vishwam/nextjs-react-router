let assetPrefix = '/platformassets/ux-renderer/v2'
if (process.env.SERVER_NAME) {
  assetPrefix = `//static.${process.env.SERVER_NAME}${assetPrefix}`
}

module.exports = {
  useFileSystemPublicRoutes: false,
  assetPrefix,
  compress: false, // will be done by nginx
  poweredByHeader: false, // don't expose internal details
  generateEtags: false, // unnecessary, blocks the event loop
}
