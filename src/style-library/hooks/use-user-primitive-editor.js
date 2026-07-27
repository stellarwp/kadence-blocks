/**
 * WordPress dependencies
 */
import { useCallback, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
	createUserPrimitive,
	deleteUserPrimitive,
	fetchUserPrimitiveReferences,
	renameUserPrimitive,
} from '../api/client';

const HTTP_CONFLICT = 409;

/**
 * Manage user-primitive mutations (create, delete, rename).
 *
 * `version` is a controlled value owned by the caller rather than local state: the document
 * version also changes from writes made outside this hook (e.g. a semantic-token edit), so a
 * copy tracked only from this hook's own responses can go stale and trip the write guard with a
 * false-positive conflict. `onVersionChange` reports this hook's own successful writes back to
 * that shared value.
 *
 * @since TBD
 *
 * @param {string}   version          Current document version, from the shared version state.
 * @param {string}   slug             Token set slug.
 * @param {Function} onVersionChange  Called with the latest document version after a successful write.
 * @return {{ isPending: boolean, fetchPreview: Function, createPrimitive: Function, deletePrimitive: Function, renamePrimitive: Function }}
 */
export function useUserPrimitiveEditor(version, slug, onVersionChange) {
	const [isPending, setIsPending] = useState(false);

	const fetchPreview = useCallback(
		async (id) => {
			try {
				const data = await fetchUserPrimitiveReferences(slug, id);
				return { ok: true, data };
			} catch (error) {
				return { ok: false, error: error?.message ?? 'Preview failed.' };
			}
		},
		[slug]
	);

	const createPrimitive = useCallback(
		async (payload) => {
			setIsPending(true);

			try {
				const data = await createUserPrimitive(slug, { ...payload, version });

				if (data?.version) {
					onVersionChange?.(data.version);
				}

				return { ok: true, data };
			} catch (error) {
				const isConflict = error?.data?.status === HTTP_CONFLICT;

				return {
					ok: false,
					isConflict,
					error: error?.message ?? 'Create failed.',
				};
			} finally {
				setIsPending(false);
			}
		},
		[slug, version, onVersionChange]
	);

	const deletePrimitive = useCallback(
		async (id, previewVersion) => {
			setIsPending(true);

			try {
				const data = await deleteUserPrimitive(slug, id, previewVersion);

				if (data?.version) {
					onVersionChange?.(data.version);
				}

				return { ok: true, data };
			} catch (error) {
				const isConflict = error?.data?.status === HTTP_CONFLICT;

				return {
					ok: false,
					isConflict,
					error: error?.message ?? 'Delete failed.',
				};
			} finally {
				setIsPending(false);
			}
		},
		[slug, onVersionChange]
	);

	const renamePrimitive = useCallback(
		async (id, payload) => {
			setIsPending(true);

			try {
				const data = await renameUserPrimitive(slug, id, { ...payload, version });

				if (data?.version) {
					onVersionChange?.(data.version);
				}

				return { ok: true, data };
			} catch (error) {
				const isConflict = error?.data?.status === HTTP_CONFLICT;

				return {
					ok: false,
					isConflict,
					error: error?.message ?? 'Rename failed.',
				};
			} finally {
				setIsPending(false);
			}
		},
		[slug, version, onVersionChange]
	);

	return {
		isPending,
		fetchPreview,
		createPrimitive,
		deletePrimitive,
		renamePrimitive,
	};
}
