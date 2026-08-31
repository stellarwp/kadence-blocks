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

	it('rewrites the route before clearing the channel, so a failed rewrite leaves the guard armed', () => {
		const order = [];

		resetWorkspace({
			clearPublication: () => order.push('clear'),
			replace: () => order.push('replace'),
		});

		expect(order).toEqual(['replace', 'clear']);
	});

	it('leaves the draft channel intact when the route rewrite throws', () => {
		const clearPublication = jest.fn();

		expect(() =>
			resetWorkspace({
				clearPublication,
				replace: () => {
					throw new Error('replaceState refused');
				},
			})
		).toThrow('replaceState refused');

		// The panel is still mounted with its draft, so the publication has to survive — clearing
		// it would hide that draft from the navigation guard with nothing left to re-publish it.
		expect(clearPublication).not.toHaveBeenCalled();
	});

	it('tolerates a missing channel, the way every other channel consumer does', () => {
		const replace = jest.fn();

		expect(() => resetWorkspace({ clearPublication: null, replace })).not.toThrow();
		expect(replace).toHaveBeenCalledWith({ scope: '', item: '' });
	});
});
