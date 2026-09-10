/**
 * The active breakpoint, shared by every responsive control under one provider.
 *
 * Switching to Tablet on one control switches all of them. The breakpoint is a property of what the
 * user is currently looking at, not of an individual field, so two responsive controls in the same
 * panel must never disagree about it — the block editor already behaves this way and this is what
 * gives the Style Library the same behavior.
 *
 * The provider works either way round. Left alone it holds the breakpoint itself, which is all the
 * Style Library needs. Given `value` and `onChange` it defers to the host instead, which is the seam
 * the block editor needs: there the active device already lives in the editor's own store, and this
 * has to follow that rather than compete with it.
 *
 * A control with no provider above it falls back to its own local state, so it still works when
 * rendered standalone.
 */

/**
 * WordPress dependencies
 */
import { createContext, useContext, useMemo, useState } from '@wordpress/element';

/**
 * The shared breakpoint context. Null when no provider is mounted, which is what tells a consumer to
 * fall back to local state.
 *
 * @since TBD
 */
const BreakpointContext = createContext(null);

/**
 * Share one active breakpoint across every responsive control rendered inside.
 *
 * @param {Object}    props              The component props.
 * @param {Element}   props.children     The subtree whose controls share the breakpoint.
 * @param {?string}   [props.value]      The active breakpoint, when the host owns it.
 * @param {?Function} [props.onChange]   Called with the next breakpoint, when the host owns it.
 * @param {string}    [props.defaultValue] The breakpoint to start on when the provider owns it.
 *
 * @since TBD
 *
 * @return {JSX.Element} The provider.
 */
export function BreakpointProvider({ children, value = null, onChange = null, defaultValue = 'desktop' }) {
	const [internal, setInternal] = useState(defaultValue);
	const controlled = value !== null && typeof onChange === 'function';
	const breakpoint = controlled ? value : internal;
	const setBreakpoint = controlled ? onChange : setInternal;

	const shared = useMemo(() => ({ breakpoint, setBreakpoint }), [breakpoint, setBreakpoint]);

	return <BreakpointContext.Provider value={shared}>{children}</BreakpointContext.Provider>;
}

/**
 * Read and write the active breakpoint, falling back to the caller's own state when no provider is
 * mounted above it.
 *
 * The local fallback is created unconditionally because hooks cannot be called conditionally; it is
 * simply ignored whenever a provider is present.
 *
 * @param {string} [defaultValue] The breakpoint the local fallback starts on.
 *
 * @since TBD
 *
 * @return {[string, Function]} The active breakpoint and its setter.
 */
export function useBreakpoint(defaultValue = 'desktop') {
	const shared = useContext(BreakpointContext);
	const [local, setLocal] = useState(defaultValue);

	if (shared) {
		return [shared.breakpoint, shared.setBreakpoint];
	}

	return [local, setLocal];
}
