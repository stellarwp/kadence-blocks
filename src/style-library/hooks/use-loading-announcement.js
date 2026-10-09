/**
 * Announce a loading skeleton's completion to screen readers. Every skeleton in this app already
 * lives inside its own `role="status"` region, so its "Loading X…" label is announced while it is
 * showing — but the moment the real content replaces it, that region is gone from the DOM too,
 * leaving nothing to tell a screen reader user the load actually finished. This hook holds its own
 * persistent, visually-hidden live-region node (created on mount, removed on unmount) so the
 * completion announcement survives the skeleton's own unmount.
 */

/**
 * WordPress dependencies
 */
import { useEffect, useRef } from '@wordpress/element';

/**
 * Announce once the loading state this hook is paired with flips from busy to idle. Call
 * unconditionally near the top of a component — before any early return — the same as any other
 * hook; the message is only ever written to the DOM on a true→false transition, never on mount
 * with an already-idle state and never while still loading.
 *
 * @param {boolean} isLoading Whether the paired skeleton is currently showing.
 * @param {string}  message   The exact text to announce once loading finishes (e.g. "Color Palette loaded.").
 *
 * @since TBD
 */
export function useLoadingAnnouncement(isLoading, message) {
	const nodeRef = useRef(null);
	const wasLoading = useRef(isLoading);

	useEffect(() => {
		const node = document.createElement('div');
		node.className = 'screen-reader-text';
		node.setAttribute('role', 'status');
		node.setAttribute('aria-live', 'polite');
		document.body.appendChild(node);
		nodeRef.current = node;

		return () => {
			document.body.removeChild(node);
			nodeRef.current = null;
		};
	}, []);

	useEffect(() => {
		if (wasLoading.current && !isLoading && nodeRef.current) {
			nodeRef.current.textContent = message;
		}

		wasLoading.current = isLoading;
	}, [isLoading, message]);
}
