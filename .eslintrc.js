const path = require( 'path' );

const eslintConfig = {
	root: true,
	parser: '@babel/eslint-parser',
	extends: [ 'plugin:@wordpress/eslint-plugin/recommended' ],
	settings: {
		'import/resolver': {
			node: {},
			webpack: {
				config: path.join( __dirname, '/webpack.config.js' ),
			},
		},
	},
	rules: {
		'import/no-extraneous-dependencies': 'off',
		'import/no-unresolved': 'off',
		'import/named': 'off',
		'prettier/prettier': 'off', // Disabling prettier warnings until configured how we want
	},
	ignorePatterns:
		[
			'node_modules/',
			'dist/',
			'build/',
			'vendor/',
			'gulp/',
			'src/plugin.js',
			'src/assets/',
			'src/config/',
			'src/dashboard/',
			'src/extension/',
			'src/packages/',
			'src/plugins/',
			'src/settings/',
			'src/blocks/accordion/',
			'src/blocks/advanced-form/',
			'src/blocks/advancedbtn/',
			'src/blocks/advancedgallery/',
			'src/blocks/advancedheading/',
			'src/blocks/column/',
			'src/blocks/countdown/',
			'src/blocks/countup/',
			'src/blocks/form/',
			'src/blocks/googlemaps/',
			'src/blocks/header/',
			'src/blocks/icon/',
			'src/blocks/iconlist/',
			'src/blocks/image/',
			'src/blocks/infobox/',
			'src/blocks/listitem/',
			'src/blocks/lottie/',
			'src/blocks/navigation/',
			'src/blocks/navigation-link/',
			'src/blocks/navigation-submenu/',
			'src/blocks/posts/',
			'src/blocks/progress-bar/',
			'src/blocks/rowlayout/',
			'src/blocks/show-more/',
			'src/blocks/single-icon/',
			'src/blocks/singlebtn/',
			'src/blocks/spacer/',
			'src/blocks/tableofcontents/',
			'src/blocks/tabs/',
			'src/blocks/testimonial/',
			'src/blocks/testimonials/'
		],
};

module.exports = eslintConfig;
