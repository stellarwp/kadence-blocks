import { __ } from '@wordpress/i18n';
import { useState, useEffect, useCallback } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import {
	Popover,
	ToggleControl,
	Button,
	Dropdown,
	ToolbarGroup,
	TextControl,
	DropdownMenu,
	MenuItem,
	MenuGroup,
	Spinner,
	ToolbarButton,
	TextareaControl,
	Icon,
} from '@wordpress/components';
import { BlockControls } from '@wordpress/block-editor';
import { KadencePanelBody } from '@kadence/components';
import { SafeParseJSON } from '@kadence/helpers';
import { chevronRightSmall, close } from '@wordpress/icons';
import { ENTER } from '@wordpress/keycodes';
import { aiIcon, autoFix, notes, subject, check, playlist, chatBubble } from '@kadence/icons';
import { getAIContentHelper } from './fetch-ai';
import { convertStreamDataToJson } from './convert-stream-data-to-json';
import { insert, replace, remove, create, registerFormatType, toggleFormat, applyFormat } from '@wordpress/rich-text';
import { sendEvent } from '../../../extension/analytics/send-event';
const name = 'kadence/ai-text';
const allowedBlocks = ['kadence/advancedheading'];
export const AIText = {
	title: __('Kadence AI', 'kadence-blocks'),
	tagName: 'span',
	className: 'kt-ai-text',
	keywords: [__('ai', 'kadence-blocks'), __('kadence', 'kadence-blocks')],
	attributes: {},
	edit({ activeAttributes, isActive, value, onChange, contentRef }) {
		const isAuthorized = window?.kadence_blocks_params?.isAuthorized;
		const isAIDisabled = window?.kadence_blocks_params?.isAIDisabled ? true : false;
		const data_key = window?.kadence_blocks_params?.proData?.api_key ? kadence_blocks_params.proData.api_key : '';
		const activateLink = window?.kadence_blocks_params?.homeLink ? kadence_blocks_params.homeLink : '';
		const selectedBlock = useSelect((select) => {
			return select('core/block-editor').getSelectedBlock();
		}, []);
		if (undefined === selectedBlock?.name) {
			return null;
		}
		if (isAIDisabled) {
			return null;
		}
		if (selectedBlock && !allowedBlocks.includes(selectedBlock.name)) {
			return null;
		}
		const [prompt, setPrompt] = useState('');
		const [tempPrompt, setTempPrompt] = useState('');
		const [prevPrompt, setPrevPrompt] = useState('');
		const [selectedContent, setSelectedContent] = useState('');
		const [aiSuggestion, setAiSuggestion] = useState('');
		const [isLoading, setIsLoading] = useState(false);
		const [dynamicRows, setDynamicRows] = useState(1);
		const [aiDynamicRows, setAIDynamicRows] = useState(2);
		const [promptCost, setPromptCost] = useState(1);
		const [isToggled, setIsToggled] = useState(false);
		const [credits, setCredits] = useState('');
		const [tempCredits, setTempCredits] = useState('');
		const [error, setError] = useState('');
		const [popoverAnchor, setPopoverAnchor] = useState();
		const [popoverToneAnchor, setPopoverToneAnchor] = useState();
		const [popoverMainAnchor, setPopoverMainAnchor] = useState();
		const [popoverSecondAnchor, setPopoverSecondAnchor] = useState();
		const { getAIContent, getAITransform, getAIEdit, getAvailableCredits } = getAIContentHelper();
		const hasContent = selectedContent && selectedContent.length > 0 ? true : false;
		const [isOpen, setIsOpen] = useState(false);
		const [isToneOpen, setIsToneOpen] = useState(false);
		const activeStorage = SafeParseJSON(localStorage.getItem('kadenceBlocksPrebuilt'), true);
		const savedCredits =
			undefined !== activeStorage?.credits && '' !== activeStorage?.credits && null !== activeStorage?.credits
				? activeStorage.credits
				: 'fetch';
		const currentCredits = '' !== credits ? credits : savedCredits;
		async function getRemoteAvailableCredits() {
			const response = await getAvailableCredits();
			const tempActiveStorage = SafeParseJSON(localStorage.getItem('kadenceBlocksPrebuilt'), true);
			if (response === 'error') {
				console.log('Error getting credits');
				tempActiveStorage.credits = 'fetch';
				localStorage.setItem('kadenceBlocksPrebuilt', JSON.stringify(tempActiveStorage));
				setCredits(0);
				setTempCredits('');
			} else {
				tempActiveStorage.credits = parseInt(response);
				localStorage.setItem('kadenceBlocksPrebuilt', JSON.stringify(tempActiveStorage));
				setCredits(parseInt(response));
				setTempCredits('');
			}
		}
		useEffect(() => {
			if (currentCredits === 'fetch') {
				getRemoteAvailableCredits();
			}
		}, [credits]);
		useEffect(() => {
			if (
				value?.text &&
				value?.text.length > 0 &&
				value?.text.length < 800 &&
				value?.end &&
				value.start !== value.end
			) {
				setSelectedContent(value.text.substring(value.start, value.end));
				if (!isOpen && value?.text.length > 30) {
					setIsOpen(true);
				}
			} else if (
				value?.text &&
				value?.text.length > 0 &&
				value?.text.length < 800 &&
				value.start === value.end &&
				value?.text.length !== value.start
			) {
				setSelectedContent(value.text);
				if (!isOpen && value?.text.length > 30) {
					setIsOpen(true);
				}
			} else if (value?.text && value?.text.length >= 800) {
				setSelectedContent('');
				if (isOpen) {
					setIsOpen(false);
				}
			} else if (selectedContent && selectedContent.length > 0) {
				setSelectedContent('');
				if (isOpen) {
					setIsOpen(false);
				}
			}
			if (value?.text && value?.text.length > 400) {
				setPromptCost(2);
			} else {
				setPromptCost(1);
			}
		}, [value]);
		function handleGettingContent(value) {
			let AIContent = '';
			setIsLoading(true);
			setAiSuggestion('');
			setError('');
			sendEvent('ai_inline_requested', {
				tool_name: name,
				type: 'get_new_content',
				initial_text: '',
			});
			getAIContent(value)
				.then((readableStream) => {
					const reader = readableStream.getReader();

					reader.read().then(function processText({ done, value }) {
						if (done) {
							setIsLoading(false);
							setPrompt('');
							setIsOpen(true);
							setTempCredits(parseInt(currentCredits) - promptCost);
							setCredits('fetch');
							sendEvent('ai_inline_completed', {
								tool_name: name,
								type: 'get_new_content',
								initial_text: '',
								result: AIContent,
								credits_before: parseInt(currentCredits),
								credits_after: parseInt(currentCredits) - 1,
								credits_used: 1,
							});
							return;
						}

						const eventData = convertStreamDataToJson(value);

						if (eventData?.content) {
							AIContent = AIContent + eventData.content;
							setAiSuggestion((previousValue) => {
								return previousValue + eventData.content;
							});
						}

						return reader.read().then(processText);
					});
				})
				.catch((error) => {
					console.log(error);
					setIsLoading(false);
					if (error === 'credits') {
						setError('credits');
					} else {
						setError('failed');
					}
				});
		}
		function handleEditingContent(value, prompt, type) {
			let AIContent = '';
			const initial_text = value;
			const action_type = type;
			setIsLoading(true);
			setAiSuggestion('');
			setError('');
			sendEvent('ai_inline_requested', {
				tool_name: name,
				type: action_type,
				initial_text,
			});
			getAIEdit(value, prompt, type)
				.then((readableStream) => {
					const reader = readableStream.getReader();

					reader.read().then(function processText({ done, value }) {
						if (done) {
							setIsLoading(false);
							setPrompt('');
							setTempCredits(parseInt(currentCredits) - promptCost);
							setCredits('fetch');
							setIsOpen(true);
							sendEvent('ai_inline_completed', {
								tool_name: name,
								type: action_type,
								initial_text,
								result: AIContent,
								credits_before: parseInt(currentCredits),
								credits_after: parseInt(currentCredits) - 1,
								credits_used: 1,
							});
							return;
						}

						const eventData = convertStreamDataToJson(value);

						if (eventData?.content) {
							AIContent = AIContent + eventData.content;
							setAiSuggestion((previousValue) => {
								return previousValue + eventData.content;
							});
						}

						return reader.read().then(processText);
					});
				})
				.catch((error) => {
					console.log(error);
					setIsLoading(false);
					if (error === 'credits') {
						setError('credits');
					} else {
						setError('failed');
					}
				});
		}
		function handleTransformingContent(value, type) {
			let AIContent = '';
			const initial_text = value;
			const action_type = type;
			setIsLoading(true);
			setAiSuggestion('');
			setError('');
			sendEvent('ai_inline_requested', {
				tool_name: name,
				type: action_type,
				initial_text,
			});
			getAITransform(value, type)
				.then((readableStream) => {
					const reader = readableStream.getReader();

					reader.read().then(function processText({ done, value }) {
						if (done) {
							setIsLoading(false);
							setPrompt('');
							setIsOpen(true);
							setTempCredits(parseInt(currentCredits) - promptCost);
							setCredits('fetch');
							sendEvent('ai_inline_completed', {
								tool_name: name,
								type: action_type,
								initial_text,
								result: AIContent,
								credits_before: parseInt(currentCredits),
								credits_after: parseInt(currentCredits) - 1,
								credits_used: 1,
							});
							return;
						}

						const eventData = convertStreamDataToJson(value);
						if (eventData?.content) {
							AIContent = AIContent + eventData.content;
							setAiSuggestion((previousValue) => {
								return previousValue + eventData.content;
							});
						}
						return reader.read().then(processText);
					});
				})
				.catch((error) => {
					console.log(error);
					setIsLoading(false);
					if (error === 'credits') {
						setError('credits');
					} else {
						setError('failed');
					}
				});
		}
		return (
			<BlockControls>
				<ToolbarGroup group="ai-text" className="kb-ai-toolbar-group">
					<ToolbarButton
						className="kb-ai-dropdown-toggle"
						label={__('Kadence AI', 'kadence-blocks')}
						tooltip={__('Kadence AI', 'kadence-blocks')}
						icon={aiIcon}
						onClick={() => {
							setIsToggled(isToggled ? false : true);
						}}
						aria-expanded={isToggled}
						ref={setPopoverMainAnchor}
					/>
					{isToggled && !isAuthorized && (
						<Popover
							onClose={() => {
								setIsToggled(false);
							}}
							flip={false}
							placement="bottom"
							anchor={popoverMainAnchor}
							className={'kb-ai-dropdown-container-content kb-activation-ai-needed'}
						>
							<div className="kb-ai-dropdown-container-content-wrap activation-needed">
								<Button
									className="kadence-generate-copy-button"
									iconPosition="right"
									variant="primary"
									icon={aiIcon}
									text={__('Activate Kadence AI', 'kadence-blocks')}
									target={activateLink ? '_blank' : ''}
									disabled={activateLink ? false : true}
									href={activateLink ? activateLink : ''}
								/>
							</div>
						</Popover>
					)}
					{isToggled && isAuthorized && (
						<Popover
							onClose={() => {
								setIsToggled(false);
							}}
							flip={false}
							placement="bottom"
							anchor={popoverMainAnchor}
							className={'kb-ai-dropdown-container-content'}
						>
							<div className="kb-ai-dropdown-container-content-wrap">
								{hasContent && (
									<div className="kb-ai-selected-text">
										<strong>{__('Selected Text:', 'kadence-blocks')}</strong>{' '}
										<span>{selectedContent}</span>
									</div>
								)}
								{aiSuggestion && (
									<div className="kb-ai-suggesed-text">
										<div className={'kb-ai-suggestion-content'}>{aiSuggestion}</div>
										<Button
											className="kb-ai-send"
											text={__('Use This Copy', 'kadence-blocks')}
											icon={check}
											disabled={isLoading}
											iconPosition="left"
											iconSize={16}
											onClick={() => {
												if (hasContent) {
													if (
														selectedContent.length !== value.text.length &&
														value.start !== value.end
													) {
														onChange(
															insert(
																remove(value, value.start, value.end),
																create({ html: aiSuggestion })
															)
														);
													} else {
														onChange(
															insert(
																remove(value, 0, value.replacements.length),
																create({ html: aiSuggestion })
															)
														);
													}
												} else {
													onChange(insert(value, create({ html: aiSuggestion })));
												}
												setAiSuggestion('');
												setTempPrompt('');
												setPrompt('');
												setPrevPrompt('');
												setIsOpen(false);
												setIsToggled(false);
											}}
										/>
									</div>
								)}
								{error && (
									<div className="kb-ai-error-text">
										<div className={'kb-ai-error-content'}>
											{error === 'credits'
												? __(
														'Error, Can not generate AI content because of insufficient credits.',
														'kadence-blocks'
												  )
												: __(
														'Error, AI content generation failed, please try again.',
														'kadence-blocks'
												  )}
										</div>
									</div>
								)}
								<div className="kb-ai-prompt-wrap">
									{!isLoading && (
										<>
											<TextareaControl
												className={
													dynamicRows > 1
														? 'kb-ai-prompt-text-input'
														: 'kb-ai-prompt-text-input kb-ai-prompt-single'
												}
												placeholder={
													hasContent || aiSuggestion
														? __('Ask Kadence AI to edit…', 'kadence-blocks')
														: __('Ask Kadence AI to generate…', 'kadence-blocks')
												}
												value={prompt}
												rows={dynamicRows}
												onChange={(value) => {
													if (isOpen) {
														setIsOpen(false);
													}
													if (value.length > 60 && dynamicRows === 1) {
														setDynamicRows(2);
													} else if (dynamicRows === 2 && value.length <= 60) {
														setDynamicRows(1);
													}
													setPrompt(value);
												}}
												onKeyDown={(event) => {
													if (event.keyCode === ENTER) {
														event.preventDefault();
														setIsOpen(false);
														setPrevPrompt(prompt);
														if (hasContent) {
															handleEditingContent(selectedContent, prompt, 'edit');
														} else {
															handleGettingContent(prompt);
														}
													}
												}}
											/>
											<Button
												className="kb-ai-send"
												label={__('Send', 'kadence-blocks')}
												icon={chevronRightSmall}
												disabled={!prompt}
												iconPosition="right"
												onClick={() => {
													setIsOpen(false);
													setPrevPrompt(prompt);
													if (hasContent) {
														handleEditingContent(selectedContent, prompt, 'edit');
													} else {
														handleGettingContent(prompt);
													}
												}}
											/>
										</>
									)}
									{isLoading && (
										<>
											<TextareaControl
												className={'kb-ai-prompt-text-input kb-ai-prompt-single'}
												value={'Kadence AI is working...'}
												rows={1}
											/>
										</>
									)}
									<div className="kb-ai-prompt-icon">
										{isLoading ? (
											<Spinner />
										) : (
											<>
												{aiSuggestion && (
													<>
														<Button
															className="kb-ai-quick-prompts-toggle"
															label={__('Quick Prompts', 'kadence-blocks')}
															tooltip={__('Quick Prompts', 'kadence-blocks')}
															icon={aiIcon}
															onClick={() => setIsOpen(isOpen ? false : true)}
															aria-expanded={isOpen}
															ref={setPopoverSecondAnchor}
														/>
														{isOpen && (
															<Popover
																onClose={() => {
																	//setIsOpen( false );
																}}
																focusOnMount={false}
																flip={false}
																placement="bottom-start"
																anchor={popoverSecondAnchor}
																className={'kb-ai-quick-prompt-icon-dropdown'}
															>
																<div
																	className={'components-dropdown-menu__menu'}
																	role="menu"
																	aria-orientation="vertical"
																	aria-label="Options"
																>
																	<MenuGroup>
																		<MenuItem
																			icon={notes}
																			onClick={() => {
																				setPrevPrompt('');
																				handleTransformingContent(
																					aiSuggestion,
																					'shorten'
																				);
																			}}
																			iconPosition="left"
																		>
																			{__('Make Shorter', 'kadence-blocks')}
																		</MenuItem>
																		<MenuItem
																			icon={subject}
																			onClick={() => {
																				setPrevPrompt('');
																				handleTransformingContent(
																					aiSuggestion,
																					'lengthen'
																				);
																			}}
																			iconPosition="left"
																		>
																			{__('Make Longer', 'kadence-blocks')}
																		</MenuItem>
																		{!hasContent && prevPrompt && (
																			<MenuItem
																				icon={autoFix}
																				onClick={() => {
																					handleGettingContent(prevPrompt);
																				}}
																				iconPosition="left"
																			>
																				{__('Try Again', 'kadence-blocks')}
																			</MenuItem>
																		)}
																		<MenuItem
																			icon={playlist}
																			onClick={() => {
																				handleTransformingContent(
																					aiSuggestion,
																					'simplify'
																				);
																			}}
																			iconPosition="left"
																		>
																			{__('Simplify', 'kadence-blocks')}
																		</MenuItem>
																		<MenuItem
																			icon={chevronRightSmall}
																			className="kb-ai-quick-prompt-change-tone"
																			onClick={() =>
																				setIsToneOpen(isToneOpen ? false : true)
																			}
																			disabled={
																				selectedContent &&
																				selectedContent.length > 5
																					? false
																					: true
																			}
																			iconPosition="right"
																			ref={setPopoverToneAnchor}
																		>
																			{chatBubble}{' '}
																			{__('Change Tone', 'kadence-blocks')}
																		</MenuItem>
																		{isToneOpen && (
																			<Popover
																				onClose={() => {
																					//setIsOpen( false );
																				}}
																				placement="right-start"
																				anchor={popoverToneAnchor}
																				focusOnMount={false}
																				className={
																					'kb-ai-quick-prompt-change-tone-dropdown'
																				}
																			>
																				<div
																					className={
																						'components-dropdown-menu__menu'
																					}
																					role="menu"
																					aria-orientation="vertical"
																					aria-label="Options"
																				>
																					<MenuGroup>
																						<MenuItem
																							onClick={() => {
																								handleEditingContent(
																									aiSuggestion,
																									'Professional',
																									'tone'
																								);
																							}}
																						>
																							{__(
																								'Professional',
																								'kadence-blocks'
																							)}
																						</MenuItem>
																						<MenuItem
																							onClick={() => {
																								handleEditingContent(
																									aiSuggestion,
																									'Friendly',
																									'tone'
																								);
																							}}
																						>
																							{__(
																								'Friendly',
																								'kadence-blocks'
																							)}
																						</MenuItem>
																						<MenuItem
																							onClick={() => {
																								handleEditingContent(
																									aiSuggestion,
																									'Informative',
																									'tone'
																								);
																							}}
																						>
																							{__(
																								'Informative',
																								'kadence-blocks'
																							)}
																						</MenuItem>
																						<MenuItem
																							onClick={() => {
																								handleEditingContent(
																									aiSuggestion,
																									'Engaging',
																									'tone'
																								);
																							}}
																						>
																							{__(
																								'Engaging',
																								'kadence-blocks'
																							)}
																						</MenuItem>
																						<MenuItem
																							onClick={() => {
																								handleEditingContent(
																									aiSuggestion,
																									'Funny',
																									'tone'
																								);
																							}}
																						>
																							{__(
																								'Funny',
																								'kadence-blocks'
																							)}
																						</MenuItem>
																					</MenuGroup>
																				</div>
																			</Popover>
																		)}
																		<MenuItem
																			icon={close}
																			onClick={() => {
																				setAiSuggestion('');
																				setTempPrompt('');
																				setPrompt('');
																				setPrevPrompt('');
																				setIsOpen(false);
																				setIsToggled(false);
																			}}
																			iconPosition="left"
																		>
																			{__('Discard', 'kadence-blocks')}
																		</MenuItem>
																	</MenuGroup>
																</div>
															</Popover>
														)}
													</>
												)}
												{!aiSuggestion && (
													<>
														<Button
															className="kb-ai-quick-prompts-toggle"
															label={__('Quick Prompts', 'kadence-blocks')}
															tooltip={__('Quick Prompts', 'kadence-blocks')}
															icon={aiIcon}
															onClick={() => setIsOpen(isOpen ? false : true)}
															aria-expanded={isOpen}
															ref={setPopoverAnchor}
														/>
														{isOpen && (
															<Popover
																onClose={() => {
																	//setIsOpen( false );
																}}
																flip={false}
																placement="bottom-start"
																anchor={popoverAnchor}
																focusOnMount={false}
																className={'kb-ai-quick-prompt-icon-dropdown'}
															>
																<div
																	className={'components-dropdown-menu__menu'}
																	role="menu"
																	aria-orientation="vertical"
																	aria-label="Options"
																>
																	<MenuGroup>
																		<MenuItem
																			icon={autoFix}
																			onClick={() => {
																				handleTransformingContent(
																					selectedContent,
																					'improve'
																				);
																			}}
																			disabled={
																				selectedContent &&
																				selectedContent.length > 5
																					? false
																					: true
																			}
																			iconPosition="left"
																		>
																			{__('Improve Writing', 'kadence-blocks')}
																		</MenuItem>
																		<MenuItem
																			icon={check}
																			onClick={() => {
																				handleTransformingContent(
																					selectedContent,
																					'spelling'
																				);
																			}}
																			disabled={
																				selectedContent &&
																				selectedContent.length > 5
																					? false
																					: true
																			}
																			iconPosition="left"
																		>
																			{__(
																				'Fix Spelling & Grammar',
																				'kadence-blocks'
																			)}
																		</MenuItem>
																		<MenuItem
																			icon={notes}
																			onClick={() => {
																				handleTransformingContent(
																					selectedContent,
																					'shorten'
																				);
																			}}
																			disabled={
																				selectedContent &&
																				selectedContent.length > 5
																					? false
																					: true
																			}
																			iconPosition="left"
																		>
																			{__('Make Shorter', 'kadence-blocks')}
																		</MenuItem>
																		<MenuItem
																			icon={subject}
																			onClick={() => {
																				handleTransformingContent(
																					selectedContent,
																					'lengthen'
																				);
																			}}
																			disabled={
																				selectedContent &&
																				selectedContent.length > 5
																					? false
																					: true
																			}
																			iconPosition="left"
																		>
																			{__('Make Longer', 'kadence-blocks')}
																		</MenuItem>
																		<MenuItem
																			icon={playlist}
																			onClick={() => {
																				handleTransformingContent(
																					selectedContent,
																					'simplify'
																				);
																			}}
																			disabled={
																				selectedContent &&
																				selectedContent.length > 5
																					? false
																					: true
																			}
																			iconPosition="left"
																		>
																			{__('Simplify', 'kadence-blocks')}
																		</MenuItem>
																		<MenuItem
																			icon={chevronRightSmall}
																			className="kb-ai-quick-prompt-change-tone"
																			onClick={() =>
																				setIsToneOpen(isToneOpen ? false : true)
																			}
																			disabled={
																				selectedContent &&
																				selectedContent.length > 5
																					? false
																					: true
																			}
																			iconPosition="right"
																			ref={setPopoverToneAnchor}
																		>
																			{chatBubble}{' '}
																			{__('Change Tone', 'kadence-blocks')}
																		</MenuItem>
																		{isToneOpen && (
																			<Popover
																				onClose={() => {
																					//setIsOpen( false );
																				}}
																				placement="right-start"
																				anchor={popoverToneAnchor}
																				focusOnMount={false}
																				className={
																					'kb-ai-quick-prompt-change-tone-dropdown'
																				}
																			>
																				<div
																					className={
																						'components-dropdown-menu__menu'
																					}
																					role="menu"
																					aria-orientation="vertical"
																					aria-label="Options"
																				>
																					<MenuGroup>
																						<MenuItem
																							disabled={
																								selectedContent &&
																								selectedContent.length >
																									5
																									? false
																									: true
																							}
																							onClick={() => {
																								handleEditingContent(
																									selectedContent,
																									'Professional',
																									'tone'
																								);
																							}}
																						>
																							{__(
																								'Professional',
																								'kadence-blocks'
																							)}
																						</MenuItem>
																						<MenuItem
																							disabled={
																								selectedContent &&
																								selectedContent.length >
																									5
																									? false
																									: true
																							}
																							onClick={() => {
																								handleEditingContent(
																									selectedContent,
																									'Friendly',
																									'tone'
																								);
																							}}
																						>
																							{__(
																								'Friendly',
																								'kadence-blocks'
																							)}
																						</MenuItem>
																						<MenuItem
																							disabled={
																								selectedContent &&
																								selectedContent.length >
																									5
																									? false
																									: true
																							}
																							onClick={() => {
																								handleEditingContent(
																									selectedContent,
																									'Informative',
																									'tone'
																								);
																							}}
																						>
																							{__(
																								'Informative',
																								'kadence-blocks'
																							)}
																						</MenuItem>
																						<MenuItem
																							onClick={() => {
																								handleEditingContent(
																									selectedContent,
																									'Engaging',
																									'tone'
																								);
																							}}
																						>
																							{__(
																								'Engaging',
																								'kadence-blocks'
																							)}
																						</MenuItem>
																						<MenuItem
																							disabled={
																								selectedContent &&
																								selectedContent.length >
																									5
																									? false
																									: true
																							}
																							onClick={() => {
																								handleEditingContent(
																									selectedContent,
																									'Funny',
																									'tone'
																								);
																							}}
																						>
																							{__(
																								'Funny',
																								'kadence-blocks'
																							)}
																						</MenuItem>
																					</MenuGroup>
																				</div>
																			</Popover>
																		)}
																	</MenuGroup>
																</div>
															</Popover>
														)}
													</>
												)}
											</>
										)}
									</div>
								</div>
								<div className={`kb-ai-credits${0 === currentCredits ? ' kb-ai-credits-out' : ''}`}>
									{__('Credits Remaining:', 'kadence-blocks')}{' '}
									{'fetch' !== currentCredits ? currentCredits : tempCredits}
								</div>
								<style>
									{
										'.edit-post-visual-editor .edit-post-visual-editor__content-area > div {padding-bottom:300px;}'
									}
								</style>
							</div>
						</Popover>
					)}
				</ToolbarGroup>
			</BlockControls>
		);
	},
};
registerFormatType(name, AIText);
