/* eslint-env jest */

// `@wordpress/components` is not resolvable in the jest env; the token UI only references it at render
// time, and these tests inspect the returned element types (never render), so a light stub is enough.
jest.mock(
	'@wordpress/components',
	() => ({
		Button: 'Button',
		DropdownMenu: 'DropdownMenu',
		MenuGroup: 'MenuGroup',
		MenuItem: 'MenuItem',
	}),
	{ virtual: true }
);

// The module under test resolves the pickable list through `../token-picker`, which pulls in
// `@kadence/components`. Mock the accessor so these tests exercise only the seam dispatch/adapters.
jest.mock('../../token-picker', () => ({
	pickableTokensForControl: jest.fn(),
}));

import { applyFilters } from '@wordpress/hooks';
import { pickableTokensForControl } from '../../token-picker';
import { registerComponentTokenFilters } from '../register-component-filters';
import { TokenChip, TokenPickerButton } from '../component-token-ui';

const EDITOR_HOOK = 'kadence.components.control.editor';
const ACTIONS_HOOK = 'kadence.components.control.actions';

const RADIUS = {
	id: 'radius-button',
	alias: '{semantic.radius.button}',
	label: 'Button Radius',
	value: '0.5rem',
	type: 'dimension',
};

const CONTEXT = { blockName: 'kadence/singlebtn', attribute: 'borderRadius' };

beforeEach(() => {
	pickableTokensForControl.mockReturnValue([RADIUS]);
	registerComponentTokenFilters();
});

describe('editor seam', () => {
	it('passes the default editor through for a numeric slot', () => {
		const result = applyFilters(EDITOR_HOOK, 'DEFAULT', {
			control: 'measureRange',
			index: 0,
			value: ['0', '0', '0', '0'],
			onChange: jest.fn(),
			context: CONTEXT,
		});
		expect(result).toBe('DEFAULT');
	});

	it('renders a TokenChip for an aliased measureRange side and unlinks to the literal size at that index', () => {
		const onChange = jest.fn();
		const result = applyFilters(EDITOR_HOOK, 'DEFAULT', {
			control: 'measureRange',
			index: 1,
			value: ['0', RADIUS.alias, '0', '0'],
			onChange,
			context: CONTEXT,
		});
		expect(result.type).toBe(TokenChip);
		expect(result.props.value).toBe(RADIUS.alias);

		result.props.onUnlink();
		// 0.5rem -> parseCssLength -> size 0.5, written at index 1 only.
		expect(onChange).toHaveBeenCalledWith(['0', 0.5, '0', '0']);
	});

	it('unlinks the linked "all" slot (index null) to every side', () => {
		const onChange = jest.fn();
		const result = applyFilters(EDITOR_HOOK, 'DEFAULT', {
			control: 'measureRange',
			index: null,
			value: [RADIUS.alias, RADIUS.alias, RADIUS.alias, RADIUS.alias],
			onChange,
			context: CONTEXT,
		});
		result.props.onUnlink();
		expect(onChange).toHaveBeenCalledWith([0.5, 0.5, 0.5, 0.5]);
	});

	it('leaves a control kind with no editor slot (border) untouched', () => {
		const result = applyFilters(EDITOR_HOOK, 'DEFAULT', {
			control: 'border',
			value: {},
			onChange: jest.fn(),
			context: CONTEXT,
		});
		expect(result).toBe('DEFAULT');
	});
});

describe('actions seam', () => {
	it('appends a picker that writes the alias to every side for measureRange', () => {
		const onChange = jest.fn();
		const actions = applyFilters(ACTIONS_HOOK, [], {
			control: 'measureRange',
			value: ['0', '0', '0', '0'],
			onChange,
			context: CONTEXT,
		});
		expect(actions).toHaveLength(1);
		expect(actions[0].type).toBe(TokenPickerButton);

		actions[0].props.onSelect(RADIUS.alias);
		expect(onChange).toHaveBeenCalledWith([RADIUS.alias, RADIUS.alias, RADIUS.alias, RADIUS.alias]);
	});

	it('marks the picker active when every side is aliased', () => {
		const actions = applyFilters(ACTIONS_HOOK, [], {
			control: 'measureRange',
			value: [RADIUS.alias, RADIUS.alias, RADIUS.alias, RADIUS.alias],
			onChange: jest.fn(),
			context: CONTEXT,
		});
		expect(actions[0].props.isActive).toBe(true);
	});

	it('writes the alias into every side width for the border control', () => {
		const onChange = jest.fn();
		const actions = applyFilters(ACTIONS_HOOK, [], {
			control: 'border',
			value: {
				top: ['#000', 'solid', 1],
				right: ['#000', 'solid', 1],
				bottom: ['#000', 'solid', 1],
				left: ['#000', 'solid', 1],
			},
			onChange,
			context: CONTEXT,
		});
		actions[0].props.onSelect(RADIUS.alias);
		expect(onChange).toHaveBeenCalledWith({
			top: ['#000', 'solid', RADIUS.alias],
			right: ['#000', 'solid', RADIUS.alias],
			bottom: ['#000', 'solid', RADIUS.alias],
			left: ['#000', 'solid', RADIUS.alias],
		});
	});

	it('returns the default actions when no context/tokens are available', () => {
		pickableTokensForControl.mockReturnValue([]);
		const actions = applyFilters(ACTIONS_HOOK, [], {
			control: 'measureRange',
			value: ['0', '0', '0', '0'],
			onChange: jest.fn(),
			context: CONTEXT,
		});
		expect(actions).toEqual([]);
	});
});

describe('box-shadow whole-shadow seam', () => {
	it('renders a picker when no token is set, writing via the context onChange', () => {
		const onChange = jest.fn();
		const actions = applyFilters(ACTIONS_HOOK, [], {
			control: 'boxShadow',
			value: '',
			readOnly: false,
			context: { ...CONTEXT, onChange },
		});
		expect(actions[0].type).toBe(TokenPickerButton);
		actions[0].props.onSelect(RADIUS.alias);
		expect(onChange).toHaveBeenCalledWith(RADIUS.alias);
	});

	it('renders a chip when a token is set, unlinking to empty', () => {
		const onChange = jest.fn();
		const actions = applyFilters(ACTIONS_HOOK, [], {
			control: 'boxShadow',
			value: RADIUS.alias,
			readOnly: true,
			context: { ...CONTEXT, onChange },
		});
		expect(actions[0].type).toBe(TokenChip);
		actions[0].props.onUnlink();
		expect(onChange).toHaveBeenCalledWith('');
	});
});
