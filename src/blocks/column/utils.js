import { __ } from '@wordpress/i18n';


export function getPreviewGutterSize( previewDevice, columnGutter, customGutter, gutterType ) {
	const columnGutterString = ( undefined !== columnGutter ? columnGutter : 'unset' );
	let gutter = '0';
	switch ( columnGutterString ) {
		case 'none':
			gutter = 0;
			break;
		case 'sm':
			gutter = 'var(--global-row-gutter-sm, 1rem)';
			break;
		case 'md':
			gutter = 'var(--global-row-gutter-md, 2rem)';
			break;
		case 'lg':
			gutter = 'var(--global-row-gutter-lg, 4rem)';
			break;
		case 'custom':
			const gutterUnit = ( undefined !== gutterType && gutterType ? gutterType : 'px' );
			let custom = ( undefined !== customGutter && undefined !== customGutter[0] ? customGutter[0] : 30 );
			if ( 'Tablet' === previewDevice ) {
				custom = ( undefined !== customGutter && undefined !== customGutter[1] && '' !== customGutter[1] ? customGutter[1] : custom );
			} else if ( 'Mobile' === previewDevice ) {
				custom = ( undefined !== customGutter && undefined !== customGutter[2] && '' !== customGutter[2] ? customGutter[2] : custom );
			}
			if ( custom ) {
				custom = custom + gutterUnit;
			}
			gutter = custom;
			break;
	}
	return gutter;
}
