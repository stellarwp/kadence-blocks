/* eslint-env jest */
import { computeIsDirty, resolveDraftSeed, resolveSavedSeed } from '../hooks/use-settings-panel';

describe('resolveDraftSeed', () => {
	it('does not seed while the caller has no values yet (initialValues null)', () => {
		expect(resolveDraftSeed('primitive.color.brand.primary', null, null)).toEqual({
			shouldSeed: false,
			nextSeededFor: null,
		});
	});

	it('seeds once values arrive after mount for an already-open item (the cold-load path)', () => {
		const itemId = 'primitive.color.brand.primary';
		const initialValues = { label: 'Main 1', value: '#3182CE' };

		// The item was already open (route.item set at mount) while the caller's data was still
		// loading, so no seed has happened yet — `seededFor` is still null for this item.
		expect(resolveDraftSeed(itemId, initialValues, null)).toEqual({
			shouldSeed: true,
			nextSeededFor: itemId,
		});
	});

	it('seeds immediately when the item changes and values are already available (the click path)', () => {
		expect(
			resolveDraftSeed(
				'primitive.color.brand.secondary',
				{ label: 'Main 2', value: '#2B6CB0' },
				'primitive.color.brand.primary'
			)
		).toEqual({
			shouldSeed: true,
			nextSeededFor: 'primitive.color.brand.secondary',
		});
	});

	it('does not reseed on a later initialValues identity change for the same item once already seeded', () => {
		const itemId = 'primitive.color.brand.primary';

		// A fresh object identity, as `refreshFeed` produces after a save elsewhere, but the same item
		// — this must not clobber a modified draft.
		const reloadedValues = { label: 'Main 1', value: '#3182CE' };

		expect(resolveDraftSeed(itemId, reloadedValues, itemId)).toEqual({
			shouldSeed: false,
			nextSeededFor: itemId,
		});
	});

	it('resets the seed-tracking value when the item changes while the new item has no values yet', () => {
		expect(resolveDraftSeed('primitive.color.brand.secondary', null, 'primitive.color.brand.primary')).toEqual({
			shouldSeed: false,
			nextSeededFor: null,
		});
	});

	it('treats undefined the same as null — not yet ready', () => {
		expect(resolveDraftSeed('primitive.color.brand.primary', undefined, null)).toEqual({
			shouldSeed: false,
			nextSeededFor: null,
		});
	});
});

describe('computeIsDirty', () => {
	it('is false while the draft matches the caller’s persisted values', () => {
		const values = { label: 'Main 1', value: '#3182ce' };

		expect(computeIsDirty(values, values)).toBe(false);
		expect(computeIsDirty({ label: 'Main 1', value: '#3182ce' }, { label: 'Main 1', value: '#3182ce' })).toBe(
			false
		);
	});

	it('is true once the draft diverges from the persisted values', () => {
		const initialValues = { label: 'Main 1', value: '#3182ce' };
		const draft = { label: 'Main 1', value: '#ff0000' };

		expect(computeIsDirty(draft, initialValues)).toBe(true);
	});

	it('settles back to false on its own once a reload catches up to a draft that was never reset — the exact sequence a swatch color save relies on instead of a stale-closure reset', () => {
		const initialValues = { label: 'Main 1', value: '#3182ce' };
		// The user edits the color; the draft now holds what will be saved.
		const draft = { label: 'Main 1', value: '#ff0000' };

		expect(computeIsDirty(draft, initialValues)).toBe(true);

		// The save lands, and the caller's `initialValues` recomputes from the reloaded server data —
		// a NEW object, but with the same values the draft already holds (no `resetDraft()` call
		// needed to get here): `computeIsDirty` reads the current values, not a captured `initialValues`
		// from an earlier render, so it converges on its own.
		const reloadedValues = { label: 'Main 1', value: '#ff0000' };

		expect(computeIsDirty(draft, reloadedValues)).toBe(false);
	});

	it('treats a missing initialValues as an empty object, matching an empty draft', () => {
		expect(computeIsDirty({}, null)).toBe(false);
		expect(computeIsDirty({ label: 'Main 1' }, null)).toBe(true);
	});
});

describe('resolveSavedSeed', () => {
	/**
	 * The whole point: a write is not a round trip, so the panel has to be told what was actually
	 * stored before its dirty check can ever come out clean.
	 */
	it('takes what the server stored when the draft has not moved since the write', () => {
		const submitted = { label: 'Title', tokens: { fontWeight: '400' } };
		const saved = { label: 'Title', tokens: { fontWeight: 'semantic.font-weight.heading' } };

		expect(resolveSavedSeed({ ...submitted }, submitted, saved)).toBe(saved);
	});

	/**
	 * An edit made while the write was in flight is the user's, and keeping it means the panel stays
	 * honestly dirty. Returned by reference so React bails out of the re-render.
	 */
	it('keeps the current draft, by reference, when it moved during the write', () => {
		const submitted = { label: 'Title', tokens: { fontWeight: '400' } };
		const current = { label: 'Title', tokens: { fontWeight: '700' } };
		const saved = { label: 'Title', tokens: { fontWeight: 'semantic.font-weight.heading' } };

		expect(resolveSavedSeed(current, submitted, saved)).toBe(current);
	});

	it('keeps the current draft when there was nothing to save', () => {
		const current = { label: 'Title', tokens: {} };

		expect(resolveSavedSeed(current, current, null)).toBe(current);
	});
});
