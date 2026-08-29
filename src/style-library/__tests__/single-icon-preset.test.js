/* eslint-env jest */
/**
 * The Single Icon preset config — the one per-block file a preset screen needs. Everything else the
 * screen uses (`PresetScreen`, `PresetSidebar`, `usePresetScreen`, `helpers/presets`) is generic and
 * covered by its own suites, so this asserts only what this config contributes: the bound surface it
 * reads, the preview it resolves, its schema, and that it registers on the public screens filter.
 */
import { applyFilters } from '@wordpress/hooks';
import { SINGLE_ICON_PRESET, SINGLE_ICON_BLOCK } from '../presets/single-icon-preset';
import { PRESET_SCREENS_FILTER } from '../constants/screens';
import { FIELD_TYPES, RESPONSIVE_CAPABLE_FIELD_TYPES } from '../constants/field-types';

// The screen module is imported only to trigger its module-scope `addFilter`. Its two children pull in
// the REST client (and so `@wordpress/api-fetch`, absent from this environment), which the registration
// contract does not depend on — the generic panel and sidebar have their own suites.
jest.mock('../components/pages/PresetScreen', () => ({ PresetScreen: () => null }));
jest.mock('../components/pages/SingleIconSettings', () => ({ SingleIconSettings: () => null }));

describe('SINGLE_ICON_PRESET', () => {
	afterEach(() => {
		delete window.kadenceDesignTokens;
	});

	/**
	 * The config names the child Single Icon block, which owns the color/size attributes — not the
	 * legacy `kadence/icon` container.
	 *
	 * @return {void}
	 */
	it('targets the single-icon child block', () => {
		expect(SINGLE_ICON_PRESET.block).toBe('kadence/single-icon');
		expect(SINGLE_ICON_BLOCK).toBe('kadence/single-icon');
	});

	/**
	 * `properties` is a live getter over the feed, not a snapshot, so the screen can never offer a
	 * property the server's write guard would reject.
	 *
	 * @return {void}
	 */
	it('reads its bound surface live from the feed', () => {
		window.kadenceDesignTokens = {
			presets: { 'kadence/single-icon': { properties: ['color', 'size'] } },
		};

		expect(SINGLE_ICON_PRESET.properties).toEqual(['color', 'size']);
	});

	/**
	 * The preview resolves both bound properties through the feed's value map, aliases included.
	 *
	 * @return {void}
	 */
	it('resolves the preview color and size from stored aliases', () => {
		const values = {
			'semantic.color.icon': '#3182CE',
			'semantic.icon-size.default': '1.5rem',
		};
		const tokens = {
			color: '{semantic.color.icon}',
			size: '{semantic.icon-size.default}',
		};

		expect(SINGLE_ICON_PRESET.preview(tokens, values)).toEqual({
			color: '#3182CE',
			size: '1.5rem',
		});
	});

	/**
	 * A dangling alias previews as empty rather than as the raw alias text, so `renderPreview` can fall
	 * back to the icon's own built-in look.
	 *
	 * @return {void}
	 */
	it('previews a dangling alias as empty', () => {
		expect(SINGLE_ICON_PRESET.preview({ color: '{semantic.color.gone}', size: '' }, {})).toEqual({
			color: '',
			size: '',
		});
	});

	/**
	 * The icon binds no hover property, so it declares no tabs and `PresetSidebar` renders the field
	 * area bare.
	 *
	 * @return {void}
	 */
	it('declares no state tabs', () => {
		expect(SINGLE_ICON_PRESET.tabs).toBeUndefined();
	});

	/**
	 * The schema edits exactly the bound surface: a token-color field for the color and a token picker
	 * narrowed to the icon-size scale for the size, both writing token ids rather than literals.
	 *
	 * @return {void}
	 */
	it('builds one panel covering both bound properties', () => {
		const { panels } = SINGLE_ICON_PRESET.schemaFor();

		expect(panels).toHaveLength(1);

		const paths = panels[0].fields.map((field) => field.path);
		const types = panels[0].fields.map((field) => field.type);

		expect(paths).toEqual(['tokens.color', 'tokens.size']);
		expect(types).toEqual(['token-color-select', 'token-scalar']);

		// Every type the schema names must be one the registry can render.
		types.forEach((type) => expect(FIELD_TYPES).toHaveProperty(type));

		const size = panels[0].fields[1];

		expect(size.tokenType).toBe('dimension');
		expect(size.role).toBe('icon-size');
	});

	/**
	 * The block's own size control is per-device (`size`/`tabletSize`/`mobileSize`, all three declared on
	 * the binding), so the preset field has to be too — otherwise a preset could not reproduce a look a
	 * site owner had already built with that control.
	 *
	 * @return {void}
	 */
	it('makes the size field responsive, and of a type that can be', () => {
		const size = SINGLE_ICON_PRESET.schemaFor().panels[0].fields[1];

		expect(size.responsive).toBe(true);
		expect(RESPONSIVE_CAPABLE_FIELD_TYPES).toContain(size.type);
	});
});

describe('SingleIconScreen registration', () => {
	/**
	 * The app never imports the screen component directly — importing the module is what registers it
	 * on the public filter, exactly as a third-party screen would register itself.
	 *
	 * @return {void}
	 */
	it('registers itself on the preset-screens filter with a settings panel', () => {
		require('../components/pages/SingleIconScreen');

		const screens = applyFilters(PRESET_SCREENS_FILTER, {});

		expect(screens[SINGLE_ICON_BLOCK]).toBeDefined();
		expect(screens[SINGLE_ICON_BLOCK].SettingsPanel).toBeDefined();
	});
});
