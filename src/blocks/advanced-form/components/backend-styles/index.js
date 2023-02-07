import { GetHelpStyles, GetInputStyles, GetLabelStyles } from '../';
import { getPreviewSize } from '@kadence/helpers';

export default function BackendStyles( { id, previewDevice, fieldStyle, labelStyle, helpStyle } ) {

	const previewStyles = GetInputStyles( previewDevice, fieldStyle );
	const labelStyles = GetLabelStyles( previewDevice, labelStyle );
	const helpStyles = GetHelpStyles( previewDevice, helpStyle );

	const previewRowGap = getPreviewSize( previewDevice, ( undefined !== fieldStyle.rowGap && '' !== fieldStyle.rowGap ? fieldStyle.rowGap + 'px' : '' ), ( undefined !== fieldStyle.tabletRowGap && '' !== fieldStyle.tabletRowGap ? fieldStyle.tabletRowGap + 'px' : '' ), ( undefined !== fieldStyle.mobileRowGap && '' !== fieldStyle.mobileRowGap ? fieldStyle.mobileRowGap + 'px' : '' ) );

	const fieldCss = (
		<style>
			{`

			.wp-block-kadence-advanced-form_${id} .kb-adv-form-field {
				margin-bottom: ${( previewRowGap ? previewRowGap : undefined )};
			}

			.wp-block-kadence-advanced-form_${id} input:not(.ignore-field-styles),
			.wp-block-kadence-advanced-form_${id} select:not(.ignore-field-styles),
			.wp-block-kadence-advanced-form_${id} textarea {
				line-height: ${previewStyles.lineHeight};
				font-size: ${previewStyles.fontSize};
				padding-top: ${previewStyles.paddingTop};
				padding-right: ${previewStyles.paddingRight};
				padding-bottom: ${previewStyles.paddingBottom};
				padding-left: ${previewStyles.paddingLeft};
				background: ${previewStyles.background};

				border-radius: ${previewStyles.borderRadius};
				border-top-width: ${previewStyles.borderTopWidth};
				border-right-width: ${previewStyles.borderRightWidth};
				border-bottom-width: ${previewStyles.borderBottomWidth};
				border-left-width: ${previewStyles.borderLeftWidth};
				border-color: ${previewStyles.borderColor};

				color: ${previewStyles.color};
				box-shadow: ${previewStyles.boxShadow};
		}
		
		.wp-block-kadence-advanced-form_${id} input::placeholder,
		.wp-block-kadence-advanced-form_${id} select::placeholder,
		.wp-block-kadence-advanced-form_${id} textarea::placeholder {
			color: ${previewStyles.placeholderColor};
		}

		.wp-block-kadence-advanced-form_${id} input[type="radio"]{
			border-color: ${previewStyles.borderColor};
		}

		.wp-block-kadence-advanced-form_${id} input[type="file"]{
			display: block
		}

		.wp-block-kadence-advanced-form_${id} input[type="checkbox"]{
			border-color: ${previewStyles.borderColor};
		}

		`}

		</style>
	);

	const labelCss = (
		<style>
			{`

			.wp-block-kadence-advanced-form_${id} .kb-advanced-form-label{
				font-size: ${labelStyles.fontSize};
				line-height: ${labelStyles.lineHeight};
				font-weight: ${labelStyles.fontWeight};

				text-transform: ${labelStyles.textTransform};
				font-family: ${labelStyles.fontFamily};
				font-style: ${labelStyles.fontStyle};
				letter-spacing: ${labelStyles.letterSpacing};


				padding-top: ${labelStyles.paddingTop};
				padding-right: ${labelStyles.paddingRight};
				padding-bottom: ${labelStyles.paddingBottom};
				padding-left: ${labelStyles.paddingLeft};

				margin-top: ${labelStyles.marginTop};
				margin-right: ${labelStyles.marginRight};
				margin-bottom: ${labelStyles.marginBottom};
				margin-left: ${labelStyles.marginLeft};

				color: ${labelStyles.color};

			}

			.wp-block-kadence-advanced-form_${id} .kadence-label .required {
				color: ${fieldStyle.requiredColor};
			}

			`}
		</style>
	);

	const helpCss = (
		<style>
			{`

			.wp-block-kadence-advanced-form_${id} .kb-adv-form-help {
				font-size: ${helpStyles.fontSize};
				line-height: ${helpStyles.lineHeight};
				font-weight: ${helpStyles.fontWeight};

				text-transform: ${helpStyles.textTransform};
				font-family: ${helpStyles.fontFamily};
				font-style: ${helpStyles.fontStyle};
				letter-spacing: ${helpStyles.letterSpacing};


				padding-top: ${helpStyles.paddingTop};
				padding-right: ${helpStyles.paddingRight};
				padding-bottom: ${helpStyles.paddingBottom};
				padding-left: ${helpStyles.paddingLeft};

				margin-top: ${helpStyles.marginTop};
				margin-right: ${helpStyles.marginRight};
				margin-bottom: ${helpStyles.marginBottom};
				margin-left: ${helpStyles.marginLeft};

				color: ${helpStyles.color};
			}

			`}
		</style>
	);

	const submitCss = (
		<style>
			{`

			.wp-block-kadence-advanced-form_${id} .kb-advanced-form-submit {

			}

			`}
		</style>
	);

	return (
		<>
			{fieldCss}
			{labelCss}
			{helpCss}
			{submitCss}
		</>
	);

}
