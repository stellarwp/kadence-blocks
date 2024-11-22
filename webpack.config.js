const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const DependencyExtractionWebpackPlugin = require('@wordpress/dependency-extraction-webpack-plugin');
const StyleOnlyEntryPlugin = require('./src/config/style-only-entry-plugin');
const path = require('path');

// https://github.com/WordPress/gutenberg/issues/65585#issuecomment-2392660458
const sassLoaderOptions = {
	sourceMap: process.env.NODE_ENV !== 'production',
	api: 'modern',
};

const updateSassLoader = (rules) => {
	rules.forEach((rule) => {
		if (rule.use && Array.isArray(rule.use)) {
			rule.use.forEach((loader) => {
				if (loader.loader && loader.loader.includes('sass-loader')) {
					loader.options = {
						...loader.options,
						...sassLoaderOptions,
					};
				}
			});
		}
	});
	return rules;
};

module.exports = {
	...defaultConfig,
	resolve: {
		...defaultConfig.resolve,
		alias: {
			...defaultConfig.resolve?.alias,
			'@emotion/react': path.resolve('./node_modules/@emotion/react'),
		},
	},
	module: {
		...defaultConfig.module,
		rules: updateSassLoader(defaultConfig.module.rules),
	},
	entry: {
		icons: './src/packages/icons/src/index.js',
		components: './src/packages/components/src/index.js',
		helpers: './src/packages/helpers/src/index.js',
		'blocks-navigation': './src/blocks/navigation/index.js',
		'blocks-navigation-link': './src/blocks/navigation-link/index.js',
		'blocks-header': './src/blocks/header/index.js',
		'blocks-googlemaps': './src/blocks/googlemaps/block.js',
		'blocks-lottie': './src/blocks/lottie/index.js',
		'blocks-image': './src/blocks/image/index.js',
		'blocks-spacer': './src/blocks/spacer/index.js',
		'blocks-advancedbtn': './src/blocks/advancedbtn/block.js',
		'blocks-singlebtn': './src/blocks/singlebtn/block.js',
		'blocks-countup': './src/blocks/countup/block.js',
		'blocks-rowlayout': './src/blocks/rowlayout/index.js',
		'blocks-identity': './src/blocks/identity/index.js',
		'blocks-column': './src/blocks/column/index.js',
		'blocks-advancedheading': './src/blocks/advancedheading/block.js',
		'blocks-icon': './src/blocks/icon/block.js',
		'blocks-single-icon': './src/blocks/single-icon/block.js',
		'blocks-tabs': './src/blocks/tabs/block.js',
		'blocks-infobox': './src/blocks/infobox/block.js',
		'blocks-accordion': './src/blocks/accordion/block.js',
		'blocks-iconlist': './src/blocks/iconlist/block.js',
		'blocks-advancedgallery': './src/blocks/advancedgallery/block.js',
		'blocks-form': './src/blocks/form/block.js',
		'blocks-tableofcontents': './src/blocks/tableofcontents/index.js',
		'blocks-posts': './src/blocks/posts/block.js',
		'blocks-search': './src/blocks/search/index.js',
		'blocks-show-more': './src/blocks/show-more/index.js',
		'blocks-countdown': './src/blocks/countdown/block.js',
		'blocks-testimonial': './src/blocks/testimonial/block.js',
		'blocks-testimonials': './src/blocks/testimonials/block.js',
		'blocks-advanced-form': './src/blocks/advanced-form/index.js',
		'blocks-progress-bar': './src/blocks/progress-bar/index.js',
		'plugin-kadence-control': './src/plugin.js',
		'early-filters': './src/early-filters.js',
		'extension-kadence-base': './src/extension/kadence-base/index.js',
		'extension-stores': './src/extension/stores/index.js',
		'extension-block-css': './src/extension/block-css/index.js',
		'extension-image-picker': './src/extension/image-picker/index.js',
		'admin-kadence-home': './src/home.js',
		'header-visual-builder': './src/header-visual-builder.js',
	},
	output: {
		...defaultConfig.output,
		path: __dirname + '/dist/',
		library: ['kadence', '[name]'],
		libraryTarget: 'this',
	},
	plugins: [
		new StyleOnlyEntryPlugin(),
		...defaultConfig.plugins.filter((plugin) => plugin.constructor.name !== 'DependencyExtractionWebpackPlugin'),
		new DependencyExtractionWebpackPlugin({
			requestToExternal(request) {
				if (request.endsWith('.css')) {
					return false;
				}
			},
		}),
	],
};
