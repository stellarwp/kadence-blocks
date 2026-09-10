/**
 * A round-swatch token color picker (e.g. Button's Text / Background rows): a bordered row whose
 * toggle is the field's own name beside a swatch of the currently selected token's resolved color,
 * opening a menu of every pickable color token — each option showing its own swatch, label, and
 * resolved value. Closes the gap between `ColorListField` (writes a raw CSS string, no token
 * reference) and `TokenSelectField` (writes a token id but renders no swatch): this field writes a
 * token id AND shows its color.
 *
 * Built on the same `Dropdown`/`MenuGroup`/`MenuItem` primitives `SelectDropdown` and
 * `ColorListField` use, rather than `SelectDropdown` itself — that component's toggle always shows
 * the *active option's* label, but this field's toggle must keep showing its own name (e.g. "Text"),
 * never the selected color's name.
 */

/**
 * WordPress dependencies
 */
import { Dropdown, MenuGroup, MenuItem } from '@wordpress/components';
import { Icon, check } from '@wordpress/icons';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { getDesignTokensFeed, pickableTokensForType } from '../../../helpers/tokens';
import { resolveSwatchColor } from '../../../helpers/presets';
import './TokenColorSelectField.scss';

/**
 * Render a token-color-select field.
 *
 * @param {Object}   props          The component props.
 * @param {Object}   field          The field definition.
 * @param {string}   field.label    The field's own name, shown on the toggle (e.g. "Text").
 * @param {boolean}  [field.readOnly] Whether the control is non-interactive.
 * @param {string}   props.value    The selected token id.
 * @param {Function} props.onChange Called with the new token id on pick; never called when read-only.
 *
 * @since TBD
 *
 * @return {JSX.Element} The field.
 */
export function TokenColorSelectField({ field, value, onChange }) {
	const options = pickableTokensForType('color');
	const feed = getDesignTokensFeed();
	const swatchColor = resolveSwatchColor(options, feed?.values, value);

	return (
		<div className="kadence-blocks-style-library__field kadence-blocks-style-library__field--token-color-select">
			<Dropdown
				className="kadence-blocks-style-library__field-token-color-select-dropdown"
				popoverProps={{ placement: 'left-start' }}
				renderToggle={({ isOpen, onToggle }) => (
					<button
						type="button"
						className="kadence-blocks-style-library__field-token-color-select-toggle"
						aria-expanded={isOpen}
						// translators: %s: the field's own name (e.g. "Background").
						aria-label={sprintf(__('%s color', 'kadence-blocks'), field.label)}
						disabled={field.readOnly}
						onClick={onToggle}
					>
						<span
							className="kadence-blocks-style-library__field-token-color-select-swatch"
							style={{ background: swatchColor || 'transparent' }}
						/>
						<span className="kadence-blocks-style-library__field-token-color-select-label">
							{field.label}
						</span>
					</button>
				)}
				renderContent={({ onClose }) => (
					<MenuGroup>
						{options.map((option) => {
							const isCurrent = option.id === value;

							return (
								<MenuItem
									key={option.id}
									role="menuitemradio"
									aria-checked={isCurrent}
									suffix={isCurrent ? <Icon icon={check} /> : null}
									onClick={() => {
										onClose();

										if (!field.readOnly && !isCurrent) {
											onChange(option.id);
										}
									}}
								>
									<span
										className="kadence-blocks-style-library__field-token-color-select-option-swatch"
										style={{ background: option.value || 'transparent' }}
									/>
									<span className="kadence-blocks-style-library__field-token-color-select-option-label">
										{option.label}
									</span>
									{option.value && (
										<span className="kadence-blocks-style-library__field-token-color-select-option-value">
											{option.value}
										</span>
									)}
								</MenuItem>
							);
						})}
					</MenuGroup>
				)}
			/>
		</div>
	);
}
