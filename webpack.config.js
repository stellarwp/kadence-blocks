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
		'blocks-google-maps-editor': './src/blocks/google-maps/index.js',
		'blocks-lottie-editor': './src/blocks/lottie/index.js',
		'blocks-image-editor': './src/blocks/image/index.js',
		'blocks-spacer-editor': './src/blocks/spacer/block.js',
		'blocks-advanced-btn-editor': './src/blocks/advanced-btn/block.js',
		'blocks-count-up-editor': './src/blocks/count-up/block.js',
		'blocks-row-layout-editor': './src/blocks/row-layout/index.js',
		'blocks-column-editor': './src/blocks/column/index.js',
		'blocks-advanced-heading-editor': './src/blocks/advanced-heading/block.js',
		'blocks-icon-editor': './src/blocks/icon/block.js',
		'blocks-tabs-editor': './src/blocks/tabs/block.js',
		'blocks-info-box-editor': './src/blocks/info-box/block.js',
		'blocks-accordion-editor': './src/blocks/accordion/block.js',
		'blocks-icon-list-editor': './src/blocks/icon-list/block.js',
		'blocks-advanced-gallery-editor': './src/blocks/advanced-gallery/block.js',
		'blocks-form-editor': './src/blocks/form/block.js',
		'blocks-table-of-contents-editor': './src/blocks/table-of-contents/index.js',
		'blocks-posts-editor': './src/blocks/posts/block.js',
		'blocks-show-more-editor': './src/blocks/show-more/index.js',
		'blocks-countdown-editor': './src/blocks/countdown/block.js',
		'blocks-testimonials-editor': './src/blocks/testimonials/index.js',
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
