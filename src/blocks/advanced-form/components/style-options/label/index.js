import { __ } from '@wordpress/i18n';

import { PopColorControl, TypographyControls, KadencePanelBody } from '@kadence/components';

import { SelectControl, ToggleControl } from '@wordpress/components';

import { useState } from '@wordpress/element';

export default function LabelOptions({ setAttributes, styleAttribute, labelFont }) {
	const [labelPaddingControl, setLabelPaddingControl] = useState('individual');
	const [labelMarginControl, setLabelMarginControl] = useState('individual');

	const saveLabelFont = (value) => {
		setAttributes({ ...labelFont, ...value }, 'labelFont');
	};

	const saveStyle = (value) => {
		setAttributes({ ...styleAttribute, ...value }, 'style');
	};
	const labelStyles = [
		{ value: 'normal', label: __('Normal', 'kadence-blocks') },
		{ value: 'infield', label: __('In Field Label', 'kadence-blocks') },
		{ value: 'float', label: __('Float Label', 'kadence-blocks') },
	];
	const showRequiredPreview = undefined !== styleAttribute?.showRequired ? styleAttribute.showRequired : true;
	return (
		<>
			<SelectControl
				label={__('Label Layout Style', 'kadence-blocks')}
				options={labelStyles}
				onChange={(value) => {
					saveStyle({ labelStyle: value });
				}}
				value={styleAttribute?.labelStyle}
			/>
			<PopColorControl
				label={__('Label Color', 'kadence-blocks')}
				value={labelFont.color ? labelFont.color : ''}
				default={''}
				onChange={(value) => {
					saveLabelFont({ color: value });
				}}
			/>
			<ToggleControl
				label={__('Show Required Asterisk?', 'kadence-blocks')}
				help={__('If field is required this will add an asterisk after the label.', 'kadence-blocks')}
				checked={showRequiredPreview}
				onChange={(value) => saveStyle({ showRequired: value })}
			/>
			{showRequiredPreview && (
				<PopColorControl
					label={__('Required Asterisk Color', 'kadence-blocks')}
					value={styleAttribute?.requiredColor ? styleAttribute.requiredColor : ''}
					default={''}
					onChange={(value) => saveStyle({ requiredColor: value })}
				/>
			)}
			<TypographyControls
				fontSize={labelFont.size}
				onFontSize={(value) => saveLabelFont({ size: value })}
				fontSizeType={labelFont.sizeType}
				onFontSizeType={(value) => saveLabelFont({ sizeType: value })}
				lineHeight={labelFont.lineHeight}
				onLineHeight={(value) => saveLabelFont({ lineHeight: value })}
				lineHeightType={labelFont.lineType}
				onLineHeightType={(value) => saveLabelFont({ lineType: value })}
			/>
			<KadencePanelBody
				title={__('Advanced Label Settings', 'kadence-blocks')}
				initialOpen={false}
				panelName={'kb-form-advanced-label-settings'}
			>
				<TypographyControls
					fontGroup={'body'}
					reLetterSpacing={labelFont.letterSpacing}
					onLetterSpacing={(value) => saveLabelFont({ letterSpacing: value })}
					letterSpacingType={labelFont.letterType}
					onLetterSpacingType={(value) => saveLabelFont({ letterType: value })}
					textTransform={labelFont.textTransform}
					onTextTransform={(value) => saveLabelFont({ textTransform: value })}
					fontFamily={labelFont.family}
					onFontFamily={(value) => saveLabelFont({ family: value })}
					onFontChange={(select) => {
						saveLabelFont({
							family: select.value,
							google: select.google,
						});
					}}
					onFontArrayChange={(values) => saveLabelFont(values)}
					googleFont={labelFont.google}
					onGoogleFont={(value) => saveLabelFont({ google: value })}
					loadGoogleFont={labelFont.loadGoogle}
					onLoadGoogleFont={(value) => saveLabelFont({ loadGoogle: value })}
					fontVariant={labelFont.variant}
					onFontVariant={(value) => saveLabelFont({ variant: value })}
					fontWeight={labelFont.weight}
					onFontWeight={(value) => saveLabelFont({ weight: value })}
					fontStyle={labelFont.style}
					onFontStyle={(value) => saveLabelFont({ style: value })}
					fontSubset={labelFont.subset}
					onFontSubset={(value) => saveLabelFont({ subset: value })}
					padding={labelFont.padding}
					onPadding={(value) => saveLabelFont({ padding: value })}
					paddingControl={labelPaddingControl}
					onPaddingControl={(value) => setLabelPaddingControl(value)}
					margin={labelFont.margin}
					onMargin={(value) => saveLabelFont({ margin: value })}
					marginControl={labelMarginControl}
					onMarginControl={(value) => setLabelMarginControl(value)}
				/>
			</KadencePanelBody>
		</>
	);
}
