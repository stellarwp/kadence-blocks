import { Button } from '@wordpress/components';

export default function SelectBlockButton({ clientId }) {
	const selectBlock = () => {
		console.log('Selecting block with client ID: ' + clientId);
		wp.data.dispatch('core/block-editor').selectBlock(clientId);
	};

	return <Button icon="admin-generic" iconSize={16} onClick={selectBlock} />;
}
