/**
 * WordPress dependencies
 */
import {
	PanelBody
} from '@wordpress/components'
import { compose } from '@wordpress/compose'
import { withSelect, withDispatch } from '@wordpress/data'

function KadencePanelBody ({
	children,
	title,
	initialOpen = true,
	isOpened,
	toggleOpened,
	className = '',
	icon = '',
	buttonProps = {}
}) {

	return (
		<PanelBody
			title={ title }
			initialOpen={ initialOpen }
			onToggle={ toggleOpened }
			opened={ isOpened }
			className={ className }
			icon={ icon }
			buttonProps={ buttonProps }
		>
			{ children }
		</PanelBody>
	)
}

export default compose([
	withSelect((select, ownProps) => {
		return {
			isOpened: select('kadenceblocks/data').isEditorPanelOpened(ownProps.panelName + select('core/block-editor').getSelectedBlockClientId(), ownProps.initialOpen),
		}
	}),
	withDispatch((dispatch, ownProps, { select }) => {
		const { getSelectedBlockClientId } = select('core/block-editor')

		return {
			toggleOpened: () => {
				dispatch('kadenceblocks/data').toggleEditorPanelOpened(ownProps.panelName + getSelectedBlockClientId(), ownProps.initialOpen)
			},
		}
	})
])(KadencePanelBody)


