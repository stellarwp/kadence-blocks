/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
const { useRef, useState, useCallback, Fragment } = wp.element;
const {
	IconButton,
	ToggleControl,
} = wp.components;
import { URLPopover } from '@wordpress/block-editor';
const { LEFT, RIGHT, UP, DOWN, BACKSPACE, ENTER } = wp.keycodes;

const URLInputInline = ( {
	onChangeUrl,
	url,
	opensInNewTab,
	onChangeTarget,
	linkNoFollow,
	onChangeFollow,
	linkSponsored,
	onChangeSponsored,
	linkDownload,
	onChangeDownload,
} ) => {
	const [ isEditingLink, setIsEditingLink ] = useState( false );
	const [ urlInput, setUrlInput ] = useState( null );

	const autocompleteRef = useRef( null );

	const stopPropagation = ( event ) => {
		event.stopPropagation();
	};

	const stopPropagationRelevantKeys = ( event ) => {
		if ( [ LEFT, DOWN, RIGHT, UP, BACKSPACE, ENTER ].indexOf( event.keyCode ) > -1 ) {
			// Stop the key event from propagating up to ObserveTyping.startTypingInTextField.
			event.stopPropagation();
		}
	};

	const startEditLink = useCallback( () => {
		setIsEditingLink( true );
	} );

	const stopEditLink = useCallback( () => {
		setIsEditingLink( false );
	} );

	const closeLinkUI = useCallback( () => {
		setUrlInput( null );
		stopEditLink();
	} );

	const onSubmitLinkChange = useCallback( () => {
		return ( event ) => {
			if ( urlInput ) {
				onChangeUrl( urlInput );
			}
			stopEditLink();
			setUrlInput( null );
			event.preventDefault();
		};
	} );

	const onLinkRemove = useCallback( () => {
		onChangeUrl( '' );
	} );

	const onSetNewTab = ( value ) => {
		onChangeTarget( value );
	};

	const onSetLinkNoFollow = ( value ) => {
		onChangeFollow( value );
	};

	const onSetLinkSponsored = ( value ) => {
		onChangeSponsored( value );
	};

	const onSetLinkDownload = ( value ) => {
		onChangeDownload( value );
	};

	const advancedOptions = (
		<Fragment>
			<ToggleControl
				label={ __( 'Open in New Tab', 'kadence-blocks' ) }
				onChange={ onSetNewTab }
				checked={ opensInNewTab }
			/>
			<ToggleControl
				label={ __( 'No Follow', 'kadence-blocks' ) }
				onChange={ onSetLinkNoFollow }
				checked={ linkNoFollow }
			/>
			<ToggleControl
				label={ __( 'Sponsored', 'kadence-blocks' ) }
				onChange={ onSetLinkSponsored }
				checked={ linkSponsored }
			/>
			<ToggleControl
				label={ __( 'Download', 'kadence-blocks' ) }
				onChange={ onSetLinkDownload }
				checked={ linkDownload }
			/>
		</Fragment>
	);

	const linkEditorValue = urlInput !== null ? urlInput : url;

	return (
		<URLPopover
			onClose={ closeLinkUI }
			renderSettings={ () => advancedOptions }
		>
			{ ( ! url || isEditingLink ) && (
				<URLPopover.LinkEditor
					className="block-editor-format-toolbar__link-container-content"
					value={ linkEditorValue }
					onChangeInputValue={ setUrlInput }
					onKeyDown={ stopPropagationRelevantKeys }
					onKeyPress={ stopPropagation }
					onSubmit={ onSubmitLinkChange() }
					autocompleteRef={ autocompleteRef }
				/>
			) }
			{ url && ! isEditingLink && (
				<Fragment>
					<URLPopover.LinkViewer
						className="block-editor-format-toolbar__link-container-content"
						onKeyPress={ stopPropagation }
						url={ url }
						onEditLinkClick={ startEditLink }
					/>
					<IconButton
						icon="no"
						label={ __( 'Remove link', 'kadence-blocks' ) }
						onClick={ onLinkRemove }
					/>
				</Fragment>
			) }
		</URLPopover>
	);
};

export default URLInputInline;
