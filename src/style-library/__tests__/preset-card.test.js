/* eslint-env jest */
/**
 * External dependencies
 */
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { PresetCard } from '../components/molecules/PresetCard';

jest.mock('@wordpress/icons', () => ({
	Icon: (props) => <span className="components-icon" {...props} />,
	dragHandle: 'dragHandle',
}));

const PREFIX = '.kadence-blocks-style-library__preset-card';

let container;
let root;

/**
 * Render a `PresetCard` with the given props over sensible defaults.
 *
 * @param {Object} props The props to override.
 *
 * @since TBD
 *
 * @return {HTMLElement} The container the card was rendered into.
 */
function renderCard(props = {}) {
	act(() => {
		root.render(
			createElement(PresetCard, {
				id: 'outline',
				label: 'Outline',
				preview: createElement('span', { className: 'chip' }, 'Learn more'),
				onSelect: () => {},
				...props,
			})
		);
	});

	return container;
}

beforeEach(() => {
	global.IS_REACT_ACT_ENVIRONMENT = true;
	container = document.createElement('div');
	document.body.appendChild(container);
	root = createRoot(container);
});

afterEach(() => {
	act(() => root.unmount());
	container.remove();
});

describe('PresetCard', () => {
	it('renders the title and the preview', () => {
		renderCard();

		expect(container.querySelector(`${PREFIX}-title`).textContent).toBe('Outline');
		expect(container.querySelector(`${PREFIX}-preview .chip`)).not.toBeNull();
	});

	it('shows the Default badge only on the default card', () => {
		renderCard();
		expect(container.querySelector(`${PREFIX}-badge`)).toBeNull();

		renderCard({ isDefault: true });
		expect(container.querySelector(`${PREFIX}-badge`).textContent).toBe('Default');
	});

	it('renders the drag handle outside the selecting button, and only when draggable', () => {
		renderCard();
		expect(container.querySelector('.kadence-blocks-style-library__drag-handle')).toBeNull();

		renderCard({ isDraggable: true });
		const handle = container.querySelector('.kadence-blocks-style-library__drag-handle');

		expect(handle).not.toBeNull();
		expect(handle.closest(`${PREFIX}-main`)).toBeNull();
	});

	it('calls onSelect with the card id when the card body is clicked', () => {
		const onSelect = jest.fn();
		renderCard({ onSelect });

		act(() => container.querySelector(`${PREFIX}-main`).click());

		expect(onSelect).toHaveBeenCalledWith('outline');
	});

	it('marks the selected card button as current for assistive technology', () => {
		renderCard();
		expect(container.querySelector(`${PREFIX}-main`).hasAttribute('aria-current')).toBe(false);

		renderCard({ isSelected: true });
		expect(container.querySelector(`${PREFIX}-main`).getAttribute('aria-current')).toBe('true');
	});

	it('flags the selected and the placeholder states', () => {
		renderCard({ isSelected: true, isDragging: true });
		const card = container.querySelector(PREFIX);

		expect(card.classList.contains('kadence-blocks-style-library__preset-card--selected')).toBe(true);
		expect(card.classList.contains('kadence-blocks-style-library__preset-card--placeholder')).toBe(true);
	});
});
