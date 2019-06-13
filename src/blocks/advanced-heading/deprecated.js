/**
 * BLOCK: Kadence Advanced Heading
 *
 * Depreciated.
 */
const {
	Fragment,
} = wp.element;
const {
	RichText,
} = wp.blockEditor;
const {
	getBlockDefaultClassName,
} = wp.blocks;

export default [
	{
		attributes: {
			content: {
				type: 'array',
				source: 'children',
				selector: 'h1,h2,h3,h4,h5,h6',
			},
			level: {
				type: 'number',
				default: 2,
			},
			uniqueID: {
				type: 'string',
			},
			align: {
				type: 'string',
			},
			color: {
				type: 'string',
			},
			size: {
				type: 'number',
			},
			sizeType: {
				type: 'string',
				default: 'px',
			},
			lineHeight: {
				type: 'number',
			},
			lineType: {
				type: 'string',
				default: 'px',
			},
			tabSize: {
				type: 'number',
			},
			tabLineHeight: {
				type: 'number',
			},
			mobileSize: {
				type: 'number',
			},
			mobileLineHeight: {
				type: 'number',
			},
			letterSpacing: {
				type: 'number',
			},
			typography: {
				type: 'string',
				default: '',
			},
			googleFont: {
				type: 'boolean',
				default: false,
			},
			loadGoogleFont: {
				type: 'boolean',
				default: true,
			},
			fontSubset: {
				type: 'string',
				default: '',
			},
			fontVariant: {
				type: 'string',
				default: '',
			},
			fontWeight: {
				type: 'string',
				default: 'regular',
			},
			fontStyle: {
				type: 'string',
				default: 'normal',
			},
			topMargin: {
				type: 'number',
				default: '',
			},
			bottomMargin: {
				type: 'number',
				default: '',
			},
			marginType: {
				type: 'string',
				default: 'px',
			},
			markSize: {
				type: 'array',
				default: [ '', '', '' ],
			},
			markSizeType: {
				type: 'string',
				default: 'px',
			},
			markLineHeight: {
				type: 'array',
				default: [ '', '', '' ],
			},
			markLineType: {
				type: 'string',
				default: 'px',
			},
			markLetterSpacing: {
				type: 'number',
			},
			markTypography: {
				type: 'string',
				default: '',
			},
			markGoogleFont: {
				type: 'boolean',
				default: false,
			},
			markLoadGoogleFont: {
				type: 'boolean',
				default: true,
			},
			markFontSubset: {
				type: 'string',
				default: '',
			},
			markFontVariant: {
				type: 'string',
				default: '',
			},
			markFontWeight: {
				type: 'string',
				default: 'regular',
			},
			markFontStyle: {
				type: 'string',
				default: 'normal',
			},
			markColor: {
				type: 'string',
				default: '#f76a0c',
			},
			markBG: {
				type: 'string',
			},
			markBGOpacity: {
				type: 'number',
				default: 1,
			},
			markPadding: {
				type: 'array',
				default: [ 0, 0, 0, 0 ],
			},
			markPaddingControl: {
				type: 'string',
				default: 'linked',
			},
			markBorder: {
				type: 'string',
			},
			markBorderOpacity: {
				type: 'number',
				default: 1,
			},
			markBorderWidth: {
				type: 'number',
				default: 0,
			},
			markBorderStyle: {
				type: 'string',
				default: 'solid',
			},
			anchor: {
				type: 'string',
			},
		},
		save: ( { attributes } ) => {
			const { anchor, align, level, content, color, uniqueID, letterSpacing, topMargin, bottomMargin, marginType, className, kadenceAnimation, kadenceAOSOptions } = attributes;
			const tagName = 'h' + level;
			const mType = ( marginType ? marginType : 'px' );
			let tagId = ( anchor ? anchor : `kt-adv-heading${ uniqueID }` );
			const revealAnimation = ( kadenceAnimation && ( 'reveal-left' === kadenceAnimation || 'reveal-right' === kadenceAnimation || 'reveal-up' === kadenceAnimation || 'reveal-down' === kadenceAnimation ) ? true : false );
			const wrapper = ( anchor || revealAnimation ? true : false );
			tagId = ( revealAnimation && ! anchor ? `kt-adv-inner-heading${ uniqueID }` : `kt-adv-heading${ uniqueID }` );
			const classes = ( className ? `${ className } ${ getBlockDefaultClassName( 'kadence/advancedheading' ) }` : getBlockDefaultClassName( 'kadence/advancedheading' ) );
			const htmlItem = (
				<RichText.Content
					tagName={ tagName }
					id={ tagId }
					className={ `kt-adv-heading${ uniqueID } ${ classes }` }
					data-aos={ ( kadenceAnimation ? kadenceAnimation : undefined ) }
					data-aos-offset={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].offset ? kadenceAOSOptions[ 0 ].offset : undefined ) }
					data-aos-duration={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].duration ? kadenceAOSOptions[ 0 ].duration : undefined ) }
					data-aos-delay={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].delay ? kadenceAOSOptions[ 0 ].delay : undefined ) }
					data-aos-easing={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && kadenceAOSOptions[ 0 ].easing ? kadenceAOSOptions[ 0 ].easing : undefined ) }
					data-aos-once={ ( kadenceAOSOptions && kadenceAOSOptions[ 0 ] && undefined !== kadenceAOSOptions[ 0 ].once && '' !== kadenceAOSOptions[ 0 ].once ? kadenceAOSOptions[ 0 ].once : undefined ) }
					style={ {
						textAlign: align,
						color: color,
						letterSpacing: ( letterSpacing ? letterSpacing + 'px' : undefined ),
						marginTop: ( topMargin ? topMargin + mType : undefined ),
						marginBottom: ( bottomMargin ? bottomMargin + mType : undefined ),
					} }
					value={ content }
				/>
			);
			return (
				<Fragment>
					{ wrapper && (
						<div id={ `kt-adv-heading${ uniqueID }` } className={ `kadence-advanced-heading-wrapper${ ( revealAnimation ? ' kadence-heading-clip-animation' : '' ) }` }>
							{ htmlItem }
						</div>
					) }
					{ ! wrapper && (
						htmlItem
					) }
				</Fragment>
			);
		},
	},
	{
		attributes: {
			content: {
				type: 'array',
				source: 'children',
				selector: 'h1,h2,h3,h4,h5,h6',
			},
			level: {
				type: 'number',
				default: 2,
			},
			uniqueID: {
				type: 'string',
			},
			align: {
				type: 'string',
			},
			color: {
				type: 'string',
			},
			size: {
				type: 'number',
			},
			sizeType: {
				type: 'string',
				default: 'px',
			},
			lineHeight: {
				type: 'number',
			},
			lineType: {
				type: 'string',
				default: 'px',
			},
			tabSize: {
				type: 'number',
			},
			tabLineHeight: {
				type: 'number',
			},
			mobileSize: {
				type: 'number',
			},
			mobileLineHeight: {
				type: 'number',
			},
			letterSpacing: {
				type: 'number',
			},
			typography: {
				type: 'string',
				default: '',
			},
			googleFont: {
				type: 'boolean',
				default: false,
			},
			loadGoogleFont: {
				type: 'boolean',
				default: true,
			},
			fontSubset: {
				type: 'string',
				default: '',
			},
			fontVariant: {
				type: 'string',
				default: '',
			},
			fontWeight: {
				type: 'string',
				default: 'regular',
			},
			fontStyle: {
				type: 'string',
				default: 'normal',
			},
			topMargin: {
				type: 'number',
				default: '',
			},
			bottomMargin: {
				type: 'number',
				default: '',
			},
			marginType: {
				type: 'string',
				default: 'px',
			},
			markSize: {
				type: 'array',
				default: [ '', '', '' ],
			},
			markSizeType: {
				type: 'string',
				default: 'px',
			},
			markLineHeight: {
				type: 'array',
				default: [ '', '', '' ],
			},
			markLineType: {
				type: 'string',
				default: 'px',
			},
			markLetterSpacing: {
				type: 'number',
			},
			markTypography: {
				type: 'string',
				default: '',
			},
			markGoogleFont: {
				type: 'boolean',
				default: false,
			},
			markLoadGoogleFont: {
				type: 'boolean',
				default: true,
			},
			markFontSubset: {
				type: 'string',
				default: '',
			},
			markFontVariant: {
				type: 'string',
				default: '',
			},
			markFontWeight: {
				type: 'string',
				default: 'regular',
			},
			markFontStyle: {
				type: 'string',
				default: 'normal',
			},
			markColor: {
				type: 'string',
				default: '#f76a0c',
			},
			markBG: {
				type: 'string',
			},
			markBGOpacity: {
				type: 'number',
				default: 1,
			},
			markPadding: {
				type: 'array',
				default: [ 0, 0, 0, 0 ],
			},
			markPaddingControl: {
				type: 'string',
				default: 'linked',
			},
			markBorder: {
				type: 'string',
			},
			markBorderOpacity: {
				type: 'number',
				default: 1,
			},
			markBorderWidth: {
				type: 'number',
				default: 0,
			},
			markBorderStyle: {
				type: 'string',
				default: 'solid',
			},
		},
		save: ( { attributes } ) => {
			const { align, level, content, color, uniqueID, letterSpacing, topMargin, bottomMargin, marginType } = attributes;
			const tagName = 'h' + level;
			const mType = ( marginType ? marginType : 'px' );
			return (
				<RichText.Content
					tagName={ tagName }
					id={ `kt-adv-heading${ uniqueID }` }
					style={ {
						textAlign: align,
						color: color,
						letterSpacing: ( letterSpacing ? letterSpacing + 'px' : undefined ),
						marginTop: ( topMargin ? topMargin + mType : undefined ),
						marginBottom: ( bottomMargin ? bottomMargin + mType : undefined ),
					} }
					value={ content }
				/>
			);
		},
	},
	{
		attributes: {
			content: {
				type: 'array',
				source: 'children',
				selector: 'h1,h2,h3,h4,h5,h6',
			},
			level: {
				type: 'number',
				default: 2,
			},
			uniqueID: {
				type: 'string',
			},
			align: {
				type: 'string',
			},
			color: {
				type: 'string',
			},
			size: {
				type: 'number',
			},
			sizeType: {
				type: 'string',
				default: 'px',
			},
			lineHeight: {
				type: 'number',
			},
			lineType: {
				type: 'string',
				default: 'px',
			},
			tabSize: {
				type: 'number',
			},
			tabLineHeight: {
				type: 'number',
			},
			mobileSize: {
				type: 'number',
			},
			mobileLineHeight: {
				type: 'number',
			},
			letterSpacing: {
				type: 'number',
			},
			typography: {
				type: 'string',
				default: '',
			},
			googleFont: {
				type: 'boolean',
				default: false,
			},
			loadGoogleFont: {
				type: 'boolean',
				default: true,
			},
			fontSubset: {
				type: 'string',
				default: '',
			},
			fontVariant: {
				type: 'string',
				default: '',
			},
			fontWeight: {
				type: 'string',
				default: 'regular',
			},
			fontStyle: {
				type: 'string',
				default: 'normal',
			},
		},
		save: ( { attributes } ) => {
			const { align, level, content, color, uniqueID, letterSpacing } = attributes;
			const tagName = 'h' + level;
			return (
				<RichText.Content
					tagName={ tagName }
					id={ `kt-adv-heading${ uniqueID }` }
					style={ {
						textAlign: align,
						color: color,
						letterSpacing: ( letterSpacing ? letterSpacing + 'px' : undefined ),
					} }
					value={ content }
				/>
			);
		},
	},
];
