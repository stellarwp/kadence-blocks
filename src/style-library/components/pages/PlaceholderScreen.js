/**
 * The generic Style Library screen: a centered, muted "coming soon" panel rendered for every nav
 * entry until its per-screen work lands.
 */

/**
 * WordPress dependencies
 */
import { Button } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { getQueryArg } from '@wordpress/url';
import { plus } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { ScreenHeader } from '../organisms/ScreenHeader';
import { SwatchGrid } from '../organisms/SwatchGrid';
import { RowList } from '../templates/RowList';
import { SettingsPanel } from '../templates/SettingsPanel';
import { SettingsForm } from '../organisms/SettingsForm';
import { EmptyState } from '../molecules/EmptyState';
import { DragHandle } from '../atoms/DragHandle';
import { MetaChip } from '../atoms/MetaChip';
import { SectionHeading } from '../atoms/SectionHeading';
import { AddTile } from '../atoms/AddTile';
import { SelectDropdown } from '../molecules/SelectDropdown';
import { useSettingsPanel } from '../../hooks/use-settings-panel';
import { DEMO_ITEM_ID, DEMO_SETTINGS_SCHEMA, DEMO_SETTINGS_VALUES } from '../../constants/demo-settings-schema';
import { isEqual, setValueAtPath } from '../../helpers/settings-schema';
import './PlaceholderScreen.scss';

/**
 * The query-string arg that shows the primitives gallery on top of the `NODE_ENV` check. Local to
 * this module and not added to `helpers/route.js`'s route constants — a dev affordance, not part
 * of the app's routing contract.
 *
 * @since TBD
 */
const GALLERY_QUERY_ARG = 'kb-gallery';

/**
 * An empty `ListRow` `preview` element — the common case across Border Radius, Border Width,
 * Spacing, Icon Sizes, and Shadow, where `.list-row-preview`'s default styling is the preview and
 * each screen's per-row variation comes entirely from a CSS override.
 *
 * @since TBD
 *
 * @return {JSX.Element} An empty preview element.
 */
function emptyRowPreview() {
	return <span />;
}

/**
 * Static sample rows for the primitives gallery. Every row is draggable, and there is no delete
 * affordance to demo (deletion happens from the settings panel, not the row list). The last row
 * combines a long, unbroken-word label and value with a preview, so the fixed-width columns
 * visibly wrap instead of truncating or overflowing. Lives inline, not in `constants/`, so nothing
 * mistakes it for real screen config.
 *
 * @since TBD
 */
const GALLERY_ROWS = [
	{ id: 'row-heading-1', label: 'Heading 1', value: '56px', isDraggable: true },
	{ id: 'row-heading-2', label: 'Heading 2', value: '40px', preview: emptyRowPreview(), isDraggable: true },
	{ id: 'row-body', label: 'Body', value: '16px', isDraggable: true },
	{
		id: 'row-wrapped',
		label: 'Extralargeheadingsizewrapped',
		value: 'AVeryLongUnbrokenTokenValue',
		preview: emptyRowPreview(),
		isDraggable: true,
	},
];

/**
 * Builds a `SwatchCard` `preview` element filled with a solid color — the gallery's own stand-in
 * for what a real screen would build from its token value.
 *
 * @param {string} hex The fill color, matching the sample's own `subLine`.
 *
 * @since TBD
 *
 * @return {JSX.Element} The filled preview element.
 */
function swatchPreview(hex) {
	return <span style={{ display: 'block', width: '100%', height: '100%', background: hex }} />;
}

/**
 * Static sample swatch groups for the primitives gallery. Every card is draggable, and there is no
 * delete affordance to demo. `White` is included deliberately — its fill is nearly
 * indistinguishable from the card's own background, proving the preview's `gray-200` border is
 * doing real work, not just decoration.
 *
 * @since TBD
 */
