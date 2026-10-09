/* eslint-env jest */
/**
 * External dependencies
 */
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { SlotGlyph } from '../atoms/SlotGlyph';
import { SLOT_LABELS } from '../helpers/value-shapes';

let container;
let root;

beforeEach(() => {
	global.IS_REACT_ACT_ENVIRONMENT = true;
	container = document.createElement('div');
	document.body.appendChild(container);
	root = createRoot(container);
});

afterEach(() => {
	act(() => root.unmount());
	container.remove();
	delete global.IS_REACT_ACT_ENVIRONMENT;
});

/**
 * Render a `SlotGlyph` and return its svg element.
 *
 * @param {Object} props The glyph props.
 *
 * @since TBD
 *
 * @return {SVGElement} The rendered svg.
 */
function renderGlyph(props = {}) {
	act(() => {
		root.render(createElement(SlotGlyph, props));
	});

	return container.querySelector('svg');
}

/**
 * The positions of the parts currently at full opacity.
 *
 * @param {SVGElement} svg The rendered svg.
 *
 * @since TBD
 *
 * @return {string[]} The active positions.
 */
function activePositions(svg) {
	return [...svg.querySelectorAll('.kb-token-control__glyph-part.is-active')].map((part) =>
		part.getAttribute('data-position')
	);
}

describe('SlotGlyph', () => {
	it('renders an svg with the family viewBox', () => {
		expect(renderGlyph({ role: 'sides' }).getAttribute('viewBox')).toBe('0 0 20 20');
		expect(renderGlyph({ role: 'corners' }).getAttribute('viewBox')).toBe('0 0 24 24');
	});

	it.each(['sides', 'corners'])('renders four parts in SLOT_LABELS order for %s', (role) => {
		const svg = renderGlyph({ role });
		const parts = [...svg.querySelectorAll('.kb-token-control__glyph-part')];

		expect(parts.map((part) => part.getAttribute('data-position'))).toEqual(SLOT_LABELS[role]);
	});

	it('gives every part the export geometry', () => {
		const sides = renderGlyph({ role: 'sides' });

		sides.querySelectorAll('path').forEach((path) => expect(path.getAttribute('d')).not.toBe(''));
		expect(sides.querySelector('[data-position="top"]').getAttribute('d')).toMatch(/^M13\.75 3\.75/);

		const corners = renderGlyph({ role: 'corners' });

		corners.querySelectorAll('path').forEach((path) => expect(path.getAttribute('d')).not.toBe(''));
		expect(corners.querySelector('[data-position="top-left"]').getAttribute('d')).toMatch(/^M5\.75 6C/);
	});

	it('highlights one part for a named position', () => {
		expect(activePositions(renderGlyph({ role: 'sides', position: 'right' }))).toEqual(['right']);
	});

	it('highlights one corner for a corners position', () => {
		expect(activePositions(renderGlyph({ role: 'corners', position: 'bottom-left' }))).toEqual(['bottom-left']);
	});

	it.each(['sides', 'corners'])('highlights every part for "all" with the %s role', (role) => {
		expect(activePositions(renderGlyph({ role, position: 'all' }))).toEqual(SLOT_LABELS[role]);
	});

	it('falls back to the sides geometry for an unknown role', () => {
		expect(renderGlyph({ role: 'nope' }).getAttribute('viewBox')).toBe('0 0 20 20');
	});

	it('is decorative', () => {
		const svg = renderGlyph();

		expect(svg.getAttribute('aria-hidden')).toBe('true');
		expect(svg.getAttribute('focusable')).toBe('false');
	});

	it('paints with currentColor', () => {
		expect(renderGlyph().getAttribute('fill')).toBe('currentColor');
	});

	it('keeps the identifying classes', () => {
		const svg = renderGlyph({ role: 'corners', position: 'top-right' });

		expect(svg.classList.contains('kb-token-control__glyph')).toBe(true);
		expect(svg.classList.contains('kb-token-control__glyph--corners')).toBe(true);
		expect(svg.classList.contains('kb-token-control__glyph--top-right')).toBe(true);
	});
});
