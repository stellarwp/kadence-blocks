/* eslint-env jest */

// `@wordpress/components` is not resolvable in the jest env; the token UI only references it at render
// time, and these tests inspect the returned element types/props (never render), so light stubs are
// enough.
jest.mock(
	'@wordpress/components',
	() => ({
		Button: 'Button',
		Dropdown: 'Dropdown',
		DropdownMenu: 'DropdownMenu',
		Icon: 'Icon',
		MenuGroup: 'MenuGroup',
		MenuItem: 'MenuItem',
		RangeControl: 'RangeControl',
		SelectControl: 'SelectControl',
		TabPanel: 'TabPanel',
		__experimentalNumberControl: 'NumberControl',
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
import { TokenChip, TokenPickerButton, TokenFieldControl } from '../component-token-ui';

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
	/**
	 * A field control with pickable tokens renders a `TokenFieldControl` in place of the slot editor,
	 * carrying the slot's current value, the control unit, and the default editor.
	 *
	 * @return {void}
	 */
	it('renders a TokenFieldControl for a token-mapped field slot', () => {
		const result = applyFilters(
			EDITOR_HOOK,
			{ props: { icon: 'CORNER_ICON' } },
			{
				control: 'measureRange',
				index: 0,
				value: ['0', '0', '0', '0'],
				onChange: jest.fn(),
				context: { ...CONTEXT, unit: 'px' },
			}
		);
		expect(result.type).toBe(TokenFieldControl);
		expect(result.props.value).toBe('0');
		expect(result.props.unit).toBe('px');
		// The corner icon is lifted off the control's own editor so the trigger mirrors the native input.
		expect(result.props.icon).toBe('CORNER_ICON');
	});

	/**
	 * The control's unit list and unit writer flow from the block context to the token field, so the
	 * Custom tab can render a unit switcher.
	 *
	 * @return {void}
	 */
	it('threads the control units and unit writer to the token field', () => {
		const onUnit = jest.fn();
		const result = applyFilters(EDITOR_HOOK, 'DEFAULT', {
			control: 'measureRange',
			index: 0,
			value: ['0', '0', '0', '0'],
			onChange: jest.fn(),
			context: { ...CONTEXT, unit: 'px', units: ['px', 'em', 'rem'], onUnit },
		});
		expect(result.props.units).toEqual(['px', 'em', 'rem']);
		expect(result.props.onUnit).toBe(onUnit);
	});

	/**
	 * Picking a token on an individual side writes the alias to only that side; clearing and a custom
	 * value write to the same side, leaving the siblings untouched.
	 *
	 * @return {void}
	 */
	it('writes a pick/clear/custom to only the edited side', () => {
		const onChange = jest.fn();
		const result = applyFilters(EDITOR_HOOK, 'DEFAULT', {
			control: 'measureRange',
			index: 1,
			value: ['0', '0', '0', '0'],
			onChange,
			context: CONTEXT,
		});

		result.props.onPick(RADIUS.alias);
		expect(onChange).toHaveBeenLastCalledWith(['0', RADIUS.alias, '0', '0']);

		result.props.onClear();
		expect(onChange).toHaveBeenLastCalledWith(['0', '', '0', '0']);

		result.props.onCustom(6);
		expect(onChange).toHaveBeenLastCalledWith(['0', 6, '0', '0']);
	});

	/**
	 * Picking on the linked "all" slot (index null) writes the alias to every side.
	 *
	 * @return {void}
	 */
	it('writes a pick on the linked slot to every side', () => {
		const onChange = jest.fn();
		const result = applyFilters(EDITOR_HOOK, 'DEFAULT', {
			control: 'measureRange',
			index: null,
			value: ['0', '0', '0', '0'],
			onChange,
			context: CONTEXT,
		});

		result.props.onPick(RADIUS.alias);
		expect(onChange).toHaveBeenCalledWith([RADIUS.alias, RADIUS.alias, RADIUS.alias, RADIUS.alias]);
	});

	/**
	 * Without a bound context (no tokens resolve), the control's own editor passes through untouched.
	 *
	 * @return {void}
	 */
	it('passes the default editor through when no tokens are available', () => {
		pickableTokensForControl.mockReturnValue([]);
		const result = applyFilters(EDITOR_HOOK, 'DEFAULT', {
			control: 'measureRange',
			index: 0,
			value: ['0', '0', '0', '0'],
			onChange: jest.fn(),
			context: CONTEXT,
		});
		expect(result).toBe('DEFAULT');
	});

	/**
	 * A control with no field adapter (the whole-value box-shadow control) is left untouched by the
	 * editor seam.
	 *
	 * @return {void}
	 */
	it('leaves a control with no field slot (boxShadow) untouched', () => {
		const result = applyFilters(EDITOR_HOOK, 'DEFAULT', {
			control: 'boxShadow',
			value: '',
			onChange: jest.fn(),
			context: CONTEXT,
		});
		expect(result).toBe('DEFAULT');
	});
});

describe('actions seam', () => {
	/**
	 * A field control carries its token affordance in the editor seam, so it appends nothing to the
	 * header actions.
	 *
	 * @return {void}
	 */
	it('appends no action for a field control', () => {
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
	/**
	 * With no token set, the box-shadow header renders a picker that writes the chosen alias through the
	 * context-supplied write handler.
	 *
	 * @return {void}
	 */
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

	/**
	 * With a token set, the box-shadow header renders a chip whose unlink clears the alias.
	 *
	 * @return {void}
	 */
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
