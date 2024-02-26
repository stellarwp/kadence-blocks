/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import { Button, Flex, FlexItem, Icon, __experimentalView as View } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { TextareaControl } from '../textarea-control';
import { ProgressBar } from '../progress-bar';
import './textarea-progress.scss';
import { Check, LoadingDots, Sparkle } from '../icons';
import { __ } from '@wordpress/i18n';

export function TextareaProgress(props) {
	const { progressBarProps, value, initialHeight = 300, aiLoading, aiSuggestion, onUndo, onAccept, ...rest } = props;
	const [inputRef, setInputRef] = useState(null);

	useEffect(() => {
		if (inputRef) {
			resizeTextarea(inputRef);
		}
	}, [inputRef, value]);

	function resizeTextarea(inputRef) {
		if (inputRef) {
			const textArea = inputRef.querySelector('textarea');
			// We need to reset the height momentarily to get the correct scrollHeight for the textarea
			textArea.style.height = '0px';
			const newHeight = textArea.scrollHeight > initialHeight ? textArea.scrollHeight : initialHeight;

			// We then set the height directly, outside of the render loop
			// Trying to set this with state or a ref will product an incorrect value.
			textArea.style.height = newHeight + 'px';
		}
	}

	return (
		<div
			className={`stellarwp-textarea-progress ${
				aiSuggestion ? 'stellarwp-textarea-progress--suggestion-active' : ''
			}`}
		>
			<TextareaControl ref={setInputRef} {...rest} value={aiSuggestion || value} />
			{!(aiSuggestion || aiLoading) && (
				<div className="stellarwp-ai-about-character-limits">{value.length}/1000</div>
			)}
			{!aiSuggestion && <ProgressBar {...progressBarProps} />}
			{(aiSuggestion || aiLoading) && (
				<Flex className="stellarwp-textarea-progress__actions">
					{aiLoading && (
						<FlexItem>
							<View className="stellarwp-textarea-progress__ai-loading">
								<Icon icon={Sparkle} />
								{`${__('Kadence AI is writing', 'kadence-blocks')}`}
								<Icon icon={LoadingDots} />
							</View>
						</FlexItem>
					)}
					{aiSuggestion && !aiLoading && (
						<>
							<FlexItem>
								<Button
									className="stellarwp-textarea-progress__undo-button"
									variant="link"
									onClick={onUndo}
								>
									{`${__('Undo', 'kadence-blocks')}`}
								</Button>
							</FlexItem>
							<FlexItem>
								<Button
									className="stellarwp-textarea-progress__approve-button"
									icon={Check}
									variant="link"
									onClick={onAccept}
								>
									{`${__('Use This Copy', 'kadence-blocks')}`}
								</Button>
							</FlexItem>
						</>
					)}
				</Flex>
			)}
		</div>
	);
}
