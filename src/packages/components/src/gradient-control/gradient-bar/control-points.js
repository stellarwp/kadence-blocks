/**
 * External dependencies
 */
import classnames from 'classnames';
import { colord } from 'colord';
import { map } from 'lodash';

/**
 * WordPress dependencies
 */
 import { useSetting } from '@wordpress/block-editor';
import { useInstanceId, useMergeRefs } from '@wordpress/compose';
import { useEffect, useRef, useState, useMemo } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { plus } from '@wordpress/icons';

/**
 * Internal dependencies
 */
// import { HStack } from '../../h-stack';
// import { ColorPicker } from '../../color-picker';
// import { VisuallyHidden } from '../../visually-hidden';
import ColorPicker from '../../color-picker';
import { __experimentalHStack as HStack, Button, VisuallyHidden, Popover, Dashicon, Tooltip, __experimentalNumberControl as NumberControl } from '@wordpress/components';
import {
	addControlPoint,
	clampPercent,
	removeControlPoint,
	updateControlPointColor,
	updateControlPointColorByPosition,
	updateControlPointPosition,
	getHorizontalRelativeGradientPosition,
} from './utils';
import {
	MINIMUM_SIGNIFICANT_MOVE,
	KEYBOARD_CONTROL_POINT_VARIATION,
} from './constants';

function useObservableState( initialState, onStateChange ) {
	const [ state, setState ] = useState( initialState );
	return [
		state,
		( value ) => {
			setState( value );
			if ( onStateChange ) {
				onStateChange( value );
			}
		},
	];
}

function CustomDropdown( props ) {
	const {
		renderContent,
		renderToggle,
		className,
		contentClassName,
		expandOnMobile,
		headerTitle,
		focusOnMount,
		position,
		popoverProps,
		onClose,
		onToggle,
		style,
	} = props;
	// Use internal state instead of a ref to make sure that the component
	// re-renders when the popover's anchor updates.
	const [ fallbackPopoverAnchor, setFallbackPopoverAnchor ] =
		useState( null );
	const containerRef = useRef();
	const [ isOpen, setIsOpen ] = useObservableState( false, onToggle );

	useEffect(
		() => () => {
			if ( onToggle && isOpen ) {
				onToggle( false );
			}
		},
		[ onToggle, isOpen ]
	);

	function toggle() {
		setIsOpen( ! isOpen );
	}

	/**
	 * Closes the popover when focus leaves it unless the toggle was pressed or
	 * focus has moved to a separate dialog. The former is to let the toggle
	 * handle closing the popover and the latter is to preserve presence in
	 * case a dialog has opened, allowing focus to return when it's dismissed.
	 */
	function closeIfFocusOutside() {
		const { ownerDocument } = containerRef.current;
		const dialog = ownerDocument.activeElement.closest( '[role="dialog"]' );
		if (
			! containerRef.current.contains( ownerDocument.activeElement ) &&
			( ! dialog || dialog.contains( containerRef.current ) )
		) {
			close();
		}
	}

	function close() {
		if ( onClose ) {
			onClose();
		}
		setIsOpen( false );
	}

	const args = { isOpen, onToggle: toggle, onClose: close };
	const popoverPropsHaveAnchor =
		!! popoverProps?.anchor ||
		// Note: `anchorRef`, `getAnchorRect` and `anchorRect` are deprecated and
		// be removed from `Popover` from WordPress 6.3
		!! popoverProps?.anchorRef ||
		!! popoverProps?.getAnchorRect ||
		!! popoverProps?.anchorRect;

	return (
		<div
			className={ classnames( 'components-dropdown', className ) }
			ref={ useMergeRefs( [ setFallbackPopoverAnchor, containerRef ] ) }
			// Some UAs focus the closest focusable parent when the toggle is
			// clicked. Making this div focusable ensures such UAs will focus
			// it and `closeIfFocusOutside` can tell if the toggle was clicked.
			tabIndex="-1"
			style={ style }
		>
			{ renderToggle( args ) }
			{ isOpen && (
				<Popover
					position={ position }
					onClose={ close }
					onFocusOutside={ closeIfFocusOutside }
					expandOnMobile={ expandOnMobile }
					headerTitle={ headerTitle }
					focusOnMount={ focusOnMount }
					// This value is used to ensure that the dropdowns
					// align with the editor header by default.
					offset={ 13 }
					anchor={
						! popoverPropsHaveAnchor
							? fallbackPopoverAnchor
							: undefined
					}
					{ ...popoverProps }
					className={ classnames(
						'components-dropdown__content',
						popoverProps ? popoverProps.className : undefined,
						contentClassName
					) }
				>
					{ renderContent( args ) }
				</Popover>
			) }
		</div>
	);
}

