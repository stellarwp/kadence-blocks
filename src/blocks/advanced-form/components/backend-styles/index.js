import { GetHelpStyles, GetInputStyles, GetLabelStyles } from '../';
import { getPreviewSize } from '@kadence/helpers';

export default function BackendStyles( { uniqueID, previewDevice, fieldStyle, labelStyle, helpStyle, inputFont, useFormMeta } ) {

	const fieldStyles = GetInputStyles( previewDevice, fieldStyle, inputFont, useFormMeta );
	const labelStyles = GetLabelStyles( previewDevice, labelStyle );
	const helpStyles = GetHelpStyles( previewDevice, helpStyle );

	const previewRowGap = getPreviewSize( previewDevice, ( undefined !== fieldStyle?.rowGap && '' !== fieldStyle?.rowGap ? fieldStyle?.rowGap + 'px' : '' ), ( undefined !== fieldStyle?.tabletRowGap && '' !== fieldStyle?.tabletRowGap ? fieldStyle?.tabletRowGap + 'px' : '' ), ( undefined !== fieldStyle?.mobileRowGap && '' !== fieldStyle?.mobileRowGap ? fieldStyle?.mobileRowGap + 'px' : '' ) );

	const fieldCss = (
		<style>
			{`

			.wp-block-kadence-advanced-form${uniqueID} .kb-adv-form-field {
				margin-bottom: ${( previewRowGap ? previewRowGap : undefined )};
			}

			.wp-block-kadence-advanced-form${uniqueID} input:not(.ignore-field-styles),
			.wp-block-kadence-advanced-form${uniqueID} select:not(.ignore-field-styles),
			.wp-block-kadence-advanced-form${uniqueID} textarea {

				${ fieldStyles.fontSize ? 'font-size:' + fieldStyles.fontSize + ';' : ''}
				${ fieldStyles.lineHeight ? 'line-height:' + fieldStyles.lineHeight + ';' : '' }
				${ fieldStyles.fieldFont?.letterSpacing ? 'letter-spacing:' + fieldStyles.fieldFont.letterSpacing + 'px;' : '' }
				${ fieldStyles.fieldFont?.textTransform ? 'text-transform:' + fieldStyles.fieldFont.textTransform + ';' : '' }
				${ fieldStyles.fieldFont?.family ? 'font-family:' + fieldStyles.fieldFont.family + ';' : '' }
				${ fieldStyles.fieldFont?.style ? 'font-style:' + fieldStyles.fieldFont.style + ';' : '' }
				${ fieldStyles.fieldFont?.weight ? 'font-weight:' + fieldStyles.fieldFont.weight + ';' : '' }

				${ fieldStyles.paddingTop ? 'padding-top:' + fieldStyles.paddingTop + ';' : '' }
				${ fieldStyles.paddingRight ? 'padding-right:' + fieldStyles.paddingRight + ';' : '' }
				${ fieldStyles.paddingBottom ? 'padding-bottom:' + fieldStyles.paddingBottom + ';' : '' }
				${ fieldStyles.paddingLeft ? 'padding-left:' + fieldStyles.paddingLeft + ';' : '' }

				background: ${fieldStyles.background};

				border-top-left-radius: ${fieldStyles.borderRadiusTop}${fieldStyles.borderRadiusUnit};
				border-top-right-radius: ${fieldStyles.borderRadiusRight}${fieldStyles.borderRadiusUnit};
				border-bottom-right-radius: ${fieldStyles.borderRadiusBottom}${fieldStyles.borderRadiusUnit};
				border-bottom-left-radius: ${fieldStyles.borderRadiusLeft}${fieldStyles.borderRadiusUnit};

				border-top: ${fieldStyles.borderTop};
				border-right: ${fieldStyles.borderRight};
				border-bottom: ${fieldStyles.borderBottom};
				border-left: ${fieldStyles.borderLeft};

				border-top-color: ${fieldStyles.borderTopColor};
				border-right-color: ${fieldStyles.borderRightColor};
				border-bottom-color: ${fieldStyles.borderBottomColor};
				border-left-color: ${fieldStyles.borderLeftColor};

				color: ${fieldStyles.color};
				box-shadow: ${fieldStyles.boxShadow};
		}

		.wp-block-kadence-advanced-form${uniqueID} input:not(.ignore-field-styles):focus,
		.wp-block-kadence-advanced-form${uniqueID} select:not(.ignore-field-styles):focus,
		.wp-block-kadence-advanced-form${uniqueID} textarea:focus {
				background: ${fieldStyles.backgroundActive};
		}

		.wp-block-kadence-advanced-form${uniqueID} input::placeholder,
		.wp-block-kadence-advanced-form${uniqueID} select::placeholder,
		.wp-block-kadence-advanced-form${uniqueID} textarea::placeholder {
			color: ${fieldStyles.placeholderColor};
		}

		.wp-block-kadence-advanced-form${uniqueID} input[type="radio"]{
			border-color: ${fieldStyles.borderColor};
		}

		.wp-block-kadence-advanced-form${uniqueID} input[type="file"]{
			display: block
		}

		.wp-block-kadence-advanced-form${uniqueID} input[type="checkbox"]{
			border-color: ${fieldStyles.borderColor};
		}

		`}

		</style>
	);

	const labelCss = (
		<style>
			{`

			.wp-block-kadence-advanced-form${uniqueID} .kb-advanced-form-label {
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

			.wp-block-kadence-advanced-form${uniqueID} .kadence-label .required {
				color: ${fieldStyle?.requiredColor};
			}

			`}
		</style>
	);

	const helpCss = (
		<style>
			{`

			.wp-block-kadence-advanced-form${uniqueID} .kb-adv-form-help {
				${helpStyles.fontSize ? 'font-size: ' + helpStyles.fontSize + ';' : ''}
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

	return (
		<>
			{fieldCss}
			{labelCss}
			{helpCss}
		</>
	);

}
