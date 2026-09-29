/* eslint-env jest */
/**
 * The Section (`kadence/column`) preset config — the one per-block file a preset screen needs.
 * Everything else the screen uses (`PresetScreen`, `PresetSettings`, `usePresetScreen`,
 * `helpers/presets`) is generic and covered by its own suites, so this asserts only what this config
 * contributes: the bound surface it reads, the preview it resolves, its schema, and that it registers
 * on the public screens filter.
 */
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { applyFilters } from '@wordpress/hooks';
import { COLUMN_PRESET, COLUMN_BLOCK } from '../presets/column-preset';
import { PRESET_SCREENS_FILTER } from '../constants/screens';
import { FIELD_TYPES, RESPONSIVE_CAPABLE_FIELD_TYPES } from '../constants/field-types';

// The screen module is imported only to trigger its module-scope `addFilter`. Its two children pull in
// the REST client (and so `@wordpress/api-fetch`, absent from this environment), which the registration
// contract does not depend on — the generic panel and sidebar have their own suites.
jest.mock('../components/pages/PresetScreen', () => ({ PresetScreen: () => null }));
jest.mock('../components/pages/ColumnSettings', () => ({ ColumnSettings: () => null }));

describe('COLUMN_PRESET', () => {
	afterEach(() => {
		delete window.kadenceDesignTokens;
	});

	/**
	 * The config names the block by its code name. Section is the UI name and appears only in labels,
	 * so the two must not be confused when wiring the screen to the feed.
	 *
	 * @return {void}
	 */
	it('targets the column block by its code name', () => {
		expect(COLUMN_PRESET.block).toBe('kadence/column');
		expect(COLUMN_BLOCK).toBe('kadence/column');
	});

	/**
	 * `properties` is a live getter over the feed, not a snapshot, so the screen can never offer a
	 * property the server's write guard would reject.
	 *
	 * @return {void}
	 */
	it('reads its bound surface live from the feed', () => {
		window.kadenceDesignTokens = {
			presets: { 'kadence/column': { properties: ['background', 'borderRadius'] } },
		};

		expect(COLUMN_PRESET.properties).toEqual(['background', 'borderRadius']);
	});

	/**
	 * The preview resolves every bound property through the feed's value map, aliases included, the
	 * hover twins nested under `hover`.
	 *
	 * @return {void}
	 */
	it('resolves the preview background and radius from stored aliases', () => {
		const values = {
			'semantic.color.column-bg': 'transparent',
			'semantic.radius.column': '0',
			'semantic.color.column-bg-hover': '#eeeeee',
			'semantic.radius.column-hover': '0.25rem',
		};
		const tokens = {
			background: '{semantic.color.column-bg}',
			borderRadius: '{semantic.radius.column}',
			backgroundHover: '{semantic.color.column-bg-hover}',
			borderHoverRadius: '{semantic.radius.column-hover}',
		};

		expect(COLUMN_PRESET.preview(tokens, values)).toEqual({
			background: 'transparent',
			borderRadius: '0',
			hover: { background: '#eeeeee', borderRadius: '0.25rem' },
		});
	});

	/**
	 * A dangling alias previews as empty rather than as the raw alias text, so `renderPreview` can fall
	 * back to the section's own built-in look.
	 *
	 * @return {void}
	 */
	it('previews a dangling alias as empty', () => {
		expect(COLUMN_PRESET.preview({ background: '{semantic.color.gone}', borderRadius: '' }, {})).toEqual({
			background: '',
			borderRadius: '',
			hover: { background: '', borderRadius: '' },
		});
	});

	/**
	 * The section binds a hover background and a hover radius, so the panel offers a Hover tab. The
	 * tab is named `hover` because the screen holds the open row's hover preview on that name.
	 *
	 * @return {void}
	 */
	it('declares the normal and hover state tabs', () => {
		expect(COLUMN_PRESET.tabs.map((tab) => tab.name)).toEqual(['normal', 'hover']);
	});

	/**
	 * The Normal tab edits exactly the resting bound surface: a token-color field for the background
	 * and a radius picker narrowed to the radius scale, both writing token ids rather than literals. No
	 * border-color field — the section's border output takes `render_border_styles()`'s shorthand
	 * path, which no block-default `border-color` rule can reach, so the field would save a value that
	 * changes nothing on the page.
	 *
	 * @return {void}
	 */
	it('builds the Normal tab panels covering every resting bound property and nothing more', () => {
		const { panels } = COLUMN_PRESET.schemaFor('normal', { tokens: {} }, { values: {} });

		const paths = panels.flatMap((panel) => panel.fields.map((field) => field.path));
		const types = panels.flatMap((panel) => panel.fields.map((field) => field.type));

		expect(paths).toEqual(['tokens.background', 'tokens.borderRadius']);
		expect(types).toEqual(['color-select', 'radius']);

		// Every type the schema names must be one the registry can render.
		types.forEach((type) => expect(FIELD_TYPES).toHaveProperty(type));

		const radius = panels[1].fields[0];

		expect(radius.tokenType).toBe('dimension');
		expect(radius.role).toBe('radius');
		expect(radius.defaultValue).toEqual(['0', '0', '0', '0']);
	});

	/**
	 * The Hover tab edits exactly the two hover-bound properties, with the same field types as their
	 * resting twins, so a hover look can be authored the way the resting one is.
	 *
	 * @return {void}
	 */
	it('builds the Hover tab panels covering every hover bound property and nothing more', () => {
		const { panels } = COLUMN_PRESET.schemaFor('hover', { tokens: {} }, { values: {} });

		const paths = panels.flatMap((panel) => panel.fields.map((field) => field.path));
		const types = panels.flatMap((panel) => panel.fields.map((field) => field.type));

		expect(paths).toEqual(['tokens.backgroundHover', 'tokens.borderHoverRadius']);
		expect(types).toEqual(['color-select', 'radius']);
		expect(panels[1].fields[0].responsive).toBe(true);
	});

	/**
	 * A preset with no hover radius keeps its resting corners through hover, so the hover field's
	 * muted default is the resting radius the draft resolves to at the field's active breakpoint,
	 * and square corners only when the draft sets none. It is a function of the breakpoint because
	 * the schema is built before the field knows which breakpoint it is on.
	 *
	 * @return {void}
	 */
	it('defaults the hover radius field to the resolved resting radius at the active breakpoint', () => {
		const feed = { values: { 'primitive.radius.md': '0.5rem' } };
		const responsive = {
			$value: 'primitive.radius.md',
			$extensions: { 'com.kadence.designTokens': { responsive: { tablet: '0' } } },
		};

		const set = COLUMN_PRESET.schemaFor('hover', { tokens: { borderRadius: responsive } }, feed);
		const unset = COLUMN_PRESET.schemaFor('hover', { tokens: { borderRadius: '' } }, feed);

		expect(set.panels[1].fields[0].defaultValue('desktop')).toEqual(['0.5rem', '0.5rem', '0.5rem', '0.5rem']);
		expect(set.panels[1].fields[0].defaultValue('tablet')).toEqual(['0', '0', '0', '0']);
		expect(unset.panels[1].fields[0].defaultValue('desktop')).toEqual(['0', '0', '0', '0']);
	});

	/**
	 * The Background row falls back to the semantic section background the block binds for its tab:
	 * the Default preset's resting token on Normal, the block's hover binding on Hover, so a row that
	 * stores nothing previews the color a fresh section really renders in that state.
	 *
	 * @return {void}
	 */
	it('declares the semantic section background of each tab as the Background default', () => {
		const normal = COLUMN_PRESET.schemaFor('normal', { tokens: {} }, { values: {} }).panels[0].fields[0];
		const hover = COLUMN_PRESET.schemaFor('hover', { tokens: {} }, { values: {} }).panels[0].fields[0];

		expect(normal.path).toBe('tokens.background');
		expect(normal.defaultValue).toBe('semantic.color.column-bg');
		expect(hover.path).toBe('tokens.backgroundHover');
		expect(hover.defaultValue).toBe('semantic.color.column-bg-hover');
	});

	/**
	 * The block's own radius control is per-device (`tabletBorderRadius`/`mobileBorderRadius`, both
	 * declared on the binding), so the preset field has to be too — otherwise a preset could not
	 * reproduce a look a site owner had already built with that control.
	 *
	 * @return {void}
	 */
	it('makes the radius field responsive, and of a type that can be', () => {
		const radius = COLUMN_PRESET.schemaFor('normal', { tokens: {} }, { values: {} }).panels[1].fields[0];

		expect(radius.responsive).toBe(true);
		expect(RESPONSIVE_CAPABLE_FIELD_TYPES).toContain(radius.type);
	});

	/**
	 * Background is a single non-responsive picker: the section's background attribute has no per-device
	 * counterpart, and `color-select` carries no breakpoint switcher to drive one, so marking it
	 * responsive would write an override its own UI could never read back.
	 *
	 * @return {void}
	 */
	it('leaves the color field non-responsive', () => {
		COLUMN_PRESET.schemaFor('normal', { tokens: {} }, { values: {} }).panels[0].fields.forEach((field) => {
			expect(field.responsive).toBeUndefined();
			expect(RESPONSIVE_CAPABLE_FIELD_TYPES).not.toContain(field.type);
		});
	});
});

