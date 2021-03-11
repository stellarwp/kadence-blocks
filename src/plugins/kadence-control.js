import { registerPlugin } from '@wordpress/plugins';
import './editor.scss';
/**
 * Import Icons
 */
import icons from '../brand-icon';
/*
 * Components
 */
import KadenceConfig from './kadence-control-plugin';

registerPlugin( 'kadence-control', {
	icon: icons.kadenceNew,
	render: KadenceConfig,
} );
