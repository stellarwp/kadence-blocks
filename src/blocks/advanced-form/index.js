import { advancedFormIcon } from '@kadence/icons';

import { registerBlockType } from '@wordpress/blocks';

import './style.scss';
import './fields/accept/index';
import './fields/checkbox/index';
import './fields/date/index';
import './fields/email/index';
import './fields/file/index';
import './fields/hidden/index';
import './fields/number/index';
import './fields/radio/index';
import './fields/select/index';
import './fields/telephone/index';
import './fields/text/index';
import './fields/textarea/index';
import './fields/time/index';

/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';

import { InnerBlocks } from '@wordpress/block-editor';
import transforms from './transforms';


registerBlockType('kadence/advanced-form', {
	...metadata,
	icon: {
		src: advancedFormIcon,
	},
	transforms,
	edit,
	save: InnerBlocks.Content
});
