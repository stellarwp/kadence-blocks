/**
 * BLOCK: Kadence Info Box
 */

/**
 * Import Icons
 */
import icons from '../../icons';
import GenIcon from '../../genicon';
import Ico from '../../svgicons';
import FaIco from '../../faicons';
/**
 * Import attributes
 */
import attributes from './attributes';
/**
 * Import edit
 */
import edit from './edit';

/**
 * Import Css
 */
import './style.scss';
import './editor.scss';

/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

const {
	RichText,
} = wp.editor;

/**
 * Register: a Gutenberg Block.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'kadence/infobox', {
	title: __( 'Info Box' ),
	icon: {
		src: icons.infobox,
	},
	category: 'common',
	keywords: [
		__( 'Info' ),
		__( 'Icon' ),
		__( 'KT' ),
	],
	attributes,
	edit,

	save: props => {
		const { attributes: { uniqueID, link, linkProperty, target, hAlign, mediaType, mediaImage, mediaIcon, mediaAlign, displayTitle, title, titleFont, displayText, contentText, displayLearnMore, learnMore }, className } = props;
		const titleTagName = 'h' + titleFont[ 0 ].level;
		return (
			<div id={ `kt-info-box${ uniqueID }` } className={ className }>
				{ linkProperty !== 'learnmore' && (
					<a className={ `kt-blocks-info-box-link-wrap kt-blocks-info-box-media-align-${ mediaAlign } kt-info-halign-${ hAlign }` } target={ target } href={ link }>
						<div className={ `kt-blocks-info-box-media kt-info-media-animate-${ 'image' === mediaType ? mediaImage[ 0 ].hoverAnimation : mediaIcon[ 0 ].hoverAnimation }` }>
							{ mediaImage[ 0 ].url && 'image' === mediaType && (
								<div className="kadence-info-box-image-inner-intrisic-container" style={ {
									maxWidth: mediaImage[ 0 ].maxWidth + 'px',
								} } >
									<div className={ `kadence-info-box-image-intrisic kt-info-animate-${ mediaImage[ 0 ].hoverAnimation }` } style={ {
										paddingBottom: ( ( mediaImage[ 0 ].height / mediaImage[ 0 ].width ) * 100 ) + '%',
									} } >
										<div className="kadence-info-box-image-inner-intrisic">
											<img
												src={ mediaImage[ 0 ].url }
												alt={ mediaImage[ 0 ].alt }
												width={ mediaImage[ 0 ].width }
												height={ mediaImage[ 0 ].height }
												className={ mediaImage[ 0 ].id ? `kt-info-box-image wp-image-${ mediaImage[ 0 ].id }` : 'kt-info-box-image wp-image-offsite' }
											/>
											{ mediaImage[ 0 ].flipUrl && 'flip' === mediaImage[ 0 ].hoverAnimation && (
												<img
													src={ mediaImage[ 0 ].flipUrl }
													alt={ mediaImage[ 0 ].flipAlt }
													width={ mediaImage[ 0 ].flipWidth }
													height={ mediaImage[ 0 ].flipHeight }
													className={ mediaImage[ 0 ].flipId ? `kt-info-box-image-flip wp-image-${ mediaImage[ 0 ].flipId }` : 'kt-info-box-image-flip wp-image-offsite' }
												/>
											) }
										</div>
									</div>
								</div>
							) }
							{ 'icon' === mediaType && (
								<div className={ `kadence-info-box-icon-container kt-info-icon-animate-${ mediaIcon[ 0 ].hoverAnimation }` } >
									<div className={ 'kadence-info-box-icon-inner-container' } >
										<GenIcon className={ `kt-info-svg-icon kt-info-svg-icon-${ mediaIcon[ 0 ].icon }` } name={ mediaIcon[ 0 ].icon } size={ ( ! mediaIcon[ 0 ].size ? '14' : mediaIcon[ 0 ].size ) } icon={ ( 'fa' === mediaIcon[ 0 ].icon.substring( 0, 2 ) ? FaIco[ mediaIcon[ 0 ].icon ] : Ico[ mediaIcon[ 0 ].icon ] ) } htmltag="span" strokeWidth={ ( 'fe' === mediaIcon[ 0 ].icon.substring( 0, 2 ) ? mediaIcon[ 0 ].width : undefined ) } style={ {
											display: 'block',
										} } />
										{ mediaIcon[ 0 ].flipIcon && 'flip' === mediaIcon[ 0 ].hoverAnimation && (
											<GenIcon className={ `kt-info-svg-icon-flip kt-info-svg-icon-${ mediaIcon[ 0 ].flipIcon }` } name={ mediaIcon[ 0 ].flipIcon } size={ ( ! mediaIcon[ 0 ].size ? '14' : mediaIcon[ 0 ].size ) } icon={ ( 'fa' === mediaIcon[ 0 ].flipIcon.substring( 0, 2 ) ? FaIco[ mediaIcon[ 0 ].flipIcon ] : Ico[ mediaIcon[ 0 ].flipIcon ] ) } htmltag="span" strokeWidth={ ( 'fe' === mediaIcon[ 0 ].flipIcon.substring( 0, 2 ) ? mediaIcon[ 0 ].width : undefined ) } style={ {
												display: 'block',
											} } />
										) }
									</div>
								</div>
							) }
						</div>
						<div className={ 'kt-infobox-textcontent' } >
							{ displayTitle && (
								<RichText.Content
									className="kt-blocks-info-box-title"
									tagName={ titleTagName }
									value={ title }
								/>
							) }
							{ displayText && (
								<RichText.Content
									className="kt-blocks-info-box-text"
									tagName={ 'p' }
									value={ contentText }
								/>
							) }
							{ displayLearnMore && (
								<div className="kt-blocks-info-box-learnmore-wrap">
									<RichText.Content
										className="kt-blocks-info-box-learnmore"
										tagName={ 'span' }
										value={ learnMore }
									/>
								</div>
							) }
						</div>
					</a>
				) }
				{ linkProperty === 'learnmore' && (
					<div className={ `kt-blocks-info-box-link-wrap kt-blocks-info-box-media-align-${ mediaAlign } kt-info-halign-${ hAlign }` }>
						<div className={ `kt-blocks-info-box-media kt-info-media-animate-${ 'image' === mediaType ? mediaImage[ 0 ].hoverAnimation : mediaIcon[ 0 ].hoverAnimation }` }>
							{ mediaImage[ 0 ].url && 'image' === mediaType && (
								<div className="kadence-info-box-image-inner-intrisic-container" style={ {
									maxWidth: mediaImage[ 0 ].maxWidth + 'px',
								} } >
									<div className={ `kadence-info-box-image-intrisic kt-info-animate-${ mediaImage[ 0 ].hoverAnimation }` } style={ {
										paddingBottom: ( ( mediaImage[ 0 ].height / mediaImage[ 0 ].width ) * 100 ) + '%',
									} } >
										<div className="kadence-info-box-image-inner-intrisic">
											<img
												src={ mediaImage[ 0 ].url }
												alt={ mediaImage[ 0 ].alt }
												width={ mediaImage[ 0 ].width }
												height={ mediaImage[ 0 ].height }
												className={ mediaImage[ 0 ].id ? `kt-info-box-image wp-image-${ mediaImage[ 0 ].id }` : 'kt-info-box-image wp-image-offsite' }
											/>
											{ mediaImage[ 0 ].flipUrl && 'flip' === mediaImage[ 0 ].hoverAnimation && (
												<img
													src={ mediaImage[ 0 ].flipUrl }
													alt={ mediaImage[ 0 ].flipAlt }
													width={ mediaImage[ 0 ].flipWidth }
													height={ mediaImage[ 0 ].flipHeight }
													className={ mediaImage[ 0 ].flipId ? `kt-info-box-image-flip wp-image-${ mediaImage[ 0 ].flipId }` : 'kt-info-box-image-flip wp-image-offsite' }
												/>
											) }
										</div>
									</div>
								</div>
							) }
							{ 'icon' === mediaType && (
								<div className={ `kadence-info-box-icon-container kt-info-icon-animate-${ mediaIcon[ 0 ].hoverAnimation }` } >
									<div className={ 'kadence-info-box-icon-inner-container' } >
										<GenIcon className={ `kt-info-svg-icon kt-info-svg-icon-${ mediaIcon[ 0 ].icon }` } name={ mediaIcon[ 0 ].icon } size={ ( ! mediaIcon[ 0 ].size ? '14' : mediaIcon[ 0 ].size ) } icon={ ( 'fa' === mediaIcon[ 0 ].icon.substring( 0, 2 ) ? FaIco[ mediaIcon[ 0 ].icon ] : Ico[ mediaIcon[ 0 ].icon ] ) } htmltag="span" strokeWidth={ ( 'fe' === mediaIcon[ 0 ].icon.substring( 0, 2 ) ? mediaIcon[ 0 ].width : undefined ) } style={ {
											display: 'block',
										} } />
										{ mediaIcon[ 0 ].flipIcon && 'flip' === mediaIcon[ 0 ].hoverAnimation && (
											<GenIcon className={ `kt-info-svg-icon-flip kt-info-svg-icon-${ mediaIcon[ 0 ].flipIcon }` } name={ mediaIcon[ 0 ].flipIcon } size={ ( ! mediaIcon[ 0 ].size ? '14' : mediaIcon[ 0 ].size ) } icon={ ( 'fa' === mediaIcon[ 0 ].flipIcon.substring( 0, 2 ) ? FaIco[ mediaIcon[ 0 ].flipIcon ] : Ico[ mediaIcon[ 0 ].flipIcon ] ) } htmltag="span" strokeWidth={ ( 'fe' === mediaIcon[ 0 ].flipIcon.substring( 0, 2 ) ? mediaIcon[ 0 ].width : undefined ) } style={ {
												display: 'block',
											} } />
										) }
									</div>
								</div>
							) }
						</div>
						<div className={ 'kt-infobox-textcontent' } >
							{ displayTitle && (
								<RichText.Content
									className="kt-blocks-info-box-title"
									tagName={ titleTagName }
									value={ title }
								/>
							) }
							{ displayText && (
								<RichText.Content
									className="kt-blocks-info-box-text"
									tagName={ 'p' }
									value={ contentText }
								/>
							) }
							{ displayLearnMore && (
								<div className="kt-blocks-info-box-learnmore-wrap">
									<RichText.Content
										className="kt-blocks-info-box-learnmore"
										tagName={ 'a' }
										target={ target }
										value={ learnMore }
										href={ link }
									/>
								</div>
							) }
						</div>
					</div>
				) }
			</div>
		);
	},
} );
