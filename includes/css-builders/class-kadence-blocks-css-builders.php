<?php
/**
 * Finds, loads and runs the CSS builder of a block.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once __DIR__ . '/class-kadence-blocks-css-block-bridge.php';
require_once __DIR__ . '/class-kadence-blocks-css-block-context.php';

/**
 * Builds the CSS of a block with the builder class made for it.
 *
 * A block's `build_css()` only names its builder and hands over what it was given. The builder file is found in the
 * registered directories, so Kadence Blocks Pro adds its own directory and its blocks work the same way.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Builders {

	/**
	 * The directories that hold builder files, in the order they are searched.
	 *
	 * @since TBD
	 *
	 * @var string[]
	 */
	private static $directories = [];

	/**
	 * Register a directory that holds builder files, named after their class: `class-kadence-blocks-spacer-css.php`.
	 *
	 * @since TBD
	 *
	 * @param string $directory The directory.
	 *
	 * @return void
	 */
	public static function add_directory( $directory ): void {
		$directory = trailingslashit( $directory );

		if ( ! in_array( $directory, self::$directories, true ) ) {
			self::$directories[] = $directory;
		}
	}

	/**
	 * The registered directories, the one of Kadence Blocks first.
	 *
	 * @since TBD
	 *
	 * @return string[]
	 */
	public static function directories(): array {
		return array_merge( [ trailingslashit( KADENCE_BLOCKS_PATH ) . 'includes/css-builders/' ], self::$directories );
	}

	/**
	 * Build the CSS of a block.
	 *
	 * @since TBD
	 *
	 * @param string                                    $builder_class   The builder class.
	 * @param object                                    $block           The block, whose helpers the builder may call.
	 * @param string                                    $block_name      The block name without the namespace.
	 * @param array                                     $attributes      The block attributes.
	 * @param Kadence_Blocks_CSS|Kadence_Blocks_Pro_CSS $css             The CSS builder.
	 * @param string                                    $unique_id       The block unique id.
	 * @param string                                    $unique_style_id The unique id used for the style handle.
	 *
	 * @return string|null
	 */
	public static function build( $builder_class, $block, $block_name, $attributes, $css, $unique_id, $unique_style_id ) {
		return self::create( $builder_class, $block, $block_name )->build( $attributes, $css, $unique_id, $unique_style_id );
	}

	/**
	 * Create the builder of a block.
	 *
	 * @since TBD
	 *
	 * @param string $builder_class The builder class.
	 * @param object $block         The block, whose helpers the builder may call.
	 * @param string $block_name    The block name without the namespace.
	 *
	 * @throws RuntimeException When no registered directory holds the builder file.
	 *
	 * @return object
	 */
	public static function create( $builder_class, $block, $block_name ) {
		self::load( $builder_class );

		return new $builder_class( new Kadence_Blocks_Css_Block_Context( $block_name, new Kadence_Blocks_Css_Block_Bridge( $block ) ) );
	}

	/**
	 * Load the file of a builder class, unless it is loaded.
	 *
	 * @since TBD
	 *
	 * @param string $builder_class The builder class.
	 *
	 * @throws RuntimeException When no registered directory holds the builder file.
	 *
	 * @return void
	 */
	private static function load( $builder_class ): void {
		if ( class_exists( $builder_class, false ) ) {
			return;
		}

		$file = 'class-' . strtolower( str_replace( '_', '-', $builder_class ) ) . '.php';

		foreach ( self::directories() as $directory ) {
			if ( is_file( $directory . $file ) ) {
				require_once $directory . $file;
				return;
			}
		}

		throw new RuntimeException( sprintf( 'No CSS builder file %s in the registered directories.', $file ) );
	}
}
