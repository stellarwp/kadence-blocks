/* eslint-env jest */
import { addSiteStylesSupports } from '../block-supports';
import singleButton from './fixtures/singlebtn-entry.json';

const settings = { supports: { html: false }, selectors: {} };

describe('addSiteStylesSupports', () => {
	afterEach(() => {
		delete window.kadenceSiteStyles;
	});

	it('adds the color support in FSE mode and leaves the selectors to the server definition', () => {
		window.kadenceSiteStyles = { isFseMode: true, blocks: { 'kadence/singlebtn': singleButton } };

		const result = addSiteStylesSupports(settings, 'kadence/singlebtn');

		expect(result.supports).toEqual({ html: false, ...singleButton.supports });
		expect(result.selectors).toBe(settings.selectors);
	});

	it('leaves the settings alone outside FSE mode', () => {
		window.kadenceSiteStyles = { isFseMode: false, blocks: {} };

		expect(addSiteStylesSupports(settings, 'kadence/singlebtn')).toBe(settings);
	});

	it('leaves the settings alone without the server data', () => {
		expect(addSiteStylesSupports(settings, 'kadence/singlebtn')).toBe(settings);
	});

	it('leaves other blocks alone', () => {
		window.kadenceSiteStyles = { isFseMode: true, blocks: { 'kadence/singlebtn': singleButton } };

		expect(addSiteStylesSupports(settings, 'kadence/infobox')).toBe(settings);
	});
});
