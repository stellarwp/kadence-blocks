/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { BaseControl, Button, Flex, FlexItem, Icon } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Chip } from '../chip';
import './chips-input.scss';
import { LoadingDots, Sparkle } from '../icons';
import { KEYWORD_SUGGESTION_STATES } from '../../constants';

export function ChipsInput(props) {
	const {
		id,
		tags,
		maxTags,
		selectedTags,
		suggestedKeywords,
		suggestedKeywordsState,
		children,
		placeholder,
		onSuggestedKeywordAdded,
		onTryAgain,
		onTagDeleted,
		...baseProps
	} = props;

	const internalId = id ? `inspector-chips-input-control-${id}` : '';
	const [inputValue, setInputValue] = useState('');
	const [inputRef, setInputRef] = useState();

	function handleTagDelete(tag) {
		const newSelectedTags = [...tags];
		newSelectedTags.splice(newSelectedTags.indexOf(tag), 1);
		selectedTags(newSelectedTags);
		onTagDeleted(tag);
	}

	function maybeUpdateTags() {
		const trimmedInput = inputValue.replace(',', '').trim();
		const newSelectedItems = [...tags];

		if (trimmedInput.length === 0) {
			return;
		}

		const duplicatedValues = newSelectedItems.indexOf(trimmedInput);
		if (duplicatedValues !== -1) {
			setInputValue('');
			return;
		}

		newSelectedItems.push(trimmedInput);
		selectedTags(newSelectedItems);
		setInputValue('');
	}

	function handleKeyDown(evt) {
		const isEnter = evt.key === 'Enter';
		const isComma = evt.key === ',';

		if (isEnter || isComma) {
			evt.preventDefault();
			maybeUpdateTags();
		}
	}

	function handleOnBlur(evt) {
		evt.preventDefault();
		maybeUpdateTags();
	}

	function handleInputChange(value) {
		if (value !== ' ' && value !== ',') {
			setInputValue(value);
		}
	}

	function addSuggestedKeyword(keyword) {
		if (tags.length >= maxTags) {
			return;
		}
		const newSelectedItems = [...tags];
		newSelectedItems.push(keyword);
		selectedTags(newSelectedItems);
		setInputValue('');
		onSuggestedKeywordAdded(keyword);
	}

	return (
		<BaseControl className={'stellarwp-chips-input'} id={internalId} {...baseProps}>
			<div className="stellarwp-chips-input__control" onClick={() => inputRef && inputRef.focus()}>
				{Array.isArray(tags) &&
					tags.map((tag, index) => (
						<Chip key={index} text={tag} className="chip--blue" onDelete={() => handleTagDelete(tag)} />
					))}
				{Array.isArray(tags) && tags.length < maxTags && (
					<input
						id={internalId}
						ref={setInputRef}
						className="stellarwp-chips-input__input"
						type="text"
						value={inputValue}
						onKeyUp={handleKeyDown}
						onBlur={handleOnBlur}
						onChange={(e) => handleInputChange(e.target.value)}
						placeholder={placeholder && tags.length < maxTags ? placeholder : ''}
					/>
				)}
			</div>

			{suggestedKeywordsState !== KEYWORD_SUGGESTION_STATES.allAdded && (
				<div className="stellarwp-chips-input__suggestions">
					{(() => {
						switch (suggestedKeywordsState) {
							case KEYWORD_SUGGESTION_STATES.loading:
								return (
									<div className="stellarwp-chips-input__suggestions-loading">
										<Icon icon={Sparkle} />
										{__('Kadence is looking for Keyword Suggestions', 'kadence-blocks')}
										<Icon icon={LoadingDots} />
									</div>
								);
							case KEYWORD_SUGGESTION_STATES.success:
								return (
									<>
										<div className="stellarwp-chips-input__suggestions-title">
											{__('Suggested Keywords', 'kadence-blocks')}
										</div>
										<ul className="stellarwp-chips-input__suggestions-list">
											{suggestedKeywords.map((keyword, index) => (
												<li
													key={`${keyword}`}
													className="stellarwp-chips-input__suggestions-list-item"
												>
													<button
														onClick={() => addSuggestedKeyword(keyword)}
														className="stellarwp-chips-input__suggestions-button"
													>
														{keyword}
													</button>
												</li>
											))}
										</ul>
									</>
								);
							case KEYWORD_SUGGESTION_STATES.notFound:
								return (
									<>
										<div className="stellarwp-chips-input__suggestions-title">
											{__('We couldn’t find any good Keywords.', 'kadence-blocks')}
										</div>
										<div className="stellarwp-chips-input__suggestions-description">
											{__(
												"No worries, you can add your own keywords. Make sure to use words that directly relate to your website's content and what you do. The more the better.",
												'kadence-blocks'
											)}
										</div>
									</>
								);
							case KEYWORD_SUGGESTION_STATES.error:
								return (
									<Flex>
										<FlexItem>
											<div className="stellarwp-chips-input__suggestions-title">
												{__('Oops! Something went wrong.', 'kadence-blocks')}
											</div>
										</FlexItem>
										<FlexItem>
											<Button
												onClick={onTryAgain}
												variant="link"
												className="stellarwp-chips-input__suggestions-try-button"
											>
												{__('Try again.', 'kadence-blocks')}
											</Button>
										</FlexItem>
									</Flex>
								);
							default:
								return <></>;
						}
					})()}
				</div>
			)}
		</BaseControl>
	);
}
