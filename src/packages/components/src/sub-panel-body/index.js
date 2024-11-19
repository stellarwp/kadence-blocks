
import './editor.scss';
export default function KadenceSubPanelBody( {
	children,
	title,
} ) {
	return (
		<div className="kb-sub-panel">
			{ title && (
				<h2 className="kb-sub-panel-title">{ title }</h2>
			)}
			<div className="kb-inner-sub-panel">
				{ children }
			</div>
		</div>
	)
}
