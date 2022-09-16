/**
 * External dependencies
 */
import classnames from 'classnames';

import './editor.scss';
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { AnglePickerControl, Flex,__experimentalVStack as VStack, SelectControl } from '@wordpress/components';
/**
 * Internal dependencies
 */
import CustomGradientBar from './gradient-bar';
// import { Flex } from '../flex';
// import { VStack } from '../v-stack';
import {
	getGradientAstWithDefault,
	getLinearGradientRepresentation,
	getGradientAstWithControlPoints,
	getStopCssColor,
} from './utils';
import { serializeGradient } from './serializer';
import {
	DEFAULT_LINEAR_GRADIENT_ANGLE,
	HORIZONTAL_GRADIENT_ORIENTATION,
	GRADIENT_OPTIONS,
	RADIAL_GRADIENT_ORIENTATION,
	DEFAULT_GRADIENT,
	DEFAULT_RADIAL_GRADIENT_POSITION,
	GRADIENT_POSITION_OPTIONS,
} from './constants';
// import {
// 	AccessoryWrapper,
// 	SelectWrapper,
// } from './styles/custom-gradient-picker-styles';

const GradientAnglePicker = ( { gradientAST, hasGradient, onChange } ) => {
	const angle =
		gradientAST?.orientation?.value ?? DEFAULT_LINEAR_GRADIENT_ANGLE;
	const onAngleChange = ( newAngle ) => {
		onChange(
			serializeGradient( {
				...gradientAST,
				orientation: {
					type: 'angular',
					value: newAngle,
				},
			} )
		);
	};
	return (
		<AnglePickerControl
			__nextHasNoMarginBottom
			onChange={ onAngleChange }
			labelPosition="top"
			value={ hasGradient ? angle : '' }
		/>
	);
};

const GradientTypePicker = ( { gradientAST, hasGradient, onChange } ) => {
	const { type } = gradientAST;
	const onSetLinearGradient = () => {
		onChange(
			serializeGradient( {
				...gradientAST,
				...( { orientation: HORIZONTAL_GRADIENT_ORIENTATION } ),
				type: 'linear-gradient',
			} )
		);
	};

	const onSetRadialGradient = () => {
		console.log( gradientAST );
		onChange(
			serializeGradient( {
				...gradientAST,
				...( { orientation: RADIAL_GRADIENT_ORIENTATION, }),
				type: 'radial-gradient',
			} )
		);
	};

	const handleOnChange = ( next ) => {
		if ( next === 'linear-gradient' ) {
			onSetLinearGradient();
		}
		if ( next === 'radial-gradient' ) {
			onSetRadialGradient();
		}
	};

	return (
		<SelectControl
			__nextHasNoMarginBottom
			className="components-custom-gradient-picker__type-picker"
			label={ __( 'Type' ) }
			labelPosition="top"
			onChange={ handleOnChange }
			options={ GRADIENT_OPTIONS }
			size="__unstable-large"
			value={ hasGradient && type }
		/>
	);
};
const GradientPositionPicker = ( { gradientAST, hasGradient, onChange } ) => {
	console.log( gradientAST );
	let position = DEFAULT_RADIAL_GRADIENT_POSITION;
	if ( gradientAST?.orientation && gradientAST?.orientation[0]?.at?.value?.x?.value ) {
		position = gradientAST.orientation[0].at.value.x.value + ' ' + gradientAST.orientation[0].at.value.y.value;
	}
	const onPositionChange = ( newPosition ) => {
		const positionArray = newPosition.split( ' ' );
		onChange(
			serializeGradient( {
				...gradientAST,
				orientation: [ {
					type: 'shape',
					value: 'ellipse',
					at: {
						type: 'position',
						value: {
							x: {
								type: 'position-keyword',
								value: ( undefined !== positionArray[0] && positionArray[0] ? positionArray[0] : 'center' )
							},
							y: {
								type: 'position-keyword',
								value: ( undefined !== positionArray[1] && positionArray[1] ? positionArray[1] : 'center' )
							}
						}
					}
				} ],
			} )
		);
	};
	return (
		<SelectControl
			className="components-custom-gradient-picker__position-picker"
			label={ __( 'Position', 'kadence-blocks' ) }
			labelPosition="top"
			onChange={ onPositionChange }
			options={ GRADIENT_POSITION_OPTIONS }
			size="__unstable-large"
			value={ hasGradient && position }
		/>
	);
};

export default function CustomGradientPicker( {
	value,
	onChange,
	isRenderedInSidebar = true,
} ) {
	const gradientAST = getGradientAstWithDefault( value );
	// On radial gradients the bar should display a linear gradient.
	// On radial gradients the bar represents a slice of the gradient from the center until the outside.
	// On liner gradients the bar represents the color stops from left to right independently of the angle.
	const background = getLinearGradientRepresentation( gradientAST );
	const hasGradient = gradientAST.value !== DEFAULT_GRADIENT;
	// Control points color option may be hex from presets, custom colors will be rgb.
	// The position should always be a percentage.
	const controlPoints = gradientAST.colorStops.map( ( colorStop ) => ( {
		color: getStopCssColor( colorStop ),
		position: parseInt( colorStop.length.value ),
	} ) );
	console.log( gradientAST );
	return (
		<div className={ 'components-base-control components-custom-gradient-picker kadence-gradient-control' }>
			<CustomGradientBar
				isRenderedInSidebar={isRenderedInSidebar}
				background={ background }
				hasGradient={ hasGradient }
				value={ controlPoints }
				onChange={ ( newControlPoints ) => {
					onChange(
						serializeGradient(
							getGradientAstWithControlPoints(
								gradientAST,
								newControlPoints
							)
						)
					);
				} }
			/>
			<Flex
				gap={ 3 }
				className="components-custom-gradient-picker__ui-line"
			>
				<div className='components-custom-gradient-picker__item components-custom-gradient-picker-type'>
					<GradientTypePicker
						gradientAST={ gradientAST }
						hasGradient={ hasGradient }
						onChange={ onChange }
					/>
				</div>
				{ gradientAST.type === 'linear-gradient' && (
					<div className='components-custom-gradient-picker__item components-custom-gradient-picker-angle'>
						<GradientAnglePicker
							gradientAST={ gradientAST }
							hasGradient={ hasGradient }
							onChange={ onChange }
						/>
					</div>
				) }
				{ gradientAST.type === 'radial-gradient' && (
					<div className='components-custom-gradient-picker__item components-custom-gradient-picker-position'>
						<GradientPositionPicker
							gradientAST={ gradientAST }
							hasGradient={ hasGradient }
							onChange={ onChange }
						/>
					</div>
				) }
			</Flex>
		</div>
	);
}
