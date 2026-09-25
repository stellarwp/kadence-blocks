/* eslint-env jest */
/**
 * Internal dependencies
 */
import { presetRows, presetInitialValues, isThemePresetSlug, themeFieldDefault } from '../helpers/presets';
import { BUTTON_PRESET } from '../presets/button-preset';

const PROPERTIES = ['button-bg', 'button-text', 'button-radius'];

const PAYLOAD = {
	default: 'default',
	userCreated: [],
	presets: {
		default: {
			label: 'Default',
			tokens: { 'button-bg': '{semantic.color.button-bg}' },
			overridden: {},
			readable: false,
		},
		'theme-base': {
			label: 'Theme Base',
			tokens: { 'button-bg': '#ff0000' },
			overridden: { 'button-bg': true },
			themeClass: 'wp-block-button__link button kb-btn-global-inherit',
			themeValues: {
				'button-bg': '#2B6CB0',
				'button-text': '{semantic.color.button-text}',
				'button-radius': ['3px', '3px', '3px', '3px'],
				'button-border-width': ['1px', '1px', '1px', '1px'],
				'button-border-color': '#123456',
				'button-padding': ['0.5em', '1.2em', '0.5em', '1.2em'],
				'button-shadow': {
					color: '{semantic.color.button-bg}',
					offsetX: '0px',
					offsetY: '2px',
					blur: '4px',
					spread: '0px',
					inset: false,
				},
			},
			readable: true,
		},
		'theme-button': {
			label: 'Theme Button',
			tokens: {},
			overridden: {},
			themeClass: 'wp-block-button__link button kb-btn-global-inherit',
			themeValues: {},
			readable: false,
		},
	},
};

const FEED = { values: { 'semantic.color.button-text': '#ffffff', 'semantic.color.button-bg': '#3633e1' } };

/**
 * The rows the payload maps to, keyed by slug.
 *
 * @since TBD
 *
 * @return {Record<string, Object>} Slug => row.
 */
function rowsBySlug() {
	return Object.fromEntries(presetRows(PAYLOAD, FEED.values, () => null).map((row) => [row.id, row]));
}

describe('theme preset rows', () => {
	/**
	 * A theme preset row says it comes from the theme and whether its values can be edited.
	 *
	 * @return {void}
	 */
	it('flags theme presets and their readability', () => {
		const rows = rowsBySlug();

		expect(rows['theme-base']).toMatchObject({ isTheme: true, readable: true });
		expect(rows['theme-button']).toMatchObject({ isTheme: true, readable: false });
		expect(rows.default).toMatchObject({ isTheme: false, readable: false });
	});

	/**
	 * The theme values ride on the row, so the schema can show them as the fields' muted defaults.
	 *
	 * @return {void}
	 */
	it('carries the theme values on the row', () => {
		expect(rowsBySlug()['theme-base'].themeValues['button-bg']).toBe('#2B6CB0');
		expect(rowsBySlug().default.themeValues).toEqual({});
	});

	/**
	 * Only the reserved prefix marks a theme preset.
	 *
	 * @return {void}
	 */
	it('recognizes the reserved theme prefix', () => {
		expect(isThemePresetSlug('theme-base')).toBe(true);
		expect(isThemePresetSlug('outline')).toBe(false);
		expect(isThemePresetSlug(undefined)).toBe(false);
	});

	/**
	 * A readable theme preset seeds only its own override as set; the theme values stay muted defaults,
	 * never a bound value the panel would write back as an override on save.
	 *
	 * @return {void}
	 */
	it('seeds a readable theme preset with its overrides only', () => {
		const initial = presetInitialValues(PAYLOAD, 'theme-base', PROPERTIES);

		expect(initial.tokens).toEqual({ 'button-bg': '#ff0000', 'button-text': '', 'button-radius': '' });
		expect(initial.overridden).toEqual({ 'button-bg': true, 'button-text': false, 'button-radius': false });
	});
});

