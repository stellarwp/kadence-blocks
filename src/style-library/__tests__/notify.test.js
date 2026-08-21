/* eslint-env jest */

/**
 * WordPress dependencies
 */
import { dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { notifySuccess, notifyError } from '../helpers/notify';

jest.mock('@wordpress/data', () => ({
	dispatch: jest.fn(() => ({ createNotice: jest.fn() })),
}));

describe('notifySuccess', () => {
	it('dispatches a dismissible success snackbar notice keyed by the message', () => {
		const createNotice = jest.fn();

		dispatch.mockReturnValue({ createNotice });

		notifySuccess('Color saved.');

		expect(dispatch).toHaveBeenCalledWith('core/notices');
		expect(createNotice).toHaveBeenCalledWith('success', 'Color saved.', {
			type: 'snackbar',
			isDismissible: true,
			id: 'Color saved.',
		});
	});
});

describe('notifyError', () => {
	it('dispatches a dismissible error snackbar notice keyed by the message', () => {
		const createNotice = jest.fn();

		dispatch.mockReturnValue({ createNotice });

		notifyError('Could not save the color.');

		expect(dispatch).toHaveBeenCalledWith('core/notices');
		expect(createNotice).toHaveBeenCalledWith('error', 'Could not save the color.', {
			type: 'snackbar',
			isDismissible: true,
			id: 'Could not save the color.',
		});
	});
});
