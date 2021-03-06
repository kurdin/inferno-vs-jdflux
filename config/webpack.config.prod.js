var autoprefixer = require('autoprefixer');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
// var ManifestPlugin = require('webpack-manifest-plugin');
var InterpolateHtmlPlugin = require('inferno-dev-utils/InterpolateHtmlPlugin');
var url = require('url');
var paths = require('./paths');
var getClientEnvironment = require('./env');
var path = require('path');

function ensureSlash(path, needsSlash) {
  var hasSlash = path.endsWith('/');
  if (hasSlash && !needsSlash) {
    return path.substr(path, path.length - 1);
  } else if (!hasSlash && needsSlash) {
    return path + '/';
  } else {
    return path;
  }
}

// We use "homepage" field to infer "public path" at which the app is served.
// Webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
var homepagePath = require(paths.appPackageJson).homepage;
var homepagePathname = homepagePath ? url.parse(homepagePath).pathname : '/';
// Webpack uses `publicPath` to determine where the app is being served from.
// It requires a trailing slash, or the file assets will get an incorrect path.
var publicPath = ensureSlash(homepagePathname, true);
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_PATH%/xyz looks better than %PUBLIC_PATH%xyz.
var publicUrl = ensureSlash(homepagePathname, false);
// Get environment variables to inject into our app.
var env = getClientEnvironment(publicUrl);

// Assert this just to be safe.
// Development builds of Inferno are slow and not intended for production.
if (env['process.env'].NODE_ENV !== '"production"') {
  throw new Error('Production builds must have NODE_ENV=production.');
}

