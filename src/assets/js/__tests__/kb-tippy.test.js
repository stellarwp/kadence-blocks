/* eslint-env jest */
// cspell:ignore tippy
/**
 * Tests for the tooltip init's handling of per-element options.
 */
const SCRIPT = '../kb-tippy.js';

jest.mock('@popperjs/core', () => ({ createPopper: jest.fn() }), { virtual: true });

/**
 * Render markup, load the script, run the init, and return the tooltip instance of the first reference.
 *
 * @param {string} html The markup to render.
 *
 * @since 3.9.2
 *
 * @return {Object} The tooltip instance.
 */
function initTooltip(html) {
	document.body.innerHTML = html;
	delete global.tippy;
	jest.isolateModules(() => {
		global.tippy = require(SCRIPT);
	});
	window.kadenceTippy.init();

	return document.querySelector('[data-kb-tooltip-content], [data-tooltip-id]')._tippy;
}

describe('kb-tippy', () => {
	it.each([
		[
			'the text attribute',
			'<a class="kb-tooltips" data-kb-tooltip-content="Tip" data-tooltip-content="<s>x</s>">a</a>',
		],
		[
			'the id attribute',
			'<span data-tooltip-id="src" data-tooltip-content="<s>x</s>">a</span><span id="src">Tip</span>',
		],
	])('builds the content only from %s', (name, html) => {
		const instance = initTooltip(html);

		expect(instance.props.content).toBe('Tip');
		expect(instance.popper.querySelector('s')).toBeNull();
	});

	it.each([
		[
			'the text attribute',
			'<a class="kb-tooltips" data-kb-tooltip-content="&lt;b&gt;Tip&lt;/b&gt;&lt;s&gt;x&lt;/s&gt;">a</a>',
		],
		['the id attribute', '<span data-tooltip-id="src">a</span><span id="src"><b>Tip</b><s>x</s></span>'],
	])('keeps only the allowed tags from %s', (name, html) => {
		const instance = initTooltip(html);

		expect(instance.popper.querySelector('b')).not.toBeNull();
		expect(instance.popper.querySelector('s')).toBeNull();
	});

	it('ignores other per-element tooltip options', () => {
		const instance = initTooltip(
			'<a class="kb-tooltips" data-kb-tooltip-content="Tip" data-tooltip-trigger="manual" data-tooltip-offset="[1,1]">a</a>'
		);

		expect(instance.props.trigger).toBe('mouseenter focus');
		expect(instance.props.offset).toEqual([0, 10]);
	});

	it.each([
		['bottom-end', 'bottom-end'],
		['auto-start', 'auto-start'],
		['middle', 'top'],
		['{"x":1}', 'top'],
	])('maps the placement %s to %s', (placement, expected) => {
		const text = initTooltip(
			`<a class="kb-tooltips" data-kb-tooltip-content="Tip" data-tooltip-placement='${placement}'>a</a>`
		);
		const id = initTooltip(
			`<span data-tooltip-id="src" data-tooltip-placement='${placement}'>a</span><span id="src">Tip</span>`
		);

		expect(text.props.placement).toBe(expected);
		expect(id.props.placement).toBe(expected);
	});

	it('defaults to the top placement', () => {
		const instance = initTooltip('<a class="kb-tooltips" data-kb-tooltip-content="Tip">a</a>');

		expect(instance.props.placement).toBe('top');
	});
});
