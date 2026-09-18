/* eslint-env jest */
/**
 * External dependencies
 */
import { act } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { InheritancePill } from '../components/atoms/InheritancePill';

const PILL_CLASS = 'kadence-blocks-style-library__inheritance-pill';

let container;
let root;

beforeEach(() => {
	global.IS_REACT_ACT_ENVIRONMENT = true;
	container = document.createElement('div');
	document.body.appendChild(container);
	root = createRoot(container);
});

afterEach(() => {
	act(() => root.unmount());
	container.remove();
	delete global.IS_REACT_ACT_ENVIRONMENT;
});

describe('InheritancePill', () => {
	/**
	 * The inherited variant names the palette the value comes from and is not a control.
	 *
	 * @return void
	 */
	it('renders the inherited variant as static text naming the source palette', () => {
		act(() => root.render(<InheritancePill variant="inherited" sourceLabel="Default" />));

		const pill = container.querySelector(`.${PILL_CLASS}`);

		expect(pill.tagName).toBe('SPAN');
		expect(pill.textContent).toBe('From Default');
		expect(container.querySelector('button')).toBeNull();
	});

	/**
	 * A long source label is never shortened in the markup and is repeated in the title attribute,
	 * so a clipped pill still exposes the whole palette name.
	 *
	 * @return void
	 */
	it('keeps the full source label in the DOM and in the title when it is long', () => {
		const sourceLabel = 'Marketing Site Palette 2026';
		act(() => root.render(<InheritancePill variant="inherited" sourceLabel={sourceLabel} />));

		const pill = container.querySelector(`.${PILL_CLASS}`);

		expect(pill.textContent).toBe(`From ${sourceLabel}`);
		expect(pill.getAttribute('title')).toBe(`From ${sourceLabel}`);
	});

	/**
	 * The default and reset variants have nothing to clip, so neither carries a title.
	 *
	 * @return void
	 */
	it('adds no title to the default pill or the reset button', () => {
		act(() => root.render(<InheritancePill variant="default" />));
		expect(container.querySelector(`.${PILL_CLASS}`).hasAttribute('title')).toBe(false);

		act(() => root.render(<InheritancePill variant="reset" sourceLabel="Default" swatchName="Main 3" />));
		expect(container.querySelector(`.${PILL_CLASS}`).hasAttribute('title')).toBe(false);
	});

	/**
	 * The reset variant is a real button whose visible text stays short while its accessible name
	 * says which color it resets and where the value comes back from.
	 *
	 * @return void
	 */
	it('renders the reset variant as a button with a descriptive accessible name', () => {
		act(() =>
			root.render(
				<InheritancePill variant="reset" sourceLabel="Default" swatchName="Main 3" onReset={() => {}} />
			)
		);

		const pill = container.querySelector(`.${PILL_CLASS}`);

		expect(pill.tagName).toBe('BUTTON');
		expect(pill.textContent).toBe('Reset');
		expect(pill.getAttribute('aria-label')).toBe('Reset Main 3 to Default');
	});

	/**
	 * Clicking the reset variant calls back exactly once.
	 *
	 * @return void
	 */
	it('calls onReset when the reset variant is clicked', () => {
		const onReset = jest.fn();

		act(() => root.render(<InheritancePill variant="reset" swatchName="Main 3" onReset={onReset} />));
		act(() => container.querySelector('button').click());

		expect(onReset).toHaveBeenCalledTimes(1);
	});

	/**
	 * A write holding the screen busy, or the card being pending delete, disables the button so a
	 * second click cannot queue a duplicate write.
	 *
	 * @return void
	 */
	it('disables the reset variant while isDisabled is true', () => {
		act(() => root.render(<InheritancePill variant="reset" onReset={() => {}} isDisabled={true} />));
		expect(container.querySelector('button').disabled).toBe(true);
	});
});
