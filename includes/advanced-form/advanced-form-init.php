<?php
/**
 * Load all the files for Advanced form block.
 *
 * @package Kadence Blocks.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$form_schema_version = get_option( 'kadenceblocks_beta_form_schema_version', 0 );
if ( $form_schema_version < 1 ) {
	$posts = get_posts( array(
		'post_type'   => 'kadence_form',
		'numberposts' => - 1,
	) );

	$meta_to_update = array(
		'_kad_form_inputFont',
		'_kad_form_labelFont',
		'_kad_form_radioLabelFont',
		'_kad_form_helpFont',
		'_kad_form_messageFont'
	);

	foreach ( $posts as $post ) {
		foreach ( $meta_to_update as $meta_key ) {
			$meta_value = get_post_meta( $post->ID, $meta_key, true );

			if ( isset( $meta_value['google'] ) && gettype( $meta_value['google'] ) === 'string' ) {
				// Saving didn't work, so we can safely set all existing values to false
				$meta_value['google'] = false;
				update_post_meta( $post->ID, $meta_key, $meta_value );
			}
		}
	}

	update_option( 'kadenceblocks_beta_form_schema_version', 1 );
}

require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-advanced-form-block.php';
require_once KADENCE_BLOCKS_PATH . 'includes/blocks/form/class-kadence-blocks-advanced-form-input-block.php';
require_once KADENCE_BLOCKS_PATH . 'includes/blocks/form/class-kadence-blocks-text-input-block.php';
require_once KADENCE_BLOCKS_PATH . 'includes/blocks/form/class-kadence-blocks-textarea-input-block.php';
require_once KADENCE_BLOCKS_PATH . 'includes/blocks/form/class-kadence-blocks-email-input-block.php';
require_once KADENCE_BLOCKS_PATH . 'includes/blocks/form/class-kadence-blocks-number-input-block.php';
require_once KADENCE_BLOCKS_PATH . 'includes/blocks/form/class-kadence-blocks-hidden-input-block.php';
require_once KADENCE_BLOCKS_PATH . 'includes/blocks/form/class-kadence-blocks-date-input-block.php';
require_once KADENCE_BLOCKS_PATH . 'includes/blocks/form/class-kadence-blocks-time-input-block.php';
require_once KADENCE_BLOCKS_PATH . 'includes/blocks/form/class-kadence-blocks-telephone-input-block.php';
require_once KADENCE_BLOCKS_PATH . 'includes/blocks/form/class-kadence-blocks-file-block.php';
require_once KADENCE_BLOCKS_PATH . 'includes/blocks/form/class-kadence-blocks-radio-block.php';
require_once KADENCE_BLOCKS_PATH . 'includes/blocks/form/class-kadence-blocks-select-block.php';
require_once KADENCE_BLOCKS_PATH . 'includes/blocks/form/class-kadence-blocks-checkbox-block.php';
require_once KADENCE_BLOCKS_PATH . 'includes/blocks/form/class-kadence-blocks-captcha-block.php';
require_once KADENCE_BLOCKS_PATH . 'includes/blocks/form/class-kadence-blocks-accept-block.php';
require_once KADENCE_BLOCKS_PATH . 'includes/blocks/form/class-kadence-blocks-submit-block.php';
require_once KADENCE_BLOCKS_PATH . 'includes/advanced-form/advanced-form-rest-api.php';
require_once KADENCE_BLOCKS_PATH . 'includes/advanced-form/advanced-form-cpt.php';
require_once KADENCE_BLOCKS_PATH . 'includes/advanced-form/advanced-form-ajax.php';
require_once KADENCE_BLOCKS_PATH . 'includes/advanced-form/advanced-form-submit-actions.php';
require_once KADENCE_BLOCKS_PATH . 'includes/advanced-form/activecampaign-rest-api.php';
require_once KADENCE_BLOCKS_PATH . 'includes/advanced-form/advanced-form-captcha-settings.php';
require_once KADENCE_BLOCKS_PATH . 'includes/advanced-form/advanced-form-captcha-verify.php';
