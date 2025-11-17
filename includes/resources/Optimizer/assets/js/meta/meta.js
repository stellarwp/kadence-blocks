import { useEffect, useRef } from '@wordpress/element';
import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/editor';
import { __ } from '@wordpress/i18n';
import { ToggleControl, PanelBody } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { kadenceNewIcon } from '@kadence/icons';
import { NAME, META_KEY, STATUS_EXCLUDED, STATUS_UNOPTIMIZED } from './constants';
import OptimizedViewLink from '../optimized-view-link';

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
	const originalMetaValue = useRef(null);

	// Capture the original meta value when it first becomes available.
	useEffect(() => {
		if (meta !== undefined && originalMetaValue.current === null && meta[META_KEY] !== undefined) {
			originalMetaValue.current = meta[META_KEY];
		}
	}, [meta]);

	if (meta === undefined) {
		return null;
	}

	return (
		<>
			<PluginSidebarMoreMenuItem target={NAME} icon={kadenceNewIcon}>
				{__('Kadence Performance Optimizer', 'kadence-blocks')}
			</PluginSidebarMoreMenuItem>
			<PluginSidebar
				isPinnable={true}
				icon={kadenceNewIcon}
				name={NAME}
				title={__('Optimizer Settings', 'kadence-blocks')}
			>
				<PanelBody>
					<ToggleControl
						label={__('Exclude this post from optimization', 'kadence-blocks')}
						checked={meta[META_KEY] === STATUS_EXCLUDED}
						onChange={(value) => {
							const fallbackValue =
								originalMetaValue.current !== null ? originalMetaValue.current : STATUS_UNOPTIMIZED;
							editPost({ meta: { [META_KEY]: value ? STATUS_EXCLUDED : fallbackValue } });
						}}
					/>

					<OptimizedViewLink />
				</PanelBody>
			</PluginSidebar>
		</>
	);
};

export default OptimizerExcludeMeta;
