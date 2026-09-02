/* eslint-env jest */
/**
 * The Row Layout preset config — the one per-block file a preset screen needs. Everything else the
 * screen uses (`PresetScreen`, `PresetSidebar`, `usePresetScreen`, `helpers/presets`) is generic and
 * covered by its own suites, so this asserts only what this config contributes: the bound surface it
 * reads, the preview it resolves, its schema, and that it registers on the public screens filter.
 */
import { applyFilters } from '@wordpress/hooks';
import { ROWLAYOUT_PRESET, ROWLAYOUT_BLOCK } from '../presets/rowlayout-preset';
import { PRESET_SCREENS_FILTER } from '../constants/screens';
import { FIELD_TYPES, RESPONSIVE_CAPABLE_FIELD_TYPES } from '../constants/field-types';

// The screen module is imported only to trigger its module-scope `addFilter`. Its two children pull in
// the REST client (and so `@wordpress/api-fetch`, absent from this environment), which the registration
// contract does not depend on — the generic panel and sidebar have their own suites.
jest.mock('../components/pages/PresetScreen', () => ({ PresetScreen: () => null }));
jest.mock('../components/pages/RowLayoutSettings', () => ({ RowLayoutSettings: () => null }));

describe('ROWLAYOUT_PRESET', () => {
	afterEach(() => {
		delete window.kadenceDesignTokens;
	});

	/**
	 * The config names the Row Layout block itself, which owns the background and radius attributes.
	 *
	 * @return {void}
	 */
	it('targets the rowlayout block', () => {
		expect(ROWLAYOUT_PRESET.block).toBe('kadence/rowlayout');
		expect(ROWLAYOUT_BLOCK).toBe('kadence/rowlayout');
	});

	/**
	 * `properties` is a live getter over the feed, not a snapshot, so the screen can never offer a
	 * property the server's write guard would reject.
	 *
	 * @return {void}
	 */
	it('reads its bound surface live from the feed', () => {
		window.kadenceDesignTokens = {
			presets: { 'kadence/rowlayout': { properties: ['background', 'borderRadius'] } },
		};

		expect(ROWLAYOUT_PRESET.properties).toEqual(['background', 'borderRadius']);
	});

	/**
	 * The preview resolves both bound properties through the feed's value map, aliases included.
	 *
	 * @return {void}
	 */
	it('resolves the preview background and radius from stored aliases', () => {
		const values = {
			'semantic.color.rowlayout-bg': 'transparent',
			'semantic.radius.rowlayout': '0',
		};
		const tokens = {
			background: '{semantic.color.rowlayout-bg}',
			borderRadius: '{semantic.radius.rowlayout}',
		};

		expect(ROWLAYOUT_PRESET.preview(tokens, values)).toEqual({
			background: 'transparent',
			borderRadius: '0',
		});
	});

	/**
	 * A dangling alias previews as empty rather than as the raw alias text, so `renderPreview` can fall
	 * back to the row's own built-in look.
	 *
	 * @return {void}
	 */
	it('previews a dangling alias as empty', () => {
		expect(ROWLAYOUT_PRESET.preview({ background: '{semantic.color.gone}', borderRadius: '' }, {})).toEqual({
			background: '',
			borderRadius: '',
		});
	});

	/**
	 * The slab is two nested elements so the preset's background can sit above the transparency checker
	 * — a single element cannot layer them in that order. The frame carries the radius, the fill carries
	 * the background.
	 *
	 * @return {void}
	 */
	it('renders the background on a fill nested inside the framed slab', () => {
		const frame = ROWLAYOUT_PRESET.renderPreview({
			id: 'muted',
			label: 'Muted',
			preview: { background: '#F7FAFC', borderRadius: '0.5rem' },
		});
		const fill = frame.props.children;

		expect(frame.props.className).toBe('kadence-blocks-style-library__rowlayout-preset-preview');
		expect(frame.props.style.borderRadius).toBe('0.5rem');
		// The frame's edge is the stylesheet's neutral hairline; a preset holds no border color.
		expect(frame.props.style.borderColor).toBeUndefined();
		// The frame must not paint the background itself, or it would cover its own checker.
		expect(frame.props.style.background).toBeUndefined();

		expect(fill.props.className).toBe('kadence-blocks-style-library__rowlayout-preset-preview-fill');
		expect(fill.props.style.background).toBe('#F7FAFC');
	});

	/**
	 * An unresolved value is left absent rather than invented, so the stylesheet's own square-cornered,
	 * checkered slab shows through and the row still reads as a discrete shape in the list.
	 *
	 * @return {void}
	 */
	it('leaves unresolved values absent rather than inventing them', () => {
		const frame = ROWLAYOUT_PRESET.renderPreview({
			id: 'bare',
			label: 'Bare',
			preview: { background: '', borderRadius: '' },
		});

		expect(frame.props.style.borderRadius).toBeUndefined();
		expect(frame.props.children.props.style.background).toBeUndefined();
	});

	/**
	 * The row binds no hover property, so it declares no tabs and `PresetSidebar` renders the field area
	 * bare.
	 *
	 * @return {void}
	 */
	it('declares no state tabs', () => {
		expect(ROWLAYOUT_PRESET.tabs).toBeUndefined();
	});

	/**
	 * The schema edits exactly the bound surface and nothing beyond it: a token-color field for the
	 * background and a radius picker narrowed to the radius scale, both writing token ids rather than
	 * literals. No border-color field — the row's border output takes `render_border_styles()`'s
	 * shorthand path, which no block-default `border-color` rule can reach, so the field would save a
	 * value that changes nothing on the page.
	 *
	 * @return {void}
	 */
	it('builds panels covering every bound property and nothing more', () => {
		const { panels } = ROWLAYOUT_PRESET.schemaFor();

		const paths = panels.flatMap((panel) => panel.fields.map((field) => field.path));
		const types = panels.flatMap((panel) => panel.fields.map((field) => field.type));

		expect(paths).toEqual(['tokens.background', 'tokens.borderRadius']);
		expect(types).toEqual(['token-color-select', 'radius']);

		// Every type the schema names must be one the registry can render.
		types.forEach((type) => expect(FIELD_TYPES).toHaveProperty(type));

		const radius = panels[1].fields[0];

		expect(radius.tokenType).toBe('dimension');
		expect(radius.role).toBe('radius');
	});

	/**
	 * The block's own radius control is per-device (`tabletBorderRadius`/`mobileBorderRadius`, both
	 * declared on the binding), so the preset field has to be too — otherwise a preset could not
	 * reproduce a look a site owner had already built with that control.
	 *
	 * @return {void}
	 */
	it('makes the radius field responsive, and of a type that can be', () => {
		const radius = ROWLAYOUT_PRESET.schemaFor().panels[1].fields[0];

		expect(radius.responsive).toBe(true);
		expect(RESPONSIVE_CAPABLE_FIELD_TYPES).toContain(radius.type);
	});

	/**
	 * Background is a single non-responsive picker: the row's background attribute has no per-device
	 * counterpart, and `token-color-select` carries no breakpoint switcher to drive one, so marking it
	 * responsive would write an override its own UI could never read back.
	 *
	 * @return {void}
	 */
	it('leaves the color field non-responsive', () => {
		ROWLAYOUT_PRESET.schemaFor().panels[0].fields.forEach((field) => {
			expect(field.responsive).toBeUndefined();
			expect(RESPONSIVE_CAPABLE_FIELD_TYPES).not.toContain(field.type);
		});
	});
});

describe('RowLayoutScreen registration', () => {
	/**
	 * The app never imports the screen component directly — importing the module is what registers it
	 * on the public filter, exactly as a third-party screen would register itself.
	 *
	 * @return {void}
	 */
	it('registers itself on the preset-screens filter with a settings panel', () => {
		require('../components/pages/RowLayoutScreen');

		const screens = applyFilters(PRESET_SCREENS_FILTER, {});

		expect(screens[ROWLAYOUT_BLOCK]).toBeDefined();
		expect(screens[ROWLAYOUT_BLOCK].SettingsPanel).toBeDefined();
	});
});
