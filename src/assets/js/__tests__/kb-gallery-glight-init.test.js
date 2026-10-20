/* eslint-env jest */
// cspell:ignore glight glightbox
/**
 * Tests for the gallery lightbox init's handling of slide data on bound anchors.
 */
const SCRIPT = '../kb-gallery-glight-init.js';
const PAYLOAD = '&lt;img src=x onerror=window.__xss=1&gt;';

/**
 * Render a gallery, load the script, and return the GLightbox mock.
 *
 * @param {string} itemsHtml The markup placed inside the gallery container.
 *
 * @since TBD
 *
 * @return {jest.Mock} The GLightbox constructor mock.
 */
function bindGallery(itemsHtml) {
	document.body.innerHTML = `<div class="kb-gallery-magnific-init kb-gallery-id-abc">${itemsHtml}</div>`;
	window.kb_glightbox = { lightBoxAriaLabel: 'Open', moreText: 'More' };
	window.GLightbox = jest.fn();
	jest.isolateModules(() => require(SCRIPT));

	return window.GLightbox;
}

/**
 * Wrap an anchor the way the gallery block renders it.
 *
 * @param {string} attributes The anchor attributes.
 *
 * @since TBD
 *
 * @return {string} The item markup.
 */
function item(attributes) {
	return `<div class="kadence-blocks-gallery-item"><a class="kb-gallery-item-link" ${/(^|\s)href="/.test(attributes) ? '' : 'href="x.jpg"'} ${attributes}>img</a></div>`;
}

describe('kb-gallery-glight-init', () => {
	it.each([
		['title', `title="${PAYLOAD}"`],
		['data-title', `data-title="${PAYLOAD}"`],
		['data-glightbox', `data-glightbox="title: ${PAYLOAD}"`],
	])('escapes a caption supplied through %s before GLightbox reads it', (name, attribute) => {
		bindGallery(item(attribute));
		const anchor = document.querySelector('a.kb-gallery-item-link');

		expect(anchor.hasAttribute('data-glightbox')).toBe(false);
		const probe = document.createElement('div');
		probe.innerHTML = anchor.dataset.title;
		expect(probe.querySelector('img')).toBeNull();
	});

	it('removes script handlers from the description but keeps allowed caption markup', () => {
		bindGallery(
			item(
				'data-description="&lt;b onclick=window.__xss=1&gt;Hi&lt;/b&gt;&lt;img src=x onerror=window.__xss=1&gt;"'
			)
		);
		const anchor = document.querySelector('a.kb-gallery-item-link');
		const probe = document.createElement('div');
		probe.innerHTML = anchor.getAttribute('data-description');

		expect(probe.querySelector('img')).toBeNull();
		expect(probe.querySelector('[onclick]')).toBeNull();
		expect(probe.querySelector('b').textContent).toBe('Hi');
	});

	it('drops other slide settings and non-web links', () => {
		bindGallery(
			item('data-content="x" data-type="inline" data-href="javascript:1" href="javascript:window.__xss=1"')
		);
		const anchor = document.querySelector('a.kb-gallery-item-link');

		['data-content', 'data-type', 'data-href', 'href'].forEach((attr) => {
			expect(anchor.hasAttribute(attr)).toBe(false);
		});
	});

	it('leaves anchors that are not gallery items untouched and unbound', () => {
		const glightbox = bindGallery(
			item('') + '<a class="kb-gallery-item-link" href="y.jpg" data-glightbox="title: injected">x</a>'
		);
		const injected = document.querySelector('[data-glightbox]');

		expect(injected).not.toBeNull();
		expect(glightbox.mock.calls[0][0].selector).toContain('.kadence-blocks-gallery-item a.kb-gallery-item-link');
	});

	it.each([
		['data-video-provider', `data-video-provider="x&quot;&gt;${PAYLOAD}"`],
		['data-width', 'data-width="1px;&quot; onmouseover=&quot;window.__xss=1"'],
		['data-height', 'data-height="1px;&quot; onmouseover=&quot;window.__xss=1"'],
		['data-srcset', 'data-srcset="x.jpg 1x"'],
		['data-gallery', 'data-gallery="other"'],
	])('removes %s, which GLightbox would write into markup', (name, attribute) => {
		bindGallery(item(attribute));
		const anchor = document.querySelector('a.kb-gallery-item-link');

		expect(anchor.hasAttribute(name)).toBe(false);
	});

	it('keeps only the allowed data attributes', () => {
		bindGallery(item('data-description="Caption" data-alt="Alt" data-lightbox-id="1"'));
		const names = [...document.querySelector('a.kb-gallery-item-link').attributes]
			.map((attribute) => attribute.name)
			.filter((name) => name.startsWith('data-'));

		expect(names.sort()).toEqual(['data-alt', 'data-description', 'data-title']);
	});

	it('escapes the alt so it cannot break out of the alt attribute', () => {
		bindGallery(item('data-alt="x&quot; onerror=&quot;window.__xss=1"'));
		const anchor = document.querySelector('a.kb-gallery-item-link');
		const probe = document.createElement('div');
		probe.innerHTML = `<img alt="${anchor.dataset.alt}">`;

		expect(probe.querySelector('img').hasAttribute('onerror')).toBe(false);
	});

	it('wraps a description starting with a period so GLightbox does not use it as a selector', () => {
		bindGallery(item('data-description=".kb-secret"'));
		const description = document.querySelector('a.kb-gallery-item-link').getAttribute('data-description');

		expect(description.charAt(0)).toBe('<');
		expect(description).toContain('.kb-secret');
	});

	it('removes a glightbox-desc child that GLightbox would use as the description', () => {
		bindGallery(
			'<div class="kadence-blocks-gallery-item"><a class="kb-gallery-item-link" href="x.jpg">' +
				'<div class="glightbox-desc"><b onclick="window.__xss=1">x</b></div></a></div>'
		);

		expect(document.querySelector('.glightbox-desc')).toBeNull();
	});

	it('does not escape the title a second time when the gallery is initialized again', () => {
		bindGallery(item('title="Tom &amp; Jerry"'));
		const anchor = document.querySelector('a.kb-gallery-item-link');
		const first = anchor.getAttribute('data-title');
		jest.isolateModules(() => require(SCRIPT));

		expect(anchor.getAttribute('data-title')).toBe(first);
	});
});
