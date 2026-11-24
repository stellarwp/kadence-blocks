/* eslint-env jest */
// cspell:ignore glightbox gvideo plyr
/**
 * Tests for the lightbox's video player setup.
 */
const SCRIPT = '../vendor/glightbox.js';

/**
 * Open a lightbox with one video slide and return the element the player was set up on.
 *
 * @param {string} href The video URL.
 *
 * @since TBD
 *
 * @return {*} The first argument passed to the player.
 */
function openVideo(href) {
	document.body.innerHTML = '<div id="gvideo0"></div>';
	window.Plyr = jest.fn(function () {
		this.on = jest.fn();
	});
	let GLightbox;
	jest.isolateModules(() => {
		GLightbox = require(SCRIPT);
	});
	GLightbox({
		elements: [{ href, type: 'video', width: '900px' }],
		plyr: { js: 'plyr.js', css: 'plyr.css' },
	}).open();

	return window.Plyr.mock.calls[0][0];
}

describe('glightbox video', () => {
	it.each([['https://example.com/video.mp4'], ['https://www.youtube.com/watch?v=abc123']])(
		'sets up the player on the slide element for %s',
		(href) => {
			const target = openVideo(href);

			expect(target).toBeInstanceOf(HTMLElement);
			expect(target.closest('.gvideo-wrapper')).not.toBeNull();
		}
	);
});
