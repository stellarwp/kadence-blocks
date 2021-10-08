/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
const { Component, Fragment } = wp.element;
const { IconButton, Spinner, ToggleControl } = wp.components;
import { __ } from '@wordpress/i18n';
const { BACKSPACE, DELETE } = wp.keycodes;
import { withSelect } from '@wordpress/data';
const { RichText, URLPopover, URLInput } = wp.blockEditor;
const { isBlobURL } = wp.blob;
const {
	applyFilters,
} = wp.hooks;

class GalleryImage extends Component {
	constructor() {
		super( ...arguments );

		this.onSelectImage = this.onSelectImage.bind( this );
		this.onSelectCaption = this.onSelectCaption.bind( this );
		this.onRemoveImage = this.onRemoveImage.bind( this );
		this.bindContainer = this.bindContainer.bind( this );
		this.toggleSettingsVisibility = this.toggleSettingsVisibility.bind( this );

		this.state = {
			captionSelected: false,
			showSettings: false,
		};
	}
	toggleSettingsVisibility() {
		this.setState( {
			showSettings: ! this.state.showSettings,
		} );
	}

	bindContainer( ref ) {
		this.container = ref;
	}

	onSelectCaption() {
		if ( ! this.props.isSelected ) {
			this.props.onSelect();
		}
		if ( ! this.state.captionSelected ) {
			this.setState( {
				captionSelected: true,
			} );
		}
	}

	onSelectImage() {
		if ( ! this.props.isSelected ) {
			this.props.onSelect();
		}

		if ( this.state.captionSelected ) {
			this.setState( {
				captionSelected: false,
			} );
		}
	}

	onRemoveImage( event ) {
		if (
			this.container === document.activeElement &&
			this.props.isSelected && [ BACKSPACE, DELETE ].indexOf( event.keyCode ) !== -1
		) {
			event.stopPropagation();
			event.preventDefault();
			this.props.onRemove();
		}
	}

	componentDidUpdate( prevProps ) {
		const { isSelected, image, url } = this.props;
		if ( image && ! url ) {
			this.props.setAttributes( {
				url: image.source_url,
				alt: image.alt_text,
			} );
		}

		// unselect the caption so when the user selects other image and comeback
		// the caption is not immediately selected
		if ( this.state.captionSelected && ! isSelected && prevProps.isSelected ) {
			this.setState( {
				captionSelected: false,
			} );
		}
	}

