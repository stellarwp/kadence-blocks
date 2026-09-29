/**
 * The item anchor registry: lets the settings popover find the element of the item it edits.
 * A screen renders the cards and the app root renders the popover, so the two never share a
 * parent. Each card registers its root element under its item id, and the app root reads it back
 * by the open route item. The registry is UI-only state and never reaches the route, the feed, or
 * the draft channel.
 */

/**
 * WordPress dependencies
 */
import { createContext, useCallback, useContext, useMemo, useRef, useState } from '@wordpress/element';

/**
 * The stable `register` / `unregister` pair. Split from the anchor map so a card that only
 * registers does not re-render every time another card registers. `null` with no provider mounted,
 * where registering is a no-op.
 *
 * @since TBD
 */
const RegistryActionsContext = createContext(null);

/**
 * The map of item id to `{ element, placement }`.
 *
 * @since TBD
 */
const AnchorsContext = createContext(null);

/**
 * Provide the anchor registry to the tree.
 *
 * @param {Object}      props          The component props.
 * @param {JSX.Element} props.children The tree that registers and reads anchors.
 *
 * @since TBD
 *
 * @return {JSX.Element} The provider.
 */
export function ItemAnchorProvider({ children }) {
	const [anchors, setAnchors] = useState(() => new Map());

	const actions = useMemo(
		() => ({
			register(id, element, placement) {
				setAnchors((current) => {
					const existing = current.get(id);

					if (existing && existing.element === element && existing.placement === placement) {
						return current;
					}

					const next = new Map(current);
					next.set(id, { element, placement });

					return next;
				});
			},
			unregister(id, element) {
				setAnchors((current) => {
					// A newer element may already hold the id (a card remounted); leave it alone.
					if (current.get(id)?.element !== element) {
						return current;
					}

					const next = new Map(current);
					next.delete(id);

					return next;
				});
			},
		}),
		[]
	);

	return (
		<RegistryActionsContext.Provider value={actions}>
			<AnchorsContext.Provider value={anchors}>{children}</AnchorsContext.Provider>
		</RegistryActionsContext.Provider>
	);
}

/**
 * Get a callback ref that registers the element under an item id while it is mounted.
 *
 * @param {string} id        The item id.
 * @param {string} placement The popover placement to use for this element, e.g. `right-start`.
 *
 * @since TBD
 *
 * @return {Function} A callback ref.
 */
export function useItemAnchorRef(id, placement) {
	const actions = useContext(RegistryActionsContext);
	const mountedRef = useRef(null);

	return useCallback(
		(element) => {
			// React 18 calls a callback ref with `null` on unmount and whenever the ref changes, so
			// the element to release is the one remembered from the last attach.
			if (!actions) {
				return;
			}

			if (element) {
				mountedRef.current = element;
				actions.register(id, element, placement);

				return;
			}

			if (mountedRef.current) {
				actions.unregister(id, mountedRef.current);
				mountedRef.current = null;
			}
		},
		[actions, id, placement]
	);
}

/**
 * Read the registered anchor for an item id.
 *
 * @param {string} id The item id.
 *
 * @since TBD
 *
 * @return {?{element: HTMLElement, placement: string}} The anchor, or null when none is registered.
 */
export function useItemAnchor(id) {
	const anchors = useContext(AnchorsContext);

	return anchors?.get(id) ?? null;
}

/**
 * Get a function that tells whether a node sits inside any registered item element. The settings
 * popover uses it to tell a click on another item apart from a click on nothing.
 *
 * @since TBD
 *
 * @return {Function} `(node) => boolean`.
 */
export function useIsInsideItemAnchor() {
	const anchors = useContext(AnchorsContext);

	return useCallback(
		(node) => {
			if (!anchors || !node) {
				return false;
			}

			return Array.from(anchors.values()).some(({ element }) => element.contains(node));
		},
		[anchors]
	);
}
