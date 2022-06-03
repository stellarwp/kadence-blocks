/**
 * Import Css
 */
 import './editor.scss';

import FontIconPicker from '@fonticonpicker/react-fonticonpicker';

export default function IconPicker( { ...props } ) {
	return <FontIconPicker { ...props } />
}