	render() {
		const { url, width, height, imageRatio, lightUrl, thumbUrl, customLink, linkTarget, alt, id, linkTo, link, isFirstItem, isLastItem, isSelected, showCaption, caption, captionStyle, captionStyles, onRemove, onMoveForward, onMoveBackward, setAttributes, setLinkAttributes, 'aria-label': ariaLabel, type, thumbnail } = this.props;
		let href;
		switch ( linkTo ) {
			case 'media':
				href = url;
				break;
			case 'custom':
				href = ( customLink ? customLink : url );
				break;
			case 'attachment':
				href = link;
				break;
		}
		const imgContainClassName = classnames( {
			'kb-gallery-image-contain': true,
			'kadence-blocks-gallery-intrinsic': ( ( type === 'grid' && 'inherit' !== imageRatio ) || ( ( type === 'carousel' || type === 'slider' || type === 'thumbslider' ) && imageRatio ) || ( type !== 'fluidcarousel' && type !== 'tiles' && width && height ) ),
			[ `kb-gallery-image-ratio-${ imageRatio }` ]: imageRatio && ( type === 'grid' || type === 'carousel' || type === 'slider' || type === 'thumbslider' ),
		} );
		const img = (
			<button
				className={ imgContainClassName }
				onClick={ this.onSelectImage }
				unstableOnFocus={ this.onSelectImage }
				onKeyDown={ this.onRemoveImage }
				tabIndex="0"
				aria-label={ ariaLabel }
				ref={ this.bindContainer }
				style={ {
					paddingBottom: ( ( type === 'masonry' && width && height ) || ( type === 'grid' && imageRatio === 'inherit' && width && height ) ? ( ( height / width ) * 100 ) + '%' : undefined ),
				} }
			>
				<img
					src={ thumbUrl || url }
					alt={ alt }
					width={ width }
					height={ height }
					data-id={ id }
					data-full-image={ url }
					data-light-image={ lightUrl }
					data-link={ link }
					data-custom-link={ customLink }
					data-custom-link-target={ linkTarget }
				/>
				{ isBlobURL( url ) && <Spinner /> }
			</button>
		);
		const thumbImg = (
			<div
				className={ imgContainClassName }
				style={ {
					paddingBottom: ( ( type === 'masonry' && width && height ) || ( type === 'grid' && imageRatio === 'inherit' && width && height ) ? ( ( height / width ) * 100 ) + '%' : undefined ),
				} }
			>
				<img
					src={ thumbUrl || url }
					alt={ alt }
					width={ width }
					height={ height }
					data-id={ id }
					data-full-image={ url }
					data-light-image={ lightUrl }
					data-link={ link }
					data-custom-link={ customLink }
					data-custom-link-target={ linkTarget }
				/>
				{ isBlobURL( url ) && <Spinner /> }
			</div>
		);
		const figcap = (
			<RichText
				tagName="figcaption"
				className={ `kadence-blocks-gallery-item__caption${ ( this.state.captionSelected ? ' editing-caption' : '' ) }` }
				placeholder={ isSelected ? __( 'Write caption…', 'kadence-blocks' ) : null }
				value={ caption }
				isSelected={ this.state.captionSelected }
				onChange={ ( newCaption ) => setAttributes( { caption: newCaption } ) }
				unstableOnFocus={ this.onSelectCaption }
				inlineToolbar={ this.state.captionSelected ? true : false }
				allowedFormats={ ( linkTo === 'none' ? applyFilters( 'kadence.whitelist_richtext_formats', [ 'kadence/insert-dynamic', 'core/bold', 'core/italic', 'core/link', 'toolset/inline-field' ] ) : applyFilters( 'kadence.whitelist_richtext_formats', [ 'kadence/insert-dynamic', 'core/bold', 'core/italic', 'toolset/inline-field' ] ) ) }
				keepPlaceholderOnFocus
				style={ {
					fontWeight: '' !== captionStyles[ 0 ].weight ? captionStyles[ 0 ].weight : undefined,
					fontStyle: '' !== captionStyles[ 0 ].style ? captionStyles[ 0 ].style : undefined,
					fontSize: undefined !== captionStyles[ 0 ].size && '' !== captionStyles[ 0 ].size[ 0 ] ? captionStyles[ 0 ].size[ 0 ] + captionStyles[ 0 ].sizeType : undefined,
					lineHeight: ( captionStyles[ 0 ].lineHeight && captionStyles[ 0 ].lineHeight[ 0 ] ? captionStyles[ 0 ].lineHeight[ 0 ] + captionStyles[ 0 ].lineType : undefined ),
					textTransform: ( '' !== captionStyles[ 0 ].textTransform ? captionStyles[ 0 ].textTransform : undefined ),
					letterSpacing: '' !== captionStyles[ 0 ].letterSpacing ? captionStyles[ 0 ].letterSpacing + 'px' : undefined,
					fontFamily: ( '' !== captionStyles[ 0 ].family ? captionStyles[ 0 ].family : '' ),
				} }
			/>
		);
		const className = classnames( {
			'kb-gallery-figure': true,
			'is-selected': ! thumbnail && isSelected,
			'is-transient': isBlobURL( thumbUrl || url ),
			'kadence-blocks-gallery-item-has-caption': showCaption && caption,
			'kadence-blocks-gallery-item-hide-caption': ! showCaption,
			[ `kb-has-image-ratio-${ imageRatio }` ]: imageRatio && ( type === 'grid' || type === 'carousel' || type === 'slider' || type === 'thumbslider' ),
		} );

		return (
			<Fragment>
				<figure className={ className }>
					<div className="kb-gal-image-radius" style={ {
						maxWidth: ( ( type === 'masonry' && width && height ) ? width + 'px' : undefined ),
					} }>
						{ ! thumbnail &&
							img
						}
						{ thumbnail &&
							thumbImg
						}
						{ ! thumbnail && ( 'below' !== captionStyle || ! showCaption ) && (
							figcap
						) }
					</div>
					{ ! thumbnail && (
						<Fragment>
							{ 'below' === captionStyle && showCaption && (
								figcap
							) }
							<div className="kadence-blocks-library-gallery-item__move-menu">
								<IconButton
									icon="arrow-left"
									onClick={ isFirstItem ? undefined : onMoveBackward }
									className="kadence-blocks-gallery-item__move-backward"
									label={ __( 'Move Image Backward', 'kadence-blocks' ) }
									aria-disabled={ isFirstItem }
									disabled={ ! isSelected }
								/>
								<IconButton
									icon="arrow-right"
									onClick={ isLastItem ? undefined : onMoveForward }
									className="kadence-blocks-gallery-item__move-forward"
									label={ __( 'Move Image Forward', 'kadence-blocks' ) }
									aria-disabled={ isLastItem }
									disabled={ ! isSelected }
								/>
							</div>
							<div className="kadence-blocks-library-gallery-item__inline-menu">
								<IconButton
									icon="no-alt"
									onClick={ onRemove }
									className="kadence-blocks-gallery-item__remove"
									label={ __( 'Remove Image', 'kadence-blocks' ) }
									disabled={ ! isSelected }
								/>
							</div>
						</Fragment>
					) }
				</figure>
				{ ! thumbnail && linkTo === 'custom' && isSelected && (
					<Fragment>
						<div className="kb-gallery-custom-link block-editor-url-popover__row">
							<URLInput
								aria-label={ __( 'URL', 'kadence-blocks' ) }
								placeholder={ __( 'Paste or type URL', 'kadence-blocks' ) }
								className="editor-media-placeholder__url-input-field block-editor-media-placeholder__url-input-field"
								value={ customLink }
								onChange={ value=> setLinkAttributes( { customLink: value } ) }
							/>
							<IconButton
								className="editor-url-popover__settings-toggle block-editor-url-popover__settings-toggle"
								icon="arrow-down-alt2"
								label={ __( 'Link Settings', 'kadence-blocks' ) }
								onClick={ this.toggleSettingsVisibility }
								aria-expanded={ this.state.showSettings }
							/>
						</div>
						{ this.state.showSettings && (
							<div className="editor-url-popover__row block-editor-url-popover__row editor-url-popover__settings block-editor-url-popover__settings">
								<ToggleControl
									label={ __( 'Open in New Tab', 'kadence-blocks' ) }
									checked={ linkTarget === '_blank' }
									onChange={ ( target ) => setLinkAttributes( { linkTarget: ( target ? '_blank' : '' ) } ) }
								/>
							</div>
						) }
					</Fragment>
				) }
			</Fragment>
		);
	}
}

export default withSelect( ( select, ownProps ) => {
	const { getMedia } = select( 'core' );
	const { id } = ownProps;
	return {
		image: id ? getMedia( id ) : null,
	};
} )( GalleryImage );
