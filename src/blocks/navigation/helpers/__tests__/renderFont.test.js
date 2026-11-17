/* eslint-env jest */

import { KadenceBlocksCSS } from '@kadence/helpers';
import renderFont from '../renderFont';

// Exposes only the real CSS builder and typography helper from `@kadence/helpers`.
jest.mock('@kadence/helpers', () => ({
	KadenceBlocksCSS: jest.requireActual('../../../../../node_modules/@kadence/helpers/dist/cjs/css').default,
	typographyStyle: jest.requireActual('../../../../../node_modules/@kadence/helpers/dist/cjs/typography-style')
		.default,
}));

// Runs `useMemo` callbacks directly so `typographyStyle()` works outside a component.
jest.mock('react', () => ({
	...jest.requireActual('react'),
	useMemo: (callback) => callback(),
}));

const typography = [
	{
		size: ['', '', '40'],
		sizeType: 'px',
		weight: '700',
		textTransform: 'uppercase',
	},
];

function build(callback) {
	const css = new KadenceBlocksCSS();
	css.set_selector('.kb-link-wrap');
	callback(css);
	return css.css_output();
}

describe('navigation renderFont', () => {
	it('css.render_font nests a rule inside the selector block', () => {
		const output = build((css) => css.render_font(typography, 'Mobile'));
		expect(output).toContain('{{');
	});

	it('emits plain declarations inside the selector block', () => {
		const output = build((css) => renderFont(css, typography, 'Mobile'));
		expect(output).not.toContain('{{');
		expect(output).toContain('.kb-link-wrap{');
		expect(output).toContain('font-size:40px;');
		expect(output).toContain('font-weight:700;');
		expect(output).toContain('text-transform:uppercase;');
	});

	it('uses the value for the previewed device only', () => {
		const data = [{ size: ['10', '20', '30'], sizeType: 'px' }];
		expect(build((css) => renderFont(css, data, 'Desktop'))).toContain('font-size:10px;');
		expect(build((css) => renderFont(css, data, 'Tablet'))).toContain('font-size:20px;');
		expect(build((css) => renderFont(css, data, 'Mobile'))).toContain('font-size:30px;');
	});

	it('keeps a font family with spaces and quotes intact', () => {
		const data = [{ family: '"Open Sans", sans-serif' }];
		expect(build((css) => renderFont(css, data, 'Desktop'))).toContain('font-family:"Open Sans", sans-serif;');
	});

	it('outputs nothing when there is no typography', () => {
		expect(build((css) => renderFont(css, [], 'Desktop'))).toBe('');
		expect(build((css) => renderFont(css, undefined, 'Desktop'))).toBe('');
	});
});
