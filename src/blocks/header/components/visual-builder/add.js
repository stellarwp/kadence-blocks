import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import classnames from 'classnames';
import { createBlock } from '@wordpress/blocks';

export default function AddBlockButton({ position, clientId, showMidColumns }) {
	const classNames = classnames({
		'add-item': true,
		[`add-item-${position}`]: true,
		[`add-item-has-mid-columns`]: showMidColumns,
	});

	// TODO: Show add block modal
	const addBlock = () => {
		const random = Math.floor(Math.random() * 1000);
		wp.data
			.dispatch('core/block-editor')
			.insertBlock(createBlock('core/paragraph', { content: 'Random: ' + random }), 0, clientId);
	};

	return (
		<Button
			icon={'plus'}
			className={classNames}
			onClick={() => {
				console.log('Inserting into: ' + clientId);
				addBlock();
			}}
		/>
	);
}
