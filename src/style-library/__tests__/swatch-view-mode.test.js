/* eslint-env jest */
/**
 * Internal dependencies
 */
import {
	DEFAULT_SWATCH_VIEW_MODE,
	SWATCH_VIEW_MODE_STORAGE_KEY,
	isSwatchViewMode,
	readSwatchViewMode,
	writeSwatchViewMode,
} from '../helpers/swatch-view-mode';

/**
 * An in-memory `Storage` stand-in.
 *
 * @param {Object} [initial] Starting entries.
 *
 * @since TBD
 *
 * @return {Object} The stub, with a `data` map for assertions.
 */
function makeStorage(initial = {}) {
	const data = { ...initial };

	return {
		data,
		getItem: jest.fn((key) => (key in data ? data[key] : null)),
		setItem: jest.fn((key, value) => {
			data[key] = value;
		}),
	};
}

/**
 * A `Storage` stand-in whose every call throws, like a blocked or full store.
 *
 * @since TBD
 *
 * @return {Object} The throwing stub.
 */
function makeThrowingStorage() {
	return {
		getItem: () => {
			throw new Error('blocked');
		},
		setItem: () => {
			throw new Error('blocked');
		},
	};
}

describe('swatch view mode helper', () => {
	/**
	 * Only the two known modes count as a mode.
	 *
	 * @return {void}
	 */
	it('accepts only grid and list in isSwatchViewMode', () => {
		expect(isSwatchViewMode('grid')).toBe(true);
		expect(isSwatchViewMode('list')).toBe(true);
		expect(isSwatchViewMode('table')).toBe(false);
		expect(isSwatchViewMode('')).toBe(false);
		expect(isSwatchViewMode(null)).toBe(false);
	});

	/**
	 * Without a usable store the reader falls back to the default mode.
	 *
	 * @return {void}
	 */
	it('falls back to grid when there is no storage', () => {
		expect(readSwatchViewMode(null)).toBe(DEFAULT_SWATCH_VIEW_MODE);
	});

	/**
	 * A store that throws on read must not break the screen.
	 *
	 * @return {void}
	 */
	it('falls back to grid when getItem throws', () => {
		expect(readSwatchViewMode(makeThrowingStorage())).toBe('grid');
	});

	/**
	 * Unknown or empty stored values are ignored.
	 *
	 * @return {void}
	 */
	it('falls back to grid for an unknown or empty stored value', () => {
		expect(readSwatchViewMode(makeStorage({ [SWATCH_VIEW_MODE_STORAGE_KEY]: 'table' }))).toBe('grid');
		expect(readSwatchViewMode(makeStorage({ [SWATCH_VIEW_MODE_STORAGE_KEY]: '' }))).toBe('grid');
		expect(readSwatchViewMode(makeStorage())).toBe('grid');
	});

	/**
	 * A valid stored mode is returned as is.
	 *
	 * @return {void}
	 */
	it('returns a stored list or grid mode', () => {
		expect(readSwatchViewMode(makeStorage({ [SWATCH_VIEW_MODE_STORAGE_KEY]: 'list' }))).toBe('list');
		expect(readSwatchViewMode(makeStorage({ [SWATCH_VIEW_MODE_STORAGE_KEY]: 'grid' }))).toBe('grid');
	});

	/**
	 * Writing saves the mode under the shared key.
	 *
	 * @return {void}
	 */
	it('stores the mode under the storage key', () => {
		const storage = makeStorage();

		writeSwatchViewMode('list', storage);

		expect(storage.data[SWATCH_VIEW_MODE_STORAGE_KEY]).toBe('list');
	});

	/**
	 * An invalid mode never reaches the store.
	 *
	 * @return {void}
	 */
	it('ignores an invalid mode on write', () => {
		const storage = makeStorage();

		writeSwatchViewMode('table', storage);

		expect(storage.setItem).not.toHaveBeenCalled();
	});

	/**
	 * A store that throws on write must not break the screen, and a missing store is a no-op.
	 *
	 * @return {void}
	 */
	it('swallows a throwing setItem and a missing storage', () => {
		expect(() => writeSwatchViewMode('list', makeThrowingStorage())).not.toThrow();
		expect(() => writeSwatchViewMode('list', null)).not.toThrow();
	});
});
