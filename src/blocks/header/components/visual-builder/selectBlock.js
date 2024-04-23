import { Button } from '@wordpress/components';

export default function SelectBlockButton({ clientId }) {
	const selectBlock = () => {
		wp.data.dispatch('core/block-editor').selectBlock(clientId);
	};

	return <Button icon="admin-generic" iconSize={16} onClick={selectBlock} />;
}
