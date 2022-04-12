import { registerPlugin } from '@wordpress/plugins';
import './editor.scss';
/**
 * Import Icons
 */
import { kadenceNewIcon } from '@kadence/icons';
/*
 * Components
 */
import KadenceConfig from './kadence-control-plugin';

registerPlugin( 'kadence-control', {
	icon: kadenceNewIcon,
	render: KadenceConfig,
} );
