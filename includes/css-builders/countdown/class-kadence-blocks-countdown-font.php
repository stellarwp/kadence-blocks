<?php
/**
 * The font settings of a part of the countdown.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';

/**
 * The font of a part of the countdown: the first entry of the list the block saves.
 *
 * @since TBD
 */
final class Kadence_Blocks_Countdown_Font {

	/**
	 * The font settings.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private $data;

	/**
	 * Create the font from its attribute.
	 *
	 * @since TBD
	 *
	 * @param mixed $attribute The saved font attribute.
	 */
	public function __construct( $attribute ) {
		$first      = is_array( $attribute ) ? ( $attribute[0] ?? null ) : null;
		$this->data = is_array( $first ) ? $first : [];
	}

	/**
	 * Read the font of a part from the input.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input     What the section needs to write its CSS.
	 * @param string                         $attribute The attribute that stores the font.
	 *
	 * @return self
	 */
	public static function from_input( Kadence_Blocks_Css_Build_Input $input, string $attribute ): self {
		return new self( $input->attribute( $attribute ) );
	}

	/**
	 * Whether no font setting was saved.
	 *
	 * @since TBD
	 *
	 * @return bool
	 */
	public function is_empty(): bool {
		return empty( $this->data );
	}

	/**
	 * One font setting, or null when it is not saved.
	 *
	 * @since TBD
	 *
	 * @param string $key The font setting.
	 *
	 * @return mixed
	 */
	public function get( string $key ) {
		return $this->data[ $key ] ?? null;
	}

	/**
	 * The font size for a device, or null when it is empty.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_CSS|Kadence_Blocks_Pro_CSS $css   The CSS builder.
	 * @param int                                       $index The device, 0 for desktop, 1 for tablet, 2 for mobile.
	 *
	 * @return string|null
	 */
	public function size( $css, int $index ): ?string {
		$size = $this->data['size'] ?? null;
		$size = is_array( $size ) ? ( $size[ $index ] ?? null ) : null;

		if ( empty( $size ) ) {
			return null;
		}

		if ( $css->is_variable_font_size_value( $size ) ) {
			return $css->get_variable_font_size_value( $size );
		}

		return $size . ( $this->data['sizeType'] ?? 'px' );
	}

	/**
	 * A line height or a letter spacing for a device, or null when it is empty.
	 *
	 * @since TBD
	 *
	 * @param string $key      The font setting that stores the list.
	 * @param string $type_key The font setting that stores the unit.
	 * @param int    $index    The device, 0 for desktop, 1 for tablet, 2 for mobile.
	 *
	 * @return string|null
	 */
	public function measure( string $key, string $type_key, int $index ): ?string {
		$list = $this->data[ $key ] ?? null;
		$list = is_array( $list ) ? ( $list[ $index ] ?? null ) : null;

		if ( empty( $list ) ) {
			return null;
		}

		return $list . ( $this->data[ $type_key ] ?? 'px' );
	}

	/**
	 * Whether the font has to be loaded from Google.
	 *
	 * @since TBD
	 *
	 * @return bool
	 */
	public function is_google(): bool {
		if ( empty( $this->data['google'] ) ) {
			return false;
		}

		$load = $this->data['loadGoogle'] ?? null;

		return null === $load || (bool) $load;
	}
}
