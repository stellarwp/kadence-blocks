<?php
/**
 * The template every block CSS builder follows.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Builds the CSS of one block by writing its sections, in order, through the shared CSS builder.
 *
 * A block builder only lists its sections. The sections share one CSS builder, its current selector and its media
 * state, so the order of the list matters.
 *
 * @since TBD
 */
abstract class Kadence_Blocks_Css_Block_Builder {

	/**
	 * What this builder needs from the block.
	 *
	 * @since TBD
	 *
	 * @var Kadence_Blocks_Css_Block_Context
	 */
	protected $context;

	/**
	 * Create the builder.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Block_Context $context What this builder needs from the block.
	 */
	public function __construct( Kadence_Blocks_Css_Block_Context $context ) {
		$this->context = $context;
	}

	/**
	 * Build the block CSS.
	 *
	 * @since TBD
	 *
	 * @param array                                     $attributes      The block attributes.
	 * @param Kadence_Blocks_CSS|Kadence_Blocks_Pro_CSS $css             The CSS builder.
	 * @param string                                    $unique_id       The block unique id.
	 * @param string                                    $unique_style_id The unique id used for the style handle.
	 *
	 * @return string|null
	 */
	public function build( $attributes, $css, $unique_id, $unique_style_id ) {
		if ( ! $this->applies( $attributes ) ) {
			return null;
		}

		$input = new Kadence_Blocks_Css_Build_Input( $attributes, $css, $unique_id, $unique_style_id, $this->context, $this->derived( $attributes, $unique_id ) );

		$css->set_style_id( 'kb-' . $this->context->block_name() . $unique_style_id );

		Kadence_Blocks_Css_Section_Runner::run( $this->sections(), $input );

		return $css->css_output();
	}

	/**
	 * Whether the block has CSS to build. Blocks that read their settings from a post need the id of that post.
	 *
	 * @since TBD
	 *
	 * @param array $attributes The block attributes.
	 *
	 * @return bool
	 */
	protected function applies( $attributes ): bool {
		return true;
	}

	/**
	 * Values worked out once from the attributes, for the sections to read with `$input->derived()`.
	 *
	 * @since TBD
	 *
	 * @param array  $attributes The block attributes.
	 * @param string $unique_id  The block unique id.
	 *
	 * @return array
	 */
	protected function derived( $attributes, $unique_id ): array {
		return [];
	}

	/**
	 * The sections of the block CSS, in the order they are written.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	abstract protected function sections(): array;
}