function CustomColorPickerDropdown( {
	isRenderedInSidebar,
	popoverProps: receivedPopoverProps,
	...props
} ) {
	const popoverProps = useMemo(
		() => ( {
			shift: true,
			...( isRenderedInSidebar
				? {
						// When in the sidebar: open to the left (stacking),
						// leaving the same gap as the parent popover.
						placement: 'left-start',
						offset: 34,
				  }
				: {
						// Default behavior: open below the anchor
						placement: 'bottom',
						offset: 8,
				  } ),
			...receivedPopoverProps,
		} ),
		[ isRenderedInSidebar, receivedPopoverProps ]
	);

	return (
		<CustomDropdown
			contentClassName="components-color-palette__custom-color-dropdown-content kadence-pop-color-popover"
			popoverProps={ popoverProps }
			{ ...props }
		/>
	);
}

function ControlPointButton( { isOpen, position, color, ...additionalProps } ) {
	const instanceId = useInstanceId( ControlPointButton );
	const descriptionId = `components-custom-gradient-picker__control-point-button-description-${ instanceId }`;
	return (
		<>
			<Button
				aria-label={ sprintf(
					// translators: %1$s: gradient position e.g: 70, %2$s: gradient color code e.g: rgb(52,121,151).
					__(
						'Gradient control point at position %1$s%% with color code %2$s.'
					),
					position,
					color
				) }
				aria-describedby={ descriptionId }
				aria-haspopup="true"
				aria-expanded={ isOpen }
				className={ classnames(
					'components-custom-gradient-picker__control-point-button',
					{
						'is-active': isOpen,
					}
				) }
				{ ...additionalProps }
			/>
			<VisuallyHidden id={ descriptionId }>
				{ __(
					'Use your left or right arrow keys or drag and drop with the mouse to change the gradient position. Press the button to change the color or remove the control point.'
				) }
			</VisuallyHidden>
		</>
	);
}

function GradientColorPickerDropdown( {
	isRenderedInSidebar,
	className,
	...props
} ) {
	// Open the popover below the gradient control/insertion point
	const popoverProps = useMemo(
		() => ( {
			placement: 'bottom',
			offset: 8,
		} ),
		[]
	);

	const mergedClassName = classnames(
		'components-custom-gradient-picker__control-point-dropdown',
		className
	);

	return (
		<CustomColorPickerDropdown
			isRenderedInSidebar={ isRenderedInSidebar }
			popoverProps={ popoverProps }
			className={ mergedClassName }
			{ ...props }
		/>
	);
}
function getReadableColor( value, colors ) {
	if ( ! value ) {
		return '';
	}
	if ( ! colors ) {
		return value;
	}
	if ( value.startsWith( 'var(--global-' ) ) {
		const foundColor = colors.find( ( option ) => option.value === value );
		if ( foundColor ) {
			return foundColor.color;
		}
		let slug = value.replace( 'var(--global-', '' );
		slug = slug.substring(0,8);
		slug = 'theme-' + slug;
		const found = colors.find( ( option ) => option.slug === slug );
		if ( found ) {
			if ( ! found.color.startsWith( 'var(' ) ) {
				return found.color;
			}
		}
		let temp_value = window.getComputedStyle( document.documentElement ).getPropertyValue( value.replace( 'var(', '' ).replace( ' ', '' ).replace( ')', '' ) );
		if ( '' === temp_value ) {
			temp_value = window.getComputedStyle( document.documentElement ).getPropertyValue( value.replace( 'var(', '' ).replace( ' ', '' ).split(',')[0].replace( ')', '' ) );
		}
		if ( temp_value ) {
			return temp_value;
		}
	} else if ( value.startsWith( 'var(' ) ) {
		let temp_value = window.getComputedStyle( document.documentElement ).getPropertyValue( value.replace( 'var(', '' ).replace( ' ', '' ).replace( ')', '' ) );
		if ( '' === temp_value ) {
			temp_value = window.getComputedStyle( document.documentElement ).getPropertyValue( value.replace( 'var(', '' ).replace( ' ', '' ).split(',')[0].replace( ')', '' ) );
		}
		if ( temp_value ) {
			return temp_value;
		}
	}
	
	return value;
}

