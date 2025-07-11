/**
 * WordPress dependencies
 */
import { PanelBody } from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { withSelect, withDispatch } from '@wordpress/data';
import { showSettings } from '@kadence/helpers';
import { get } from 'lodash';
import { proIcon } from '@kadence/icons';

function KadencePanelBody({
	children,
	title,
	initialOpen = true,
	isOpened,
	toggleOpened,
	className = '',
	icon = '',
	buttonProps = {},
	blockSlug = false,
	index = false,
	proTag = false,
	panelName,
}) {
	/* If the block slug is set, check the panel name against the allowed settings for the user */
	if (blockSlug !== false && !showSettings(panelName, blockSlug)) {
		return null;
	}

	if (proTag) {
		buttonProps.icon = proIcon;
		buttonProps.iconPosition = 'right';
	}

	return (
		<PanelBody
			title={title}
			initialOpen={initialOpen}
			onToggle={toggleOpened}
			opened={isOpened}
			className={className}
			icon={icon}
			buttonProps={buttonProps}
		>
			{children}
		</PanelBody>
	);
}

export default compose([
	withSelect((select, ownProps) => {
		const initialOpen = undefined !== ownProps.initialOpen ? ownProps.initialOpen : true;
		const index = get(ownProps, ['index'], '');

		return {
			isOpened: select('kadenceblocks/data').isEditorPanelOpened(
				ownProps.panelName + index + select('core/block-editor').getSelectedBlockClientId(),
				initialOpen
			),
		};
	}),
	withDispatch((dispatch, ownProps, { select }) => {
		const { getSelectedBlockClientId } = select('core/block-editor');
		const initialOpen = undefined !== ownProps.initialOpen ? ownProps.initialOpen : true;
		const index = get(ownProps, ['index'], '');

		return {
			toggleOpened: () => {
				dispatch('kadenceblocks/data').toggleEditorPanelOpened(
					ownProps.panelName + index + getSelectedBlockClientId(),
					initialOpen
				);
			},
		};
	}),
])(KadencePanelBody);
