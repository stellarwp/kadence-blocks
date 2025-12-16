/**
 * External dependencies
 */
 import { debounce } from 'lodash';
 import classnames from 'classnames';
 import { keyboardReturn, cancelCircleFilled, edit, chevronDown, globe } from '@wordpress/icons';
 /**
  * WordPress dependencies
  */
import { __ } from '@wordpress/i18n';
import { Component,Fragment, createRef } from '@wordpress/element';
import { safeDecodeURI, filterURLForDisplay } from '@wordpress/url';
import { applyFilters } from '@wordpress/hooks';
import { UP, DOWN, ENTER, TAB } from '@wordpress/keycodes';
import { BaseControl, Button, Spinner, ToggleControl, ExternalLink, Icon } from '@wordpress/components';
import { withInstanceId, withSafeTimeout, compose } from '@wordpress/compose';
import DynamicLinkControl from '../dynamic-link-control';
import TextHighlight from '../text-highlight';
import fetchSearchResults from '../../links/get-post-search-results';

 class InputSearch extends Component {
	 constructor( props ) {
		 super( props );

		 this.onChange = this.onChange.bind( this );
		 this.onFocus = this.onFocus.bind( this );
		 this.onKeyDown = this.onKeyDown.bind( this );
		 this.selectPost = this.selectPost.bind( this );
		 this.handleOnClick = this.handleOnClick.bind( this );
		 this.autocompleteRef = props.autocompleteRef || createRef();
		 this.inputRef = createRef();
		 this.updateSuggestions = debounce(
			 this.updateSuggestions.bind( this ),
			 200
		 );

		 this.suggestionNodes = [];

		 this.isUpdatingSuggestions = false;

		 this.state = {
			 search: '',
			 suggestions: [],
			 showSuggestions: false,
			 selectedSuggestion: null,
			 suggestionsListboxId: '',
			 suggestionOptionIdPrefix: '',
			 isEditing: false,
		 };
	}

	updateSuggestions( value = '' ) {
		 this.setState( {
			selectedSuggestion: null,
			loading: true,
		 } );

		 const request = fetchSearchResults( value );
		 request.then( ( suggestions ) => {
			// A fetch Promise doesn't have an abort option. It's mimicked by
			// comparing the request reference in on the instance, which is
			// reset or deleted on subsequent requests or unmounting.
			if ( this.suggestionsRequest !== request ) {
				return;
			}
			this.setState( {
				suggestions,
				loading: false,
				showSuggestions: !! suggestions.length,
			} );
		} )
		.catch( () => {
			if ( this.suggestionsRequest === request ) {
				this.setState( {
					loading: false,
				} );
			}
		} );

		 // Note that this assignment is handled *before* the async search request
		 // as a Promise always resolves on the next tick of the event loop.
		 this.suggestionsRequest = request;
	 }

	 onChange( event ) {
		 const inputValue = event.target.value;
		 this.setState( {
			search: inputValue,
		} );
		this.updateSuggestions( inputValue.trim() );
	 }

	 onFocus() {
		 const { suggestions, search } = this.state;

		 // When opening the link editor, if there's a value present, we want to load the suggestions pane with the results for this input search value
		 // Don't re-run the suggestions on focus if there are already suggestions present (prevents searching again when tabbing between the input and buttons)
		 if (
			search &&
			 ! this.loading &&
			 ! ( suggestions && suggestions.length )
		 ) {
			 // Ensure the suggestions are updated with the current input value
			 this.updateSuggestions( search.trim() );
		 }
	 }

	 onKeyDown( event ) {
		 const {
			 showSuggestions,
			 selectedSuggestion,
			 suggestions,
			 loading,
		 } = this.state;

		 // If the suggestions are not shown or loading, we shouldn't handle the arrow keys
		 // We shouldn't preventDefault to allow block arrow keys navigation
		 if ( ! showSuggestions || ! suggestions.length || loading ) {
			 // In the Windows version of Firefox the up and down arrows don't move the caret
			 // within an input field like they do for Mac Firefox/Chrome/Safari. This causes
			 // a form of focus trapping that is disruptive to the user experience. This disruption
			 // only happens if the caret is not in the first or last position in the text input.
			 // See: https://github.com/WordPress/gutenberg/issues/5693#issuecomment-436684747
			 switch ( event.keyCode ) {
				 // When UP is pressed, if the caret is at the start of the text, move it to the 0
				 // position.
				 case UP: {
					 if ( 0 !== event.target.selectionStart ) {
						 event.stopPropagation();
						 event.preventDefault();

						 // Set the input caret to position 0
						 event.target.setSelectionRange( 0, 0 );
					 }
					 break;
				 }
				 // When DOWN is pressed, if the caret is not at the end of the text, move it to the
				 // last position.
				 case DOWN: {
					 if (
						 this.state.search.length !== event.target.selectionStart
					 ) {
						 event.stopPropagation();
						 event.preventDefault();

						 // Set the input caret to the last position
						 event.target.setSelectionRange(
							 this.state.search.length,
							 this.state.search.length
						 );
					 }
					 break;
				 }
			 }

			 return;
		 }

		 const suggestion = this.state.suggestions[
			 this.state.selectedSuggestion
		 ];

		 switch ( event.keyCode ) {
			 case UP: {
				 event.stopPropagation();
				 event.preventDefault();
				 const previousIndex = ! selectedSuggestion
					 ? suggestions.length - 1
					 : selectedSuggestion - 1;
				 this.setState( {
					 selectedSuggestion: previousIndex,
				 } );
				 break;
			 }
			 case DOWN: {
				 event.stopPropagation();
				 event.preventDefault();
				 const nextIndex =
					 selectedSuggestion === null ||
					 selectedSuggestion === suggestions.length - 1
						 ? 0
						 : selectedSuggestion + 1;
				 this.setState( {
					 selectedSuggestion: nextIndex,
				 } );
				 break;
			 }
			 case TAB: {
				 if ( this.state.selectedSuggestion !== null ) {
					 this.selectPost( suggestion );
					 // Announce a link has been selected when tabbing away from the input field.
					 this.props.speak( __( 'Link selected.' ) );
				 }
				 break;
			 }
			 case ENTER: {
				 if ( this.state.selectedSuggestion !== null ) {
					 event.stopPropagation();
					 this.selectPost( suggestion );
				 }
				 break;
			 }
		 }
	 }

	 selectPost( suggestion ) {
		 this.props.onChange( suggestion.url, suggestion );
		 this.setState( {
			isEditing: false,
			selectedSuggestion: null,
			showSuggestions: false,
		 } );
	 }

	 handleOnClick( suggestion ) {
		this.selectPost( suggestion );
	 }

	 render() {
		 return (
			<Fragment>
				 { this.renderControl() }
				 { this.renderSuggestions() }
				 { this.renderSettings() }
			</Fragment>
		 );
	 }
	 renderSettings() {
		const {
			isSettingsExpanded,
			additionalControls,
			advancedOptions,
		} = this.props;
		return (
			<Fragment>
				{ additionalControls && isSettingsExpanded && (
					<div className="kb-link-control-additional-controls">
						{ advancedOptions }
					</div>
				) }
			</Fragment>
		 );
	 }
	 renderControl() {
		 const {
			 label,
			 className,
			 isFullWidth,
			 instanceId,
			 placeholder = __( 'Paste URL or type to search', 'kadence-blocks' ),
			 url = '',
			 attributes,
			 dynamicAttribute = '',
			 isSettingsExpanded,
			 additionalControls,
			 advancedOptions,
			 onExpandSettings,
			 allowClear,
		 } = this.props;

		 const {
			 loading,
			 showSuggestions,
			 selectedSuggestion,
			 suggestionsListboxId = `block-editor-url-input-suggestions-${ instanceId }`,
			 suggestionOptionIdPrefix = `block-editor-url-input-suggestion-${ instanceId }`,
			 isEditing,
		 } = this.state;

		 const controlProps = {
			 id: `url-input-control-${ instanceId }`,
			 className: 'kb-search-selection-name',
		 };

		 const inputProps = {
			 value: this.state.search || url,
			 required: true,
			 className: 'kb-search-selection-input',
			 type: 'text',
			 onChange: this.onChange,
			 onFocus: this.onFocus,
			 placeholder,
			 onKeyDown: this.onKeyDown,
			 role: 'combobox',
			 'aria-label': __( 'URL Input or Search', 'kadence-blocks' ),
			 'aria-expanded': showSuggestions,
			 'aria-autocomplete': 'list',
			 'aria-owns': suggestionsListboxId,
			 'aria-activedescendant':
				 selectedSuggestion !== null
					 ? `${ suggestionOptionIdPrefix }-${ selectedSuggestion }`
					 : undefined,
			 ref: this.inputRef,
		 };
		 return (
			<Fragment>
				<div className="kb-side-link-control-inner-row">
					{ url && ! isEditing && (
						<div className={ 'kb-search-selection-name' }>
							{ applyFilters(
								'kadence.linkDisplay',
								<Fragment>
									<div className={ 'block-editor-url-popover__link-viewer block-editor-format-toolbar__link-container-content' }>
										{ ! url ?
											<span></span>
										:
											<ExternalLink href={ url }>
												{ filterURLForDisplay( safeDecodeURI( url ) ) }
											</ExternalLink>
										}
										<Button
											icon={ edit }
											label={ __( 'Edit', 'kadence-blocks' ) }
											onClick={ () => {
												if ( this.state.search ) {
													this.updateSuggestions( this.state.search );
												}
												this.setState( { isEditing: true } );
											} }
										/>
									</div>
								</Fragment>,
								this.props.attributes,
								dynamicAttribute, 
								undefined,
								this.props.context
							) }
						</div>
					) }
					{ ( ! url || isEditing ) && (
						<BaseControl { ...controlProps }>
							<div className="kb-search-url-input">
								<input { ...inputProps } />
							</div>
							{ loading && <Spinner /> }
							{ allowClear && ! this.state.search && url && (
								<Button
									className="kb-search-url-clear"
									icon={ cancelCircleFilled }
									label={ __( 'Clear', 'kadence-blocks' ) }
									onClick={ () => {
										this.props.onChange( '', '' );
										this.setState( {
											isEditing: false,
											selectedSuggestion: null,
											showSuggestions: false,
										} );
									} }
								/>
							) }
							<Button
								className="kb-search-url-submit"
								icon={ keyboardReturn }
								label={ __( 'Submit', 'kadence-blocks' ) }
								onClick={ () => {
									this.props.onChange( ( this.state.search || url ), '' );
									this.setState( {
										isEditing: false,
										selectedSuggestion: null,
										showSuggestions: false,
									} );
								} }
							/>
						</BaseControl>
					) }
					{ dynamicAttribute && kadence_blocks_params.dynamic_enabled && (
						<DynamicLinkControl { ...this.props }/>
					) }
					{ additionalControls && (
						<Button
							className="kb-link-settings-toggle"
							icon={ chevronDown }
							label={ __( 'Link settings', 'kadence-blocks'  ) }
							onClick={ onExpandSettings }
							aria-expanded={ isSettingsExpanded }
						/>
					) }
				</div>
			</Fragment>
		 );
	 }

	 renderSuggestions() {
		 const {
			 className,
		 } = this.props;

		 const {
			 showSuggestions,
			 suggestions,
			 selectedSuggestion,
			 suggestionsListboxId,
			 suggestionOptionIdPrefix,
			 loading,
			 search,
		 } = this.state;

		 const suggestionsListProps = {
			 id: suggestionsListboxId,
			 ref: this.autocompleteRef,
			 role: 'listbox',
		 };
		 const directLinkEntryTypes = [ 'url', 'mailto', 'tel', 'internal' ];
		 const buildSuggestionItemProps = ( suggestion, index ) => {
			 return {
				 role: 'option',
				 tabIndex: '-1',
				 id: `${ suggestionOptionIdPrefix }-${ index }`,
				 'aria-selected': index === selectedSuggestion,
			 };
		 };
		 if (
			 showSuggestions &&
			 !! suggestions.length
		 ) {
			 return (
				 <div className="kb-search-selection-list">
					 <div
						 { ...suggestionsListProps }
						 className={ classnames(
							 'kb-search-selection-suggestions',
							 `${ className }__suggestions`
						 ) }
					 >
						 { suggestions.map( ( suggestion, index ) => (
							 <Button
								 { ...buildSuggestionItemProps(
									 suggestion,
									 index
								 ) }
								 key={ suggestion.id }
								 className={ classnames(
									 'kb-search-selection-suggestion',
									 {
										 'is-selected':
											 index === selectedSuggestion,
									 }
								 ) }
								 onClick={ () =>
									 this.handleOnClick( suggestion )
								 }
							 >
								 { directLinkEntryTypes.includes( suggestion.type.toLowerCase() ) && (
									<Icon
										className="block-editor-link-control__search-item-icon"
										icon={ globe }
									/>
								) }
								 <span className="kb-search-selection-search-item-header">
								 	<span className="kb-search-selection-search-item-title">
										<TextHighlight
											text={ suggestion.title }
											highlight={ search }
										/>
									</span>
									<span
										aria-hidden={ ! directLinkEntryTypes.includes( suggestion.type.toLowerCase() ) }
										className="kb-search-selection-search-item-info"
									>
										{ ! directLinkEntryTypes.includes( suggestion.type.toLowerCase() ) &&
											( filterURLForDisplay(
												safeDecodeURI( suggestion.url )
											) ||
												'' ) }
										{ directLinkEntryTypes.includes( suggestion.type.toLowerCase() ) && __( 'Press ENTER to add this link' ) }
									</span>
								 </span>
								 <span className="kb-search-selection-search-item-type">
									{ suggestion.type === 'post_tag' ? 'tag' : suggestion.type }
								</span>
							 </Button>
						 ) ) }
					 </div>
				 </div>
			 );
		 }
		 return null;
	 }
 }

 export default compose(
	 withSafeTimeout,
	 withInstanceId
 )( InputSearch );
