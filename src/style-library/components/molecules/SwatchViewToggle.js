/**
 * The two-button switch between the card grid and the compact list of swatches. It only reports
 * the choice; where the choice is kept is the caller's business.
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import './SwatchViewToggle.scss';

const ICON_PROPS = {
	className: 'kadence-blocks-style-library__swatch-view-toggle-icon',
	viewBox: '0 0 24 24',
	width: 16,
	height: 16,
	fill: 'none',
	stroke: 'currentColor',
	strokeWidth: 2,
	strokeLinecap: 'round',
	strokeLinejoin: 'round',
	'aria-hidden': 'true',
};

/**
 * Render the grid and list view toggle.
 *
 * @param {Object}   props          The component props.
 * @param {string}   props.value    The current mode, `'grid'` or `'list'`.
 * @param {Function} props.onChange Called with the mode of the clicked button.
 *
 * @since TBD
 *
 * @return {JSX.Element} The toggle.
 */
export function SwatchViewToggle({ value, onChange }) {
	const buttonClass = (mode) =>
		classnames('kadence-blocks-style-library__swatch-view-toggle-button', {
			'kadence-blocks-style-library__swatch-view-toggle-button--pressed': value === mode,
		});

	return (
		<div
			className="kadence-blocks-style-library__swatch-view-toggle"
			role="group"
			aria-label={__('Swatch view', 'kadence-blocks')}
		>
			<button
				type="button"
				className={buttonClass('grid')}
				aria-pressed={'grid' === value}
				aria-label={__('Grid view', 'kadence-blocks')}
				onClick={() => onChange('grid')}
			>
				<svg {...ICON_PROPS}>
					<rect x="3" y="3" width="7" height="7" rx="1" />
					<rect x="14" y="3" width="7" height="7" rx="1" />
					<rect x="3" y="14" width="7" height="7" rx="1" />
					<rect x="14" y="14" width="7" height="7" rx="1" />
				</svg>
			</button>
			<button
				type="button"
				className={buttonClass('list')}
				aria-pressed={'list' === value}
				aria-label={__('List view', 'kadence-blocks')}
				onClick={() => onChange('list')}
			>
				<svg {...ICON_PROPS}>
					<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
				</svg>
			</button>
		</div>
	);
}
