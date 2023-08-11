import { __ } from '@wordpress/i18n';
import { useState, useEffect, useCallback } from '@wordpress/element';
import { richText } from '@wordpress/rich-text';
import { toggleFormat, applyFormat, registerFormatType, useAnchorRef, useAnchor } from '@wordpress/rich-text';
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
import { KadencePanelBody } from '@kadence/components';
import { chevronRightSmall } from '@wordpress/icons';
import { ENTER } from '@wordpress/keycodes';
import { aiIcon, autoFix, notes, subject, check, playlist } from '@kadence/icons';
import { getAIContentHelper } from "./fetch-ai";
import { convertStreamDataToJson } from "./convert-stream-data-to-json";

export default function AIText( {
	attributes,
	onChange,
	label = __( 'Kadence AI', 'kadence-blocks' ),
} ) {
	const [ prompt, setPrompt ] = useState('');
	const [ aiSuggestion, setAiSuggestion] = useState("");
	const [ isLoading, setIsLoading ] = useState(false);
	const [ dynamicRows, setDynamicRows ] = useState(1);
	const [ aiDynamicRows, setAIDynamicRows ] = useState(2);
	const [ isOpen, setIsOpen ] = useState(attributes?.content && attributes.content.length > 30 ? true : false);
	const [ isToggled, setIsToggled ] = useState(false);
	const [ popoverAnchor, setPopoverAnchor] = useState();
	const [ popoverMainAnchor, setPopoverMainAnchor] = useState();
	const [ popoverSecondAnchor, setPopoverSecondAnchor] = useState();
	const { getAIContent, getAITransform } = getAIContentHelper();
	useEffect( () => {
		console.log( contentRef );

 	var richTextContent = wp.richText.create(
		{
			contentRef
		});
		console.log( richTextContent );
	}, [ contentRef ] );
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
				setIsOpen( true );
			})
			.catch((error) => {
				console.log(error);
				setIsLoading(false);
			});
	}
	return (
		<ToolbarGroup group="ai-text" className="kb-ai-toolbar-group">
			<ToolbarButton
				className="kb-ai-dropdown-toggle"
				label={ label }
				tooltip={ label }
				icon={ aiIcon }
				onClick={ () => setIsToggled( isToggled ? false : true ) }
				aria-expanded={ isToggled }
				ref={ setPopoverMainAnchor }
			/>
			{ isToggled && (
				<Popover
					onClose={ () => {
						//setIsToggled( false );
					}}
					placement="bottom-start"
					anchor={popoverMainAnchor}
					className={ 'kb-ai-dropdown-container-content' }
				>
					<div className="kb-ai-dropdown-container-content-wrap">
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
																	icon={ subject }
																	onClick={ () => {
																		handleTransformingContent( aiSuggestion, 'shorten' );
																	} }
																	iconPosition='left'
																>
																	{ __( 'Make Shorter', 'kadence-blocks' ) }
																</MenuItem>
																<MenuItem
																	icon={ notes }
																	onClick={ () => {
																		handleTransformingContent( aiSuggestion, 'lengthen' );
																	} }
																	iconPosition='left'
																>
																	{ __( 'Make Longer', 'kadence-blocks' ) }
																</MenuItem>
																{ prompt && (
																	<MenuItem
																		icon={ autoFix }
																		onClick={ () => {
																			if ( prompt ) {
																				handleGettingContent(prompt);
																			}
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
																		console.log( 'Auto Fix' );
																		handleTransformingContent( attributes.content, 'improve' );
																	} }
																	disabled={ attributes?.content && attributes.content.length > 30 ? false : true }
																	iconPosition='left'
																>
																	{ __( 'Improve Writing', 'kadence-blocks' ) }
																</MenuItem>
																<MenuItem
																	icon={ notes }
																	onClick={ () => {
																		console.log( 'Shorter' );
																		handleTransformingContent( attributes.content, 'shorten' );
																	} }
																	disabled={ attributes?.content && attributes.content.length > 30 ? false : true }
																	iconPosition='left'
																>
																	{ __( 'Make Shorter', 'kadence-blocks' ) }
																</MenuItem>
																<MenuItem
																	icon={ subject }
																	onClick={ () => {
																		console.log( 'longer' );
																		handleTransformingContent( attributes.content, 'lengthen' );
																	} }
																	disabled={ attributes?.content && attributes.content.length > 30 ? false : true }
																	iconPosition='left'
																>
																	{ __( 'Make Longer', 'kadence-blocks' ) }
																</MenuItem>
																<MenuItem
																	icon={ playlist }
																	onClick={ () => {
																		console.log( 'simplify' );
																		handleTransformingContent( attributes.content, 'simplify' );
																	} }
																	disabled={ attributes?.content && attributes.content.length > 30 ? false : true }
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
							{ ! aiSuggestion && (
								<>
									<TextareaControl
										className={ dynamicRows > 1 ? 'kb-ai-prompt-text-input' : 'kb-ai-prompt-text-input kb-ai-prompt-single' }
										placeholder={ __( 'Ask Kadence AI to generate...', 'kadence-blocks' ) }
										value={ prompt }
										rows={ dynamicRows }
										autoFocus
										onChange={ ( value ) => {
											if ( isOpen ) {
												setIsOpen( false );
											}
											if ( value.length > 40 && dynamicRows === 1 ) {
												setDynamicRows( 2 );
											} else if ( dynamicRows === 2 && value.length <= 40 ) {
												setDynamicRows( 1 );
											}
											setPrompt( value );
										}}
										onKeyDown={( event ) => {
											if ( event.keyCode === ENTER ) {
												event.preventDefault();
												setIsOpen( false );
												handleGettingContent(prompt);
											}
										}}
									/>
									<Button
										className="kb-ai-send"
										text={ __( 'Send', 'kadence-blocks' ) }
										icon={ chevronRightSmall }
										disabled={ ! prompt }
										iconPosition="right"
										onClick={ () => {
											setIsOpen( false );
											handleGettingContent(prompt);
										} }
									/>
								</>
							) }
							{ aiSuggestion && (
								<>
									<TextareaControl
										disabled
										className={ aiDynamicRows > 1 ? 'kb-ai-response-text-input kb-ai-prompt-text-input' : 'kb-ai-response-text-input kb-ai-prompt-text-input kb-ai-prompt-single' }
										rows={ aiDynamicRows }
										value={aiSuggestion}
									/>
									<Button
										className="kb-ai-send"
										text={ __( 'Use This Copy', 'kadence-blocks' ) }
										icon={ check }
										disabled={ isLoading }
										iconPosition="left"
										iconSize={ 16 }
										onClick={ () => {
											onChange( { content: aiSuggestion } );
											setAiSuggestion( '' );
											setIsToggled( false );
										} }
									/>
								</>
							) }
						</div>
					</div>
				</Popover>
			) }
		</ToolbarGroup>
	);
}
//registerFormatType( name, AIText );