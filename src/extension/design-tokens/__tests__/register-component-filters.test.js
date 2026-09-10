/* eslint-env jest */
// cspell:ignore Abril Fatface .

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
// Through the barrel, the same path the production file uses: importing the implementation files
// directly would let this pass while a missing or renamed barrel export broke the real import.
import {
	FontFamilySelector,
	TokenChip,
	TokenPickerButton,
	TokenSelector as TokenFieldControl,
} from '../../../token-controls';

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
	 * A scalar inherited default reaches every slot unchanged, so a preset holding one value still shows
	 * that value as the default on each corner.
	 *
	 * @return {void}
	 */
	it('passes a scalar default value through to every slot', () => {
		const result = applyFilters(EDITOR_HOOK, 'DEFAULT', {
			control: 'measureRange',
			index: 2,
			value: ['', '', '', ''],
			onChange: jest.fn(),
			context: { ...CONTEXT, defaultValue: '0.5rem' },
		});

		expect(result.props.defaultValue).toBe('0.5rem');
	});

	/**
	 * A per-corner inherited default is narrowed to the slot being rendered, so each corner shows its own
	 * default rather than the whole list.
	 *
	 * @return {void}
	 */
	it('narrows a per-corner default value to the rendered slot', () => {
		const result = applyFilters(EDITOR_HOOK, 'DEFAULT', {
			control: 'measureRange',
			index: 2,
			value: ['', '', '', ''],
			onChange: jest.fn(),
			context: { ...CONTEXT, defaultValue: ['1px', '2px', '3px', '4px'] },
		});

		expect(result.props.defaultValue).toBe('3px');
	});

	/**
	 * The per-corner inherited-from-another-breakpoint flag is narrowed to the slot being rendered, so a
	 * corner that inherits reads as inherited while a sibling falling back to the preset does not.
	 *
	 * @return {void}
	 */
	it('narrows the per-corner inherited flag to the rendered slot', () => {
		const inheritedDefault = [true, false, true, false];
		const slot = (index) =>
			applyFilters(EDITOR_HOOK, 'DEFAULT', {
				control: 'measureRange',
				index,
				value: ['', '', '', ''],
				onChange: jest.fn(),
				context: { ...CONTEXT, defaultValue: ['1px', '2px', '3px', '4px'], inheritedDefault },
			});

		expect(slot(0).props.inherited).toBe(true);
		expect(slot(1).props.inherited).toBe(false);
	});

	/**
	 * The linked "all sides" slot arrives with a null index and stands for the first corner, so it reports
	 * that corner's default and inherited flag rather than nothing.
	 *
	 * @return {void}
	 */
	it('reads the first corner for the linked slot, which has a null index', () => {
		const result = applyFilters(EDITOR_HOOK, 'DEFAULT', {
			control: 'measureRange',
			index: null,
			value: ['', '', '', ''],
			onChange: jest.fn(),
			context: {
				...CONTEXT,
				defaultValue: ['1px', '2px', '3px', '4px'],
				inheritedDefault: [true, false, false, false],
			},
		});

		expect(result.props.defaultValue).toBe('1px');
		expect(result.props.inherited).toBe(true);
	});

	/**
	 * With no inherited-default context the slot reports not-inherited, so a control that never passes the
	 * flag keeps the preset-default wording.
	 *
	 * @return {void}
	 */
	it('reports not inherited when the context carries no inherited flag', () => {
		const result = applyFilters(EDITOR_HOOK, 'DEFAULT', {
			control: 'measureRange',
			index: 0,
			value: ['', '', '', ''],
			onChange: jest.fn(),
			context: { ...CONTEXT, defaultValue: '0.5rem' },
		});

		expect(result.props.inherited).toBe(false);
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

describe('font-family seam', () => {
	const FONTS = { favorites: ['Georgia'], custom: [], manageUrl: 'https://example.test/manage' };

	beforeEach(() => {
		window.kadenceDesignTokensFonts = FONTS;
		window.kadence_blocks_params = { g_font_names: ['Abel'] };
	});

	afterEach(() => {
		delete window.kadenceDesignTokensFonts;
		delete window.kadence_blocks_params;
	});

	/**
	 * A block that opted in gets the favorites-aware picker in place of the shared control's font
	 * select, carrying the current family and the site's favorites.
	 *
	 * @return {void}
	 */
	it('replaces the font select with the font-family field, carrying the favorites', () => {
		const editor = applyFilters(EDITOR_HOOK, 'DEFAULT', {
			control: 'fontFamily',
			index: null,
			value: 'Inter',
			onChange: jest.fn(),
			context: { blockName: 'kadence/singlebtn' },
		});

		expect(editor.type).toBe(FontFamilySelector);
		expect(editor.props.value).toBe('Inter');
		expect(editor.props.favorites).toEqual(['Georgia']);
		expect(editor.props.manageUrl).toBe('https://example.test/manage');
	});

	/**
	 * A block that supplies binding state gets the preset indicator beside the field. Font family is
	 * not token-backed, but a preset can still set one, so there is a preset value to match or diverge
	 * from and the mark reports which.
	 *
	 * @return {void}
	 */
	it('renders the binding indicator when the block supplies binding state', () => {
		const onReset = jest.fn();
		const editor = applyFilters(EDITOR_HOOK, 'DEFAULT', {
			control: 'fontFamily',
			index: null,
			value: 'Inter',
			onChange: jest.fn(),
			context: {
				blockName: 'kadence/advancedheading',
				state: { bound: true, overridden: true },
				onReset,
			},
		});

		expect(editor.props.indicator).not.toBeNull();
		expect(editor.props.indicator.props.state).toEqual({ bound: true, overridden: true });
		expect(editor.props.indicator.props.onReset).toBe(onReset);
	});

	/**
	 * A block whose preset surface carries no family entry passes no state, and the field renders
	 * exactly as it did before the indicator existed.
	 *
	 * @return {void}
	 */
	it('renders no indicator when the block supplies no binding state', () => {
		const editor = applyFilters(EDITOR_HOOK, 'DEFAULT', {
			control: 'fontFamily',
			index: null,
			value: 'Inter',
			onChange: jest.fn(),
			context: { blockName: 'kadence/singlebtn' },
		});

		expect(editor.props.indicator).toBeNull();
	});

	/**
	 * Both of the picker's tabs write a plain family string — never an alias, since a favorite is not
	 * a token — and Reset clears back to the theme's font.
	 *
	 * @return {void}
	 */
	it('writes a plain family string on pick, and empty on clear', async () => {
		const onChange = jest.fn();
		const editor = applyFilters(EDITOR_HOOK, 'DEFAULT', {
			control: 'fontFamily',
			index: null,
			value: '',
			onChange,
			context: { blockName: 'kadence/singlebtn' },
		});

		await editor.props.onPick('Abril Fatface');
		expect(onChange).toHaveBeenCalledWith('Abril Fatface');

		editor.props.onClear();
		expect(onChange).toHaveBeenCalledWith('');
	});

	/**
	 * The write waits on the font, which is the whole point: writing first would put the new family
	 * on the canvas before the face existed, which is the flash this removes.
	 *
	 * @return {void}
	 */
	it('does not write until the font is ready', async () => {
		const onChange = jest.fn();
		const editor = applyFilters(EDITOR_HOOK, 'DEFAULT', {
			control: 'fontFamily',
			index: null,
			value: '',
			onChange,
			context: { blockName: 'kadence/singlebtn' },
		});

		const pick = editor.props.onPick('Abril Fatface');

		expect(onChange).not.toHaveBeenCalled();

		await pick;

		expect(onChange).toHaveBeenCalledWith('Abril Fatface');
	});

	/**
	 * A block that passes no context keeps the react-select it has always had — that is how a block
	 * which has not opted in is left untouched.
	 *
	 * @return {void}
	 */
	it('falls back to the control default when the block passes no context', () => {
		const editor = applyFilters(EDITOR_HOOK, 'DEFAULT', {
			control: 'fontFamily',
			index: null,
			value: 'Inter',
			onChange: jest.fn(),
		});

		expect(editor).toBe('DEFAULT');
	});

	/**
	 * The font-family case never consults the pickable-token pool: a family is not a token, so the
	 * picker must render even with an empty pool.
	 *
	 * @return {void}
	 */
	it('renders without consulting the pickable-token pool', () => {
		pickableTokensForControl.mockReturnValue([]);
		pickableTokensForControl.mockClear();

		const editor = applyFilters(EDITOR_HOOK, 'DEFAULT', {
			control: 'fontFamily',
			index: null,
			value: 'Inter',
			onChange: jest.fn(),
			context: { blockName: 'kadence/singlebtn' },
		});

		expect(editor.type).toBe(FontFamilySelector);
		expect(pickableTokensForControl).not.toHaveBeenCalled();
	});
});