describe('COLUMN_PRESET.renderPreview', () => {
	let container;
	let root;

	beforeEach(() => {
		global.IS_REACT_ACT_ENVIRONMENT = true;
		container = document.createElement('div');
		document.body.appendChild(container);
		root = createRoot(container);
	});

	afterEach(() => {
		act(() => root.unmount());
		container.remove();
	});

	const preview = {
		background: '#111111',
		borderRadius: '4px',
		hover: { background: '#eeeeee', borderRadius: '' },
	};

	/**
	 * Mount one row preview and return its frame element.
	 *
	 * @param {Object} row The row descriptor.
	 *
	 * @return {HTMLElement} The frame span.
	 */
	function mountFrame(row) {
		act(() => root.render(COLUMN_PRESET.renderPreview(row)));

		return container.querySelector('.kadence-blocks-style-library__column-preset-preview');
	}

	/**
	 * The slab is two nested elements so the preset's background can sit above the transparency checker
	 * — a single element cannot layer them in that order. The frame carries the radius and must not
	 * paint the background itself, or it would cover its own checker; its edge is the stylesheet's
	 * neutral hairline since a preset holds no border color. The fill carries the background.
	 *
	 * @return {void}
	 */
	it('renders the background on a fill nested inside the framed slab', () => {
		const frame = mountFrame({
			id: 'card',
			label: 'Card',
			preview: { background: '#F7FAFC', borderRadius: '0.5rem' },
		});
		const fill = frame.querySelector('.kadence-blocks-style-library__column-preset-preview-fill');

		expect(frame.style.borderRadius).toBe('0.5rem');
		expect(frame.style.borderColor).toBe('');
		expect(frame.style.background).toBe('');
		expect(fill.style.background).toBe('rgb(247, 250, 252)');
	});

	/**
	 * An unresolved value is left absent rather than invented, so the stylesheet's own square-cornered,
	 * checkered slab shows through and the row still reads as a discrete shape in the list.
	 *
	 * @return {void}
	 */
	it('leaves unresolved values absent rather than inventing them', () => {
		const frame = mountFrame({ id: 'bare', label: 'Bare', preview: { background: '', borderRadius: '' } });
		const fill = frame.querySelector('.kadence-blocks-style-library__column-preset-preview-fill');

		expect(frame.getAttribute('style')).toBeFalsy();
		expect(fill.getAttribute('style')).toBeFalsy();
	});

	/**
	 * Under the pointer the fill swaps to the hover background while an unset hover radius keeps the
	 * resting radius; leaving restores the resting background.
	 *
	 * @return {void}
	 */
	it('swaps to hover styles under the pointer and back off it', () => {
		const frame = mountFrame({ id: 'card', label: 'Card', preview });
		const fill = frame.querySelector('.kadence-blocks-style-library__column-preset-preview-fill');

		act(() => {
			frame.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
		});

		expect(fill.style.background).toBe('rgb(238, 238, 238)');
		expect(frame.style.borderRadius).toBe('4px');

		act(() => {
			frame.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));
		});

		expect(fill.style.background).toBe('rgb(17, 17, 17)');
	});

	/**
	 * `showHoverState` holds the hover styles with no pointer involved — the screen sets it for the
	 * row whose panel is on the Hover tab.
	 *
	 * @return {void}
	 */
	it('holds the hover state when the row carries showHoverState', () => {
		const frame = mountFrame({ id: 'card', label: 'Card', preview, showHoverState: true });
		const fill = frame.querySelector('.kadence-blocks-style-library__column-preset-preview-fill');

		expect(fill.style.background).toBe('rgb(238, 238, 238)');
	});
});

describe('ColumnScreen registration', () => {
	/**
	 * The app never imports the screen component directly — importing the module is what registers it
	 * on the public filter, exactly as a third-party screen would register itself.
	 *
	 * @return {void}
	 */
	it('registers itself on the preset-screens filter with a settings panel', () => {
		require('../components/pages/ColumnScreen');

		const screens = applyFilters(PRESET_SCREENS_FILTER, {});

		expect(screens[COLUMN_BLOCK]).toBeDefined();
		expect(screens[COLUMN_BLOCK].SettingsPanel).toBeDefined();
	});
});
