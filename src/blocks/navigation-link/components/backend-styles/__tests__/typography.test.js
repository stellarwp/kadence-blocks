/* eslint-env jest */

import BackendStyles from '../index';
import metadata from '../../../block.json';

jest.mock('@kadence/helpers', () =>
	require('../../../../../extension/typography-css/test-utils').kadenceHelpersMock({ useEditorElement: () => null })
);
jest.mock('react', () => require('../../../../../extension/typography-css/test-utils').reactWithImmediateUseMemo());

const uniqueID = 'abc';

const typographyGroups = [
	'typography',
	'dropdownTypography',
	'highlightTypography',
	'descriptionTypography',
	'dropdownDescriptionTypography',
];

const defaults = Object.fromEntries(
	Object.entries(metadata.attributes)
		.filter(([, definition]) => undefined !== definition.default)
		.map(([name, definition]) => [name, definition.default])
);

/**
 * Renders the navigation link editor styles and returns the generated CSS.
 *
 * @param {string} previewDevice The previewed device.
 * @param {Object} attributes    The block attributes to merge over the defaults.
 *
 * @since TBD
 *
 * @return {string} The generated CSS.
 */
function render(previewDevice, attributes = {}) {
	const element = BackendStyles({
		attributes: { ...defaults, uniqueID, ...attributes },
		isSelected: false,
		previewDevice,
		currentRef: { current: null },
		subMenuRef: { current: null },
		showSubMenusWithLogic: false,
		context: {},
	});
	return element.props.children;
}

describe('navigation link BackendStyles typography', () => {
	it('outputs the previewed font size as a valid declaration for each typography group', () => {
		const attributes = {};
		typographyGroups.forEach((group, index) => {
			attributes[group] = [{ size: ['10', '20', String(30 + index)], sizeType: 'px' }];
		});

		const css = render('Mobile', attributes);

		expect(css).not.toContain('{{');
		const menu = '.wp-block-kadence-navigation .navigation .menu-container';
		const selectors = [
			`.kb-nav-link-${uniqueID} > .kb-link-wrap.kb-link-wrap.kb-link-wrap > .kb-nav-link-content`,
			`.kb-nav-link-${uniqueID} .sub-menu li.menu-item > .kb-link-wrap > .kb-nav-link-content`,
			`${menu} > ul li.kb-nav-link-${uniqueID} > .kb-link-wrap > a .link-highlight-label`,
			`${menu} ul .kb-nav-link-${uniqueID} > .kb-link-wrap > a .kb-nav-label-description:not(.specificity)`,
			`${menu} ul .kb-nav-link-${uniqueID} .sub-menu .kb-link-wrap > a .kb-nav-label-description:not(.specificity)`,
		];
		selectors.forEach((selector, index) => expect(css).toContain(`${selector}{font-size:${30 + index}px;}`));
	});

	it('outputs no typography rule when no typography is set', () => {
		expect(render('Mobile')).not.toContain('font-size');
	});
});
