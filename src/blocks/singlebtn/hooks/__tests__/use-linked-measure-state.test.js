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

const TOKENS = [
	{ value: '4px', alias: 'sm' },
	{ value: '6px', alias: 'md' },
	{ value: '8px', alias: 'lg' },
];

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
	 * An unset device value reads as linked — every effective slot falls through to the same scalar
	 * preset value, so there is nothing to show as different.
	 *
	 * @return {void}
	 */
	it('reads as linked when the device stores nothing and the preset is a single scalar', () => {
		const { box } = renderHook({
			forDevice: { attr: 'radius', value: ['', '', '', ''] },
			inherited: { values: ['4px', '4px', '4px', '4px'], inherited: [false, false, false, false] },
			previewDevice: 'Desktop',
			presetValue: '4px',
			tokens: TOKENS,
			setAttributes: jest.fn(),
		});

		expect(box.current.isLinked).toBe(true);
	});

	/**
	 * A uniform stored value reads as linked, regardless of the preset.
	 *
	 * @return {void}
	 */
	it('reads as linked when every stored slot matches', () => {
		const { box } = renderHook({
			forDevice: { attr: 'radius', value: ['4px', '4px', '4px', '4px'] },
			inherited: { values: ['4px', '4px', '4px', '4px'], inherited: [false, false, false, false] },
			previewDevice: 'Desktop',
			presetValue: '8px',
			tokens: TOKENS,
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
			inherited: { values: ['4px', '4px', '4px', '4px'], inherited: [false, false, false, false] },
			previewDevice: 'Desktop',
			presetValue: '4px',
			tokens: TOKENS,
			setAttributes: jest.fn(),
		});

		expect(box.current.isLinked).toBe(false);
	});

	/**
	 * Linking an empty device whose inherited slots are uniform remembers the override without writing
	 * any attribute — writing would pin the device to another breakpoint's current value.
	 *
	 * @return {void}
	 */
	it('remembers a link toggle without writing an attribute when the inherited slots are uniform', () => {
		const setAttributes = jest.fn();
		const { box } = renderHook({
			forDevice: { attr: 'tabletRadius', value: ['', '', '', ''] },
			inherited: { values: ['6px', '6px', '6px', '6px'], inherited: [true, true, true, true] },
			previewDevice: 'Tablet',
			presetValue: ['4px', '8px', '4px', '4px'],
			tokens: TOKENS,
			setAttributes,
		});

		expect(box.current.isLinked).toBe(false);

		act(() => box.current.toggleLink());

		expect(setAttributes).not.toHaveBeenCalled();
		expect(box.current.isLinked).toBe(true);
	});

	/**
	 * Linking an empty device whose inherited slots differ collapses them by writing the first
	 * inherited slot (resolved to its token alias) into every slot, so the control and the preset
	 * agree.
	 *
	 * @return {void}
	 */
	it('collapses to the first inherited slot when linking an empty device with differing inherited slots', () => {
		const setAttributes = jest.fn();
		const { box } = renderHook({
			forDevice: { attr: 'tabletRadius', value: ['', '', '', ''] },
			inherited: { values: ['6px', '8px', '6px', '6px'], inherited: [true, true, true, true] },
			previewDevice: 'Tablet',
			presetValue: ['4px', '8px', '4px', '4px'],
			tokens: TOKENS,
			setAttributes,
		});

		expect(box.current.isLinked).toBe(false);

		act(() => box.current.toggleLink());

		expect(setAttributes).toHaveBeenCalledWith({ tabletRadius: ['md', 'md', 'md', 'md'] });
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
			inherited: { values: ['4px', '4px', '4px', '4px'], inherited: [false, false, false, false] },
			previewDevice: 'Desktop',
			presetValue: '4px',
			tokens: TOKENS,
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
			inherited: { values: ['4px', '4px', '4px', '4px'], inherited: [false, false, false, false] },
			previewDevice: 'Tablet',
			presetValue: '4px',
			tokens: TOKENS,
			setAttributes,
		});

		expect(box.current.isLinked).toBe(true);

		act(() => box.current.toggleLink());

		expect(box.current.isLinked).toBe(false);

		update({
			forDevice: { attr: 'radius', value: ['4px', '4px', '4px', '4px'] },
			inherited: { values: ['4px', '4px', '4px', '4px'], inherited: [false, false, false, false] },
			previewDevice: 'Desktop',
			presetValue: '4px',
			tokens: TOKENS,
			setAttributes,
		});

		expect(box.current.isLinked).toBe(true);
	});

	/**
	 * A change to `resetOn` (e.g. a new preset selected) clears any remembered override, so the mode
	 * re-derives from the stored value and preset alone.
	 *
	 * @return {void}
	 */
	it('clears the remembered override when resetOn changes', () => {
		const setAttributes = jest.fn();
		const { box, update } = renderHook({
			forDevice: { attr: 'radius', value: ['4px', '4px', '4px', '4px'] },
			inherited: { values: ['4px', '4px', '4px', '4px'], inherited: [false, false, false, false] },
			previewDevice: 'Desktop',
			presetValue: '4px',
			tokens: TOKENS,
			setAttributes,
			resetOn: 'preset-a',
		});

		act(() => box.current.toggleLink());

		expect(box.current.isLinked).toBe(false);

		update({
			forDevice: { attr: 'radius', value: ['4px', '4px', '4px', '4px'] },
			inherited: { values: ['4px', '4px', '4px', '4px'], inherited: [false, false, false, false] },
			previewDevice: 'Desktop',
			presetValue: '4px',
			tokens: TOKENS,
			setAttributes,
			resetOn: 'preset-b',
		});

		expect(box.current.isLinked).toBe(true);
	});
});
