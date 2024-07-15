/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button, Popover } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import { POPOVER_TUTORIAL_OPTIONS, POPOVER_TUTORIAL_OPTIONS_CONTENT } from '../constants';
import './editor.scss';

export default function HeaderOnboard(props) {
	const { headerRef } = props;

	// Use internal state instead of a ref to make sure that the component
	// re-renders when the popover's anchor updates.
	const [onboardingFinished, setOnboardingFinished] = useState(true);
	const [popoverTutorialStep, setPopoverTutorialStep] = useState(0);
	const [popoverTutorialComplete, setPopoverTutorialComplete] = useState(true);

	const hasCompletedPopoverTutorial = false;
	const key = 'basic';
	const popoverTutorialOptions = POPOVER_TUTORIAL_OPTIONS?.[key];

	useEffect(() => {
		const settingModel = new wp.api.models.Settings();
		settingModel.fetch().then((response) => {
			if (response) {
				const setting = response?.kadence_blocks_header_popover_tutorial_complete;
				setPopoverTutorialComplete(setting !== undefined ? setting : false);
			}
		});
	}, []);

	const savePopoverTutorialComplete = (status) => {
		setPopoverTutorialComplete(true);
		const settingModel2 = new wp.api.models.Settings({
			kadence_blocks_header_popover_tutorial_complete: status,
		});
		settingModel.save();
		// settingModel2.save().then((response) => {
		// 	console.log(3, response);
		// 	createSuccessNotice(__('Totorial completed', 'kadence-blocks'), {
		// 		type: 'snackbar',
		// 	});
		// });
	};

	const popoverStepContent = () => {
		if (popoverTutorialOptions) {
			const popoverTutorialOption = popoverTutorialOptions[popoverTutorialStep];
			return (
				<Popover
					// noArrow={false}
					placement={popoverTutorialOption?.placement ?? 'bottom-end'}
					anchor={headerRef}
					className={'kb-header-popover'}
					variant={'unstyled'}
					key={'popover-' + popoverTutorialStep}
				>
					<h2 className={'kb-header-popover-title'}>
						{POPOVER_TUTORIAL_OPTIONS_CONTENT[popoverTutorialOption.key].title}
					</h2>
					<p className={'kb-header-popover-content'}>
						{POPOVER_TUTORIAL_OPTIONS_CONTENT[popoverTutorialOption.key].content}
					</p>
					<div className={'kb-header-popover-lower'}>
						<div className={'kb-header-popover-step'}>
							<b>
								{popoverTutorialStep + 1} / {popoverTutorialOptions.length}
							</b>
						</div>
						<div className={'kb-header-popover-btns'}>
							<Button
								className={'kb-header-popover-btn kb-header-popover-btn-next'}
								variant="primary"
								onClick={() => {
									if (popoverTutorialStep + 1 == popoverTutorialOptions.length) {
										savePopoverTutorialComplete(true);
									} else {
										setPopoverTutorialStep(popoverTutorialStep + 1);
									}
								}}
							>
								<b>
									{popoverTutorialStep + 1 == popoverTutorialOptions.length && <>Finish</>}
									{popoverTutorialStep + 1 != popoverTutorialOptions.length && <>Next</>}
								</b>
							</Button>
						</div>
					</div>
				</Popover>
			);
		}
		return <></>;
	};

	return (
		<>
			{/* {popoverTutorialComplete && (
				<Button variant="secondary" onClick={() => setPopoverTutorialComplete(false)}>
					Start popover tutorial
				</Button>
			)} */}
			{!popoverTutorialComplete && <>{popoverStepContent()}</>}
		</>
	);
}
