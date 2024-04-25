import { Inserter } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import classnames from 'classnames';

export default function AddBlockButton({ position, clientId, showMidColumns }) {
	const classNames = classnames({
		'add-item': true,
		[`add-item-${position}`]: true,
		[`add-item-has-mid-columns`]: showMidColumns,
	});

	function AddButton({ ...toggleProps }) {
		const { onToggle, disabled, isOpen, blockTitle, hasSingleBlockType } = toggleProps;
		return <Button icon={'plus'} disabled={disabled} onClick={onToggle} className={classNames} />;
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
