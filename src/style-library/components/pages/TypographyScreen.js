/**
 * The Typography screen: the scale config, the FONT preview toolbar, the sample-text preview
 * renderer, and the two thin wrappers that plug into the shared `ScaleScreen`/`ScaleSettings`
 * contract (see `ScaleScreen.js`'s module docblock). Two things make this screen genuinely
 * different from its siblings: a toolbar between the header and the list (the FONT catalog
 * dropdown, the contextual Add/Remove Favorite button, and the "+ Add Size" action) built on
 * `ScaleScreen`'s optional `renderToolbar` seam, and screen-level preview state (the currently
 * previewed font, plus the favorite-font flows) that `renderPreview` and the toolbar close over —
 * absorbed entirely at this screen's own boundary, with no change to the shared hook or flows.
 *
 * The screen's fonts are the library's FAVORITES, not tokens. A favorite carries no indirection and
 * emits no CSS variable; it exists so a family a site uses often sits at the top of this dropdown
 * and of every block's font picker, instead of being searched for in a ~1,900-name catalog each
 * time. Font family is therefore the one thing on this screen that is not a design token — the
 * font-size steps below it still are.
 */

/**
 * WordPress dependencies
 */
import { useCallback, useEffect, useMemo, useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { Button, Notice, Spinner } from '@wordpress/components';
import { starEmpty, starFilled } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { ScaleScreen } from './ScaleScreen';
import { ScaleSettings } from './ScaleSettings';
import { SearchableSelectDropdown } from '../molecules/SearchableSelectDropdown';
import { addFavoriteFontFlow, removeFavoriteFontFlow } from '../../helpers/font-flows';
import { useGoogleFontLoader } from '../../hooks/use-google-font-loader';
import {
	familyStack,
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
 * The muted badge a catalog custom font carries in the dropdown menu, matching the `SelectDropdown`
 * badge treatment used elsewhere in the app.
 *
 * @since TBD
 */
const CUSTOM_BADGE = __('Custom', 'kadence-blocks');

/**
 * The muted badge a favorite carries where it sits pinned above the catalog.
 *
 * @since TBD
 */
const FAVORITE_BADGE = __('Favorite', 'kadence-blocks');

/**
 * The contextual favorite button's labels, keyed by the action it is offering and by whether that
 * action's write is in flight. A favorite write is a REST call plus a full feed refresh, so the
 * button carries the same busy label the app's every other write control does — without one, the
 * only feedback for the whole round trip is the control going flat, which reads as the click not
 * having registered.
 *
 * @since TBD
 */
const FONT_ACTION_LABELS = {
	add: {
		idle: __('Add Favorite', 'kadence-blocks'),
		busy: __('Adding Favorite…', 'kadence-blocks'),
	},
	remove: {
		idle: __('Remove Favorite', 'kadence-blocks'),
		busy: __('Removing Favorite…', 'kadence-blocks'),
	},
};

/**
 * The sentence announced to screen readers once a favorite write succeeds. The button's own label
 * and icon flip on success, but a label change on an already-focused control is not something a
 * screen reader reliably re-reads, so the outcome gets said out loud in its own live region.
 *
 * @param {('add'|'remove')} type The action that just settled.
 * @param {string}           name The family name it was applied to.
 *
 * @since TBD
 *
 * @return {string} The announcement text.
 */
function favoriteAnnouncement(type, name) {
	return type === 'remove'
		? sprintf(/* translators: %s: the font family name. */ __('%s removed from favorites.', 'kadence-blocks'), name)
		: sprintf(/* translators: %s: the font family name. */ __('%s added to favorites.', 'kadence-blocks'), name);
}

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
 * Build the catalog dropdown's option list: the library's favorites first, then every Google family
 * name, then every custom family name — each carrying its catalog family name as `value` (never a
 * token id — see `SearchableSelectDropdown`'s module docblock), favorites tagged with the muted
 * `Favorite` badge and custom names with `Custom`.
 *
 * Pinning favorites to the top IS the feature: it is what replaces the font tabs this screen used
 * to carry, and it matches how the block editor's font picker surfaces the same list. A favorite
 * family is filtered out of the catalog runs below so it appears exactly once, keeping its pinned
 * position rather than showing again mid-list.
 *
 * @param {Array<{label: string}>} fonts The library's favorites (`fontOptions()`).
 *
 * @since TBD
 *
 * @return {Array<{value: string, label: string, badge?: string}>} The dropdown's option list.
 */
function buildCatalogOptions(fonts) {
	const { google, custom } = getFontCatalog();
	const favorites = fonts.map((font) => font.label);
	const pinned = new Set(favorites.map((name) => name.toLowerCase()));
	const unpinned = (name) => !pinned.has(name.toLowerCase());

	return [
		...favorites.map((name) => ({ value: name, label: name, badge: FAVORITE_BADGE })),
		...google.filter(unpinned).map((name) => ({ value: name, label: name })),
		...custom.filter(unpinned).map((name) => ({ value: name, label: name, badge: CUSTOM_BADGE })),
	];
}

/**
 * Build the `renderToolbar( { addAction, isBusy } )` implementation: the FONT label, the searchable
 * catalog dropdown (favorites pinned at its top) with its contextual Add/Remove Favorite button,
 * and the passed-in add-size action positioned at the row's right edge — the toolbar positions
 * `addAction`, it never re-implements it, so the shared guard/busy discipline cannot fork between
 * this screen and its siblings.
 *
 * @param {Array<{value: string, label: string, badge?: string}>} args                 The toolbar's inputs.
 * @param {Array<{value: string, label: string, badge?: string}>} args.catalogOptions  The catalog dropdown's option list.
 * @param {string}                                               args.dropdownValue   The catalog dropdown's current value (a catalog family name).
 * @param {Function}                                             args.onPickCatalog   Called with a catalog family name when a dropdown option is chosen.
 * @param {{type: ('add'|'remove'), disabled: boolean, font: ?Object}} args.fontAction The contextual button's state ({@see fontActionFor}).
 * @param {Function}                                             args.onFontAction    Invokes the add- or remove-favorite flow for the current `fontAction`.
 * @param {?{type: ('add'|'remove'), name: string}}              args.fontPending     The favorite write in flight, or null when none is.
 * @param {string}                                               args.fontAnnouncement The live-region sentence for the last favorite write that succeeded.
 * @param {boolean}                                              args.fontLoading     Whether the selected font is still being fetched.
 * @param {?{message: string}}                                   args.fontError       The current favorite-write error, if any.
 * @param {Function}                                             args.onClearFontError Dismisses `fontError`.
 *
 * @since TBD
 *
 * @return {Function} The `config.renderToolbar` implementation.
 */
function typographyToolbarRenderer({
	catalogOptions,
	dropdownValue,
	onPickCatalog,
	fontAction,
	onFontAction,
	fontPending,
	fontAnnouncement,
	fontLoading,
	fontError,
	onClearFontError,
}) {
	return function renderToolbar({ addAction, isBusy }) {
		const fontBusy = fontPending !== null;
		const controlsBusy = isBusy || fontBusy;

		// While a write is in flight the button describes the action that is in flight, taken from
		// the descriptor captured at click time. `fontAction` cannot serve here: each flow refreshes
		// the feed before it settles `onBusy`, so it has already flipped to the opposite action for
		// the busy state's last frame — reading it would flash "Removing Favorite…" the instant an
		// add succeeded. Label, icon, and variant all resolve from this one value so the three never
		// disagree mid-write.
		const actionType = fontPending ? fontPending.type : fontAction.type;

		return (
			<div className="kadence-blocks-style-library__typography-toolbar">
				{fontError && (
					<Notice status="error" isDismissible onRemove={onClearFontError}>
						{fontError.message}
					</Notice>
				)}
				<div className="kadence-blocks-style-library__typography-toolbar-row">
					<div className="kadence-blocks-style-library__typography-font-selector">
						<span className="kadence-blocks-style-library__typography-font-label">
							{__('Font', 'kadence-blocks')}
							{fontLoading && <Spinner />}
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
								variant={actionType === 'remove' ? 'tertiary' : 'secondary'}
								icon={actionType === 'remove' ? starFilled : starEmpty}
								// Only this button's OWN write animates it. A scale write still
								// disables it (through `controlsBusy`) without making it look like
								// it is the one saving — the same split `SettingsPanel` draws
								// between its `isBusy` and `isSaving`/`isDeleting` props.
								isBusy={fontBusy}
								disabled={controlsBusy || fontAction.disabled}
								// Renders `aria-disabled` rather than the `disabled` attribute, so a
								// keyboard user who just pressed the button keeps focus on it for
								// the length of the write instead of being dropped to the document.
								// `Button` installs its own no-op handlers in this mode, so the
								// click is swallowed without guarding `onClick` here.
								accessibleWhenDisabled
								onClick={onFontAction}
							>
								{FONT_ACTION_LABELS[actionType][fontBusy ? 'busy' : 'idle']}
							</Button>
						</div>
					</div>
					<span className="kadence-blocks-style-library__typography-toolbar-add">{addAction}</span>
				</div>
				{/*
				 * Mounted unconditionally, empty text and all: a live region only announces text
				 * that changes inside a node the screen reader was already watching, so one that
				 * appears alongside its own message has nothing to announce.
				 */}
				<span className="screen-reader-text" role="status" aria-live="polite">
					{fontAnnouncement}
				</span>
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
 * `renderPreview`/`renderToolbar` keys, and the selected-family and favorite-write state they close
 * over. The font SELECTION is view-only, session-scoped React state (never persisted) — only the
 * favorites list itself is stored.
 *
 * The selection is a plain family name, not a favorite's id, so the sample previews any pick from the
 * catalog rather than only the handful a site keeps. Previewing IS what this screen's font
 * selector is for: gating it on favorite status left the sample stuck on the previous font for every
 * other pick, which reads as the control being broken.
 *
 * @param {Object} props The props `ScaleScreen` accepts (`{ label, route, navigate, library }`).
 *
 * @since TBD
 *
 * @return {JSX.Element} The screen.
 */
export function TypographyScreen(props) {
	const { library } = props;

	const fonts = useMemo(() => fontOptions(library.feed), [library.feed]);

	// Rebuilt whenever the favorites change, since they are pinned to the top of the same list.
	const catalogOptions = useMemo(() => buildCatalogOptions(fonts), [fonts]);

	// The previewed family, as a plain catalog name. One piece of state, not a favorite id plus a
	// pending pick: the sample previews whatever the dropdown holds, favorite or not. Splitting the
	// two is what left every non-favorite pick showing the previous font, since only a favorite had
	// an id to select by.
	const [selectedFamily, setSelectedFamily] = useState(() => fonts[0]?.label ?? '');

	// The favorite write in flight, as the action and family captured when the click happened —
	// not a bare boolean. The toolbar's busy label has to name the action being performed, and by
	// the time the busy state renders its last frame the feed has already refreshed, so anything
	// derived from the feed names the opposite one. Null means no write is in flight.
	const [fontPending, setFontPending] = useState(null);
	const [fontAnnouncement, setFontAnnouncement] = useState('');
	const [fontError, setFontError] = useState(null);

	// Seed the preview from the first favorite once the feed arrives, and only then: a family the
	// user picked is left alone even when it is not a favorite, which is the whole point.
	useEffect(() => {
		if (selectedFamily === '' && fonts.length > 0) {
			setSelectedFamily(fonts[0].label);
		}
	}, [fonts, selectedFamily]);

	// The sample renders from the family that is READY, not the one selected: switching fonts holds
	// the previous face until the new one can be painted instead of flashing the fallback.
	const { readyFamily, isLoading: fontLoading } = useGoogleFontLoader(selectedFamily);

	const fontAction = fontActionFor(fonts, selectedFamily);

	// Adding or removing a favorite is deliberately never guarded (unlike selecting a row or
	// navigating away with a dirty draft): neither touches the size-panel draft, and the post-write
	// `refreshFeed` re-overlays it exactly as every sibling write does.
	const handleFontAction = useCallback(() => {
		setFontError(null);

		// Cleared on every click so repeating an action re-announces it, rather than the live region
		// sitting on text it already read out.
		setFontAnnouncement('');

		const { type } = fontAction;
		const name = fontAction.font?.label ?? selectedFamily;

		const flowArgs = {
			name,
			slug: library.slug,
			feedVersion: library.version,
			refreshFeed: library.refreshFeed,
			// Adapts the flows' boolean callback into the descriptor the toolbar reads. The flows
			// stay unchanged and unaware of it — which action is in flight is a fact this screen
			// already holds at the moment of the click.
			onBusy: (busy) => setFontPending(busy ? { type, name } : null),
			onError: setFontError,
		};

		// Neither flow touches the preview: the family stays selected whether it was just added to the
		// favorites or just taken out of them, so the sample does not jump under the user's cursor.
		const flow = type === 'remove' ? removeFavoriteFontFlow : addFavoriteFontFlow;

		// Both flows re-throw on failure, so `then` is the success path alone — a failed write must
		// never announce that it worked. The visible error `Notice` is the feedback for that case.
		flow(flowArgs)
			.then(() => setFontAnnouncement(favoriteAnnouncement(type, name)))
			.catch(() => {});
	}, [fontAction, selectedFamily, library]);

	// `useScaleScreen`'s addToken/saveToken/reorderTokens list the whole config in their deps, so an
	// inline object would rebuild all three every render. The catalog toolbar widens what the config
	// closes over, so the handlers it carries are memoized too — one rebuilt per render would defeat
	// this.
	const config = useMemo(
		() => ({
			...TYPOGRAPHY_CONFIG,
			renderPreview: samplePreviewRenderer(familyStack(readyFamily)),
			renderToolbar: typographyToolbarRenderer({
				catalogOptions,
				dropdownValue: selectedFamily,
				onPickCatalog: setSelectedFamily,
				fontAction,
				onFontAction: handleFontAction,
				fontPending,
				fontAnnouncement,
				fontLoading,
				fontError,
				onClearFontError: () => setFontError(null),
			}),
		}),
		[
			selectedFamily,
			readyFamily,
			catalogOptions,
			fontAction,
			handleFontAction,
			fontPending,
			fontAnnouncement,
			fontLoading,
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
