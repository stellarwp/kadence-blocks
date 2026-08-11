/**
 * A design-token picker field (e.g. `Large 2px`, `Normal`): shows the chosen token's name and
 * resolved value, opens a list of every token pickable for `field.tokenType`. Reads the
 * pickable-token pool through `helpers/tokens.js#pickableTokensForType`, this app's own accessor —
 * it stays independent of the editor's token-picker module even though PHP attaches the same
 * underlying payload to both. A pick writes the token id, never the resolved value.
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { pickableTokensForType } from '../../../helpers/tokens';
import { SelectDropdown } from '../SelectDropdown';
import { FieldLabel } from './FieldLabel';
import './TokenSelectField.scss';

/**
 * Render a token-select field.
 *
 * @param {Object}                              props              The component props.
 * @param {Object}                              field              The field definition.
 * @param {string}                              field.tokenType    The DTCG `$type` to filter the pickable pool to.
 * @param {?string}                              [field.role]       When given, also narrows the pool to this token role (e.g. `'radius'`).
 * @param {?string}                              [field.label]      The field's own `FieldLabel` text; omitted when the caller supplies its own.
 * @param {?import('@wordpress/icons').IconType} [field.leadingIcon] A glyph rendered before the selected value — schema data, not hardcoded.
 * @param {boolean}                              [field.readOnly]   Whether the control is non-interactive.
 * @param {string}                               props.value        The selected token id.
 * @param {Function}                             props.onChange     Called with the new token id on pick; never called when read-only.
 *
 * @since TBD
 *
 * @return {JSX.Element} The field.
 */
export function TokenSelectField({ field, value, onChange }) {
	const tokens = pickableTokensForType(field.tokenType, field.role);
	const options = tokens.map((token) => ({
		value: token.id,
		label: (
			<>
				<span className="kadence-blocks-style-library__field-token-select-name">{token.label}</span>
				{token.value && (
					<span className="kadence-blocks-style-library__field-token-select-value">{token.value}</span>
				)}
			</>
		),
	}));

	return (
		<div
			className="kadence-blocks-style-library__field kadence-blocks-style-library__field--token-select"
			style={field.readOnly ? { pointerEvents: 'none', opacity: 0.6 } : undefined}
		>
			{field.label && <FieldLabel>{field.label}</FieldLabel>}
			<SelectDropdown
				value={value}
				options={options}
				leadingIcon={field.leadingIcon}
				valueLabel={value ? __('Custom', 'kadence-blocks') : ''}
				onChange={(next) => !field.readOnly && onChange(next)}
			/>
		</div>
	);
}
