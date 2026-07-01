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
 * Manage user-primitive mutations (create, delete, rename) and version tracking.
 *
 * @since TBD
 *
 * @param {string} initialVersion Feed version string from the localized payload.
 * @param {string} slug           Token set slug.
 * @return {{ version: string, isPending: boolean, fetchPreview: Function, createPrimitive: Function, deletePrimitive: Function, renamePrimitive: Function }}
 */
export function useUserPrimitiveEditor(initialVersion, slug) {
	const [version, setVersion] = useState(initialVersion);
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
					setVersion(data.version);
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
		[slug, version]
	);

	const deletePrimitive = useCallback(
		async (id, previewVersion) => {
			setIsPending(true);

			try {
				const data = await deleteUserPrimitive(slug, id, previewVersion);

				if (data?.version) {
					setVersion(data.version);
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
		[slug]
	);

	const renamePrimitive = useCallback(
		async (id, payload) => {
			setIsPending(true);

			try {
				const data = await renameUserPrimitive(slug, id, { ...payload, version });

				if (data?.version) {
					setVersion(data.version);
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
		[slug, version]
	);

	return {
		version,
		isPending,
		fetchPreview,
		createPrimitive,
		deletePrimitive,
		renamePrimitive,
	};
}
