/* eslint-env jest */

import { isEmptyValue, matchesPreset } from '../normalize';

describe('normalize dispatch falls back to text for an unrecognized kind', () => {
	/**
	 * A kind the `KINDS` dispatch table has no entry for degrades to the `text` handler's `isEmpty`
	 * check instead of throwing — the localized catalog's `kind` values come from PHP's registry and are
	 * not narrowed to this table's keys at write time.
	 *
	 * @return {void}
	 */
	it('reads an unrecognized kind as empty when the value is empty text', () => {
		expect(isEmptyValue('unknown-kind', '')).toBe(true);
	});

	/**
	 * An unrecognized kind's non-empty value reads as not empty, matching the `text` handler.
	 *
	 * @return {void}
	 */
	it('reads an unrecognized kind as not empty when the value is non-empty text', () => {
		expect(isEmptyValue('unknown-kind', 'value')).toBe(false);
	});

	/**
	 * An unrecognized kind's compare falls back to the `text` handler's trimmed string compare instead
	 * of throwing on a missing dispatch-table entry.
	 *
	 * @return {void}
	 */
	it('compares an unrecognized kind as text', () => {
		expect(matchesPreset('unknown-kind', 'value', '', 'value')).toBe(true);
		expect(matchesPreset('unknown-kind', 'value', '', 'other')).toBe(false);
	});
});
