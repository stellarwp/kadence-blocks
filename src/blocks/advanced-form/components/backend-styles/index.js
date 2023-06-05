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
				${ previewRowGap ? 'margin-bottom:' + previewRowGap + ';' : '' }
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

				${ fieldStyles.background ? 'background: ' + fieldStyles.background + ';' : '' }

				${ fieldStyles.borderRadiusTop ? 'border-top-left-radius: ' + fieldStyles.borderRadiusTop + fieldStyles.borderRadiusUnit + ';' : '' }
				${ fieldStyles.borderRadiusRight ? 'border-top-right-radius: ' + fieldStyles.borderRadiusRight + fieldStyles.borderRadiusUnit + ';' : '' }
				${ fieldStyles.borderRadiusBottom ? 'border-bottom-right-radius: ' + fieldStyles.borderRadiusBottom + fieldStyles.borderRadiusUnit + ';' : '' }
				${ fieldStyles.borderRadiusLeft ? 'border-bottom-left-radius: ' + fieldStyles.borderRadiusLeft + fieldStyles.borderRadiusUnit + ';' : '' }

				${ fieldStyles.borderTop ? 'border-top: ' + fieldStyles.borderTop + ';' : '' }
				${ fieldStyles.borderRight ? 'border-right: ' + fieldStyles.borderRight + ';' : '' }
				${ fieldStyles.borderBottom ? 'border-bottom: ' + fieldStyles.borderBottom + ';' : '' }
				${ fieldStyles.borderLeft ? 'border-left: ' + fieldStyles.borderLeft + ';' : '' }

				${ fieldStyles.borderTopColor ? 'border-top-color: ' + fieldStyles.borderTopColor + ';' : '' }
				${ fieldStyles.borderRightColor ? 'border-right-color: ' + fieldStyles.borderRightColor + ';' : '' }
				${ fieldStyles.borderBottomColor ? 'border-bottom-color: ' + fieldStyles.borderBottomColor + ';' : '' }
				${ fieldStyles.borderLeftColor ? 'border-left-color: ' + fieldStyles.borderLeftColor + ';' : '' }

				${ fieldStyles.color ? 'color:' + fieldStyles.color + ';' : '' }
				${ fieldStyles.boxShadow ? 'box-shadow: ' + fieldStyles.boxShadow + ';' : '' }
		}

		.wp-block-kadence-advanced-form${uniqueID} input:not(.ignore-field-styles):focus,
		.wp-block-kadence-advanced-form${uniqueID} select:not(.ignore-field-styles):focus,
		.wp-block-kadence-advanced-form${uniqueID} textarea:focus {
			${ fieldStyles.backgroundActive ? 'background: ' + fieldStyles.backgroundActive + ';' : '' }
		}

		.wp-block-kadence-advanced-form${uniqueID} input::placeholder,
		.wp-block-kadence-advanced-form${uniqueID} select::placeholder,
		.wp-block-kadence-advanced-form${uniqueID} textarea::placeholder {
			${ fieldStyles.placeholderColor ? 'color: ' + fieldStyles.placeholderColor + ';' : '' }
		}

		.wp-block-kadence-advanced-form${uniqueID} input[type="radio"]{
			${ fieldStyles.borderColor ? 'border-color:' + fieldStyles.borderColor + ';' : '' }
		}

		.wp-block-kadence-advanced-form${uniqueID} input[type="file"]{
			display: block
		}

		.wp-block-kadence-advanced-form${uniqueID} input[type="checkbox"]{
			${ fieldStyles.borderColor ? 'border-color:' + fieldStyles.borderColor + ';' : '' }
		}

		`}

		</style>
	);

	const labelCss = (
		<style>
			{`

			.wp-block-kadence-advanced-form${uniqueID} .kb-adv-form-label {
				${labelStyles.fontStyle ? 'font-style:' + labelStyles.fontStyle + ';' : '' }
				${labelStyles.lineHeight ? 'line-height:' + labelStyles.lineHeight + ';' : '' }
				${labelStyles.fontWeight ? 'font-weight:' + labelStyles.fontWeight + ';' : '' }
				${labelStyles.letterSpacing ? 'letter-spacing:' + labelStyles.letterSpacing + 'px;' : '' }
				${labelStyles.textTransform ? 'text-transform:' + labelStyles.textTransform + ';' : '' }
				${labelStyles.fontFamily ? 'font-family:' + labelStyles.fontFamily + ';' : '' }

				${labelStyles.color ? 'color:' + labelStyles.color + ';' : '' }

				${labelStyles.paddingTop ? 'padding-top:' + labelStyles.paddingTop + ';' : '' }
				${labelStyles.paddingRight ? 'padding-right:' + labelStyles.paddingRight + ';' : '' }
				${labelStyles.paddingBottom ? 'padding-bottom:' + labelStyles.paddingBottom + ';' : '' }
				${labelStyles.paddingLeft ? 'padding-left:' + labelStyles.paddingLeft + ';' : '' }

				${labelStyles.marginTop ? 'margin-top:' + labelStyles.marginTop + ';' : '' }
				${labelStyles.marginRight ? 'margin-right:' + labelStyles.marginRight + ';' : '' }
				${labelStyles.marginBottom ? 'margin-bottom:' + labelStyles.marginBottom + ';' : '' }
				${labelStyles.marginLeft ? 'margin-left:' + labelStyles.marginLeft + ';' : '' }
			}

			.wp-block-kadence-advanced-form${uniqueID} .kadence-label .required {;
				${fieldStyle?.requiredColor ? 'color:' + fieldStyle.requiredColor + ';' : '' }
			}

			`}
		</style>
	);

	const helpCss = (
		<style>
			{`

			.wp-block-kadence-advanced-form${uniqueID} .kb-adv-form-help {
				${helpStyles.fontSize ? 'font-size: ' + helpStyles.fontSize + ';' : ''}
				${helpStyles.lineHeight ? 'line-height: ' + helpStyles.lineHeight + ';' : ''}
				${helpStyles.fontWeight ? 'font-weight: ' + helpStyles.fontWeight + ';' : ''}

				${helpStyles.textTransform ? 'text-transform: ' + helpStyles.textTransform + ';' : ''}
				${helpStyles.fontFamily ? 'font-family: ' + helpStyles.fontFamily + ';' : ''}
				${helpStyles.fontStyle ? 'font-style: ' + helpStyles.fontStyle + ';' : ''}
				${helpStyles.letterSpacing ? 'letter-spacing: ' + helpStyles.letterSpacing + ';' : ''}

				${helpStyles.paddingTop ? 'padding-top: ' + helpStyles.paddingTop + ';' : ''}
				${helpStyles.paddingRight ? 'padding-right: ' + helpStyles.paddingRight + ';' : ''}
				${helpStyles.paddingBottom ? 'padding-bottom: ' + helpStyles.paddingBottom + ';' : ''}
				${helpStyles.paddingLeft ? 'padding-left: ' + helpStyles.paddingLeft + ';' : ''}

				${helpStyles.marginTop ? 'margin-top: ' + helpStyles.marginTop + ';' : ''}
				${helpStyles.marginRight ? 'margin-right: ' + helpStyles.marginRight + ';' : ''}
				${helpStyles.marginBottom ? 'margin-bottom: ' + helpStyles.marginBottom + ';' : ''}
				${helpStyles.marginLeft ? 'margin-left: ' + helpStyles.marginLeft + ';' : ''}

				${helpStyles.color ? 'color: ' + helpStyles.color + ';' : ''}
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
