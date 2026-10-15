/* eslint-env jest */
// cspell:ignore glight ktblocksvideopop plyr
/**
 * Tests for the video lightbox init's handling of caption data on bound anchors.
 */
const SCRIPT = '../kb-glight-video-init.js';

/**
 * Render anchors, load the script, and return the data GLightbox would read from each anchor.
 *
 * @param {string} anchorHtml The anchor markup to bind.
 *
 * @since TBD
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

		// Reproduce GLightbox's innerHTML write of the title it reads from data-title.
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
});
