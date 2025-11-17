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
	const savedMeta = useSelect((select) => select('core/editor').getCurrentPostAttribute('meta'));
	const { editPost } = useDispatch('core/editor');
	const originalMetaValue = useRef(null);

	// Capture the original meta value when it first becomes available, before any edits.
	useEffect(() => {
		if (savedMeta !== undefined && originalMetaValue.current === null) {
			// Capture the value from the saved post, not the edited version
			if (savedMeta && savedMeta[META_KEY] !== undefined) {
				originalMetaValue.current = savedMeta[META_KEY];
			} else {
				// If no saved value exists, default to unoptimized
				originalMetaValue.current = STATUS_UNOPTIMIZED;
			}
		}
	}, [savedMeta]);

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
							if (value) {
								// When checking, set to excluded
								editPost({ meta: { [META_KEY]: STATUS_EXCLUDED } });
							} else {
								// When unchecking, restore to original value (or unoptimized if original was excluded)
								const restoreValue =
									originalMetaValue.current !== null && originalMetaValue.current !== STATUS_EXCLUDED
										? originalMetaValue.current
										: STATUS_UNOPTIMIZED;
								editPost({ meta: { [META_KEY]: restoreValue } });
							}
						}}
					/>

					<OptimizedViewLink />
				</PanelBody>
			</PluginSidebar>
		</>
	);
};

export default OptimizerExcludeMeta;
