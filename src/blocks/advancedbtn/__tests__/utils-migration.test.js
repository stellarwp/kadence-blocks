/* eslint-env jest */

/**
 * The v1 Advanced Button migration turns each entry of the retired `btns` array into a single button
 * block that carries a preset, not the retired "Button Inherit Styles" value.
 */

// `@wordpress/blocks` is externalized to `wp.blocks` in production and unresolvable here; the migration
// only needs `createBlock` to hand back what it was given.
jest.mock('@wordpress/blocks', () => ({ createBlock: (name, attributes) => ({ name, attributes }) }), {
	virtual: true,
});
jest.mock('@kadence/helpers', () => ({ KadenceColorOutput: (color) => color }));

import { migrateToInnerblocks } from '../utils';

/**
 * A v1 button as the retired `btns` attribute stored it, with the fields the migration reads.
 *
 * @param {Object} overrides The fields that differ from the v1 defaults.
 *
 * @return {Object} The v1 button.
 */
function v1Button(overrides = {}) {
	return {
		text: 'Click',
		link: '',
		target: '_self',
		size: '',
		paddingBT: '',
		paddingLR: '',
		color: '#555555',
		background: '',
		border: '#555555',
		backgroundOpacity: 1,
		borderOpacity: 1,
		borderRadius: '',
		borderWidth: '',
		colorHover: '#ffffff',
		backgroundHover: '#444444',
		borderHover: '#444444',
		backgroundHoverOpacity: 1,
		borderHoverOpacity: 1,
		icon: '',
		iconSide: 'right',
		iconHover: false,
		cssClass: '',
		noFollow: false,
		gap: 5,
		responsiveSize: ['', ''],
		gradient: ['#999999', 1, 0, 100, 'linear', 180, 'center center'],
		gradientHover: ['#777777', 1, 0, 100, 'linear', 180, 'center center'],
		btnStyle: 'basic',
		btnSize: 'standard',
		backgroundType: 'solid',
		backgroundHoverType: 'solid',
		width: ['', '', ''],
		responsivePaddingBT: ['', ''],
		responsivePaddingLR: ['', ''],
		boxShadow: [false, '#000000', 0.2, 1, 1, 2, 0, false],
		boxShadowHover: [false, '#000000', 0.4, 2, 2, 3, 0, false],
		sponsored: false,
		download: false,
		tabletGap: '',
		mobileGap: '',
		inheritStyles: '',
		iconSize: ['', '', ''],
		iconPadding: ['', '', '', ''],
		iconTabletPadding: ['', '', '', ''],
		iconMobilePadding: ['', '', '', ''],
		onlyIcon: [false, '', ''],
		iconColor: '',
		iconColorHover: '',
		sizeType: 'px',
		iconSizeType: 'px',
		label: '',
		marginUnit: 'px',
		margin: ['', '', '', ''],
		tabletMargin: ['', '', '', ''],
		mobileMargin: ['', '', '', ''],
		anchor: '',
		...overrides,
	};
}

/**
 * Run the migration on one v1 button and return the single button block it produces.
 *
 * @param {Object} overrides The v1 button fields that differ from the defaults.
 *
 * @return {Object} The migrated single button's attributes.
 */
function migrateOne(overrides) {
	const [, innerBlocks] = migrateToInnerblocks({ btns: [v1Button(overrides)], btnCount: 1 });

	expect(innerBlocks).toHaveLength(1);
	expect(innerBlocks[0].name).toBe('kadence/singlebtn');

	return innerBlocks[0].attributes;
}

describe('migrateToInnerblocks', () => {
	it('gives a v1 button that inherited the theme style the theme-base preset', () => {
		const attributes = migrateOne({ inheritStyles: 'inherit' });

		expect(attributes.kbPreset).toBe('theme-base');
		expect(attributes.inheritStyles).toBe('');
	});

	it('gives a v1 button with a solid background and no border the default look', () => {
		const attributes = migrateOne({ background: '#0000ff', borderWidth: 0 });

		expect(attributes.kbPreset).toBe('');
		expect(attributes.inheritStyles).toBe('');
	});

	it('gives a v1 button with a gradient background and no border the default look', () => {
		const attributes = migrateOne({ backgroundType: 'gradient', borderWidth: '0' });

		expect(attributes.kbPreset).toBe('');
		expect(attributes.inheritStyles).toBe('');
	});

	it('gives any other v1 button the outline preset', () => {
		expect(migrateOne({}).kbPreset).toBe('outline');
		expect(migrateOne({ background: '#0000ff', borderWidth: 2 }).kbPreset).toBe('outline');
		expect(migrateOne({ inheritStyles: 'outline' }).kbPreset).toBe('outline');
		expect(migrateOne({ inheritStyles: 'outline' }).inheritStyles).toBe('');
	});

	it('migrates every button in the array on its own', () => {
		const [, innerBlocks] = migrateToInnerblocks({
			btns: [v1Button({ inheritStyles: 'inherit' }), v1Button({ background: '#0000ff', borderWidth: 0 })],
			btnCount: 2,
		});

		expect(innerBlocks.map((block) => block.attributes.kbPreset)).toEqual(['theme-base', '']);
	});
});
