import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';

export default function ModalClose({ isVisible, setIsVisible }) {
	return (
		<Button
			className={'kb-header-visual-builder-modal-close'}
			aria-label={__('Close Modal', 'kadence-blocks')}
			onClick={() => {
				setIsVisible(!isVisible);
			}}
			isSecondary={true}
			icon={'no-alt'}
			iconSize={20}
		>
			{__('Hide', 'kadence-blocks')}
		</Button>
	);
}
