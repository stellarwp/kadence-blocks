/**
 * BLOCK: Kadence Accordion Attributes
 */
const attributes = {
	id: {
		type: 'number',
		default: 1,
	},
	title: {
		type: 'array',
		source: 'children',
		selector: '.kt-blocks-accordion-title',
		default: '',
	},
	titleTag: {
		type: 'string',
		default: 'div',
	},
	hideLabel: {
		type: 'bool',
		default: false,
	},
	icon: {
		type: 'string',
		default: '',
	},
	iconSide: {
		type: 'string',
		default: 'right',
	},
	uniqueID: {
		type: 'string',
		default: '',
	},
};
export default attributes;
