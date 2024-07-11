import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import {
	Button,
	Modal,
	Dashicon
} from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';

import './editor.scss';

const OnboardingModal = ({ steps, isOpen, onRequestClose, onSubmit }) => {
	const [currentStep, setCurrentStep] = useState(0);
	const [formData, setFormData] = useState({});

	const handleNextStep = () => {
		if (currentStep < steps.length - 1) {
			setCurrentStep(currentStep + 1);
		}
	};

	const handlePreviousStep = () => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1);
		}
	};

	const handleChange = (stepName, data) => {
		setFormData((prevData) => ({ ...prevData, [stepName]: data }));
	};

	const handleFinish = () => {
		onSubmit(formData);
		onRequestClose();
	};

	if( !isOpen ) {
		return;
	}

	return (
		<Modal className={'kadence-onboarding-modal'} __experimentalHideHeader={true} size={'fill'} onRequestClose={onRequestClose}>
			<div className={'header'}>
				<img src={kadence_blocks_params.kadenceBlocksUrl + '/includes/settings/img/kadence-logo.png'} alt={'Kadence Blocks'} />
				<Dashicon icon="no-alt" />
			</div>
			<div className={'body'}>
				<div>
				<h2>{steps[ currentStep ].name}</h2>

				{React.createElement( steps[ currentStep ].component, {
					data    : formData[ steps[ currentStep ].name ],
					onChange: ( data ) => handleChange( steps[ currentStep ].name, data ),
				} )}
				</div>
			</div>
			<div className={'footer'}>
				<div className={'back'}>
					<Button onClick={handlePreviousStep} icon={'arrow-left-alt'} disabled={currentStep === 0}>{__( 'Back', 'kadence-blocks' )}</Button>
				</div>

				<div className={'step-indicator'}>
					{steps.map( ( step, index ) => (
						<div key={index} className={`step ${index === currentStep ? 'active' : ''}`}>
							<div className={'number'}>{index + 1}</div>
							{__( step.name, 'kadence-blocks' )}
						</div>
					) )}
				</div>

				<div className={'next'}>
					{currentStep < steps.length - 1 ? (
						<Button isPrimary={true} onClick={handleNextStep}>{__( 'Next', 'kadence-blocks' )}</Button>
					) : (
						<Button isPrimary={true} onClick={handleFinish}>{__( 'Finish', 'kadence-blocks' )}</Button>
					)}
				</div>
			</div>
		</Modal>
	);
};

export default OnboardingModal;
