/* eslint-env jest */
jest.mock(
	'@wordpress/blocks',
	() => ({
		getBlockType: () => ({ attributes: { borderRadiusUnit: { default: 'px' }, paddingUnit: { default: 'px' } } }),
	}),
	{ virtual: true }
);
jest.mock('@wordpress/data', () => ({}), { virtual: true });
jest.mock('@wordpress/element', () => ({}), { virtual: true });

import { siteBorderDefaults, withSiteDefaults } from '../site-defaults';

const radius = {
	kind: 'dimension',
	presetValue: '3px',
	responsive: { tablet: '2px', mobile: undefined },
	responsiveAttrs: { tablet: 'tabletBorderRadius', mobile: 'mobileBorderRadius' },
	bound: true,
	overridden: false,
};

const binding = {
	background: { kind: 'color', presetValue: 'palette-btn-bg', responsiveAttrs: [], bound: true, overridden: false },
	color: { kind: 'color', presetValue: 'palette-btn', bound: true, overridden: false },
	borderRadius: radius,
	borderStyle: { kind: 'border', presetValue: { color: 'palette3' }, bound: true, overridden: false },
};

describe('withSiteDefaults', () => {
	it('returns the binding as is without site values', () => {
		expect(withSiteDefaults(binding, {}, 'kadence/singlebtn')).toBe(binding);
	});

	it('shows a site color in place of the token value', () => {
		const result = withSiteDefaults(binding, { background: '#ff0000' }, 'kadence/singlebtn');

		expect(result.background).toEqual({ ...binding.background, presetValue: '#ff0000', bound: false });
		expect(result.color).toBe(binding.color);
	});

	it('shows a site radius with its unit, and the site values per device', () => {
		const result = withSiteDefaults(
			binding,
			{ borderRadius: [20, 20, 20, 20], borderRadiusUnit: 'em', mobileBorderRadius: [4, '', 4, ''] },
			'kadence/singlebtn'
		);

		expect(result.borderRadius.presetValue).toEqual(['20em', '20em', '20em', '20em']);
		expect(result.borderRadius.responsive).toEqual({ tablet: undefined, mobile: ['4em', '', '4em', ''] });
		expect(result.borderRadius.bound).toBe(false);
	});

	it('takes the block default unit and the preset corner the site leaves unset', () => {
		const result = withSiteDefaults(binding, { borderRadius: [20, '', 20, ''] }, 'kadence/singlebtn');

		expect(result.borderRadius.presetValue).toEqual(['20px', '3px', '20px', '3px']);
	});

	it('keeps the token values of a border', () => {
		const result = withSiteDefaults(binding, { borderStyle: [{ top: ['#000', 'solid', 2] }] }, 'kadence/singlebtn');

		expect(result.borderStyle).toBe(binding.borderStyle);
	});
});

describe('siteBorderDefaults', () => {
	const responsive = { tablet: 'tabletBorderStyle', mobile: 'mobileBorderStyle' };
	const border = (top, unit = 'px') => [{ top, right: ['', '', ''], bottom: ['', '', ''], left: ['', '', ''], unit }];

	it('has no defaults without a site border', () => {
		expect(siteBorderDefaults({}, 'borderStyle', responsive, 'Desktop')).toEqual({
			width: undefined,
			color: undefined,
		});
	});

	it('takes the width with its unit and the color of the first side the site sets', () => {
		const site = {
			borderStyle: [
				{
					top: ['', '', ''],
					right: ['#00ff00', 'solid', 3],
					bottom: ['', '', ''],
					left: ['', '', ''],
					unit: 'em',
				},
			],
		};

		expect(siteBorderDefaults(site, 'borderStyle', responsive, 'Desktop')).toEqual({
			width: '3em',
			color: '#00ff00',
		});
	});

	it('takes a narrower device value first and falls back per axis to wider devices', () => {
		const site = {
			borderStyle: border(['#000000', 'solid', 2]),
			tabletBorderStyle: border(['', '', 4]),
		};

		expect(siteBorderDefaults(site, 'borderStyle', responsive, 'Mobile')).toEqual({
			width: '4px',
			color: '#000000',
		});
		expect(siteBorderDefaults(site, 'borderStyle', responsive, 'Desktop')).toEqual({
			width: '2px',
			color: '#000000',
		});
	});
});
