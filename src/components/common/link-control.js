/**
 * External dependencies
 */
import classnames from 'classnames';
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useRef, useState, useCallback, Fragment } from  '@wordpress/element';
import { Button, ToggleControl, ExternalLink, SelectControl } from '@wordpress/components';
import { safeDecodeURI, filterURLForDisplay } from '@wordpress/url';
import { URLInput } from '@wordpress/block-editor';
import { useInstanceId } from '@wordpress/compose';
import { keyboardReturn, chevronDown, edit, closeSmall } from '@wordpress/icons';

const { LEFT, RIGHT, UP, DOWN, BACKSPACE, ENTER } = wp.keycodes;
const URLInputControl = ( {
	label,
	onChangeUrl,
	url,
	additionalControls = true,
	opensInNewTab,
	onChangeTarget,
	linkNoFollow,
	onChangeFollow,
	linkSponsored,
	onChangeSponsored,
	linkDownload,
	onChangeDownload,
	changeTargetType = false,
} ) => {
	const [ isEditingLink, setIsEditingLink ] = useState( false );
	const [ isSettingsExpanded, setIsSettingsExpanded ] = useState( false );
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
	const toggleSettingsVisibility = () => {
		setIsSettingsExpanded( ! isSettingsExpanded );
	};
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
			{ onChangeTarget && (
				<Fragment>
					{ changeTargetType && (
						<Fragment>
							<SelectControl
								label={ __( 'Link Target', 'kadence-blocks' ) }
								value={ opensInNewTab }
								options={ [
									{ value: '_self', label: __( 'Same Window', 'kadence-blocks' ) },
									{ value: '_blank', label: __( 'New Window', 'kadence-blocks' ) },
									{ value: 'video', label: __( 'Video Popup', 'kadence-blocks' ) },
								] }
								onChange={ onSetNewTab }
							/>
							{ opensInNewTab === 'video' && (
								<p>{ __( 'NOTE: Video popup only works with youtube and vimeo links.', 'kadence-blocks' ) }</p>
							) }
						</Fragment>
					) }
				 	{ ! changeTargetType && (
						<ToggleControl
							label={ __( 'Open in New Tab', 'kadence-blocks' ) }
							onChange={ onSetNewTab }
							checked={ opensInNewTab }
						/>
					) }
				</Fragment>
			) }
			{ onChangeFollow && (
				<ToggleControl
					label={ __( 'No Follow', 'kadence-blocks' ) }
					onChange={ onSetLinkNoFollow }
					checked={ linkNoFollow }
				/>
			) }
			{ onChangeSponsored && (
				<ToggleControl
					label={ __( 'Sponsored', 'kadence-blocks' ) }
					onChange={ onSetLinkSponsored }
					checked={ linkSponsored }
				/>
			) }
			{ onChangeDownload && (
				<ToggleControl
					label={ __( 'Download', 'kadence-blocks' ) }
					onChange={ onSetLinkDownload }
					checked={ linkDownload }
				/>
			) }
		</Fragment>
	);
	const linkEditorValue = urlInput !== null ? urlInput : url;
	const id = useInstanceId( URLInputControl, 'inspector-kb-link-control' );
	return (
		<div className="components-base-control kb-link-control">
			{ label && (
				<label htmlFor={ id } className="components-base-control__label">{ label }</label>
			) }
			<div className="kb-link-control-inner">
				<div className="kb-link-control-inner-row">
					{ ( ! url || isEditingLink ) && (
						<form
							className={ classnames(
								'block-editor-url-popover__link-editor',
								'block-editor-format-toolbar__link-container-content'
							) }
							onKeyDown={ stopPropagationRelevantKeys }
							onKeyPress={ stopPropagation }
							onSubmit={ onSubmitLinkChange() }
						>
							<URLInput
								value={ linkEditorValue }
								onChange={ setUrlInput }
								id={ id }
								autocompleteRef={ autocompleteRef }
							/>
							<Button
								icon={ keyboardReturn }
								label={ __( 'Apply', 'kadence-blocks'  ) }
								type="submit"
							/>
						</form>
					) }
					{ url && ! isEditingLink && (
						<Fragment>
							<div className={ 'block-editor-url-popover__link-viewer block-editor-format-toolbar__link-container-content' }>
								{ ! url ?
									<span></span>
								:
									<ExternalLink href={ url }>
										{ filterURLForDisplay( safeDecodeURI( url ) ) }
									</ExternalLink>
								}
								{ startEditLink && (
									<Button
										icon={ edit }
										label={ __( 'Edit' ) }
										onClick={ startEditLink }
									/>
								) }
							</div>
						</Fragment>
					) }
				</div>
				{ additionalControls && (
					<Button
						className="kb-link-settings-toggle"
						icon={ chevronDown }
						label={ __( 'Link settings', 'kadence-blocks'  ) }
						onClick={ toggleSettingsVisibility }
						aria-expanded={ isSettingsExpanded }
					/>
				) }
			</div>
			{ additionalControls && isSettingsExpanded && (
				<div className="kb-link-control-additional-controls">
					{ advancedOptions }
				</div>
			) }
		</div>
	);
};

export default URLInputControl;
