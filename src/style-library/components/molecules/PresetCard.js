/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { DragHandle } from '../atoms/DragHandle';
import './PresetCard.scss';

/**
 * Render a preset card.
 *
 * @param {Object}       props                   The component props.
 * @param {string}       props.id                The stable card id (also the dnd-kit sortable id).
 * @param {string}       props.label             The preset name.
 * @param {?JSX.Element} [props.preview]         The preview area's content.
 * @param {boolean}      [props.isDefault]       Whether the Default badge renders.
 * @param {boolean}      [props.isTheme]         Whether the "From theme" badge renders: the preset was
 *                                               discovered from the active theme rather than shipped or
 *                                               created here.
 * @param {boolean}      [props.isSelected]      Whether the card shows the selected treatment.
 * @param {Function}     props.onSelect          Called with the card id on click.
 * @param {boolean}      [props.isDraggable]     Whether the drag handle renders.
 * @param {boolean}      [props.isDragging]      Whether this card is the one being dragged, which
 *                                               renders it as an empty drop-target placeholder.
 * @param {Object}       [props.dragHandleProps] The dnd-kit listeners/attributes for the handle.
 * @param {Function}     [props.innerRef]        The dnd-kit node ref for the card's root element.
 * @param {Object}       [props.wrapperStyle]    The dnd-kit transform/transition style.
 *
 * @since TBD
 *
 * @return {JSX.Element} The card.
 */
export function PresetCard({
	id,
	label,
	preview = null,
	isDefault = false,
	isTheme = false,
	isSelected = false,
	onSelect,
	isDraggable = false,
	isDragging = false,
	dragHandleProps,
	innerRef,
	wrapperStyle,
}) {
	return (
		<li
			ref={innerRef}
			style={wrapperStyle}
			className={classnames('kadence-blocks-style-library__preset-card', {
				'kadence-blocks-style-library__preset-card--selected': isSelected,
				'kadence-blocks-style-library__preset-card--placeholder': isDragging,
			})}
		>
			<button
				type="button"
				className="kadence-blocks-style-library__preset-card-main"
				aria-current={isSelected ? 'true' : undefined}
				onClick={() => onSelect(id)}
			>
				<span className="kadence-blocks-style-library__preset-card-title">{label}</span>
				<span className="kadence-blocks-style-library__preset-card-preview">{preview}</span>
			</button>
			{isDefault && (
				<span className="kadence-blocks-style-library__preset-card-badge">
					{__('Default', 'kadence-blocks')}
				</span>
			)}
			{isTheme && (
				<span className="kadence-blocks-style-library__preset-card-badge kadence-blocks-style-library__preset-card-badge--theme">
					{__('From theme', 'kadence-blocks')}
				</span>
			)}
			{isDraggable && <DragHandle handleProps={dragHandleProps} />}
		</li>
	);
}
