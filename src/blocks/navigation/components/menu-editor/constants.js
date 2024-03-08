export const EDITABLE_BLOCK_ATTRIBUTES = [
	{
		name: 'core/paragraph',
		attributes: [
			{
				name: 'content',
				type: 'string',
			},
		],
	},
	{
		name: 'kadence/navigation-link',
		attributes: [
			{
				name: 'label',
				type: 'string',
			},
			{
				name: 'url',
				type: 'string',
			},
		],
	},
	{
		name: 'kadence/advancedheading',
		attributes: [
			{
				name: 'content',
				type: 'string',
			},
		],
	},
];

export const PREVENT_BLOCK_DELETE = ['kadence/column', 'kadence/rowlayout'];
