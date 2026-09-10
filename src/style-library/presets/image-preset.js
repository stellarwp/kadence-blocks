/**
 * Everything specific to the `kadence/image` (Advanced Image) preset screen, in one place: the block
 * name, the bound property surface, the row preview, and the settings schema.
 *
 * The generic preset machinery — `helpers/presets.js`, `usePresetScreen`, `PresetSidebar` — reads
 * this config and knows nothing else about images. See `src/style-library/README.md`.
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { getPresetProperties, resolveTokenValue } from '../helpers/presets';
import { capBoxSides } from '../helpers/preview';

/**
 * The block name this screen edits — the single JS spelling, shared by the screen registration and
 * the config below so the two can never drift.
 *
 * @since TBD
 */
export const IMAGE_BLOCK = 'kadence/image';

/**
 * The image's built-in corner radius, matching `semantic.radius.media` (square corners).
 *
 * @since TBD
 */
const IMAGE_RADIUS_FALLBACK = ['0', '0', '0', '0'];

/**
 * The image's built-in padding, matching `semantic.spacing.media-padding` (none).
 *
 * @since TBD
 */
const IMAGE_PADDING_FALLBACK = ['0', '0', '0', '0'];

/**
 * The most preview padding any one side may show.
 *
 * A LENGTH, not a percentage: the tile sizes itself from the photo plus the padding, so a percentage
 * would resolve against a width the padding itself determines.
 *
 * @since TBD
 */
const PADDING_PREVIEW_CAP = '4rem';

/**
 * Build a row's preview from its stored tokens.
 *
 * Four of the image's six bound properties, which is its whole editable surface here — border color
 * and border width are bound but deliberately not offered, see `schemaFor()`. Padding is previewed as
 * real inset rather than a number, because that is the only way a spacing value reads at a glance
 * next to a radius and a shadow.
 *
 * @param {Record<string, *>}      tokens       The preset's stored token map.
 * @param {Record<string, string>} values       The feed's resolved value map.
 * @param {string}                 [breakpoint] The breakpoint to resolve responsive values at.
 *
 * @since TBD
 *
 * @return {{background: string, borderRadius: string, shadow: string, padding: string}} The preview.
 */
function preview(tokens, values, breakpoint) {
	return {
		background: resolveTokenValue(values, tokens.background, breakpoint),
		borderRadius: resolveTokenValue(values, tokens.borderRadius, breakpoint),
		shadow: resolveTokenValue(values, tokens.shadow, breakpoint),
		padding: resolveTokenValue(values, tokens.padding, breakpoint),
	};
}

/**
 * The image's live preview: a landscape tile standing in for a photo, drawn at the preset's resolved
 * radius and shadow, with its background showing through the padding as an inset frame around a
 * neutral photo block.
 *
 * Three nested elements, each earning its place. The outer carries the radius and the shadow, which
 * has to be cast from outside anything that clips. The middle carries the background AND the padding
 * (capped only at the very top of the scale — see `capBoxSides`), so padding renders as what it
 * actually is: space between the frame and the image, at true size, with the tile growing to fit it. The inner is the stand-in photo, a neutral block carrying a generic picture glyph
 * rather than a real image, because a preset skins whatever image a block happens to hold and
 * previewing a specific picture would imply it selects one. The glyph is what makes the padding
 * legible — without something that reads as "the image", an inset frame is just a smaller rectangle,
 * and it is not obvious that the band around it is the preset's background showing through.
 *
 * The transparency checker sits on the outer element for the same reason it does on the Row Layout and
 * Section previews: the image's shipped background is transparent, and against the list's white
 * surface a transparent background and a white one are indistinguishable.
 *
 * @param {{id: string, label: string, preview: {background: string, borderRadius: string, shadow: string, padding: string}}} row The row descriptor.
 *
 * @since TBD
 *
 * @return {JSX.Element} The preview element.
 */
