/**
 * BLOCK: Kadence Form Block
 *
 * Registering a basic block with Gutenberg.
 */

import classnames from 'classnames';
/**
 * Import Icons
 */
import icons from '../../icons';
import times from 'lodash/times';
/**
 * Import edit
 */
import edit from './edit';

/**
 * Import Css
 */
// import './style.scss';
// import './editor.scss';
const {
	Fragment,
} = wp.element;
const {
	RichText,
} = wp.blockEditor;
/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
const { registerBlockType } = wp.blocks;

/**
 * Register: a Gutenberg Block.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'kadence/form', {
	title: __( 'Form', 'kadence-blocks' ),
	description: __( 'Create a contact or marketing form for your website.', 'kadence-blocks' ),
	icon: {
		src: icons.formBlock,
	},
	category: 'kadence-blocks',
	keywords: [
		__( 'Contact', 'kadence-blocks' ),
		__( 'Marketing', 'kadence-blocks' ),
		__( 'KB', 'kadence-blocks' ),
	],
	supports: {
		anchor: true,
		align: [ 'wide', 'full' ],
		ktanimate: true,
		ktanimateadd: true,
		ktanimatepreview: true,
		ktanimateswipe: true,
	},
	usesContext: [ 'postId' ],
	attributes: {
		uniqueID: {
			type: 'string',
			default: '',
		},
		postID: {
			type: 'string',
			default: '',
		},
		hAlign: {
			type: 'string',
			default: '',
		},
		fields: {
			type: 'array',
			default: [ {
				label: 'Name',
				showLabel: true,
				placeholder: '',
				default: '',
				description: '',
				rows: 4,
				options: [ {
					value: '',
					label: '',
				} ],
				multiSelect: false,
				inline: false,
				showLink: false,
				min: '',
				max: '',
				type: 'text', // text, email, textarea, url, tel, radio, select, check, accept
				required: false,
				width: [ '100', '', '' ],
				auto: '',
				errorMessage: '',
				requiredMessage: '',
				slug: '',
				ariaLabel: '',
			},
			{
				label: 'Email',
				showLabel: true,
				placeholder: '',
				default: '',
				description: '',
				rows: 4,
				options: [ {
					value: '',
					label: '',
				} ],
				multiSelect: false,
				inline: false,
				showLink: false,
				min: '',
				max: '',
				type: 'email', // text, email, textarea, url, tel, radio, select, check, accept
				required: true,
				width: [ '100', '', '' ],
				auto: '',
				errorMessage: '',
				requiredMessage: '',
				slug: '',
				ariaLabel: '',
			},
			{
				label: 'Message',
				showLabel: true,
				placeholder: '',
				default: '',
				description: '',
				rows: 4,
				options: [ {
					value: '',
					label: '',
				} ],
				multiSelect: false,
				inline: false,
				showLink: false,
				min: '',
				max: '',
				type: 'textarea', // text, email, textarea, url, tel, radio, select, check, accept
				required: true,
				width: [ '100', '', '' ],
				auto: '',
				errorMessage: '',
				requiredMessage: '',
				slug: '',
				ariaLabel: '',
			} ],
		},
		messages: {
			type: 'array',
			default: [ {
				success: '',
				error: '',
				required: '',
				invalid: '',
				recaptchaerror: '',
				preError: '',
			} ],
		},
		messageFont: {
			type: 'array',
			default: [ {
				colorSuccess: '',
				colorError: '',
				borderSuccess: '',
				borderError: '',
				backgroundSuccess: '',
				backgroundSuccessOpacity: 1,
				backgroundError: '',
				backgroundErrorOpacity: 1,
				borderWidth: [ '', '', '', '' ],
				borderRadius: '',
				size: [ '', '', '' ],
				sizeType: 'px',
				lineHeight: [ '', '', '' ],
				lineType: 'px',
				letterSpacing: '',
				textTransform: '',
				family: '',
				google: '',
				style: '',
				weight: '',
				variant: '',
				subset: '',
				loadGoogle: true,
				padding: [ '', '', '', '' ],
				margin: [ '', '', '', '' ],
			} ],
		},
		style: {
			type: 'array',
			default: [ {
				showRequired: true,
				size: 'standard',
				deskPadding: [ '', '', '', '' ],
				tabletPadding: [ '', '', '', '' ],
				mobilePadding: [ '', '', '', '' ],
				color: '',
				requiredColor: '',
				background: '',
				border: '',
				backgroundOpacity: 1,
				borderOpacity: 1,
				borderRadius: '',
				borderWidth: [ '', '', '', '' ],
				colorActive: '',
				backgroundActive: '',
				borderActive: '',
				backgroundActiveOpacity: 1,
				borderActiveOpacity: 1,
				gradient: [ '#999999', 1, 0, 100, 'linear', 180, 'center center' ],
				gradientActive: [ '#777777', 1, 0, 100, 'linear', 180, 'center center' ],
				backgroundType: 'solid',
				backgroundActiveType: 'solid',
				boxShadow: [ false, '#000000', 0.2, 1, 1, 2, 0, false ],
				boxShadowActive: [ false, '#000000', 0.4, 2, 2, 3, 0, false ],
				fontSize: [ '', '', '' ],
				fontSizeType: 'px',
				lineHeight: [ '', '', '' ],
				lineType: 'px',
				rowGap: '',
				rowGapType: 'px',
				gutter: '',
				gutterType: 'px',
				tabletRowGap: '',
				mobileRowGap: '',
				tabletGutter: '',
				mobileGutter: '',
			} ],
		},
		labelFont: {
			type: 'array',
			default: [ {
				color: '',
				size: [ '', '', '' ],
				sizeType: 'px',
				lineHeight: [ '', '', '' ],
				lineType: 'px',
				letterSpacing: '',
				textTransform: '',
				family: '',
				google: '',
				style: '',
				weight: '',
				variant: '',
				subset: '',
				loadGoogle: true,
				padding: [ '', '', '', '' ],
				margin: [ '', '', '', '' ],
			} ],
		},
		submit: {
			type: 'array',
			default: [ {
				label: '',
				width: [ '100', '', '' ],
				size: 'standard',
				widthType: 'auto',
				fixedWidth: [ '', '', '' ],
				align: [ '', '', '' ],
				deskPadding: [ '', '', '', '' ],
				tabletPadding: [ '', '', '', '' ],
				mobilePadding: [ '', '', '', '' ],
				color: '',
				background: '',
				border: '',
				backgroundOpacity: 1,
				borderOpacity: 1,
				borderRadius: '',
				borderWidth: [ '', '', '', '' ],
				colorHover: '',
				backgroundHover: '',
				borderHover: '',
				backgroundHoverOpacity: 1,
				borderHoverOpacity: 1,
				icon: '',
				iconSide: 'right',
				iconHover: false,
				cssClass: '',
				gradient: [ '#999999', 1, 0, 100, 'linear', 180, 'center center' ],
				gradientHover: [ '#777777', 1, 0, 100, 'linear', 180, 'center center' ],
				btnStyle: 'basic',
				btnSize: 'standard',
				backgroundType: 'solid',
				backgroundHoverType: 'solid',
				boxShadow: [ false, '#000000', 0.2, 1, 1, 2, 0, false ],
				boxShadowHover: [ false, '#000000', 0.4, 2, 2, 3, 0, false ],
			} ],
		},
		submitMargin: {
			type: 'array',
			default: [ {
				desk: [ '', '', '', '' ],
				tablet: [ '', '', '', '' ],
				mobile: [ '', '', '', '' ],
				unit: 'px',
				control: 'linked',
			} ],
		},
		submitFont: {
			type: 'array',
			default: [ {
				size: [ '', '', '' ],
				sizeType: 'px',
				lineHeight: [ '', '', '' ],
				lineType: 'px',
				letterSpacing: '',
				textTransform: '',
				family: '',
				google: '',
				style: '',
				weight: '',
				variant: '',
				subset: '',
				loadGoogle: true,
			} ],
		},
		actions: {
			type: 'array',
			default: [ 'email' ],
		},
		email: {
			type: 'array',
			default: [ {
				emailTo: '',
				subject: '',
				fromEmail: '',
				fromName: '',
				replyTo: 'email_field',
				cc: '',
				bcc: '',
				html: true,
			} ],
		},
		redirect: {
			type: 'string',
			default: '',
		},
		recaptcha: {
			type: 'bool',
			default: false,
		},
		recaptchaVersion: {
			type: 'string',
			default: 'v3',
		},
		honeyPot: {
			type: 'bool',
			default: true,
		},
		mailerlite: {
			type: 'array',
			default: [ {
				group: [],
				map: [],
			} ],
		},
		fluentcrm: {
			type: 'array',
			default: [ {
				lists: [],
				tags: [],
				map: [],
				doubleOptin: false,
			} ],
		},
		containerMarginType: {
			type: 'string',
			default: 'px',
		},
		containerMargin: {
			type: 'array',
			default: [ '', '', '', '' ],
		},
		tabletContainerMargin: {
			type: 'array',
			default: [ '', '', '', '' ],
		},
		mobileContainerMargin: {
			type: 'array',
			default: [ '', '', '', '' ],
		},
		submitLabel: {
			type: 'string',
			default: '',
		},
	},
	edit,

	save: props => {
		const { attributes: { uniqueID, fields, submit, style, postID, hAlign, recaptcha, recaptchaVersion, honeyPot, messages, submitLabel } } = props;
		const fieldOutput = ( index ) => {
			const fieldName = 'name' in fields[ index ] ? fields[ index ].name : `kb_field_${ index }`;
			if ( 'hidden' === fields[ index ].type ) {
				return (
					<input type="hidden" name={ fieldName } value={ fields[ index ].default } />
				);
			}
			const fieldClassName = classnames( {
				'kadence-blocks-form-field': true,
				[ `kb-form-field-${ index }` ]: index,
				[ `kb-field-desk-width-${ fields[ index ].width[ 0 ] }` ]: fields[ index ].width && fields[ index ].width[ 0 ],
				[ `kb-field-tablet-width-${ fields[ index ].width[ 1 ] }` ]: fields[ index ].width && fields[ index ].width[ 1 ],
				[ `kb-field-mobile-width-${ fields[ index ].width[ 2 ] }` ]: fields[ index ].width && fields[ index ].width[ 2 ],
				[ `kb-input-size-${ style[ 0 ].size }` ]: style[ 0 ].size,
				'kb-accept-form-field': 'accept' === fields[ index ].type,
			} );
			let acceptLabel;
			let acceptLabelBefore;
			let acceptLabelAfter;
			if ( fields[ index ].label && fields[ index ].label.includes( '{privacy_policy}' ) ) {
				acceptLabelBefore = fields[ index ].label.split( '{' )[ 0 ];
				acceptLabelAfter = fields[ index ].label.split( '}' )[ 1 ];
				acceptLabel = (
					<Fragment>
						{ acceptLabelBefore }<a href={ ( undefined !== kadence_blocks_params.privacy_link && '' !== kadence_blocks_params.privacy_link ? kadence_blocks_params.privacy_link : '#' ) } target="blank" rel="noopener noreferrer">{ ( undefined !== kadence_blocks_params.privacy_title && '' !== kadence_blocks_params.privacy_title ? kadence_blocks_params.privacy_title : 'Privacy policy' ) }</a>{ acceptLabelAfter }
					</Fragment>
				);
			} else {
				acceptLabel = fields[ index ].label;
			}
			return (
				<div className={ fieldClassName } >
					{ 'accept' === fields[ index ].type && (
						<Fragment>
							{ fields[ index ].showLink && (
								<a href={ ( undefined !== fields[ index ].default && '' !== fields[ index ].default ? fields[ index ].default : '#' ) } target="_blank" rel="noopener noreferrer" className={ 'kb-accept-link' }>{ ( undefined !== fields[ index ].placeholder && '' !== fields[ index ].placeholder ? fields[ index ].placeholder : 'View Privacy Policy' ) }</a>
							) }
							{ undefined !== fields[ index ].ariaLabel && fields[ index ].ariaLabel && (
								<span id={ `kb_field_desc_${ uniqueID }_${ index }` } className="screen-reader-text kb-field-desc-label">{ fields[ index ].ariaLabel }</span>
							) }
							<input type="checkbox" name={ fieldName } id={ `kb_field_${ uniqueID }_${ index }` } className={ `kb-field kb-checkbox-style kb-${ fields[ index ].type }` } value={ 'accept' } checked={ fields[ index ].inline ? true : false } data-type={ fields[ index ].type } data-required={ ( fields[ index ].required ? 'yes' : undefined ) } data-required-message={ fields[ index ].requiredMessage ? fields[ index ].requiredMessage : undefined } data-validation-message={ fields[ index ].errorMessage ? fields[ index ].errorMessage : undefined } aria-describedby={ undefined !== fields[ index ].ariaLabel && fields[ index ].ariaLabel ? `kb_field_desc_${ uniqueID }_${ index }` : undefined } />
							<label htmlFor={ `kb_field_${ uniqueID }_${ index }` }>{ ( fields[ index ].label ? acceptLabel : '' ) }{ ( fields[ index ].required && style[ 0 ].showRequired ? <span className="required">*</span> : '' ) }</label>
						</Fragment>
					) }
					{ 'accept' !== fields[ index ].type && (
						<Fragment>
							{ fields[ index ].showLabel && (
								<label htmlFor={ `kb_field_${ uniqueID }_${ index }` }>{ ( fields[ index ].label ? fields[ index ].label : '' ) }{ ( fields[ index ].required && style[ 0 ].showRequired ? <span className="required">*</span> : '' ) }</label>
							) }
							{ undefined !== fields[ index ].ariaLabel && fields[ index ].ariaLabel && (
								<span id={ `kb_field_desc_${ uniqueID }_${ index }` } className="screen-reader-text">{ fields[ index ].ariaLabel }</span>
							) }
							{ 'textarea' === fields[ index ].type && (
								<textarea name={ fieldName } id={ `kb_field_${ uniqueID }_${ index }` } data-label={ fields[ index ].label } type={ fields[ index ].type } placeholder={ fields[ index ].placeholder } value={ fields[ index ].default } data-type={ fields[ index ].type } className={ `kb-field kb-text-style-field kb-${ fields[ index ].type }-field kb-field-${ index }` } rows={ fields[ index ].rows } data-required={ ( fields[ index ].required ? 'yes' : undefined ) } data-required-message={ fields[ index ].requiredMessage ? fields[ index ].requiredMessage : undefined } data-validation-message={ fields[ index ].errorMessage ? fields[ index ].errorMessage : undefined } aria-describedby={ undefined !== fields[ index ].ariaLabel && fields[ index ].ariaLabel ? `kb_field_desc_${ uniqueID }_${ index }` : undefined } />
							) }
							{ 'select' === fields[ index ].type && (
								<select name={ ( fields[ index ].multiSelect ? `kb_field_${ index }[]` : `kb_field_${ index }` ) } id={ `kb_field_${ uniqueID }_${ index }` } multiple={ ( fields[ index ].multiSelect ? true : false ) } data-label={ fields[ index ].label } type={ fields[ index ].type } value={ fields[ index ].default } data-type={ fields[ index ].type } className={ `kb-field kb-select-style-field kb-${ fields[ index ].type }-field kb-field-${ index }` } data-required={ ( fields[ index ].required ? 'yes' : undefined ) } data-required-message={ fields[ index ].requiredMessage ? fields[ index ].requiredMessage : undefined } data-validation-message={ fields[ index ].errorMessage ? fields[ index ].errorMessage : undefined } aria-describedby={ undefined !== fields[ index ].ariaLabel && fields[ index ].ariaLabel ? `kb_field_desc_${ uniqueID }_${ index }` : undefined } >
									{ undefined !== fields[ index ].placeholder && '' !== fields[ index ].placeholder && (
										<option
											value=""
											disabled={ true }
											selected={ '' === fields[ index ].default ? true : false }
										>
											{ fields[ index ].placeholder }
										</option>
									) }
									{ times( fields[ index ].options.length, n => (
										<option
											key={ n }
											selected={ ( undefined !== fields[ index ].options[ n ].value && fields[ index ].options[ n ].value === fields[ index ].default ? true : false ) }
											value={ ( undefined !== fields[ index ].options[ n ].value ? fields[ index ].options[ n ].value : '' ) }
										>{ ( undefined !== fields[ index ].options[ n ].label ? fields[ index ].options[ n ].label : '' ) }</option>
									) ) }
								</select>
							) }
							{ 'checkbox' === fields[ index ].type && (
								<div data-type={ fields[ index ].type } data-label={ fields[ index ].label } id={ `kb_field_${ uniqueID }_${ index }` } className={ `kb-field kb-checkbox-style-field kb-${ fields[ index ].type }-field kb-field-${ index } kb-radio-style-${ fields[ index ].inline ? 'inline' : 'normal' }` } data-required={ ( fields[ index ].required ? 'yes' : undefined ) } data-required-message={ fields[ index ].requiredMessage ? fields[ index ].requiredMessage : undefined } data-validation-message={ fields[ index ].errorMessage ? fields[ index ].errorMessage : undefined }>
									{ times( fields[ index ].options.length, n => (
										<div key={ n } data-type={ fields[ index ].type } className={ `kb-checkbox-item kb-checkbox-item-${ n }` }>
											<input type="checkbox" name={ `kb_field_${ index }[]` } id={ `kb_field_${ index }_${ n }` } className={ 'kb-sub-field kb-checkbox-style' } value={ ( undefined !== fields[ index ].options[ n ].value ? fields[ index ].options[ n ].value : '' ) } checked={ ( undefined !== fields[ index ].options[ n ].value && fields[ index ].options[ n ].value === fields[ index ].default ? true : false ) } />
											<label htmlFor={ `kb_field_${ index }_${ n }` }>{ ( undefined !== fields[ index ].options[ n ].label ? fields[ index ].options[ n ].label : '' ) }</label>
										</div>
									) ) }
								</div>
							) }
							{ 'radio' === fields[ index ].type && (
								<div data-type={ fields[ index ].type } data-label={ fields[ index ].label } id={ `kb_field_${ uniqueID }_${ index }` } className={ `kb-field kb-radio-style-field kb-${ fields[ index ].type }-field kb-field-${ index } kb-radio-style-${ fields[ index ].inline ? 'inline' : 'normal' }` } data-required={ ( fields[ index ].required ? 'yes' : undefined ) } data-required-message={ fields[ index ].requiredMessage ? fields[ index ].requiredMessage : undefined } data-validation-message={ fields[ index ].errorMessage ? fields[ index ].errorMessage : undefined }>
									{ times( fields[ index ].options.length, n => (
										<div key={ n } data-type={ fields[ index ].type } className={ `kb-radio-item kb-radio-item-${ n }` }>
											<input type="radio" name={ `kb_field_${ index }[]` } id={ `kb_field_${ index }_${ n }` } className={ 'kb-sub-field kb-radio-style' } value={ ( undefined !== fields[ index ].options[ n ].value ? fields[ index ].options[ n ].value : '' ) } checked={ ( undefined !== fields[ index ].options[ n ].value && fields[ index ].options[ n ].value === fields[ index ].default ? true : false ) } />
											<label htmlFor={ `kb_field_${ index }_${ n }` }>{ ( undefined !== fields[ index ].options[ n ].label ? fields[ index ].options[ n ].label : '' ) }</label>
										</div>
									) ) }
								</div>
							) }
							{ 'textarea' !== fields[ index ].type && 'select' !== fields[ index ].type && 'checkbox' !== fields[ index ].type && 'radio' !== fields[ index ].type && (
								<input name={ fieldName } id={ `kb_field_${ uniqueID }_${ index }` } data-label={ fields[ index ].label } type={ fields[ index ].type } placeholder={ fields[ index ].placeholder } value={ fields[ index ].default } data-type={ fields[ index ].type } className={ `kb-field kb-text-style-field kb-${ fields[ index ].type }-field kb-field-${ index }` } autoComplete={ ( '' !== fields[ index ].auto ? fields[ index ].auto : undefined ) } data-required={ ( fields[ index ].required ? 'yes' : undefined ) } data-required-message={ fields[ index ].requiredMessage ? fields[ index ].requiredMessage : undefined } data-validation-message={ fields[ index ].errorMessage ? fields[ index ].errorMessage : undefined } aria-describedby={ undefined !== fields[ index ].ariaLabel && fields[ index ].ariaLabel ? `kb_field_desc_${ uniqueID }_${ index }` : undefined } />
							) }
						</Fragment>
					) }
					{ undefined !== fields[ index ].description && '' !== fields[ index ].description && (
						<span className={ 'kb-field-help' }>{ ( fields[ index ].description ? fields[ index ].description : '' ) }</span>
					) }
				</div>
			);
		};
		const renderFieldOutput = (
			<Fragment>
				{ times( fields.length, n => fieldOutput( n ) ) }
			</Fragment>
		);
		const submitClassName = classnames( {
			'kadence-blocks-form-field': true,
			'kb-submit-field': true,
			[ `kb-field-desk-width-${ submit[ 0 ].width[ 0 ] }` ]: submit[ 0 ].width && submit[ 0 ].width[ 0 ],
			[ `kb-field-tablet-width-${ submit[ 0 ].width[ 1 ] }` ]: submit[ 0 ].width && submit[ 0 ].width[ 1 ],
			[ `kb-field-mobile-width-${ submit[ 0 ].width[ 2 ] }` ]: submit[ 0 ].width && submit[ 0 ].width[ 2 ],
		} );
		return (
			<div className={ `kadence-form-${ uniqueID } kb-form-wrap${ ( hAlign ? ' kb-form-align-' + hAlign : '' ) }` }>
				<form className="kb-form" action="" method="post" data-error-message={ messages && messages[0] && messages[0].preError ? messages[0].preError : undefined }>
					{ renderFieldOutput }
					<input type="hidden" name="_kb_form_id" value={ uniqueID } />
					<input type="hidden" name="_kb_form_post_id" value={ postID } />
					<input type="hidden" name="action" value="kb_process_ajax_submit" />
					{ recaptcha && (
						<Fragment>
							{ recaptchaVersion === 'v2' && (
								<div className="kadence-blocks-form-field google-recaptcha-checkout-wrap">
									<p id="kb-container-g-recaptcha" className="google-recaptcha-container">
										<span id={ `kb_recaptcha_${ uniqueID }` } className={ `kadence-blocks-g-recaptcha-v2 g-recaptcha kb_recaptcha_${ uniqueID }` } style={ {
											display: 'inline-block',
										} }>
										</span>
									</p>
								</div>
							) }
							{ recaptchaVersion !== 'v2' && (
								<input type="hidden" name="recaptcha_response" className={ `kb_recaptcha_response kb_recaptcha_${ uniqueID }` } />
							) }
						</Fragment>
					) }
					{ honeyPot && (
						<input className="kadence-blocks-field verify" type="text" name="_kb_verify_email" autoComplete="off" aria-hidden="true" placeholder="Email" tabIndex="-1" />
					) }
					<div className={ submitClassName }>
						{ submitLabel && (
							<span id={ `kb_submit_label_${ uniqueID }` } className="screen-reader-text kb-submit-desc-label">{ submitLabel }</span>
						) }
						<RichText.Content
							tagName="button"
							aria-describedby={ submitLabel ? `kb_submit_label_${ uniqueID }` : undefined }
							value={ ( '' !== submit[ 0 ].label ? submit[ 0 ].label : 'Submit' ) }
							className={ `kb-forms-submit button kb-button-size-${ ( submit[ 0 ].size ? submit[ 0 ].size : 'standard' ) } kb-button-width-${ ( submit[ 0 ].widthType ? submit[ 0 ].widthType : 'auto' ) }` }
						/>
					</div>
				</form>
			</div>
		);
	},
	deprecated: [
		{
			attributes: {
				uniqueID: {
					type: 'string',
					default: '',
				},
				postID: {
					type: 'number',
					default: '',
				},
				hAlign: {
					type: 'string',
					default: '',
				},
				fields: {
					type: 'array',
					default: [ {
						label: 'Name',
						showLabel: true,
						placeholder: '',
						default: '',
						description: '',
						rows: 4,
						options: [ {
							value: '',
							label: '',
						} ],
						multiSelect: false,
						inline: false,
						showLink: false,
						min: '',
						max: '',
						type: 'text', // text, email, textarea, url, tel, radio, select, check, accept
						required: false,
						width: [ '100', '', '' ],
						auto: '',
						errorMessage: '',
						requiredMessage: '',
					},
					{
						label: 'Email',
						showLabel: true,
						placeholder: '',
						default: '',
						description: '',
						rows: 4,
						options: [ {
							value: '',
							label: '',
						} ],
						multiSelect: false,
						inline: false,
						showLink: false,
						min: '',
						max: '',
						type: 'email', // text, email, textarea, url, tel, radio, select, check, accept
						required: true,
						width: [ '100', '', '' ],
						auto: '',
						errorMessage: '',
						requiredMessage: '',
					},
					{
						label: 'Message',
						showLabel: true,
						placeholder: '',
						default: '',
						description: '',
						rows: 4,
						options: [ {
							value: '',
							label: '',
						} ],
						multiSelect: false,
						inline: false,
						showLink: false,
						min: '',
						max: '',
						type: 'textarea', // text, email, textarea, url, tel, radio, select, check, accept
						required: true,
						width: [ '100', '', '' ],
						auto: '',
						errorMessage: '',
						requiredMessage: '',
					} ],
				},
				messages: {
					type: 'array',
					default: [ {
						success: '',
						error: '',
						required: '',
						invalid: '',
						recaptchaerror: '',
						preError: '',
					} ],
				},
				messageFont: {
					type: 'array',
					default: [ {
						colorSuccess: '',
						colorError: '',
						borderSuccess: '',
						borderError: '',
						backgroundSuccess: '',
						backgroundSuccessOpacity: 1,
						backgroundError: '',
						backgroundErrorOpacity: 1,
						borderWidth: [ '', '', '', '' ],
						borderRadius: '',
						size: [ '', '', '' ],
						sizeType: 'px',
						lineHeight: [ '', '', '' ],
						lineType: 'px',
						letterSpacing: '',
						textTransform: '',
						family: '',
						google: '',
						style: '',
						weight: '',
						variant: '',
						subset: '',
						loadGoogle: true,
						padding: [ '', '', '', '' ],
						margin: [ '', '', '', '' ],
					} ],
				},
				style: {
					type: 'array',
					default: [ {
						showRequired: true,
						size: 'standard',
						deskPadding: [ '', '', '', '' ],
						tabletPadding: [ '', '', '', '' ],
						mobilePadding: [ '', '', '', '' ],
						color: '',
						requiredColor: '',
						background: '',
						border: '',
						backgroundOpacity: 1,
						borderOpacity: 1,
						borderRadius: '',
						borderWidth: [ '', '', '', '' ],
						colorActive: '',
						backgroundActive: '',
						borderActive: '',
						backgroundActiveOpacity: 1,
						borderActiveOpacity: 1,
						gradient: [ '#999999', 1, 0, 100, 'linear', 180, 'center center' ],
						gradientActive: [ '#777777', 1, 0, 100, 'linear', 180, 'center center' ],
						backgroundType: 'solid',
						backgroundActiveType: 'solid',
						boxShadow: [ false, '#000000', 0.2, 1, 1, 2, 0, false ],
						boxShadowActive: [ false, '#000000', 0.4, 2, 2, 3, 0, false ],
						fontSize: [ '', '', '' ],
						fontSizeType: 'px',
						lineHeight: [ '', '', '' ],
						lineType: 'px',
						rowGap: '',
						rowGapType: 'px',
						gutter: '',
						gutterType: 'px',
					} ],
				},
				labelFont: {
					type: 'array',
					default: [ {
						color: '',
						size: [ '', '', '' ],
						sizeType: 'px',
						lineHeight: [ '', '', '' ],
						lineType: 'px',
						letterSpacing: '',
						textTransform: '',
						family: '',
						google: '',
						style: '',
						weight: '',
						variant: '',
						subset: '',
						loadGoogle: true,
						padding: [ '', '', '', '' ],
						margin: [ '', '', '', '' ],
					} ],
				},
				submit: {
					type: 'array',
					default: [ {
						label: '',
						width: [ '100', '', '' ],
						size: 'standard',
						widthType: 'auto',
						fixedWidth: [ '', '', '' ],
						align: [ '', '', '' ],
						deskPadding: [ '', '', '', '' ],
						tabletPadding: [ '', '', '', '' ],
						mobilePadding: [ '', '', '', '' ],
						color: '',
						background: '',
						border: '',
						backgroundOpacity: 1,
						borderOpacity: 1,
						borderRadius: '',
						borderWidth: [ '', '', '', '' ],
						colorHover: '',
						backgroundHover: '',
						borderHover: '',
						backgroundHoverOpacity: 1,
						borderHoverOpacity: 1,
						icon: '',
						iconSide: 'right',
						iconHover: false,
						cssClass: '',
						gradient: [ '#999999', 1, 0, 100, 'linear', 180, 'center center' ],
						gradientHover: [ '#777777', 1, 0, 100, 'linear', 180, 'center center' ],
						btnStyle: 'basic',
						btnSize: 'standard',
						backgroundType: 'solid',
						backgroundHoverType: 'solid',
						boxShadow: [ false, '#000000', 0.2, 1, 1, 2, 0, false ],
						boxShadowHover: [ false, '#000000', 0.4, 2, 2, 3, 0, false ],
					} ],
				},
				submitMargin: {
					type: 'array',
					default: [ {
						desk: [ '', '', '', '' ],
						tablet: [ '', '', '', '' ],
						mobile: [ '', '', '', '' ],
						unit: 'px',
						control: 'linked',
					} ],
				},
				submitFont: {
					type: 'array',
					default: [ {
						size: [ '', '', '' ],
						sizeType: 'px',
						lineHeight: [ '', '', '' ],
						lineType: 'px',
						letterSpacing: '',
						textTransform: '',
						family: '',
						google: '',
						style: '',
						weight: '',
						variant: '',
						subset: '',
						loadGoogle: true,
					} ],
				},
				actions: {
					type: 'array',
					default: [ 'email' ],
				},
				email: {
					type: 'array',
					default: [ {
						emailTo: '',
						subject: '',
						fromEmail: '',
						fromName: '',
						replyTo: 'email_field',
						cc: '',
						bcc: '',
						html: true,
					} ],
				},
				redirect: {
					type: 'string',
					default: '',
				},
				recaptcha: {
					type: 'bool',
					default: false,
				},
				recaptchaVersion: {
					type: 'string',
					default: 'v3',
				},
				honeyPot: {
					type: 'bool',
					default: true,
				},
				mailerlite: {
					type: 'array',
					default: [ {
						group: [],
						map: [],
					} ],
				},
				fluentcrm: {
					type: 'array',
					default: [ {
						lists: [],
						tags: [],
						map: [],
						doubleOptin: false,
					} ],
				},
				containerMarginType: {
					type: 'string',
					default: 'px',
				},
				containerMargin: {
					type: 'array',
					default: [ '', '', '', '' ],
				},
				tabletContainerMargin: {
					type: 'array',
					default: [ '', '', '', '' ],
				},
				mobileContainerMargin: {
					type: 'array',
					default: [ '', '', '', '' ],
				},
			},
			save: ( { attributes } ) => {
				const { uniqueID, fields, submit, style, postID, hAlign, recaptcha, recaptchaVersion, honeyPot, messages } = attributes;
				const fieldOutput = ( index ) => {
					if ( 'hidden' === fields[ index ].type ) {
						return (
							<input type="hidden" name={ fieldName } value={ fields[ index ].default } />
						);
					}
					const fieldClassName = classnames( {
						'kadence-blocks-form-field': true,
						[ `kb-form-field-${ index }` ]: index,
						[ `kb-field-desk-width-${ fields[ index ].width[ 0 ] }` ]: fields[ index ].width && fields[ index ].width[ 0 ],
						[ `kb-field-tablet-width-${ fields[ index ].width[ 1 ] }` ]: fields[ index ].width && fields[ index ].width[ 1 ],
						[ `kb-field-mobile-width-${ fields[ index ].width[ 2 ] }` ]: fields[ index ].width && fields[ index ].width[ 2 ],
						[ `kb-input-size-${ style[ 0 ].size }` ]: style[ 0 ].size,
					} );
					let acceptLabel;
					let acceptLabelBefore;
					let acceptLabelAfter;
					if ( fields[ index ].label && fields[ index ].label.includes( '{privacy_policy}' ) ) {
						acceptLabelBefore = fields[ index ].label.split( '{' )[ 0 ];
						acceptLabelAfter = fields[ index ].label.split( '}' )[ 1 ];
						acceptLabel = (
							<Fragment>
								{ acceptLabelBefore }<a href={ ( undefined !== kadence_blocks_params.privacy_link && '' !== kadence_blocks_params.privacy_link ? kadence_blocks_params.privacy_link : '#' ) } target="blank" rel="noopener noreferrer">{ ( undefined !== kadence_blocks_params.privacy_title && '' !== kadence_blocks_params.privacy_title ? kadence_blocks_params.privacy_title : 'Privacy policy' ) }</a>{ acceptLabelAfter }
							</Fragment>
						);
					} else {
						acceptLabel = fields[ index ].label;
					}
					return (
						<div className={ fieldClassName } >
							{ 'accept' === fields[ index ].type && (
								<Fragment>
									{ fields[ index ].showLink && (
										<a href={ ( undefined !== fields[ index ].default && '' !== fields[ index ].default ? fields[ index ].default : '#' ) } target="_blank" rel="noopener noreferrer" className={ 'kb-accept-link' }>{ ( undefined !== fields[ index ].placeholder && '' !== fields[ index ].placeholder ? fields[ index ].placeholder : 'View Privacy Policy' ) }</a>
									) }
									<input type="checkbox" name={ fieldName } id={ `kb_field_${ uniqueID }_${ index }` } className={ `kb-field kb-checkbox-style kb-${ fields[ index ].type }` } value={ 'accept' } checked={ fields[ index ].inline ? true : false } data-type={ fields[ index ].type } data-required={ ( fields[ index ].required ? 'yes' : undefined ) } data-required-message={ fields[ index ].requiredMessage ? fields[ index ].requiredMessage : undefined } data-validation-message={ fields[ index ].errorMessage ? fields[ index ].errorMessage : undefined } />
									<label htmlFor={ `kb_field_${ uniqueID }_${ index }` }>{ ( fields[ index ].label ? acceptLabel : '' ) }{ ( fields[ index ].required && style[ 0 ].showRequired ? <span className="required">*</span> : '' ) }</label>
								</Fragment>
							) }
							{ 'accept' !== fields[ index ].type && (
								<Fragment>
									{ fields[ index ].showLabel && (
										<label htmlFor={ `kb_field_${ uniqueID }_${ index }` }>{ ( fields[ index ].label ? fields[ index ].label : '' ) }{ ( fields[ index ].required && style[ 0 ].showRequired ? <span className="required">*</span> : '' ) }</label>
									) }
									{ 'textarea' === fields[ index ].type && (
										<textarea name={ fieldName } id={ `kb_field_${ uniqueID }_${ index }` } data-label={ fields[ index ].label } type={ fields[ index ].type } placeholder={ fields[ index ].placeholder } value={ fields[ index ].default } data-type={ fields[ index ].type } className={ `kb-field kb-text-style-field kb-${ fields[ index ].type }-field kb-field-${ index }` } rows={ fields[ index ].rows } data-required={ ( fields[ index ].required ? 'yes' : undefined ) } data-required-message={ fields[ index ].requiredMessage ? fields[ index ].requiredMessage : undefined } data-validation-message={ fields[ index ].errorMessage ? fields[ index ].errorMessage : undefined } />
									) }
									{ 'select' === fields[ index ].type && (
										<select name={ ( fields[ index ].multiSelect ? `kb_field_${ index }[]` : `kb_field_${ index }` ) } id={ `kb_field_${ uniqueID }_${ index }` } multiple={ ( fields[ index ].multiSelect ? true : false ) } data-label={ fields[ index ].label } type={ fields[ index ].type } value={ fields[ index ].default } data-type={ fields[ index ].type } className={ `kb-field kb-select-style-field kb-${ fields[ index ].type }-field kb-field-${ index }` } data-required={ ( fields[ index ].required ? 'yes' : undefined ) } data-required-message={ fields[ index ].requiredMessage ? fields[ index ].requiredMessage : undefined } data-validation-message={ fields[ index ].errorMessage ? fields[ index ].errorMessage : undefined }>
											{ undefined !== fields[ index ].placeholder && '' !== fields[ index ].placeholder && (
												<option
													value=""
													disabled={ true }
													selected={ '' === fields[ index ].default ? true : false }
												>
													{ fields[ index ].placeholder }
												</option>
											) }
											{ times( fields[ index ].options.length, n => (
												<option
													key={ n }
													selected={ ( undefined !== fields[ index ].options[ n ].value && fields[ index ].options[ n ].value === fields[ index ].default ? true : false ) }
													value={ ( undefined !== fields[ index ].options[ n ].value ? fields[ index ].options[ n ].value : '' ) }
												>{ ( undefined !== fields[ index ].options[ n ].label ? fields[ index ].options[ n ].label : '' ) }</option>
											) ) }
										</select>
									) }
									{ 'checkbox' === fields[ index ].type && (
										<div data-type={ fields[ index ].type } data-label={ fields[ index ].label } id={ `kb_field_${ uniqueID }_${ index }` } className={ `kb-field kb-checkbox-style-field kb-${ fields[ index ].type }-field kb-field-${ index } kb-radio-style-${ fields[ index ].inline ? 'inline' : 'normal' }` } data-required={ ( fields[ index ].required ? 'yes' : undefined ) } data-required-message={ fields[ index ].requiredMessage ? fields[ index ].requiredMessage : undefined } data-validation-message={ fields[ index ].errorMessage ? fields[ index ].errorMessage : undefined }>
											{ times( fields[ index ].options.length, n => (
												<div key={ n } data-type={ fields[ index ].type } className={ `kb-checkbox-item kb-checkbox-item-${ n }` }>
													<input type="checkbox" name={ `kb_field_${ index }[]` } id={ `kb_field_${ index }_${ n }` } className={ 'kb-sub-field kb-checkbox-style' } value={ ( undefined !== fields[ index ].options[ n ].value ? fields[ index ].options[ n ].value : '' ) } checked={ ( undefined !== fields[ index ].options[ n ].value && fields[ index ].options[ n ].value === fields[ index ].default ? true : false ) } />
													<label htmlFor={ `kb_field_${ index }_${ n }` }>{ ( undefined !== fields[ index ].options[ n ].label ? fields[ index ].options[ n ].label : '' ) }</label>
												</div>
											) ) }
										</div>
									) }
									{ 'radio' === fields[ index ].type && (
										<div data-type={ fields[ index ].type } data-label={ fields[ index ].label } id={ `kb_field_${ uniqueID }_${ index }` } className={ `kb-field kb-radio-style-field kb-${ fields[ index ].type }-field kb-field-${ index } kb-radio-style-${ fields[ index ].inline ? 'inline' : 'normal' }` } data-required={ ( fields[ index ].required ? 'yes' : undefined ) } data-required-message={ fields[ index ].requiredMessage ? fields[ index ].requiredMessage : undefined } data-validation-message={ fields[ index ].errorMessage ? fields[ index ].errorMessage : undefined }>
											{ times( fields[ index ].options.length, n => (
												<div key={ n } data-type={ fields[ index ].type } className={ `kb-radio-item kb-radio-item-${ n }` }>
													<input type="radio" name={ `kb_field_${ index }[]` } id={ `kb_field_${ index }_${ n }` } className={ 'kb-sub-field kb-radio-style' } value={ ( undefined !== fields[ index ].options[ n ].value ? fields[ index ].options[ n ].value : '' ) } checked={ ( undefined !== fields[ index ].options[ n ].value && fields[ index ].options[ n ].value === fields[ index ].default ? true : false ) } />
													<label htmlFor={ `kb_field_${ index }_${ n }` }>{ ( undefined !== fields[ index ].options[ n ].label ? fields[ index ].options[ n ].label : '' ) }</label>
												</div>
											) ) }
										</div>
									) }
									{ 'textarea' !== fields[ index ].type && 'select' !== fields[ index ].type && 'checkbox' !== fields[ index ].type && 'radio' !== fields[ index ].type && (
										<input name={ fieldName } id={ `kb_field_${ uniqueID }_${ index }` } data-label={ fields[ index ].label } type={ fields[ index ].type } placeholder={ fields[ index ].placeholder } value={ fields[ index ].default } data-type={ fields[ index ].type } className={ `kb-field kb-text-style-field kb-${ fields[ index ].type }-field kb-field-${ index }` } autoComplete={ ( '' !== fields[ index ].auto ? fields[ index ].auto : undefined ) } data-required={ ( fields[ index ].required ? 'yes' : undefined ) } data-required-message={ fields[ index ].requiredMessage ? fields[ index ].requiredMessage : undefined } data-validation-message={ fields[ index ].errorMessage ? fields[ index ].errorMessage : undefined } />
									) }
								</Fragment>
							) }
							{ undefined !== fields[ index ].description && '' !== fields[ index ].description && (
								<span className={ 'kb-field-help' }>{ ( fields[ index ].description ? fields[ index ].description : '' ) }</span>
							) }
						</div>
					);
				};
				const renderFieldOutput = (
					<Fragment>
						{ times( fields.length, n => fieldOutput( n ) ) }
					</Fragment>
				);
				const submitClassName = classnames( {
					'kadence-blocks-form-field': true,
					'kb-submit-field': true,
					[ `kb-field-desk-width-${ submit[ 0 ].width[ 0 ] }` ]: submit[ 0 ].width && submit[ 0 ].width[ 0 ],
					[ `kb-field-tablet-width-${ submit[ 0 ].width[ 1 ] }` ]: submit[ 0 ].width && submit[ 0 ].width[ 1 ],
					[ `kb-field-mobile-width-${ submit[ 0 ].width[ 2 ] }` ]: submit[ 0 ].width && submit[ 0 ].width[ 2 ],
				} );
				return (
					<div className={ `kadence-form-${ uniqueID } kb-form-wrap${ ( hAlign ? ' kb-form-align-' + hAlign : '' ) }` }>
						<form className="kb-form" action="" method="post" data-error-message={ messages && messages[0] && messages[0].preError ? messages[0].preError : undefined }>
							{ renderFieldOutput }
							<input type="hidden" name="_kb_form_id" value={ uniqueID } />
							<input type="hidden" name="_kb_form_post_id" value={ postID } />
							<input type="hidden" name="action" value="kb_process_ajax_submit" />
							{ recaptcha && (
								<Fragment>
									{ recaptchaVersion === 'v2' && (
										<div className="kadence-blocks-form-field google-recaptcha-checkout-wrap">
											<p id="kb-container-g-recaptcha" className="google-recaptcha-container">
												<span id={ `kb_recaptcha_${ uniqueID }` } className={ `kadence-blocks-g-recaptcha-v2 g-recaptcha kb_recaptcha_${ uniqueID }` } style={ {
													display: 'inline-block',
												} }>
												</span>
											</p>
										</div>
									) }
									{ recaptchaVersion !== 'v2' && (
										<input type="hidden" name="recaptcha_response" className={ `kb_recaptcha_response kb_recaptcha_${ uniqueID }` } />
									) }
								</Fragment>
							) }
							{ honeyPot && (
								<input className="kadence-blocks-field verify" type="text" name="_kb_verify_email" autoComplete="off" placeholder="Email" tabIndex="-1" />
							) }
							<div className={ submitClassName }>
								<RichText.Content
									tagName="button"
									value={ ( '' !== submit[ 0 ].label ? submit[ 0 ].label : 'Submit' ) }
									className={ `kb-forms-submit button kb-button-size-${ ( submit[ 0 ].size ? submit[ 0 ].size : 'standard' ) } kb-button-width-${ ( submit[ 0 ].widthType ? submit[ 0 ].widthType : 'auto' ) }` }
								/>
							</div>
						</form>
					</div>
				);
			}
		},
		{
			attributes: {
				uniqueID: {
					type: 'string',
					default: '',
				},
				postID: {
					type: 'number',
					default: '',
				},
				hAlign: {
					type: 'string',
					default: '',
				},
				fields: {
					type: 'array',
					default: [ {
						label: 'Name',
						showLabel: true,
						placeholder: '',
						default: '',
						description: '',
						rows: 4,
						options: [ {
							value: '',
							label: '',
						} ],
						multiSelect: false,
						inline: false,
						showLink: false,
						min: '',
						max: '',
						type: 'text', // text, email, textarea, url, tel, radio, select, check, accept
						required: false,
						width: [ '100', '', '' ],
						auto: '',
						errorMessage: '',
					},
					{
						label: 'Email',
						showLabel: true,
						placeholder: '',
						default: '',
						description: '',
						rows: 4,
						options: [ {
							value: '',
							label: '',
						} ],
						multiSelect: false,
						inline: false,
						showLink: false,
						min: '',
						max: '',
						type: 'email', // text, email, textarea, url, tel, radio, select, check, accept
						required: true,
						width: [ '100', '', '' ],
						auto: '',
						errorMessage: '',
					},
					{
						label: 'Message',
						showLabel: true,
						placeholder: '',
						default: '',
						description: '',
						rows: 4,
						options: [ {
							value: '',
							label: '',
						} ],
						multiSelect: false,
						inline: false,
						showLink: false,
						min: '',
						max: '',
						type: 'textarea', // text, email, textarea, url, tel, radio, select, check, accept
						required: true,
						width: [ '100', '', '' ],
						auto: '',
						errorMessage: '',
					} ],
				},
				messages: {
					type: 'array',
					default: [ {
						success: '',
						error: '',
						required: '',
						invalid: '',
						recaptchaerror: '',
					} ],
				},
				messageFont: {
					type: 'array',
					default: [ {
						colorSuccess: '',
						colorError: '',
						borderSuccess: '',
						borderError: '',
						backgroundSuccess: '',
						backgroundSuccessOpacity: 1,
						backgroundError: '',
						backgroundErrorOpacity: 1,
						borderWidth: [ '', '', '', '' ],
						borderRadius: '',
						size: [ '', '', '' ],
						sizeType: 'px',
						lineHeight: [ '', '', '' ],
						lineType: 'px',
						letterSpacing: '',
						textTransform: '',
						family: '',
						google: '',
						style: '',
						weight: '',
						variant: '',
						subset: '',
						loadGoogle: true,
						padding: [ '', '', '', '' ],
						margin: [ '', '', '', '' ],
					} ],
				},
				style: {
					type: 'array',
					default: [ {
						showRequired: true,
						size: 'standard',
						deskPadding: [ '', '', '', '' ],
						tabletPadding: [ '', '', '', '' ],
						mobilePadding: [ '', '', '', '' ],
						color: '',
						requiredColor: '',
						background: '',
						border: '',
						backgroundOpacity: 1,
						borderOpacity: 1,
						borderRadius: '',
						borderWidth: [ '', '', '', '' ],
						colorActive: '',
						backgroundActive: '',
						borderActive: '',
						backgroundActiveOpacity: 1,
						borderActiveOpacity: 1,
						gradient: [ '#999999', 1, 0, 100, 'linear', 180, 'center center' ],
						gradientActive: [ '#777777', 1, 0, 100, 'linear', 180, 'center center' ],
						backgroundType: 'solid',
						backgroundActiveType: 'solid',
						boxShadow: [ false, '#000000', 0.2, 1, 1, 2, 0, false ],
						boxShadowActive: [ false, '#000000', 0.4, 2, 2, 3, 0, false ],
						fontSize: [ '', '', '' ],
						fontSizeType: 'px',
						lineHeight: [ '', '', '' ],
						lineType: 'px',
						rowGap: '',
						rowGapType: 'px',
						gutter: '',
						gutterType: 'px',
					} ],
				},
				labelFont: {
					type: 'array',
					default: [ {
						color: '',
						size: [ '', '', '' ],
						sizeType: 'px',
						lineHeight: [ '', '', '' ],
						lineType: 'px',
						letterSpacing: '',
						textTransform: '',
						family: '',
						google: '',
						style: '',
						weight: '',
						variant: '',
						subset: '',
						loadGoogle: true,
						padding: [ '', '', '', '' ],
						margin: [ '', '', '', '' ],
					} ],
				},
				submit: {
					type: 'array',
					default: [ {
						label: '',
						width: [ '100', '', '' ],
						size: 'standard',
						widthType: 'auto',
						fixedWidth: [ '', '', '' ],
						align: [ '', '', '' ],
						deskPadding: [ '', '', '', '' ],
						tabletPadding: [ '', '', '', '' ],
						mobilePadding: [ '', '', '', '' ],
						color: '',
						background: '',
						border: '',
						backgroundOpacity: 1,
						borderOpacity: 1,
						borderRadius: '',
						borderWidth: [ '', '', '', '' ],
						colorHover: '',
						backgroundHover: '',
						borderHover: '',
						backgroundHoverOpacity: 1,
						borderHoverOpacity: 1,
						icon: '',
						iconSide: 'right',
						iconHover: false,
						cssClass: '',
						gradient: [ '#999999', 1, 0, 100, 'linear', 180, 'center center' ],
						gradientHover: [ '#777777', 1, 0, 100, 'linear', 180, 'center center' ],
						btnStyle: 'basic',
						btnSize: 'standard',
						backgroundType: 'solid',
						backgroundHoverType: 'solid',
						boxShadow: [ false, '#000000', 0.2, 1, 1, 2, 0, false ],
						boxShadowHover: [ false, '#000000', 0.4, 2, 2, 3, 0, false ],
					} ],
				},
				submitMargin: {
					type: 'array',
					default: [ {
						desk: [ '', '', '', '' ],
						tablet: [ '', '', '', '' ],
						mobile: [ '', '', '', '' ],
						unit: 'px',
						control: 'linked',
					} ],
				},
				submitFont: {
					type: 'array',
					default: [ {
						size: [ '', '', '' ],
						sizeType: 'px',
						lineHeight: [ '', '', '' ],
						lineType: 'px',
						letterSpacing: '',
						textTransform: '',
						family: '',
						google: '',
						style: '',
						weight: '',
						variant: '',
						subset: '',
						loadGoogle: true,
					} ],
				},
				actions: {
					type: 'array',
					default: [ 'email' ],
				},
				email: {
					type: 'array',
					default: [ {
						emailTo: '',
						subject: '',
						fromEmail: '',
						fromName: '',
						replyTo: 'email_field',
						cc: '',
						bcc: '',
						html: true,
					} ],
				},
				redirect: {
					type: 'string',
					default: '',
				},
				recaptcha: {
					type: 'bool',
					default: false,
				},
				recaptchaVersion: {
					type: 'string',
					default: 'v3',
				},
				honeyPot: {
					type: 'bool',
					default: true,
				},
				mailerlite: {
					type: 'array',
					default: [ {
						group: [],
						map: [],
					} ],
				},
				fluentcrm: {
					type: 'array',
					default: [ {
						lists: [],
						tags: [],
						map: [],
						doubleOptin: false,
					} ],
				},
				containerMarginType: {
					type: 'string',
					default: 'px',
				},
				containerMargin: {
					type: 'array',
					default: [ '', '', '', '' ],
				},
				tabletContainerMargin: {
					type: 'array',
					default: [ '', '', '', '' ],
				},
				mobileContainerMargin: {
					type: 'array',
					default: [ '', '', '', '' ],
				},
			},
			save: ( { attributes } ) => {
				const { uniqueID, fields, submit, style, postID, hAlign, recaptcha, recaptchaVersion, honeyPot } = attributes;
				const fieldOutput = ( index ) => {
					const fieldClassName = classnames( {
						'kadence-blocks-form-field': true,
						[ `kb-form-field-${ index }` ]: index,
						[ `kb-field-desk-width-${ fields[ index ].width[ 0 ] }` ]: fields[ index ].width && fields[ index ].width[ 0 ],
						[ `kb-field-tablet-width-${ fields[ index ].width[ 1 ] }` ]: fields[ index ].width && fields[ index ].width[ 1 ],
						[ `kb-field-mobile-width-${ fields[ index ].width[ 2 ] }` ]: fields[ index ].width && fields[ index ].width[ 2 ],
						[ `kb-input-size-${ style[ 0 ].size }` ]: style[ 0 ].size,
					} );
					let acceptLabel;
					let acceptLabelBefore;
					let acceptLabelAfter;
					if ( fields[ index ].label && fields[ index ].label.includes( '{privacy_policy}' ) ) {
						acceptLabelBefore = fields[ index ].label.split( '{' )[ 0 ];
						acceptLabelAfter = fields[ index ].label.split( '}' )[ 1 ];
						acceptLabel = (
							<Fragment>
								{ acceptLabelBefore }<a href={ ( undefined !== kadence_blocks_params.privacy_link && '' !== kadence_blocks_params.privacy_link ? kadence_blocks_params.privacy_link : '#' ) } target="blank" rel="noopener noreferrer">{ ( undefined !== kadence_blocks_params.privacy_title && '' !== kadence_blocks_params.privacy_title ? kadence_blocks_params.privacy_title : 'Privacy policy' ) }</a>{ acceptLabelAfter }
							</Fragment>
						);
					} else {
						acceptLabel = fields[ index ].label;
					}
					return (
						<div className={ fieldClassName } >
							{ 'accept' === fields[ index ].type && (
								<Fragment>
									{ fields[ index ].showLink && (
										<a href={ ( undefined !== fields[ index ].default && '' !== fields[ index ].default ? fields[ index ].default : '#' ) } target="_blank" rel="noopener noreferrer" className={ 'kb-accept-link' }>{ ( undefined !== fields[ index ].placeholder && '' !== fields[ index ].placeholder ? fields[ index ].placeholder : 'View Privacy Policy' ) }</a>
									) }
									<input type="checkbox" name={ fieldName } id={ `kb_field_${ uniqueID }_${ index }` } className={ `kb-field kb-checkbox-style kb-${ fields[ index ].type }` } value={ 'accept' } checked={ fields[ index ].inline ? true : false } data-type={ fields[ index ].type } data-required={ ( fields[ index ].required ? 'yes' : undefined ) } />
									<label htmlFor={ `kb_field_${ uniqueID }_${ index }` }>{ ( fields[ index ].label ? acceptLabel : '' ) }{ ( fields[ index ].required && style[ 0 ].showRequired ? <span className="required">*</span> : '' ) }</label>
								</Fragment>
							) }
							{ 'accept' !== fields[ index ].type && (
								<Fragment>
									{ fields[ index ].showLabel && (
										<label htmlFor={ `kb_field_${ uniqueID }_${ index }` }>{ ( fields[ index ].label ? fields[ index ].label : '' ) }{ ( fields[ index ].required && style[ 0 ].showRequired ? <span className="required">*</span> : '' ) }</label>
									) }
									{ 'textarea' === fields[ index ].type && (
										<textarea name={ fieldName } id={ `kb_field_${ uniqueID }_${ index }` } data-label={ fields[ index ].label } type={ fields[ index ].type } placeholder={ fields[ index ].placeholder } value={ fields[ index ].default } data-type={ fields[ index ].type } className={ `kb-field kb-text-style-field kb-${ fields[ index ].type }-field kb-field-${ index }` } rows={ fields[ index ].rows } data-required={ ( fields[ index ].required ? 'yes' : undefined ) } />
									) }
									{ 'select' === fields[ index ].type && (
										<select name={ ( fields[ index ].multiSelect ? `kb_field_${ index }[]` : `kb_field_${ index }` ) } id={ `kb_field_${ uniqueID }_${ index }` } multiple={ ( fields[ index ].multiSelect ? true : false ) } data-label={ fields[ index ].label } type={ fields[ index ].type } value={ fields[ index ].default } data-type={ fields[ index ].type } className={ `kb-field kb-select-style-field kb-${ fields[ index ].type }-field kb-field-${ index }` } data-required={ ( fields[ index ].required ? 'yes' : undefined ) }>
											{ undefined !== fields[ index ].placeholder && '' !== fields[ index ].placeholder && (
												<option
													value=""
													disabled={ true }
													selected={ '' === fields[ index ].default ? true : false }
												>
													{ fields[ index ].placeholder }
												</option>
											) }
											{ times( fields[ index ].options.length, n => (
												<option
													key={ n }
													selected={ ( undefined !== fields[ index ].options[ n ].value && fields[ index ].options[ n ].value === fields[ index ].default ? true : false ) }
													value={ ( undefined !== fields[ index ].options[ n ].value ? fields[ index ].options[ n ].value : '' ) }
												>{ ( undefined !== fields[ index ].options[ n ].label ? fields[ index ].options[ n ].label : '' ) }</option>
											) ) }
										</select>
									) }
									{ 'checkbox' === fields[ index ].type && (
										<div data-type={ fields[ index ].type } data-label={ fields[ index ].label } id={ `kb_field_${ uniqueID }_${ index }` } className={ `kb-field kb-checkbox-style-field kb-${ fields[ index ].type }-field kb-field-${ index }` } data-required={ ( fields[ index ].required ? 'yes' : undefined ) }>
											{ times( fields[ index ].options.length, n => (
												<div key={ n } data-type={ fields[ index ].type } className={ `kb-checkbox-item kb-checkbox-item-${ n }` }>
													<input type="checkbox" name={ `kb_field_${ index }[]` } id={ `kb_field_${ index }_${ n }` } className={ 'kb-sub-field kb-checkbox-style' } value={ ( undefined !== fields[ index ].options[ n ].value ? fields[ index ].options[ n ].value : '' ) } checked={ ( undefined !== fields[ index ].options[ n ].value && fields[ index ].options[ n ].value === fields[ index ].default ? true : false ) } />
													<label htmlFor={ `kb_field_${ index }_${ n }` }>{ ( undefined !== fields[ index ].options[ n ].label ? fields[ index ].options[ n ].label : '' ) }</label>
												</div>
											) ) }
										</div>
									) }
									{ 'radio' === fields[ index ].type && (
										<div data-type={ fields[ index ].type } data-label={ fields[ index ].label } id={ `kb_field_${ uniqueID }_${ index }` } className={ `kb-field kb-radio-style-field kb-${ fields[ index ].type }-field kb-field-${ index }` } data-required={ ( fields[ index ].required ? 'yes' : undefined ) }>
											{ times( fields[ index ].options.length, n => (
												<div key={ n } data-type={ fields[ index ].type } className={ `kb-radio-item kb-radio-item-${ n }` }>
													<input type="radio" name={ `kb_field_${ index }[]` } id={ `kb_field_${ index }_${ n }` } className={ 'kb-sub-field kb-radio-style' } value={ ( undefined !== fields[ index ].options[ n ].value ? fields[ index ].options[ n ].value : '' ) } checked={ ( undefined !== fields[ index ].options[ n ].value && fields[ index ].options[ n ].value === fields[ index ].default ? true : false ) } />
													<label htmlFor={ `kb_field_${ index }_${ n }` }>{ ( undefined !== fields[ index ].options[ n ].label ? fields[ index ].options[ n ].label : '' ) }</label>
												</div>
											) ) }
										</div>
									) }
									{ 'textarea' !== fields[ index ].type && 'select' !== fields[ index ].type && 'checkbox' !== fields[ index ].type && 'radio' !== fields[ index ].type && (
										<input name={ fieldName } id={ `kb_field_${ uniqueID }_${ index }` } data-label={ fields[ index ].label } type={ fields[ index ].type } placeholder={ fields[ index ].placeholder } value={ fields[ index ].default } data-type={ fields[ index ].type } className={ `kb-field kb-text-style-field kb-${ fields[ index ].type }-field kb-field-${ index }` } autoComplete={ ( '' !== fields[ index ].auto ? fields[ index ].auto : undefined ) } data-required={ ( fields[ index ].required ? 'yes' : undefined ) } />
									) }
								</Fragment>
							) }
							{ undefined !== fields[ index ].description && '' !== fields[ index ].description && (
								<span className={ 'kb-field-help' }>{ ( fields[ index ].description ? fields[ index ].description : '' ) }</span>
							) }
						</div>
					);
				};
				const renderFieldOutput = (
					<Fragment>
						{ times( fields.length, n => fieldOutput( n ) ) }
					</Fragment>
				);
				const submitClassName = classnames( {
					'kadence-blocks-form-field': true,
					'kb-submit-field': true,
					[ `kb-field-desk-width-${ submit[ 0 ].width[ 0 ] }` ]: submit[ 0 ].width && submit[ 0 ].width[ 0 ],
					[ `kb-field-tablet-width-${ submit[ 0 ].width[ 1 ] }` ]: submit[ 0 ].width && submit[ 0 ].width[ 1 ],
					[ `kb-field-mobile-width-${ submit[ 0 ].width[ 2 ] }` ]: submit[ 0 ].width && submit[ 0 ].width[ 2 ],
				} );
				return (
					<div className={ `kadence-form-${ uniqueID } kb-form-wrap${ ( hAlign ? ' kb-form-align-' + hAlign : '' ) }` }>
						<form className="kb-form" action="" method="post">
							{ renderFieldOutput }
							<input type="hidden" name="_kb_form_id" value={ uniqueID } />
							<input type="hidden" name="_kb_form_post_id" value={ postID } />
							<input type="hidden" name="action" value="kb_process_ajax_submit" />
							{ recaptcha && (
								<Fragment>
									{ recaptchaVersion === 'v2' && (
										<div className="kadence-blocks-form-field google-recaptcha-checkout-wrap">
											<p id="kb-container-g-recaptcha" className="google-recaptcha-container">
												<span id={ `kb_recaptcha_${ uniqueID }` } className={ `kadence-blocks-g-recaptcha-v2 g-recaptcha kb_recaptcha_${ uniqueID }` } style={ {
													display: 'inline-block',
												} }>
												</span>
											</p>
										</div>
									) }
									{ recaptchaVersion !== 'v2' && (
										<input type="hidden" name="recaptcha_response" className={ `kb_recaptcha_response kb_recaptcha_${ uniqueID }` } />
									) }
								</Fragment>
							) }
							{ honeyPot && (
								<input className="kadence-blocks-field verify" type="text" name="_kb_verify_email" autoComplete="off" placeholder="Email" tabIndex="-1" />
							) }
							<div className={ submitClassName }>
								<RichText.Content
									tagName="button"
									value={ ( '' !== submit[ 0 ].label ? submit[ 0 ].label : 'Submit' ) }
									className={ `kb-forms-submit button kb-button-size-${ ( submit[ 0 ].size ? submit[ 0 ].size : 'standard' ) } kb-button-width-${ ( submit[ 0 ].widthType ? submit[ 0 ].widthType : 'auto' ) }` }
								/>
							</div>
						</form>
					</div>
				);
			},
		},
		{
			attributes: {
				uniqueID: {
					type: 'string',
					default: '',
				},
				postID: {
					type: 'number',
					default: '',
				},
				hAlign: {
					type: 'string',
					default: '',
				},
				fields: {
					type: 'array',
					default: [ {
						label: 'Name',
						showLabel: true,
						placeholder: '',
						default: '',
						description: '',
						rows: 4,
						options: [ {
							value: '',
							label: '',
						} ],
						multiSelect: false,
						inline: false,
						showLink: false,
						min: '',
						max: '',
						type: 'text', // text, email, textarea, url, tel, radio, select, check, accept
						required: false,
						width: [ '100', '', '' ],
						auto: '',
					},
					{
						label: 'Email',
						showLabel: true,
						placeholder: '',
						default: '',
						description: '',
						rows: 4,
						options: [ {
							value: '',
							label: '',
						} ],
						multiSelect: false,
						inline: false,
						showLink: false,
						min: '',
						max: '',
						type: 'email', // text, email, textarea, url, tel, radio, select, check, accept
						required: true,
						width: [ '100', '', '' ],
						auto: '',
					},
					{
						label: 'Message',
						showLabel: true,
						placeholder: '',
						default: '',
						description: '',
						rows: 4,
						options: [ {
							value: '',
							label: '',
						} ],
						multiSelect: false,
						inline: false,
						showLink: false,
						min: '',
						max: '',
						type: 'textarea', // text, email, textarea, url, tel, radio, select, check, accept
						required: true,
						width: [ '100', '', '' ],
						auto: '',
					} ],
				},
				messages: {
					type: 'array',
					default: [ {
						success: '',
						error: '',
						required: '',
						invalid: '',
						recaptchaerror: '',
					} ],
				},
				messageFont: {
					type: 'array',
					default: [ {
						colorSuccess: '',
						colorError: '',
						borderSuccess: '',
						borderError: '',
						backgroundSuccess: '',
						backgroundSuccessOpacity: 1,
						backgroundError: '',
						backgroundErrorOpacity: 1,
						borderWidth: [ '', '', '', '' ],
						borderRadius: '',
						size: [ '', '', '' ],
						sizeType: 'px',
						lineHeight: [ '', '', '' ],
						lineType: 'px',
						letterSpacing: '',
						textTransform: '',
						family: '',
						google: '',
						style: '',
						weight: '',
						variant: '',
						subset: '',
						loadGoogle: true,
						padding: [ '', '', '', '' ],
						margin: [ '', '', '', '' ],
					} ],
				},
				style: {
					type: 'array',
					default: [ {
						showRequired: true,
						size: 'standard',
						deskPadding: [ '', '', '', '' ],
						tabletPadding: [ '', '', '', '' ],
						mobilePadding: [ '', '', '', '' ],
						color: '',
						requiredColor: '',
						background: '',
						border: '',
						backgroundOpacity: 1,
						borderOpacity: 1,
						borderRadius: '',
						borderWidth: [ '', '', '', '' ],
						colorActive: '',
						backgroundActive: '',
						borderActive: '',
						backgroundActiveOpacity: 1,
						borderActiveOpacity: 1,
						gradient: [ '#999999', 1, 0, 100, 'linear', 180, 'center center' ],
						gradientActive: [ '#777777', 1, 0, 100, 'linear', 180, 'center center' ],
						backgroundType: 'solid',
						backgroundActiveType: 'solid',
						boxShadow: [ false, '#000000', 0.2, 1, 1, 2, 0, false ],
						boxShadowActive: [ false, '#000000', 0.4, 2, 2, 3, 0, false ],
						fontSize: [ '', '', '' ],
						fontSizeType: 'px',
						lineHeight: [ '', '', '' ],
						lineType: 'px',
						rowGap: '',
						rowGapType: 'px',
						gutter: '',
						gutterType: 'px',
					} ],
				},
				labelFont: {
					type: 'array',
					default: [ {
						color: '',
						size: [ '', '', '' ],
						sizeType: 'px',
						lineHeight: [ '', '', '' ],
						lineType: 'px',
						letterSpacing: '',
						textTransform: '',
						family: '',
						google: '',
						style: '',
						weight: '',
						variant: '',
						subset: '',
						loadGoogle: true,
						padding: [ '', '', '', '' ],
						margin: [ '', '', '', '' ],
					} ],
				},
				submit: {
					type: 'array',
					default: [ {
						label: '',
						width: [ '100', '', '' ],
						size: 'standard',
						widthType: 'auto',
						fixedWidth: [ '', '', '' ],
						align: [ '', '', '' ],
						deskPadding: [ '', '', '', '' ],
						tabletPadding: [ '', '', '', '' ],
						mobilePadding: [ '', '', '', '' ],
						color: '',
						background: '',
						border: '',
						backgroundOpacity: 1,
						borderOpacity: 1,
						borderRadius: '',
						borderWidth: [ '', '', '', '' ],
						colorHover: '',
						backgroundHover: '',
						borderHover: '',
						backgroundHoverOpacity: 1,
						borderHoverOpacity: 1,
						icon: '',
						iconSide: 'right',
						iconHover: false,
						cssClass: '',
						gradient: [ '#999999', 1, 0, 100, 'linear', 180, 'center center' ],
						gradientHover: [ '#777777', 1, 0, 100, 'linear', 180, 'center center' ],
						btnStyle: 'basic',
						btnSize: 'standard',
						backgroundType: 'solid',
						backgroundHoverType: 'solid',
						boxShadow: [ false, '#000000', 0.2, 1, 1, 2, 0, false ],
						boxShadowHover: [ false, '#000000', 0.4, 2, 2, 3, 0, false ],
					} ],
				},
				submitMargin: {
					type: 'array',
					default: [ {
						desk: [ '', '', '', '' ],
						tablet: [ '', '', '', '' ],
						mobile: [ '', '', '', '' ],
						unit: 'px',
						control: 'linked',
					} ],
				},
				submitFont: {
					type: 'array',
					default: [ {
						size: [ '', '', '' ],
						sizeType: 'px',
						lineHeight: [ '', '', '' ],
						lineType: 'px',
						letterSpacing: '',
						textTransform: '',
						family: '',
						google: '',
						style: '',
						weight: '',
						variant: '',
						subset: '',
						loadGoogle: true,
					} ],
				},
				actions: {
					type: 'array',
					default: [ 'email' ],
				},
				email: {
					type: 'array',
					default: [ {
						emailTo: '',
						subject: '',
						fromEmail: '',
						fromName: '',
						replyTo: 'email_field',
						cc: '',
						bcc: '',
						html: true,
					} ],
				},
				redirect: {
					type: 'string',
					default: '',
				},
				recaptcha: {
					type: 'bool',
					default: false,
				},
				recaptchaVersion: {
					type: 'string',
					default: 'v3',
				},
				honeyPot: {
					type: 'bool',
					default: true,
				},
			},
			save: ( { attributes } ) => {
				const { uniqueID, fields, submit, style, postID, hAlign, recaptcha, recaptchaVersion, honeyPot } = attributes;
				const fieldOutput = ( index ) => {
					const fieldClassName = classnames( {
						'kadence-blocks-form-field': true,
						[ `kb-form-field-${ index }` ]: index,
						[ `kb-field-desk-width-${ fields[ index ].width[ 0 ] }` ]: fields[ index ].width && fields[ index ].width[ 0 ],
						[ `kb-field-tablet-width-${ fields[ index ].width[ 1 ] }` ]: fields[ index ].width && fields[ index ].width[ 1 ],
						[ `kb-field-mobile-width-${ fields[ index ].width[ 2 ] }` ]: fields[ index ].width && fields[ index ].width[ 2 ],
						[ `kb-input-size-${ style[ 0 ].size }` ]: style[ 0 ].size,
					} );
					let acceptLabel;
					let acceptLabelBefore;
					let acceptLabelAfter;
					if ( fields[ index ].label && fields[ index ].label.includes( '{privacy_policy}' ) ) {
						acceptLabelBefore = fields[ index ].label.split( '{' )[ 0 ];
						acceptLabelAfter = fields[ index ].label.split( '}' )[ 1 ];
						acceptLabel = (
							<Fragment>
								{ acceptLabelBefore }<a href={ ( undefined !== kadence_blocks_params.privacy_link && '' !== kadence_blocks_params.privacy_link ? kadence_blocks_params.privacy_link : '#' ) } target="blank" rel="noopener noreferrer">{ ( undefined !== kadence_blocks_params.privacy_title && '' !== kadence_blocks_params.privacy_title ? kadence_blocks_params.privacy_title : 'Privacy policy' ) }</a>{ acceptLabelAfter }
							</Fragment>
						);
					} else {
						acceptLabel = fields[ index ].label;
					}
					return (
						<div className={ fieldClassName } >
							{ 'accept' === fields[ index ].type && (
								<Fragment>
									{ fields[ index ].showLink && (
										<a href={ ( undefined !== fields[ index ].default && '' !== fields[ index ].default ? fields[ index ].default : '#' ) } target="_blank" rel="noopener noreferrer" className={ 'kb-accept-link' }>{ ( undefined !== fields[ index ].placeholder && '' !== fields[ index ].placeholder ? fields[ index ].placeholder : 'View Privacy Policy' ) }</a>
									) }
									<input type="checkbox" name={ fieldName } id={ `kb_field_${ uniqueID }_${ index }` } className={ `kb-field kb-checkbox-style kb-${ fields[ index ].type }` } value={ 'accept' } checked={ fields[ index ].inline ? true : false } data-type={ fields[ index ].type } data-required={ ( fields[ index ].required ? 'yes' : undefined ) } />
									<label htmlFor={ `kb_field_${ uniqueID }_${ index }` }>{ ( fields[ index ].label ? acceptLabel : '' ) }{ ( fields[ index ].required && style[ 0 ].showRequired ? <span className="required">*</span> : '' ) }</label>
								</Fragment>
							) }
							{ 'accept' !== fields[ index ].type && (
								<Fragment>
									{ fields[ index ].showLabel && (
										<label htmlFor={ `kb_field_${ uniqueID }_${ index }` }>{ ( fields[ index ].label ? fields[ index ].label : '' ) }{ ( fields[ index ].required && style[ 0 ].showRequired ? <span className="required">*</span> : '' ) }</label>
									) }
									{ 'textarea' === fields[ index ].type && (
										<textarea name={ fieldName } id={ `kb_field_${ uniqueID }_${ index }` } data-label={ fields[ index ].label } type={ fields[ index ].type } placeholder={ fields[ index ].placeholder } value={ fields[ index ].default } data-type={ fields[ index ].type } className={ `kb-field kb-text-style-field kb-${ fields[ index ].type }-field kb-field-${ index }` } rows={ fields[ index ].rows } data-required={ ( fields[ index ].required ? 'yes' : undefined ) } />
									) }
									{ 'select' === fields[ index ].type && (
										<select name={ ( fields[ index ].multiSelect ? `kb_field_${ index }[]` : `kb_field_${ index }` ) } id={ `kb_field_${ uniqueID }_${ index }` } multiple={ ( fields[ index ].multiSelect ? true : false ) } data-label={ fields[ index ].label } type={ fields[ index ].type } value={ fields[ index ].default } data-type={ fields[ index ].type } className={ `kb-field kb-select-style-field kb-${ fields[ index ].type }-field kb-field-${ index }` } data-required={ ( fields[ index ].required ? 'yes' : undefined ) }>
											{ times( fields[ index ].options.length, n => (
												<option
													key={ n }
													selected={ ( undefined !== fields[ index ].options[ n ].value && fields[ index ].options[ n ].value === fields[ index ].default ? true : false ) }
													value={ ( undefined !== fields[ index ].options[ n ].value ? fields[ index ].options[ n ].value : '' ) }
												>{ ( undefined !== fields[ index ].options[ n ].label ? fields[ index ].options[ n ].label : '' ) }</option>
											) ) }
										</select>
									) }
									{ 'checkbox' === fields[ index ].type && (
										<div data-type={ fields[ index ].type } data-label={ fields[ index ].label } id={ `kb_field_${ uniqueID }_${ index }` } className={ `kb-field kb-checkbox-style-field kb-${ fields[ index ].type }-field kb-field-${ index }` } data-required={ ( fields[ index ].required ? 'yes' : undefined ) }>
											{ times( fields[ index ].options.length, n => (
												<div key={ n } data-type={ fields[ index ].type } className={ `kb-checkbox-item kb-checkbox-item-${ n }` }>
													<input type="checkbox" name={ `kb_field_${ index }[]` } id={ `kb_field_${ index }_${ n }` } className={ 'kb-sub-field kb-checkbox-style' } value={ ( undefined !== fields[ index ].options[ n ].value ? fields[ index ].options[ n ].value : '' ) } checked={ ( undefined !== fields[ index ].options[ n ].value && fields[ index ].options[ n ].value === fields[ index ].default ? true : false ) } />
													<label htmlFor={ `kb_field_${ index }_${ n }` }>{ ( undefined !== fields[ index ].options[ n ].label ? fields[ index ].options[ n ].label : '' ) }</label>
												</div>
											) ) }
										</div>
									) }
									{ 'textarea' !== fields[ index ].type && 'select' !== fields[ index ].type && 'checkbox' !== fields[ index ].type && (
										<input name={ fieldName } id={ `kb_field_${ uniqueID }_${ index }` } data-label={ fields[ index ].label } type={ fields[ index ].type } placeholder={ fields[ index ].placeholder } value={ fields[ index ].default } data-type={ fields[ index ].type } className={ `kb-field kb-text-style-field kb-${ fields[ index ].type }-field kb-field-${ index }` } autoComplete={ ( '' !== fields[ index ].auto ? fields[ index ].auto : undefined ) } data-required={ ( fields[ index ].required ? 'yes' : undefined ) } />
									) }
								</Fragment>
							) }
							{ undefined !== fields[ index ].description && '' !== fields[ index ].description && (
								<span className={ 'kb-field-help' }>{ ( fields[ index ].description ? fields[ index ].description : '' ) }</span>
							) }
						</div>
					);
				};
				const renderFieldOutput = (
					<Fragment>
						{ times( fields.length, n => fieldOutput( n ) ) }
					</Fragment>
				);
				const submitClassName = classnames( {
					'kadence-blocks-form-field': true,
					'kb-submit-field': true,
					[ `kb-field-desk-width-${ submit[ 0 ].width[ 0 ] }` ]: submit[ 0 ].width && submit[ 0 ].width[ 0 ],
					[ `kb-field-tablet-width-${ submit[ 0 ].width[ 1 ] }` ]: submit[ 0 ].width && submit[ 0 ].width[ 1 ],
					[ `kb-field-mobile-width-${ submit[ 0 ].width[ 2 ] }` ]: submit[ 0 ].width && submit[ 0 ].width[ 2 ],
				} );
				return (
					<div className={ `kadence-form-${ uniqueID } kb-form-wrap${ ( hAlign ? ' kb-form-align-' + hAlign : '' ) }` }>
						<form className="kb-form" action="" method="post">
							{ renderFieldOutput }
							<input type="hidden" name="_kb_form_id" value={ uniqueID } />
							<input type="hidden" name="_kb_form_post_id" value={ postID } />
							<input type="hidden" name="action" value="kb_process_ajax_submit" />
							{ recaptcha && (
								<Fragment>
									{ recaptchaVersion === 'v2' && (
										<div className="kadence-blocks-form-field google-recaptcha-checkout-wrap">
											<p id="kb-container-g-recaptcha" className="google-recaptcha-container">
												<span id={ `kb_recaptcha_${ uniqueID }` } className={ `kadence-blocks-g-recaptcha-v2 g-recaptcha kb_recaptcha_${ uniqueID }` } style={ {
													display: 'inline-block',
												} }>
												</span>
											</p>
										</div>
									) }
									{ recaptchaVersion !== 'v2' && (
										<input type="hidden" name="recaptcha_response" className={ `kb_recaptcha_response kb_recaptcha_${ uniqueID }` } />
									) }
								</Fragment>
							) }
							{ honeyPot && (
								<input className="kadence-blocks-field verify" type="text" name="_kb_verify_email" autoComplete="off" placeholder="Email" tabIndex="-1" />
							) }
							<div className={ submitClassName }>
								<RichText.Content
									tagName="button"
									value={ ( '' !== submit[ 0 ].label ? submit[ 0 ].label : 'Submit' ) }
									className={ `kb-forms-submit button kb-button-size-${ ( submit[ 0 ].size ? submit[ 0 ].size : 'standard' ) } kb-button-width-${ ( submit[ 0 ].widthType ? submit[ 0 ].widthType : 'auto' ) }` }
								/>
							</div>
						</form>
					</div>
				);
			},
		},
		{
			attributes: {
				uniqueID: {
					type: 'string',
					default: '',
				},
				postID: {
					type: 'number',
					default: '',
				},
				hAlign: {
					type: 'string',
					default: '',
				},
				fields: {
					type: 'array',
					default: [ {
						label: 'Name',
						showLabel: true,
						placeholder: '',
						default: '',
						description: '',
						rows: 4,
						options: [ {
							value: '',
							label: '',
						} ],
						multiSelect: false,
						inline: false,
						showLink: false,
						min: '',
						max: '',
						type: 'text', // text, email, textarea, url, tel, radio, select, check, accept
						required: false,
						width: [ '100', '', '' ],
						auto: '',
					},
					{
						label: 'Email',
						showLabel: true,
						placeholder: '',
						default: '',
						description: '',
						rows: 4,
						options: [ {
							value: '',
							label: '',
						} ],
						multiSelect: false,
						inline: false,
						showLink: false,
						min: '',
						max: '',
						type: 'email', // text, email, textarea, url, tel, radio, select, check, accept
						required: true,
						width: [ '100', '', '' ],
						auto: '',
					},
					{
						label: 'Message',
						showLabel: true,
						placeholder: '',
						default: '',
						description: '',
						rows: 4,
						options: [ {
							value: '',
							label: '',
						} ],
						multiSelect: false,
						inline: false,
						showLink: false,
						min: '',
						max: '',
						type: 'textarea', // text, email, textarea, url, tel, radio, select, check, accept
						required: true,
						width: [ '100', '', '' ],
						auto: '',
					} ],
				},
				messages: {
					type: 'array',
					default: [ {
						success: '',
						error: '',
						required: '',
						invalid: '',
					} ],
				},
				messageFont: {
					type: 'array',
					default: [ {
						colorSuccess: '',
						colorError: '',
						borderSuccess: '',
						borderError: '',
						backgroundSuccess: '',
						backgroundSuccessOpacity: 1,
						backgroundError: '',
						backgroundErrorOpacity: 1,
						borderWidth: [ '', '', '', '' ],
						borderRadius: '',
						size: [ '', '', '' ],
						sizeType: 'px',
						lineHeight: [ '', '', '' ],
						lineType: 'px',
						letterSpacing: '',
						textTransform: '',
						family: '',
						google: '',
						style: '',
						weight: '',
						variant: '',
						subset: '',
						loadGoogle: true,
						padding: [ '', '', '', '' ],
						margin: [ '', '', '', '' ],
					} ],
				},
				style: {
					type: 'array',
					default: [ {
						showRequired: true,
						size: 'standard',
						deskPadding: [ '', '', '', '' ],
						tabletPadding: [ '', '', '', '' ],
						mobilePadding: [ '', '', '', '' ],
						color: '',
						requiredColor: '',
						background: '',
						border: '',
						backgroundOpacity: 1,
						borderOpacity: 1,
						borderRadius: '',
						borderWidth: [ '', '', '', '' ],
						colorActive: '',
						backgroundActive: '',
						borderActive: '',
						backgroundActiveOpacity: 1,
						borderActiveOpacity: 1,
						gradient: [ '#999999', 1, 0, 100, 'linear', 180, 'center center' ],
						gradientActive: [ '#777777', 1, 0, 100, 'linear', 180, 'center center' ],
						backgroundType: 'solid',
						backgroundActiveType: 'solid',
						boxShadow: [ false, '#000000', 0.2, 1, 1, 2, 0, false ],
						boxShadowActive: [ false, '#000000', 0.4, 2, 2, 3, 0, false ],
						fontSize: [ '', '', '' ],
						fontSizeType: 'px',
						lineHeight: [ '', '', '' ],
						lineType: 'px',
						rowGap: '',
						rowGapType: 'px',
						gutter: '',
						gutterType: 'px',
					} ],
				},
				labelFont: {
					type: 'array',
					default: [ {
						color: '',
						size: [ '', '', '' ],
						sizeType: 'px',
						lineHeight: [ '', '', '' ],
						lineType: 'px',
						letterSpacing: '',
						textTransform: '',
						family: '',
						google: '',
						style: '',
						weight: '',
						variant: '',
						subset: '',
						loadGoogle: true,
						padding: [ '', '', '', '' ],
						margin: [ '', '', '', '' ],
					} ],
				},
				submit: {
					type: 'array',
					default: [ {
						label: '',
						width: [ '100', '', '' ],
						size: 'standard',
						widthType: 'auto',
						fixedWidth: [ '', '', '' ],
						align: [ '', '', '' ],
						deskPadding: [ '', '', '', '' ],
						tabletPadding: [ '', '', '', '' ],
						mobilePadding: [ '', '', '', '' ],
						color: '',
						background: '',
						border: '',
						backgroundOpacity: 1,
						borderOpacity: 1,
						borderRadius: '',
						borderWidth: [ '', '', '', '' ],
						colorHover: '',
						backgroundHover: '',
						borderHover: '',
						backgroundHoverOpacity: 1,
						borderHoverOpacity: 1,
						icon: '',
						iconSide: 'right',
						iconHover: false,
						cssClass: '',
						gradient: [ '#999999', 1, 0, 100, 'linear', 180, 'center center' ],
						gradientHover: [ '#777777', 1, 0, 100, 'linear', 180, 'center center' ],
						btnStyle: 'basic',
						btnSize: 'standard',
						backgroundType: 'solid',
						backgroundHoverType: 'solid',
						boxShadow: [ false, '#000000', 0.2, 1, 1, 2, 0, false ],
						boxShadowHover: [ false, '#000000', 0.4, 2, 2, 3, 0, false ],
					} ],
				},
				submitMargin: {
					type: 'array',
					default: [ {
						desk: [ '', '', '', '' ],
						tablet: [ '', '', '', '' ],
						mobile: [ '', '', '', '' ],
						unit: 'px',
						control: 'linked',
					} ],
				},
				submitFont: {
					type: 'array',
					default: [ {
						size: [ '', '', '' ],
						sizeType: 'px',
						lineHeight: [ '', '', '' ],
						lineType: 'px',
						letterSpacing: '',
						textTransform: '',
						family: '',
						google: '',
						style: '',
						weight: '',
						variant: '',
						subset: '',
						loadGoogle: true,
					} ],
				},
				actions: {
					type: 'array',
					default: [ 'email' ],
				},
				email: {
					type: 'array',
					default: [ {
						emailTo: '',
						subject: '',
						fromEmail: '',
						fromName: '',
						replyTo: 'email_field',
						cc: '',
						bcc: '',
						html: true,
					} ],
				},
				redirect: {
					type: 'string',
					default: '',
				},
				recaptcha: {
					type: 'bool',
					default: false,
				},
				honeyPot: {
					type: 'bool',
					default: true,
				},
			},
			save: ( { attributes } ) => {
				const { uniqueID, fields, submit, style, postID, hAlign, recaptcha, honeyPot } = attributes;
				const fieldOutput = ( index ) => {
					const fieldClassName = classnames( {
						'kadence-blocks-form-field': true,
						[ `kb-form-field-${ index }` ]: index,
						[ `kb-field-desk-width-${ fields[ index ].width[ 0 ] }` ]: fields[ index ].width && fields[ index ].width[ 0 ],
						[ `kb-field-tablet-width-${ fields[ index ].width[ 1 ] }` ]: fields[ index ].width && fields[ index ].width[ 1 ],
						[ `kb-field-mobile-width-${ fields[ index ].width[ 2 ] }` ]: fields[ index ].width && fields[ index ].width[ 2 ],
						[ `kb-input-size-${ style[ 0 ].size }` ]: style[ 0 ].size,
					} );
					let acceptLabel;
					let acceptLabelBefore;
					let acceptLabelAfter;
					if ( fields[ index ].label && fields[ index ].label.includes( '{privacy_policy}' ) ) {
						acceptLabelBefore = fields[ index ].label.split( '{' )[ 0 ];
						acceptLabelAfter = fields[ index ].label.split( '}' )[ 1 ];
						acceptLabel = (
							<Fragment>
								{ acceptLabelBefore }<a href={ ( undefined !== kadence_blocks_params.privacy_link && '' !== kadence_blocks_params.privacy_link ? kadence_blocks_params.privacy_link : '#' ) } target="blank" rel="noopener noreferrer">{ ( undefined !== kadence_blocks_params.privacy_title && '' !== kadence_blocks_params.privacy_title ? kadence_blocks_params.privacy_title : 'Privacy policy' ) }</a>{ acceptLabelAfter }
							</Fragment>
						);
					} else {
						acceptLabel = fields[ index ].label;
					}
					return (
						<div className={ fieldClassName } >
							{ 'accept' === fields[ index ].type && (
								<Fragment>
									{ fields[ index ].showLink && (
										<a href={ ( undefined !== fields[ index ].default && '' !== fields[ index ].default ? fields[ index ].default : '#' ) } target="_blank" rel="noopener noreferrer" className={ 'kb-accept-link' }>{ ( undefined !== fields[ index ].placeholder && '' !== fields[ index ].placeholder ? fields[ index ].placeholder : 'View Privacy Policy' ) }</a>
									) }
									<input type="checkbox" name={ fieldName } id={ `kb_field_${ uniqueID }_${ index }` } className={ `kb-field kb-checkbox-style kb-${ fields[ index ].type }` } value={ 'accept' } checked={ fields[ index ].inline ? true : false } data-type={ fields[ index ].type } data-required={ ( fields[ index ].required ? 'yes' : undefined ) } />
									<label htmlFor={ `kb_field_${ uniqueID }_${ index }` }>{ ( fields[ index ].label ? acceptLabel : '' ) }{ ( fields[ index ].required && style[ 0 ].showRequired ? <span className="required">*</span> : '' ) }</label>
								</Fragment>
							) }
							{ 'accept' !== fields[ index ].type && (
								<Fragment>
									{ fields[ index ].showLabel && (
										<label htmlFor={ `kb_field_${ uniqueID }_${ index }` }>{ ( fields[ index ].label ? fields[ index ].label : '' ) }{ ( fields[ index ].required && style[ 0 ].showRequired ? <span className="required">*</span> : '' ) }</label>
									) }
									{ 'textarea' === fields[ index ].type && (
										<textarea name={ fieldName } id={ `kb_field_${ uniqueID }_${ index }` } data-label={ fields[ index ].label } type={ fields[ index ].type } placeholder={ fields[ index ].placeholder } value={ fields[ index ].default } data-type={ fields[ index ].type } className={ `kb-field kb-text-style-field kb-${ fields[ index ].type }-field kb-field-${ index }` } rows={ fields[ index ].rows } data-required={ ( fields[ index ].required ? 'yes' : undefined ) } />
									) }
									{ 'select' === fields[ index ].type && (
										<select name={ ( fields[ index ].multiSelect ? `kb_field_${ index }[]` : `kb_field_${ index }` ) } id={ `kb_field_${ uniqueID }_${ index }` } multiple={ ( fields[ index ].multiSelect ? true : false ) } data-label={ fields[ index ].label } type={ fields[ index ].type } value={ fields[ index ].default } data-type={ fields[ index ].type } className={ `kb-field kb-select-style-field kb-${ fields[ index ].type }-field kb-field-${ index }` } data-required={ ( fields[ index ].required ? 'yes' : undefined ) }>
											{ times( fields[ index ].options.length, n => (
												<option
													key={ n }
													selected={ ( undefined !== fields[ index ].options[ n ].value && fields[ index ].options[ n ].value === fields[ index ].default ? true : false ) }
													value={ ( undefined !== fields[ index ].options[ n ].value ? fields[ index ].options[ n ].value : '' ) }
												>{ ( undefined !== fields[ index ].options[ n ].label ? fields[ index ].options[ n ].label : '' ) }</option>
											) ) }
										</select>
									) }
									{ 'textarea' !== fields[ index ].type && 'select' !== fields[ index ].type && (
										<input name={ fieldName } id={ `kb_field_${ uniqueID }_${ index }` } data-label={ fields[ index ].label } type={ fields[ index ].type } placeholder={ fields[ index ].placeholder } value={ fields[ index ].default } data-type={ fields[ index ].type } className={ `kb-field kb-text-style-field kb-${ fields[ index ].type }-field kb-field-${ index }` } autoComplete={ ( '' !== fields[ index ].auto ? fields[ index ].auto : undefined ) } data-required={ ( fields[ index ].required ? 'yes' : undefined ) } />
									) }
								</Fragment>
							) }
							{ undefined !== fields[ index ].description && '' !== fields[ index ].description && (
								<span className={ 'kb-field-help' }>{ ( fields[ index ].description ? fields[ index ].description : '' ) }</span>
							) }
						</div>
					);
				};
				const renderFieldOutput = (
					<Fragment>
						{ times( fields.length, n => fieldOutput( n ) ) }
					</Fragment>
				);
				const submitClassName = classnames( {
					'kadence-blocks-form-field': true,
					'kb-submit-field': true,
					[ `kb-field-desk-width-${ submit[ 0 ].width[ 0 ] }` ]: submit[ 0 ].width && submit[ 0 ].width[ 0 ],
					[ `kb-field-tablet-width-${ submit[ 0 ].width[ 1 ] }` ]: submit[ 0 ].width && submit[ 0 ].width[ 1 ],
					[ `kb-field-mobile-width-${ submit[ 0 ].width[ 2 ] }` ]: submit[ 0 ].width && submit[ 0 ].width[ 2 ],
				} );
				return (
					<div className={ `kadence-form-${ uniqueID } kb-form-wrap${ ( hAlign ? ' kb-form-align-' + hAlign : '' ) }` }>
						<form className="kb-form" action="" method="post">
							{ renderFieldOutput }
							<input type="hidden" name="_kb_form_id" value={ uniqueID } />
							<input type="hidden" name="_kb_form_post_id" value={ postID } />
							<input type="hidden" name="action" value="kb_process_ajax_submit" />
							{ recaptcha && (
								<input type="hidden" name="recaptcha_response" className={ `kb_recaptcha_response kb_recaptcha_${ uniqueID }` } />
							) }
							{ honeyPot && (
								<input className="kadence-blocks-field verify" type="email" name="_kb_verify_email" autoComplete="off" placeholder="Email" tabIndex="-1" />
							) }
							<div className={ submitClassName }>
								<RichText.Content
									tagName="button"
									value={ ( '' !== submit[ 0 ].label ? submit[ 0 ].label : 'Submit' ) }
									className={ `kb-forms-submit button kb-button-size-${ ( submit[ 0 ].size ? submit[ 0 ].size : 'standard' ) } kb-button-width-${ ( submit[ 0 ].widthType ? submit[ 0 ].widthType : 'auto' ) }` }
								/>
							</div>
						</form>
					</div>
				);
			},
		},
		{
			attributes: {
				uniqueID: {
					type: 'string',
					default: '',
				},
				postID: {
					type: 'number',
					default: '',
				},
				hAlign: {
					type: 'string',
					default: '',
				},
				fields: {
					type: 'array',
					default: [ {
						label: 'Name',
						showLabel: true,
						placeholder: '',
						default: '',
						description: '',
						rows: 4,
						options: [ {
							value: '',
							label: '',
						} ],
						multiSelect: false,
						inline: false,
						showLink: false,
						min: '',
						max: '',
						type: 'text', // text, email, textarea, url, tel, radio, select, check, accept
						required: false,
						width: [ '100', '', '' ],
						auto: '',
					},
					{
						label: 'Email',
						showLabel: true,
						placeholder: '',
						default: '',
						description: '',
						rows: 4,
						options: [ {
							value: '',
							label: '',
						} ],
						multiSelect: false,
						inline: false,
						showLink: false,
						min: '',
						max: '',
						type: 'email', // text, email, textarea, url, tel, radio, select, check, accept
						required: true,
						width: [ '100', '', '' ],
						auto: '',
					},
					{
						label: 'Message',
						showLabel: true,
						placeholder: '',
						default: '',
						description: '',
						rows: 4,
						options: [ {
							value: '',
							label: '',
						} ],
						multiSelect: false,
						inline: false,
						showLink: false,
						min: '',
						max: '',
						type: 'textarea', // text, email, textarea, url, tel, radio, select, check, accept
						required: true,
						width: [ '100', '', '' ],
						auto: '',
					} ],
				},
				messages: {
					type: 'array',
					default: [ {
						success: '',
						error: '',
						required: '',
						invalid: '',
					} ],
				},
				messageFont: {
					type: 'array',
					default: [ {
						colorSuccess: '',
						colorError: '',
						borderSuccess: '',
						borderError: '',
						backgroundSuccess: '',
						backgroundSuccessOpacity: 1,
						backgroundError: '',
						backgroundErrorOpacity: 1,
						borderWidth: [ '', '', '', '' ],
						borderRadius: '',
						size: [ '', '', '' ],
						sizeType: 'px',
						lineHeight: [ '', '', '' ],
						lineType: 'px',
						letterSpacing: '',
						textTransform: '',
						family: '',
						google: '',
						style: '',
						weight: '',
						variant: '',
						subset: '',
						loadGoogle: true,
						padding: [ '', '', '', '' ],
						margin: [ '', '', '', '' ],
					} ],
				},
				style: {
					type: 'array',
					default: [ {
						showRequired: true,
						size: 'standard',
						deskPadding: [ '', '', '', '' ],
						tabletPadding: [ '', '', '', '' ],
						mobilePadding: [ '', '', '', '' ],
						color: '',
						requiredColor: '',
						background: '',
						border: '',
						backgroundOpacity: 1,
						borderOpacity: 1,
						borderRadius: '',
						borderWidth: [ '', '', '', '' ],
						colorActive: '',
						backgroundActive: '',
						borderActive: '',
						backgroundActiveOpacity: 1,
						borderActiveOpacity: 1,
						gradient: [ '#999999', 1, 0, 100, 'linear', 180, 'center center' ],
						gradientActive: [ '#777777', 1, 0, 100, 'linear', 180, 'center center' ],
						backgroundType: 'solid',
						backgroundActiveType: 'solid',
						boxShadow: [ false, '#000000', 0.2, 1, 1, 2, 0, false ],
						boxShadowActive: [ false, '#000000', 0.4, 2, 2, 3, 0, false ],
						fontSize: [ '', '', '' ],
						fontSizeType: 'px',
						lineHeight: [ '', '', '' ],
						lineType: 'px',
						rowGap: '',
						rowGapType: 'px',
						gutter: '',
						gutterType: 'px',
					} ],
				},
				labelFont: {
					type: 'array',
					default: [ {
						color: '',
						size: [ '', '', '' ],
						sizeType: 'px',
						lineHeight: [ '', '', '' ],
						lineType: 'px',
						letterSpacing: '',
						textTransform: '',
						family: '',
						google: '',
						style: '',
						weight: '',
						variant: '',
						subset: '',
						loadGoogle: true,
						padding: [ '', '', '', '' ],
						margin: [ '', '', '', '' ],
					} ],
				},
				submit: {
					type: 'array',
					default: [ {
						label: '',
						width: [ '100', '', '' ],
						size: 'standard',
						widthType: 'auto',
						fixedWidth: [ '', '', '' ],
						align: [ '', '', '' ],
						deskPadding: [ '', '', '', '' ],
						tabletPadding: [ '', '', '', '' ],
						mobilePadding: [ '', '', '', '' ],
						color: '',
						background: '',
						border: '',
						backgroundOpacity: 1,
						borderOpacity: 1,
						borderRadius: '',
						borderWidth: [ '', '', '', '' ],
						colorHover: '',
						backgroundHover: '',
						borderHover: '',
						backgroundHoverOpacity: 1,
						borderHoverOpacity: 1,
						icon: '',
						iconSide: 'right',
						iconHover: false,
						cssClass: '',
						gradient: [ '#999999', 1, 0, 100, 'linear', 180, 'center center' ],
						gradientHover: [ '#777777', 1, 0, 100, 'linear', 180, 'center center' ],
						btnStyle: 'basic',
						btnSize: 'standard',
						backgroundType: 'solid',
						backgroundHoverType: 'solid',
						boxShadow: [ false, '#000000', 0.2, 1, 1, 2, 0, false ],
						boxShadowHover: [ false, '#000000', 0.4, 2, 2, 3, 0, false ],
					} ],
				},
				submitFont: {
					type: 'array',
					default: [ {
						size: [ '', '', '' ],
						sizeType: 'px',
						lineHeight: [ '', '', '' ],
						lineType: 'px',
						letterSpacing: '',
						textTransform: '',
						family: '',
						google: '',
						style: '',
						weight: '',
						variant: '',
						subset: '',
						loadGoogle: true,
					} ],
				},
				actions: {
					type: 'array',
					default: [ 'email' ],
				},
				email: {
					type: 'array',
					default: [ {
						emailTo: '',
						subject: '',
						fromEmail: '',
						fromName: '',
						replyTo: 'email_field',
						cc: '',
						bcc: '',
						html: true,
					} ],
				},
				redirect: {
					type: 'string',
					default: '',
				},
				recaptcha: {
					type: 'bool',
					default: false,
				},
				honeyPot: {
					type: 'bool',
					default: true,
				},
			},
			save: ( { attributes } ) => {
				const { uniqueID, fields, submit, style, postID, hAlign, recaptcha, honeyPot } = attributes;
				const fieldOutput = ( index ) => {
					const fieldClassName = classnames( {
						'kadence-blocks-form-field': true,
						[ `kb-form-field-${ index }` ]: index,
						[ `kb-field-desk-width-${ fields[ index ].width[ 0 ] }` ]: fields[ index ].width && fields[ index ].width[ 0 ],
						[ `kb-field-tablet-width-${ fields[ index ].width[ 1 ] }` ]: fields[ index ].width && fields[ index ].width[ 1 ],
						[ `kb-field-mobile-width-${ fields[ index ].width[ 2 ] }` ]: fields[ index ].width && fields[ index ].width[ 2 ],
						[ `kb-input-size-${ style[ 0 ].size }` ]: style[ 0 ].size,
					} );
					let acceptLabel;
					let acceptLabelBefore;
					let acceptLabelAfter;
					if ( fields[ index ].label && fields[ index ].label.includes( '{privacy_policy}' ) ) {
						acceptLabelBefore = fields[ index ].label.split( '{' )[ 0 ];
						acceptLabelAfter = fields[ index ].label.split( '}' )[ 1 ];
						acceptLabel = (
							<Fragment>
								{ acceptLabelBefore }<a href={ ( undefined !== kadence_blocks_params.privacy_link && '' !== kadence_blocks_params.privacy_link ? kadence_blocks_params.privacy_link : '#' ) } target="blank" rel="noopener noreferrer">{ ( undefined !== kadence_blocks_params.privacy_title && '' !== kadence_blocks_params.privacy_title ? kadence_blocks_params.privacy_title : 'Privacy policy' ) }</a>{ acceptLabelAfter }
							</Fragment>
						);
					} else {
						acceptLabel = fields[ index ].label;
					}
					return (
						<div className={ fieldClassName } >
							{ 'accept' === fields[ index ].type && (
								<Fragment>
									{ fields[ index ].showLink && (
										<a href={ ( undefined !== fields[ index ].default && '' !== fields[ index ].default ? fields[ index ].default : '#' ) } target="_blank" rel="noopener noreferrer" className={ 'kb-accept-link' }>{ ( undefined !== fields[ index ].placeholder && '' !== fields[ index ].placeholder ? fields[ index ].placeholder : 'View Privacy Policy' ) }</a>
									) }
									<input type="checkbox" name={ fieldName } id={ `kb_field_${ index }` } className={ `kb-field kb-checkbox-style kb-${ fields[ index ].type }` } value={ 'accept' } checked={ fields[ index ].inline ? true : false } data-type={ fields[ index ].type } data-required={ ( fields[ index ].required ? 'yes' : undefined ) } />
									<label htmlFor={ `kb_field_${ index }` }>{ ( fields[ index ].label ? acceptLabel : '' ) }{ ( fields[ index ].required && style[ 0 ].showRequired ? <span className="required">*</span> : '' ) }</label>
								</Fragment>
							) }
							{ 'accept' !== fields[ index ].type && (
								<Fragment>
									{ fields[ index ].showLabel && (
										<label htmlFor={ `kb_field_${ index }` }>{ ( fields[ index ].label ? fields[ index ].label : '' ) }{ ( fields[ index ].required && style[ 0 ].showRequired ? <span className="required">*</span> : '' ) }</label>
									) }
									{ 'textarea' === fields[ index ].type && (
										<textarea name={ fieldName } id={ `kb_field_${ index }` } data-label={ fields[ index ].label } type={ fields[ index ].type } placeholder={ fields[ index ].placeholder } value={ fields[ index ].default } data-type={ fields[ index ].type } className={ `kb-field kb-text-style-field kb-${ fields[ index ].type }-field kb-field-${ index }` } rows={ fields[ index ].rows } data-required={ ( fields[ index ].required ? 'yes' : undefined ) } />
									) }
									{ 'select' === fields[ index ].type && (
										<select name={ ( fields[ index ].multiSelect ? `kb_field_${ index }[]` : `kb_field_${ index }` ) } id={ `kb_field_${ index }` } multiple={ ( fields[ index ].multiSelect ? true : false ) } data-label={ fields[ index ].label } type={ fields[ index ].type } value={ fields[ index ].default } data-type={ fields[ index ].type } className={ `kb-field kb-select-style-field kb-${ fields[ index ].type }-field kb-field-${ index }` } data-required={ ( fields[ index ].required ? 'yes' : undefined ) }>
											{ times( fields[ index ].options.length, n => (
												<option
													key={ n }
													selected={ ( undefined !== fields[ index ].options[ n ].value && fields[ index ].options[ n ].value === fields[ index ].default ? true : false ) }
													value={ ( undefined !== fields[ index ].options[ n ].value ? fields[ index ].options[ n ].value : '' ) }
												>{ ( undefined !== fields[ index ].options[ n ].label ? fields[ index ].options[ n ].label : '' ) }</option>
											) ) }
										</select>
									) }
									{ 'textarea' !== fields[ index ].type && 'select' !== fields[ index ].type && (
										<input name={ fieldName } id={ `kb_field_${ index }` } data-label={ fields[ index ].label } type={ fields[ index ].type } placeholder={ fields[ index ].placeholder } value={ fields[ index ].default } data-type={ fields[ index ].type } className={ `kb-field kb-text-style-field kb-${ fields[ index ].type }-field kb-field-${ index }` } autoComplete={ ( '' !== fields[ index ].auto ? fields[ index ].auto : undefined ) } data-required={ ( fields[ index ].required ? 'yes' : undefined ) } />
									) }
								</Fragment>
							) }
							{ undefined !== fields[ index ].description && '' !== fields[ index ].description && (
								<span className={ 'kb-field-help' }>{ ( fields[ index ].description ? fields[ index ].description : '' ) }</span>
							) }
						</div>
					);
				};
				const renderFieldOutput = (
					<Fragment>
						{ times( fields.length, n => fieldOutput( n ) ) }
					</Fragment>
				);
				const submitClassName = classnames( {
					'kadence-blocks-form-field': true,
					'kb-submit-field': true,
					[ `kb-field-desk-width-${ submit[ 0 ].width[ 0 ] }` ]: submit[ 0 ].width && submit[ 0 ].width[ 0 ],
					[ `kb-field-tablet-width-${ submit[ 0 ].width[ 1 ] }` ]: submit[ 0 ].width && submit[ 0 ].width[ 1 ],
					[ `kb-field-mobile-width-${ submit[ 0 ].width[ 2 ] }` ]: submit[ 0 ].width && submit[ 0 ].width[ 2 ],
				} );
				return (
					<div className={ `kadence-form-${ uniqueID } kb-form-wrap${ ( hAlign ? ' kb-form-align-' + hAlign : '' ) }` }>
						<form className="kb-form" action="" method="post">
							{ renderFieldOutput }
							<input type="hidden" name="_kb_form_id" value={ uniqueID } />
							<input type="hidden" name="_kb_form_post_id" value={ postID } />
							<input type="hidden" name="action" value="kb_process_ajax_submit" />
							{ recaptcha && (
								<input type="hidden" name="recaptcha_response" className="kb_recaptcha_response" />
							) }
							{ honeyPot && (
								<input className="kadence-blocks-field verify" type="email" name="_kb_verify_email" autoComplete="off" placeholder="Email" tabIndex="-1" />
							) }
							<div className={ submitClassName }>
								<RichText.Content
									tagName="button"
									value={ ( '' !== submit[ 0 ].label ? submit[ 0 ].label : 'Submit' ) }
									className={ `kb-forms-submit button kb-button-size-${ ( submit[ 0 ].size ? submit[ 0 ].size : 'standard' ) } kb-button-width-${ ( submit[ 0 ].widthType ? submit[ 0 ].widthType : 'auto' ) }` }
								/>
							</div>
						</form>
					</div>
				);
			},
		},
		{
			attributes: {
				uniqueID: {
					type: 'string',
					default: '',
				},
				postID: {
					type: 'number',
					default: '',
				},
				hAlign: {
					type: 'string',
					default: '',
				},
				fields: {
					type: 'array',
					default: [ {
						label: 'Name',
						showLabel: true,
						placeholder: '',
						default: '',
						description: '',
						rows: 4,
						options: [ {
							value: '',
							label: '',
						} ],
						multiSelect: false,
						inline: false,
						showLink: false,
						min: '',
						max: '',
						type: 'text', // text, email, textarea, url, tel, radio, select, check, accept
						required: false,
						width: [ '100', '', '' ],
						auto: '',
					},
					{
						label: 'Email',
						showLabel: true,
						placeholder: '',
						default: '',
						description: '',
						rows: 4,
						options: [ {
							value: '',
							label: '',
						} ],
						multiSelect: false,
						inline: false,
						showLink: false,
						min: '',
						max: '',
						type: 'email', // text, email, textarea, url, tel, radio, select, check, accept
						required: true,
						width: [ '100', '', '' ],
						auto: '',
					},
					{
						label: 'Message',
						showLabel: true,
						placeholder: '',
						default: '',
						description: '',
						rows: 4,
						options: [ {
							value: '',
							label: '',
						} ],
						multiSelect: false,
						inline: false,
						showLink: false,
						min: '',
						max: '',
						type: 'textarea', // text, email, textarea, url, tel, radio, select, check, accept
						required: true,
						width: [ '100', '', '' ],
						auto: '',
					} ],
				},
				messages: {
					type: 'array',
					default: [ {
						success: '',
						error: '',
						required: '',
						invalid: '',
					} ],
				},
				messageFont: {
					type: 'array',
					default: [ {
						colorSuccess: '',
						colorError: '',
						borderSuccess: '',
						borderError: '',
						backgroundSuccess: '',
						backgroundSuccessOpacity: 1,
						backgroundError: '',
						backgroundErrorOpacity: 1,
						borderWidth: [ '', '', '', '' ],
						borderRadius: '',
						size: [ '', '', '' ],
						sizeType: 'px',
						lineHeight: [ '', '', '' ],
						lineType: 'px',
						letterSpacing: '',
						textTransform: '',
						family: '',
						google: '',
						style: '',
						weight: '',
						variant: '',
						subset: '',
						loadGoogle: true,
						padding: [ '', '', '', '' ],
						margin: [ '', '', '', '' ],
					} ],
				},
				style: {
					type: 'array',
					default: [ {
						showRequired: true,
						size: 'standard',
						deskPadding: [ '', '', '', '' ],
						tabletPadding: [ '', '', '', '' ],
						mobilePadding: [ '', '', '', '' ],
						color: '',
						requiredColor: '',
						background: '',
						border: '',
						backgroundOpacity: 1,
						borderOpacity: 1,
						borderRadius: '',
						borderWidth: [ '', '', '', '' ],
						colorActive: '',
						backgroundActive: '',
						borderActive: '',
						backgroundActiveOpacity: 1,
						borderActiveOpacity: 1,
						gradient: [ '#999999', 1, 0, 100, 'linear', 180, 'center center' ],
						gradientActive: [ '#777777', 1, 0, 100, 'linear', 180, 'center center' ],
						backgroundType: 'solid',
						backgroundActiveType: 'solid',
						boxShadow: [ false, '#000000', 0.2, 1, 1, 2, 0, false ],
						boxShadowActive: [ false, '#000000', 0.4, 2, 2, 3, 0, false ],
						fontSize: [ '', '', '' ],
						fontSizeType: 'px',
						lineHeight: [ '', '', '' ],
						lineType: 'px',
						rowGap: '',
						rowGapType: 'px',
						gutter: '',
						gutterType: 'px',
					} ],
				},
				labelFont: {
					type: 'array',
					default: [ {
						color: '',
						size: [ '', '', '' ],
						sizeType: 'px',
						lineHeight: [ '', '', '' ],
						lineType: 'px',
						letterSpacing: '',
						textTransform: '',
						family: '',
						google: '',
						style: '',
						weight: '',
						variant: '',
						subset: '',
						loadGoogle: true,
						padding: [ '', '', '', '' ],
						margin: [ '', '', '', '' ],
					} ],
				},
				submit: {
					type: 'array',
					default: [ {
						label: '',
						width: [ '100', '', '' ],
						size: 'standard',
						widthType: 'auto',
						fixedWidth: [ '', '', '' ],
						align: [ '', '', '' ],
						deskPadding: [ '', '', '', '' ],
						tabletPadding: [ '', '', '', '' ],
						mobilePadding: [ '', '', '', '' ],
						color: '',
						background: '',
						border: '',
						backgroundOpacity: 1,
						borderOpacity: 1,
						borderRadius: '',
						borderWidth: [ '', '', '', '' ],
						colorHover: '',
						backgroundHover: '',
						borderHover: '',
						backgroundHoverOpacity: 1,
						borderHoverOpacity: 1,
						icon: '',
						iconSide: 'right',
						iconHover: false,
						cssClass: '',
						gradient: [ '#999999', 1, 0, 100, 'linear', 180, 'center center' ],
						gradientHover: [ '#777777', 1, 0, 100, 'linear', 180, 'center center' ],
						btnStyle: 'basic',
						btnSize: 'standard',
						backgroundType: 'solid',
						backgroundHoverType: 'solid',
						boxShadow: [ false, '#000000', 0.2, 1, 1, 2, 0, false ],
						boxShadowHover: [ false, '#000000', 0.4, 2, 2, 3, 0, false ],
					} ],
				},
				submitFont: {
					type: 'array',
					default: [ {
						size: [ '', '', '' ],
						sizeType: 'px',
						lineHeight: [ '', '', '' ],
						lineType: 'px',
						letterSpacing: '',
						textTransform: '',
						family: '',
						google: '',
						style: '',
						weight: '',
						variant: '',
						subset: '',
						loadGoogle: true,
					} ],
				},
				actions: {
					type: 'array',
					default: [ 'email' ],
				},
				email: {
					type: 'array',
					default: [ {
						emailTo: '',
						subject: '',
						fromEmail: '',
						fromName: '',
						replyTo: 'email_field',
						cc: '',
						bcc: '',
						html: true,
					} ],
				},
				redirect: {
					type: 'string',
					default: '',
				},
				recaptcha: {
					type: 'bool',
					default: false,
				},
			},
			save: ( { attributes } ) => {
				const { uniqueID, fields, submit, style, postID, hAlign, recaptcha } = attributes;
				const fieldOutput = ( index ) => {
					const fieldClassName = classnames( {
						'kadence-blocks-form-field': true,
						[ `kb-form-field-${ index }` ]: index,
						[ `kb-field-desk-width-${ fields[ index ].width[ 0 ] }` ]: fields[ index ].width && fields[ index ].width[ 0 ],
						[ `kb-field-tablet-width-${ fields[ index ].width[ 1 ] }` ]: fields[ index ].width && fields[ index ].width[ 1 ],
						[ `kb-field-mobile-width-${ fields[ index ].width[ 2 ] }` ]: fields[ index ].width && fields[ index ].width[ 2 ],
						[ `kb-input-size-${ style[ 0 ].size }` ]: style[ 0 ].size,
					} );
					let acceptLabel;
					let acceptLabelBefore;
					let acceptLabelAfter;
					if ( fields[ index ].label && fields[ index ].label.includes( '{privacy_policy}' ) ) {
						acceptLabelBefore = fields[ index ].label.split( '{' )[ 0 ];
						acceptLabelAfter = fields[ index ].label.split( '}' )[ 1 ];
						acceptLabel = (
							<Fragment>
								{ acceptLabelBefore }<a href={ ( undefined !== kadence_blocks_params.privacy_link && '' !== kadence_blocks_params.privacy_link ? kadence_blocks_params.privacy_link : '#' ) } target="blank" rel="noopener noreferrer">{ ( undefined !== kadence_blocks_params.privacy_title && '' !== kadence_blocks_params.privacy_title ? kadence_blocks_params.privacy_title : 'Privacy policy' ) }</a>{ acceptLabelAfter }
							</Fragment>
						);
					} else {
						acceptLabel = fields[ index ].label;
					}
					return (
						<div className={ fieldClassName } >
							{ 'accept' === fields[ index ].type && (
								<Fragment>
									{ fields[ index ].showLink && (
										<a href={ ( undefined !== fields[ index ].default && '' !== fields[ index ].default ? fields[ index ].default : '#' ) } target="_blank" rel="noopener noreferrer" className={ 'kb-accept-link' }>{ ( undefined !== fields[ index ].placeholder && '' !== fields[ index ].placeholder ? fields[ index ].placeholder : 'View Privacy Policy' ) }</a>
									) }
									<input type="checkbox" name={ fieldName } id={ `kb_field_${ index }` } className={ `kb-field kb-checkbox-style kb-${ fields[ index ].type }` } value={ 'accept' } checked={ fields[ index ].inline ? true : false } data-type={ fields[ index ].type } data-required={ ( fields[ index ].required ? 'yes' : undefined ) } />
									<label htmlFor={ `kb_field_${ index }` }>{ ( fields[ index ].label ? acceptLabel : '' ) }{ ( fields[ index ].required && style[ 0 ].showRequired ? <span className="required">*</span> : '' ) }</label>
								</Fragment>
							) }
							{ 'accept' !== fields[ index ].type && (
								<Fragment>
									{ fields[ index ].showLabel && (
										<label htmlFor={ `kb_field_${ index }` }>{ ( fields[ index ].label ? fields[ index ].label : '' ) }{ ( fields[ index ].required && style[ 0 ].showRequired ? <span className="required">*</span> : '' ) }</label>
									) }
									{ 'textarea' === fields[ index ].type && (
										<textarea name={ fieldName } id={ `kb_field_${ index }` } data-label={ fields[ index ].label } type={ fields[ index ].type } placeholder={ fields[ index ].placeholder } value={ fields[ index ].default } data-type={ fields[ index ].type } className={ `kb-field kb-text-style-field kb-${ fields[ index ].type }-field kb-field-${ index }` } rows={ fields[ index ].rows } data-required={ ( fields[ index ].required ? 'yes' : undefined ) } />
									) }
									{ 'select' === fields[ index ].type && (
										<select name={ ( fields[ index ].multiSelect ? `kb_field_${ index }[]` : `kb_field_${ index }` ) } id={ `kb_field_${ index }` } multiple={ ( fields[ index ].multiSelect ? true : false ) } data-label={ fields[ index ].label } type={ fields[ index ].type } value={ fields[ index ].default } data-type={ fields[ index ].type } className={ `kb-field kb-select-style-field kb-${ fields[ index ].type }-field kb-field-${ index }` } data-required={ ( fields[ index ].required ? 'yes' : undefined ) }>
											{ times( fields[ index ].options.length, n => (
												<option
													key={ n }
													selected={ ( undefined !== fields[ index ].options[ n ].value && fields[ index ].options[ n ].value === fields[ index ].default ? true : false ) }
													value={ ( undefined !== fields[ index ].options[ n ].value ? fields[ index ].options[ n ].value : '' ) }
												>{ ( undefined !== fields[ index ].options[ n ].label ? fields[ index ].options[ n ].label : '' ) }</option>
											) ) }
										</select>
									) }
									{ 'textarea' !== fields[ index ].type && 'select' !== fields[ index ].type && (
										<input name={ fieldName } id={ `kb_field_${ index }` } data-label={ fields[ index ].label } type={ fields[ index ].type } placeholder={ fields[ index ].placeholder } value={ fields[ index ].default } data-type={ fields[ index ].type } className={ `kb-field kb-text-style-field kb-${ fields[ index ].type }-field kb-field-${ index }` } autoComplete={ ( '' !== fields[ index ].auto ? fields[ index ].auto : undefined ) } data-required={ ( fields[ index ].required ? 'yes' : undefined ) } />
									) }
								</Fragment>
							) }
							{ undefined !== fields[ index ].description && '' !== fields[ index ].description && (
								<span className={ 'kb-field-help' }>{ ( fields[ index ].description ? fields[ index ].description : '' ) }</span>
							) }
						</div>
					);
				};
				const renderFieldOutput = (
					<Fragment>
						{ times( fields.length, n => fieldOutput( n ) ) }
					</Fragment>
				);
				const submitClassName = classnames( {
					'kadence-blocks-form-field': true,
					'kb-submit-field': true,
					[ `kb-field-desk-width-${ submit[ 0 ].width[ 0 ] }` ]: submit[ 0 ].width && submit[ 0 ].width[ 0 ],
					[ `kb-field-tablet-width-${ submit[ 0 ].width[ 1 ] }` ]: submit[ 0 ].width && submit[ 0 ].width[ 1 ],
					[ `kb-field-mobile-width-${ submit[ 0 ].width[ 2 ] }` ]: submit[ 0 ].width && submit[ 0 ].width[ 2 ],
				} );
				return (
					<div className={ `kadence-form-${ uniqueID } kb-form-wrap${ ( hAlign ? ' kb-form-align-' + hAlign : '' ) }` }>
						<form className="kb-form" action="" method="post">
							{ renderFieldOutput }
							<input type="hidden" name="_kb_form_id" value={ uniqueID } />
							<input type="hidden" name="_kb_form_post_id" value={ postID } />
							<input type="hidden" name="action" value="kb_process_ajax_submit" />
							{ recaptcha && (
								<input type="hidden" name="recaptcha_response" id="kb_recaptcha_response" />
							) }
							<input className="kadence-blocks-field verify" type="email" name="_kb_verify_email" autoComplete="off" placeholder="Email" tabIndex="-1" />
							<div className={ submitClassName }>
								<RichText.Content
									tagName="button"
									value={ ( '' !== submit[ 0 ].label ? submit[ 0 ].label : 'Submit' ) }
									className={ `kb-forms-submit button kb-button-size-${ ( submit[ 0 ].size ? submit[ 0 ].size : 'standard' ) } kb-button-width-${ ( submit[ 0 ].widthType ? submit[ 0 ].widthType : 'auto' ) }` }
								/>
							</div>
						</form>
					</div>
				);
			},
		},
	],
} );
