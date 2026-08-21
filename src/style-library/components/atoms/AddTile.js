/**
 * A tile that trails a swatch group and opens the caller's add flow. The tile itself starts no
 * flow — it only reports the click.
 */

/**
 * WordPress dependencies
 */
import { Icon, plus } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import './AddTile.scss';

/**
 * Render the add tile.
 *
 * @param {Object}   props          The component props.
 * @param {string}   props.label    The tile's label (e.g. 'Add color') — no literal `+`, the icon
 *                                  already draws one.
 * @param {Function} props.onClick  Called when the tile is clicked.
 * @param {boolean}  [props.disabled] Whether the tile is disabled — a double-click guard for the
 *                                  duration of this tile's own in-flight add, not a visual busy
 *                                  state.
 *
 * @since TBD
 *
 * @return {JSX.Element} The add tile.
 */
export function AddTile({ label, onClick, disabled = false }) {
	return (
		<button
			type="button"
			className="kadence-blocks-style-library__add-tile"
			onClick={onClick}
			disabled={disabled}
			aria-disabled={disabled}
		>
			<span className="kadence-blocks-style-library__add-tile-content">
				<span className="kadence-blocks-style-library__add-tile-icon-wrap">
					<Icon icon={plus} className="kadence-blocks-style-library__add-tile-icon" />
				</span>
				<span className="kadence-blocks-style-library__add-tile-label">{label}</span>
			</span>
		</button>
	);
}
