/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { Button, ColorPicker, Dropdown, Notice, SelectControl, Spinner } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { TokenSwatch } from '../atoms/TokenSwatch';
import { usePalettes } from '../../hooks/use-palettes';

/**
 * The Style Book color-palettes page: a palette dropdown that selects which palette to view / edit, a
 * "Set as current" action that switches the set's `$current` palette, and the selected palette's color
 * groups with per-swatch editing. Swatch edits and the current-palette switch write through the palette
 * REST surface.
 *
 * @param {object} props           Component props.
 * @param {string} props.namespace REST namespace the palette client targets.
 * @param {string} props.slug      Token set slug the feed resolved against.
 *
 * @since TBD
 *
 * @return {Object} The palettes page element.
 */
export function PalettesPage({ namespace, slug }) {
	const { listing, selected, selectedId, busy, error, selectPalette, switchCurrent, saveSwatchValue } = usePalettes(
		namespace,
		slug
	);

	if (!listing) {
		return (
			<div className="kadence-blocks-style-book__palettes">
				<Spinner />
			</div>
		);
	}

	const options = (listing.palettes || []).map((palette) => ({ label: palette.label, value: palette.id }));
	const isCurrent = selectedId === listing.$current;

	return (
		<div className="kadence-blocks-style-book__palettes">
			<header className="kadence-blocks-style-book__page-header">
				<h2>{__('Color Palette', 'kadence-blocks')}</h2>
				<p>
					{__(
						'Switch the active palette or edit a palette’s colors. Only colors change — type, spacing, radius and shadow stay the same.',
						'kadence-blocks'
					)}
				</p>
			</header>
			<div className="kadence-blocks-style-book__palettes-toolbar">
				<SelectControl
					label={__('Color Palette', 'kadence-blocks')}
					value={selectedId}
					options={options}
					onChange={selectPalette}
					__nextHasNoMarginBottom
				/>
				<Button
					variant="secondary"
					disabled={busy || isCurrent || !selectedId}
					onClick={() => switchCurrent(selectedId)}
				>
					{isCurrent ? __('Current Palette', 'kadence-blocks') : __('Set as Current', 'kadence-blocks')}
				</Button>
				{busy && <Spinner />}
			</div>

			{error && (
				<Notice status="error" isDismissible={false}>
					{error}
				</Notice>
			)}

			{selected &&
				(selected.groups || []).map((group) => (
					<section key={group.id} className="kadence-blocks-style-book__palette-group">
						<h3 className="kadence-blocks-style-book__palette-group-label">{group.label}</h3>
						<ul className="kadence-blocks-style-book__palette-swatches">
							{(group.swatches || []).map((swatch) => (
								<SwatchRow
									key={swatch.token}
									swatch={swatch}
									busy={busy}
									onSave={(value) => saveSwatchValue(swatch.token, value)}
								/>
							))}
						</ul>
					</section>
				))}
		</div>
	);
}

/**
 * A single editable swatch row: its color chip, label and token id, plus a color-picker popover that saves
 * the chosen value back to the palette's swatch. An aliased swatch value (a `{dot.path}` reference) is shown
 * read-only, since the palette page edits literal colors.
 *
 * @param {object}   props       Component props.
 * @param {object}   props.swatch The swatch ({ token, label, $value }).
 * @param {boolean}  props.busy   Whether a save is in flight.
 * @param {Function} props.onSave Called with the chosen color value.
 *
 * @since TBD
 *
 * @return {Object} The swatch row element.
 */
function SwatchRow({ swatch, busy, onSave }) {
	const value = swatch.$value ?? '';
	const isAlias = typeof value === 'string' && value.startsWith('{') && value.endsWith('}');

	return (
		<li className="kadence-blocks-style-book__palette-swatch">
			<Dropdown
				className="kadence-blocks-style-book__palette-swatch-toggle"
				renderToggle={({ isOpen, onToggle }) => (
					<Button
						aria-expanded={isOpen}
						disabled={busy || isAlias}
						onClick={onToggle}
						label={sprintf(
							/* translators: %s: the swatch label. */
							__('Edit %s', 'kadence-blocks'),
							swatch.label
						)}
					>
						<TokenSwatch type="color" value={value} />
					</Button>
				)}
				renderContent={() => (
					<ColorPicker
						color={value}
						enableAlpha={false}
						onChange={(color) => onSave(typeof color === 'string' ? color : (color?.hex ?? ''))}
					/>
				)}
			/>
			<span className="kadence-blocks-style-book__palette-swatch-meta">
				<strong>{swatch.label}</strong>
				<code>{swatch.token}</code>
				{swatch.overridden === false && (
					<em className="kadence-blocks-style-book__palette-swatch-inherited">
						{__('Inherited from default', 'kadence-blocks')}
					</em>
				)}
			</span>
		</li>
	);
}
