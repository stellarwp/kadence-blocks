import { registerPlugin } from '@wordpress/plugins';
import { applyFilters } from '@wordpress/hooks';
import './editor.scss';
/**
 * Import Icons
 */
import { kadenceNewIcon } from '@kadence/icons';
/*
 * Components
 */
import KadenceConfig from './kadence-control-plugin';

registerPlugin('kadence-control', {
	icon: applyFilters('kadence.block_sidebar_control_icon', kadenceNewIcon),
	render: KadenceConfig,
});
