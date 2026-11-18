/* eslint-env jest */

import BackendStyles from '../index';

jest.mock('@kadence/helpers', () => ({
	KadenceBlocksCSS: jest.requireActual('../../../../../../node_modules/@kadence/helpers/dist/cjs/css').default,
	getPreviewSize: jest.requireActual('../../../../../../node_modules/@kadence/helpers/dist/cjs/get-preview-size')
		.default,
	getSpacingOptionOutput: jest.requireActual(
		'../../../../../../node_modules/@kadence/helpers/dist/cjs/spacing-utilities'
	).getSpacingOptionOutput,
	typographyStyle: jest.requireActual('../../../../../../node_modules/@kadence/helpers/dist/cjs/typography-style')
		.default,
}));

jest.mock('react', () => ({
	...jest.requireActual('react'),
	useMemo: (callback) => callback(),
}));

const uniqueID = 'abc';
const block = `.wp-block-kadence-navigation${uniqueID}`;

const typographyGroups = ['typography', 'dropdownTypography', 'descriptionTypography', 'dropdownDescriptionTypography'];

/**
 * Renders the navigation editor styles and returns the generated CSS.
 *
 * @param {string} previewDevice  The previewed device.
 * @param {Object} metaAttributes The navigation meta attributes to merge over the defaults.
 *
 * @since TBD
 *
 * @return {string} The generated CSS.
 */
function render(previewDevice, metaAttributes = {}) {
	const element = BackendStyles({
		attributes: { uniqueID, id: 1, templateKey: '' },
		isSelected: false,
		previewDevice,
		metaAttributes: { spacing: [], spacingTablet: [], spacingMobile: [], style: 'standard', ...metaAttributes },
		context: {},
	});
	return element.props.children;
}

describe('navigation BackendStyles typography', () => {
	it('outputs the previewed font size as a valid declaration for each typography group', () => {
		const metaAttributes = {};
		typographyGroups.forEach((group, index) => {
			metaAttributes[group] = [{ size: ['10', '20', String(30 + index)], sizeType: 'px' }];
		});

		const css = render('Mobile', metaAttributes);

		expect(css).not.toContain('{{');
		const selectors = [
			`${block} .menu-container > .menu > .wp-block-kadence-navigation-link > .kb-link-wrap`,
			`${block} .sub-menu > .menu-item > .kb-link-wrap > .kb-nav-link-content`,
			`${block} .menu-container > .menu > .wp-block-kadence-navigation-link > .kb-link-wrap .kb-nav-label-description`,
			`${block} .sub-menu > .menu-item > .kb-link-wrap .kb-nav-label-description`,
		];
		selectors.forEach((selector, index) => expect(css).toContain(`${selector}{font-size:${30 + index}px;}`));
	});

	it('outputs no typography rule when no typography is set', () => {
		expect(render('Mobile')).not.toContain('font-size');
	});
});
