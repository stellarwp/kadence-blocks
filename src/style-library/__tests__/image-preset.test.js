/* eslint-env jest */
/**
 * The Advanced Image preset config — the one per-block file a preset screen needs. Everything else the
 * screen uses (`PresetScreen`, `PresetSidebar`, `usePresetScreen`, `helpers/presets`) is generic and
 * covered by its own suites, so this asserts only what this config contributes: the bound surface it
 * reads, the preview it resolves, its schema, and that it registers on the public screens filter.
 */
import { applyFilters } from '@wordpress/hooks';
import { IMAGE_PRESET, IMAGE_BLOCK } from '../presets/image-preset';
import { PRESET_SCREENS_FILTER } from '../constants/screens';
import { FIELD_TYPES, RESPONSIVE_CAPABLE_FIELD_TYPES } from '../constants/field-types';

// The screen module is imported only to trigger its module-scope `addFilter`. Its two children pull in
// the REST client (and so `@wordpress/api-fetch`, absent from this environment), which the registration
// contract does not depend on — the generic panel and sidebar have their own suites.
jest.mock('../components/pages/PresetScreen', () => ({ PresetScreen: () => null }));
jest.mock('../components/pages/ImageSettings', () => ({ ImageSettings: () => null }));

describe('IMAGE_PRESET', () => {
	afterEach(() => {
		delete window.kadenceDesignTokens;
	});

	/**
	 * The config names the Advanced Image block.
	 *
	 * @return {void}
	 */
	it('targets the image block', () => {
		expect(IMAGE_PRESET.block).toBe('kadence/image');
		expect(IMAGE_BLOCK).toBe('kadence/image');
	});

	/**
	 * `properties` is a live getter over the feed, not a snapshot, so the screen can never offer a
	 * property the server's write guard would reject.
	 *
	 * @return {void}
	 */
	it('reads its bound surface live from the feed', () => {
		window.kadenceDesignTokens = {
			presets: {
				'kadence/image': {
					properties: ['background', 'border', 'borderWidth', 'borderRadius', 'shadow', 'padding'],
				},
			},
		};

		expect(IMAGE_PRESET.properties).toEqual([
			'background',
			'border',
			'borderWidth',
			'borderRadius',
			'shadow',
			'padding',
		]);
	});

	/**
	 * The preview resolves the four previewed properties through the feed's value map, aliases included.
	 *
	 * @return {void}
	 */
	it('resolves the preview background, radius, shadow and padding from stored aliases', () => {
		const values = {
			'semantic.color.image-bg': 'transparent',
			'semantic.radius.media': '0',
			'semantic.shadow.media': '0px 0px 0px 0px transparent',
			'semantic.spacing.media-padding': '0',
		};
		const tokens = {
			background: '{semantic.color.image-bg}',
			borderRadius: '{semantic.radius.media}',
			shadow: '{semantic.shadow.media}',
			padding: '{semantic.spacing.media-padding}',
		};

		expect(IMAGE_PRESET.preview(tokens, values)).toEqual({
			background: 'transparent',
			borderRadius: '0',
			shadow: '0px 0px 0px 0px transparent',
			padding: '0',
		});
	});

	/**
	 * A per-corner padding slot list resolves to the CSS shorthand, so the preview insets the photo by
	 * the same four values the front end applies.
	 *
	 * @return {void}
	 */
	it('resolves a per-corner padding slot list into a shorthand', () => {
		const values = { 'primitive.dimension.spacing.xs': '1rem', 'primitive.dimension.spacing.sm': '1.5rem' };
		const tokens = {
			padding: [
				'{primitive.dimension.spacing.xs}',
				'{primitive.dimension.spacing.sm}',
				'{primitive.dimension.spacing.xs}',
				'{primitive.dimension.spacing.sm}',
			],
		};

		expect(IMAGE_PRESET.preview(tokens, values).padding).toBe('1rem 1.5rem 1rem 1.5rem');
	});

	/**
	 * A dangling alias previews as empty rather than as the raw alias text, so `renderPreview` can fall
	 * back to the image's own built-in look.
	 *
	 * @return {void}
	 */
	it('previews a dangling alias as empty', () => {
		expect(
			IMAGE_PRESET.preview({ background: '{semantic.color.gone}', borderRadius: '', shadow: '', padding: '' }, {})
		).toEqual({
			background: '',
			borderRadius: '',
			shadow: '',
			padding: '',
		});
	});

	/**
	 * Three nested elements, each carrying the properties it alone can render: the outer casts the shadow
	 * (which must not be clipped) and holds the radius, the fill holds the background and the padding, and
	 * the photo is the stand-in the padding insets.
	 *
	 * @return {void}
	 */
	it('splits the preview across a frame, a padded fill and a photo', () => {
		const frame = IMAGE_PRESET.renderPreview({
			id: 'framed',
			label: 'Framed',
			preview: {
				background: '#F7FAFC',
				borderRadius: '0.5rem',
				shadow: '0px 2px 6px 0px #0000001a',
				padding: '0.5rem',
			},
		});
		const fill = frame.props.children;
		const photo = fill.props.children;

		expect(frame.props.className).toBe('kadence-blocks-style-library__image-preset-preview');
		expect(frame.props.style.boxShadow).toBe('0px 2px 6px 0px #0000001a');
		expect(frame.props.style.borderRadius).toBe('0.5rem');
		// The frame must not paint the background itself, or it would cover its own checker.
		expect(frame.props.style.background).toBeUndefined();

		expect(fill.props.className).toBe('kadence-blocks-style-library__image-preset-preview-fill');
		expect(fill.props.style.background).toBe('#F7FAFC');
		expect(fill.props.style.padding).toBe('min(0.5rem, 4rem)');

		expect(photo.props.className).toBe('kadence-blocks-style-library__image-preset-preview-photo');
	});

	/**
	 * The tile grows to fit its padding, so a step is shown at true size; the cap only bounds the very
	 * top of the scale, which runs to 10rem and would otherwise produce a row taller than the screen.
	 *
	 * @return {void}
	 */
	it('caps each side of the preview padding, bounding one extreme preset', () => {
		const frame = IMAGE_PRESET.renderPreview({
			id: 'roomy',
			label: 'Roomy',
			preview: { background: '', borderRadius: '', shadow: '', padding: '2rem' },
		});

		// A length, not a percentage: the tile's width is derived from the padding, so a percentage
		// would resolve against a size the padding itself determines.
		expect(frame.props.children.props.style.padding).toBe('min(2rem, 4rem)');
	});

	/**
	 * A per-corner preset resolves to a shorthand, and CSS `min()` takes one length rather than a
	 * shorthand, so each side is wrapped on its own.
	 *
	 * @return {void}
	 */
	it('caps every side of a per-corner padding shorthand independently', () => {
		const frame = IMAGE_PRESET.renderPreview({
			id: 'corners',
			label: 'Corners',
			preview: { background: '', borderRadius: '', shadow: '', padding: '1rem 2rem 1rem 2rem' },
		});

		expect(frame.props.children.props.style.padding).toBe(
			'min(1rem, 4rem) min(2rem, 4rem) min(1rem, 4rem) min(2rem, 4rem)'
		);
	});

	/**
	 * An unresolved value is left absent rather than invented, so the stylesheet's own square-cornered
	 * checkered tile shows through with no inset.
	 *
	 * @return {void}
	 */
	it('leaves unresolved values absent rather than inventing them', () => {
		const frame = IMAGE_PRESET.renderPreview({
			id: 'bare',
			label: 'Bare',
			preview: { background: '', borderRadius: '', shadow: '', padding: '' },
		});

		expect(frame.props.style.borderRadius).toBeUndefined();
		expect(frame.props.style.boxShadow).toBeUndefined();
		expect(frame.props.children.props.style.background).toBeUndefined();
		expect(frame.props.children.props.style.padding).toBeUndefined();
	});

	/**
	 * The image binds no hover property, so it declares no tabs and `PresetSidebar` renders the field area
	 * bare.
	 *
	 * @return {void}
	 */
	it('declares no state tabs', () => {
		expect(IMAGE_PRESET.tabs).toBeUndefined();
	});

	/**
	 * The schema offers the four properties a preset can actually deliver. `border` and `borderWidth` are
	 * bound — they feed the block-default rules that seed an image's border from the tokens — but are
	 * deliberately absent here, because the image binds no border STYLE and so a preset can never turn a
	 * border on. See the config's `schemaFor()` docblock and SOFT-4234.
	 *
	 * @return {void}
	 */
	it('builds panels covering the deliverable properties and nothing more', () => {
		const { panels } = IMAGE_PRESET.schemaFor();

		const paths = panels.flatMap((panel) => panel.fields.map((field) => field.path));
		const types = panels.flatMap((panel) => panel.fields.map((field) => field.type));

		expect(paths).toEqual(['tokens.background', 'tokens.borderRadius', 'tokens.shadow', 'tokens.padding']);
		expect(types).toEqual(['token-color-select', 'radius', 'box-shadow', 'spacing']);

		// Every type the schema names must be one the registry can render.
		types.forEach((type) => expect(FIELD_TYPES).toHaveProperty(type));
	});

	/**
	 * Radius and padding mirror per-device block controls, so both preset fields are responsive and of
	 * types that may be. Shadow is not: `BoxShadowField` carries no breakpoint switcher, so marking it
	 * responsive would write an override its own UI could never read back.
	 *
	 * @return {void}
	 */
	it('makes only the per-device fields responsive', () => {
		const fields = IMAGE_PRESET.schemaFor().panels.flatMap((panel) => panel.fields);
		const byPath = Object.fromEntries(fields.map((field) => [field.path, field]));

		expect(byPath['tokens.borderRadius'].responsive).toBe(true);
		expect(byPath['tokens.padding'].responsive).toBe(true);
		expect(RESPONSIVE_CAPABLE_FIELD_TYPES).toContain(byPath['tokens.borderRadius'].type);
		expect(RESPONSIVE_CAPABLE_FIELD_TYPES).toContain(byPath['tokens.padding'].type);

		expect(byPath['tokens.shadow'].responsive).toBeUndefined();
		expect(byPath['tokens.background'].responsive).toBeUndefined();
	});
});

describe('ImageScreen registration', () => {
	/**
	 * The app never imports the screen component directly — importing the module is what registers it
	 * on the public filter, exactly as a third-party screen would register itself.
	 *
	 * @return {void}
	 */
	it('registers itself on the preset-screens filter with a settings panel', () => {
		require('../components/pages/ImageScreen');

		const screens = applyFilters(PRESET_SCREENS_FILTER, {});

		expect(screens[IMAGE_BLOCK]).toBeDefined();
		expect(screens[IMAGE_BLOCK].SettingsPanel).toBeDefined();
	});
});
