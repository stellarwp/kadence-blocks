import { GetHelpStyles, GetInputStyles, GetLabelStyles, GetRadioLabelStyles } from '../';
import { getPreviewSize, KadenceColorOutput } from '@kadence/helpers';

export default function BackendStyles({
	uniqueID,
	previewDevice,
	fieldStyle,
	labelStyle,
	helpStyle,
	inputFont,
	radioLabelFont,
	useFormMeta,
}) {
	const fieldStyles = GetInputStyles(previewDevice, fieldStyle, inputFont, useFormMeta);
	const labelStyles = GetLabelStyles(previewDevice, labelStyle);
	const helpStyles = GetHelpStyles(previewDevice, helpStyle);
	const radioLabelStyles = GetRadioLabelStyles(previewDevice, radioLabelFont);

	const fieldCss = (
		<style>
			{`

			.wp-block-kadence-advanced-form${uniqueID} .kb-advanced-form {
				${fieldStyles?.previewRowGap ? 'gap:' + fieldStyles?.previewRowGap + ';' : ''}
				${fieldStyles?.background ? '--kb-form-background-color: ' + fieldStyles.background + ';' : ''}
				${fieldStyles?.color ? '--kb-form-text-color:' + fieldStyles.color + ';' : ''}
				${fieldStyles?.borderTopColor ? '--kb-form-border-color: ' + fieldStyles.borderTopColor + ';' : ''}
				${fieldStyles?.borderTopWidth ? '--kb-form-border-width: ' + fieldStyles.borderTopWidth + ';' : ''}
			}
			.wp-block-kadence-advanced-form${uniqueID} .kb-advanced-form .kb-adv-form-field input[type="text"]:not(.ignore-field-styles),
			.wp-block-kadence-advanced-form${uniqueID} .kb-advanced-form .kb-adv-form-field input[type="email"],
			.wp-block-kadence-advanced-form${uniqueID} .kb-advanced-form .kb-adv-form-field input[type="url"],
			.wp-block-kadence-advanced-form${uniqueID} .kb-advanced-form .kb-adv-form-field input[type="password"],
			.wp-block-kadence-advanced-form${uniqueID} .kb-advanced-form .kb-adv-form-field input[type="search"],
			.wp-block-kadence-advanced-form${uniqueID} .kb-advanced-form .kb-adv-form-field input[type="number"],
			.wp-block-kadence-advanced-form${uniqueID} .kb-advanced-form .kb-adv-form-field input[type="tel"],
			.wp-block-kadence-advanced-form${uniqueID} .kb-advanced-form .kb-adv-form-field input[type="range"],
			.wp-block-kadence-advanced-form${uniqueID} .kb-advanced-form .kb-adv-form-field input[type="date"],
			.wp-block-kadence-advanced-form${uniqueID} .kb-advanced-form .kb-adv-form-field input[type="month"],
			.wp-block-kadence-advanced-form${uniqueID} .kb-advanced-form .kb-adv-form-field input[type="week"],
			.wp-block-kadence-advanced-form${uniqueID} .kb-advanced-form .kb-adv-form-field input[type="time"],
			.wp-block-kadence-advanced-form${uniqueID} .kb-advanced-form .kb-adv-form-field input[type="datetime"],
			.wp-block-kadence-advanced-form${uniqueID} .kb-advanced-form .kb-adv-form-field input[type="datetime-local"],
			.wp-block-kadence-advanced-form${uniqueID} .kb-advanced-form .kb-adv-form-field input[type="color"],
			.wp-block-kadence-advanced-form${uniqueID} .kb-advanced-form .kb-adv-form-field input[type="file"],
			.wp-block-kadence-advanced-form${uniqueID} .kb-advanced-form .kb-adv-form-field select,
			.wp-block-kadence-advanced-form${uniqueID} .kb-advanced-form .kb-adv-form-field textarea {
				${fieldStyles?.fontSize ? 'font-size:' + fieldStyles.fontSize + ';' : ''}
				${fieldStyles?.lineHeight ? 'line-height:' + fieldStyles.lineHeight + ';' : ''}
				${fieldStyles?.letterSpacing ? 'letter-spacing:' + fieldStyles.letterSpacing + ';' : ''}
				${fieldStyles?.fieldFont?.textTransform ? 'text-transform:' + fieldStyles.fieldFont.textTransform + ';' : ''}
				${fieldStyles?.fieldFont?.family ? 'font-family:' + fieldStyles.fieldFont.family + ';' : ''}
				${fieldStyles?.fieldFont?.style ? 'font-style:' + fieldStyles.fieldFont.style + ';' : ''}
				${fieldStyles?.fieldFont?.weight ? 'font-weight:' + fieldStyles.fieldFont.weight + ';' : ''}

				${fieldStyles?.paddingTop ? 'padding-top:' + fieldStyles.paddingTop + ';' : ''}
				${fieldStyles?.paddingRight ? 'padding-right:' + fieldStyles.paddingRight + ';' : ''}
				${fieldStyles?.paddingBottom ? 'padding-bottom:' + fieldStyles.paddingBottom + ';' : ''}
				${fieldStyles?.paddingLeft ? 'padding-left:' + fieldStyles.paddingLeft + ';' : ''}

				${fieldStyles?.borderRadiusTop ? 'border-top-left-radius: ' + fieldStyles.borderRadiusTop + ';' : ''}
				${fieldStyles?.borderRadiusRight ? 'border-top-right-radius: ' + fieldStyles.borderRadiusRight + ';' : ''}
				${fieldStyles?.borderRadiusBottom ? 'border-bottom-right-radius: ' + fieldStyles.borderRadiusBottom + ';' : ''}
				${fieldStyles?.borderRadiusLeft ? 'border-bottom-left-radius: ' + fieldStyles.borderRadiusLeft + ';' : ''}

				${fieldStyles?.borderTop ? 'border-top: ' + fieldStyles.borderTop + ';' : ''}
				${fieldStyles?.borderRight ? 'border-right: ' + fieldStyles.borderRight + ';' : ''}
				${fieldStyles?.borderBottom ? 'border-bottom: ' + fieldStyles.borderBottom + ';' : ''}
				${fieldStyles?.borderLeft ? 'border-left: ' + fieldStyles.borderLeft + ';' : ''}

				${fieldStyles?.borderTopColor ? 'border-top-color: ' + fieldStyles.borderTopColor + ';' : ''}
				${fieldStyles?.borderRightColor ? 'border-right-color: ' + fieldStyles.borderRightColor + ';' : ''}
				${fieldStyles?.borderBottomColor ? 'border-bottom-color: ' + fieldStyles.borderBottomColor + ';' : ''}
				${fieldStyles?.borderLeftColor ? 'border-left-color: ' + fieldStyles.borderLeftColor + ';' : ''}

				${fieldStyles?.boxShadow ? 'box-shadow: ' + fieldStyles.boxShadow + ';' : ''}
		}
		.wp-block-kadence-advanced-form${uniqueID} .kb-advanced-form .kb-adv-form-field input[type="text"]:not(.ignore-field-styles):focus,
		.wp-block-kadence-advanced-form${uniqueID} .kb-advanced-form .kb-adv-form-field input[type="email"]:focus,
		.wp-block-kadence-advanced-form${uniqueID} .kb-advanced-form .kb-adv-form-field input[type="url"]:focus,
		.wp-block-kadence-advanced-form${uniqueID} .kb-advanced-form .kb-adv-form-field input[type="password"]:focus,
		.wp-block-kadence-advanced-form${uniqueID} .kb-advanced-form .kb-adv-form-field input[type="search"]:focus,
		.wp-block-kadence-advanced-form${uniqueID} .kb-advanced-form .kb-adv-form-field input[type="number"]:focus,
		.wp-block-kadence-advanced-form${uniqueID} .kb-advanced-form .kb-adv-form-field input[type="tel"]:focus,
		.wp-block-kadence-advanced-form${uniqueID} .kb-advanced-form .kb-adv-form-field input[type="range"]:focus,
		.wp-block-kadence-advanced-form${uniqueID} .kb-advanced-form .kb-adv-form-field input[type="date"]:focus,
		.wp-block-kadence-advanced-form${uniqueID} .kb-advanced-form .kb-adv-form-field input[type="month"]:focus,
		.wp-block-kadence-advanced-form${uniqueID} .kb-advanced-form .kb-adv-form-field input[type="week"]:focus,
		.wp-block-kadence-advanced-form${uniqueID} .kb-advanced-form .kb-adv-form-field input[type="time"]:focus,
		.wp-block-kadence-advanced-form${uniqueID} .kb-advanced-form .kb-adv-form-field input[type="datetime"]:focus,
		.wp-block-kadence-advanced-form${uniqueID} .kb-advanced-form .kb-adv-form-field input[type="datetime-local"]:focus,
		.wp-block-kadence-advanced-form${uniqueID} .kb-advanced-form .kb-adv-form-field input[type="color"]:focus,
		.wp-block-kadence-advanced-form${uniqueID} .kb-advanced-form .kb-adv-form-field input[type="file"]:focus,
		.wp-block-kadence-advanced-form${uniqueID} .kb-advanced-form .kb-adv-form-field select:focus,
		.wp-block-kadence-advanced-form${uniqueID} .kb-advanced-form .kb-adv-form-field textarea:focus {
			${fieldStyles?.borderActive ? 'border-color: ' + fieldStyles.borderActive + ';' : ''}
		}
		.wp-block-kadence-advanced-form${uniqueID} .kb-advanced-form .kb-adv-form-field input:not(.ignore-field-styles):focus,
		.wp-block-kadence-advanced-form${uniqueID} .kb-advanced-form .kb-adv-form-field select:not(.ignore-field-styles):focus,
		.wp-block-kadence-advanced-form${uniqueID} .kb-advanced-form .kb-adv-form-field textarea:focus {
			${fieldStyles?.backgroundActive ? 'background: ' + fieldStyles.backgroundActive + ';' : ''}
		}
		.wp-block-kadence-advanced-form${uniqueID} .kb-advanced-form .kb-adv-form-field input::placeholder,
		.wp-block-kadence-advanced-form${uniqueID} .kb-advanced-form .kb-adv-form-field select::placeholder,
		.wp-block-kadence-advanced-form${uniqueID} .kb-advanced-form .kb-adv-form-field textarea::placeholder {
			${fieldStyles?.placeholderColor ? 'color: ' + fieldStyles.placeholderColor + ';' : ''}
		}
		.wp-block-kadence-advanced-form${uniqueID} .kb-advanced-form .kb-adv-form-field input[type="radio"]{
			${fieldStyles?.borderColor ? 'border-color:' + fieldStyles.borderColor + ';' : ''}
		}
		.wp-block-kadence-advanced-form${uniqueID} .kb-advanced-form .kb-adv-form-field input[type="checkbox"]{
			${fieldStyles?.borderColor ? 'border-color:' + fieldStyles.borderColor + ';' : ''}
		}
		`}
		</style>
	);

	const labelCss = (
		<style>
			{`

			.wp-block-kadence-advanced-form${uniqueID} .kb-advanced-form .kb-adv-form-label {
				${labelStyles?.fontStyle ? 'font-style:' + labelStyles.fontStyle + ';' : ''}
				${labelStyles?.lineHeight ? 'line-height:' + labelStyles.lineHeight + ';' : ''}
				${labelStyles?.fontWeight ? 'font-weight:' + labelStyles.fontWeight + ';' : ''}
				${labelStyles?.letterSpacing ? 'letter-spacing:' + labelStyles.letterSpacing + 'px;' : ''}
				${labelStyles?.textTransform ? 'text-transform:' + labelStyles.textTransform + ';' : ''}
				${labelStyles?.fontFamily ? 'font-family:' + labelStyles.fontFamily + ';' : ''}
				${labelStyles?.fontSize ? 'font-size:' + labelStyles.fontSize + ';' : ''}

				${labelStyles?.color ? 'color:' + labelStyles.color + ';' : ''}

				${labelStyles?.paddingTop ? 'padding-top:' + labelStyles.paddingTop + ';' : ''}
				${labelStyles?.paddingRight ? 'padding-right:' + labelStyles.paddingRight + ';' : ''}
				${labelStyles?.paddingBottom ? 'padding-bottom:' + labelStyles.paddingBottom + ';' : ''}
				${labelStyles?.paddingLeft ? 'padding-left:' + labelStyles.paddingLeft + ';' : ''}

				${labelStyles?.marginTop ? 'margin-top:' + labelStyles.marginTop + ';' : ''}
				${labelStyles?.marginRight ? 'margin-right:' + labelStyles.marginRight + ';' : ''}
				${labelStyles?.marginBottom ? 'margin-bottom:' + labelStyles.marginBottom + ';' : ''}
				${labelStyles?.marginLeft ? 'margin-left:' + labelStyles.marginLeft + ';' : ''}
			}

			.wp-block-kadence-advanced-form${uniqueID} .kb-advanced-form .kb-adv-form-label .kb-adv-form-required {;
				${fieldStyle?.requiredColor ? 'color:' + KadenceColorOutput(fieldStyle.requiredColor) + ';' : ''}
			}

			`}
		</style>
	);
	const radioLabelCss = (
		<style>
			{`
				.wp-block-kadence-advanced-form${uniqueID} .kb-advanced-form .kb-radio-check-item label {
					${radioLabelStyles?.fontSize ? 'font-size:' + radioLabelStyles.fontSize + ';' : ''}
					${radioLabelStyles?.fontStyle ? 'font-style:' + radioLabelStyles.fontStyle + ';' : ''}
					${radioLabelStyles?.lineHeight ? 'line-height:' + radioLabelStyles.lineHeight + ';' : ''}
					${radioLabelStyles?.fontWeight ? 'font-weight:' + radioLabelStyles.fontWeight + ';' : ''}
					${radioLabelStyles?.letterSpacing ? 'letter-spacing:' + radioLabelStyles.letterSpacing + ';' : ''}
					${radioLabelStyles?.textTransform ? 'text-transform:' + radioLabelStyles.textTransform + ';' : ''}
					${radioLabelStyles?.fontFamily ? 'font-family:' + radioLabelStyles.fontFamily + ';' : ''}

					${radioLabelStyles?.color ? 'color:' + radioLabelStyles.color + ';' : ''}
				}
			`}
		</style>
	);

	const helpCss = (
		<style>
			{`

			.wp-block-kadence-advanced-form${uniqueID} .kb-advanced-form .kb-adv-form-help {
				${helpStyles?.fontSize ? 'font-size: ' + helpStyles.fontSize + ';' : ''}
				${helpStyles?.lineHeight ? 'line-height: ' + helpStyles.lineHeight + ';' : ''}
				${helpStyles?.fontWeight ? 'font-weight: ' + helpStyles.fontWeight + ';' : ''}

				${helpStyles?.textTransform ? 'text-transform: ' + helpStyles.textTransform + ';' : ''}
				${helpStyles?.fontFamily ? 'font-family: ' + helpStyles.fontFamily + ';' : ''}
				${helpStyles?.fontStyle ? 'font-style: ' + helpStyles.fontStyle + ';' : ''}
				${helpStyles?.letterSpacing ? 'letter-spacing: ' + helpStyles.letterSpacing + ';' : ''}

				${helpStyles?.paddingTop ? 'padding-top: ' + helpStyles.paddingTop + ';' : ''}
				${helpStyles?.paddingRight ? 'padding-right: ' + helpStyles.paddingRight + ';' : ''}
				${helpStyles?.paddingBottom ? 'padding-bottom: ' + helpStyles.paddingBottom + ';' : ''}
				${helpStyles?.paddingLeft ? 'padding-left: ' + helpStyles.paddingLeft + ';' : ''}

				${helpStyles?.marginTop ? 'margin-top: ' + helpStyles.marginTop + ';' : ''}
				${helpStyles?.marginRight ? 'margin-right: ' + helpStyles.marginRight + ';' : ''}
				${helpStyles?.marginBottom ? 'margin-bottom: ' + helpStyles.marginBottom + ';' : ''}
				${helpStyles?.marginLeft ? 'margin-left: ' + helpStyles.marginLeft + ';' : ''}

				${helpStyles?.color ? 'color: ' + helpStyles.color + ';' : ''}
			}

			`}
		</style>
	);

	return (
		<>
			{fieldCss}
			{labelCss}
			{helpCss}
			{radioLabelCss}
		</>
	);
}