function renderPreview(row) {
	const radius = row.preview.borderRadius || undefined;

	return (
		<span
			className="kadence-blocks-style-library__image-preset-preview"
			style={{ borderRadius: radius, boxShadow: row.preview.shadow || undefined }}
		>
			<span
				className="kadence-blocks-style-library__image-preset-preview-fill"
				style={{
					background: row.preview.background || undefined,
					borderRadius: radius,
					padding: capBoxSides(row.preview.padding, PADDING_PREVIEW_CAP),
				}}
			>
				<span className="kadence-blocks-style-library__image-preset-preview-photo">
					<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
						<path
							fill="currentColor"
							d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm1 12.2 4.6-4.6 3 3L15.4 13l3.6 3.6V7H5v10.2zM8.5 11a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"
						/>
					</svg>
				</span>
			</span>
		</span>
	);
}

/**
 * The settings schema. The image declares no tabs: it binds no hover property, so there is no second
 * state to switch to and `PresetSidebar` renders the field area bare.
 *
 * Radius and padding are responsive because the block declares per-device attributes for both and its
 * own controls are per-device, so a preset that could name only one value for every breakpoint could
 * not reproduce a look a site owner had already built by hand. Background is a single non-responsive
 * picker (no per-device attribute), and shadow is non-responsive because `BoxShadowField` carries no
 * breakpoint switcher.
 *
 * The image binds `border` (color) and `borderWidth` as well, and neither is offered here. Both are
 * unreachable in practice, and the reason is worth stating because it is not obvious from the
 * declaration: the image binds no border STYLE, so a preset cannot turn a border on at all — with the
 * block's style unset, `render_border_styles()` emits nothing and `border-style` stays `none`. Once a
 * site owner does set a style, the block emits a `border-<side>` shorthand that overrides the color
 * (with a width set, as `2px solid`, resetting the color to `currentColor`), and the one shape that
 * leaves the width to a preset — style and color set, width blank — renders nothing in the editor at
 * all, because `getBorderStyle()` returns an empty string without a width. Offering either field would
 * save a value a site owner could not see. SOFT-4234 covers making them work.
 *
 * @since TBD
 *
 * @return {{panels: Array<Object>}} The settings-form schema.
 */
function schemaFor() {
	return {
		panels: [
			{
				id: 'color',
				title: __('Color', 'kadence-blocks'),
				fields: [
					{
						type: 'token-color-select',
						path: 'tokens.background',
						label: __('Background', 'kadence-blocks'),
					},
				],
			},
			{
				id: 'border-and-shadow',
				title: __('Border and Shadow', 'kadence-blocks'),
				fields: [
					{
						type: 'radius',
						tokenType: 'dimension',
						role: 'radius',
						responsive: true,
						path: 'tokens.borderRadius',
						label: __('Radius', 'kadence-blocks'),
						// Square corners, which is what an un-preset image renders and what
						// `semantic.radius.media` holds. Shown muted so an unset field reports the radius the
						// image really has rather than reading as empty.
						defaultValue: IMAGE_RADIUS_FALLBACK,
					},
					{
						type: 'box-shadow',
						path: 'tokens.shadow',
						label: __('Shadow', 'kadence-blocks'),
						// No `defaultValue`, matching the Button's shadow field: `BoxShadowControl` accepts no
						// such prop, so the key would go unread.
					},
				],
			},
			{
				id: 'spacing',
				title: __('Spacing', 'kadence-blocks'),
				fields: [
					{
						type: 'spacing',
						tokenType: 'dimension',
						role: 'spacing',
						responsive: true,
						path: 'tokens.padding',
						label: __('Padding', 'kadence-blocks'),
						// An image carries no padding of its own, which is a real answer rather than an absent
						// one — `semantic.spacing.media-padding` resolves to 0.
						defaultValue: IMAGE_PADDING_FALLBACK,
					},
				],
			},
		],
	};
}

/**
 * The Advanced Image preset screen's whole configuration, passed to the generic preset machinery.
 *
 * `properties` is a getter rather than a snapshot, for the same reason the Button's is: the config is
 * frozen at module evaluation, before the localized feed is guaranteed to exist, so a snapshot taken
 * here could throw or go stale.
 *
 * @since TBD
 */
export const IMAGE_PRESET = Object.freeze({
	block: IMAGE_BLOCK,
	get properties() {
		return getPresetProperties(IMAGE_BLOCK);
	},
	slugBase: 'image',
	addLabel: __('Add Image Style', 'kadence-blocks'),
	newLabel: __('New Image Style', 'kadence-blocks'),
	className: 'kadence-blocks-style-library__image-screen',
	preview,
	renderPreview,
	schemaFor,
});
