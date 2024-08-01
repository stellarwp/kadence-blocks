import { Button } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
export default function SelectBlockButton({ clientId }) {
	const selectBlock = () => {
		wp.data.dispatch('core/block-editor').selectBlock(clientId);
	};
	const { selectedBlockClientId } = useSelect((select) => {
		const { getSelectedBlockClientId } = select('core/block-editor');
		return {
			selectedBlockClientId: getSelectedBlockClientId(),
		};
	});
	return (
		<Button
			className={'block-select'}
			isPressed={selectedBlockClientId === clientId}
			icon="admin-generic"
			iconSize={14}
			onClick={selectBlock}
		/>
	);
}
