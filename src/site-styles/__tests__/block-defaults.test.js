/* eslint-env jest */
import { gateBlockDefaults } from '../block-defaults';
import singleButton from './fixtures/singlebtn-entry.json';

const settings = { attributes: { noCustomDefaults: { type: 'boolean', default: false }, text: { type: 'string' } } };

describe('gateBlockDefaults', () => {
	afterEach(() => {
		delete window.kadenceSiteStyles;
	});

	it('turns the gate on by default for Single Button in FSE mode', () => {
		window.kadenceSiteStyles = { isFseMode: true, blocks: { 'kadence/singlebtn': singleButton } };

		const result = gateBlockDefaults(settings, 'kadence/singlebtn');

		expect(result.attributes.noCustomDefaults).toEqual({ type: 'boolean', default: true });
		expect(result.attributes.text).toBe(settings.attributes.text);
	});

	it('adds the attribute to a block without it', () => {
		window.kadenceSiteStyles = { isFseMode: true, blocks: { 'kadence/singlebtn': singleButton } };

		expect(gateBlockDefaults({ attributes: {} }, 'kadence/singlebtn').attributes.noCustomDefaults).toEqual({
			type: 'boolean',
			default: true,
		});
	});

	it('leaves classic mode and other blocks alone', () => {
		window.kadenceSiteStyles = { isFseMode: false, blocks: {} };
		expect(gateBlockDefaults(settings, 'kadence/singlebtn')).toBe(settings);

		window.kadenceSiteStyles = { isFseMode: true, blocks: { 'kadence/singlebtn': singleButton } };
		expect(gateBlockDefaults(settings, 'kadence/advancedheading')).toBe(settings);
	});
});
