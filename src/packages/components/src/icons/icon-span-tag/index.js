/**
 * Icon Span Tag Component
 *
 */

export default function IconSpanTag( {
		name,
		title,
		extraClass,
		strokeWidth = false,
		tooltipID = '',
		tooltipPlacement = '',
	} ) {
	return (
		<span
			data-name={ name }
			data-stroke={ ( strokeWidth ? strokeWidth : undefined ) }
			data-title={ ( title ? title.replace(/ /g, '_' ) : undefined ) }
			data-class={ ( extraClass ? extraClass.replace(/ /g, '_' ) : undefined ) }
			data-tooltip-id={ tooltipID ? tooltipID : undefined }
			data-tooltip-placement={ tooltipID && tooltipPlacement ? tooltipPlacement : undefined }
			className={ 'kadence-dynamic-icon' }
		></span>
	);
}
