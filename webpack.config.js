const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const DependencyExtractionWebpackPlugin = require( '@wordpress/dependency-extraction-webpack-plugin' );
const StyleOnlyEntryPlugin = require( './src/config/style-only-entry-plugin' );
const EXTERNAL_NAME = 'kadence';
const HANDLE_NAME = 'kadence';
const PROJECT_NAMESPACE = '@kadence/';

function camelCaseDash(string) {
	return string.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

module.exports = {
	...defaultConfig,
	entry: {
		'icons': './src/packages/icons/src/index.js',
		'components': './src/packages/components/src/index.js',
		'helpers': './src/packages/helpers/src/index.js',
		'blocks-google-maps': './src/blocks/google-maps/index.js',
		'blocks-lottie': './src/blocks/lottie/index.js',
		'blocks-image': './src/blocks/image/index.js',
		'blocks-progress-bar': './src/blocks/progress-bar/index.js',
		'blocks-spacer': './src/blocks/spacer/index.js',
		'blocks-advanced-btn': './src/blocks/advanced-btn/block.js',
		'blocks-count-up': './src/blocks/count-up/block.js',
		'blocks-row-layout': './src/blocks/row-layout/index.js',
		'blocks-column': './src/blocks/column/index.js',
		'blocks-advanced-heading': './src/blocks/advanced-heading/block.js',
		'blocks-icon': './src/blocks/icon/block.js',
		'blocks-tabs': './src/blocks/tabs/block.js',
		'blocks-info-box': './src/blocks/info-box/block.js',
		'blocks-accordion': './src/blocks/accordion/block.js',
		'blocks-icon-list': './src/blocks/icon-list/block.js',
		'blocks-advanced-gallery': './src/blocks/advanced-gallery/block.js',
		'blocks-form': './src/blocks/form/block.js',
		'blocks-table-of-contents': './src/blocks/table-of-contents/index.js',
		'blocks-posts': './src/blocks/posts/block.js',
		'blocks-show-more': './src/blocks/show-more/index.js',
		'blocks-countdown': './src/blocks/countdown/block.js',
		'blocks-testimonials': './src/blocks/testimonials/block.js',
		'plugin-kadence-control': './src/plugin.js',
		'extension-kadence-base': './src/extension/kadence-base/index.js',
		'extension-stores': './src/extension/stores/index.js',
		'extension-block-css': './src/extension/block-css/index.js',
	},
	output: {
		...defaultConfig.output,
		path: __dirname + '/dist/',
		library: ['kadence', '[name]'],
		libraryTarget: 'this',
	},
	plugins: [
		new StyleOnlyEntryPlugin(),
		...defaultConfig.plugins.filter(
			( plugin ) =>
				plugin.constructor.name !== 'DependencyExtractionWebpackPlugin'
		),
		new DependencyExtractionWebpackPlugin({
			requestToExternal(request) {
				if (request.endsWith('.css')) {
					return false;
				}

				if (request.startsWith(PROJECT_NAMESPACE)) {
					return [
						EXTERNAL_NAME,
						camelCaseDash(
							request.substring(PROJECT_NAMESPACE.length)
						),
					];
				}
			},
			requestToHandle(request) {
				if (request.startsWith(PROJECT_NAMESPACE)) {
					return `${HANDLE_NAME}-${request.substring(
						PROJECT_NAMESPACE.length
					)}`;
				}
			},
		}),
	],
};
