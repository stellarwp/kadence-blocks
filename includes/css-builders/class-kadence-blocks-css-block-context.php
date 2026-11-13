<?php
/**
 * What a CSS builder needs from the block it builds CSS for.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Gives a CSS builder the block name and access to the block's own helpers.
 *
 * Blocks keep their helpers protected. The block hands this class one bridge callable, created inside
 * the block, so builders can reach those helpers without the block exposing them to anything else.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Block_Context {

	/**
	 * The block name without the namespace, such as `infobox`.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $block_name;

	/**
	 * Calls a helper method or reads a property on the block.
	 *
	 * @since TBD
	 *
	 * @var callable
	 */
	private $bridge;

	/**
	 * Create the context.
	 *
	 * @since TBD
	 *
	 * @param string   $block_name The block name without the namespace.
	 * @param callable $bridge     Callable that takes a member name and its arguments and returns the block's result.
	 */
	public function __construct( $block_name, callable $bridge ) {
		$this->block_name = $block_name;
		$this->bridge     = $bridge;
	}

	/**
	 * The block name without the namespace.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public function block_name() {
		return $this->block_name;
	}

	/**
	 * Call one of the block's helper methods, or read one of its properties.
	 *
	 * @since TBD
	 *
	 * @param string $member The helper method or property name.
	 * @param mixed  ...$args Arguments passed to the helper.
	 *
	 * @return mixed
	 */
	public function call( $member, ...$args ) {
		return ( $this->bridge )( $member, ...$args );
	}
}
