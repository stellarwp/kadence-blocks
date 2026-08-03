/* eslint-env jest */
import { parseRoute, serializeRoute, SCREEN_QUERY_ARG, ITEM_QUERY_ARG } from '../helpers/route';

const ADMIN_URL = 'https://example.test/wp-admin/admin.php?page=kadence-blocks-style-library';

describe('parseRoute', () => {
	it('returns empty strings when neither arg is present', () => {
		expect(parseRoute(ADMIN_URL)).toEqual({ screen: '', item: '' });
	});

	it('reads screen and item from a full admin URL', () => {
		const url = `${ADMIN_URL}&${SCREEN_QUERY_ARG}=typography&${ITEM_QUERY_ARG}=heading-1`;

		expect(parseRoute(url)).toEqual({ screen: 'typography', item: 'heading-1' });
	});
});

describe('serializeRoute', () => {
	it('preserves the page arg and unknown params', () => {
		const url = `${ADMIN_URL}&foo=bar`;
		const result = serializeRoute({ screen: 'color', item: '' }, url);

		expect(result).toContain('page=kadence-blocks-style-library');
		expect(result).toContain('foo=bar');
		expect(result).toContain(`${SCREEN_QUERY_ARG}=color`);
	});

	it('preserves a wp-admin companion arg like paged across a route write', () => {
		const url = `${ADMIN_URL}&paged=2`;
		const result = serializeRoute({ screen: 'color', item: 'heading-1' }, url);

		expect(result).toContain('paged=2');
		expect(result).toContain('page=kadence-blocks-style-library');
		expect(result).toContain(`${SCREEN_QUERY_ARG}=color`);
		expect(result).toContain(`${ITEM_QUERY_ARG}=heading-1`);
		expect(SCREEN_QUERY_ARG).toBe('kb-screen');
		expect(ITEM_QUERY_ARG).toBe('kb-item');
	});

	it('removes an arg when the route field is empty', () => {
		const url = `${ADMIN_URL}&${SCREEN_QUERY_ARG}=color&${ITEM_QUERY_ARG}=heading-1`;
		const result = serializeRoute({ screen: 'color', item: '' }, url);

		expect(result).toContain(`${SCREEN_QUERY_ARG}=color`);
		expect(result).not.toContain(ITEM_QUERY_ARG);
	});

	it('round-trips a route through serializeRoute then parseRoute', () => {
		const route = { screen: 'typography', item: 'heading-1' };
		const result = serializeRoute(route, ADMIN_URL);

		expect(parseRoute(result)).toEqual(route);
	});

	it('leaves an unrelated existing screen-less URL byte-identical', () => {
		const result = serializeRoute({ screen: '', item: '' }, ADMIN_URL);

		expect(result).toBe(ADMIN_URL);
	});
});
