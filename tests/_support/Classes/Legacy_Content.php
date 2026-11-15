<?php declare( strict_types=1 );

namespace Tests\Support\Classes;

use Kadence_Blocks_CSS;
use Kadence_Blocks_Google_Fonts;
use ReflectionProperty;
use Throwable;
use WP_Block_Type_Registry;

/**
 * What a block built from attributes saved by an older version of the plugin does: its CSS, the Google fonts it loads and the
 * scripts and styles it queues.
 *
 * The attributes in `tests/_data/legacy/` have the shape the editor of an older release saved: only some of the attributes the
 * block had then, with the values of that time. Their expected results were recorded from the original builders, before they were
 * split into classes, so they keep proving that the blocks of old sites still look the same.
 */
final class Legacy_Content {

	/**
	 * The block classes by the name of the block, such as `kadence/infobox`.
	 *
	 * @var array<string, string>|null
	 */
	private static $classes = null;

	/**
	 * What the editor saves as attributes: the attributes of the block with the defaults WordPress fills in when it renders it.
	 *
	 * @param string               $name       The block name.
	 * @param array<string, mixed> $attributes The saved attributes.
	 *
	 * @return array<string, mixed>
	 */
	public static function prepared( string $name, array $attributes ): array {
		$type = WP_Block_Type_Registry::get_instance()->get_registered( $name );

		return $type ? $type->prepare_attributes_for_render( $attributes ) : $attributes;
	}

	/**
	 * Build a block and describe the result.
	 *
	 * @param string               $name       The block name.
	 * @param array<string, mixed> $attributes The attributes the block is built with.
	 *
	 * @return array<int, string> The meaning of the CSS, a signature of its cascade, the fonts and the queued assets.
	 */
	public static function signature( string $name, array $attributes ): array {
		$class = self::classes()[ $name ];
		$block = method_exists( $class, 'get_instance' ) ? $class::get_instance() : new $class();
		$fonts = new ReflectionProperty( Kadence_Blocks_Google_Fonts::class, 'gfonts' );
		$fonts->setAccessible( true );
		$fonts->setValue( null, [] );
		wp_scripts()->queue = [];
		wp_styles()->queue  = [];

		// Legacy code raises notices on missing keys; they are not part of the result.
		set_error_handler( [ self::class, 'ignore_notice' ] );

		try {
			$css = (string) $block->build_css( $attributes, new Kadence_Blocks_CSS(), 'legacy', 'legacy' );
		} catch ( Throwable $e ) {
			$css = 'EXCEPTION:' . get_class( $e );
		} finally {
			restore_error_handler();
		}

		$registered = $fonts->getValue();
		ksort( $registered );
		$queued = [ array_values( array_unique( wp_scripts()->queue ) ), array_values( array_unique( wp_styles()->queue ) ) ];
		sort( $queued[0] );
		sort( $queued[1] );

		return [
			( new Css_Normalizer() )->hash( $css ),
			Cascade_Signature::of( $css ),
			$registered ? sha1( (string) wp_json_encode( $registered ) ) : '',
			$queued[0] || $queued[1] ? (string) wp_json_encode( $queued ) : '',
		];
	}

	/**
	 * Swallow a notice or warning.
	 *
	 * @return bool
	 */
	public static function ignore_notice(): bool {
		return true;
	}

	/**
	 * The classes of the blocks that the golden master builds, by block name.
	 *
	 * @return array<string, string>
	 */
	private static function classes(): array {
		if ( null !== self::$classes ) {
			return self::$classes;
		}

		self::$classes = [];

		foreach ( (array) glob( codecept_data_dir( 'build-css-golden/*.json' ) ) as $file ) {
			$golden = json_decode( (string) file_get_contents( $file ), true ); // phpcs:ignore WordPressVIPMinimum.Performance.FetchingRemoteData.FileGetContentsUnknown -- Local file.
			$class  = $golden['block'];

			if ( ! class_exists( $class ) || ! property_exists( $class, 'block_name' ) ) {
				continue;
			}

			$block    = method_exists( $class, 'get_instance' ) ? $class::get_instance() : new $class();
			$property = new ReflectionProperty( $block, 'block_name' );
			$property->setAccessible( true );

			self::$classes[ 'kadence/' . $property->getValue( $block ) ] = $class;
		}

		return self::$classes;
	}
}