const GALLERY_SWATCH_GROUPS = [
	{
		id: 'group-neutrals',
		label: 'Neutrals',
		items: [
			{
				id: 'swatch-white',
				name: 'White',
				subLine: '#FFFFFF',
				preview: swatchPreview('#FFFFFF'),
				isDraggable: true,
			},
			{
				id: 'swatch-black',
				name: 'Black',
				subLine: '#000000',
				preview: swatchPreview('#000000'),
				isDraggable: true,
			},
		],
	},
	{
		id: 'group-accents',
		label: 'Accents',
		items: [
			{
				id: 'swatch-primary',
				name: 'Primary',
				subLine: '#2271B1',
				preview: swatchPreview('#2271B1'),
				isDraggable: true,
			},
		],
	},
	// No cards — the add tile alone, verifying it neither collapses nor stretches against nothing.
	{ id: 'group-empty', label: 'Empty group', items: [] },
];

/**
 * Whether the primitives gallery should render: a dev build (see the `NODE_ENV` check in
 * `PlaceholderScreen`) AND the `kb-gallery=1` query arg.
 *
 * @since TBD
 *
 * @return {boolean} True when the gallery should render.
 */
function isGalleryRequested() {
	return getQueryArg(window.location.href, GALLERY_QUERY_ARG) === '1';
}

/**
 * Render the placeholder screen.
 *
 * @param {Object}   props          The component props.
 * @param {string}   props.label    The active screen's nav label.
 * @param {Object}   props.route    The route from `useStyleLibraryRoute`.
 * @param {Function} props.navigate The route navigator.
 * @param {Object}   [props.library] The design-tokens feed surface; unused here.
 *
 * @since TBD
 *
 * @return {JSX.Element} The placeholder screen.
 *
 * @todo Replaced per screen by the Style Library per-screen work.
 */
export function PlaceholderScreen({ label, route, navigate }) {
	return (
		<div className="kadence-blocks-style-library__placeholder-screen">
			<h2 className="kadence-blocks-style-library__placeholder-screen-title">{label}</h2>
			<p className="kadence-blocks-style-library__placeholder-screen-copy">
				{__('This screen is coming soon.', 'kadence-blocks')}
			</p>
			{process.env.NODE_ENV === 'development' && (
				<Button variant="secondary" onClick={() => navigate({ item: DEMO_ITEM_ID })}>
					{'Open field-library demo'}
				</Button>
			)}
			{process.env.NODE_ENV === 'development' && isGalleryRequested() && <PrimitivesGallery />}
		</div>
	);
}

/**
 * The field-library demo's settings panel — the dev-only proving ground for `SettingsPanel` and
 * `SettingsForm` against a real route-driven item (`?kb-item=demo`), relocated here from the app
 * root so `StyleLibraryApp` carries no demo knowledge. Owns only `DEMO_ITEM_ID`; any other open
 * item (a stale id, or another screen's token reached by editing the URL by hand) self-heals the
 * same way `ColorPaletteSettings` does, clearing the route instead of rendering nothing forever.
 *
 * @param {Object}   props          The component props.
 * @param {Object}   props.route    The route from `useStyleLibraryRoute`.
 * @param {Function} props.navigate The route navigator.
 *
 * @since TBD
 *
 * @return {?JSX.Element} The demo panel, or null while a stale item normalizes away.
 */
function PlaceholderDemoSettingsPanel({ route, navigate }) {
	const isDemoItem = route.item === DEMO_ITEM_ID;
	const panel = useSettingsPanel({ route, navigate, initialValues: DEMO_SETTINGS_VALUES });

	useEffect(() => {
		if (!isDemoItem) {
			navigate({ item: '' });
		}
	}, [isDemoItem, navigate]);

	if (!isDemoItem) {
		return null;
	}

	return (
		<SettingsPanel
			onClose={panel.close}
			onDelete={() => panel.close()}
			onSave={() => panel.resetDraft()}
			isDirty={panel.isDirty}
		>
			<SettingsForm schema={DEMO_SETTINGS_SCHEMA} values={panel.draft} onChange={panel.setFieldValue} />
		</SettingsPanel>
	);
}

