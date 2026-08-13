/* eslint-env jest */
import { FIELD_TYPES } from '../constants/field-types';
import {
	BREAKPOINTS,
	DESKTOP_BREAKPOINT,
	fieldComponentFor,
	getResponsiveValueAtPath,
	getValueAtPath,
	isEqual,
	normalizeSchema,
	readResponsiveSlot,
	setValueAtPath,
	writeResponsiveSlot,
} from '../helpers/settings-schema';

describe('normalizeSchema', () => {
	it('wraps top-level fields in a single untitled panel', () => {
		const normalized = normalizeSchema({ fields: [{ type: 'text', path: 'label', label: 'Name' }] });

		expect(normalized.panels).toHaveLength(1);
		expect(normalized.panels[0].title).toBe('');
		expect(normalized.panels[0].fields).toHaveLength(1);
	});

	it('keeps authored panels and their order', () => {
		const schema = {
			panels: [
				{ id: 'a', title: 'A', fields: [{ type: 'text', path: 'x', label: 'X' }] },
				{ id: 'b', title: 'B', fields: [{ type: 'text', path: 'y', label: 'Y' }] },
			],
		};

		const normalized = normalizeSchema(schema);

		expect(normalized.panels.map((panel) => panel.id)).toEqual(['a', 'b']);
	});

	it('drops fields with an unregistered type', () => {
		const schema = {
			fields: [
				{ type: 'text', path: 'label', label: 'Name' },
				{ type: 'nonsense', path: 'ghost', label: 'Ghost' },
			],
		};

		const normalized = normalizeSchema(schema);

		expect(normalized.panels[0].fields).toHaveLength(1);
		expect(normalized.panels[0].fields[0].path).toBe('label');
		expect(console).toHaveWarned();
	});

	it('defaults readOnly to false and preserves an explicit true', () => {
		const schema = {
			fields: [
				{ type: 'text', path: 'label', label: 'Name' },
				{ type: 'text', path: 'id', label: 'ID', readOnly: true },
			],
		};

		const normalized = normalizeSchema(schema);

		expect(normalized.panels[0].fields[0].readOnly).toBe(false);
		expect(normalized.panels[0].fields[1].readOnly).toBe(true);
	});

	it('defaults initialOpen to true unless explicitly false', () => {
		const schema = {
			panels: [
				{ id: 'a', title: 'A', fields: [] },
				{ id: 'b', title: 'B', initialOpen: false, fields: [] },
			],
		};

		const normalized = normalizeSchema(schema);

		expect(normalized.panels[0].initialOpen).toBe(true);
		expect(normalized.panels[1].initialOpen).toBe(false);
	});

	it('defaults responsive to false and preserves an explicit true on a capable type', () => {
		const schema = {
			fields: [
				{ type: 'number-unit', path: 'size', label: 'Size' },
				{ type: 'number-unit', path: 'width', label: 'Width', responsive: true },
			],
		};

		const normalized = normalizeSchema(schema);

		expect(normalized.panels[0].fields[0].responsive).toBe(false);
		expect(normalized.panels[0].fields[1].responsive).toBe(true);
	});

	it('demotes responsive: true on a non-capable type to false and warns', () => {
		const schema = {
			fields: [{ type: 'toggle', path: 'enabled', label: 'Enabled', responsive: true }],
		};

		const normalized = normalizeSchema(schema);

		expect(normalized.panels[0].fields[0].responsive).toBe(false);
		expect(console).toHaveWarned();
	});

	it('carries colorOnly through untouched on a color field', () => {
		const schema = {
			fields: [{ type: 'color', path: 'value', label: 'Color', colorOnly: true }],
		};

		const normalized = normalizeSchema(schema);

		expect(normalized.panels[0].fields[0].colorOnly).toBe(true);
	});
});

describe('fieldComponentFor', () => {
	it('resolves every registered FIELD_TYPES entry', () => {
		Object.keys(FIELD_TYPES).forEach((type) => {
			expect(fieldComponentFor(type)).toBe(FIELD_TYPES[type]);
		});
	});

	it('returns null for an unknown type', () => {
		expect(fieldComponentFor('nonsense')).toBeNull();
	});
});

