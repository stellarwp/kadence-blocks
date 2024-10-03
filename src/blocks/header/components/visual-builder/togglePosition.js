import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { chevronUp, chevronDown } from '@wordpress/icons';

export default function ModalTogglePosition({ position, setPosition }) {
	const label = position === 'bottom' ? __('Move to top', 'kadence-blocks') : __('Move to bottom', 'kadence-blocks');

	return (
		<Button
			className={'kb-header-visual-builder-modal-close'}
			aria-label={label}
			onClick={() => {
				setPosition(position === 'bottom' ? 'top' : 'bottom');
			}}
			variant={'secondary'}
			icon={position === 'bottom' ? chevronUp : chevronDown}
			iconSize={18}
		>
			{label}
		</Button>
	);
}
