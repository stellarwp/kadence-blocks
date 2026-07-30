/* eslint-env jest */
import { CUSTOM_COLORS_GROUP_LABEL } from '../constants/navigation';
import { buildNavigationSections } from '../helpers/navigation';

describe('buildNavigationSections', () => {
	it('always includes a reachable Custom Colors section, even with zero user-created tokens', () => {
		const sections = buildNavigationSections([{ id: 'primitive.color.blue', group: 'Brand' }]);

		const customColors = sections.find((section) => section.groupName === CUSTOM_COLORS_GROUP_LABEL);

		expect(customColors).toBeDefined();
		expect(customColors.count).toBe(0);
		expect(customColors.isUserCreated).toBe(true);
	});

	it('does not duplicate the Custom Colors section when user-created tokens already exist', () => {
		const sections = buildNavigationSections([
			{ id: 'primitive.color.custom.my-blue', group: CUSTOM_COLORS_GROUP_LABEL },
		]);

		const customColorSections = sections.filter((section) => section.groupName === CUSTOM_COLORS_GROUP_LABEL);

		expect(customColorSections).toHaveLength(1);
		expect(customColorSections[0].count).toBe(1);
	});

	it('marks non-custom foundation sections as not user-created', () => {
		const sections = buildNavigationSections([{ id: 'primitive.color.blue', group: 'Brand' }]);

		const brand = sections.find((section) => section.groupName === 'Brand');

		expect(brand.isUserCreated).toBe(false);
	});
});