// This is the production configuration.
// It compiles slowly and is focused on producing a fast and minimal bundle.
// The development configuration is different and lives in a separate file.
module.exports = {
  // Don't attempt to continue if there are any errors.
  // bail: true,
  // We generate sourcemaps in production. This is slow but gives good results.
  // You can exclude the *.map files from the build during deployment.
  // devtool: 'source-map',
  // In production, we only want to load the polyfills and the app code.
  externals: {
    // require("jquery") is external and available
    //  on the global var jQuery
    jquery: 'jQuery',
    jquery: '$',
    lodash: '_'
  },
  entry: {
    'inferno-app': [
      require.resolve('./polyfills'),
      require.resolve('./performance-now'),
      paths.appIndexJs
    ],
    'angular2-app': [
      './src/angular2/polyfills.browser.ts',
      './src/angular2/vendor.browser.ts',
      './src/angular2/index.ts'
    ],    
    'jdflux-app': [
      require.resolve('./polyfills'),
      require.resolve('./performance-now'),
      paths.jdfluxIndexJs
    ]
  },
  output: {
    publicPath: 'js/build',
    filename: '[name].js',
    // Next line is not used in dev but WebpackDevServer crashes without it:
    path: paths.appBuild,
    // Add /* filename */ comments to generated require()s in the output.
    // pathinfo: true,
    // This does not produce a real file. It's just the virtual path that is
    // served by WebpackDevServer in development. This is the JS bundle
    // containing code from all our entry points, and the Webpack runtime.
    // This is the URL that app is served from. We use "/" in development.
    // publicPath: publicPath
  },

  // output: {
  //   // The build folder.
  //   path: paths.appBuild,
  //   // Generated JS file names (with nested folders).
  //   // There will be one main bundle, and one file per asynchronous chunk.
  //   // We don't currently advertise code splitting but Webpack supports it.
  //   filename: 'static/js/[name].[chunkhash:8].js',
  //   chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
  //   // We inferred the "public path" (such as / or /my-project) from homepage.
  //   publicPath: publicPath
  // },
  resolve: {
    modulesDirectories: [
      'node_modules'
    ],
    root: path.resolve(__dirname),
    alias: {
      dust: 'dustjs-linkedin/lib/dust.js'
    }, 
    // This allows you to set a fallback for where Webpack should look for modules.
    // We read `NODE_PATH` environment variable in `paths.js` and pass paths here.
    // We use `fallback` instead of `root` because we want `node_modules` to "win"
    // if there any conflicts. This matches Node resolution mechanism.
    // https://github.com/facebookincubator/create-react-app/issues/253
    fallback: paths.nodePaths,
    // These are the reasonable defaults supported by the Node ecosystem.
    // We also include JSX as a common component filename extension to support
    // some tools, although we do not recommend using it, see:
    // https://github.com/facebookincubator/create-react-app/issues/290
    extensions: ['.js', '.json', '.jsx', '.ts', '']
  },
  
  module: {
    // First, run the linter.
    // It's important to do this before Babel processes the JS.
    preLoaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'eslint',
        include: paths.appSrc
      }
    ],
    loaders: [
      // Default loader: load all assets that are not handled
      // by other loaders with the url loader.
      // Note: This list needs to be updated with every change of extensions
      // the other loaders match.
      // E.g., when adding a loader for a new supported file extension,
      // we need to add the supported extension to this loader too.
      // Add one new line in `exclude` for each loader.
      //
      // "file" loader makes sure those assets end up in the `build` folder.
      // When you `import` an asset, you get its filename.
      // "url" loader works just like "file" loader but it also embeds
      // assets smaller than specified size as data URLs to avoid requests.
      // {
      //   exclude: [
      //     /\.html$/,
      //     /\.(js|jsx)$/,
      //     /\.css$/,
      //     /\.json$/,
      //     /\.svg$/
      //   ],
      //   loader: 'url',
      //   query: {
      //     limit: 10000,
      //     name: 'static/media/[name].[hash:8].[ext]'
      //   }
      // },
      // Process JS with Babel.
      {
      test: /\.ts$/,
          // use: [
            // '@angularclass/hmr-loader?pretty=true&prod=false',
            // 'awesome-typescript-loader',
            // 'angular2-template-loader',
            // 'angular-router-loader'
          // ],
          loaders: [
            'babel-loader?presets[]=es2015',
            // '@angularclass/hmr-loader?pretty=true&prod=false',
            'awesome-typescript-loader'
          ],
          exclude: [/\.(spec|e2e)\.ts$/]
      },      
      {
        test: /\.(js|jsx)$/,
        include: paths.appSrc,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        },
        exclude: /node_modules/
      },
      // The notation here is somewhat confusing.
      // "postcss" loader applies autoprefixer to our CSS.
      // "css" loader resolves paths in CSS and adds assets as dependencies.
      // "style" loader normally turns CSS into JS modules injecting <style>,
      // but unlike in development configuration, we do something different.
      // `ExtractTextPlugin` first applies the "postcss" and "css" loaders
      // (second argument), then grabs the result CSS and puts it into a
      // separate file in our build process. This way we actually ship
      // a single CSS file in production instead of JS code injecting <style>
      // tags. If you use code splitting, however, any async bundles will still
      // use the "style" loader inside the async code so CSS from them won't be
      // in the main CSS file.
      { test: /\.dust$/, loader: 'dust-template-loader'}
      // {
      //   test: /\.css$/,
      //   loader: ExtractTextPlugin.extract('style', 'css?importLoaders=1!postcss')
      //   // Note: this won't work without `new ExtractTextPlugin()` in `plugins`.
      // },
      // // JSON is not enabled by default in Webpack but both Node and Browserify
      // // allow it implicitly so we also enable it.
      // {
      //   test: /\.json$/,
      //   loader: 'json'
      // },
      // // "file" loader for svg
      // {
      //   test: /\.svg$/,
      //   loader: 'file',
      //   query: {
      //     name: 'static/media/[name].[hash:8].[ext]'
      //   }
      // }
    ]
  },
  
  // We use PostCSS for autoprefixing only.
  postcss: function() {
    return [
      autoprefixer({
        browsers: [
          '>1%',
          'last 4 versions',
          'Firefox ESR',
          'not ie < 9', // Inferno doesn't support IE8 anyway
        ]
      }),
    ];
  },
  plugins: [
    // Makes the public URL available as %PUBLIC_URL% in index.html, e.g.:
    // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    // In production, it will be an empty string unless you specify "homepage"
    // in `package.json`, in which case it will be the pathname of that URL.
    // new InterpolateHtmlPlugin({
    //   PUBLIC_URL: publicUrl
    // }),
    // Generates an `index.html` file with the <script> injected.
    // new HtmlWebpackPlugin({
    //   inject: true,
    //   template: paths.appHtml,
    //   minify: {
    //     removeComments: true,
    //     collapseWhitespace: true,
    //     removeRedundantAttributes: true,
    //     useShortDoctype: true,
    //     removeEmptyAttributes: true,
    //     removeStyleLinkTypeAttributes: true,
    //     keepClosingSlash: true,
    //     minifyJS: true,
    //     minifyCSS: true,
    //     minifyURLs: true
    //   }
    // }),
    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
    // It is absolutely essential that NODE_ENV was set to production here.
    // Otherwise Inferno will be compiled in the very slow development mode.
    new webpack.DefinePlugin({
            __SERVER__: false,
            __CLIENT__: true,
            __DEBUG__: false,
            __DEV__: false,
            __PRODUCTION__: true,
            'process.env': {
              NODE_ENV: JSON.stringify('production')
            }
    }),
    // This helps ensure the builds are consistent if source hasn't changed:
    new webpack.optimize.OccurrenceOrderPlugin(),
    // Try to dedupe duplicated modules, if any:
    new webpack.optimize.DedupePlugin(),
    // Minify the code.
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true, // Inferno doesn't support IE8
        warnings: false
      },
      mangle: {
        screw_ie8: true
      },
      output: {
        comments: false,
        screw_ie8: true
      }
    }),
    // Note: this won't work without ExtractTextPlugin.extract(..) in `loaders`.
    // new ExtractTextPlugin('css/[name].css'),
    // Generate a manifest file which contains a mapping of all asset filenames
    // to their corresponding output file so that tools can pick it up without
    // having to parse `index.html`.
    // new ManifestPlugin({
    //   fileName: 'asset-manifest.json'
    // })
  ],
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
};