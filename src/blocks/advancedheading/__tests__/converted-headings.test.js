/* eslint-env jest */
/**
 * A converted core Heading arrives like a new default block, so the default-block effect asks this
 * registry whether a block came from a conversion before it turns the tag into a paragraph.
 */
import { isConvertedHeading, markConvertedHeading } from '../converted-headings';

describe('converted headings', () => {
	/**
	 * A block that was marked is reported, and a block that was not marked is not.
	 */
	it('reports only the blocks that were marked', () => {
		markConvertedHeading('converted-block');

		expect(isConvertedHeading('converted-block')).toBe(true);
		expect(isConvertedHeading('new-default-block')).toBe(false);
	});
});
