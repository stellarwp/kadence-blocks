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

// `helpers/notify.js`'s side-effect `import '@wordpress/notices'` registers the real `core/notices`
// store — which itself imports `@wordpress/data` internally, and would resolve to the mock above
// (missing everything the real store's reducer needs) if left unmocked here. This test only
// exercises `dispatch()` being called correctly, never the real store, so an empty mock is enough.
jest.mock('@wordpress/notices', () => ({}));

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
