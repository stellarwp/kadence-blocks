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
//import BlockPopover from './block-popover';
/**
 * Import Css
 */
 import './editor.scss';

export default function PaddingVisualizer( { style, selectedElementRef, padding, forceShow = false, forceHide = false } ) {
	const outputPadding = {
		top: padding[0],
		right: padding[1],
		bottom: padding[2],
		left: padding[3],
	}
	const paddingStyle = useMemo( () => {
		return {
			borderTopWidth: outputPadding?.top
				? outputPadding?.top
				: 0,
			borderRightWidth: outputPadding?.right
				? outputPadding?.right
				: 0,
			borderBottomWidth: outputPadding?.bottom
				? outputPadding?.bottom
				: 0,
			borderLeftWidth: outputPadding?.left
				? outputPadding?.left
				: 0,
		};
	}, [ padding ] );

	const [ isActive, setIsActive ] = useState( false );
	const valueRef = useRef( padding );
	const timeoutRef = useRef();

	const clearTimer = () => {
		if ( timeoutRef.current ) {
			window.clearTimeout( timeoutRef.current );
		}
	};
	useMemo( () => {
		if ( forceHide ) {
			valueRef.current = padding;
		}
		if ( ! isShallowEqualArrays( padding, valueRef.current ) && ! forceShow && ! forceHide ) {
			setIsActive( true );
			valueRef.current = padding;

			clearTimer();
			timeoutRef.current = setTimeout( () => {
				setIsActive( false );
			}, 400 );
		}

		return () => clearTimer();
	}, [ padding, forceShow, forceHide ] );

	if ( ( ! isActive && ! forceShow ) || forceHide ) {
		return null;
	}

	return (
		<div
			className='kb__padding-visualizer-wrap'
			style={ style }
			// selectedElementRef={ selectedElementRef }
			// __unstableCoverTarget
			// __unstableRefreshSize={ padding }
			// shift={ false }
		>
			<div className="kb__padding-visualizer" style={ paddingStyle } />
		</div>
	);
}