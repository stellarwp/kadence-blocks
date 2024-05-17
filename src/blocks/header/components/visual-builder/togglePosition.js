import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';

export default function ModalTogglePosition({ position, setPosition }) {
	const label = position === 'bottom' ? __('Move to top', 'kadence-blocks') : __('Move to bottom', 'kadence-blocks');

	return (
		<Button
			className={'kb-header-visual-builder-modal-close'}
			aria-label={label}
			onClick={() => {
				setPosition(position === 'bottom' ? 'top' : 'bottom');
			}}
			isSecondary={true}
			icon={position === 'bottom' ? 'arrow-up-alt2' : 'arrow-down-alt2'}
			iconSize={20}
			isLink={true}
		>
			{label}
		</Button>
	);
}
