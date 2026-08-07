/**
 * The Typography screen: the scale config, the FONT preview toolbar, the sample-text preview
 * renderer, and the two thin wrappers that plug into the shared `ScaleScreen`/`ScaleSettings`
 * contract (see `.local/style-library-reference.md`). Two things make this screen genuinely
 * different from its siblings: a toolbar between the header and the list (the FONT dropdown, font
 * tabs, and the "+ Add Size" action) built on `ScaleScreen`'s optional `renderToolbar` seam, and
 * screen-level preview state (the currently previewed font) that `renderPreview` closes over —
 * absorbed entirely at this screen's own boundary, with no change to the shared hook or flows.
 */

/**
 * WordPress dependencies
 */
import { useEffect, useMemo, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import { ScaleScreen } from './ScaleScreen';
import { ScaleSettings } from './ScaleSettings';
import { SelectDropdown } from '../molecules/SelectDropdown';
import { fontOptions, fontSizeDisplayValue } from '../../helpers/typography';
import './TypographyScreen.scss';

/**
 * The fixed sample text every card renders, matching both boards. An editable sample is new UI
 * state with no board spec, so it is not built.
 *
 * @since TBD
 */
const SAMPLE_TEXT = __('Visualize your font', 'kadence-blocks');

/**
 * The translated `Font Family` feed group label — display and request addressing only, mirroring
 * `config.group`'s role for the `Font Size` group this screen edits.
 *
 * @since TBD
 */
const FONT_FAMILY_GROUP = __('Font Family', 'kadence-blocks');

/**
 * Build a `renderPreview` closing over the currently selected font's resolved stack. `row.value` is
 * the feed's resolved value or an overlaid draft scalar (`overlayDraft` copies it verbatim) — an
 * explicit SIZE edit converts a clamped step to a fixed value (the resolved `clamp(...)` string
 * caps the rendered size at its own max, so preserving the old clamp under a new scalar would make
 * the edit invisible), and this renderer styles with `row.value` exactly as stored, so both the
 * fluid and the fixed case render honestly.
 *
 * @param {string} fontStack The selected font's resolved `font-family` CSS value.
 *
 * @since TBD
 *
 * @return {Function} The `config.renderPreview` implementation.
 */
function samplePreviewRenderer(fontStack) {
	return function renderSamplePreview(row) {
		return (
			<span
				className="kadence-blocks-style-library__typography-sample"
				style={{ fontFamily: fontStack, fontSize: row.value }}
			>
				{SAMPLE_TEXT}
			</span>
		);
	};
}

/**
 * Build the `renderToolbar( { addAction, isBusy } )` implementation: font tabs (only when more than
 * one family exists), the FONT label and dropdown, and the passed-in add action positioned at the
 * row's right edge — the toolbar positions `addAction`, it never re-implements it, so the shared
 * guard/busy discipline cannot fork between this screen and its siblings.
 *
 * @param {Array<{id: string, label: string, stack: string}>} fonts          The FONT options, in feed order.
 * @param {string}                                             selectedFontId The currently previewed font's id.
 * @param {Function}                                            onSelectFont   Called with a font id when the
 *                                                                             selection changes (tab or dropdown).
 *
 * @since TBD
 *
 * @return {Function} The `config.renderToolbar` implementation.
 */
function typographyToolbarRenderer(fonts, selectedFontId, onSelectFont) {
	return function renderToolbar({ addAction, isBusy }) {
		return (
			<div className="kadence-blocks-style-library__typography-toolbar">
				{fonts.length > 1 && (
					<div className="kadence-blocks-style-library__typography-font-tabs" role="tablist">
						{fonts.map((font) => (
							<button
								key={font.id}
								type="button"
								role="tab"
								aria-selected={font.id === selectedFontId}
								disabled={isBusy}
								className={classnames('kadence-blocks-style-library__typography-font-tab', {
									'kadence-blocks-style-library__typography-font-tab--active':
										font.id === selectedFontId,
								})}
								onClick={() => onSelectFont(font.id)}
							>
								{font.label}
							</button>
						))}
					</div>
				)}
				<div className="kadence-blocks-style-library__typography-toolbar-row">
					<div className="kadence-blocks-style-library__typography-font-selector">
						<span className="kadence-blocks-style-library__typography-font-label">
							{__('Font', 'kadence-blocks')}
						</span>
						<SelectDropdown
							className="kadence-blocks-style-library__typography-font-dropdown"
							value={selectedFontId}
							options={fonts.map((font) => ({ value: font.id, label: font.label }))}
							onChange={onSelectFont}
							isBusy={isBusy}
							showSpinner={false}
						/>
					</div>
					<span className="kadence-blocks-style-library__typography-toolbar-add">{addAction}</span>
				</div>
			</div>
		);
	};
}

/**
 * The Typography screen's config — see `ScaleScreen`'s module docblock and
 * `.local/style-library-reference.md` for the full per-screen config contract. `formatValue`/
 * `parseValue` both go through `fontSizeDisplayValue()`: the size chip and the SIZE field must both
 * seed from the authored scalar (a clamp's `max`), never the resolved `clamp(...)` string a
 * fluid step actually carries.
 *
 * @since TBD
 */
export const TYPOGRAPHY_CONFIG = {
	id: 'typography',
	title: __('Typography', 'kadence-blocks'),
	addLabel: __('Add Size', 'kadence-blocks'),
	group: __('Font Size', 'kadence-blocks'),
	groupKey: 'font-size',
	tokenType: 'dimension',
	slugBase: 'font-size',
	newTokenLabel: __('New Font Size', 'kadence-blocks'),
	newTokenValue: '1rem',
	valueField: {
		type: 'unit',
		label: __('Size', 'kadence-blocks'),
		units: [
			{ value: 'px', label: 'px' },
			{ value: 'em', label: 'em' },
			{ value: 'rem', label: 'rem' },
		],
	},
	formatValue: (row) => fontSizeDisplayValue(row.value),
	parseValue: fontSizeDisplayValue,
};

/**
 * The Typography screen body: the base config extended per render with the font-dependent
 * `renderPreview`/`renderToolbar` keys, and the selected-font state they close over. The selection
 * is view-only, session-scoped React state (never persisted) — it self-heals to the group's first
 * font whenever the selected id leaves the feed, the same stale-item idiom the rest of the app uses,
 * so a font deleted or renamed out from under an open selection never leaves the toolbar pointing at
 * nothing.
 *
 * @param {Object} props The props `ScaleScreen` accepts (`{ label, route, navigate, library }`).
 *
 * @since TBD
 *
 * @return {JSX.Element} The screen.
 */
export function TypographyScreen(props) {
	const { library } = props;

	const fonts = useMemo(
		() => fontOptions(library.feed?.schema, library.feed?.values, FONT_FAMILY_GROUP),
		[library.feed]
	);

	const [selectedFontId, setSelectedFontId] = useState(() => fonts[0]?.id ?? '');

	useEffect(() => {
		if (fonts.length > 0 && !fonts.some((font) => font.id === selectedFontId)) {
			setSelectedFontId(fonts[0].id);
		}
	}, [fonts, selectedFontId]);

	const selectedFont = fonts.find((font) => font.id === selectedFontId) ?? null;

	// `useScaleScreen`'s memo deps read scalar config fields, not the config object's identity (see
	// `.local/style-library-reference.md`), so rebuilding this object every render is safe as long as
	// the field values it carries stay stable across renders that shouldn't change anything.
	const config = useMemo(
		() => ({
			...TYPOGRAPHY_CONFIG,
			renderPreview: samplePreviewRenderer(selectedFont?.stack ?? ''),
			renderToolbar: typographyToolbarRenderer(fonts, selectedFontId, setSelectedFontId),
		}),
		[fonts, selectedFont, selectedFontId]
	);

	return <ScaleScreen config={config} {...props} />;
}

/**
 * The Typography screen's settings panel. Uses the base config directly — NAME + SIZE need none of
 * the font-dependent keys the screen body extends per render.
 *
 * @param {Object} props The props `ScaleSettings` accepts (`{ route, navigate, library }`).
 *
 * @since TBD
 *
 * @return {?JSX.Element} The panel.
 */
function TypographySettings(props) {
	return <ScaleSettings config={TYPOGRAPHY_CONFIG} {...props} />;
}

TypographyScreen.SettingsPanel = TypographySettings;
