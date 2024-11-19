import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { closeSmall } from '@wordpress/icons';

export default function ModalClose({ isVisible, setIsVisible }) {
	return (
		<Button
			className={'kb-header-visual-builder-modal-close'}
			aria-label={__('Close Modal', 'kadence-blocks')}
			onClick={() => {
				setIsVisible(!isVisible);
			}}
			variant={'secondary'}
			icon={closeSmall}
			iconSize={18}
		>
			{__('Hide', 'kadence-blocks')}
		</Button>
	);
}
