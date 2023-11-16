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
		'prettier/prettier': 'off', // Disabling prettier warnings until configure how we want
	},
};

module.exports = eslintConfig;
