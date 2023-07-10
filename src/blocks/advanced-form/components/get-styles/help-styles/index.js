import { getPreviewSize, KadenceColorOutput, getFontSizeOptionOutput } from '@kadence/helpers';
import { get, isEmpty } from 'lodash';

export default ( previewDevice, parentHelpStyle ) => {

	let styles = {};

	if ( !isEmpty( parentHelpStyle, 'color' ) ) {
		styles.color = KadenceColorOutput( parentHelpStyle.color );
	} else {
		styles.color = 'undefined';
	}

	styles.fontSize = getFontSizeOptionOutput( getPreviewSize( previewDevice, parentHelpStyle.size[ 0 ], parentHelpStyle.size[ 1 ], parentHelpStyle.size[ 2 ] ), get( parentHelpStyle, 'sizeType', 'px') );

	let lineHeight = getPreviewSize( previewDevice, parentHelpStyle?.lineHeight?.[0], parentHelpStyle?.lineHeight?.[1], parentHelpStyle?.lineHeight?.[2] );
	if( lineHeight ){
		styles.lineHeight = lineHeight + get( parentHelpStyle, 'lineType', '');
	}
	let letterSpacing = getPreviewSize( previewDevice, parentHelpStyle?.letterSpacing?.[0], parentHelpStyle?.letterSpacing?.[1], parentHelpStyle?.letterSpacing?.[2] );
	if ( letterSpacing ){
		styles.letterSpacing = letterSpacing + get( parentHelpStyle, 'letterType', 'px');
	}

	styles.fontWeight = parentHelpStyle.weight ? parentHelpStyle.weight : undefined;
	styles.textTransform = parentHelpStyle.textTransform ? parentHelpStyle.textTransform : undefined;
	styles.fontFamily = parentHelpStyle.family ? parentHelpStyle.family : undefined;
	styles.fontStyle = parentHelpStyle.fontStyle ? parentHelpStyle.fontStyle : undefined;

	styles.paddingTop = ( '' !== parentHelpStyle.padding[0] ? parentHelpStyle.padding[0] + 'px' : undefined );
	styles.paddingRight = ( '' !== parentHelpStyle.padding[1] ? parentHelpStyle.padding[1] + 'px' : undefined );
	styles.paddingBottom = ( '' !== parentHelpStyle.padding[2] ? parentHelpStyle.padding[2] + 'px' : undefined );
	styles.paddingLeft = ( '' !== parentHelpStyle.padding[3] ? parentHelpStyle.padding[3] + 'px' : undefined );

	styles.marginTop = ( '' !== parentHelpStyle.margin[0] ? parentHelpStyle.margin[0] + 'px' : undefined );
	styles.marginRight = ( '' !== parentHelpStyle.margin[1] ? parentHelpStyle.margin[1] + 'px' : undefined );
	styles.marginBottom = ( '' !== parentHelpStyle.margin[2] ? parentHelpStyle.margin[2] + 'px' : undefined );
	styles.marginLeft = ( '' !== parentHelpStyle.margin[3] ? parentHelpStyle.margin[3] + 'px' : undefined );


	return styles;

}
