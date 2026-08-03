/**
 * The Style Library's route state: the active screen and the open settings item, read from and
 * written to the URL query string via the History API. No routing library.
 */

/**
 * WordPress dependencies
 */
import { useCallback, useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { parseRoute, serializeRoute } from '../helpers/route';

/**
 * Read and drive the app route.
 *
 * @since TBD
 *
 * @return {{route: {screen: string, item: string}, navigate: Function, replace: Function}} The
 *         current route plus the push/replace navigators, each taking a partial route object.
 */
export function useStyleLibraryRoute() {
	const [route, setRoute] = useState(() => parseRoute(window.location.href));

	useEffect(() => {
		const onPopState = () => setRoute(parseRoute(window.location.href));

		window.addEventListener('popstate', onPopState);

		return () => window.removeEventListener('popstate', onPopState);
	}, []);

	const apply = useCallback((partial, method) => {
		setRoute((current) => {
			const next = { ...current, ...partial };

			window.history[method](null, '', serializeRoute(next, window.location.href));

			return next;
		});
	}, []);

	const navigate = useCallback((partial) => apply(partial, 'pushState'), [apply]);
	const replace = useCallback((partial) => apply(partial, 'replaceState'), [apply]);

	return { route, navigate, replace };
}
