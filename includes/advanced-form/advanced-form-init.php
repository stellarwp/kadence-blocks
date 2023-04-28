<?php
/**
 * Load all the files for Advanced form block.
 *
 * @package Kadence Blocks.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-advanced-form-block.php';
require_once KADENCE_BLOCKS_PATH . 'includes/blocks/form/class-kadence-blocks-advanced-form-input-block.php';
require_once KADENCE_BLOCKS_PATH . 'includes/blocks/form/class-kadence-blocks-text-input-block.php';
require_once KADENCE_BLOCKS_PATH . 'includes/blocks/form/class-kadence-blocks-submit-block.php';
require_once KADENCE_BLOCKS_PATH . 'includes/advanced-form/advanced-form-rest-api.php';
require_once KADENCE_BLOCKS_PATH . 'includes/advanced-form/advanced-form-cpt.php';
require_once KADENCE_BLOCKS_PATH . 'includes/advanced-form/advanced-form-ajax.php';
require_once KADENCE_BLOCKS_PATH . 'includes/advanced-form/advanced-form-submit-actions.php';
require_once KADENCE_BLOCKS_PATH . 'includes/advanced-form/convertkit-rest-api.php';
require_once KADENCE_BLOCKS_PATH . 'includes/advanced-form/activecampaign-rest-api.php';
