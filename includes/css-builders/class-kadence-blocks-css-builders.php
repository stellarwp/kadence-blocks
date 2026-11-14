<?php
/**
 * Finds, loads and runs the CSS builder of a block.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Builds the CSS of a block with the builder class made for it, and loads the builder classes on demand.
 *
 * A block's `build_css()` only names its builder and hands over what it was given. Every plugin that has builder
 * classes registers a generated class map (see bin/generate-css-classmap.php), so Kadence Blocks Pro adds its own and
 * its blocks work the same way. Nothing in the builder folders requires anything: PHP asks this class for a file when
 * it first meets a class.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Builders {

	/**
	 * The registered class maps: each is a list of class names with their file, and the directory the files are in.
	 *
	 * @since TBD
	 *
	 * @var array<int, array{map: array<string, string>, base: string}>
	 */
	private static $maps = [];

	/**
	 * Whether the autoloader is registered with PHP.
	 *
	 * @since TBD
	 *
	 * @var bool
	 */
	private static $registered = false;

	/**
	 * Register the class map of a plugin, so the classes it lists load on demand.
	 *
	 * @since TBD
	 *
	 * @param string $classmap_file The generated class map file.
	 * @param string $base          The directory the paths in the class map are relative to.
	 *
	 * @return void
	 */
	public static function add_classmap( $classmap_file, $base ): void {
		self::$maps[] = [
			'map'  => require $classmap_file,
			'base' => trailingslashit( $base ),
		];

		if ( ! self::$registered ) {
			spl_autoload_register( [ self::class, 'autoload' ] );

			self::$registered = true;
		}
	}

	/**
	 * Load the file of a class that a registered class map lists.
	 *
	 * @since TBD
	 *
	 * @param string $class_name The class PHP is looking for.
	 *
	 * @return void
	 */
	public static function autoload( $class_name ): void {
		foreach ( self::$maps as $registered ) {
			if ( isset( $registered['map'][ $class_name ] ) ) {
				require_once $registered['base'] . $registered['map'][ $class_name ];

				return;
			}
		}
	}

	/**
	 * Build the CSS of a block with its builder class.
	 *
	 * @since TBD
	 *
	 * @param string                                    $builder_class   The builder class.
	 * @param object                                    $block           The block whose CSS is built.
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
	 * @param object $block         The block whose CSS is built.
	 * @param string $block_name    The block name without the namespace.
	 *
	 * @throws RuntimeException When no registered class map has the builder class.
	 *
	 * @return object
	 */
	public static function create( $builder_class, $block, $block_name ) {
		if ( ! class_exists( $builder_class ) ) {
			throw new RuntimeException( sprintf( 'No CSS builder class %s in the registered class maps.', $builder_class ) );
		}

		return new $builder_class( new Kadence_Blocks_Css_Block_Context( $block_name, new Kadence_Blocks_Css_Block_Bridge( $block ) ) );
	}
}
