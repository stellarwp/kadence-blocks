import { getPreviewSize, KadenceColorOutput, getFontSizeOptionOutput } from '@kadence/helpers';
import { get, isEmpty } from 'lodash';

export default ( previewDevice, parentHelpStyle ) => {

	let styles = {};

	if ( !isEmpty( parentHelpStyle, 'color' ) ) {
		styles.color = KadenceColorOutput( parentHelpStyle.color );
	} else {
		styles.color = 'inherit';
	}

	styles.fontSize = getFontSizeOptionOutput( getPreviewSize( previewDevice, parentHelpStyle.size[ 0 ], parentHelpStyle.size[ 1 ], parentHelpStyle.size[ 2 ] ), get( parentHelpStyle, 'sizeType', 'px') );
	styles.lineHeight = getPreviewSize( previewDevice, parentHelpStyle.lineHeight[ 0 ], parentHelpStyle.lineHeight[ 1 ], parentHelpStyle.lineHeight[ 2 ] ) + get( parentHelpStyle, 'lineType', 'px');
	styles.lineHeight = getPreviewSize( previewDevice, parentHelpStyle.lineHeight[ 0 ], parentHelpStyle.lineHeight[ 1 ], parentHelpStyle.lineHeight[ 2 ] ) + get( parentHelpStyle, 'lineType', 'px');

	if(parentHelpStyle.weight) {
		styles.fontWeight = parentHelpStyle.weight;
	}

	if ( parentHelpStyle.textTransform ) {
		styles.textTransform = parentHelpStyle.textTransform;
	}

	if( parentHelpStyle.family ) {
		styles.fontFamily = parentHelpStyle.family;
	}

	if( parentHelpStyle.fontStyle ) {
		styles.fontStyle = parentHelpStyle.fontStyle;
	}

	if( parentHelpStyle.letterSpacing ) {
		styles.letterSpacing = parentHelpStyle.letterSpacing + 'px';
	}

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