/**
 * The screen-panel contract (see `ColorPaletteScreen.SettingsPanel`), assigned only in a dev build
 * so the demo panel — and everything it imports — compiles out of production entirely.
 *
 * @since TBD
 */
PlaceholderScreen.SettingsPanel = process.env.NODE_ENV === 'development' ? PlaceholderDemoSettingsPanel : undefined;

/**
 * A labeled, visually separated wrapper around one primitive's demo: a heading naming the
 * component's exact export and its atomic-design layer, an optional note, then the demo itself.
 * Deliberately its own chrome, not `SectionHeading` — `SectionHeading` is one of the components
 * under review here, and using it as gallery furniture would make it impossible to tell the atom
 * being judged apart from the label judging it. Not exported — an implementation detail of the
 * gallery.
 *
 * @param {Object}          props          The component props.
 * @param {string}          props.name     The component's exact export name (e.g. `ScreenHeader`).
 * @param {string}          props.layer    The atomic-design layer (e.g. `organism`).
 * @param {string}          [props.note]   An optional note about what's composed into the demo.
 * @param {import('react').ReactNode} props.children The demo itself.
 *
 * @since TBD
 *
 * @return {JSX.Element} The labeled section.
 */
function GallerySection({ name, layer, note, children }) {
	return (
		<div className="kadence-blocks-style-library__placeholder-gallery-section">
			<div className="kadence-blocks-style-library__placeholder-gallery-section-heading">
				<code className="kadence-blocks-style-library__placeholder-gallery-section-name">{name}</code>
				<span className="kadence-blocks-style-library__placeholder-gallery-section-layer">{layer}</span>
			</div>
			{note && <p className="kadence-blocks-style-library__placeholder-gallery-section-note">{note}</p>}
			{children}
		</div>
	);
}

/**
 * The dev-only visual verification surface for the shared content primitives: every primitive in
 * its own labeled, separated section. Gated on `NODE_ENV` (compiled out of production entirely)
 * AND the `kb-gallery=1` query arg (see `isGalleryRequested`). Its own strings are plain literals,
 * not `__()` — they're developer-facing labels compiled out of production, and translating them
 * would add catalog strings no user will ever see. Do not "fix" this to use `__()`.
 *
 * @since TBD
 *
 * @return {JSX.Element} The gallery section.
 */
