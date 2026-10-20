/* eslint-env jest */
// cspell:ignore glight plyr zoomable
/**
 * Tests for the video popup init's handling of slide data on bound anchors.
 */
const SCRIPT = '../kb-glight-video-pop-init.js';

/**
 * Render anchors, load the script, and return the bound anchor.
 *
 * @param {string} anchorHtml The anchor markup to bind.
 *
 * @since TBD
 *
 * @return {{anchor: HTMLElement, glightbox: jest.Mock}} The bound anchor and the GLightbox mock.
 */
function bindAnchor(anchorHtml) {
	document.body.innerHTML = anchorHtml;
	window.kadence_pro_video_pop = { plyr_css: '', plyr_js: '' };
	window.GLightbox = jest.fn().mockImplementation(() => ({ on: jest.fn() }));
	jest.isolateModules(() => require(SCRIPT));

	return { anchor: document.querySelector('.kadence-video-popup-link'), glightbox: window.GLightbox };
}

describe('kb-glight-video-pop-init', () => {
	it.each([
		['title', 'title="&lt;img src=x onerror=window.__xss=1&gt;"'],
		['data-title', 'data-title="&lt;img src=x onerror=window.__xss=1&gt;"'],
	])('escapes a caption supplied through %s before GLightbox reads it', (name, attribute) => {
		const { anchor } = bindAnchor(
			`<a class="kadence-video-popup-link" data-popup-class="p1" href="https://youtu.be/x" ${attribute}>open</a>`
		);

		const probe = document.createElement('div');
		probe.innerHTML = anchor.dataset.title;
		expect(probe.querySelector('img')).toBeNull();
	});

	it('keeps a plain title as the caption text', () => {
		const { anchor } = bindAnchor(
			'<a class="kadence-video-popup-link" data-popup-class="p1" href="https://youtu.be/x" title="My video">Watch</a>'
		);

		const probe = document.createElement('div');
		probe.innerHTML = anchor.dataset.title;
		expect(probe.textContent).toBe('My video');
	});

	it.each([
		['data-glightbox', 'data-glightbox="title: &lt;img src=x onerror=window.__xss=1&gt;"'],
		['data-description', 'data-description="&lt;img src=x onerror=window.__xss=1&gt;"'],
		['data-content', 'data-content="&lt;img src=x onerror=window.__xss=1&gt;"'],
		['data-href', 'data-href="javascript:window.__xss=1"'],
		['data-type', 'data-type="inline"'],
		['data-width', 'data-width="1px;&quot; onmouseover=&quot;window.__xss=1"'],
		['data-height', 'data-height="1px;&quot; onmouseover=&quot;window.__xss=1"'],
		['data-sizes', 'data-sizes="100vw"'],
		['data-srcset', 'data-srcset="x.jpg 1x"'],
		['data-alt', 'data-alt="x"'],
		['data-zoomable', 'data-zoomable="true"'],
		['data-draggable', 'data-draggable="true"'],
		['data-desc-position', 'data-desc-position="left"'],
		['data-video-provider', 'data-video-provider="youtube&quot;&gt;&lt;img src=x onerror=window.__xss=1&gt;"'],
	])('drops slide settings supplied through %s', (name, attribute) => {
		const { anchor } = bindAnchor(
			`<a class="kadence-video-popup-link" data-popup-class="p1" href="https://youtu.be/x" ${attribute}>open</a>`
		);

		expect(anchor.hasAttribute(name)).toBe(false);
	});

	it('removes an href that is not a web or relative URL', () => {
		const { anchor } = bindAnchor(
			'<a class="kadence-video-popup-link" data-popup-class="p1" href="javascript:window.__xss=1">open</a>'
		);

		expect(anchor.hasAttribute('href')).toBe(false);
	});

	it('keeps the https link and the attributes the script reads itself', () => {
		const { anchor } = bindAnchor(
			'<a class="kadence-video-popup-link" data-popup-class="p1" data-popup-auto="true" data-media-ratio="4:3" href="https://youtu.be/x">open</a>'
		);

		expect(anchor.getAttribute('href')).toBe('https://youtu.be/x');
		expect(anchor.getAttribute('data-popup-class')).toBe('p1');
		expect(anchor.getAttribute('data-popup-auto')).toBe('true');
		expect(anchor.getAttribute('data-media-ratio')).toBe('4:3');
	});

	it('still honors the requested effect after removing the attribute', () => {
		const { anchor, glightbox } = bindAnchor(
			'<a class="kadence-video-popup-link" data-popup-class="p1" data-effect="fade" href="https://youtu.be/x">open</a>'
		);

		expect(anchor.hasAttribute('data-effect')).toBe(false);
		expect(glightbox.mock.calls[0][0].openEffect).toBe('fade');
	});

	it('sanitizes every anchor before GLightbox is created for the first one', () => {
		let titleSeenAtFirstCall = null;
		document.body.innerHTML =
			'<a class="kadence-video-popup-link" data-popup-class="p1" href="https://youtu.be/a">a</a>' +
			'<a id="second" class="kadence-video-popup-link" data-popup-class="p1" href="https://youtu.be/b" data-glightbox="title: x">b</a>';
		window.kadence_pro_video_pop = { plyr_css: '', plyr_js: '' };
		window.GLightbox = jest.fn().mockImplementation(() => {
			if (null === titleSeenAtFirstCall) {
				titleSeenAtFirstCall = document.getElementById('second').hasAttribute('data-glightbox');
			}
			return { on: jest.fn() };
		});
		jest.isolateModules(() => require(SCRIPT));

		expect(titleSeenAtFirstCall).toBe(false);
	});
});
