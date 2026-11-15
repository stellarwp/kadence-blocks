<?php
/**
 * Writes the sections of a block's CSS, and lets other code change the list first.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Runs the sections of one block build, in order, after the `kadence_blocks_css_sections` filter had its say.
 *
 * Every block builder writes its sections through here, so the filter works the same for all of them, in Kadence Blocks,
 * in Kadence Blocks Pro and in blocks of other plugins that build their CSS the same way.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Section_Runner {

	/**
	 * Write the sections.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Section[]   $sections The sections of the block, in the order they are written.
	 * @param Kadence_Blocks_Css_Build_Input $input    What the sections need to write their CSS.
	 *
	 * @return void
	 */
	public static function run( array $sections, Kadence_Blocks_Css_Build_Input $input ): void {
		foreach ( self::filtered( $sections, $input ) as $section ) {
			$section->write( $input );
		}
	}

	/**
	 * The sections after the filter. Anything in the list that is not a section is dropped, with a notice.
	 *
	 * The sections share one CSS builder, its current selector and its media state, so the order matters: a section that
	 * writes properties needs a selector section before it.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Section[]   $sections The sections of the block.
	 * @param Kadence_Blocks_Css_Build_Input $input    What the sections need to write their CSS.
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private static function filtered( array $sections, Kadence_Blocks_Css_Build_Input $input ): array {
		/**
		 * Filters the sections that write the CSS of a block, so they can be added, removed, replaced or reordered.
		 *
		 * @since TBD
		 *
		 * @param Kadence_Blocks_Css_Section[] $sections   The sections, each an object implementing Kadence_Blocks_Css_Section.
		 * @param string                       $block_name The block name without the namespace, such as `infobox`.
		 * @param array                        $attributes The attributes the sections read.
		 */
		$filtered = apply_filters( 'kadence_blocks_css_sections', $sections, $input->context()->block_name(), $input->attributes() );

		if ( ! is_array( $filtered ) ) {
			_doing_it_wrong( 'kadence_blocks_css_sections', esc_html__( 'The filter must return a list of sections.', 'kadence-blocks' ), 'TBD' );

			return $sections;
		}

		return array_values( array_filter( $filtered, [ self::class, 'is_section' ] ) );
	}

	/**
	 * Whether a value from the filter is a section, noticing when it is not.
	 *
	 * @since TBD
	 *
	 * @param mixed $section The value.
	 *
	 * @return bool
	 */
	public static function is_section( $section ): bool {
		if ( $section instanceof Kadence_Blocks_Css_Section ) {
			return true;
		}

		_doing_it_wrong( 'kadence_blocks_css_sections', esc_html__( 'Every item must implement Kadence_Blocks_Css_Section.', 'kadence-blocks' ), 'TBD' );

		return false;
	}
}
