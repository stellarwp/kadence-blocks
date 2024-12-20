<?php


/**
 * Inherited Methods
 * @method void wantToTest($text)
 * @method void wantTo($text)
 * @method void execute($callable)
 * @method void expectTo($prediction)
 * @method void expect($prediction)
 * @method void amGoingTo($argumentation)
 * @method void am($role)
 * @method void lookForwardTo($achieveValue)
 * @method void comment($description)
 * @method void pause()
 *
 * @SuppressWarnings(PHPMD)
*/
class WpunitTester extends \Codeception\Actor
{
    use _generated\WpunitTesterActions;

	/**
	 * Check if a block is registered.
	 *
	 * @param $block_name string
	 *
	 * @return bool
	 */
	public function is_block_registered( $block_name ): bool {
		$block_registry = \WP_Block_Type_Registry::get_instance();
		$blocks = $block_registry->get_all_registered();

		return isset( $blocks[ $block_name ] );
	}

	/**
	 * Check if a custom post type is registered.
	 *
	 * @param $cpt_name string
	 *
	 * @return bool
	 */
	public function is_cpt_registered( $cpt_name ): bool {
		return get_post_type_object( $cpt_name ) !== null;
	}

	public function block_supports_anchor( $block_name ) {
		$block_registry = \WP_Block_Type_Registry::get_instance();
		$block = $block_registry->get_registered( $block_name );
		return $block->supports['anchor'] ?? false;
	}
}