describe('getValueAtPath', () => {
	it('reads nested dot paths', () => {
		expect(getValueAtPath({ border: { top: '4px' } }, 'border.top')).toBe('4px');
	});

	it('returns empty for missing paths', () => {
		expect(getValueAtPath({}, 'border.top')).toBe('');
		expect(getValueAtPath(null, 'border.top')).toBe('');
		expect(getValueAtPath({ border: null }, 'border.top')).toBe('');
	});
});

describe('setValueAtPath', () => {
	it('writes immutably and creates intermediate objects', () => {
		const result = setValueAtPath({}, 'border.top', '4px');

		expect(result).toEqual({ border: { top: '4px' } });
	});

	it('does not mutate the input object', () => {
		const input = { border: { top: '2px' } };
		const result = setValueAtPath(input, 'border.top', '4px');

		expect(input).toEqual({ border: { top: '2px' } });
		expect(result).toEqual({ border: { top: '4px' } });
	});
});

describe('isEqual', () => {
	it('treats deeply equal objects as equal', () => {
		expect(isEqual({ a: { b: 1 } }, { a: { b: 1 } })).toBe(true);
	});

	it('treats objects with a differing nested value as unequal', () => {
		expect(isEqual({ a: { b: 1 } }, { a: { b: 2 } })).toBe(false);
	});
});

describe('readResponsiveSlot', () => {
	it('reads a plain scalar at desktop and empty elsewhere', () => {
		expect(readResponsiveSlot(24, DESKTOP_BREAKPOINT)).toBe(24);
		expect(readResponsiveSlot(24, 'tablet')).toBe('');
	});

	it('reads base at desktop and the matching override elsewhere', () => {
		const raw = { base: 24, responsive: { tablet: 18, mobile: 14 } };

		expect(readResponsiveSlot(raw, DESKTOP_BREAKPOINT)).toBe(24);
		expect(readResponsiveSlot(raw, 'tablet')).toBe(18);
		expect(readResponsiveSlot(raw, 'mobile')).toBe(14);
	});

	it('reads base at every breakpoint for a clamp leaf', () => {
		const raw = { base: 24, clamp: { min: '1rem', preferred: '2vw', max: '2rem' } };

		expect(readResponsiveSlot(raw, DESKTOP_BREAKPOINT)).toBe(24);
		expect(readResponsiveSlot(raw, 'tablet')).toBe(24);
	});
});

describe('writeResponsiveSlot', () => {
	it('writes a plain scalar at desktop when the leaf is not yet structured', () => {
		expect(writeResponsiveSlot(24, DESKTOP_BREAKPOINT, 32)).toBe(32);
	});

	it('upgrades a scalar to the structured shape on a non-desktop write', () => {
		expect(writeResponsiveSlot(24, 'tablet', 18)).toEqual({ base: 24, responsive: { tablet: 18 } });
	});

	it('updates base in place on a desktop write, preserving existing overrides', () => {
		const raw = { base: 24, responsive: { tablet: 18 } };

		expect(writeResponsiveSlot(raw, DESKTOP_BREAKPOINT, 32)).toEqual({ base: 32, responsive: { tablet: 18 } });
	});

	it('drops an existing clamp when a stepped override is written', () => {
		const raw = { base: 24, clamp: { min: '1rem', preferred: '2vw', max: '2rem' } };

		expect(writeResponsiveSlot(raw, 'mobile', 14)).toEqual({ base: 24, responsive: { mobile: 14 } });
	});
});

describe('getResponsiveValueAtPath', () => {
	it('reads a nested leaf at the given breakpoint', () => {
		const values = { fontSize: { base: 24, responsive: { tablet: 18 } } };

		expect(getResponsiveValueAtPath(values, 'fontSize', DESKTOP_BREAKPOINT)).toBe(24);
		expect(getResponsiveValueAtPath(values, 'fontSize', 'tablet')).toBe(18);
	});
});

describe('BREAKPOINTS', () => {
	it('starts with desktop, followed by the responsive override steps', () => {
		expect(BREAKPOINTS[0]).toBe(DESKTOP_BREAKPOINT);
		expect(BREAKPOINTS).toEqual([DESKTOP_BREAKPOINT, 'tablet', 'mobile']);
	});
});
