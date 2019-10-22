/**
 * BLOCK: Kadence Form Block
 *
 * Registering a basic block with Gutenberg.
 */

import GenIcon from '../../genicon';
import Ico from '../../svgicons';
import FaIco from '../../faicons';
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
import './style.scss';
import './editor.scss';
const {
	Fragment,
} = wp.element;
const {
	RichText,
} = wp.blockEditor;
/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
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
	title: __( 'Form' ),
	icon: {
		src: icons.formBlock,
	},
	category: 'kadence-blocks',
	keywords: [
		__( 'Contact' ),
		__( 'Marketing' ),
		__( 'KT' ),
	],
	supports: {
		anchor: true,
		align: [ 'wide', 'full' ],
		ktanimate: true,
		ktanimateadd: true,
		ktanimatepreview: true,
		ktanimateswipe: true,
	},
	attributes: {
		uniqueID: {
			type: 'string',
			default: '',
		},
		postID: {
			type: 'number',
			default: '',
		},
		formName: {
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
				rows: 4,
				options: [],
				multiSelect: false,
				inline: false,
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
				rows: 4,
				options: [],
				multiSelect: false,
				inline: false,
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
				rows: 4,
				options: [],
				multiSelect: false,
				inline: false,
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
				backgroundError: '',
				borderWidth: [ '', '', '', '' ],
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
			} ],
		},
		submit: {
			type: 'array',
			default: [ {
				label: '',
				width: [ '100', '', '' ],
				size: [ '', '', '' ],
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
				borderWidth: '',
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
		autoEmail: {
			type: 'array',
			default: [ {
				emailTo: '',
				subject: '',
				message: '',
				fromEmail: '',
				fromName: '',
				replyTo: '',
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
	edit,

	save: props => {
		const { attributes: { uniqueID, fields, submit, postID, recaptcha } } = props;
		const fieldOutput = ( index ) => {
			return (
				<div className={ 'kadence-blocks-form-field' } >
					{ fields[ index ].showLabel && (
						<label htmlFor={ `kb_field_${ index }` }>{ ( fields[ index ].label ? fields[ index ].label : '' ) } { ( fields[ index ].required ? <span className="required">*</span> : '' ) }</label>
					) }
					{ 'textarea' === fields[ index ].type && (
						<textarea name={ `kb_field_${ index }` } id={ `kb_field_${ index }` } data-label={ fields[ index ].label } type={ fields[ index ].type } placeholder={ fields[ index ].placeholder } value={ fields[ index ].default } data-type={ fields[ index ].type } className={ `kb-field kb-${ fields[ index ].type }-field kb-field-${ index }` } rows={ fields[ index ].rows } data-required={ ( fields[ index ].required ? 'yes' : undefined ) } />
					) }
					{ 'textarea' !== fields[ index ].type && (
						<input name={ `kb_field_${ index }` } id={ `kb_field_${ index }` } data-label={ fields[ index ].label } type={ fields[ index ].type } placeholder={ fields[ index ].placeholder } value={ fields[ index ].default } data-type={ fields[ index ].type } className={ `kb-field kb-${ fields[ index ].type }-field kb-field-${ index }` } autoComplete={ ( '' !== fields[ index ].auto ? fields[ index ].auto : undefined ) } data-required={ ( fields[ index ].required ? 'yes' : undefined ) } />
					) }
				</div>
			);
		};
		const renderFieldOutput = (
			<Fragment>
				{ times( fields.length, n => fieldOutput( n ) ) }
			</Fragment>
		);
		return (
			<div id={ `animate-id${ uniqueID }` } className={ `kadence-form-${ uniqueID } kb-form-wrap` }>
				<form className="kb-form" action="" method="post">
					{ renderFieldOutput }
					<input type="hidden" name="_kb_form_id" value={ uniqueID } />
					<input type="hidden" name="_kb_form_post_id" value={ postID } />
					<input type="hidden" name="action" value="kb_process_ajax_submit" />
					{ recaptcha && (
						 <input type="hidden" name="recaptcha_response" id="kb_recaptcha_response" />
					) }
					<input className="kadence-blocks-field verify" type="email" name="_kb_verify_email" autoComplete="off" placeholder="Email" tabIndex="-1" />
					<div className="kadence-blocks-form-field kb-submit-field" >
						<RichText.Content
							tagName="button"
							value={ ( '' !== submit[ 0 ].label ? submit[ 0 ].label : 'Submit' ) }
							className={ 'kb-forms-submit' }
						/>
					</div>
				</form>
			</div>
		);
	},
} );
