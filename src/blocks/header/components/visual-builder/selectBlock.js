import { Button } from '@wordpress/components';

export default function SelectBlockButton({ clientId }) {
	const selectBlock = () => {
		wp.data.dispatch('core/block-editor').selectBlock(clientId);
	};

	return <Button className={'block-select'} icon="admin-generic" iconSize={14} onClick={selectBlock} />;
}