function ControlPoints( {
	disableRemove,
	gradientPickerDomRef,
	ignoreMarkerPosition,
	value: controlPoints,
	onChange,
	onStartControlPointChange,
	onStopControlPointChange,
	isRenderedInSidebar,
} ) {
	const controlPointMoveState = useRef();

	const onMouseMove = ( event ) => {
		const relativePosition = getHorizontalRelativeGradientPosition(
			event.clientX,
			gradientPickerDomRef.current
		);
		const { initialPosition, index, significantMoveHappened } =
			controlPointMoveState.current;
		if (
			! significantMoveHappened &&
			Math.abs( initialPosition - relativePosition ) >=
				MINIMUM_SIGNIFICANT_MOVE
		) {
			controlPointMoveState.current.significantMoveHappened = true;
		}

		onChange(
			updateControlPointPosition( controlPoints, index, relativePosition )
		);
	};

	const cleanEventListeners = () => {
		if (
			window &&
			window.removeEventListener &&
			controlPointMoveState.current &&
			controlPointMoveState.current.listenersActivated
		) {
			window.removeEventListener( 'mousemove', onMouseMove );
			window.removeEventListener( 'mouseup', cleanEventListeners );
			onStopControlPointChange();
			controlPointMoveState.current.listenersActivated = false;
		}
	};

	// Adding `cleanEventListeners` to the dependency array below requires the function itself to be wrapped in a `useCallback`
	// This memoization would prevent the event listeners from being properly cleaned.
	// Instead, we'll pass a ref to the function in our `useEffect` so `cleanEventListeners` itself is no longer a dependency.
	const cleanEventListenersRef = useRef();
	cleanEventListenersRef.current = cleanEventListeners;

	useEffect( () => {
		return () => {
			cleanEventListenersRef.current();
		};
	}, [] );
	const disableCustomColors = ! useSetting( 'color.custom' );
	const colors = useSetting( 'color.palette' );
	return controlPoints.map( ( point, index ) => {
		const initialPosition = point?.position;
		const pointColor = getReadableColor( point.color, colors );
		return (
			ignoreMarkerPosition !== initialPosition && (
				<GradientColorPickerDropdown
					isRenderedInSidebar={ isRenderedInSidebar }
					key={ index }
					onClose={ onStopControlPointChange }
					renderToggle={ ( { isOpen, onToggle } ) => (
						<ControlPointButton
							key={ index }
							onClick={ () => {
								if (
									controlPointMoveState.current &&
									controlPointMoveState.current
										.significantMoveHappened
								) {
									return;
								}
								if ( isOpen ) {
									onStopControlPointChange();
								} else {
									onStartControlPointChange();
								}
								onToggle();
							} }
							onMouseDown={ () => {
								if ( window && window.addEventListener ) {
									controlPointMoveState.current = {
										initialPosition,
										index,
										significantMoveHappened: false,
										listenersActivated: true,
									};
									onStartControlPointChange();
									window.addEventListener(
										'mousemove',
										onMouseMove
									);
									window.addEventListener(
										'mouseup',
										cleanEventListeners
									);
								}
							} }
							onKeyDown={ ( event ) => {
								if ( event.code === 'ArrowLeft' ) {
									// Stop propagation of the key press event to avoid focus moving
									// to another editor area.
									event.stopPropagation();
									onChange(
										updateControlPointPosition(
											controlPoints,
											index,
											clampPercent(
												point.position -
													KEYBOARD_CONTROL_POINT_VARIATION
											)
										)
									);
								} else if ( event.code === 'ArrowRight' ) {
									// Stop propagation of the key press event to avoid focus moving
									// to another editor area.
									event.stopPropagation();
									onChange(
										updateControlPointPosition(
											controlPoints,
											index,
											clampPercent(
												point.position +
													KEYBOARD_CONTROL_POINT_VARIATION
											)
										)
									);
								}
							} }
							isOpen={ isOpen }
							position={ point.position }
							color={ point.color }
						/>
					) }
					renderContent={ ( { onClose } ) => (
						<div className="kadence-pop-gradient-color-picker">
							{ ! disableCustomColors && (
								<ColorPicker
									color={ pointColor }
									onChange={ ( color ) => {
										onChange(
											updateControlPointColor(
												controlPoints,
												index,
												colord( color.rgb ).toRgbString(),
											)
										);
									} }
									onChangeComplete={ ( color ) => {
										onChange(
											updateControlPointColor(
												controlPoints,
												index,
												colord( color.rgb ).toRgbString(),
											)
										);
									} }
								/>
							) }
							{ colors && (
								<div className="kadence-pop-color-palette-swatches">
									{ map( colors, ( { color, slug, name } ) => {
										const style = { color };
										const palette = slug.replace( 'theme-', '' );
										const isActive = ( (  slug.startsWith( 'theme-palette' ) && color === point.color ) || ( slug.startsWith( 'theme-palette' ) && pointColor === color ) );
										const isLinked = ( ( ! slug.startsWith( 'theme-palette' ) && color.startsWith( 'var(' ) && ( pointColor === color || color === point.color ) ) );
										return (
											<div key={ color } className="kadence-color-palette__item-wrapper">
												<Tooltip
													text={ name ||
														// translators: %s: color hex code e.g: "#f00".
														sprintf( __( 'Color code: %s' ), color )
													}>
													<Button
														type="button"
														className={ `kadence-color-palette__item ${ ( isActive || isLinked ? 'is-active' : '' ) }` }
														style={ style }
														onClick={ () => {
															if ( slug.startsWith( 'theme-palette' ) && ! color.startsWith( 'var(' ) ) {
																onChange(
																	updateControlPointColor(
																		controlPoints,
																		index,
																		'var(--global-' + palette + ',' + color + ')'
																	)
																);
															} else if ( color.startsWith( 'var(' ) ) {
																onChange(
																	updateControlPointColor(
																		controlPoints,
																		index,
																		color
																	)
																);
															} else {
																onChange(
																	updateControlPointColor(
																		controlPoints,
																		index,
																		colord( color ).toRgbString()
																	)
																);
															}
														} }
														aria-label={ name ?
															// translators: %s: The name of the color e.g: "vivid red".
															sprintf( __( 'Color: %s', 'kadence-blocks' ), name ) :
															// translators: %s: color hex code e.g: "#f00".
															sprintf( __( 'Color code: %s', 'kadence-blocks' ), color ) }
														aria-pressed={ isActive || isLinked }
													/>
												</Tooltip>
												{ isActive && <Dashicon icon="admin-site" /> }
												{ ! slug.startsWith( 'theme-palette' ) && pointColor === color && <Dashicon icon="saved" /> }
											</div>
										);
									} ) }
								</div>
							) }
							{ point?.position !== undefined && (
								<NumberControl
									label={__( 'Control Point Position %', 'kadence-blocks' )}
									value={ point.position }
									onChange={ ( value ) => {
										onChange(
											updateControlPointPosition(
												controlPoints,
												index,
												clampPercent(
													parseFloat( value )
												)
											)
										);
									}}
									min={0}
									step={0.01}
									max={100}
									style={{ paddingBottom: '10px' }}
								/>
							) }
							{ ! disableRemove && controlPoints.length > 2 && (
								<HStack
									className="components-custom-gradient-picker__remove-control-point-wrapper"
									alignment="center"
								>
									<Button
										onClick={ () => {
											onChange(
												removeControlPoint(
													controlPoints,
													index
												)
											);
											onClose();
										} }
										variant="link"
									>
										{ __( 'Remove Control Point' ) }
									</Button>
								</HStack>
							) }
						</div>
					) }
					style={ {
						left: `${ point.position }%`,
						transform: 'translateX( -50% )',
					} }
				/>
			)
		);
	} );
}

