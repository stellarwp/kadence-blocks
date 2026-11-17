/* eslint-env jest */
/**
 * Tests for which carousels the Splide init sets up and the options it reads.
 */
const SCRIPT = '../kb-splide-init.js';
const OPTIONS = 'data-splide="{&quot;perPage&quot;:9}"';

/**
 * Render markup, load the script, and return the Splide constructor mock.
 *
 * Captures each root's state when Splide receives it.
 *
 * @param {string} html The page markup.
 *
 * @since TBD
 *
 * @return {jest.Mock} The Splide constructor mock.
 */
function initCarousels(html) {
	document.body.innerHTML = html;
	window.Splide = jest.fn(function (element) {
		this.hadOptions = element.hasAttribute('data-splide');
		this.on = jest.fn();
		this.mount = jest.fn();
		this.sync = jest.fn();
		this.go = jest.fn();
	});
	jest.isolateModules(() => require(SCRIPT));

	return window.Splide;
}

/**
 * Build a testimonials carousel the way the block renders it.
 *
 * @param {string} attributes Extra attributes for the carousel root.
 *
 * @since TBD
 *
 * @return {string} The carousel markup.
 */
function testimonials(attributes = '') {
	return `<div class="wp-block-kadence-testimonials"><div class="kt-blocks-carousel-init" data-slider-arrows="true" ${attributes}><div class="kb-slide-item">a</div><div class="kb-slide-item">b</div></div></div>`;
}

describe('kb-splide-init', () => {
	afterEach(() => {
		delete window.Splide;
	});

	it('sets up a block carousel without options from data-splide', () => {
		const splide = initCarousels(testimonials(OPTIONS));

		expect(splide).toHaveBeenCalledTimes(1);
		expect(splide.mock.instances[0].hadOptions).toBe(false);
	});

	it.each(['comment-body', 'wp-block-comment-content', 'wp-block-latest-comments'])(
		'skips a carousel inside .%s',
		(className) => {
			const splide = initCarousels(`<div class="${className}">${testimonials()}</div>`);

			expect(splide).not.toHaveBeenCalled();
		}
	);

	it('sets up a thumbnail gallery and its nav without options from data-splide', () => {
		const splide = initCarousels(
			'<div class="wp-block-kadence-advancedgallery">' +
				`<div id="kb-slider-x" class="kt-blocks-carousel-init splide" data-slider-type="thumbnail" data-slider-nav="kb-thumb-slider-x" ${OPTIONS}><div class="kb-slide-item">a</div></div>` +
				`<div id="kb-thumb-slider-x" class="splide" ${OPTIONS}><div class="kb-slide-item">a</div></div>` +
				'</div>'
		);

		expect(splide).toHaveBeenCalledTimes(2);
		splide.mock.instances.forEach((instance) => expect(instance.hadOptions).toBe(false));
	});
});
