/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button, Popover } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { closeSmall } from '@wordpress/icons';
import { POPOVER_TUTORIAL_OPTIONS, POPOVER_TUTORIAL_OPTIONS_CONTENT } from '../constants';
import './editor.scss';

export default function PopoverTutorial(props) {
	const { headerRef, formData, isSelected, clientId } = props;

	// Use internal state instead of a ref to make sure that the component
	// re-renders when the popover's anchor updates.
	const [popoverTutorialStep, setPopoverTutorialStep] = useState(0);
	const [popoverTutorialComplete, setPopoverTutorialComplete] = useState(true);

	const key = formData?.headerDesktop ?? 'generic';
	const popoverTutorialOptions = POPOVER_TUTORIAL_OPTIONS?.[key]
		? POPOVER_TUTORIAL_OPTIONS?.[key]
		: POPOVER_TUTORIAL_OPTIONS?.generic;

	useEffect(() => {
		// savePopoverTutorialComplete(false);
		const settingModel = new wp.api.models.Settings();
		settingModel.fetch().then((response) => {
			if (response) {
				const setting = response?.kadence_blocks_header_popover_tutorial_complete;
				setPopoverTutorialComplete(setting !== undefined ? setting : false);
			}
		});
	}, []);

	const { childSelected } = useSelect(
		(select) => {
			const { hasSelectedInnerBlock } = select('core/block-editor');

			return {
				childSelected: hasSelectedInnerBlock(clientId, true),
			};
		},
		[clientId]
	);

	const savePopoverTutorialComplete = (status) => {
		setPopoverTutorialComplete(status);
		const settingModel2 = new wp.api.models.Settings({
			kadence_blocks_header_popover_tutorial_complete: status,
		});
		settingModel2.save();
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
					<p
						className={'kb-header-popover-content'}
						dangerouslySetInnerHTML={{
							__html: POPOVER_TUTORIAL_OPTIONS_CONTENT[popoverTutorialOption.key].content,
						}}
					></p>
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
									{popoverTutorialStep + 1 == popoverTutorialOptions.length && (
										<>{__('Finish', 'kadence-blocks')}</>
									)}
									{popoverTutorialStep + 1 != popoverTutorialOptions.length && (
										<>{__('Next', 'kadence-blocks')}</>
									)}
								</b>
							</Button>
							{popoverTutorialStep > 0 && (
								<Button
									className={'kb-header-popover-btn kb-header-popover-btn-next'}
									variant="tertiary"
									onClick={() => {
										setPopoverTutorialStep(popoverTutorialStep - 1);
									}}
								>
									<b>
										<>{__('Back', 'kadence-blocks')}</>
									</b>
								</Button>
							)}
						</div>
					</div>
					<Button
						className={'kb-header-popover-btn kb-header-popover-btn-close'}
						isSmall
						onClick={() => {
							savePopoverTutorialComplete(true);
						}}
						icon={closeSmall}
						aria-label={__('Close', 'kadence-blocks')}
					/>
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
			{!popoverTutorialComplete && (isSelected || childSelected) && <>{popoverStepContent()}</>}
		</>
	);
}
