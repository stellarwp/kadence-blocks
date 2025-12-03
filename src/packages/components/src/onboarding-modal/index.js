import { __, sprintf } from '@wordpress/i18n';
import { useEffect, useState, createElement } from '@wordpress/element';
import { Button, Modal, Dashicon } from '@wordpress/components';

import './editor.scss';

const OnboardingModal = ({ steps, isOpen, onRequestClose, onSubmit }) => {
	const [currentStep, setCurrentStep] = useState(0);
	const [formData, setFormData] = useState({ meta: { isValid: true } });

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

	const handleChange = (data) => {
		setFormData((prevData) => ({ ...prevData, ...data }));
	};

	const handleFinish = () => {
		delete formData.meta;
		onSubmit(formData);
		onRequestClose({ complete: true });
	};

	const handleClose = () => {
		delete formData.meta;
		onRequestClose({ complete: false });
	};

	useEffect(() => {
		if (
			Number.isInteger(formData?.meta?.exitAndCallbackStep) &&
			formData?.meta?.exitAndCallbackStep === currentStep
		) {
			handleFinish();
		}
	}, [formData, currentStep]);

	// Scroll to top on step change
	useEffect(() => {
		const elements = document.getElementsByClassName('has-scrolled-content');
		for (let i = 0; i < elements.length; i++) {
			elements[i].scrollTo(0, 0);
		}
	}, [currentStep]);

	if (!isOpen) {
		return;
	}

	return (
		<Modal
			className={'kadence-onboarding-modal'}
			isDismissible={false}
			__experimentalHideHeader={true}
			size={'fill'}
			onRequestClose={onRequestClose}
		>
			<div className={'header'} style={ steps[currentStep]?.containerData?.headerStyle }>
				<img
					src={kadence_blocks_params.kadenceBlocksUrl + '/includes/settings/img/kadence-logo.png'}
					alt={'Kadence Blocks'}
				/>
				<div className={'close'} onClick={handleClose}>
					<Dashicon icon="no-alt" />
				</div>
			</div>
			<div key={currentStep}>
				{createElement(steps[currentStep].component, {
					data: formData,
					componentData: steps[currentStep].componentData,
					onChange: (data) => handleChange(data),
					handleNextStep,
					handlePreviousStep,
					handleFinish,
				})}
			</div>
			<div className={'footer'}>
				<div className={'back'}>
					<Button onClick={handlePreviousStep} icon={'arrow-left-alt'} disabled={currentStep === 0}>
						{__('Back', 'kadence-blocks')}
					</Button>
				</div>

				<div className={'step-indicator'}>
					{steps[currentStep]?.hideSteps
						? null
						: steps.map((step, index) => {
								if (!step?.hideSteps) {
									return (
										<div key={index} className={`step ${index === currentStep ? 'active' : ''}`}>
											<div className={'number'}>{step.visualNumber}</div>
											{/* translators: %s: onboarding step name */}
											{sprintf( __('%s', 'kadence-blocks'), step.name )}
										</div>
									);
								}
								return null;
						  })}
				</div>

				<div className={'next'}>
					{currentStep < steps.length - 1 ? (
						<Button isPrimary={true} disabled={!formData.meta.isValid} onClick={handleNextStep}>
							{formData.meta?.nextText ? formData.meta.nextText : __('Next', 'kadence-blocks')}
						</Button>
					) : (
						<Button isPrimary={true} onClick={handleFinish}>
							{__('Finish', 'kadence-blocks')}
						</Button>
					)}
				</div>
			</div>
		</Modal>
	);
};

export default OnboardingModal;
