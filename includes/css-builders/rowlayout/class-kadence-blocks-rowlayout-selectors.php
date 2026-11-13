<?php
/**
 * Rowlayout selectors.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * The selectors of the row layout, which depend on the version of the block.
 *
 * @since TBD
 */
final class Kadence_Blocks_Rowlayout_Selectors {

	/**
	 * Whether the block was saved by version two.
	 *
	 * @since TBD
	 *
	 * @var bool
	 */
	private $updated;

	/**
	 * The selector of the row.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $base;

	/**
	 * The selector the margin goes on.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $margin;

	/**
	 * The selector of the grid of columns.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $inner;

	/**
	 * Create the selectors.
	 *
	 * @since TBD
	 *
	 * @param array  $attributes The block attributes.
	 * @param string $unique_id  The block unique id.
	 */
	public function __construct( array $attributes, $unique_id ) {
		$this->updated = ! empty( $attributes['kbVersion'] ) && $attributes['kbVersion'] > 1;
		$this->base    = $this->updated ? '.kb-row-layout-id' . $unique_id : '#kt-layout-id' . $unique_id;
		$this->margin  = $this->updated ? '.kb-row-layout-wrap.wp-block-kadence-rowlayout.kb-row-layout-id' . $unique_id : $this->base;
		$this->inner   = $this->base . ' > .kt-row-column-wrap';
	}

	/**
	 * Whether the block was saved by version two.
	 *
	 * @since TBD
	 *
	 * @return bool
	 */
	public function is_updated(): bool {
		return $this->updated;
	}

	/**
	 * The selector of the row.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public function base() {
		return $this->base;
	}

	/**
	 * The selector of the grid of columns.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public function inner() {
		return $this->inner;
	}

	/**
	 * Replace the placeholders of a template with the selectors.
	 *
	 * @since TBD
	 *
	 * @param string $template The template, with `{base}`, `{margin}` and `{inner}`.
	 *
	 * @return string
	 */
	public function resolve( $template ) {
		return str_replace( [ '{base}', '{margin}', '{inner}' ], [ $this->base, $this->margin, $this->inner ], $template );
	}
}