function InsertPoint( {
	value: controlPoints,
	onChange,
	onOpenInserter,
	onCloseInserter,
	insertPosition,
	isRenderedInSidebar,
} ) {
	const [ alreadyInsertedPoint, setAlreadyInsertedPoint ] = useState( false );
	const disableCustomColors = ! useSetting( 'color.custom' );
	const colors = useSetting( 'color.palette' );
	const [ tempColor, setTempColor ] = useState( '' );
	const pointColor = getReadableColor( tempColor, colors ); 
	return (
		<GradientColorPickerDropdown
			isRenderedInSidebar={ isRenderedInSidebar }
			className="components-custom-gradient-picker__inserter"
			onClose={ () => {
				onCloseInserter();
			} }
			renderToggle={ ( { isOpen, onToggle } ) => (
				<Button
					aria-expanded={ isOpen }
					aria-haspopup="true"
					onClick={ () => {
						if ( isOpen ) {
							onCloseInserter();
						} else {
							setAlreadyInsertedPoint( false );
							onOpenInserter();
						}
						onToggle();
					} }
					className="components-custom-gradient-picker__insert-point-dropdown"
					icon={ plus }
				/>
			) }
			renderContent={ () => (
				<div className="kadence-pop-gradient-color-picker">
					{ ! disableCustomColors && (
						<ColorPicker
							color={ pointColor }
							onChange={ ( color ) => {
								setTempColor( colord( color.rgb ).toRgbString() );
								if ( ! alreadyInsertedPoint ) {
									onChange(
										addControlPoint(
											controlPoints,
											insertPosition,
											colord( color.rgb ).toRgbString()
										)
									);
									setAlreadyInsertedPoint( true );
								} else {
									onChange(
										updateControlPointColorByPosition(
											controlPoints,
											insertPosition,
											colord( color.rgb ).toRgbString()
										)
									);
								}
							} }
							onChangeComplete={ ( color ) => {
								setTempColor( colord( color.rgb ).toRgbString() );
								if ( ! alreadyInsertedPoint ) {
									onChange(
										addControlPoint(
											controlPoints,
											insertPosition,
											colord( color.rgb ).toRgbString()
										)
									);
									setAlreadyInsertedPoint( true );
								} else {
									onChange(
										updateControlPointColorByPosition(
											controlPoints,
											insertPosition,
											colord( color.rgb ).toRgbString()
										)
									);
								}
							} }
						/>
					) }
					{ colors && (
						<div className="kadence-pop-color-palette-swatches">
							{ map( colors, ( { color, slug, name } ) => {
								const style = { color };
								const palette = slug.replace( 'theme-', '' );
								//const isActive = ( ( slug.startsWith( 'theme-palette' ) && pointColor === color ) );
								const isActive = ( ( slug.startsWith( 'theme-palette' ) && color === tempColor ) || ( slug.startsWith( 'theme-palette' ) && pointColor === color ) );
								const isLinked = ( ( ! slug.startsWith( 'theme-palette' ) && color.startsWith( 'var(' ) && tempColor === color ) );
								return (
									<div key={ color } className="kadence-color-palette__item-wrapper">
										<Tooltip
											text={ name ||
												// translators: %s: color hex code e.g: "#f00".
												sprintf( __( 'Color code: %s' ), color )
											}>
											<Button
												type="button"
												className={ `kadence-color-palette__item ${ ( isActive || isLinked ? 'is-active' : '' ) }` }
												style={ style }
												onClick={ () => {
													setTempColor( colord( color ).toRgbString() );
													if ( slug.startsWith( 'theme-palette' ) && ! color.startsWith( 'var(' ) ) {
														if ( ! alreadyInsertedPoint ) {
															onChange(
																addControlPoint(
																	controlPoints,
																	insertPosition,
																	'var(--global-' + palette + ',' + color + ')'
																)
															);
															setAlreadyInsertedPoint( true );
														} else {
															onChange(
																updateControlPointColorByPosition(
																	controlPoints,
																	insertPosition,
																	'var(--global-' + palette + ',' + color + ')'
																)
															);
														}
													} else if ( color.startsWith( 'var(' ) ) {
														setTempColor( color );
														if ( ! alreadyInsertedPoint ) {
															onChange(
																addControlPoint(
																	controlPoints,
																	insertPosition,
																	color,
																)
															);
															setAlreadyInsertedPoint( true );
														} else {
															onChange(
																updateControlPointColorByPosition(
																	controlPoints,
																	insertPosition,
																	color,
																)
															);
														}
													} else if ( ! alreadyInsertedPoint ) {
															onChange(
																addControlPoint(
																	controlPoints,
																	insertPosition,
																	colord( color ).toRgbString()
																)
															);
															setAlreadyInsertedPoint( true );
														} else {
															onChange(
																updateControlPointColorByPosition(
																	controlPoints,
																	insertPosition,
																	colord( color ).toRgbString()
																)
															);
														}
												} }
												aria-label={ name ?
													// translators: %s: The name of the color e.g: "vivid red".
													sprintf( __( 'Color: %s', 'kadence-blocks' ), name ) :
													// translators: %s: color hex code e.g: "#f00".
													sprintf( __( 'Color code: %s', 'kadence-blocks' ), color ) }
											/>
										</Tooltip>
										{ isActive && <Dashicon icon="admin-site" /> }
										{ ! slug.startsWith( 'theme-palette' ) && tempColor === color && <Dashicon icon="saved" /> }
									</div>
								);
							} ) }
						</div>
					) }
				</div>
			) }
			style={
				insertPosition !== null
					? {
							left: `${ insertPosition }%`,
							transform: 'translateX( -50% )',
					  }
					: undefined
			}
		/>
	);
}
ControlPoints.InsertPoint = InsertPoint;

export default ControlPoints;
