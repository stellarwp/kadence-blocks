import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/edit-post';
import { __ } from '@wordpress/i18n';
import { ToggleControl, PanelBody } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { kadenceNewIcon } from '@kadence/icons';
import { NAME, META_KEY } from './constants';

/**
 * Adds a Gutenberg plugin to exclude the current post from being optimized.
 *
 * @returns {JSX.Element|null}
 *
 * @constructor
 */
const OptimizerExcludeMeta = () => {
	const meta = useSelect((select) => select('core/editor').getEditedPostAttribute('meta'));
	const { editPost } = useDispatch('core/editor');

	if (meta === undefined) {
		return null;
	}

	return (
		<>
			<PluginSidebarMoreMenuItem target={NAME} icon={kadenceNewIcon}>
				{__('Kadence Optimizer', 'kadence-blocks')}
			</PluginSidebarMoreMenuItem>
			<PluginSidebar
				isPinnable={false}
				icon={kadenceNewIcon}
				name={NAME}
				title={__('Kadence Optimizer', 'kadence-blocks')}
			>
				<PanelBody>
					<ToggleControl
						label={__('Exclude this post from optimization', 'kadence-blocks')}
						checked={meta[META_KEY]}
						onChange={(value) => editPost({ meta: { [META_KEY]: value } })}
					/>
				</PanelBody>
			</PluginSidebar>
		</>
	);
};

export default OptimizerExcludeMeta;
