/* eslint-env jest */
/**
 * Tests for the Advanced Heading typed-text script's handling of the span text.
 */
const SCRIPT = '../kb-advanced-heading.js';

describe('kb-advanced-heading typed text', () => {
	beforeEach(() => {
		jest.useFakeTimers();
		window.matchMedia = jest.fn().mockReturnValue({ matches: false });
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('escapes the span text so Typed.js innerHTML cannot create markup', () => {
		document.body.innerHTML =
			'<h2><span class="kt-typed-text" data-strings="[&quot;hi&quot;]">&lt;img src=x onerror=window.__xss=1&gt;</span></h2>';
		let settings;
		window.Typed = jest.fn().mockImplementation((el, options) => {
			settings = options;
		});
		jest.isolateModules(() => require(SCRIPT));
		jest.advanceTimersByTime(200);

		const first = settings.strings[0];
		expect(first).not.toMatch(/[<>]/);

		const probe = document.createElement('div');
		probe.innerHTML = first;
		expect(probe.querySelector('img')).toBeNull();
		expect(probe.textContent).toBe('<img src=x onerror=window.__xss=1>');
	});

	it('types plain span text unchanged', () => {
		document.body.innerHTML = '<h2><span class="kt-typed-text" data-strings="[]">plain-control-text</span></h2>';
		let settings;
		window.Typed = jest.fn().mockImplementation((el, options) => {
			settings = options;
		});
		jest.isolateModules(() => require(SCRIPT));
		jest.advanceTimersByTime(200);

		expect(settings.strings[0]).toBe('plain-control-text');
	});
});
