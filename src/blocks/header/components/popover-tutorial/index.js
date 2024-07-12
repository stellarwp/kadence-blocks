/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button, Popover } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { POPOVER_TUTORIAL_OPTIONS, POPOVER_TUTORIAL_OPTIONS_CONTENT } from '../constants';
import './editor.scss';

export default function HeaderOnboard(props) {
	const { headerRef } = props;

	// Use internal state instead of a ref to make sure that the component
	// re-renders when the popover's anchor updates.
	const [onboardingFinished, setOnboardingFinished] = useState(true);
	const [isPopoverTutorialActive, setIsPopoverTutorialActive] = useState(false);
	const [popoverTutorialStep, setPopoverTutorialStep] = useState(0);

	const hasCompletedPopoverTutorial = false;
	const key = 'basic';
	const popoverTutorialOptions = POPOVER_TUTORIAL_OPTIONS?.[key];

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
										setIsPopoverTutorialActive(false);
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
			{/* {!isPopoverTutorialActive && (
				<Button variant="secondary" onClick={() => setIsPopoverTutorialActive(true)}>
					Start popover tutorial
				</Button>
			)} */}
			{isPopoverTutorialActive && <>{popoverStepContent()}</>}
		</>
	);
}
