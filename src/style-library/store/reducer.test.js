/* eslint-env jest */
import { reducer } from './reducer';
import {
	receiveLibraries,
	receiveBlockPresets,
	receivePaletteListing,
	receiveDesignTokensFeed,
	setOptimisticSwatchPatch,
	clearOptimisticSwatchPatch,
	setOptimisticDeletion,
	clearOptimisticDeletion,
	setOptimisticAddition,
	clearOptimisticAddition,
} from './actions';
import { EMPTY_OPTIMISTIC_SWATCH_EDIT } from './constants';

describe('reducer', () => {
	it('starts with empty slices', () => {
		const state = reducer(undefined, { type: '@@INIT' });

		expect(state).toEqual({
			libraries: [],
			presets: {},
			paletteListings: {},
			feeds: {},
			optimisticSwatchEdits: {},
		});
	});

	it('stores the libraries list on RECEIVE_LIBRARIES', () => {
		const rows = [{ slug: 'default', title: '', version: 'v1', document: {} }];
		const state = reducer(undefined, receiveLibraries(rows));

		expect(state.libraries).toBe(rows);
	});

	it('stores a block presets payload under its key, leaving other keys alone', () => {
		let state = reducer(undefined, receiveBlockPresets('a', { version: 'a1' }));
		state = reducer(state, receiveBlockPresets('b', { version: 'b1' }));

		expect(state.presets).toEqual({ a: { version: 'a1' }, b: { version: 'b1' } });
	});

	it('stores a palette listing payload under its key, leaving other keys alone', () => {
		const rowsA = [{ id: 'default', label: 'Default' }];
		const rowsB = [{ id: 'custom-1', label: 'Custom' }];

		let state = reducer(undefined, receivePaletteListing('a', rowsA));
		state = reducer(state, receivePaletteListing('b', rowsB));

		expect(state.paletteListings).toEqual({ a: rowsA, b: rowsB });
	});

	it('stores a feed payload under its slug', () => {
		const state = reducer(undefined, receiveDesignTokensFeed('default', { version: 'v1' }));

		expect(state.feeds).toEqual({ default: { version: 'v1' } });
	});

	it('setOptimisticSwatchPatch() and clearOptimisticSwatchPatch() round-trip a patch', () => {
		let state = reducer(undefined, setOptimisticSwatchPatch('a', 'token.color', { label: 'Red' }));

		expect(state.optimisticSwatchEdits).toEqual({
			a: { ...EMPTY_OPTIMISTIC_SWATCH_EDIT, patches: { 'token.color': { label: 'Red' } } },
		});

		state = reducer(state, clearOptimisticSwatchPatch('a', 'token.color'));

		expect(state.optimisticSwatchEdits).toEqual({ a: EMPTY_OPTIMISTIC_SWATCH_EDIT });
	});

	it('setOptimisticDeletion() and clearOptimisticDeletion() round-trip a swatch deletion', () => {
		let state = reducer(undefined, setOptimisticDeletion('a', 'swatch', 'token.color'));

		expect(state.optimisticSwatchEdits).toEqual({
			a: { ...EMPTY_OPTIMISTIC_SWATCH_EDIT, deletedTokens: ['token.color'] },
		});

		state = reducer(state, clearOptimisticDeletion('a', 'swatch', 'token.color'));

		expect(state.optimisticSwatchEdits).toEqual({ a: EMPTY_OPTIMISTIC_SWATCH_EDIT });
	});

	it('setOptimisticDeletion() and clearOptimisticDeletion() round-trip a group deletion', () => {
		let state = reducer(undefined, setOptimisticDeletion('a', 'group', 'brand'));

		expect(state.optimisticSwatchEdits).toEqual({
			a: { ...EMPTY_OPTIMISTIC_SWATCH_EDIT, deletedGroups: ['brand'] },
		});

		state = reducer(state, clearOptimisticDeletion('a', 'group', 'brand'));

		expect(state.optimisticSwatchEdits).toEqual({ a: EMPTY_OPTIMISTIC_SWATCH_EDIT });
	});

	it('setOptimisticAddition() and clearOptimisticAddition() round-trip a swatch addition', () => {
		const swatch = { groupId: 'brand', token: 'color.new', label: 'New', $value: '#FF0000' };
		let state = reducer(undefined, setOptimisticAddition('a', 'swatch', swatch));

		expect(state.optimisticSwatchEdits).toEqual({
			a: { ...EMPTY_OPTIMISTIC_SWATCH_EDIT, addedSwatches: [swatch] },
		});

		state = reducer(state, clearOptimisticAddition('a', 'swatch', 'color.new'));

		expect(state.optimisticSwatchEdits).toEqual({ a: EMPTY_OPTIMISTIC_SWATCH_EDIT });
	});

	it('setOptimisticAddition() and clearOptimisticAddition() round-trip a group addition', () => {
		const group = { id: 'new-group', label: 'New Group', swatches: [] };
		let state = reducer(undefined, setOptimisticAddition('a', 'group', group));

		expect(state.optimisticSwatchEdits).toEqual({
			a: { ...EMPTY_OPTIMISTIC_SWATCH_EDIT, addedGroups: [group] },
		});

		state = reducer(state, clearOptimisticAddition('a', 'group', 'new-group'));

		expect(state.optimisticSwatchEdits).toEqual({ a: EMPTY_OPTIMISTIC_SWATCH_EDIT });
	});

	it("leaves an unrelated key's optimistic edits untouched by an action on a different key", () => {
		let state = reducer(undefined, setOptimisticSwatchPatch('a', 'token.color', { label: 'Red' }));
		state = reducer(state, setOptimisticSwatchPatch('b', 'token.blue', { label: 'Blue' }));

		expect(state.optimisticSwatchEdits).toEqual({
			a: { ...EMPTY_OPTIMISTIC_SWATCH_EDIT, patches: { 'token.color': { label: 'Red' } } },
			b: { ...EMPTY_OPTIMISTIC_SWATCH_EDIT, patches: { 'token.blue': { label: 'Blue' } } },
		});

		state = reducer(state, clearOptimisticSwatchPatch('a', 'token.color'));

		expect(state.optimisticSwatchEdits).toEqual({
			a: EMPTY_OPTIMISTIC_SWATCH_EDIT,
			b: { ...EMPTY_OPTIMISTIC_SWATCH_EDIT, patches: { 'token.blue': { label: 'Blue' } } },
		});
	});
});
