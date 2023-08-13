import { __ } from '@wordpress/i18n';
import { useState, useEffect, useCallback } from '@wordpress/element';
import { RichTextToolbarButton } from '@wordpress/block-editor';
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
import {
	BlockControls,
} from '@wordpress/block-editor';
import { KadencePanelBody } from '@kadence/components';
import { chevronRightSmall } from '@wordpress/icons';
import { ENTER } from '@wordpress/keycodes';
import { aiIcon, autoFix, notes, subject, check, playlist } from '@kadence/icons';
import { getAIContentHelper } from "./fetch-ai";
import { convertStreamDataToJson } from "./convert-stream-data-to-json";
import {
	insert,
	replace,
	remove,
	create,
	registerFormatType,
	toggleFormat,
	applyFormat,
} from '@wordpress/rich-text';
const name = 'kadence/ai-text';
const allowedBlocks = [ 'kadence/advancedheading' ];
export const AIText = {
	title     : __( 'Kadence AI' ),
	tagName   : 'span',
	className : 'kt-ai-text',
	keywords  : [ __( 'ai' ), __( 'kadence' ) ],
	attributes: {},
	edit( { activeAttributes, isActive, value, onChange, contentRef } ) {
		const selectedBlock = useSelect( ( select ) => {
			return select( 'core/block-editor' ).getSelectedBlock();
		}, [] );
		if ( undefined === selectedBlock?.name ) {
			return null;
		}
		if ( selectedBlock && !allowedBlocks.includes( selectedBlock.name ) ) {
			return null;
		}
		const [ prompt, setPrompt ] = useState('');
		const [ tempPrompt, setTempPrompt ] = useState('');
		const [ prevPrompt, setPrevPrompt ] = useState('');
		const [ selectedContent, setSelectedContent ] = useState('');
		const [ aiSuggestion, setAiSuggestion] = useState("");
		const [ isLoading, setIsLoading ] = useState(false);
		const [ dynamicRows, setDynamicRows ] = useState(1);
		const [ aiDynamicRows, setAIDynamicRows ] = useState(2);
		const [ isToggled, setIsToggled ] = useState(false);
		const [ popoverAnchor, setPopoverAnchor] = useState();
		const [ popoverMainAnchor, setPopoverMainAnchor] = useState();
		const [ popoverSecondAnchor, setPopoverSecondAnchor] = useState();
		const { getAIContent, getAITransform, getAIEdit } = getAIContentHelper();
		const hasContent = selectedContent && selectedContent.length > 0 ? true : false;
		const [ isOpen, setIsOpen ] = useState(false);
		useEffect( () => {
			if ( value?.text && value?.text.length > 0 && value?.end && value.start !== value.end ) {
				setSelectedContent( value.text.substring(value.start, value.end) );
				if ( ! isOpen && value?.text.length > 30 ) {
					setIsOpen( true );
				}
			} else if ( selectedContent && selectedContent.length > 0 ) {
				setSelectedContent( '' );
				if ( isOpen ) {
					setIsOpen( false );
				}
			}
			console.log( selectedContent );
		}, [ value ] );
		function handleGettingContent(value) {
			setIsLoading(true);
			setAiSuggestion( '' );
			getAIContent(value)
				.then((readableStream) => {
					const reader = readableStream.getReader();

					reader.read().then(function processText({ done, value }) {
						if (done) {
							setIsLoading(false);
							return;
						}

						const eventData = convertStreamDataToJson(value);
						
						if (eventData?.content) {
							setAiSuggestion((previousValue) => {
								return previousValue + eventData.content;
							});
						}
						return reader.read().then(processText);
					});
					setIsLoading(false);
					setIsOpen( true );
				})
				.catch((error) => {
					console.log(error);
					setIsLoading(false);
				});
		}
		function handleEditingContent(value, prompt) {
			setIsLoading(true);
			setAiSuggestion( '' );
			getAIEdit(value, prompt)
				.then((readableStream) => {
					const reader = readableStream.getReader();

					reader.read().then(function processText({ done, value }) {
						if (done) {
							setIsLoading(false);
							return;
						}

						const eventData = convertStreamDataToJson(value);
						
						if (eventData?.content) {
							setAiSuggestion((previousValue) => {
								return previousValue + eventData.content;
							});
						}
						return reader.read().then(processText);
					});
					setIsLoading(false);
					setIsOpen( true );
				})
				.catch((error) => {
					console.log(error);
					setIsLoading(false);
				});
		}
		function handleTransformingContent(value, type) {
			setIsLoading(true);
			setAiSuggestion( '' );
			getAITransform(value, type)
				.then((readableStream) => {
					const reader = readableStream.getReader();

					reader.read().then(function processText({ done, value }) {
						if (done) {
							setIsLoading(false);
							return;
						}

						const eventData = convertStreamDataToJson(value);
						
						if (eventData?.content) {
							setAiSuggestion((previousValue) => {
								return previousValue + eventData.content;
							});
						}
						return reader.read().then(processText);
					});
					setIsLoading(false);
					setPrompt('');
					setIsOpen( true );
				})
				.catch((error) => {
					console.log(error);
					setIsLoading(false);
				});
		}
		return (
			<BlockControls>
				<ToolbarGroup group="ai-text" className="kb-ai-toolbar-group">
					<ToolbarButton
						className="kb-ai-dropdown-toggle"
						label={ __( 'Kadence AI', 'kadence-blocks' ) }
						tooltip={ __( 'Kadence AI', 'kadence-blocks' ) }
						icon={ aiIcon }
						onClick={ () => {
							setIsToggled( isToggled ? false : true );
						}}
						aria-expanded={ isToggled }
						ref={ setPopoverMainAnchor }
					/>
					{ isToggled && (
						<Popover
							onClose={ () => {
								//setIsToggled( false );
							}}
							placement="bottom"
							anchor={popoverMainAnchor}
							className={ 'kb-ai-dropdown-container-content' }
						>
							<div className="kb-ai-dropdown-container-content-wrap">
								{ hasContent && (
									<div className='kb-ai-selected-text'>
										{ __( 'Selected Text:', 'kadence-blocks' ) } <span>{ selectedContent }</span>
									</div>
								) }
								{ aiSuggestion && (
									<div className='kb-ai-suggesed-text'>
										<div className={ 'kb-ai-suggestion-content' }>
											{aiSuggestion}
										</div>
										<Button
											className="kb-ai-send"
											text={ __( 'Use This Copy', 'kadence-blocks' ) }
											icon={ check }
											disabled={ isLoading }
											iconPosition="left"
											iconSize={ 16 }
											onClick={ () => {
												onChange( insert( remove( value, 0, value.replacements.length ), create( { html: aiSuggestion } ) ) );
												setAiSuggestion( '' );
												setTempPrompt( '' );
												setPrompt( '' );
												setPrevPrompt( '' );
												setIsOpen( false );
												setIsToggled( false );
											} }
										/>
									</div>
								) }
								<div className="kb-ai-prompt-wrap">
									<div className="kb-ai-prompt-icon">
										{ isLoading ? (
											<Spinner />
										) : (
											<>
												{ aiSuggestion && (
													<>
														<Button
															className="kb-ai-quick-prompts-toggle"
															label={ __( 'Quick Prompts', 'kadence-blocks' ) }
															tooltip={ __( 'Quick Prompts', 'kadence-blocks' ) }
															icon={ aiIcon }
															onClick={ () => setIsOpen( isOpen ? false : true ) }
															aria-expanded={ isOpen }
															ref={ setPopoverSecondAnchor }
														/>
														{ isOpen && (
															<Popover
																onClose={ () => {
																	//setIsOpen( false );
																}}
																placement="bottom-start"
																anchor={popoverSecondAnchor}
																className={ 'kb-ai-quick-prompt-icon-dropdown' }
															>
																<div className={'components-dropdown-menu__menu'}  role="menu" aria-orientation="vertical" aria-label="Options">
																	<MenuGroup>
																		<MenuItem
																			icon={ notes }
																			onClick={ () => {
																				setTempPrompt( 'SHORTER: ' + aiSuggestion );
																				handleTransformingContent( aiSuggestion, 'shorten' );
																			} }
																			iconPosition='left'
																		>
																			{ __( 'Make Shorter', 'kadence-blocks' ) }
																		</MenuItem>
																		<MenuItem
																			icon={ subject }
																			onClick={ () => {
																				setTempPrompt( 'LONGER: ' + aiSuggestion );
																				handleTransformingContent( aiSuggestion, 'lengthen' );
																			} }
																			iconPosition='left'
																		>
																			{ __( 'Make Longer', 'kadence-blocks' ) }
																		</MenuItem>
																		{ ! hasContent && prevPrompt && (
																			<MenuItem
																				icon={ autoFix }
																				onClick={ () => {
																					handleGettingContent(prevPrompt);
																				} }
																				iconPosition='left'
																			>
																				{ __( 'Try Again', 'kadence-blocks' ) }
																			</MenuItem>
																		) }
																	</MenuGroup>
																</div>
															</Popover>
														) }
													</>
												) }
												{ ! aiSuggestion && (
													<>
														<Button
															className="kb-ai-quick-prompts-toggle"
															label={ __( 'Quick Prompts', 'kadence-blocks' ) }
															tooltip={ __( 'Quick Prompts', 'kadence-blocks' ) }
															icon={ aiIcon }
															onClick={ () => setIsOpen( isOpen ? false : true ) }
															aria-expanded={ isOpen }
															ref={ setPopoverAnchor }
														/>
														{ isOpen && (
															<Popover
																onClose={ () => {
																	//setIsOpen( false );
																}}
																placement="bottom-start"
																anchor={popoverAnchor}
																className={ 'kb-ai-quick-prompt-icon-dropdown' }
															>
																<div className={'components-dropdown-menu__menu'}  role="menu" aria-orientation="vertical" aria-label="Options">
																	<MenuGroup>
																		<MenuItem
																			icon={ autoFix }
																			onClick={ () => {
																				setTempPrompt( 'IMPROVE: ' + selectedContent );
																				handleTransformingContent( selectedContent, 'improve' );
																			} }
																			disabled={ selectedContent && selectedContent.length > 30 ? false : true }
																			iconPosition='left'
																		>
																			{ __( 'Improve Writing', 'kadence-blocks' ) }
																		</MenuItem>
																		<MenuItem
																			icon={ notes }
																			onClick={ () => {
																				setTempPrompt( 'SHORTER: ' + selectedContent );
																				handleTransformingContent( selectedContent, 'shorten' );
																			} }
																			disabled={ selectedContent && selectedContent.length > 30 ? false : true }
																			iconPosition='left'
																		>
																			{ __( 'Make Shorter', 'kadence-blocks' ) }
																		</MenuItem>
																		<MenuItem
																			icon={ subject }
																			onClick={ () => {
																				setTempPrompt( 'LONGER: ' + selectedContent );
																				handleTransformingContent( selectedContent, 'lengthen' );
																			} }
																			disabled={ selectedContent && selectedContent.length > 30 ? false : true }
																			iconPosition='left'
																		>
																			{ __( 'Make Longer', 'kadence-blocks' ) }
																		</MenuItem>
																		<MenuItem
																			icon={ playlist }
																			onClick={ () => {
																				setTempPrompt( 'SIMPLIFY: ' + selectedContent );
																				handleTransformingContent( selectedContent, 'simplify' );
																			} }
																			disabled={ selectedContent && selectedContent.length > 30 ? false : true }
																			iconPosition='left'
																		>
																			{ __( 'Simplify', 'kadence-blocks' ) }
																		</MenuItem>
																	</MenuGroup>
																</div>
															</Popover>
														) }
													</>
												) }
											</>
										) }
									</div>
									{ ! isLoading && (
										<>
											<TextareaControl
												className={ dynamicRows > 1 ? 'kb-ai-prompt-text-input' : 'kb-ai-prompt-text-input kb-ai-prompt-single' }
												placeholder={ ( hasContent || aiSuggestion ) ? __( 'Ask Kadence AI to edit...', 'kadence-blocks' ) : __( 'Ask Kadence AI to generate...', 'kadence-blocks' ) }
												value={ prompt || tempPrompt }
												rows={ dynamicRows }
												autoFocus
												onChange={ ( value ) => {
													if ( isOpen ) {
														setIsOpen( false );
													}
													if ( value.length > 60 && dynamicRows === 1 ) {
														setDynamicRows( 2 );
													} else if ( dynamicRows === 2 && value.length <= 60 ) {
														setDynamicRows( 1 );
													}
													setPrompt( value );
												}}
												onKeyDown={( event ) => {
													if ( event.keyCode === ENTER ) {
														event.preventDefault();
														setIsOpen( false );
														setPrevPrompt( prompt );
														if ( hasContent ) {
															handleEditingContent(selectedContent, prompt);
														} else {
															handleGettingContent(prompt);
														}
													}
												}}
											/>
											<Button
												className="kb-ai-send"
												label={ __( 'Send', 'kadence-blocks' ) }
												icon={ chevronRightSmall }
												disabled={ ! prompt }
												iconPosition="right"
												onClick={ () => {
													setIsOpen( false );
													setPrevPrompt( prompt );
													if ( hasContent ) {
														handleEditingContent(selectedContent, prompt);
													} else {
														handleGettingContent(prompt);
													}
												} }
											/>
										</>
									) }
									{ isLoading && (
										<>
											<TextareaControl
												className={ 'kb-ai-prompt-text-input kb-ai-prompt-single' }
												value={ 'Kadence AI is working...' }
												rows={ 1 }
											/>
										</>
									) }
								</div>
							</div>
						</Popover>
					) }
				</ToolbarGroup>
			</BlockControls>
		);
	}
}
registerFormatType( name, AIText );