/* eslint-env jest */
// cspell:ignore Abril Fatface .
/**
 * Tests for the font-readiness helper: the ordering that makes waiting meaningful, and the bounds
 * that stop a caller waiting forever on a font that will never arrive.
 */
import { FONT_LOAD_TIMEOUT, ensureStylesheet, googleFontHref, loadFontFamily } from '../helpers/font-loading';

/**
 * Let every pending promise callback settle. The helper races and re-wraps its promises, so a fixed
 * number of `await Promise.resolve()` ticks is a guess that breaks the moment a layer is added.
 *
 * @return {Promise<void>} Resolves once the queue has drained.
 */
function flush() {
	return new Promise((resolve) => setImmediate(resolve));
}

/**
 * Build a stand-in document whose `<link>` loads resolve when the test says so, and whose font set
 * records what was asked for.
 *
 * @param {Object}  [options]
 * @param {boolean} [options.fonts] Whether the document exposes a font set at all.
 *
 * @return {Object} The fake document plus the handles the tests drive it with.
 */
function fakeDoc({ fonts = true } = {}) {
	const links = [];
	const requested = [];
	let resolveFace;

	const doc = {
		head: { appendChild: (link) => links.push(link) },
		createElement: () => ({ rel: '', href: '', onload: null, onerror: null }),
	};

	if (fonts) {
		doc.fonts = {
			load: (spec) => {
				requested.push(spec);
				return new Promise((resolve) => {
					resolveFace = resolve;
				});
			},
		};
	}

	return {
		doc,
		links,
		requested,
		loadStylesheet: () => links[links.length - 1].onload(),
		failStylesheet: () => links[links.length - 1].onerror(),
		resolveFace: () => resolveFace(),
	};
}

describe('googleFontHref', () => {
	it('asks for the family at its default weight, with swap', () => {
		expect(googleFontHref('Abril Fatface')).toBe(
			'https://fonts.googleapis.com/css2?family=Abril%20Fatface&display=swap'
		);
	});
});

describe('ensureStylesheet', () => {
	it('injects the stylesheet once per document and shares the wait', async () => {
		const { doc, links, loadStylesheet } = fakeDoc();

		const first = ensureStylesheet('https://example.test/a.css', doc);
		const second = ensureStylesheet('https://example.test/a.css', doc);

		expect(links).toHaveLength(1);
		expect(first).toBe(second);

		loadStylesheet();
		await expect(first).resolves.toBeUndefined();
	});

	it('injects separately into a second document, since each has its own font set', async () => {
		const a = fakeDoc();
		const b = fakeDoc();

		ensureStylesheet('https://example.test/b.css', a.doc);
		ensureStylesheet('https://example.test/b.css', b.doc);

		expect(a.links).toHaveLength(1);
		expect(b.links).toHaveLength(1);
	});

	// A stylesheet that 404s must not strand the caller; the font simply will not be there.
	it('resolves when the stylesheet fails rather than rejecting', async () => {
		const { doc, failStylesheet } = fakeDoc();

		const ready = ensureStylesheet('https://example.test/missing.css', doc);
		failStylesheet();

		await expect(ready).resolves.toBeUndefined();
	});

	it('resolves for a document with no head to inject into', async () => {
		await expect(ensureStylesheet('https://example.test/c.css', {})).resolves.toBeUndefined();
	});
});

describe('loadFontFamily', () => {
	it('resolves immediately when no family is named', async () => {
		const { doc, links } = fakeDoc();

		await expect(loadFontFamily('', { doc })).resolves.toBeUndefined();
		expect(links).toHaveLength(0);
	});

	// The ordering that makes the whole thing work: asking the font set before the stylesheet is
	// parsed resolves against no faces and reports success while the font is still missing.
	it('waits for the stylesheet before asking the font set', async () => {
		const { doc, requested, loadStylesheet, resolveFace } = fakeDoc();

		const ready = loadFontFamily('Inter', { doc, href: 'https://example.test/inter.css' });

		await flush();
		expect(requested).toEqual([]);

		loadStylesheet();
		await flush();

		expect(requested).toEqual(['1em "Inter"']);

		resolveFace();
		await expect(ready).resolves.toBeUndefined();
	});

	it('skips injection for a family the document already has', async () => {
		const { doc, links, requested, resolveFace } = fakeDoc();

		const ready = loadFontFamily('Georgia', { doc });
		await flush();

		expect(links).toHaveLength(0);
		expect(requested).toEqual(['1em "Georgia"']);

		resolveFace();
		await ready;
	});

	it('quotes the family so a multi-word name is one font-family', async () => {
		const { doc, requested, resolveFace } = fakeDoc();

		const ready = loadFontFamily('Abril Fatface', { doc });
		await flush();

		expect(requested).toEqual(['1em "Abril Fatface"']);

		resolveFace();
		await ready;
	});

	it('resolves for a document with no font set at all', async () => {
		const { doc } = fakeDoc({ fonts: false });

		await expect(loadFontFamily('Inter', { doc })).resolves.toBeUndefined();
	});

	// The caller is holding the user's pick until this settles, so it always has to settle.
	it('gives up after the timeout when the face never arrives', async () => {
		jest.useFakeTimers();

		const { doc } = fakeDoc();
		const ready = loadFontFamily('Inter', { doc, timeout: 50 });

		await Promise.resolve();
		jest.advanceTimersByTime(50);

		await expect(ready).resolves.toBeUndefined();

		jest.useRealTimers();
	});

	it('exposes a default timeout so callers need not pick one', () => {
		expect(FONT_LOAD_TIMEOUT).toBeGreaterThan(0);
	});
});
