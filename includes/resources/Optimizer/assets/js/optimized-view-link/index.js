import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { external } from '@wordpress/icons';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { store as preferencesStore } from '@wordpress/preferences';
import { store as editorStore } from '@wordpress/editor';
import { addQueryArgs } from '@wordpress/url';
import { META_KEY, STATUS_OPTIMIZED } from '../meta/constants';

/**
 * Generate a link to view a post in its optimized state even if logged in.
 */
export default function OptimizedViewLink() {
	const { hasLoaded, permalink, isPublished, label, meta, showIconLabels } = useSelect((select) => {
		const editor = select(editorStore);
		const { get } = select(preferencesStore);

		// Get post type for label.
		const postTypeSlug = editor.getCurrentPostType();
		const postType = select(coreStore).getPostType(postTypeSlug);
		const postTypeLabel = postType?.labels?.singular_name || 'Post';
		const dynamicLabel = __('View Optimized', 'kadence-blocks') + ' ' + postTypeLabel;

		return {
			permalink: editor.getPermalink(),
			isPublished: editor.isCurrentPostPublished(),
			label: dynamicLabel,
			hasLoaded: !!postType,
			meta: editor.getEditedPostAttribute('meta'),
			showIconLabels: get('core', 'showIconLabels'),
		};
	}, []);

	if (!isPublished || !permalink || !hasLoaded) {
		return null;
	}

	if (meta !== undefined && meta[META_KEY] !== STATUS_OPTIMIZED) {
		return null;
	}

	const optimizerData = window.kbOptimizer || {};
	const nonce = optimizerData.token;

	const url = addQueryArgs(permalink, {
		perf_token: nonce,
		kb_optimizer_preview: 1,
	});

	return (
		<Button
			style={{ paddingLeft: 0 }}
			icon={external}
			iconPosition={'right'}
			label={label}
			href={url}
			target="_blank"
			showTooltip={!showIconLabels}
			size="compact"
		>
			{label}
		</Button>
	);
}
