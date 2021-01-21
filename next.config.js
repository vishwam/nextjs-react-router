const path = require('path');

const isProd = process.env.NODE_ENV === 'production';

// paths
const root = process.cwd();
const src = path.resolve(root, './src');

module.exports = {
  useFileSystemPublicRoutes: false,
  webpack(config, { isServer }) {
    // Let webpack know about the theme alias to be able to use it in SCSS
    // TS aliases should be set in the tsconfig
    config.resolve.alias['theme'] = path.resolve(src, './theme');

    // Add svgr support
    config.module.rules.push({
      // treat svgs in src/ as both react components and media files:
      // https://create-react-app.dev/docs/adding-images-fonts-and-files/#adding-svgs
      test: /\.svg$/,
      exclude: /node_modules/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            memo: true,
          },
        },
        {
          loader: 'file-loader',
          options: {
            name: '[name].[contentHash:8].[ext]',
            // next puts all their files in the _next folder, so follow the same standard
            publicPath: `${
              config.assetPrefix || config.basePath || ''
            }/_next/static/media/`,
            // On the server we the path is directly /static instead of /_next/static so account for that
            outputPath: `${isServer ? '../' : ''}static/media/`,
            // no need to copy the file if we're running in node --we just need the URI,
            emitFile: !isServer,
            esModule: config.esModule,
          },
        },
      ],
    });

    // Add resjson support
    config.module.rules.push({
      // copy all resjsons to /media, preserving folder structure relative to src/
      include: [/\.resjson$/],
      loader: 'file-loader',
      options: {
        name: `${config.assetPrefix || config.basePath || ''}${
          isProd ? '[path][name].[contentHash:8].[ext]' : '[path][name].[ext]'
        }`,
        // next puts all their files in the _next folder, so follow the same standard
        publicPath: `${
          config.assetPrefix || config.basePath || ''
        }/_next/static/media/`,
        // On the server we the path is directly /static instead of /_next/static so account for that
        outputPath: `${isServer ? '../' : ''}static/media/`,
        context: src,
        // no need to copy the file if we're running in node --we just need the URI
        emitFile: !isServer,
      },
    });

    // Catch-all file loader
    config.module.rules.push({
      // Exclude `js` files to keep "css" loader working as it injects
      // its runtime that would otherwise processed through "file" loader.
      // Also exclude `html` and `json` extensions so they get processed
      // by webpacks internal loaders.
      exclude: [/\.(js|ts|jsx|tsx|mjs|scss|map)$/, /\.html$/, /\.json$/],
      loader: 'file-loader',
      options: {
        name: `${
          config.assetPrefix || config.basePath || ''
        }${'[path][name].[contentHash:8].[ext]'}`,
        // next puts all their files in the _next folder, so follow the same standard
        publicPath: `${
          config.assetPrefix || config.basePath || ''
        }/_next/static/media/`,
        // On the server we the path is directly /static instead of /_next/static so account for that
        outputPath: `${isServer ? '../' : ''}static/media/`,
        // no need to copy the file if we're running in node --we just need the URI
        emitFile: !isServer,
      },
    });

    return config;
  },
};
