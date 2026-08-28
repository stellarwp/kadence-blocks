/* eslint-env jest */
/**
 * External dependencies
 */
import { act, createElement, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { useLinkedMeasureState } from '../use-linked-measure-state';

let container;
let root;

/**
 * Render the hook and expose its latest return value, plus a way to re-render with new props on the
 * SAME mounted instance — needed to exercise state that persists across renders (the mode override).
 *
 * @return {{box: {current: Object}, update: Function}} A ref-like box holding the hook's most recent
 *  return value, and an `update(props)` function that re-renders the same instance with new props.
 */
function renderHook(initialProps) {
	const box = {};

	function Probe(props) {
		box.current = useLinkedMeasureState(props);

		return null;
	}

	function render(props) {
		act(() => {
			root.render(createElement(StrictMode, null, createElement(Probe, props)));
		});
	}

	render(initialProps);

	return { box, update: render };
}

beforeEach(() => {
	global.IS_REACT_ACT_ENVIRONMENT = true;

	container = document.createElement('div');
	document.body.appendChild(container);
	root = createRoot(container);
});

afterEach(() => {
	if (root) {
		act(() => root.unmount());
	}

	container.remove();

	delete global.IS_REACT_ACT_ENVIRONMENT;
});

describe('useLinkedMeasureState', () => {
	/**
	 * An unset device value reads as linked: nothing is stored, so no slot differs from another. What
	 * those empty slots inherit is shown as one muted fallback, not split across four rows.
	 *
	 * @return {void}
	 */
	it('reads as linked when the device stores nothing', () => {
		const { box } = renderHook({
			forDevice: { attr: 'radius', value: ['', '', '', ''] },
			previewDevice: 'Desktop',
			setAttributes: jest.fn(),
		});

		expect(box.current.isLinked).toBe(true);
	});

	/**
	 * A uniform stored value reads as linked, from the stored value alone.
	 *
	 * @return {void}
	 */
	it('reads as linked when every stored slot matches', () => {
		const { box } = renderHook({
			forDevice: { attr: 'radius', value: ['4px', '4px', '4px', '4px'] },
			previewDevice: 'Desktop',
			setAttributes: jest.fn(),
		});

		expect(box.current.isLinked).toBe(true);
	});

	/**
	 * A stored slot that differs from the rest reads as individual.
	 *
	 * @return {void}
	 */
	it('reads as individual when a stored slot differs', () => {
		const { box } = renderHook({
			forDevice: { attr: 'radius', value: ['4px', '8px', '4px', '4px'] },
			previewDevice: 'Desktop',
			setAttributes: jest.fn(),
		});

		expect(box.current.isLinked).toBe(false);
	});

	/**
	 * A device that stores nothing opens LINKED regardless of what it inherits: its slots are empty
	 * because they inherit, and the inherited value is shown as one muted fallback rather than split
	 * across four blank rows.
	 *
	 * @return {void}
	 */
	it('reads an empty device as linked even when the inherited slots differ', () => {
		const { box } = renderHook({
			forDevice: { attr: 'tabletRadius', value: ['', '', '', ''] },
			previewDevice: 'Tablet',
			setAttributes: jest.fn(),
		});

		expect(box.current.isLinked).toBe(true);
	});

	/**
	 * Toggling link on an empty device never writes an attribute, whatever it inherits. The inherited
	 * value is only ever DISPLAYED (muted); writing it would turn that display fallback into a real
	 * stored override off a single link click — and, for a value carrying its own unit (`0.4em`) into
	 * an attribute whose unit lives beside it, would render with a doubled unit.
	 *
	 * @return {void}
	 */
	it('never writes an attribute when toggling link on an empty device', () => {
		const setAttributes = jest.fn();
		const { box } = renderHook({
			forDevice: { attr: 'tabletPadding', value: ['', '', '', ''] },
			previewDevice: 'Tablet',
			setAttributes,
		});

		// Unlink first, since an empty device now starts linked.
		act(() => box.current.toggleLink());
		expect(box.current.isLinked).toBe(false);

		act(() => box.current.toggleLink());

		expect(setAttributes).not.toHaveBeenCalled();
		expect(box.current.isLinked).toBe(true);
	});

	/**
	 * Unlinking a linked device leaves the stored value untouched and remembers 'individual' for that
	 * device, so a subsequent read reflects the toggle without any attribute write.
	 *
	 * @return {void}
	 */
	it('unlinking a linked device remembers individual mode without writing an attribute', () => {
		const setAttributes = jest.fn();
		const { box } = renderHook({
			forDevice: { attr: 'radius', value: ['4px', '4px', '4px', '4px'] },
			previewDevice: 'Desktop',
			setAttributes,
		});

		expect(box.current.isLinked).toBe(true);

		act(() => box.current.toggleLink());

		expect(setAttributes).not.toHaveBeenCalled();
		expect(box.current.isLinked).toBe(false);
	});

	/**
	 * The mode override is keyed per device, so unlinking Tablet must not affect Desktop's own linked
	 * state on the same hook instance.
	 *
	 * @return {void}
	 */
	it('keys the remembered override by device, leaving other devices unaffected', () => {
		const setAttributes = jest.fn();
		const { box, update } = renderHook({
			forDevice: { attr: 'tabletRadius', value: ['4px', '4px', '4px', '4px'] },
			previewDevice: 'Tablet',
			setAttributes,
		});

		expect(box.current.isLinked).toBe(true);

		act(() => box.current.toggleLink());

		expect(box.current.isLinked).toBe(false);

		update({
			forDevice: { attr: 'radius', value: ['4px', '4px', '4px', '4px'] },
			previewDevice: 'Desktop',
			setAttributes,
		});

		expect(box.current.isLinked).toBe(true);
	});

	/**
	 * A change to `resetOn` (e.g. a new preset selected) clears any remembered override, so the mode
	 * re-derives from the stored value alone.
	 *
	 * @return {void}
	 */
	it('clears the remembered override when resetOn changes', () => {
		const setAttributes = jest.fn();
		const { box, update } = renderHook({
			forDevice: { attr: 'radius', value: ['4px', '4px', '4px', '4px'] },
			previewDevice: 'Desktop',
			setAttributes,
			resetOn: 'preset-a',
		});

		act(() => box.current.toggleLink());

		expect(box.current.isLinked).toBe(false);

		update({
			forDevice: { attr: 'radius', value: ['4px', '4px', '4px', '4px'] },
			previewDevice: 'Desktop',
			setAttributes,
			resetOn: 'preset-b',
		});

		expect(box.current.isLinked).toBe(true);
	});
});
