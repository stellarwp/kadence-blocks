/* eslint-env jest */
import { hideCoreColorControls } from '../instance-controls';
import singleButton from './fixtures/singlebtn-entry.json';

describe('hideCoreColorControls', () => {
	beforeEach(() => {
		window.kadenceSiteStyles = { isFseMode: true, blocks: { 'kadence/singlebtn': singleButton } };
	});

	afterEach(() => {
		delete window.kadenceSiteStyles;
	});

	it.each(['color.background', 'color.text'])('turns off %s on Single Button', (path) => {
		expect(hideCoreColorControls(true, path, 'id', 'kadence/singlebtn')).toBe(false);
	});

	it('keeps other settings of Single Button', () => {
		expect(hideCoreColorControls(true, 'typography.fontSize', 'id', 'kadence/singlebtn')).toBe(true);
	});

	it('keeps the color settings of other blocks', () => {
		expect(hideCoreColorControls(true, 'color.background', 'id', 'core/group')).toBe(true);
	});
});
