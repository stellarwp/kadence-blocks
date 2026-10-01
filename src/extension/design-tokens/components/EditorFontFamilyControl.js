/**
 * The block editor's adapter for `src/token-controls`' `FontFamilySelector`.
 *
 * The font-family sibling of `EditorScalarControl`: the same `ControlShell` chrome around the
 * control, with the block's own binding mark in the header. A family is not a token, but a preset can
 * still set one, so the field has a preset value to match or diverge from and the mark reports which.
 *
 * A block renders this through `TypographyControls`' `renderFontFamily` prop, which hands over the
 * whole family row while leaving weight, style and subset to the shared control. The block's binding
 * state and inherited default arrive as props, since the block already computes them.
 */

/**
 * Internal dependencies
 */
import { favoriteFonts, favoriteFontsManageUrl, fontCatalogOptions, isGoogleFamily } from '../../font-picker';
import { ControlShell, FontFamilySelector, googleFontHref, loadFontFamily } from '../../../token-controls';
import { TokenIndicator } from '../../token-indicators/components/TokenIndicator';

/**
 * The document the block canvas renders into: its own once the editor is iframed, the page's
 * otherwise. A font loaded into the wrong one is a font the user never sees.
 *
 * @since TBD
 *
 * @return {Document} The canvas document.
 */
function canvasDocument() {
	return window.frames?.['editor-canvas']?.document || document;
}

/**
 * The favorites-aware picker, wired to the site's favorites and font catalog.
 *
 * A pick waits for its web font before writing, so the canvas switches straight from the old face to
 * the new one instead of flashing a fallback in between. The field shows the pending family with a
 * spinner while that happens; the wait is bounded, so a font that never arrives still writes.
 *
 * @param {Object}   props                The picker props.
 * @param {*}        props.value          The current family.
 * @param {Function} props.onChange       Writes a chosen family.
 * @param {Function} props.onClear        Clears the family.
 * @param {string}   [props.inheritedLabel] What an unset family falls back to.
 *
 * @since TBD
 *
 * @return {JSX.Element} The picker element.
 */
export function fontFamilyPicker({ value, onChange, onClear, inheritedLabel }) {
	return (
		<FontFamilySelector
			value={value}
			favorites={favoriteFonts()}
			catalogOptions={fontCatalogOptions()}
			manageUrl={favoriteFontsManageUrl()}
			inheritedLabel={inheritedLabel}
			onPick={async (family) => {
				await loadFontFamily(family, {
					doc: canvasDocument(),
					href: isGoogleFamily(family) ? googleFontHref(family) : null,
				});

				onChange(family);
			}}
			onClear={onClear}
		/>
	);
}

/**
 * Render the font family field with the same chrome as the block's other token controls.
 *
 * @param {Object}    props                  The component props.
 * @param {string}    props.label            The control's label.
 * @param {*}         props.value            The current family.
 * @param {Function}  props.onChange         Writes a chosen family.
 * @param {Function}  props.onClear          Clears the family.
 * @param {string}    [props.inheritedLabel] What an unset family falls back to.
 * @param {?Object}   [props.state]          The block's own binding state (`{ bound, overridden }`).
 * @param {?Function} [props.onReset]        Reset handler for the indicator.
 *
 * @since TBD
 *
 * @return {JSX.Element} The control.
 */
export function EditorFontFamilyControl({
	label,
	value,
	onChange,
	onClear,
	inheritedLabel = '',
	state = null,
	onReset = null,
}) {
	return (
		<ControlShell
			label={label}
			// The editor's own mark, not this library's, for the same reason `EditorScalarControl` passes it.
			indicator={<TokenIndicator state={state} onReset={onReset} />}
			stacked
		>
			{fontFamilyPicker({ value, onChange, onClear, inheritedLabel })}
		</ControlShell>
	);
}
