<?php
/**
 * The saved settings of an advanced form, read from its post.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * The saved settings of an advanced form, read from its post.
 *
 * Tests build it from an array, so no post is needed.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advanced_Form_Settings {

	/**
	 * The settings, as a plain array.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private $settings;

	/**
	 * Create the settings.
	 *
	 * @since TBD
	 *
	 * @param array $settings The settings, as a plain array.
	 */
	public function __construct( array $settings ) {
		$this->settings = $settings;
	}

	/**
	 * Create the settings from the attributes saved in the post meta of the form, which may hold objects.
	 *
	 * @since TBD
	 *
	 * @param mixed $post_attributes The attributes saved in the post meta of the form.
	 *
	 * @return Kadence_Blocks_Advanced_Form_Settings
	 */
	public static function from_post_attributes( $post_attributes ): self {
		// The original builder round-trips with the plain encoder, which gives up on invalid text where the WordPress one repairs it.
		// phpcs:ignore WordPress.WP.AlternativeFunctions.json_encode_json_encode
		$settings = json_decode( json_encode( $post_attributes ), true );

		return new self( is_array( $settings ) ? $settings : [] );
	}

	/**
	 * All the settings.
	 *
	 * @since TBD
	 *
	 * @return array
	 */
	public function all(): array {
		return $this->settings;
	}

	/**
	 * One group of settings, such as the style of the fields. No key stands for all the settings.
	 *
	 * @since TBD
	 *
	 * @param string|null $key The key of the group.
	 *
	 * @return mixed The group, or an empty array when it is not saved.
	 */
	public function group( $key ) {
		if ( null === $key ) {
			return $this->settings;
		}

		return $this->settings[ $key ] ?? [];
	}

	/**
	 * A setting, or a fallback when it is empty.
	 *
	 * @since TBD
	 *
	 * @param string $key      The key of the setting.
	 * @param mixed  $fallback What to give when the setting is empty.
	 *
	 * @return mixed
	 */
	public function filled( $key, $fallback ) {
		return ! empty( $this->settings[ $key ] ) ? $this->settings[ $key ] : $fallback;
	}

	/**
	 * The border settings of one part, in the shape the border writer reads: one list per device.
	 *
	 * @since TBD
	 *
	 * @param string $name The attribute of the desktop border, such as `fieldBorderStyle`.
	 *
	 * @return array
	 */
	public function border( $name ): array {
		return [
			$name                       => [ $this->filled( $name, [] ) ],
			'tablet' . ucfirst( $name ) => [ $this->filled( 'tablet' . ucfirst( $name ), [] ) ],
			'mobile' . ucfirst( $name ) => [ $this->filled( 'mobile' . ucfirst( $name ), [] ) ],
		];
	}
}
