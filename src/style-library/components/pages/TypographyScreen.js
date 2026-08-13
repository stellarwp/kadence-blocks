/**
 * The Typography screen: the scale config, the FONT preview toolbar, the sample-text preview
 * renderer, and the two thin wrappers that plug into the shared `ScaleScreen`/`ScaleSettings`
 * contract (see `ScaleScreen.js`'s module docblock). Two things make this screen genuinely
 * different from its siblings: a toolbar between the header and the list (the FONT catalog
 * dropdown, the contextual Add/Delete Font button, font tabs, and the "+ Add Size" action) built
 * on `ScaleScreen`'s optional `renderToolbar` seam, and screen-level preview state (the currently
 * previewed font, plus the font catalog's Add/Delete flow) that `renderPreview` and the toolbar
 * close over — absorbed entirely at this screen's own boundary, with no change to the shared hook
 * or flows.
 */

/**
 * WordPress dependencies
 */
import { useCallback, useEffect, useMemo, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Button, Notice } from '@wordpress/components';
import { plus } from '@wordpress/icons';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import { ScaleScreen } from './ScaleScreen';
import { ScaleSettings } from './ScaleSettings';
import { SearchableSelectDropdown } from '../molecules/SearchableSelectDropdown';
import { deleteScaleTokenFlow } from '../../helpers/scale-flows';
import { addFontFlow } from '../../helpers/font-flows';
import { useGoogleFontLoader } from '../../hooks/use-google-font-loader';
import {
	findFontByFamily,
	fontActionFor,
	fontOptions,
	fontSizeDisplayValue,
	getFontCatalog,
} from '../../helpers/typography';
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
 * The muted badge a catalog custom font carries in the dropdown menu, matching the `SelectDropdown`
 * badge treatment used elsewhere in the app.
 *
 * @since TBD
 */
const CUSTOM_BADGE = __('Custom', 'kadence-blocks');

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
 * Build the catalog dropdown's option list: every Google family name, then every custom family
 * name, each carrying its catalog family name as `value` (never a token id — see
 * `SearchableSelectDropdown`'s module docblock) and custom names tagged with the muted `Custom`
 * badge.
 *
 * @since TBD
 *
 * @return {Array<{value: string, label: string, badge?: string}>} The dropdown's option list.
 */
function buildCatalogOptions() {
	const { google, custom } = getFontCatalog();

	return [
		...google.map((name) => ({ value: name, label: name })),
		...custom.map((name) => ({ value: name, label: name, badge: CUSTOM_BADGE })),
	];
}

/**
 * Build the `renderToolbar( { addAction, isBusy } )` implementation: font tabs (only when more than
 * one family exists), the FONT label, the searchable catalog dropdown with its contextual
 * Add/Delete Font button, and the passed-in add-size action positioned at the row's right edge —
 * the toolbar positions `addAction`, it never re-implements it, so the shared guard/busy discipline
 * cannot fork between this screen and its siblings.
 *
 * @param {Object}                                              args
 * @param {Array<{id: string, label: string, stack: string}>}   args.fonts           The FONT options, in feed order.
 * @param {string}                                              args.selectedFontId  The currently previewed font's id.
 * @param {Function}                                             args.onSelectFont    Called with a font id when the tabs or a matching catalog pick change the preview.
 * @param {Array<{value: string, label: string, badge?: string}>} args.catalogOptions The catalog dropdown's option list.
 * @param {string}                                               args.dropdownValue   The catalog dropdown's current value (a catalog family name).
 * @param {Function}                                              args.onPickCatalog   Called with a catalog family name when a dropdown option is chosen.
 * @param {{type: ('add'|'delete'), disabled: boolean, font: ?Object}} args.fontAction The contextual button's state ({@see fontActionFor}).
 * @param {Function}                                              args.onFontAction    Invokes the Add Font or Delete Font flow for the current `fontAction`.
 * @param {boolean}                                               args.fontBusy        Whether an Add/Delete Font request is in flight.
 * @param {?{message: string}}                                    args.fontError       The current Add/Delete Font error, if any.
 * @param {Function}                                              args.onClearFontError Dismisses `fontError`.
 *
 * @since TBD
 *
 * @return {Function} The `config.renderToolbar` implementation.
 */
function typographyToolbarRenderer({
	fonts,
	selectedFontId,
	onSelectFont,
	catalogOptions,
	dropdownValue,
	onPickCatalog,
	fontAction,
	onFontAction,
	fontBusy,
	fontError,
	onClearFontError,
}) {
	return function renderToolbar({ addAction, isBusy }) {
		const controlsBusy = isBusy || fontBusy;

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
								disabled={controlsBusy}
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
				{fontError && (
					<Notice status="error" isDismissible onRemove={onClearFontError}>
						{fontError.message}
					</Notice>
				)}
				<div className="kadence-blocks-style-library__typography-toolbar-row">
					<div className="kadence-blocks-style-library__typography-font-selector">
						<span className="kadence-blocks-style-library__typography-font-label">
							{__('Font', 'kadence-blocks')}
						</span>
						<div className="kadence-blocks-style-library__typography-font-picker">
							<SearchableSelectDropdown
								className="kadence-blocks-style-library__typography-font-dropdown"
								value={dropdownValue}
								options={catalogOptions}
								onChange={onPickCatalog}
								isBusy={controlsBusy}
							/>
							<Button
								className="kadence-blocks-style-library__typography-font-action"
								variant={fontAction.type === 'delete' ? 'tertiary' : 'secondary'}
								icon={fontAction.type === 'delete' ? undefined : plus}
								isDestructive={fontAction.type === 'delete'}
								disabled={controlsBusy || fontAction.disabled}
								onClick={onFontAction}
							>
								{fontAction.type === 'delete'
									? __('Delete', 'kadence-blocks')
									: __('Add Font', 'kadence-blocks')}
							</Button>
						</div>
					</div>
					<span className="kadence-blocks-style-library__typography-toolbar-add">{addAction}</span>
				</div>
			</div>
		);
	};
}

