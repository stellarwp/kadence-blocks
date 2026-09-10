/* eslint-env jest */
import { FIELD_TYPES, RESPONSIVE_CAPABLE_FIELD_TYPES } from '../constants/field-types';
import { DEMO_SETTINGS_SCHEMA, DEMO_SETTINGS_VALUES } from '../constants/demo-settings-schema';

describe('the demo schema', () => {
	it('exercises every registered field type', () => {
		const demoTypes = new Set();

		DEMO_SETTINGS_SCHEMA.panels.forEach((panel) => {
			panel.fields.forEach((field) => demoTypes.add(field.type));
		});

		expect(demoTypes).toEqual(new Set(Object.keys(FIELD_TYPES)));
	});

	it('marks exactly two fields responsive (proving per-field independence needs two), each a capable type', () => {
		const responsiveFields = DEMO_SETTINGS_SCHEMA.panels.flatMap((panel) =>
			panel.fields.filter((field) => field.responsive === true)
		);

		expect(responsiveFields).toHaveLength(2);
		responsiveFields.forEach((field) => expect(RESPONSIVE_CAPABLE_FIELD_TYPES).toContain(field.type));
	});

	it('gives every responsive field a plain scalar initial value, matching a non-responsive field', () => {
		const responsiveFields = DEMO_SETTINGS_SCHEMA.panels.flatMap((panel) =>
			panel.fields.filter((field) => field.responsive === true)
		);

		responsiveFields.forEach((field) => expect(typeof DEMO_SETTINGS_VALUES[field.path]).toBe('number'));
	});
});
