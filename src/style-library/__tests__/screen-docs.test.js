/* eslint-env jest */
/**
 * WordPress dependencies
 */
import { addFilter, removeFilter } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import { SCREEN_DOCS, SCREEN_DOCS_FILTER } from '../constants/screen-docs';
import { screenDoc } from '../helpers/screen-docs';

describe('SCREEN_DOCS', () => {
	/**
	 * Every catalog entry can be rendered: a sentence to show and an https link to point at.
	 *
	 * @return {void}
	 */
	it('gives every catalog entry a sentence and an https documentation URL', () => {
		const entries = Object.entries(SCREEN_DOCS);

		expect(entries).toHaveLength(13);

		entries.forEach(([screenId, doc]) => {
			expect(typeof doc.description).toBe('string');
			expect(doc.description.length).toBeGreaterThan(0);
			expect(doc.docUrl).toMatch(/^https:\/\//);
			expect(screenId).not.toBe('');
		});
	});

	/**
	 * The catalog covers every screen this plugin ships — the seven Base Styles screens and the
	 * six block-preset screens — so no shipped screen renders without helper copy.
	 *
	 * @return {void}
	 */
	it('covers the seven base styles screens and the six preset screens', () => {
		expect(Object.keys(SCREEN_DOCS).sort()).toEqual(
			[
				'blocks/kadence/advancedheading',
				'blocks/kadence/column',
				'blocks/kadence/image',
				'blocks/kadence/rowlayout',
				'blocks/kadence/single-icon',
				'blocks/kadence/singlebtn',
				'border-radius',
				'border-width',
				'color-palette',
				'icon-sizes',
				'shadow',
				'spacing',
				'typography',
			].sort()
		);
	});
});

describe('screenDoc', () => {
	/**
	 * A base styles screen id resolves to its own catalog entry.
	 *
	 * @return {void}
	 */
	it('returns the catalog entry for a known screen id', () => {
		expect(screenDoc('border-radius')).toEqual(SCREEN_DOCS['border-radius']);
	});

	/**
	 * A block-preset screen id resolves the same way — one key space covers both id shapes.
	 *
	 * @return {void}
	 */
	it('returns the catalog entry for a preset screen id', () => {
		expect(screenDoc('blocks/kadence/singlebtn')).toEqual(SCREEN_DOCS['blocks/kadence/singlebtn']);
	});

	/**
	 * Every screen this plugin ships has copy; a third-party preset screen does not, and that
	 * resolves to null rather than to something half-rendered.
	 *
	 * @return {void}
	 */
	it('returns null for a screen with no entry', () => {
		expect(screenDoc('blocks/acme/widget')).toBeNull();
	});

	/**
	 * A missing or empty screen id is not a lookup at all.
	 *
	 * @return {void}
	 */
	it('returns null for an empty or missing screen id', () => {
		expect(screenDoc('')).toBeNull();
		expect(screenDoc(undefined)).toBeNull();
	});

	/**
	 * A screen id comes off the URL, so `?kb-screen=constructor` must not resolve to
	 * `Object.prototype.constructor`.
	 *
	 * @return {void}
	 */
	it('returns null for an inherited object property name', () => {
		expect(screenDoc('constructor')).toBeNull();
		expect(screenDoc('toString')).toBeNull();
	});
});

describe('the screen docs filter', () => {
	afterEach(() => {
		removeFilter(SCREEN_DOCS_FILTER, 'test/screen-docs');
	});

	/**
	 * A third-party screen can carry its own helper copy without this plugin shipping an entry
	 * for it.
	 *
	 * @return {void}
	 */
	it('lets a listener add an entry for a screen the catalog does not ship', () => {
		addFilter(SCREEN_DOCS_FILTER, 'test/screen-docs', (docs) => ({
			...docs,
			'blocks/acme/widget': { description: 'Style the widget.', docUrl: 'https://example.com/widget' },
		}));

		expect(screenDoc('blocks/acme/widget')).toEqual({
			description: 'Style the widget.',
			docUrl: 'https://example.com/widget',
		});
	});

	/**
	 * A filtered entry feeds an `href`, so a non-http(s) scheme is dropped rather than rendered —
	 * the sentence still shows, without a link.
	 *
	 * @return {void}
	 */
	it('keeps the sentence but drops a URL that is not http or https', () => {
		addFilter(SCREEN_DOCS_FILTER, 'test/screen-docs', (docs) => ({
			...docs,
			// eslint-disable-next-line no-script-url
			'blocks/acme/widget': { description: 'Style the widget.', docUrl: 'javascript:alert(1)' },
		}));

		expect(screenDoc('blocks/acme/widget')).toEqual({ description: 'Style the widget.', docUrl: '' });
	});

	/**
	 * A scheme is case-insensitive per the URL spec, so an upper-case one is a real link.
	 *
	 * @return {void}
	 */
	it('accepts a URL whose scheme is upper case', () => {
		addFilter(SCREEN_DOCS_FILTER, 'test/screen-docs', (docs) => ({
			...docs,
			'blocks/acme/widget': { description: 'Style the widget.', docUrl: 'HTTPS://example.com/widget' },
		}));

		expect(screenDoc('blocks/acme/widget').docUrl).toBe('HTTPS://example.com/widget');
	});

	/**
	 * A scheme with nothing after it is not a destination, so it is dropped like any other
	 * unusable value rather than rendered as a link to nowhere.
	 *
	 * @return {void}
	 */
	it('drops a URL that carries a scheme but no host', () => {
		addFilter(SCREEN_DOCS_FILTER, 'test/screen-docs', (docs) => ({
			...docs,
			'blocks/acme/widget': { description: 'Style the widget.', docUrl: 'https://' },
		}));

		expect(screenDoc('blocks/acme/widget')).toEqual({ description: 'Style the widget.', docUrl: '' });
	});

	/**
	 * An entry with no sentence has nothing to render, link or not.
	 *
	 * @return {void}
	 */
	it('ignores an entry with no usable sentence', () => {
		addFilter(SCREEN_DOCS_FILTER, 'test/screen-docs', (docs) => ({
			...docs,
			'blocks/acme/widget': { docUrl: 'https://example.com/widget' },
		}));

		expect(screenDoc('blocks/acme/widget')).toBeNull();
	});
});
