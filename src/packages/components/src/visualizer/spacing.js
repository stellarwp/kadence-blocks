/**
 * WordPress dependencies
 */
 import { __ } from '@wordpress/i18n';
 import {
	useState,
	useRef,
	useEffect,
	useMemo,
 } from '@wordpress/element';
 import { isShallowEqualArrays } from '@wordpress/is-shallow-equal';
/**
 * Import Css
 */
 import './editor.scss';

export default function SpacingVisualizer( { style, type = 'inside', spacing, forceShow = false, forceHide = false, offset= true } ) {
	const outputSpacing = {
		top: spacing[0],
		right: spacing[1],
		bottom: spacing[2],
		left: spacing[3],
	}
	const outputStyling = useMemo( () => {
		
		if ( type === 'outside' ) {
			const spacingTop = outputSpacing?.top
				? outputSpacing?.top
				: 0;
			const spacingRight = outputSpacing?.right
				? outputSpacing?.right
				: 0;
			const spacingBottom = outputSpacing?.bottom
				? outputSpacing?.bottom
				: 0;
			const spacingLeft = outputSpacing?.left
				? outputSpacing?.left
				: 0;
	
			return {
				borderTopWidth: spacingTop,
				borderRightWidth: spacingRight,
				borderBottomWidth: spacingBottom,
				borderLeftWidth: spacingLeft,
				top: offset && spacingTop ? `calc(${ spacingTop } * -1)` : 0,
				right: offset && spacingRight ? `calc(${ spacingRight } * -1)` : 0,
				bottom: offset && spacingBottom ? `calc(${ spacingBottom } * -1)` : 0,
				left: offset && spacingLeft ? `calc(${ spacingLeft } * -1)` : 0,
			};
		} else if ( type === 'outsideVertical' ) {
			const spacingTop = outputSpacing?.top
				? outputSpacing?.top
				: 0;
			const spacingRight = outputSpacing?.right
				? outputSpacing?.right
				: 0;
			const spacingBottom = outputSpacing?.bottom
				? outputSpacing?.bottom
				: 0;
			const spacingLeft = outputSpacing?.left
				? outputSpacing?.left
				: 0;
	
			return {
				borderTopWidth: spacingTop,
				borderRightWidth: spacingRight,
				borderBottomWidth: spacingBottom,
				borderLeftWidth: spacingLeft,
				top: offset && spacingTop ? `calc(${ spacingTop } * -1)` : 0,
				//right: offset && spacingRight ? `calc(${ spacingRight } * -1)` : 0,
				bottom: offset && spacingBottom ? `calc(${ spacingBottom } * -1)` : 0,
				//left: offset && spacingLeft ? `calc(${ spacingLeft } * -1)` : 0,
			};
		} 
			return {
				borderTopWidth: outputSpacing?.top
					? outputSpacing?.top
					: 0,
				borderRightWidth: outputSpacing?.right
					? outputSpacing?.right
					: 0,
				borderBottomWidth: outputSpacing?.bottom
					? outputSpacing?.bottom
					: 0,
				borderLeftWidth: outputSpacing?.left
					? outputSpacing?.left
					: 0,
				marginLeft: style?.marginLeft
					? style.marginLeft
					: 0,
				marginRight: style?.marginRight
					? style.marginRight
					: 0,
			};
		
	}, [ spacing ] );

	const [ isActive, setIsActive ] = useState( false );
	const valueRef = useRef( spacing );
	const timeoutRef = useRef();

	const clearTimer = () => {
		if ( timeoutRef.current ) {
			window.clearTimeout( timeoutRef.current );
		}
	};
	useMemo( () => {
		if ( forceHide ) {
			valueRef.current = spacing;
		}
		if ( ! isShallowEqualArrays( spacing, valueRef.current ) && ! forceShow && ! forceHide ) {
			setIsActive( true );
			valueRef.current = spacing;

			clearTimer();
			timeoutRef.current = setTimeout( () => {
				setIsActive( false );
			}, 400 );
		}

		return () => clearTimer();
	}, [ spacing, forceShow, forceHide ] );

	if ( ( ! isActive && ! forceShow ) || forceHide ) {
		return null;
	}

	return (
		<div
			className={ `kb__spacing-visualizer-wrap kb__spacing_visualizer-type-${ type }` }
			style={ style }
		>
			<div className="kb__spacing-visualizer" style={ outputStyling } />
		</div>
	);
}