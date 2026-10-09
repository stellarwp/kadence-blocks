/**
 * `ColorControl`'s Style Library tab body: the active palette's groups, each row's swatch sitting at
 * the row's right edge (a check mark overlaid on it for the current pick) rather than at the left the
 * way a plain token row's icon does — the swatch IS the row's own identifying mark here, so it plays
 * the role a trailing value normally would. Passed to `TokenPopover` via its `renderList` prop, in
 * place of the flat token list every other control shows.
 *
 * The check mark's own color is chosen per swatch (`readableMarkColor`) rather than fixed, since a
 * palette's colors span the whole lightness range and one hardcoded mark color would vanish against
 * roughly half of them.
 */

/**
 * WordPress dependencies
 */
import { Button } from '@wordpress/components';
import { check, Icon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { ColorSwatch } from '../atoms/ColorSwatch';
import { readableMarkColor } from '../helpers/contrast';

/**
 * The grouped color list.
 *
 * @param {Object}   props
 * @param {Array}    props.groups  `[{ id, label, swatches: [{ id, label, value, alias }] }]`.
 * @param {*}        props.value   The current slot value, so the active swatch shows a check mark.
 * @param {Function} props.onPick  Called with a swatch's `alias` when it is chosen.
 * @param {Function} props.onClose Closes the popover after a choice.
 *
 * @since TBD
 *
 * @return {JSX.Element} The rendered grouped list.
 */
export function ColorGroupList({ groups, value, onPick, onClose }) {
	return (
		<div className="kb-color-control__list">
			{groups.map((group) => (
				<div className="kb-color-control__group" key={group.id}>
					<div className="kb-color-control__group-label">{group.label}</div>
					{group.swatches.map((entry) => {
						const isCurrent = entry.alias === value;
						return (
							<Button
								key={entry.id}
								className="kb-color-control__item"
								onClick={() => {
									onPick(entry.alias);
									onClose();
								}}
							>
								<span className="kb-color-control__item-label">{entry.label}</span>
								<span className="kb-color-control__item-swatch">
									<ColorSwatch entry={entry} />
									{isCurrent && (
										<Icon
											className="kb-color-control__item-check"
											icon={check}
											size={14}
											style={{ color: readableMarkColor(entry.value) }}
										/>
									)}
								</span>
							</Button>
						);
					})}
				</div>
			))}
		</div>
	);
}