describe('BUTTON_PRESET.schemaFor with a theme preset row', () => {
	/**
	 * An unreadable theme preset offers no fields at all.
	 *
	 * @return {void}
	 */
	it('offers no panels for an unreadable theme preset', () => {
		const row = rowsBySlug()['theme-button'];

		expect(BUTTON_PRESET.schemaFor('normal', { tokens: {} }, FEED, row)).toEqual({ panels: [] });
		expect(BUTTON_PRESET.schemaFor('hover', { tokens: {} }, FEED, row)).toEqual({ panels: [] });
	});

	/**
	 * A readable theme preset's color rows fall back to the theme's colors — a literal as-is, an alias
	 * as the bare id the color control names on its own.
	 *
	 * @return {void}
	 */
	it('uses the theme colors as the color row defaults', () => {
		const fields = BUTTON_PRESET.schemaFor('normal', { tokens: {} }, FEED, rowsBySlug()['theme-base']).panels.find(
			(panel) => panel.id === 'color'
		).fields;

		expect(fields.map((field) => [field.path, field.defaultValue])).toEqual([
			['tokens.button-text', 'semantic.color.button-text'],
			['tokens.button-bg', '#2B6CB0'],
		]);
	});

	/**
	 * The theme's shape values become the muted defaults of the radius, border, shadow and padding
	 * rows, with an alias inside a composite resolved to the literal the library renders.
	 *
	 * @return {void}
	 */
	it('uses the theme shape values as the other row defaults', () => {
		const fields = BUTTON_PRESET.schemaFor(
			'normal',
			{ tokens: {} },
			FEED,
			rowsBySlug()['theme-base']
		).panels.flatMap((panel) => panel.fields);
		const byPath = Object.fromEntries(fields.map((field) => [field.path, field]));

		expect(byPath['tokens.button-radius'].defaultValue).toEqual(['3px', '3px', '3px', '3px']);
		expect(byPath['tokens.button-border'].defaultValue).toEqual(['1px', '1px', '1px', '1px']);
		expect(byPath['tokens.button-border'].defaultColor).toBe('#123456');
		expect(byPath['tokens.button-padding'].defaultValue).toEqual(['0.5em', '1.2em', '0.5em', '1.2em']);
		expect(byPath['tokens.button-shadow'].defaultValue).toEqual({
			color: '#3633e1',
			offsetX: '0px',
			offsetY: '2px',
			blur: '4px',
			spread: '0px',
			inset: false,
		});
	});

	/**
	 * A property the theme sets nothing for keeps the block's own default, and a row that is not
	 * readable keeps every one of them.
	 *
	 * @return {void}
	 */
	it('keeps the block defaults where the theme sets nothing', () => {
		const themed = BUTTON_PRESET.schemaFor('normal', { tokens: {} }, FEED, rowsBySlug()['theme-base'])
			.panels.flatMap((panel) => panel.fields)
			.find((field) => field.path === 'tokens.button-margin');
		const plain = BUTTON_PRESET.schemaFor('normal', { tokens: {} }, FEED, rowsBySlug().default).panels.find(
			(panel) => panel.id === 'color'
		).fields;

		expect(themed.defaultValue).toEqual(['0', '0', '0', '0']);
		expect(plain.map((field) => field.defaultValue)).toEqual([
			'semantic.color.button-text',
			'semantic.color.button-bg',
		]);
	});

	/**
	 * The hover tab reads the theme's hover pair, not its resting pair.
	 *
	 * @return {void}
	 */
	it('uses the theme hover colors on the hover tab', () => {
		const row = { ...rowsBySlug()['theme-base'], themeValues: { 'button-bg-hover': '#000000' } };
		const fields = BUTTON_PRESET.schemaFor('hover', { tokens: {} }, FEED, row).panels.find(
			(panel) => panel.id === 'color'
		).fields;

		expect(fields.map((field) => [field.path, field.defaultValue])).toEqual([
			['tokens.button-text-hover', 'semantic.color.button-text-hover'],
			['tokens.button-bg-hover', '#000000'],
		]);
	});
});

describe('themeFieldDefault', () => {
	/**
	 * Nothing set is nothing to show, so the field keeps the block's own default.
	 *
	 * @return {void}
	 */
	it('yields undefined for an unset value', () => {
		expect(themeFieldDefault(undefined, FEED.values)).toBeUndefined();
		expect(themeFieldDefault('', FEED.values)).toBeUndefined();
	});

	/**
	 * An alias resolves to the literal the library renders; a literal passes through.
	 *
	 * @return {void}
	 */
	it('resolves an alias and passes a literal through', () => {
		expect(themeFieldDefault('{semantic.color.button-bg}', FEED.values)).toBe('#3633e1');
		expect(themeFieldDefault('4px', FEED.values)).toBe('4px');
	});

	/**
	 * A responsive envelope becomes a function of the breakpoint, stepping down the cascade the way
	 * the page does.
	 *
	 * @return {void}
	 */
	it('turns a responsive envelope into a breakpoint function', () => {
		const envelope = {
			$value: ['1em', '2em', '1em', '2em'],
			$extensions: { 'com.kadence.designTokens': { responsive: { tablet: ['0.5em', '1em', '0.5em', '1em'] } } },
		};
		const byBreakpoint = themeFieldDefault(envelope, FEED.values);

		expect(typeof byBreakpoint).toBe('function');
		expect(byBreakpoint('desktop')).toEqual(['1em', '2em', '1em', '2em']);
		expect(byBreakpoint('tablet')).toEqual(['0.5em', '1em', '0.5em', '1em']);
		expect(byBreakpoint('mobile')).toEqual(['0.5em', '1em', '0.5em', '1em']);
	});
});
