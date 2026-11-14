<?php
/**
 * Lets CSS builders call the helpers of a block.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Calls the public helper methods of one block for a CSS builder.
 *
 * Builders only use what a block exposes publicly; there is no reflection, so a helper a builder needs must be a
 * public method of the block. Asking for anything else fails loudly.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Block_Bridge {

	/**
	 * The block whose helpers are called.
	 *
	 * @since TBD
	 *
	 * @var object
	 */
	private $block;

	/**
	 * Create the bridge.
	 *
	 * @since TBD
	 *
	 * @param object $block The block whose helpers are called.
	 */
	public function __construct( $block ) {
		$this->block = $block;
	}

	/**
	 * Call a helper method, so the bridge can be used wherever a callable is expected.
	 *
	 * @since TBD
	 *
	 * @param string $member  The helper method name.
	 * @param mixed  ...$args The arguments of the helper.
	 *
	 * @return mixed
	 */
	public function __invoke( $member, ...$args ) {
		return $this->call( $member, $args );
	}

	/**
	 * Call a public helper method of the block.
	 *
	 * @since TBD
	 *
	 * @param string  $member    The helper method name.
	 * @param mixed[] $arguments The arguments of the helper.
	 *
	 * @throws BadMethodCallException When the block has no public method of that name.
	 *
	 * @return mixed
	 */
	public function call( $member, array $arguments = [] ) {
		if ( ! $this->has( $member ) ) {
			throw new BadMethodCallException( sprintf( '%s has no public helper method named %s.', get_class( $this->block ), $member ) );
		}

		return $this->block->$member( ...$arguments );
	}

	/**
	 * Whether the block has a public helper method of that name.
	 *
	 * @since TBD
	 *
	 * @param string $member The helper method name.
	 *
	 * @return bool
	 */
	public function has( $member ): bool {
		return is_callable( [ $this->block, $member ] );
	}
}
