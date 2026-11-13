<?php
/**
 * Column layout.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-column-device.php';

/**
 * The layout values of the column on desktop, tablet and mobile.
 *
 * @since TBD
 */
final class Kadence_Blocks_Column_Layout {

	/**
	 * The values before any device was saved.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private const DEFAULTS = [
		'vertical_align'   => '',
		'horizontal_align' => '',
		'flex_wrap'        => '',
		'direction'        => 'vertical',
		'text_align'       => '',
		'max_width_unit'   => 'px',
	];

	/**
	 * The attributes that store the values of every device: the vertical alignment and the maximum width
	 * unit.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private const SOURCES = [
		[ 'verticalAlignment', 'maxWidthUnit' ],
		[ 'verticalAlignmentTablet', 'maxWidthTabletUnit' ],
		[ 'verticalAlignmentMobile', 'maxWidthMobileUnit' ],
	];

	/**
	 * The attributes that store one value for every device, by the name of the value.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private const LISTS = [
		'horizontal_align' => 'justifyContent',
		'flex_wrap'        => 'wrapContent',
		'direction'        => 'direction',
		'text_align'       => 'textAlign',
	];

	/**
	 * Whether the column was saved by version two of the block.
	 *
	 * @since TBD
	 *
	 * @var bool
	 */
	private $is_version_two;

	/**
	 * The values of desktop, tablet and mobile.
	 *
	 * @since TBD
	 *
	 * @var Kadence_Blocks_Column_Device[]
	 */
	private $devices;

	/**
	 * Create the layout.
	 *
	 * @since TBD
	 *
	 * @param array $attributes The block attributes.
	 */
	public function __construct( array $attributes ) {
		$this->is_version_two = isset( $attributes['kbVersion'] ) && 1 < $attributes['kbVersion'];
		$this->devices        = $this->resolve_devices( $attributes );
	}

	/**
	 * The values of one device.
	 *
	 * @since TBD
	 *
	 * @param int $index The position of the device: 0 desktop, 1 tablet, 2 mobile.
	 *
	 * @return Kadence_Blocks_Column_Device
	 */
	public function device( $index ) {
		return $this->devices[ $index ];
	}

	/**
	 * Whether the column was saved by version two of the block.
	 *
	 * @since TBD
	 *
	 * @return bool
	 */
	public function is_version_two(): bool {
		return $this->is_version_two;
	}

	/**
	 * Work out the values of every device, each one falling back to the device before it.
	 *
	 * @since TBD
	 *
	 * @param array $attributes The block attributes.
	 *
	 * @return array
	 */
	private function resolve_devices( array $attributes ): array {
		$devices = [];
		$values  = self::DEFAULTS;

		foreach ( self::SOURCES as $index => $source ) {
			$values    = $this->resolve( $attributes, $index, $source, $values );
			$devices[] = new Kadence_Blocks_Column_Device( $values );
		}

		return $devices;
	}

	/**
	 * Work out the values of one device.
	 *
	 * @since TBD
	 *
	 * @param array $attributes The block attributes.
	 * @param int   $index      The position of the device.
	 * @param array $source     The attributes of the device.
	 * @param array $values     The values of the device before.
	 *
	 * @return array
	 */
	private function resolve( array $attributes, $index, array $source, array $values ): array {
		$values['vertical_align'] = $this->pick( $attributes[ $source[0] ] ?? null, $values['vertical_align'] );
		$values['max_width_unit'] = $this->pick( $attributes[ $source[1] ] ?? null, $values['max_width_unit'] );

		foreach ( self::LISTS as $name => $attribute ) {
			$values[ $name ] = $this->pick( $attributes[ $attribute ][ $index ] ?? null, $values[ $name ] );
		}

		return $values;
	}

	/**
	 * The saved value, or the fallback when nothing was saved.
	 *
	 * @since TBD
	 *
	 * @param mixed $saved    The saved value.
	 * @param mixed $fallback The value of the device before.
	 *
	 * @return mixed
	 */
	private function pick( $saved, $fallback ) {
		return ! empty( $saved ) ? $saved : $fallback;
	}
}
