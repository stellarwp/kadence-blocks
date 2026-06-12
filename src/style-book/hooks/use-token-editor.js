/**
 * WordPress dependencies
 */
import { useCallback, useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { saveTokenLeaf, fetchResolvedTokens } from '../api/client';
import { buildTokenLeaf } from '../helpers/tokens';
import { DEFAULT_TOKEN_SET_SLUG } from '../constants';

/**
 * Manage token save state and refresh resolved values after writes.
 *
 * @param {{ namespace: string }|null} rest REST descriptor from the feed.
 * @param {Record<string, string>}   initialValues Resolved values keyed by token id.
 * @return {{ values: Record<string, string>, saveToken: Function, getFieldState: Function }}
 */
export function useTokenEditor( rest, initialValues ) {
	const [ values, setValues ] = useState( initialValues );
	const [ fieldState, setFieldState ] = useState( {} );

	useEffect( () => {
		setValues( initialValues );
	}, [ initialValues ] );

	const refreshValues = useCallback( async () => {
		if ( ! rest?.namespace ) {
			return;
		}

		const resolved = await fetchResolvedTokens( rest.namespace, DEFAULT_TOKEN_SET_SLUG );
		setValues( resolved?.by_id ?? {} );
	}, [ rest ] );

	const saveToken = useCallback(
		async ( tokenId, type, nextValue ) => {
			if ( ! rest?.namespace ) {
				return { ok: false, error: 'missing_rest' };
			}

			setFieldState( ( current ) => ( {
				...current,
				[ tokenId ]: { status: 'saving', error: null },
			} ) );

			try {
				await saveTokenLeaf(
					rest.namespace,
					tokenId,
					buildTokenLeaf( type, nextValue ),
					DEFAULT_TOKEN_SET_SLUG
				);

				await refreshValues();

				setFieldState( ( current ) => ( {
					...current,
					[ tokenId ]: { status: 'saved', error: null },
				} ) );

				return { ok: true };
			} catch ( error ) {
				const message = error?.message || 'Save failed.';

				setFieldState( ( current ) => ( {
					...current,
					[ tokenId ]: { status: 'error', error: message },
				} ) );

				return { ok: false, error: message };
			}
		},
		[ rest, refreshValues ]
	);

	const getFieldState = useCallback(
		( tokenId ) => fieldState[ tokenId ] ?? { status: 'idle', error: null },
		[ fieldState ]
	);

	return {
		values,
		saveToken,
		getFieldState,
	};
}
