/**
 * WordPress dependencies
 */
import { useEffect, useState } from "@wordpress/element";
import { Button, Flex, FlexItem } from "@wordpress/components";

/**
 * Internal dependencies
 */
import { TextareaControl } from "../textarea-control";
import { ProgressBar } from "../progress-bar";
import "./textarea-progress.scss";
import { Check } from "../icons";

export function TextareaProgress(props) {
	const {
		progressBarProps,
		value,
		initialHeight = 300,
		aiSuggestion,
		onUndo,
		onAccept,
		...rest
	} = props;
	const [inputRef, setInputRef] = useState(null);

	useEffect(() => {
		if (inputRef) {
			resizeTextarea(inputRef);
		}
	}, [inputRef, value]);

	function resizeTextarea(inputRef) {
		if (inputRef) {
			const textArea = inputRef.querySelector("textarea");
			// We need to reset the height momentarily to get the correct scrollHeight for the textarea
			textArea.style.height = "0px";
			const newHeight =
				textArea.scrollHeight > initialHeight
					? textArea.scrollHeight
					: initialHeight;

			// We then set the height directly, outside of the render loop
			// Trying to set this with state or a ref will product an incorrect value.
			textArea.style.height = newHeight + "px";
		}
	}

	return (
		<div
			className={`stellarwp-textarea-progress ${
				aiSuggestion ? "stellarwp-textarea-progress--suggestion-active" : ""
			}`}
		>
			<TextareaControl
				ref={setInputRef}
				{...rest}
				value={aiSuggestion || value}
			/>
			{!aiSuggestion && <ProgressBar {...progressBarProps} />}
			{aiSuggestion && (
				<Flex className="stellarwp-textarea-progress__actions">
					<FlexItem>
						<Button
							className="stellarwp-textarea-progress__undo-button"
							variant="link"
							onClick={onUndo}
						>
							Undo
						</Button>
					</FlexItem>
					<FlexItem>
						<Button
							className="stellarwp-textarea-progress__approve-button"
							icon={Check}
							variant="link"
							onClick={onAccept}
						>
							Use This Copy
						</Button>
					</FlexItem>
				</Flex>
			)}
		</div>
	);
}
