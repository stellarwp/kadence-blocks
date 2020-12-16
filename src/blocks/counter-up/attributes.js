/**
 * BLOCK: Kadence Tabs Attributes
 */
const { __ } = wp.i18n;
const attributes = {
	uniqueID: {
		type: 'string',
		default: '',
	},
	title: {
		type: 'string',
		default: '',
	},
	start: {
		type: 'Number',
		default: 0
	},
	end: {
		type: 'Number',
		default: 100
	},
	prefix: {
		type: 'string',
		default: '',
	},
	suffix: {
		type: 'string',
		default: '',
	},
	duration: {
		type: 'Number',
		default: 2.75,
	},
	separator: {
		type: 'Boolean',
		default: false,
	}
};
export default attributes;
