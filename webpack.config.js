const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const DependencyExtractionWebpackPlugin = require( '@wordpress/dependency-extraction-webpack-plugin' );
const StyleOnlyEntryPlugin = require( './src/config/style-only-entry-plugin' );
const EXTERNAL_NAME = 'kadence';
const HANDLE_NAME = 'kadence';
const PROJECT_NAMESPACE = '@kadence/';

function camelCaseDash(string) {
	return string.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}
defaultConfig.output.path = __dirname + '/dist/';
//defaultConfig.output.library = [ 'kadence', '[name]', '[entry]' ];
defaultConfig.output.libraryTarget = 'this';
module.exports = {
	...defaultConfig,
	entry: {
		'packages/icons': './src/packages/icons/src/index.js',
		'packages/components': './src/packages/components/src/index.js',
		'packages/helpers': './src/packages/helpers/src/index.js',
		'blocks/google-maps/google-maps': './src/blocks/google-maps/index.js',
		'blocks/lottie/lottie': './src/blocks/lottie/index.js',
		'blocks/image/image': './src/blocks/image/index.js',
		'blocks/spacer/spacer': './src/blocks/spacer/block.js',
		'blocks/advanced-btn/advanced-btn': './src/blocks/advanced-btn/block.js',
		'blocks/count-up/count-up': './src/blocks/count-up/block.js',
		'blocks/row-layout/row-layout': './src/blocks/row-layout/index.js',
		'blocks/column/column': './src/blocks/column/index.js',
		'blocks/advanced-heading/advanced-heading': './src/blocks/advanced-heading/block.js',
		'blocks/icon/icon': './src/blocks/icon/block.js',
		'blocks/tabs/tabs': './src/blocks/tabs/block.js',
		'blocks/info-box/info-box': './src/blocks/info-box/block.js',
		'blocks/accordion/accordion': './src/blocks/accordion/block.js',
		'blocks/icon-list/icon-list': './src/blocks/icon-list/block.js',
		'blocks/advanced-gallery/advanced-gallery': './src/blocks/advanced-gallery/block.js',
		'blocks/form/form': './src/blocks/form/block.js',
		'blocks/table-of-contents/table-of-contents': './src/blocks/table-of-contents/block.js',
		'blocks/posts/posts': './src/blocks/posts/block.js',
		'blocks/show-more/show-more': './src/blocks/show-more/index.js',
		'blocks/countdown/countdown': './src/blocks/countdown/block.js',
		'blocks/testimonials/testimonials': './src/blocks/testimonials/block.js',
		'plugin/kadence-control': './src/plugin.js',
		'extension/kadence-base': './src/extension/kadence-base/index.js',
		'extension/stores': './src/extension/stores/index.js',
		'extension/block-css': './src/extension/block-css/index.js',
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
	// resolve: {
	// 	alias: {
	// 		'@kadence/icons': path.resolve( __dirname, './src/packages/icons/src/index.js' ),
	// 		'@kadence/components': path.resolve( __dirname, './src/packages/components/src/index.js' ),
	// 		'@kadence/helpers': path.resolve( __dirname, './src/packages/helpers/src/index.js' ),
	// 	},
	// },
};