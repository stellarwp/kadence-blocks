/**
 * The edited Global Styles record, the one module that uses core-data's
 * experimental Global Styles selector.
 */
import { useSelect } from '@wordpress/data';

/**
 * @param {boolean} enabled Whether to read the record at all.
 * @return {Object|undefined} The edited user Global Styles record, undefined while it loads or when disabled.
 */
export function useGlobalStylesRecord(enabled = true) {
	return useSelect(
		(select) => {
			if (!enabled) {
				return undefined;
			}

			const core = select('core');
			// eslint-disable-next-line no-underscore-dangle -- Core has no stable selector for the current Global Styles ID.
			const id = core.__experimentalGetCurrentGlobalStylesId?.();

			return id ? core.getEditedEntityRecord('root', 'globalStyles', id) : undefined;
		},
		[enabled]
	);
}

/**
 * @return {{id: (number|undefined), record: (Object|undefined)}} The current Global Styles ID and its edited record.
 */
export function useGlobalStylesEntity() {
	return useSelect((select) => {
		const core = select('core');
		// eslint-disable-next-line no-underscore-dangle -- Core has no stable selector for the current Global Styles ID.
		const id = core.__experimentalGetCurrentGlobalStylesId?.();

		return { id, record: id ? core.getEditedEntityRecord('root', 'globalStyles', id) : undefined };
	}, []);
}
