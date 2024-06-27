
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as blocksStore, hasBlockSupport } from '@wordpress/blocks';
import { InspectorControls } from '@wordpress/block-editor';
import { ToggleControl, PanelBody } from '@wordpress/components';
import { assign } from 'lodash';
import { createHigherOrderComponent } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';
/**
 * Add lazy attribute
 *
 * @param {array} settings The block settings.
 * @returns {array} The block settings with animation added.
 */
export function lazyRenderAttribute( settings ) {
	if ( hasBlockSupport( settings, 'kblazy' ) ) {
		settings.attributes = assign( settings.attributes, {
			kbLazyRender: {
				type: 'boolean',
				default: false,
			},
		} );
	}
	return settings;
}
addFilter( 'blocks.registerBlockType', 'kadence/lazyRender', lazyRenderAttribute );

/**
 * Build the block css control
 */
const LazyRenderComponent = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		if (!props.isSelected) {
			return <BlockEdit {...props} />;
		}
		const { hasLazySupport, openTab } = useSelect((select) => {
			const hasSupport = select(blocksStore).hasBlockSupport(props.name, 'kblazy');
			let openTab = 'general';
			if (hasSupport) {
				openTab =
					typeof select('kadenceblocks/data').getOpenSidebarTabKey === 'function'
						? select('kadenceblocks/data').getOpenSidebarTabKey(
								props.name.replace('kadence/', '') +
									select('core/block-editor').getSelectedBlockClientId(),
								'general'
						  )
						: 'advanced';
			}
			return {
				hasLazySupport: hasSupport,
				openTab,
			};
		}, []);
		if (hasLazySupport && openTab == 'advanced' && showSettings('show', 'kadence/lazyrender')) {
			const {
				attributes: { kbLazyRender },
				setAttributes,
			} = props;
			return (
				<>
					<BlockEdit {...props} />
					<InspectorControls>
						<PanelBody title={__('Lazy Render', 'kadence-blocks')} initialOpen={false}>
							<ToggleControl
								label={__('Enable Lazy Render', 'kadence-blocks')}
								help={__('Do not enable for areas that are displayed on load.', 'kadence-blocks')}
								checked={kbLazyRender}
								onChange={(value) => {
									setAttributes({ kbLazyRender: value });
								}}
							/>
						</PanelBody>
					</InspectorControls>
				</>
			);
		}
		return <BlockEdit {...props} />;
	};
}, 'LazyRenderComponent');
addFilter('editor.BlockEdit', 'kadence/lazyRenderControls', LazyRenderComponent);