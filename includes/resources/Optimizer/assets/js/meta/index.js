import { registerPlugin } from '@wordpress/plugins';
import OptimizerExcludeMeta from './meta';
import { kadenceNewIcon } from '@kadence/icons';
import { NAME } from './constants';

registerPlugin(NAME, { render: OptimizerExcludeMeta, icon: kadenceNewIcon });