function PrimitivesGallery() {
	const [rowOrder, setRowOrder] = useState(GALLERY_ROWS.map((row) => row.id));
	const [selectedRowId, setSelectedRowId] = useState('');
	const [swatchGroups, setSwatchGroups] = useState(GALLERY_SWATCH_GROUPS);
	const [selectedSwatchId, setSelectedSwatchId] = useState('');
	const [inlineSelectValue, setInlineSelectValue] = useState('sample-a');

	const rowsById = Object.fromEntries(GALLERY_ROWS.map((row) => [row.id, row]));
	const orderedRows = rowOrder.map((id) => rowsById[id]);

	// A static "baseline item" pass with no onDelete, proving Delete is absent, not disabled — the
	// route-driven "custom item" pass (onDelete present) is the real settings-panel slot.
	const [baselineDemoValues, setBaselineDemoValues] = useState(DEMO_SETTINGS_VALUES);

	return (
		<div className="kadence-blocks-style-library__placeholder-gallery">
			<h3 className="kadence-blocks-style-library__placeholder-gallery-title">Primitives gallery</h3>

			<GallerySection
				name="ScreenHeader"
				layer="organism"
				note="The common shape — title + primary action only. Eight of the nine Base Styles / Block Presets screens render exactly this; no inline control, no destructive action."
			>
				<ScreenHeader
					title="Sample screen"
					primaryAction={
						<Button variant="secondary" icon={plus}>
							Add row
						</Button>
					}
				/>
			</GallerySection>

			<GallerySection
				name="ScreenHeader (Color Palette exception)"
				layer="organism"
				note="Only Color Palette fills every slot — its own palette SelectDropdown (the same component the library selector uses) and its delete-palette action. The other eight screens do not need this shape; see the shape above for what they actually render."
			>
				<ScreenHeader
					title="Color Palette"
					inlineControl={
						<SelectDropdown
							value={inlineSelectValue}
							options={[
								{ value: 'sample-a', label: 'Sample A' },
								{ value: 'sample-b', label: 'Sample B' },
							]}
							onChange={setInlineSelectValue}
						/>
					}
					destructiveAction={
						// The exact class the main header's own Delete action uses (DeleteLibraryModal.js/.scss).
						<Button
							isDestructive
							variant="link"
							className="kadence-blocks-style-library__delete-library-action"
						>
							Delete
						</Button>
					}
					primaryAction={
						<Button variant="secondary" icon={plus}>
							Add color
						</Button>
					}
				/>
			</GallerySection>

			<GallerySection name="RowList" layer="template" note="Each row is a ListRow (molecule).">
				<RowList
					items={orderedRows}
					selectedId={selectedRowId}
					onSelect={setSelectedRowId}
					onReorder={setRowOrder}
					empty={<EmptyState title="No rows yet" />}
				/>
			</GallerySection>

			<GallerySection
				name="SwatchGrid"
				layer="organism"
				note="Each card is a SwatchCard (molecule); group labels are SectionHeading (atom); the trailing tile is AddTile (atom)."
			>
				<SwatchGrid
					groups={swatchGroups}
					selectedId={selectedSwatchId}
					onSelect={setSelectedSwatchId}
					onReorder={(groupId, orderedIds) =>
						setSwatchGroups((groups) =>
							groups.map((group) =>
								group.id === groupId
									? {
											...group,
											items: orderedIds.map((id) => group.items.find((item) => item.id === id)),
										}
									: group
							)
						)
					}
					onAdd={(groupId) => window.console.log('add to group', groupId)}
					addLabel="Add color"
				/>
			</GallerySection>

			<GallerySection name="EmptyState" layer="molecule">
				<EmptyState
					title="Nothing here yet"
					description="This is the empty-state primitive with an action slot."
					action={
						<Button variant="primary" icon={plus}>
							Add item
						</Button>
					}
				/>
			</GallerySection>

			<GallerySection name="Atoms" layer="atom" note="DragHandle, MetaChip, SectionHeading, AddTile standalone.">
				<div className="kadence-blocks-style-library__placeholder-gallery-atoms">
					<DragHandle />
					<MetaChip>4XL</MetaChip>
					<SectionHeading>Group label</SectionHeading>
					<AddTile label="Add color" onClick={() => window.console.log('add tile clicked')} />
				</div>
			</GallerySection>

			<GallerySection
				name="SettingsPanel + SettingsForm (baseline item)"
				layer="template + organism"
				note="The demo schema's baseline-item pass: onDelete is omitted, so the footer Delete button is absent, not disabled. The route-driven custom-item pass (Delete present) is reached via the 'Open field-library demo' button above."
			>
				<div className="kadence-blocks-style-library__placeholder-gallery-settings-panel">
					<SettingsPanel
						onClose={() => window.console.log('close settings panel')}
						onSave={() => window.console.log('save', baselineDemoValues)}
						isDirty={!isEqual(baselineDemoValues, DEMO_SETTINGS_VALUES)}
					>
						<SettingsForm
							schema={DEMO_SETTINGS_SCHEMA}
							values={baselineDemoValues}
							onChange={(path, value) =>
								setBaselineDemoValues((current) => setValueAtPath(current, path, value))
							}
						/>
					</SettingsPanel>
				</div>
			</GallerySection>
		</div>
	);
}
