/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { Component, Fragment, useRef, useState } from '@wordpress/element';
import { Spinner, ToggleControl } from '@wordpress/components';

import { __ } from '@wordpress/i18n';
import { BACKSPACE, DELETE } from '@wordpress/keycodes';
import { withSelect } from '@wordpress/data';
import { RichText, URLPopover, URLInput } from '@wordpress/block-editor';
import { isBlobURL } from '@wordpress/blob';
import { applyFilters } from '@wordpress/hooks';

function GalleryImage( props ) {

	const {
		onSelect,
		container,
		url,
		width,
		height,
		imageRatio,
		lightUrl,
		thumbUrl,
		customLink,
		linkTarget,
		linkSponsored,
		alt,
		id,
		linkTo,
		link,
		isFirstItem,
		isLastItem,
		isSelected,
		showCaption,
		caption,
		captionStyle,
		captionStyles,
		onRemove,
		onMoveForward,
		onMoveBackward,
		setAttributes,
		setLinkAttributes,
		'aria-label': ariaLabel,
		type,
		thumbnail,
		dynamicSource,
	} = props;

	const [ captionSelected, setCaptionSelected ] = useState( false );
	const [ showSettings, setShowSettings ] = useState( false );

	const toggleSettingsVisibility = () => {
		setShowSettings( !showSettings );
	};

	const onSelectCaption = () => {
		if ( !isSelected ) {
			onSelect();
		}
		if ( !captionSelected ) {
			setCaptionSelected( true );
		}
	};

	const onSelectImage = () => {
		if ( !isSelected ) {
			onSelect();
		}

		if ( captionSelected ) {
			setCaptionSelected( false );
		}
	};

	const onRemoveImage = ( event ) => {
		if (
			container === document.activeElement &&
			isSelected && [ BACKSPACE, DELETE ].indexOf( event.keyCode ) !== -1
		) {
			event.stopPropagation();
			event.preventDefault();
			onRemove();
		}
	};

	const componentDidUpdate = ( prevProps ) => {
		if ( image && !url ) {
			setAttributes( {
				url: image.source_url,
				alt: image.alt_text,
			} );
		}

		// unselect the caption so when the user selects other image and comeback
		// the caption is not immediately selected
		if ( captionSelected && !isSelected && prevProps.isSelected ) {
			setCaptionSelected( false );
		}
	}

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
		'kb-gallery-image-contain'                : true,
		'kadence-blocks-gallery-intrinsic'        : ( ( type === 'grid' && 'inherit' !== imageRatio ) || ( ( type === 'carousel' || type === 'slider' || type === 'thumbslider' ) && imageRatio ) || ( type !== 'fluidcarousel' && type !== 'tiles' && width && height ) ),
		[ `kb-gallery-image-ratio-${imageRatio}` ]: imageRatio && ( type === 'grid' || type === 'carousel' || type === 'slider' || type === 'thumbslider' ),
	} );

	const btnRef = useRef();

	const img = (
		<button
			className={imgContainClassName}
			onClick={ () => onSelectImage}
			unstableOnFocus={ () => onSelectImage}
			onKeyDown={ () => onRemoveImage}
			tabIndex="0"
			aria-label={ariaLabel}
			ref={ btnRef }
			style={{
				paddingBottom: ( ( type === 'masonry' && width && height ) || ( type === 'grid' && imageRatio === 'inherit' && width && height ) ? ( ( height / width ) * 100 ) + '%' : undefined ),
			}}
		>
			<img
				src={thumbUrl || url}
				alt={alt}
				width={width}
				height={height}
				data-id={id}
				data-full-image={url}
				data-light-image={lightUrl}
				data-link={link}
				data-custom-link={customLink}
				data-custom-link-target={linkTarget}
			/>
			{isBlobURL( url ) && <Spinner/>}
		</button>
	);

	const thumbImg = (
		<div
			className={imgContainClassName}
			style={{
				paddingBottom: ( ( type === 'masonry' && width && height ) || ( type === 'grid' && imageRatio === 'inherit' && width && height ) ? ( ( height / width ) * 100 ) + '%' : undefined ),
			}}
		>
			<img
				src={thumbUrl || url}
				alt={alt}
				width={width}
				height={height}
				data-id={id}
				data-full-image={url}
				data-light-image={lightUrl}
				data-link={link}
				data-custom-link={customLink}
				data-custom-link-target={linkTarget}
			/>
			{isBlobURL( url ) && <Spinner/>}
		</div>
	);

	const figcap = (
		<RichText
			tagName="figcaption"
			className={`kadence-blocks-gallery-item__caption${( captionSelected ? ' editing-caption' : '' )}`}
			placeholder={isSelected ? __( 'Write caption…', 'kadence-blocks' ) : null}
			value={caption}
			isSelected={captionSelected}
			onChange={( newCaption ) => setAttributes( { caption: newCaption } )}
			unstableOnFocus={ () => onSelectCaption}
			inlineToolbar={captionSelected ? true : false}
			allowedFormats={( linkTo === 'none' ? applyFilters( 'kadence.whitelist_richtext_formats', [ 'kadence/insert-dynamic', 'core/bold', 'core/italic', 'core/link', 'toolset/inline-field' ] ) : applyFilters( 'kadence.whitelist_richtext_formats', [ 'kadence/insert-dynamic', 'core/bold', 'core/italic', 'toolset/inline-field' ] ) )}
			keepPlaceholderOnFocus
			style={{
				fontWeight   : '' !== captionStyles[ 0 ].weight ? captionStyles[ 0 ].weight : undefined,
				fontStyle    : '' !== captionStyles[ 0 ].style ? captionStyles[ 0 ].style : undefined,
				fontSize     : undefined !== captionStyles[ 0 ].size && '' !== captionStyles[ 0 ].size[ 0 ] ? captionStyles[ 0 ].size[ 0 ] + captionStyles[ 0 ].sizeType : undefined,
				lineHeight   : ( captionStyles[ 0 ].lineHeight && captionStyles[ 0 ].lineHeight[ 0 ] ? captionStyles[ 0 ].lineHeight[ 0 ] + captionStyles[ 0 ].lineType : undefined ),
				textTransform: ( '' !== captionStyles[ 0 ].textTransform ? captionStyles[ 0 ].textTransform : undefined ),
				letterSpacing: '' !== captionStyles[ 0 ].letterSpacing ? captionStyles[ 0 ].letterSpacing + 'px' : undefined,
				fontFamily   : ( '' !== captionStyles[ 0 ].family ? captionStyles[ 0 ].family : '' ),
			}}
		/>
	);
	const figcapDynamic = (
		<figcaption
			className={`kadence-blocks-gallery-item__caption`}
			style={{
				fontWeight   : '' !== captionStyles[ 0 ].weight ? captionStyles[ 0 ].weight : undefined,
				fontStyle    : '' !== captionStyles[ 0 ].style ? captionStyles[ 0 ].style : undefined,
				fontSize     : undefined !== captionStyles[ 0 ].size && '' !== captionStyles[ 0 ].size[ 0 ] ? captionStyles[ 0 ].size[ 0 ] + captionStyles[ 0 ].sizeType : undefined,
				lineHeight   : ( captionStyles[ 0 ].lineHeight && captionStyles[ 0 ].lineHeight[ 0 ] ? captionStyles[ 0 ].lineHeight[ 0 ] + captionStyles[ 0 ].lineType : undefined ),
				textTransform: ( '' !== captionStyles[ 0 ].textTransform ? captionStyles[ 0 ].textTransform : undefined ),
				letterSpacing: '' !== captionStyles[ 0 ].letterSpacing ? captionStyles[ 0 ].letterSpacing + 'px' : undefined,
				fontFamily   : ( '' !== captionStyles[ 0 ].family ? captionStyles[ 0 ].family : '' ),
			}}
		>
			{caption}
		</figcaption>
	);
	const capOutput = dynamicSource ? figcapDynamic : figcap;
	const className = classnames( {
		'kb-gallery-figure'                       : true,
		'is-selected'                             : !thumbnail && isSelected,
		'is-transient'                            : isBlobURL( thumbUrl || url ),
		'kadence-blocks-gallery-item-has-caption' : showCaption && caption,
		'kadence-blocks-gallery-item-hide-caption': !showCaption,
		[ `kb-has-image-ratio-${imageRatio}` ]    : imageRatio && ( type === 'grid' || type === 'carousel' || type === 'slider' || type === 'thumbslider' ),
	} );

	return (
		<Fragment>
			<figure className={className}>
				<div className="kb-gal-image-radius" style={{
					maxWidth: ( ( type === 'masonry' && width && height ) ? width + 'px' : undefined ),
				}}>
					{!thumbnail &&
						img
					}
					{thumbnail &&
						thumbImg
					}
					{!thumbnail && ( 'below' !== captionStyle || !showCaption ) && (
						capOutput
					)}
				</div>
				{!thumbnail && (
					<Fragment>
						{'below' === captionStyle && showCaption && (
							capOutput
						)}
						{!dynamicSource && (
							<Fragment>
								<div className="kadence-blocks-library-gallery-item__move-menu">
									<Button
										icon="arrow-left"
										onClick={isFirstItem ? undefined : onMoveBackward}
										className="kadence-blocks-gallery-item__move-backward"
										label={__( 'Move Image Backward', 'kadence-blocks' )}
										aria-disabled={isFirstItem}
										disabled={!isSelected}
									/>
									<Button
										icon="arrow-right"
										onClick={isLastItem ? undefined : onMoveForward}
										className="kadence-blocks-gallery-item__move-forward"
										label={__( 'Move Image Forward', 'kadence-blocks' )}
										aria-disabled={isLastItem}
										disabled={!isSelected}
									/>
								</div>
								<div className="kadence-blocks-library-gallery-item__inline-menu">
									<Button
										icon="no-alt"
										onClick={onRemove}
										className="kadence-blocks-gallery-item__remove"
										label={__( 'Remove Image', 'kadence-blocks' )}
										disabled={!isSelected}
									/>
								</div>
							</Fragment>
						)}
					</Fragment>
				)}
			</figure>
			{!thumbnail && linkTo === 'custom' && isSelected && !dynamicSource && (
				<Fragment>
					<div className="kb-gallery-custom-link block-editor-url-popover__row">
						<URLInput
							aria-label={__( 'URL', 'kadence-blocks' )}
							placeholder={__( 'Paste or type URL', 'kadence-blocks' )}
							className="editor-media-placeholder__url-input-field block-editor-media-placeholder__url-input-field"
							value={customLink}
							onChange={value => setLinkAttributes( { customLink: value } )}
						/>
						<Button
							className="editor-url-popover__settings-toggle block-editor-url-popover__settings-toggle"
							icon="arrow-down-alt2"
							label={__( 'Link Settings', 'kadence-blocks' )}
							onClick={ () => toggleSettingsVisibility}
							aria-expanded={ () => showSettings }
						/>
					</div>
					{ showSettings && (
						<div className="editor-url-popover__row block-editor-url-popover__row editor-url-popover__settings block-editor-url-popover__settings">
							<ToggleControl
								label={__( 'Open in New Tab', 'kadence-blocks' )}
								checked={linkTarget === '_blank'}
								onChange={( target ) => setLinkAttributes( { linkTarget: ( target ? '_blank' : '' ) } )}
							/>
							<ToggleControl
								label={__( 'Sponsored', 'kadence-blocks' )}
								checked={linkSponsored === 'sponsored'}
								onChange={( value ) => setLinkAttributes( { linkSponsored: ( value ? 'sponsored' : '' ) } )}
							/>
						</div>
					)}
				</Fragment>
			)}
		</Fragment>
	);

}

export default withSelect( ( select, ownProps ) => {
	const { getMedia } = select( 'core' );
	const { id } = ownProps;
	return {
		image: id ? getMedia( id ) : null,
	};
} )( GalleryImage );
