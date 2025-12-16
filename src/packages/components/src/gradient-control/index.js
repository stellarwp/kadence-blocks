/**
 * External dependencies
 */
import classnames from 'classnames';

import './editor.scss';
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { AnglePickerControl, Flex, FlexItem,__experimentalUnitControl as UnitControl, SelectControl, Button } from '@wordpress/components';
/**
 * Internal dependencies
 */
 import { settings } from '@wordpress/icons';
import CustomGradientBar from './gradient-bar';
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
	DEFAULT_RADIAL_GRADIENT_SHAPE,
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
			className="components-custom-gradient-picker__type-picker kadence-select-large"
			label={ __( 'Type' ) }
			labelPosition="top"
			onChange={ handleOnChange }
			options={ GRADIENT_OPTIONS }
			//size="__unstable-large"
			value={ hasGradient && type }
		/>
	);
};
const GradientPositionPicker = ( { gradientAST, hasGradient, onChange } ) => {
	let position = DEFAULT_RADIAL_GRADIENT_POSITION;
	let positionLeft = '50%';
	let positionTop = '50%';
	let positionType = 'position-keyword';
	if ( gradientAST?.orientation && gradientAST?.orientation[0]?.at?.value?.x?.value ) {
		positionType = gradientAST.orientation[0].at.value.x.type;
		if ( positionType !== 'position-keyword' ) {
			position = gradientAST.orientation[0].at.value.x.value + '% ' + gradientAST.orientation[0].at.value.y.value + '%';
			positionLeft = gradientAST.orientation[0].at.value.x.value + '%';
			positionTop = gradientAST.orientation[0].at.value.y.value + '%';
		} else {
			position = gradientAST.orientation[0].at.value.x.value + ' ' + gradientAST.orientation[0].at.value.y.value;
		}
	}
	const onPositionChange = ( newPosition ) => {
		const positionArray = newPosition.split( ' ' );
		onChange(
			serializeGradient( {
				...gradientAST,
				orientation: [ {
					type: 'shape',
					value: gradientAST.orientation[0].value,
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
	const onLeftPositionChange = ( left ) => {
		onChange(
			serializeGradient( {
				...gradientAST,
				orientation: [ {
					type: 'shape',
					value: gradientAST.orientation[0].value,
					at: {
						type: 'position',
						value: {
							x: {
								type: '%',
								value: parseInt( left, 10 ),
							},
							y: gradientAST.orientation[0].at.value.y,
						}
					}
				} ],
			} )
		);
	};
	const onTopPositionChange = ( top ) => {
		onChange(
			serializeGradient( {
				...gradientAST,
				orientation: [ {
					type: 'shape',
					value: gradientAST.orientation[0].value,
					at: {
						type: 'position',
						value: {
							x: gradientAST.orientation[0].at.value.x,
							y: {
								type: '%',
								value: parseInt( top, 10 ),
							}
						}
					}
				} ],
			} )
		);
	};
	
	const onPositionTypeChange = ( type ) => {
		const positionArray = position.split( ' ' );
		let positionX = '%' === type ? 50 : 'center';
		let positionY = '%' === type ? 50 : 'center';
		if ( positionArray[0] ) {
			switch ( positionArray[ 0 ] ) {
				case 'left':
					positionX = 0;
					break;
				case 'right':
					positionX = '100';
					break;
				case 'center':
					positionX = 50;
					break;
				case 0:
					positionY = 'left';
					break;
				case 100:
					positionY = 'right';
					break;
				case 50:
					positionY = 'center';
					break;
			}
		}
		if ( positionArray[1] ) {
			switch ( positionArray[ 1 ] ) {
				case 'top':
					positionY = 0;
					break;
				case 'bottom':
					positionY = 100;
					break;
				case 'center':
					positionY = 50;
					break;
				case 0:
					positionY = 'top';
					break;
				case 100:
					positionY = 'bottom';
					break;
				case 50:
					positionY = 'center';
					break;
			}
		}
		onChange(
			serializeGradient( {
				...gradientAST,
				orientation: [ {
					type: 'shape',
					value: gradientAST.orientation[0].value,
					at: {
						type: 'position',
						value: {
							x: {
								type,
								value: positionX
							},
							y: {
								type,
								value: positionY
							}
						}
					}
				} ],
			} )
		);
	};
	if ( ! hasGradient ) {
		return;
	}
	return (
		<div className={ `components-base-control kadence-gradient-position-control` }>
				<Flex
					justify="space-between"
					className={ 'kadence-gradient-position_header' }
				>
					<FlexItem>
						<label className="kadence-gradient-position__label">{ __( 'Position', 'kadence-blocks' ) }</label>
					</FlexItem>
				</Flex>
				{ positionType === 'position-keyword' && (
					<div className={ 'kadence-controls-content' }>
						<SelectControl
							className="components-custom-gradient-picker__position-picker"
							// label={ __( 'Position', 'kadence-blocks' ) }
							// labelPosition="top"
							onChange={ onPositionChange }
							options={ GRADIENT_POSITION_OPTIONS }
							value={ position }
						/>
						<Button
							className={'kadence-control-toggle-advanced only-icon'}
							label={ __( 'Set custom position', 'kadence-blocks' ) }
							icon={ settings }
							onClick={ () => onPositionTypeChange( '%' ) }
							isPressed={ false }
							isTertiary={ true }
						/>
					</div>
				) }
				{ positionType !== 'position-keyword' && (
					<div className={ 'kadence-controls-content' }>
						<UnitControl
							labelPosition="left"
							label={ __( 'Left', 'kadence-blocks' ) }
							max={ 100 }
							min={ 0 }
							units={ [ { value: '%', label: '%' } ] }
							value={ positionLeft }
							onChange={ onLeftPositionChange }
						/>
						<UnitControl
							labelPosition="left"
							label={ __( 'Top', 'kadence-blocks' ) }
							max={ 100 }
							min={ 0 }
							value={ positionTop }
							units={ [ { value: '%', label: '%' } ] }
							onChange={ onTopPositionChange }
						/>
						<Button
							className={'kadence-control-toggle-advanced only-icon'}
							label={ __( 'Set standard position', 'kadence-blocks' ) }
							icon={ settings }
							onClick={ () => onPositionTypeChange( 'position-keyword' ) }
							isPrimary={true}
							isPressed={ true }
						/>
					</div>
				) }
			</div>
	);
};
const GradientShapePicker = ( { gradientAST, hasGradient, onChange } ) => {
	let shape = DEFAULT_RADIAL_GRADIENT_SHAPE;
	if ( gradientAST?.orientation && gradientAST?.orientation[0]?.type && 'shape' === gradientAST?.orientation[0]?.type && gradientAST?.orientation[0]?.value ) {
		shape = gradientAST?.orientation && gradientAST?.orientation[0]?.value;
	}
	const onShapeChange = ( newShape ) => {
		onChange(
			serializeGradient( {
				...gradientAST,
				orientation: [ {
					type: 'shape',
					value: newShape,
					at: gradientAST.orientation[0].at,
				} ],
			} )
		);
	};
	return (
		<SelectControl
			className="components-custom-gradient-picker__shape-picker kadence-select-large"
			label={ __( 'Shape', 'kadence-blocks' ) }
			labelPosition="top"
			onChange={ onShapeChange }
			options={ [
				{ value: 'ellipse', label: __( 'Ellipse', 'kadence-blocks'  ) },
				{ value: 'circle', label: __( 'Circle', 'kadence-blocks'  ) },
			] }
			value={ hasGradient && shape }
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
					<div className='components-custom-gradient-picker__item components-custom-gradient-picker-shape'>
						<GradientShapePicker
							gradientAST={ gradientAST }
							hasGradient={ hasGradient }
							onChange={ onChange }
						/>
					</div>
				) }
			</Flex>
			{ gradientAST.type === 'radial-gradient' && (
				<Flex
					gap={ 3 }
					className="components-custom-gradient-picker__ui-line"
				>
					<div className='components-custom-gradient-picker__item components-custom-gradient-picker-position'>
						<GradientPositionPicker
							gradientAST={ gradientAST }
							hasGradient={ hasGradient }
							onChange={ onChange }
						/>
					</div>
				</Flex>
			) }
		</div>
	);
}
