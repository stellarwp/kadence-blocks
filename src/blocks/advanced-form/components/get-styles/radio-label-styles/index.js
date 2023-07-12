import { getPreviewSize, KadenceColorOutput, getFontSizeOptionOutput } from '@kadence/helpers';
import { get, isEmpty } from 'lodash';

export default ( previewDevice, radioLabelFont ) => {

	let styles = {};
	if ( ! isEmpty( radioLabelFont, 'color' ) ) {
		styles.color = KadenceColorOutput( radioLabelFont.color );
	} else {
		styles.color = 'undefined';
	}

	styles.fontSize = getFontSizeOptionOutput( getPreviewSize( previewDevice, radioLabelFont.size[ 0 ], radioLabelFont.size[ 1 ], radioLabelFont.size[ 2 ] ), get( radioLabelFont, 'sizeType', 'px') );

	let lineHeight = getPreviewSize( previewDevice, radioLabelFont?.lineHeight?.[0], radioLabelFont?.lineHeight?.[1], radioLabelFont?.lineHeight?.[2] );
	if( lineHeight ){
		styles.lineHeight = lineHeight + get( radioLabelFont, 'lineType', '');
	}
	let letterSpacing = getPreviewSize( previewDevice, radioLabelFont?.letterSpacing?.[0], radioLabelFont?.letterSpacing?.[1], radioLabelFont?.letterSpacing?.[2] );
	if ( letterSpacing ){
		styles.letterSpacing = letterSpacing + get( radioLabelFont, 'letterType', 'px');
	}

	styles.fontWeight = radioLabelFont.weight ? radioLabelFont.weight : undefined;
	styles.textTransform = radioLabelFont.textTransform ? radioLabelFont.textTransform : undefined;
	styles.fontFamily = radioLabelFont.family ? radioLabelFont.family : undefined;
	styles.fontStyle = radioLabelFont.fontStyle ? radioLabelFont.fontStyle : undefined;


	return styles;

}
