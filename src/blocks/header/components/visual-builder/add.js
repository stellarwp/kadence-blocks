import { Inserter } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import classnames from 'classnames';

export default function AddBlockButton({ position, clientId, showMidColumns = false }) {
	const classNames = classnames({
		'add-item': position !== 'off-canvas',
		[`add-item-${position}`]: true,
		[`add-item-has-mid-columns`]: showMidColumns,
	});

	function AddButton({ ...toggleProps }) {
		const { onToggle, disabled, isOpen, blockTitle, hasSingleBlockType } = toggleProps;
		return (
			<Button icon={'plus'} disabled={disabled} onClick={onToggle} className={classNames}>
				{position === 'off-canvas' ? __('Add Block', 'kadence-blocks') : ''}
			</Button>
		);
	}

	return (
		<Inserter
			renderToggle={(toggleProps) => <AddButton {...toggleProps} />}
			rootClientId={clientId}
			position="top center"
			isAppender
			__experimentalIsQuick
		/>
	);
}
