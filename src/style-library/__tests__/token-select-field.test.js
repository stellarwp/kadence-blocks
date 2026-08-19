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
	 * The field's current value is handed to the pool as `selected`, which exempts it from the
	 * primitive narrowing. Without it a bound semantic token is filtered out of its own picker, so
	 * the field renders with its current value absent from the list.
	 *
	 * @return {void}
	 */
	it('passes the bound value through as the selected token', () => {
		act(() =>
			root.render(
				createElement(TokenSelectField, {
					field: { tokenType: 'dimension', role: 'radius', label: 'Radius' },
					value: 'semantic.dimension.radius-control',
					onChange: jest.fn(),
				})
			)
		);

		expect(pickableTokensForType).toHaveBeenCalledWith('dimension', 'radius', 'semantic.dimension.radius-control');
	});
});
