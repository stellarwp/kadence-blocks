import { subscribe, select } from '@wordpress/data';
import { doAction } from '@wordpress/hooks';
import { POST_SAVED_HOOK } from './constants';

// Are we inside any save right now?
let inProgress = false;
// Was this particular cycle an autosave?
let wasAutoSave = false;

/**
 * Create an action that fires once a Gutenberg post has been
 * saved as apparently Gutenberg doesn't have anything like this.
 */
subscribe(() => {
	const editor = select('core/editor');
	const isSaving = editor.isSavingPost();
	const isAutoNow = editor.isAutosavingPost();

	if (!inProgress && isSaving) {
		inProgress = true;
		wasAutoSave = isAutoNow;
	}

	if (inProgress && !isSaving) {
		// Fire only if it was not an autosave
		if (!wasAutoSave) {
			const status = editor.getEditedPostAttribute('status');

			if (status !== 'draft' && status !== 'auto-draft') {
				// Fire the custom JS hook
				doAction(POST_SAVED_HOOK, {
					post: editor.getCurrentPost(),
					permalink: editor.getPermalink(),
				});
			}
		}

		// Reset for the next cycle
		inProgress = false;
		wasAutoSave = false;
	}
});
