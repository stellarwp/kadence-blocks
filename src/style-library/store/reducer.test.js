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
	setOptimisticScalePatch,
	clearOptimisticScalePatch,
	setOptimisticScaleDeletion,
	clearOptimisticScaleDeletion,
	setPaletteBusy,
	setScaleBusy,
	forgetLibrary,
} from './actions';
import { EMPTY_OPTIMISTIC_SWATCH_EDIT, EMPTY_OPTIMISTIC_SCALE_EDIT } from './constants';

describe('reducer', () => {
	it('starts with empty slices', () => {
		const state = reducer(undefined, { type: '@@INIT' });

		expect(state).toEqual({
			libraries: [],
			presets: {},
			paletteListings: {},
			feeds: {},
			optimisticSwatchEdits: {},
			optimisticScaleEdits: {},
			paletteBusy: {},
			scaleBusy: {},
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

	it('setOptimisticScalePatch() and clearOptimisticScalePatch() round-trip a patch', () => {
		let state = reducer(
			undefined,
			setOptimisticScalePatch('default', 'primitive.dimension.radius.sm', { label: 'Small' })
		);

		expect(state.optimisticScaleEdits).toEqual({
			default: {
				...EMPTY_OPTIMISTIC_SCALE_EDIT,
				patches: { 'primitive.dimension.radius.sm': { label: 'Small' } },
			},
		});

		state = reducer(state, clearOptimisticScalePatch('default', 'primitive.dimension.radius.sm'));

		expect(state.optimisticScaleEdits).toEqual({ default: EMPTY_OPTIMISTIC_SCALE_EDIT });
	});

	it('setOptimisticScaleDeletion() and clearOptimisticScaleDeletion() round-trip a deletion', () => {
		let state = reducer(undefined, setOptimisticScaleDeletion('default', 'primitive.dimension.custom.radius-2'));

		expect(state.optimisticScaleEdits).toEqual({
			default: { ...EMPTY_OPTIMISTIC_SCALE_EDIT, deletedTokens: ['primitive.dimension.custom.radius-2'] },
		});

		state = reducer(state, clearOptimisticScaleDeletion('default', 'primitive.dimension.custom.radius-2'));

		expect(state.optimisticScaleEdits).toEqual({ default: EMPTY_OPTIMISTIC_SCALE_EDIT });
	});

	it("leaves an unrelated scale slug's optimistic edits untouched by an action on a different slug", () => {
		let state = reducer(
			undefined,
			setOptimisticScalePatch('default', 'primitive.dimension.radius.sm', { label: 'Small' })
		);
		state = reducer(state, setOptimisticScalePatch('brand', 'primitive.dimension.spacing.lg', { label: 'Large' }));

		expect(state.optimisticScaleEdits).toEqual({
			default: {
				...EMPTY_OPTIMISTIC_SCALE_EDIT,
				patches: { 'primitive.dimension.radius.sm': { label: 'Small' } },
			},
			brand: {
				...EMPTY_OPTIMISTIC_SCALE_EDIT,
				patches: { 'primitive.dimension.spacing.lg': { label: 'Large' } },
			},
		});

		state = reducer(state, clearOptimisticScalePatch('default', 'primitive.dimension.radius.sm'));

		expect(state.optimisticScaleEdits).toEqual({
			default: EMPTY_OPTIMISTIC_SCALE_EDIT,
			brand: {
				...EMPTY_OPTIMISTIC_SCALE_EDIT,
				patches: { 'primitive.dimension.spacing.lg': { label: 'Large' } },
			},
		});
	});

	it('setPaletteBusy() stores a library key busy flag, leaving other keys alone', () => {
		let state = reducer(undefined, setPaletteBusy('ns::default', true));
		state = reducer(state, setPaletteBusy('ns::brand', false));

		expect(state.paletteBusy).toEqual({ 'ns::default': true, 'ns::brand': false });
	});

	it('setPaletteBusy() overwrites a previously stored flag for the same key', () => {
		let state = reducer(undefined, setPaletteBusy('ns::default', true));
		state = reducer(state, setPaletteBusy('ns::default', false));

		expect(state.paletteBusy).toEqual({ 'ns::default': false });
	});

	it('setScaleBusy() stores a slug busy flag, leaving other keys alone', () => {
		let state = reducer(undefined, setScaleBusy('default', true));
		state = reducer(state, setScaleBusy('brand', false));

		expect(state.scaleBusy).toEqual({ default: true, brand: false });
	});

	it('setScaleBusy() overwrites a previously stored flag for the same slug', () => {
		let state = reducer(undefined, setScaleBusy('default', true));
		state = reducer(state, setScaleBusy('default', false));

		expect(state.scaleBusy).toEqual({ default: false });
	});

	describe('FORGET_LIBRARY', () => {
		/**
		 * Build a state with two libraries' worth of entries in every slug-keyed slice, so each
		 * assertion can prove the sibling library survived rather than only that the target went.
		 *
		 * @return {Object} A populated store state.
		 */
		const populated = () => {
			let state = reducer(
				undefined,
				receiveBlockPresets('kb-design-tokens/v1::kadence/singlebtn::default', { a: 1 })
			);
			state = reducer(state, receiveBlockPresets('kb-design-tokens/v1::kadence/singlebtn::brand', { b: 2 }));
			state = reducer(state, receivePaletteListing('kb-design-tokens/v1::default', [{ id: 'p1' }]));
			state = reducer(state, receivePaletteListing('kb-design-tokens/v1::brand', [{ id: 'p2' }]));
			state = reducer(
				state,
				setOptimisticSwatchPatch('kb-design-tokens/v1::default::p1', 'color.brand', { value: '#000' })
			);
			state = reducer(
				state,
				setOptimisticSwatchPatch('kb-design-tokens/v1::brand::p2', 'color.brand', { value: '#fff' })
			);
			state = reducer(state, setOptimisticScalePatch('default', 'size.md', { value: '1rem' }));
			state = reducer(state, setOptimisticScalePatch('brand', 'size.md', { value: '2rem' }));
			state = reducer(state, setPaletteBusy('kb-design-tokens/v1::default', true));
			state = reducer(state, setPaletteBusy('kb-design-tokens/v1::brand', true));
			state = reducer(state, setScaleBusy('default', true));
			state = reducer(state, setScaleBusy('brand', true));

			return state;
		};

		it('drops every slug-keyed entry for the named library and leaves its siblings intact', () => {
			const state = reducer(populated(), forgetLibrary('default'));

			expect(state.presets).toEqual({ 'kb-design-tokens/v1::kadence/singlebtn::brand': { b: 2 } });
			expect(state.paletteListings).toEqual({ 'kb-design-tokens/v1::brand': [{ id: 'p2' }] });
			expect(Object.keys(state.optimisticSwatchEdits)).toEqual(['kb-design-tokens/v1::brand::p2']);
			expect(Object.keys(state.optimisticScaleEdits)).toEqual(['brand']);
			expect(state.paletteBusy).toEqual({ 'kb-design-tokens/v1::brand': true });
			expect(state.scaleBusy).toEqual({ brand: true });
		});

		it('leaves the feeds slice alone, because the delete flow overwrites the feed it lands on', () => {
			const before = reducer(populated(), receiveDesignTokensFeed('default', { slug: 'default' }));
			const after = reducer(before, forgetLibrary('default'));

			expect(after.feeds).toBe(before.feeds);
		});

		it('returns the identical slice objects when no key matches, so nothing re-renders', () => {
			const before = populated();
			const after = reducer(before, forgetLibrary('nonexistent'));

			expect(after.presets).toBe(before.presets);
			expect(after.paletteListings).toBe(before.paletteListings);
			expect(after.optimisticSwatchEdits).toBe(before.optimisticSwatchEdits);
			expect(after.optimisticScaleEdits).toBe(before.optimisticScaleEdits);
			expect(after.paletteBusy).toBe(before.paletteBusy);
			expect(after.scaleBusy).toBe(before.scaleBusy);
		});

		it('does not mistake a block name for a slug in a presets key', () => {
			const state = reducer(populated(), forgetLibrary('kadence/singlebtn'));

			expect(Object.keys(state.presets)).toHaveLength(2);
		});
	});
});