/**
 * The Typography screen's config — see `ScaleScreen`'s module docblock for the full per-screen
 * config contract. `formatValue`/
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
 * `renderPreview`/`renderToolbar` keys, and the selected-font state (plus the catalog dropdown's
 * pending pick and the Add/Delete Font flow state) they close over. The font selection is
 * view-only, session-scoped React state (never persisted) — it self-heals to the group's first
 * font whenever the selected id leaves the feed, the same stale-item idiom the rest of the app
 * uses, so a font deleted or renamed out from under an open selection never leaves the toolbar
 * pointing at nothing.
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

	const catalogOptions = useMemo(buildCatalogOptions, []);

	const [selectedFontId, setSelectedFontId] = useState(() => fonts[0]?.id ?? '');
	// The catalog dropdown's pending pick: null while it mirrors the previewed font, or a catalog
	// family name once a pick matches no design-system font (armed for "+ Add Font" but not yet
	// previewed: previewing a font the library does not own would need a webfont load for a token
	// that may never be created).
	const [pendingFontName, setPendingFontName] = useState(null);
	const [fontBusy, setFontBusy] = useState(false);
	const [fontError, setFontError] = useState(null);

	useEffect(() => {
		if (fonts.length > 0 && !fonts.some((font) => font.id === selectedFontId)) {
			setSelectedFontId(fonts[0].id);
			setPendingFontName(null);
		}
	}, [fonts, selectedFontId]);

	const selectedFont = fonts.find((font) => font.id === selectedFontId) ?? null;

	useGoogleFontLoader(selectedFont?.label ?? '');

	// Switching tabs (or a catalog pick that matches a design-system font) always clears a pending
	// catalog pick, so the dropdown goes back to mirroring the preview.
	const selectPreviewFont = useCallback((id) => {
		setPendingFontName(null);
		setSelectedFontId(id);
	}, []);

	const dropdownValue = pendingFontName ?? selectedFont?.label ?? '';

	const pickCatalogFont = useCallback(
		(name) => {
			const matched = findFontByFamily(fonts, name);

			if (matched) {
				selectPreviewFont(matched.id);
			} else {
				setPendingFontName(name);
			}
		},
		[fonts, selectPreviewFont]
	);

	const fontAction = fontActionFor(fonts, dropdownValue);

	// Add/Delete Font is deliberately never guarded (unlike selecting a row or navigating away with
	// a dirty draft): neither touches the size-panel draft, and the post-write `refreshFeed`
	// re-overlays it exactly as every sibling write does.
	const handleFontAction = useCallback(() => {
		setFontError(null);

		if (fontAction.type === 'delete') {
			deleteScaleTokenFlow({
				slug: library.slug,
				tokenId: fontAction.font.id,
				feedVersion: library.version,
				refreshFeed: library.refreshFeed,
				onBusy: setFontBusy,
				onError: setFontError,
			})
				.then(() => setPendingFontName(null))
				.catch(() => {});

			return;
		}

		addFontFlow({
			name: dropdownValue,
			existingIds: library.tokens.map((token) => token.id),
			slug: library.slug,
			feedVersion: library.version,
			refreshFeed: library.refreshFeed,
			onBusy: setFontBusy,
			onError: setFontError,
		})
			.then((id) => selectPreviewFont(id))
			.catch(() => {});
	}, [fontAction, dropdownValue, library, selectPreviewFont]);

	// `useScaleScreen`'s addToken/saveToken/reorderTokens list the whole config in their deps, so an
	// inline object would rebuild all three every render. The catalog toolbar widens what the config
	// closes over, so the handlers it carries are memoized too — one rebuilt per render would defeat
	// this.
	const config = useMemo(
		() => ({
			...TYPOGRAPHY_CONFIG,
			renderPreview: samplePreviewRenderer(selectedFont?.stack ?? ''),
			renderToolbar: typographyToolbarRenderer({
				fonts,
				selectedFontId,
				onSelectFont: selectPreviewFont,
				catalogOptions,
				dropdownValue,
				onPickCatalog: pickCatalogFont,
				fontAction,
				onFontAction: handleFontAction,
				fontBusy,
				fontError,
				onClearFontError: () => setFontError(null),
			}),
		}),
		[
			selectedFont?.stack,
			fonts,
			selectedFontId,
			selectPreviewFont,
			catalogOptions,
			dropdownValue,
			pickCatalogFont,
			fontAction,
			handleFontAction,
			fontBusy,
			fontError,
		]
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
