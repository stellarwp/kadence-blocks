/* eslint-env jest */
/* Run from the plugin root: npm run test:unit -- src/blocks/image/utils.test.js */
import { isSvgUrl } from './utils';

describe('image utils', () => {
	describe('isSvgUrl', () => {
		it('detects an svg url', () => {
			expect(isSvgUrl('https://example.com/logo.svg')).toBe(true);
		});

		it('rejects a url of another type', () => {
			expect(isSvgUrl('https://example.com/photo.jpg')).toBe(false);
		});

		it.each([
			['an unresolved dynamic field object', { error: true, message: 'Invalid field' }],
			['an attachment id', 42],
			['an acf image array', { ID: 42, url: 'https://example.com/logo.svg' }],
			['an empty string', ''],
			['null', null],
			['undefined', undefined],
			['false', false],
		])('returns false rather than throwing on %s', (_label, url) => {
			expect(isSvgUrl(url)).toBe(false);
		});
	});
});
