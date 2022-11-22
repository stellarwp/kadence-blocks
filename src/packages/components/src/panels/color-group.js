/**
 * Import Css
 */
 import './editor.scss';
 
export default function ColorGroup({
		children,
	}) {
	return (
		<div className={ 'components-base-control kadence-color-group' }>
			{ children }
		</div>
	)
}


