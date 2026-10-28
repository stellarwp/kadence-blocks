/* eslint-env jest */
// cspell:ignore simplelightbox slbCaption slbIframe slbImage
/**
 * Tests for how SimpleLightbox writes captions and URLs into the markup it builds.
 */
const SimpleLightbox = require('../simplelightbox.js');

/**
 * Render one anchor, build a lightbox over it, and return the content node prepared for it.
 *
 * @param {string} anchorHtml The anchor markup to bind.
 * @param {Object} options    Options for the lightbox.
 *
 * @since 3.8.0.2
 *
 * @return {HTMLElement} The node SimpleLightbox prepared for the first item.
 */
function prepare(anchorHtml, options = {}) {
	document.body.innerHTML = anchorHtml;
	const lightbox = new SimpleLightbox({ elements: document.querySelectorAll('a'), ...options });
	let prepared = null;
	lightbox.prepareItem(0, (node) => {
		prepared = node;
	});

	return prepared;
}

describe('simplelightbox', () => {
	const RealImage = window.Image;

	beforeEach(() => {
		// jsdom never loads images, so report every preload as loaded straight away.
		window.Image = class {
			set src(value) {
				this.currentSrc = value;
				this.onload && this.onload();
			}
		};
	});

	afterEach(() => {
		window.Image = RealImage;
	});

	it.each([
		['title', 'title="&lt;img src=x onerror=window.__probe=1&gt;"', {}],
		[
			'data-caption',
			'data-caption="&lt;img src=x onerror=window.__probe=1&gt;"',
			{ captionAttribute: 'data-caption' },
		],
	])('shows a caption supplied through %s as text, not markup', (name, attribute, options) => {
		const node = prepare(`<a href="https://example.com/a.jpg" ${attribute}>open</a>`, options);

		const caption = node.querySelector('.slbCaption');
		expect(caption.querySelector('img')).toBeNull();
		expect(caption.textContent).toBe('<img src=x onerror=window.__probe=1>');
	});

	it('shows a plain caption unchanged', () => {
		const node = prepare('<a href="https://example.com/a.jpg" title="My photo">open</a>');

		expect(node.querySelector('.slbCaption').textContent).toBe('My photo');
	});

	it('keeps an image URL containing a quote inside the src attribute', () => {
		const node = prepare('<a href="https://example.com/a.jpg&quot; onerror=&quot;window.__probe=1">open</a>');

		const image = node.querySelector('.slbImage');
		expect(image.hasAttribute('onerror')).toBe(false);
		expect(image.getAttribute('src')).toBe('https://example.com/a.jpg" onerror="window.__probe=1');
	});

	it('keeps a video URL containing a quote inside the iframe src attribute', () => {
		const node = prepare(
			'<a href="https://example.com/&quot; onload=&quot;window.__probe=1&quot; x=&quot;/vimeo.com">open</a>',
			{ videoRegex: /vimeo.com/ }
		);

		const iframe = node.querySelector('.slbIframe');
		expect(iframe.hasAttribute('onload')).toBe(false);
	});

	it('does not give the iframe a non-web URL', () => {
		const node = prepare('<a href="javascript:window.__probe=1//vimeo.com">open</a>', { videoRegex: /vimeo.com/ });

		expect(node.querySelector('.slbIframe').hasAttribute('src')).toBe(false);
	});

	it('still embeds a video through its player URL', () => {
		const node = prepare('<a href="https://www.youtube.com/watch?v=abc123">open</a>', {
			videoRegex: /youtube.com/,
		});

		expect(node.querySelector('.slbIframe').getAttribute('src')).toBe('//www.youtube.com/embed/abc123');
	});
});
