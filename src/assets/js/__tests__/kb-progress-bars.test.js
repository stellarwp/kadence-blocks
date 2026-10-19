/* eslint-env jest */
/**
 * Tests for the Progress Bar front-end script's handling of entity-encoded prefix/suffix values.
 */
const SCRIPT = '../kb-progress-bars.js';

/**
 * Render a progress bar, run the script's animation step, and return the label element.
 *
 * @param {string} prefix The prefix as it reaches the script via wp_localize_script.
 * @param {string} suffix The suffix as it reaches the script via wp_localize_script.
 *
 * @since 3.8.0.1
 *
 * @return {HTMLElement} The rendered progress label.
 */
function runProgressBar(prefix, suffix) {
	document.body.innerHTML =
		'<div class="kb-progress-bar-container1 kb-progress-bar-init"><div class="kb-progress-bar"></div><span class="kb-current-progress-above"></span></div>';

	window.kadence_blocks_progress_bars = {
		items: JSON.stringify({
			one: {
				unique_id: '1',
				simple_id: 'one',
				type: 'line',
				duration: 1,
				progress_real: 50,
				progress_max: 100,
				is_relative: false,
				prefix,
				suffix,
			},
		}),
	};
	class MockLine {
		animate(to, opts) {
			opts.step({}, { value: () => to });
		}
	}
	window.ProgressBar = { Line: MockLine };
	jest.isolateModules(() => require(SCRIPT));

	return document.querySelector('.kb-current-progress-above');
}

describe('kb-progress-bars', () => {
	it('renders an entity-encoded prefix and suffix as text, not markup', () => {
		// Entity-encoded once, which is the form wp_localize_script hands the script.
		const payload = '&lt;img src=x onerror=window.__xss=1&gt;';
		const label = runProgressBar(payload, payload);

		expect(label.querySelector('img')).toBeNull();
		expect(label.textContent).toContain('<img');
	});

	it('renders plain prefix and suffix around the value', () => {
		const label = runProgressBar('$', '%');

		expect(label.textContent).toBe('$50%');
	});
});
