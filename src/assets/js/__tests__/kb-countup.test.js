/* eslint-env jest */
/**
 * Tests for the Count Up front-end script's handling of entity-encoded attribute values.
 */
const SCRIPT = '../kb-countup.js';
const PAYLOAD_DOUBLE_ENCODED = '&amp;lt;img src=x onerror=window.__xss=1&amp;gt;';

/**
 * Render a Count Up element, load the script, and return the options CountUp received.
 *
 * @param {Object} data The data-* attributes to set.
 *
 * @since TBD
 *
 * @return {Object} The options passed to the CountUp constructor.
 */
function runCountUp(data) {
	// Build the attributes as HTML so the parser entity-decodes them once, as it does on the front end.
	const attributes = Object.keys(data)
		.map((key) => `data-${key}="${data[key]}"`)
		.join(' ');
	document.body.innerHTML = `<div class="kb-count-up" data-start="0" data-end="12345" data-duration="2" ${attributes}><div class="kb-count-up-process"></div></div>`;

	let received;
	class MockCountUp {
		constructor(target, end, options) {
			received = options;
			this.start = jest.fn();
			this.printValue = jest.fn();
		}
	}
	window.countUp = { CountUp: MockCountUp };
	window.matchMedia = jest.fn().mockReturnValue({ matches: false });
	jest.isolateModules(() => require(SCRIPT));

	return received;
}

describe('kb-countup', () => {
	afterEach(() => {
		delete window.kadenceCountUp;
		delete window.__xss;
	});

	it.each(['prefix', 'suffix', 'separator'])(
		'escapes a double entity-encoded %s so CountUp innerHTML cannot create markup',
		(attribute) => {
			const options = runCountUp({ [attribute]: PAYLOAD_DOUBLE_ENCODED });

			expect(options[attribute]).not.toMatch(/[<>]/);

			// Reproduce CountUp's innerHTML write and confirm no element is created.
			const probe = document.createElement('div');
			probe.innerHTML = options[attribute];
			expect(probe.querySelector('img')).toBeNull();
			expect(probe.textContent).toContain('<img');
		}
	);

	it('escapes a decimal separator written with innerHTML', () => {
		const options = runCountUp({ decimal: '<img src=x onerror=window.__xss=1>' });

		expect(options.decimal).not.toMatch(/[<>]/);
	});

	it('keeps plain prefix and suffix values intact', () => {
		const options = runCountUp({ prefix: '$', suffix: '+', separator: ',' });

		expect(options.prefix).toBe('$');
		expect(options.suffix).toBe('+');
		expect(options.separator).toBe(',');
	});

	it('renders the screen reader text without parsing markup', () => {
		runCountUp({ prefix: PAYLOAD_DOUBLE_ENCODED });

		expect(document.querySelector('.screen-reader-text img')).toBeNull();
	});
});
