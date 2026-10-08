/* eslint-env jest */
import { PLACEHOLDER, siteRulesFrom } from '../site-rules';

// Editor globals the module imports; the functions under test don't use them.
jest.mock('@wordpress/blocks', () => ({}), { virtual: true });
jest.mock('@wordpress/compose', () => ({}), { virtual: true });
jest.mock('@wordpress/data', () => ({}), { virtual: true });
jest.mock('@wordpress/element', () => ({}), { virtual: true });

const wrap = `.kb-single-btn-${PLACEHOLDER}`;
const button = `.kt-button-${PLACEHOLDER}`;
const selectors = {
	[wrap]: '.wp-block-kadence-singlebtn',
	[button]: '.kt-button:where(.kb-btn-global-fill)',
};

describe('siteRulesFrom', () => {
	it('keeps only the rules the site values add, with the site selectors', () => {
		const defaultRule = `${wrap} ${button}::before{border-radius:0;}`;
		const hoverRule = `${wrap} ${button}:hover{color:var(--global-palette1);}`;

		expect(siteRulesFrom(defaultRule, `${defaultRule}${hoverRule}`, selectors)).toBe(
			'.wp-block-kadence-singlebtn .kt-button:where(.kb-btn-global-fill):hover{color:var(--global-palette1);}'
		);
	});

	it('compares each rule inside a media query on its own', () => {
		const media = '@media (max-width: 767px)';
		const before = `${media}{${wrap} ${button}{padding-top:4px;}}`;
		const after = `${media}{${wrap} ${button}{padding-top:4px;}${wrap} ${button}::before{opacity:1;}}`;

		expect(siteRulesFrom(before, after, selectors)).toBe(
			`${media}{.wp-block-kadence-singlebtn .kt-button:where(.kb-btn-global-fill)::before{opacity:1;}}`
		);
	});
});
