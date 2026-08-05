/**
 * A compact three-way breakpoint switcher (desktop / tablet / mobile). Each responsive-capable
 * field renders its own instance in its own `FieldLabel` trailing slot
 * (`hooks/use-responsive-field-value.js`).
 *
 * Icons are dashicons, per the owner (matching the Kadence editor's own device toggle) —
 * `Asset_Loader::enqueue()` declares the `dashicons` style dependency for them. Each glyph is
 * `aria-hidden` since the button already carries its own accessible name.
 *
 * Active state is color alone, same as the reference control — color-only state fails for
 * color-blind users, so this is covered non-visually instead: real `role="radio"`/`aria-checked`
 * and a visible keyboard focus ring.
 */

/**
 * WordPress dependencies
 */
import { useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import './BreakpointSwitcher.scss';

/**
 * The dashicon glyph name per breakpoint step. `smartphone`, not `mobile` — there is no
 * `dashicons-mobile`.
 *
 * @since TBD
 */
const BREAKPOINT_DASHICONS = { desktop: 'desktop', tablet: 'tablet', mobile: 'smartphone' };

/**
 * The accessible name per breakpoint step, announced by assistive tech regardless of icon color.
 *
 * @since TBD
 */
const BREAKPOINT_LABELS = {
	desktop: __('Desktop', 'kadence-blocks'),
	tablet: __('Tablet', 'kadence-blocks'),
	mobile: __('Mobile', 'kadence-blocks'),
};

/**
 * Render the breakpoint switcher: an ARIA radio group with roving `tabIndex`; Left/Right/Up/Down
 * both move focus and change the selection.
 *
 * @param {Object}   props             The component props.
 * @param {string[]} props.breakpoints The breakpoint steps to render, in order (`BREAKPOINTS`).
 * @param {string}   props.breakpoint  The active breakpoint.
 * @param {Function} props.onChange    Called with the newly selected breakpoint.
 *
 * @since TBD
 *
 * @return {JSX.Element} The switcher.
 */
export function BreakpointSwitcher({ breakpoints, breakpoint, onChange }) {
	const buttonRefs = useRef([]);

	const moveTo = (nextIndex) => {
		const step = breakpoints[nextIndex];

		onChange(step);
		buttonRefs.current[nextIndex]?.focus();
	};

	const handleKeyDown = (event, index) => {
		if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
			event.preventDefault();
			moveTo((index + 1) % breakpoints.length);
		} else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
			event.preventDefault();
			moveTo((index - 1 + breakpoints.length) % breakpoints.length);
		}
	};

	return (
		<div
			className="kadence-blocks-style-library__breakpoint-switcher"
			role="radiogroup"
			aria-label={__('Breakpoint', 'kadence-blocks')}
		>
			{breakpoints.map((step, index) => {
				const isActive = breakpoint === step;

				return (
					<button
						key={step}
						ref={(el) => (buttonRefs.current[index] = el)}
						type="button"
						role="radio"
						aria-checked={isActive}
						aria-label={BREAKPOINT_LABELS[step] || step}
						tabIndex={isActive ? 0 : -1}
						className="kadence-blocks-style-library__breakpoint-switcher-button"
						onClick={() => onChange(step)}
						onKeyDown={(event) => handleKeyDown(event, index)}
					>
						<span
							className={`dashicons dashicons-${BREAKPOINT_DASHICONS[step]} kadence-blocks-style-library__breakpoint-switcher-icon`}
							aria-hidden="true"
						/>
					</button>
				);
			})}
		</div>
	);
}
