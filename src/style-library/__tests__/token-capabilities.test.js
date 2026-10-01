/* eslint-env jest */
import { isBaselineToken, isDeletable, isRenameable } from '../helpers/token-capabilities';

describe('isDeletable', () => {
	it('returns true for a user-created token', () => {
		expect(isDeletable({ userCreated: true })).toBe(true);
	});

	it('returns false for a baseline token', () => {
		expect(isDeletable({ userCreated: false })).toBe(false);
	});

	it('returns false when userCreated is undefined', () => {
		expect(isDeletable({})).toBe(false);
	});
});

describe('isBaselineToken', () => {
	it('treats a missing flag as baseline', () => {
		expect(isBaselineToken({})).toBe(true);
		expect(isBaselineToken(null)).toBe(true);
	});
});

describe('isRenameable', () => {
	it('returns true for baseline and user-created tokens alike', () => {
		expect(isRenameable({ userCreated: false })).toBe(true);
		expect(isRenameable({ userCreated: true })).toBe(true);
	});
});
