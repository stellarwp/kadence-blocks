/**
 * Icon Span Tag Component
 *
 */

export default function IconSpanTag( {
										 name,
										 title,
										 size,
										 style = {},
										 className = '',
										 strokeWidth = false,
									 } ) {
	return (
		<span
			className={'kb-icon kb-svg-icon ' +  className }
			data-name={name}
			data-title={title}
			data-size={size}
			data-stroke={ strokeWidth }
			style={ style }
		></span>
	);
}
