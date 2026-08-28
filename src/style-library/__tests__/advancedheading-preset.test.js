/* eslint-env jest */
/**
 * The Advanced Text preset config — the one per-block file a preset screen needs. Everything else the
 * screen uses (`PresetScreen`, `PresetSidebar`, `usePresetScreen`, `helpers/presets`) is generic and
 * covered by its own suites, so this asserts only what this config contributes: the bound surface it
 * reads, the preview it resolves, its schema, and that it registers on the public screens filter.
 */
import { applyFilters } from '@wordpress/hooks';
import { HEADING_PRESET, HEADING_BLOCK } from '../presets/advancedheading-preset';
import { PRESET_SCREENS_FILTER } from '../constants/screens';
import { FIELD_TYPES, RESPONSIVE_CAPABLE_FIELD_TYPES } from '../constants/field-types';

// The screen module is imported only to trigger its module-scope `addFilter`. Its two children pull in
// the REST client (and so `@wordpress/api-fetch`, absent from this environment), which the registration
// contract does not depend on — the generic panel and sidebar have their own suites.
jest.mock('../components/pages/PresetScreen', () => ({ PresetScreen: () => null }));
jest.mock('../components/pages/HeadingSettings', () => ({ HeadingSettings: () => null }));

/**
 * Every field the schema declares, flattened across its panels.
 *
 * @since TBD
 *
 * @return {Array<Object>} The fields.
 */
function fields() {
	return HEADING_PRESET.schemaFor().panels.flatMap((panel) => panel.fields);
}

