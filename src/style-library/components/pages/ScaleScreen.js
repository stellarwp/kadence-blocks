/**
 * The generic scale-screen body shared by Border Radius, Border Width, Spacing, and Icon Sizes: a
 * header with the "+ Add X" primary action, the screen-scoped write-flow error notices, and a
 * sortable `RowList` over one feed group. This component and its sibling `ScaleSettings` carry no
 * per-screen JSX or minting parameters of their own: every consuming screen supplies a plain
 * config object (`BorderRadiusScreen.js` is the smallest example) with these keys —
 *
 * - `id`             The screen id, matching its route segment.
 * - `title`          The screen heading.
 * - `addLabel`       The "+ Add X" button label.
 * - `group`          The feed group whose tokens this screen lists, by its declared group name.
 * - `groupKey`       That group's key, used when minting a token.
 * - `tokenType`      The DTCG `$type` a minted token carries.
 * - `slugBase`       The id segment a minted token's slug is derived from.
 * - `newTokenLabel`  The label a minted token starts with.
 * - `newTokenValue`  The value a minted token starts with.
 * - `valueField`     The settings panel's value field descriptor (`type`, `label`, `units`).
 * - `renderPreview`  Required. Renders one row's preview cell from the row descriptor.
 * - `formatValue`    Optional. Maps a row to its value-column text; the raw value when absent.
 * - `parseValue`     Optional. Maps a stored value to the panel's initial field value.
 * - `buildLeaf`      Optional. Builds the DTCG leaf written on save, for a composite value.
 * - `renderToolbar`  Optional. Renders a toolbar between the header and the list.
 */

/**
 * WordPress dependencies
 */
import { Button, Notice } from '@wordpress/components';
import { plus } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { ScreenHeader } from '../organisms/ScreenHeader';
import { RowList } from '../templates/RowList';
import { ScreenDescription } from '../molecules/ScreenDescription';
import { EmptyState } from '../molecules/EmptyState';
import { useScaleScreen } from '../../hooks/use-scale-screen';
import { useDraftChannel } from '../../hooks/use-draft-channel';
import { overlayDraft } from '../../helpers/scale';

/**
 * Render a scale screen's body.
 *
 * @param {Object}   props          The component props (`label` is accepted for parity with every
 *                                   other screen but unused — `config.title` renders instead).
 * @param {Object}   props.config   The per-screen scale config.
 * @param {Object}   props.route    The current route (`{ screen, item }`).
 * @param {Function} props.navigate The route navigator.
 * @param {Object}   props.library  The design-tokens feed hook's return value.
 *
 * @since TBD
 *
 * @return {JSX.Element} The screen body.
 */
export function ScaleScreen({ config, route, navigate, library }) {
	const scale = useScaleScreen(config, library, route, navigate);
	const channel = useDraftChannel();

	// A null channel (no `DraftChannelContext.Provider` mounted) degrades to today's direct calls —
	// keeps this screen usable in isolation, e.g. the dev gallery.
	// Opens the new token's settings panel the moment it exists in the store as an optimistic
	// addition, not after the write confirms — see `addToken`'s own `onOptimistic` docs.
	const mintToken = () => scale.addToken((id) => navigate({ item: id }));
	const addAction = (
		<Button
			icon={plus}
			variant="secondary"
			disabled={scale.isBusy}
			onClick={() => (channel ? channel.guard(mintToken) : mintToken())}
		>
			{config.addLabel}
		</Button>
	);

	// Strictly keyed to the open route item: a publication from a panel editing a different token
	// (or one that already unmounted) can never leak onto this screen's rows.
	const draft =
		channel && channel.publication && channel.publication.itemId === route.item ? channel.publication.draft : null;
	const rows = overlayDraft(scale.rows, route.item, draft);

	const items = rows.map((row) => ({
		id: row.id,
		label: row.label,
		value: config.formatValue ? config.formatValue(row) : row.value,
		preview: config.renderPreview(row),
		isDraggable: !row.pendingDelete,
		isPendingDelete: Boolean(row.pendingDelete),
	}));

	// Selecting the already-open token is a no-op (the draft survives — `useSettingsPanel` only
	// re-seeds on itemId change) so it must bypass the guard entirely; prompting for a click that
	// changes nothing would be pure friction.
	const selectToken = (id) => {
		if (id === route.item) {
			return;
		}

		const run = () => scale.selectToken(id);

		channel ? channel.guard(run) : run();
	};

	return (
		<div
			className={`kadence-blocks-style-library__scale-screen kadence-blocks-style-library__scale-screen--${config.id}`}
		>
			<ScreenHeader
				title={config.title}
				description={<ScreenDescription screenId={route.screen} />}
				primaryAction={config.renderToolbar ? null : addAction}
			/>
			{config.renderToolbar && config.renderToolbar({ addAction, isBusy: scale.isBusy })}
			{scale.addError && (
				<Notice status="error" isDismissible onRemove={scale.clearAddError}>
					{scale.addError.message}
				</Notice>
			)}
			{scale.orderError && (
				<Notice status="error" isDismissible onRemove={scale.clearOrderError}>
					{scale.orderError.message}
				</Notice>
			)}
			<RowList
				items={items}
				selectedId={scale.selectedId}
				onSelect={selectToken}
				onReorder={scale.reorderTokens}
				empty={<EmptyState title={config.title} description={config.addLabel} action={addAction} />}
			/>
		</div>
	);
}
