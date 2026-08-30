/* eslint-env jest */
import { resetWorkspace } from '../helpers/workspace';

describe('resetWorkspace', () => {
	it('clears the draft channel and empties the route scope and item', () => {
		const clearPublication = jest.fn();
		const replace = jest.fn();

		resetWorkspace({ clearPublication, replace });

		expect(clearPublication).toHaveBeenCalledTimes(1);
		expect(replace).toHaveBeenCalledWith({ scope: '', item: '' });
	});

	it('keeps the current screen, which exists in every library', () => {
		const replace = jest.fn();

		resetWorkspace({ clearPublication: jest.fn(), replace });

		expect(replace.mock.calls[0][0]).not.toHaveProperty('screen');
	});

	it('clears the channel before the route, so an unmounting panel cannot republish a dirty draft', () => {
		const order = [];

		resetWorkspace({
			clearPublication: () => order.push('clear'),
			replace: () => order.push('replace'),
		});

		expect(order).toEqual(['clear', 'replace']);
	});

	it('tolerates a missing channel, the way every other channel consumer does', () => {
		const replace = jest.fn();

		expect(() => resetWorkspace({ clearPublication: null, replace })).not.toThrow();
		expect(replace).toHaveBeenCalledWith({ scope: '', item: '' });
	});
});
