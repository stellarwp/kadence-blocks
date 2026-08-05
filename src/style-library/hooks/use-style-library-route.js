/**
 * The Style Library's route state: the active screen, the screen's own sub-selection (`scope`),
 * and the open settings item, read from and written to the URL query string via the History API.
 * No routing library. This hook is a thin wrapper over `helpers/route.js` — `navigate`/`replace`
 * merge whatever partial route object a caller passes onto the current one, so a new route field
 * (like `scope`) needs no change here to be carried through.
 */

/**
 * WordPress dependencies
 */
import { useCallback, useEffect, useRef, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { parseRoute, serializeRoute } from '../helpers/route';

/**
 * Read and drive the app route.
 *
 * @since TBD
 *
 * @return {{route: {screen: string, scope: string, item: string}, navigate: Function, replace: Function}}
 *         The current route plus the push/replace navigators, each taking a partial route object.
 */
export function useStyleLibraryRoute() {
	const [route, setRoute] = useState(() => parseRoute(window.location.href));
	// The live route, kept alongside the state so a navigator can merge its partial without reading
	// `route` through a state updater. A `setState` updater must be pure: StrictMode runs it twice, which
	// would push the same entry onto the history stack twice and make Back appear to do nothing. The ref
	// is written synchronously here rather than in an effect, so two navigations in one tick still
	// compose instead of the second overwriting the first.
	const routeRef = useRef(route);

	useEffect(() => {
		const onPopState = () => {
			const next = parseRoute(window.location.href);

			routeRef.current = next;
			setRoute(next);
		};

		window.addEventListener('popstate', onPopState);

		return () => window.removeEventListener('popstate', onPopState);
	}, []);

	const apply = useCallback((partial, method) => {
		const next = { ...routeRef.current, ...partial };

		routeRef.current = next;

		window.history[method](null, '', serializeRoute(next, window.location.href));

		setRoute(next);
	}, []);

	const navigate = useCallback((partial) => apply(partial, 'pushState'), [apply]);
	const replace = useCallback((partial) => apply(partial, 'replaceState'), [apply]);

	return { route, navigate, replace };
}
