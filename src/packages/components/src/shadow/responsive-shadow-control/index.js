/**
 * Import Externals
 */
import PopColorControl from '../../pop-color-control';

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import {Component, useState} from '@wordpress/element';
import { map, isEqual } from 'lodash';
import { useSelect, useDispatch } from '@wordpress/data';
import { default as ShadowControl } from '../shadow-control';

import {
	Dashicon,
	Button,
	ButtonGroup,
} from '@wordpress/components';
import {capitalizeFirstLetter} from '@kadence/helpers';
import RangeControl from "../../range/range-control";
import {undo} from "@wordpress/icons";
import KadenceRadioButtons from "../../common/radio-buttons";
import {
	shadowPresetBottomOffsetGlow, shadowPresetInnerSolid,
	shadowPresetNone, shadowPresetRightBottomSolid,
	shadowPresetRightOffsetGlow,
	shadowPresetSoftInnerGlow,
	shadowPresetSoftOuterGlow, shadowPresetTopLeftSolid
} from "../../../../icons/src";

/**
 * Build the BoxShadow controls
 * @returns {object} BoxShadow settings.
 */
export default function ResponsiveShadowControl ( {
	label,
	enable = true,
	color,
	colorDefault,
	opacity,
	blur,
	spread,
	inset,
	hOffset,
	vOffset,
	onColorChange,
    onOpacityChange,
	onBlurChange,
	onHOffsetChange,
	onVOffsetChange,
	onEnableChange,
	onSpreadChange,
	onInsetChange,
	className = '',
	shadowType,
	onArrayChange,
	onApplyShadowPreset,
	reset = true,
} ) {
	const [ deviceType, setDeviceType ] = useState( 'Desktop' );
	const previewDevice = useSelect( ( select ) => {
		return select( 'kadenceblocks/data' ).getPreviewDeviceType();
	}, [] );
	if ( previewDevice !== deviceType ) {
		setDeviceType( previewDevice );
	}
	const {
		setPreviewDeviceType,
	} = useDispatch( 'kadenceblocks/data' );
	const customSetPreviewDeviceType = ( device ) => {
		setPreviewDeviceType( capitalizeFirstLetter( device ) );
		setDeviceType( capitalizeFirstLetter( device ) );
	};

	const onReset = () => {
		onEnableChange('reset');
	}
	const devices = [
		{
			name: 'Desktop',
			key: 'desktop',
			title: <Dashicon icon="desktop" />,
			itemClass: 'kb-desk-tab',
		},
		{
			name: 'Tablet',
			key: 'tablet',
			title: <Dashicon icon="tablet" />,
			itemClass: 'kb-tablet-tab',
		},
		{
			name: 'Mobile',
			key: 'mobile',
			title: <Dashicon icon="smartphone" />,
			itemClass: 'kb-mobile-tab',
		},
	];
	const output = {};
	output.Mobile = (
		<ShadowControl
			key={'mobile-text-shadow-control'}
			label={__('Shadow', 'kadence-blocks')}
			enable={ enable }
			color={ color }
			colorDefault={ colorDefault }
			opacity={ opacity }
			hOffset={ hOffset }
			vOffset={ vOffset }
			blur={ blur }
			spread={ spread }
			onEnableChange={ onEnableChange }
			onColorChange={ onColorChange }
			onOpacityChange={ onOpacityChange }
			onHOffsetChange={ onHOffsetChange }
			onVOffsetChange={ onVOffsetChange }
			onBlurChange={ onBlurChange }
			onSpreadChange={ onSpreadChange }
			shadowType={ shadowType }
			inset={ inset }
			onInsetChange={ onInsetChange }
			onArrayChange={ onArrayChange }
			onApplyShadowPreset={ onApplyShadowPreset }
		/>
	);
	output.Tablet = (
		<ShadowControl
			key={'tablet-text-shadow-control'}
			label={__('Shadow', 'kadence-blocks')}
			enable={ enable }
			color={ color }
			colorDefault={ colorDefault }
			opacity={ opacity }
			hOffset={ hOffset }
			vOffset={ vOffset }
			blur={ blur }
			spread={ spread }
			onEnableChange={ onEnableChange }
			onColorChange={ onColorChange }
			onOpacityChange={ onOpacityChange }
			onHOffsetChange={ onHOffsetChange }
			onVOffsetChange={ onVOffsetChange }
			onBlurChange={ onBlurChange }
			onSpreadChange={ onSpreadChange }
			shadowType={ shadowType }
			inset={ inset }
			onInsetChange={ onInsetChange }
			onArrayChange={ onArrayChange }
			onApplyShadowPreset={ onApplyShadowPreset }
		/>
	);
	output.Desktop = (
		<ShadowControl
			key={'desktop-text-shadow-control'}
			label={__('Shadow', 'kadence-blocks')}
			enable={ enable }
			color={ color }
			opacity={ opacity }
			colorDefault={ colorDefault }
			hOffset={ hOffset }
			vOffset={ vOffset }
			blur={ blur }
			spread={ spread }
			onEnableChange={ onEnableChange }
			onColorChange={ onColorChange }
			onOpacityChange={ onOpacityChange }
			onHOffsetChange={ onHOffsetChange }
			onVOffsetChange={ onVOffsetChange }
			onBlurChange={ onBlurChange }
			onSpreadChange={ onSpreadChange }
			shadowType={ shadowType }
			inset={ inset }
			onInsetChange={ onInsetChange }
			onArrayChange={ onArrayChange }
			onApplyShadowPreset={ onApplyShadowPreset }
		/>
	);

	const presetOptions = [
		{ value: 'none', label: __('None', 'kadence-blocks'), icon: shadowPresetNone },
		{ value: 'soft-inner-glow', label: __('Soft Inner Glow', 'kadence-blocks'), icon: shadowPresetSoftInnerGlow },
		{ value: 'soft-outer-glow', label: __('Soft Outer Glow', 'kadence-blocks'), icon: shadowPresetSoftOuterGlow },
		{ value: 'right-offset-glow', label: __('Right Offset Glow', 'kadence-blocks'), icon: shadowPresetRightOffsetGlow },
		{ value: 'bottom-offset-glow', label: __('Bottom Offset Glow', 'kadence-blocks'), icon: shadowPresetBottomOffsetGlow },
		{ value: 'inner-solid', label: __('Inner Solid', 'kadence-blocks'), icon: shadowPresetInnerSolid },
		{ value: 'right-bottom-solid', label: __('Right Bottom Solid', 'kadence-blocks'), icon: shadowPresetRightBottomSolid },
		{ value: 'top-left-solid', label: __('Top Left Solid', 'kadence-blocks'), icon: shadowPresetTopLeftSolid },
	];
	const presetSettings = {
		'none': {hOffset: 0, vOffset: 0, blur: 0, spread: 0, inset: false},
		'soft-inner-glow': {hOffset: 0, vOffset: 0, blur: 60, spread: -15, inset: true},
		'soft-outer-glow': {hOffset: 0, vOffset: 0, blur: 60, spread: 5, inset: false},
		'right-offset-glow': {hOffset: 20, vOffset: 20, blur: 30, spread: 0, inset: false},
		'bottom-offset-glow': {hOffset: 0, vOffset: 35, blur: 20, spread: -5, inset: false},
		'inner-solid': {hOffset: 0, vOffset: 0, blur: 0, spread: 15, inset: true},
		'right-bottom-solid': {hOffset: 15, vOffset: 15, blur: 0, spread: 0, inset: false},
		'top-left-solid': {hOffset: -10, vOffset: -10, blur: 0, spread: 10, inset: false},
	};

	const applyPreset = (value) => {
		onApplyShadowPreset({
			hOffset: presetSettings[value].hOffset,
			vOffset: presetSettings[value].vOffset,
			blur: presetSettings[value].blur,
			spread: presetSettings[value].spread,
			inset: presetSettings[value].inset,
		});
	};

	return [
		onEnableChange && (
			<div className={ `components-base-control kb-responsive-range-control${ '' !== className ? ' ' + className : '' }` }>
				<div className="kadence-title-bar">
					{ label && (
						<span className="kadence-control-title">
								{ label }
							{ reset && (
								<Button
									className="is-reset is-single"
									isSmall
									disabled={ enable === false }
									icon={ undo }
									onClick={() => {
										if (typeof reset === 'function') {
											reset();
										} else {
											onReset();
										}
									}}
								></Button>
							) }
						</span>
					) }
					<ButtonGroup className="kb-measure-responsive-options" aria-label={ __( 'Device', 'kadence-blocks' ) }>
						{ map( devices, ( { name, key, title, itemClass } ) => (
							<Button
								key={ key }
								className={ `kb-responsive-btn ${ itemClass }${ name === deviceType ? ' is-active' : '' }` }
								isSmall
								aria-pressed={ deviceType === name }
								onClick={ () => customSetPreviewDeviceType( name ) }
							>
								{ title }
							</Button>
						) ) }
					</ButtonGroup>
				</div>
				<div>
					{ shadowType === 'box' && (
						<KadenceRadioButtons
							value={0}
							options={presetOptions}
							wrap={true}
							hideLabel={true}
							className={'kadence-box-shadow-radio-btns'}
							onChange={(value) => {
								applyPreset(value);
							}}
						/>
					)}

					{ ( output[ deviceType ] ? output[ deviceType ] : output.Desktop ) }
				</div>

			</div>
		)
	];
}
