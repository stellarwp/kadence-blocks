/* eslint-env jest */
// cspell:ignore glight glightbox
/**
 * Tests for the gallery lightbox init's handling of slide data on bound anchors.
 */
const SCRIPT = '../kb-gallery-glight-init.js';
const MARKUP = '&lt;img src=x onerror=window.__probe=1&gt;';

/**
 * Render a gallery, load the script, and return the GLightbox mock.
 *
 * @param {string} itemsHtml The markup placed inside the gallery container.
 * @param {string} containerAttributes Extra attributes for the gallery container.
 *
 * @since TBD
 *
 * @return {jest.Mock} The GLightbox constructor mock.
 */
function bindGallery(itemsHtml, containerAttributes = '') {
	document.body.innerHTML = `<div class="kb-gallery-magnific-init kb-gallery-id-abc" ${containerAttributes}>${itemsHtml}</div>`;
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
		['title', `title="${MARKUP}"`],
		['data-title', `data-title="${MARKUP}"`],
		['data-glightbox', `data-glightbox="title: ${MARKUP}"`],
	])('normalizes a caption supplied through %s before GLightbox reads it', (name, attribute) => {
		bindGallery(item(attribute));
		const anchor = document.querySelector('a.kb-gallery-item-link');

		expect(anchor.hasAttribute('data-glightbox')).toBe(false);
		const probe = document.createElement('div');
		probe.innerHTML = anchor.dataset.title;
		expect(probe.querySelector('img')).toBeNull();
	});

	it('keeps only the allowed caption markup in the description', () => {
		bindGallery(
			item(
				'data-description="&lt;b onclick=window.__probe=1&gt;Hi&lt;/b&gt;&lt;img src=x onerror=window.__probe=1&gt;"'
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
			item('data-content="x" data-type="inline" data-href="javascript:1" href="javascript:window.__probe=1"')
		);
		const anchor = document.querySelector('a.kb-gallery-item-link');

		['data-content', 'data-type', 'data-href', 'href'].forEach((attr) => {
			expect(anchor.hasAttribute(attr)).toBe(false);
		});
	});

	it.each([
		['https://example.com/&quot; x=&quot;y'],
		['https://exa&quot;mple.com/v.mp4'],
		['https://example.com/a&#39;b'],
		['https://example.com/a&lt;b'],
		['https://example.com/a b'],
	])('removes an https href containing a quote, bracket or space (%s)', (href) => {
		bindGallery(item(`href="${href}"`));

		expect(document.querySelector('a.kb-gallery-item-link').hasAttribute('href')).toBe(false);
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
		['data-video-provider', `data-video-provider="x&quot;&gt;${MARKUP}"`],
		['data-width', 'data-width="1px;&quot; onmouseover=&quot;window.__probe=1"'],
		['data-height', 'data-height="1px;&quot; onmouseover=&quot;window.__probe=1"'],
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

	it('leaves the alt as written', () => {
		bindGallery(item('data-alt="Tom &amp; Jerry"'));

		expect(document.querySelector('a.kb-gallery-item-link').dataset.alt).toBe('Tom & Jerry');
	});

	it('wraps a description starting with a period', () => {
		bindGallery(item('data-description=".kb-secret"'));
		const description = document.querySelector('a.kb-gallery-item-link').getAttribute('data-description');

		expect(description.charAt(0)).toBe('<');
		expect(description).toContain('.kb-secret');
	});

	it('removes description content nested inside the anchor', () => {
		bindGallery(
			'<div class="kadence-blocks-gallery-item"><a class="kb-gallery-item-link" href="x.jpg">' +
				'<div class="glightbox-desc"><b onclick="window.__probe=1">x</b></div></a></div>'
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

	it('keeps only the attributes the gallery caption filter allows', () => {
		bindGallery(
			item(
				'data-description="&lt;a href=&quot;https://example.com&quot; target=&quot;_blank&quot; rel=&quot;noopener&quot; style=&quot;position:fixed&quot; id=&quot;gslide-next&quot; class=&quot;x&quot;&gt;Go&lt;/a&gt;&lt;b style=&quot;color:red&quot;&gt;Hi&lt;/b&gt;"'
			)
		);
		const probe = document.createElement('div');
		probe.innerHTML = document.querySelector('a.kb-gallery-item-link').getAttribute('data-description');
		const link = probe.querySelector('a');

		expect(link.getAttribute('href')).toBe('https://example.com');
		expect(link.getAttribute('target')).toBe('_blank');
		expect(link.getAttribute('rel')).toBe('noopener');
		['style', 'id', 'class'].forEach((attr) => expect(link.hasAttribute(attr)).toBe(false));
		expect(probe.querySelector('b').hasAttribute('style')).toBe(false);
	});

	it('wraps a static gallery caption starting with a period', () => {
		// jsdom does not implement innerText, which the static caption code reads.
		Object.defineProperty(HTMLElement.prototype, 'innerText', {
			configurable: true,
			get() {
				return this.textContent;
			},
		});
		bindGallery(
			'<div class="kadence-blocks-gallery-item"><a class="kb-gallery-item-link" href="x.jpg">' +
				'<figcaption class="kadence-blocks-gallery-item__caption">.kb-secret</figcaption></a></div>',
			'data-lightbox-caption="true"'
		);
		const description = document.querySelector('a.kb-gallery-item-link').getAttribute('data-description');

		delete HTMLElement.prototype.innerText;

		expect(description.charAt(0)).toBe('<');
		expect(description).toContain('.kb-secret');
	});

	it.each([['true'], ['false']])('wraps a description of exactly "%s"', (value) => {
		bindGallery(item(`data-description="${value}"`));
		const description = document.querySelector('a.kb-gallery-item-link').getAttribute('data-description');

		expect(description).toBe(`<p>${value}</p>`);
	});

	it('leaves a description that merely contains the word true unwrapped', () => {
		bindGallery(item('data-description="Very true story"'));

		expect(document.querySelector('a.kb-gallery-item-link').getAttribute('data-description')).toBe(
			'Very true story'
		);
	});
});
