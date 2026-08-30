/* eslint-env jest */
import { resetWorkspace } from '../helpers/workspace';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { useDraftChannelState } from '../hooks/use-draft-channel';

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

describe('resetWorkspace against the live draft channel', () => {
	let container;
	let root;

	beforeEach(() => {
		global.IS_REACT_ACT_ENVIRONMENT = true;
		container = document.createElement('div');
		document.body.appendChild(container);
		root = createRoot(container);
	});

	afterEach(() => {
		act(() => root.unmount());
		container.remove();
		delete global.IS_REACT_ACT_ENVIRONMENT;
	});

	/**
	 * Mount the real draft channel and expose its latest value, so the guard can be exercised
	 * against the actual hook rather than a stand-in.
	 *
	 * @return {Function} Reads the channel value from the most recent render.
	 */
	function mountChannel() {
		let latest = null;

		function Probe() {
			latest = useDraftChannelState();
			return null;
		}

		act(() => root.render(<Probe />));

		return () => latest;
	}

	it('lets a guarded navigation run immediately after a dirty draft is cleared', () => {
		const channel = mountChannel();
		const navigation = jest.fn();

		act(() => channel().publish({ itemId: 'size.md', label: 'Medium', draft: { value: '2rem' }, isDirty: true }));
		act(() => channel().guard(navigation));

		// The reported symptom: a dirty draft parks the navigation behind the modal.
		expect(channel().isGuardOpen).toBe(true);
		expect(navigation).not.toHaveBeenCalled();

		act(() => resetWorkspace({ clearPublication: channel().clearPublication, replace: jest.fn() }));

		expect(channel().isGuardOpen).toBe(false);

		act(() => channel().guard(navigation));

		expect(navigation).toHaveBeenCalledTimes(1);
	});
});
