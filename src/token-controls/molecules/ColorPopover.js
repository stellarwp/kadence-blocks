/**
 * The popover body every color control opens: a grouped `Style Library` tab (the active palette's
 * Accent/Contrast/Background/Notices groups, in place of the flat token list every other control
 * shows) and a `Custom` tab holding the relocated `ColorPicker`.
 *
 * Split out of `ColorControl` so a control with a different trigger can open the same popover.
 * `ColorControl`'s trigger is a full row — a swatch, the attribute's own static label, and the
 * selected token's label — which does not fit `BorderControl`'s compact row; `ColorSwatchControl`'s
 * is a bare 20px swatch, which cannot carry a `BindingIndicator`. What the two share is everything
 * below the trigger, and that is what lives here.
 */

/**
 * WordPress dependencies
 */
import { Button } from '@wordpress/components';
import { Icon, undo } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { ColorGroupList } from './ColorGroupList';
import { ColorPicker } from './ColorPicker';
import { TokenPopover } from './TokenPopover';
import { colorSelection } from '../helpers/color-selection';
import { isCssVariableReference } from '../helpers/token-summary';

/**
 * Render a color picker's popover body.
 *
 * @param {Object}    props                  The component props.
 * @param {*}         props.value            The current slot value: a bracket alias or a raw literal.
 * @param {Array}     props.groups           `[{ id, label, swatches: [{ id, label, value, alias }] }]`
 *                                            — the active palette's groups, host-resolved.
 * @param {?Function} [props.onClear]        Clears the slot back to unset. Omit for no Clear row.
 * @param {Function}  props.onPick           Called with a token entry's `alias` when one is chosen.
 * @param {Function}  props.onCustom         Called with a literal color from the Custom tab.
 * @param {?Function} [props.resolveLiteral] `(entry) => string` — the host's hook for seeding the
 *                                            Custom tab from a currently-bound token entry.
 * @param {Function}  props.onClose          Closes the popover after a choice.
 *
 * @since TBD
 *
 * @return {JSX.Element} The rendered popover body.
 */
export function ColorPopover({ value, groups, onClear = null, onPick, onCustom, resolveLiteral, onClose }) {
	const { allSwatches, entry, initialTab } = colorSelection(groups, value);

	return (
		<TokenPopover
			value={value}
			tokens={allSwatches}
			initialTab={initialTab}
			renderList={({ onPick: pick, onClose: close }) => (
				<>
					{onClear && (
						<Button
							className="kadence-token-field__reset kb-color-control__clear"
							disabled={!value}
							onClick={() => {
								onClear();
								close();
							}}
						>
							<span className="kadence-token-field__reset-label">{__('Clear', 'kadence-blocks')}</span>
							<Icon className="kadence-token-field__reset-icon" icon={undo} size={20} />
						</Button>
					)}
					<ColorGroupList groups={groups} value={value} onPick={pick} onClose={close} />
				</>
			)}
			renderCustom={() => (
				<ColorPicker
					// A CSS-variable literal (the old editor's legacy palette storage shape) is not something
					// `react-color` can parse — handing it over renders black and the first touch overwrites a
					// working color, with no way back. Seeding '' instead opens the picker neutral; the swatch
					// still paints the real color since it renders the literal via CSS `background`.
					color={
						entry && resolveLiteral
							? resolveLiteral(entry)
							: entry || isCssVariableReference(value)
								? ''
								: value
					}
					onChange={onCustom}
				/>
			)}
			onPick={onPick}
			onClose={onClose}
		/>
	);
}
