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
		>
			{__('Hide', 'kadence-blocks')}
			<svg
				viewBox="0 0 24 24"
				fill="none"
				width={'25px'}
				height={'25px'}
				stroke="currentColor"
				xmlns="http://www.w3.org/2000/svg"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<line x1="18" y1="6" x2="6" y2="18"></line>
				<line x1="6" y1="6" x2="18" y2="18"></line>
			</svg>
		</Button>
	);
}
