/**
 * A per-side box field (BORDER / RADIUS / PADDING / MARGIN): linked, a single `token-select` for
 * all four sides (value is a token-id string); unlinked, a 2x2 grid of per-side `token-select`s.
 * `field.leadingIcon` (a corner mark for radius, a line mark for width) reaches the linked
 * `token-select` — schema data, never hardcoded here.
 *
 * **Unlinked value is a 4-element positional array, `[top, right, bottom, left]`** — not a named
 * `{top, right, bottom, left}` object. This matches the preset per-corner storage already shipped
 * elsewhere in this codebase (verified against that code, not just its design doc, which still
 * describes a superseded "1 or 4 slots" shape — the shipped version requires exactly 4, so a
 * scalar is the only way to say "every corner"). Four identical slots collapse to the scalar form.
 * The SAME index order serves RADIUS: index 0 is "top" for a side property and "top-left" for
 * radius, both walking clockwise from the same starting point (verified against Kadence's own
 * measurement control — inspiration only, nothing imported), so one array needs no per-property
 * branching.
 *
 * The trailing slot is a CLUSTER: a would-be breakpoint switcher renders before the link button
 * (matching the editor's own reference control's trailing group). `box-sides` is not in
 * `RESPONSIVE_CAPABLE_FIELD_TYPES` though — an array is still `typeof 'object'`, so
 * `readResponsiveSlot`/`writeResponsiveSlot` can't tell an unlinked array from the responsive
 * envelope object; the hook call below is a no-op passthrough today, kept to prove the cluster
 * composes.
 */

/**
 * WordPress dependencies
 */
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { link, linkOff } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { useResponsiveFieldValue } from '../../../hooks/use-responsive-field-value';
import { FieldLabel } from './FieldLabel';
import { TokenSelectField } from './TokenSelectField';
import './BoxSidesField.scss';

/**
 * The four box sides, index-aligned with the unlinked value array.
 *
 * @since TBD
 */
const SIDES = ['top', 'right', 'bottom', 'left'];

/**
 * Side labels, capitalized for the per-side `token-select` label.
 *
 * @since TBD
 */
const SIDE_LABELS = {
	top: __('Top', 'kadence-blocks'),
	right: __('Right', 'kadence-blocks'),
	bottom: __('Bottom', 'kadence-blocks'),
	left: __('Left', 'kadence-blocks'),
};

/**
 * Render a box-sides field.
 *
 * @param {Object}                    props          The component props.
 * @param {Object}                    props.field    The field definition
 *                                                    ({ label, tokenType, leadingIcon, readOnly }).
 * @param {string|Array<string>}      props.value    The linked (string) or unlinked (4-element
 *                                                    `[top, right, bottom, left]` array) value.
 * @param {Function}                  props.onChange Called with the new value on edit; never called when read-only.
 *
 * @since TBD
 *
 * @return {JSX.Element} The field.
 */
export function BoxSidesField({ field, value: rawValue, onChange: rawOnChange }) {
	const { value, onChange, switcher } = useResponsiveFieldValue(field, rawValue, rawOnChange);
	const isLinked = typeof value !== 'object' || value === null;

	const toggleLinked = () => {
		if (field.readOnly) {
			return;
		}

		if (isLinked) {
			onChange(SIDES.map(() => value || ''));
		} else {
			onChange(value[0] || '');
		}
	};

	return (
		<div className="kadence-blocks-style-library__field kadence-blocks-style-library__field--box-sides">
			<FieldLabel
				trailing={
					<div className="kadence-blocks-style-library__field-trailing-cluster">
						{switcher}
						<Button
							icon={isLinked ? link : linkOff}
							label={isLinked ? __('Unlink sides', 'kadence-blocks') : __('Link sides', 'kadence-blocks')}
							isPressed={isLinked}
							disabled={field.readOnly}
							onClick={toggleLinked}
						/>
					</div>
				}
			>
				{field.label}
			</FieldLabel>
			{isLinked ? (
				<TokenSelectField
					field={{ tokenType: field.tokenType, leadingIcon: field.leadingIcon, readOnly: field.readOnly }}
					value={value || ''}
					onChange={onChange}
				/>
			) : (
				<div className="kadence-blocks-style-library__field-box-sides-grid">
					{SIDES.map((side, index) => (
						<TokenSelectField
							key={side}
							field={{ label: SIDE_LABELS[side], tokenType: field.tokenType, readOnly: field.readOnly }}
							value={value[index] || ''}
							onChange={(next) => {
								const nextSides = [...value];
								nextSides[index] = next;
								onChange(nextSides);
							}}
						/>
					))}
				</div>
			)}
		</div>
	);
}
