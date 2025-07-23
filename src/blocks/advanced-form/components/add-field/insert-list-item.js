/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { useMemo, useRef, memo } from '@wordpress/element';
import { BlockIcon } from '@wordpress/block-editor';
import { __experimentalTruncate as Truncate, Button } from '@wordpress/components';
import { ENTER, isAppleOS } from '@wordpress/keycodes';

function InserterListItem({ className, item, onSelect, ...props }) {
	const itemIconStyle = item.icon
		? {
				backgroundColor: item.icon.background,
				color: item.icon.foreground,
			}
		: {};

	return (
		<div className={classnames('block-editor-block-types-list__list-item', 'kb-custom-insert__list-item')}>
			<Button
				className={classnames('block-editor-block-types-list__item', className)}
				disabled={item.isDisabled}
				onClick={(event) => {
					event.preventDefault();
					onSelect(item, isAppleOS() ? event.metaKey : event.ctrlKey);
				}}
				onKeyDown={(event) => {
					const { keyCode } = event;
					if (keyCode === ENTER) {
						event.preventDefault();
						onSelect(item, isAppleOS() ? event.metaKey : event.ctrlKey);
					}
				}}
				{...props}
			>
				<span className="block-editor-block-types-list__item-icon" style={itemIconStyle}>
					<BlockIcon icon={item.icon} showColors />
				</span>
				<span className="block-editor-block-types-list__item-title">
					<Truncate numberOfLines={3}>{item.title}</Truncate>
				</span>
			</Button>
		</div>
	);
}

export default memo(InserterListItem);
