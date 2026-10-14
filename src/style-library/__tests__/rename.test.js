/* eslint-env jest */
import { checkRename } from '../helpers/rename';

describe('checkRename', () => {
	const isTaken = (name) => name.toLowerCase() === 'taken';

	/**
	 * A new, unused name is savable, and comes back trimmed the way it would be stored.
	 *
	 * @return {void}
	 */
	it('accepts a new name and trims it', () => {
		expect(checkRename('  Fresh ', 'Old', isTaken)).toEqual({
			trimmed: 'Fresh',
			isDuplicate: false,
			isSavable: true,
		});
	});

	/**
	 * An empty name is not savable, and the duplicate rule is never asked about it.
	 *
	 * @return {void}
	 */
	it('refuses an empty name without asking the duplicate rule', () => {
		const isDuplicate = jest.fn(() => true);

		expect(checkRename('   ', 'Old', isDuplicate)).toEqual({ trimmed: '', isDuplicate: false, isSavable: false });
		expect(isDuplicate).not.toHaveBeenCalled();
	});

	/**
	 * The current name, give or take outer spaces, would change nothing and is not savable.
	 *
	 * @return {void}
	 */
	it('refuses an unchanged name', () => {
		expect(checkRename('Old ', ' Old', isTaken)).toEqual({ trimmed: 'Old', isDuplicate: false, isSavable: false });
	});

	/**
	 * A name the caller's rule reports as taken is a duplicate and is not savable.
	 *
	 * @return {void}
	 */
	it('refuses a name the duplicate rule reports as taken', () => {
		expect(checkRename('Taken', 'Old', isTaken)).toEqual({ trimmed: 'Taken', isDuplicate: true, isSavable: false });
	});
});
