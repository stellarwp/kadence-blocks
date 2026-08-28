/* eslint-env jest */
// cspell:ignore Abril Fatface -- a Google font family named as a concrete example.
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
			'semantic.font-size.heading': '2rem',
			'semantic.color.border': '#E2E8F0',
			'semantic.border-width.default': '1px',
			'semantic.border-style.default': 'none',
			'semantic.radius.heading': '0',
		};
		const tokens = {
			color: '{semantic.color.text}',
			background: '{semantic.color.heading-bg}',
			fontSize: '{semantic.font-size.heading}',
			borderColor: '{semantic.color.border}',
			borderWidth: '{semantic.border-width.default}',
			borderStyle: '{semantic.border-style.default}',
			borderRadius: '{semantic.radius.heading}',
		};

		expect(HEADING_PRESET.preview(tokens, values)).toMatchObject({
			color: '#1A202C',
			background: 'transparent',
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
				fontSize: '6rem',
				fontWeight: '700',
				textTransform: 'uppercase',
				borderColor: '#E2E8F0',
				borderStyle: 'solid',
				borderRadius: '0.5rem',
				padding: '3rem',
				borderWidth: '1px',
			},
		});

		expect(chip.props.className).toBe('kadence-blocks-style-library__heading-preset-preview');
		expect(chip.props.style).toMatchObject({
			color: '#1A202C',
			background: '#F7FAFC',
			fontWeight: '700',
			textTransform: 'uppercase',
			borderColor: '#E2E8F0',
			borderStyle: 'solid',
			borderRadius: '0.5rem',
		});
		expect(chip.props.style.fontSize).toBeUndefined();

		// Padding and border width are re-expressed against the preset's own font size, so the chip keeps
		// the preset's proportions at whatever size the row can afford. 3rem against a 6rem size is 0.5em.
		expect(chip.props.style.padding).toBe('0.5em');
		expect(chip.props.style.borderWidth).toBe('0.0104em');
	});

	/**
	 * With no font size to measure against, padding and border width pass through at true size rather
	 * than being dropped or guessed at.
	 *
	 * @return {void}
	 */
	it('leaves padding at true size when the preset sets no font size', () => {
		const chip = HEADING_PRESET.renderPreview({
			id: 'plain',
			label: 'Plain',
			preview: { padding: '3rem', borderWidth: '1px', fontSize: '' },
		});

		expect(chip.props.style.padding).toBe('3rem');
		expect(chip.props.style.borderWidth).toBe('1px');
	});

	/**
	 * A per-corner padding shorthand scales each side on its own, since each is its own length.
	 *
	 * @return {void}
	 */
	it('scales every side of a padding shorthand against the font size', () => {
		const chip = HEADING_PRESET.renderPreview({
			id: 'corners',
			label: 'Corners',
			preview: { padding: '1rem 2rem 1rem 2rem', fontSize: '2rem' },
		});

		expect(chip.props.style.padding).toBe('0.5em 1em 0.5em 1em');
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

		// Font family is not a keyword set at all: it uses the same tabbed picker the block editor
		// mounts, which builds its own list from the library's favorites and the font catalog.
		expect(byPath['tokens.typography'].type).toBe('font-family');
		expect(byPath['tokens.typography'].options).toBeUndefined();

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

describe('HEADING_PRESET font family and weight', () => {
	afterEach(() => {
		delete window.kadenceDesignTokens;
		delete window.kadenceDesignTokensFontCatalog;
	});

	/**
	 * Stub the library's favorites and the font catalog the weights come from.
	 *
	 * @param {string[]}                 favorites The library's favorite families.
	 * @param {Record<string, string[]>} weights   The catalog's per-family weights.
	 *
	 * @since TBD
	 *
	 * @return {void}
	 */
	function stubFonts(favorites, weights) {
		window.kadenceDesignTokens = { favoriteFonts: favorites };
		window.kadenceDesignTokensFontCatalog = { google: Object.keys(weights), custom: [], weights };
	}

	/**
	 * The family field is the tabbed picker, and it names what an unset family falls back to rather than
	 * reading as empty -- a heading with no family of its own still renders in the theme's face.
	 *
	 * @return {void}
	 */
	it('uses the tabbed font picker and names the fallback face', () => {
		stubFonts(['Inter', 'Abril Fatface'], {});

		const family = fields().find((field) => field.path === 'tokens.typography');

		expect(family.type).toBe('font-family');
		expect(family.inherited).toBe('Theme Font');
	});

	/**
	 * The favorites come from the LIVE feed the caller passes, not from the page-load global. Adding a
	 * favorite on the Typography screen refreshes the feed and leaves the global untouched, so reading
	 * the global would leave the new face unselectable here until a reload.
	 *
	 * @return {void}
	 */
	it('builds its favorites from the feed it is given, not the page-load global', () => {
		// The global carries the pre-refresh list; the live feed carries the face just added.
		stubFonts(['Inter'], {});

		const family = HEADING_PRESET.schemaFor(undefined, {}, { favoriteFonts: ['Inter', 'Abril Fatface'] })
			.panels.flatMap((panel) => panel.fields)
			.find((field) => field.path === 'tokens.typography');

		expect(family.favorites).toEqual(['Inter', 'Abril Fatface']);
	});

	/**
	 * Weight narrows to the weights the chosen family actually ships. Abril Fatface ships only 400, and a
	 * flat 100-900 list would offer eight faces it does not have -- the browser answers a missing one
	 * with a synthesized approximation rather than the real face.
	 *
	 * @return {void}
	 */
	it('narrows the weight list to the weights the chosen family ships', () => {
		stubFonts(['Abril Fatface'], { 'Abril Fatface': ['400'] });

		const weight = HEADING_PRESET.schemaFor(undefined, { tokens: { typography: 'Abril Fatface' } })
			.panels.flatMap((panel) => panel.fields)
			.find((field) => field.path === 'tokens.fontWeight');

		expect(weight.options.map((option) => option.value)).toEqual(['', '400']);
	});

	/**
	 * A family the catalog does know is narrowed to exactly its own weights, in weight order.
	 *
	 * @return {void}
	 */
	it('offers every weight a rich family ships', () => {
		stubFonts(['Inter'], { Inter: ['100', '400', '700', '900'] });

		const weight = HEADING_PRESET.schemaFor(undefined, { tokens: { typography: 'Inter' } })
			.panels.flatMap((panel) => panel.fields)
			.find((field) => field.path === 'tokens.fontWeight');

		expect(weight.options.map((option) => option.value)).toEqual(['', '100', '400', '700', '900']);
	});

	/**
	 * With no family chosen the heading inherits the theme's font, which could be anything, and a custom
	 * font carries no weight data at all. Both offer the full set rather than guessing at a narrower one.
	 *
	 * @return {void}
	 */
	it('offers every weight when the family is unknown or unset', () => {
		stubFonts(['Inter'], { Inter: ['400'] });

		const weightsFor = (typography) =>
			HEADING_PRESET.schemaFor(undefined, { tokens: { typography } })
				.panels.flatMap((panel) => panel.fields)
				.find((field) => field.path === 'tokens.fontWeight')
				.options.map((option) => option.value);

		expect(weightsFor('')).toEqual(['', '100', '200', '300', '400', '500', '600', '700', '800', '900']);
		expect(weightsFor('Some Custom Face')).toEqual([
			'',
			'100',
			'200',
			'300',
			'400',
			'500',
			'600',
			'700',
			'800',
			'900',
		]);
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