describe('HEADING_PRESET', () => {
	afterEach(() => {
		delete window.kadenceDesignTokens;
	});

	/**
	 * The config names the block by its code name. Advanced Text is the UI name and appears only in
	 * labels, so the two must not be confused when wiring the screen to the feed.
	 *
	 * @return {void}
	 */
	it('targets the advancedheading block by its code name', () => {
		expect(HEADING_PRESET.block).toBe('kadence/advancedheading');
		expect(HEADING_BLOCK).toBe('kadence/advancedheading');
	});

	/**
	 * `properties` is a live getter over the feed, not a snapshot, so the screen can never offer a
	 * property the server's write guard would reject.
	 *
	 * @return {void}
	 */
	it('reads its bound surface live from the feed', () => {
		window.kadenceDesignTokens = {
			presets: { 'kadence/advancedheading': { properties: ['color', 'fontSize'] } },
		};

		expect(HEADING_PRESET.properties).toEqual(['color', 'fontSize']);
	});

	/**
	 * The preview resolves every property the chip can show through the feed's value map.
	 *
	 * @return {void}
	 */
	it('resolves the previewed properties from stored aliases', () => {
		const values = {
			'semantic.color.text': '#1A202C',
			'semantic.color.heading-bg': 'transparent',
			'semantic.font-family.heading': 'inherit',
			'semantic.font-size.heading': '2rem',
			'semantic.color.border': '#E2E8F0',
			'semantic.border-width.default': '1px',
			'semantic.border-style.default': 'none',
			'semantic.radius.heading': '0',
		};
		const tokens = {
			color: '{semantic.color.text}',
			background: '{semantic.color.heading-bg}',
			typography: '{semantic.font-family.heading}',
			fontSize: '{semantic.font-size.heading}',
			borderColor: '{semantic.color.border}',
			borderWidth: '{semantic.border-width.default}',
			borderStyle: '{semantic.border-style.default}',
			borderRadius: '{semantic.radius.heading}',
		};

		expect(HEADING_PRESET.preview(tokens, values)).toMatchObject({
			color: '#1A202C',
			background: 'transparent',
			typography: 'inherit',
			fontSize: '2rem',
			borderColor: '#E2E8F0',
			borderWidth: '1px',
			borderStyle: 'none',
			borderRadius: '0',
		});
	});

	/**
	 * A keyword property is stored as a literal, having no token to alias, and previews as itself.
	 *
	 * @return {void}
	 */
	it('previews a keyword property stored as a literal', () => {
		expect(HEADING_PRESET.preview({ fontWeight: '700', textTransform: 'uppercase' }, {})).toMatchObject({
			fontWeight: '700',
			textTransform: 'uppercase',
		});
	});

	/**
	 * The chip states the preset's type and frame. Font SIZE is deliberately not applied: the scale
	 * reaches 4rem and a row set at true size would dwarf its neighbors, so the sidebar names it instead.
	 *
	 * @return {void}
	 */
	it('renders a chip carrying the type and frame but not the font size', () => {
		const chip = HEADING_PRESET.renderPreview({
			id: 'title',
			label: 'Title',
			preview: {
				color: '#1A202C',
				background: '#F7FAFC',
				typography: 'Georgia',
				fontSize: '4rem',
				fontWeight: '700',
				textTransform: 'uppercase',
				borderColor: '#E2E8F0',
				borderWidth: '1px',
				borderStyle: 'solid',
				borderRadius: '0.5rem',
			},
		});

		expect(chip.props.className).toBe('kadence-blocks-style-library__heading-preset-preview');
		expect(chip.props.style).toMatchObject({
			color: '#1A202C',
			background: '#F7FAFC',
			fontFamily: 'Georgia',
			fontWeight: '700',
			textTransform: 'uppercase',
			borderColor: '#E2E8F0',
			borderWidth: '1px',
			borderStyle: 'solid',
			borderRadius: '0.5rem',
		});
		expect(chip.props.style.fontSize).toBeUndefined();
	});

	/**
	 * A border needs all three of style, width and color before it renders, so an unresolved style leaves
	 * the chip without a frame rather than inventing an edge the page would not have.
	 *
	 * @return {void}
	 */
	it('leaves the chip without a frame when the preset resolves no border style', () => {
		const chip = HEADING_PRESET.renderPreview({
			id: 'bare',
			label: 'Bare',
			preview: { borderColor: '#E2E8F0', borderWidth: '1px', borderStyle: '' },
		});

		expect(chip.props.style.borderStyle).toBeUndefined();
	});

	/**
	 * The heading binds no hover property, so it declares no tabs and `PresetSidebar` renders the field
	 * area bare.
	 *
	 * @return {void}
	 */
	it('declares no state tabs', () => {
		expect(HEADING_PRESET.tabs).toBeUndefined();
	});

	/**
	 * Eleven of the block's thirteen bound properties are offered. `fontHeight` and `letterSpacing` are
	 * bound but withheld: neither has a token scale, and unlike the keyword properties they are open
	 * numeric ranges, so the only control that would fit is a bare number.
	 *
	 * @return {void}
	 */
	it('offers every bound property that has a control to offer it through', () => {
		expect(fields().map((field) => field.path)).toEqual([
			'tokens.color',
			'tokens.background',
			'tokens.typography',
			'tokens.fontSize',
			'tokens.fontWeight',
			'tokens.textTransform',
			'tokens.borderStyle',
			'tokens.borderWidth',
			'tokens.borderColor',
			'tokens.borderRadius',
			'tokens.padding',
		]);
	});

	/**
	 * Every type the schema names must be one the field registry knows how to render.
	 *
	 * @return {void}
	 */
	it('names only field types the registry can render', () => {
		fields().forEach((field) => expect(FIELD_TYPES).toHaveProperty(field.type));
	});

	/**
	 * A property is a token picker when the design system has a scale for it and a keyword select when it
	 * does not. `border-style`, `text-transform` and `font-weight` have no primitive layer — their
	 * semantic groups hold one entry per usage, not a set of choices — so a picker would show an empty
	 * list.
	 *
	 * @return {void}
	 */
	it('offers a keyword select exactly where there is no token scale to pick from', () => {
		const byPath = Object.fromEntries(fields().map((field) => [field.path, field]));

		['tokens.fontWeight', 'tokens.textTransform', 'tokens.borderStyle'].forEach((path) => {
			expect(byPath[path].type).toBe('select');
			expect(byPath[path].options.length).toBeGreaterThan(1);
		});

		expect(byPath['tokens.typography'].type).toBe('token-select');
		expect(byPath['tokens.fontSize'].type).toBe('token-scalar');
		expect(byPath['tokens.borderWidth'].type).toBe('token-scalar');
	});

	/**
	 * Border style is the field that decides whether a border appears at all. Offering color and width
	 * without it is the dead control the Row Layout and Section screens had to drop, so its presence is
	 * asserted on its own rather than left implied by the field list.
	 *
	 * @return {void}
	 */
	it('offers a border style, without which a preset border could never be seen', () => {
		const style = fields().find((field) => field.path === 'tokens.borderStyle');

		expect(style).toBeDefined();
		expect(style.options.map((option) => option.value)).toEqual(
			expect.arrayContaining(['solid', 'dashed', 'dotted', 'double'])
		);
	});

	/**
	 * Only the properties whose block controls are per-device are responsive, and each is of a type that
	 * may be. `fontSize` is included even though its binding declares no `responsive_attrs`: that gap is
	 * about the editor addressing a packed device slot, while a preset's own per-breakpoint override is
	 * carried by the responsive envelope and projected as a media query.
	 *
	 * @return {void}
	 */
	it('marks the per-device fields responsive and no others', () => {
		const responsive = fields().filter((field) => field.responsive);

		expect(responsive.map((field) => field.path)).toEqual([
			'tokens.fontSize',
			'tokens.borderRadius',
			'tokens.padding',
		]);
		responsive.forEach((field) => expect(RESPONSIVE_CAPABLE_FIELD_TYPES).toContain(field.type));
	});
});

describe('HeadingScreen registration', () => {
	/**
	 * The app never imports the screen component directly — importing the module is what registers it
	 * on the public filter, exactly as a third-party screen would register itself.
	 *
	 * @return {void}
	 */
	it('registers itself on the preset-screens filter with a settings panel', () => {
		require('../components/pages/HeadingScreen');

		const screens = applyFilters(PRESET_SCREENS_FILTER, {});

		expect(screens[HEADING_BLOCK]).toBeDefined();
		expect(screens[HEADING_BLOCK].SettingsPanel).toBeDefined();
	});
});
