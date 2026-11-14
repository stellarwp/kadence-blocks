<?php
/**
 * Lets CSS builders call the helpers of a block.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Calls the helper methods of one block, or reads its properties, for a CSS builder, whatever their visibility.
 *
 * Blocks keep most of their helpers protected or private. This class is the one place that reaches them, so builders do
 * not need the block to expose its helpers to everything else, and the block does not need a closure to do it.
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
	 * Call a helper method of the block, or read a property of it when it has no such method.
	 *
	 * @since TBD
	 *
	 * @param string  $member    The helper method or property name.
	 * @param mixed[] $arguments The arguments of the helper. A property is read without them.
	 *
	 * @throws BadMethodCallException When the block has neither.
	 *
	 * @return mixed
	 */
	public function call( $member, array $arguments = [] ) {
		if ( is_callable( [ $this->block, $member ] ) ) {
			return $this->block->$member( ...$arguments );
		}

		if ( method_exists( $this->block, $member ) ) {
			return $this->method( $member )->invokeArgs( $this->block, $arguments );
		}

		return $this->property( $member );
	}

	/**
	 * Whether the block has a helper method or a property, of any visibility.
	 *
	 * @since TBD
	 *
	 * @param string $member The helper method or property name.
	 *
	 * @return bool
	 */
	public function has( $member ): bool {
		return method_exists( $this->block, $member ) || property_exists( $this->block, $member );
	}

	/**
	 * The reflection of a helper method that is not public.
	 *
	 * @since TBD
	 *
	 * @param string $member The helper method name.
	 *
	 * @return ReflectionMethod
	 */
	private function method( $member ): ReflectionMethod {
		$method = new ReflectionMethod( $this->block, $member );

		$method->setAccessible( true );

		return $method;
	}

	/**
	 * Read a property of the block, of any visibility.
	 *
	 * @since TBD
	 *
	 * @param string $member The property name.
	 *
	 * @throws BadMethodCallException When the block has no such property.
	 *
	 * @return mixed
	 */
	private function property( $member ) {
		if ( ! property_exists( $this->block, $member ) ) {
			throw new BadMethodCallException( sprintf( '%s has no helper method or property named %s.', get_class( $this->block ), $member ) );
		}

		$property = new ReflectionProperty( $this->block, $member );

		$property->setAccessible( true );

		return $property->getValue( $this->block );
	}
}
