/* eslint-env jest */
/**
 * External dependencies
 */
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { TokenSelectField } from '../components/molecules/fields/TokenSelectField';
import { pickableTokensForType } from '../helpers/tokens';

// A factory, not automock: `helpers/tokens.js` reaches the localized feed, and this test only cares
// about the arguments the field hands it.
jest.mock('../helpers/tokens', () => ({
	pickableTokensForType: jest.fn(() => []),
}));

jest.mock('../components/molecules/SelectDropdown', () => ({ SelectDropdown: () => null }));
jest.mock('../components/molecules/fields/FieldLabel', () => ({ FieldLabel: ({ children }) => children }));
jest.mock('../components/molecules/fields/TokenSelectField.scss', () => ({}), { virtual: true });

let container;
let root;

beforeEach(() => {
	jest.clearAllMocks();
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

describe('TokenSelectField token pool', () => {
	/**
	 * A bound PRIMITIVE is handed to the pool as `selected`, which exempts it from the narrowing so it
	 * survives even when it sits outside the role's own scale.
	 *
	 * @return {void}
	 */
	it('passes a bound primitive through as the selected token', () => {
		act(() =>
			root.render(
				createElement(TokenSelectField, {
					field: { tokenType: 'dimension', role: 'radius', label: 'Radius' },
					value: 'primitive.dimension.radius.sm',
					onChange: jest.fn(),
				})
			)
		);

		expect(pickableTokensForType).toHaveBeenCalledWith('dimension', 'radius', 'primitive.dimension.radius.sm');
	});

	/**
	 * A bound SEMANTIC is not a selection — the pool offers primitives only — so it is neither exempted
	 * into the list nor shown as the field's value. Its name never reaches the picker.
	 *
	 * @return {void}
	 */
	it('treats a bound semantic as unset rather than exempting it into the list', () => {
		act(() =>
			root.render(
				createElement(TokenSelectField, {
					field: { tokenType: 'dimension', role: 'radius', label: 'Radius' },
					value: 'semantic.radius.control',
					onChange: jest.fn(),
				})
			)
		);

		expect(pickableTokensForType).toHaveBeenCalledWith('dimension', 'radius', '');
	});
});
