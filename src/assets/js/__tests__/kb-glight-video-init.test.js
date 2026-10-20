/* eslint-env jest */
// cspell:ignore glight ktblocksvideopop plyr zoomable
/**
 * Tests for the video lightbox init's handling of caption data on bound anchors.
 */
const SCRIPT = '../kb-glight-video-init.js';

/**
 * Render anchors, load the script, and return the data GLightbox would read from each anchor.
 *
 * @param {string} anchorHtml The anchor markup to bind.
 *
 * @since 3.8.0.1
 *
 * @return {HTMLElement} The bound anchor.
 */
function bindAnchor(anchorHtml) {
	document.body.innerHTML = anchorHtml;
	window.kadence_video_pop = { plyr_css: '', plyr_js: '' };
	window.GLightbox = jest.fn().mockImplementation(() => ({ on: jest.fn() }));
	jest.isolateModules(() => require(SCRIPT));

	return document.querySelector('.ktblocksvideopop');
}

describe('kb-glight-video-init', () => {
	it.each([
		['title', 'title="&lt;img src=x onerror=window.__xss=1&gt;"'],
		['data-title', 'data-title="&lt;img src=x onerror=window.__xss=1&gt;"'],
		['data-glightbox', 'data-glightbox="title: &lt;img src=x onerror=window.__xss=1&gt;"'],
	])('escapes a caption supplied through %s before GLightbox reads it', (name, attribute) => {
		const anchor = bindAnchor(`<a class="ktblocksvideopop" href="x.jpg" ${attribute}>open</a>`);

		expect(anchor.hasAttribute('data-glightbox')).toBe(false);

		// Parse the caption as HTML and confirm no element is created.
		const probe = document.createElement('div');
		probe.innerHTML = anchor.dataset.title;
		expect(probe.querySelector('img')).toBeNull();
	});

	it('keeps a plain title as the caption text', () => {
		const anchor = bindAnchor('<a class="ktblocksvideopop" href="x.jpg" title="My video">Watch</a>');

		const probe = document.createElement('div');
		probe.innerHTML = anchor.dataset.title;
		expect(probe.textContent).toBe('My video');
	});

	it.each([
		['data-content', 'data-content="&lt;img src=x onerror=window.__xss=1&gt;"'],
		['data-href', 'data-href="javascript:window.__xss=1"'],
		['data-type', 'data-type="inline" data-content="&lt;b&gt;x&lt;/b&gt;"'],
		['data-glightbox content', 'data-glightbox="content: &lt;img src=x onerror=window.__xss=1&gt;"'],
		['data-width', 'data-width="1px;&quot; onmouseover=&quot;window.__xss=1"'],
		['data-height', 'data-height="1px;&quot; onmouseover=&quot;window.__xss=1"'],
		['data-sizes', 'data-sizes="100vw"'],
		['data-srcset', 'data-srcset="x.jpg 1x"'],
		['data-alt', 'data-alt="x"'],
		['data-zoomable', 'data-zoomable="true"'],
		['data-draggable', 'data-draggable="true"'],
		['data-video-provider', 'data-video-provider="x"'],
		['data-video-provider', 'data-video-provider="youtube&quot;&gt;&lt;img src=x onerror=window.__xss=1&gt;"'],
	])('drops slide settings supplied through %s', (name, attribute) => {
		const anchor = bindAnchor(`<a class="ktblocksvideopop" href="x.jpg" ${attribute}>open</a>`);

		['data-content', 'data-href', 'data-type', 'data-glightbox', 'data-video-provider'].forEach((attr) => {
			expect(anchor.hasAttribute(attr)).toBe(false);
		});
	});

	it('removes an href that is not a web or relative URL', () => {
		const anchor = bindAnchor('<a class="ktblocksvideopop" href="javascript:window.__xss=1">open</a>');

		expect(anchor.hasAttribute('href')).toBe(false);
	});

	it('keeps https and relative links', () => {
		expect(
			bindAnchor('<a class="ktblocksvideopop" href="https://example.com/v.mp4">open</a>').getAttribute('href')
		).toBe('https://example.com/v.mp4');
		expect(bindAnchor('<a class="ktblocksvideopop" href="/v.mp4">open</a>').getAttribute('href')).toBe('/v.mp4');
	});

	it('leaves unrelated data attributes, such as the tooltip ones, in place', () => {
		const anchor = bindAnchor(
			'<a class="ktblocksvideopop" href="x.mp4" data-kb-tooltip-content="Tip" data-tooltip-placement="top">Watch</a>'
		);

		expect(anchor.getAttribute('data-kb-tooltip-content')).toBe('Tip');
		expect(anchor.getAttribute('data-tooltip-placement')).toBe('top');
	});

	it('does not escape the title a second time when the init runs again', () => {
		const anchor = bindAnchor('<a class="ktblocksvideopop" href="x.mp4" title="Tom &amp; Jerry">Watch</a>');
		const first = anchor.getAttribute('data-title');
		jest.isolateModules(() => require(SCRIPT));

		expect(first).toBe('Tom &amp; Jerry');
		expect(anchor.getAttribute('data-title')).toBe(first);
	});
});
