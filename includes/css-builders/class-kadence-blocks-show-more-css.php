<?php
/**
 * Builds the CSS for the show more block.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-block-context.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once __DIR__ . '/show-more/loader.php';

/**
 * Builds the CSS for the show more block by running one section after another.
 *
 * @since TBD
 */
final class Kadence_Blocks_Show_More_Css {

	/**
	 * What this builder needs from the block.
	 *
	 * @since TBD
	 *
	 * @var Kadence_Blocks_Css_Block_Context
	 */
	private $context;

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
		$input = new Kadence_Blocks_Css_Build_Input(
			$attributes,
			$css,
			$unique_id,
			$unique_style_id,
			$this->context,
			[]
		);

		$css->set_style_id( 'kb-' . $this->context->block_name() . $unique_style_id );

		foreach ( $this->sections() as $section ) {
			$section->write( $input );
		}

		return $css->css_output();
	}

	/**
	 * The sections of the block CSS, in the order they are written.
	 *
	 * The sections share one CSS builder, its current selector and its media state, so their order matters.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function sections(): array {
		return array_merge(
			$this->layout_sections(),
			$this->closed_sections(),
			$this->open_sections(),
			$this->expanded_sections()
		);
	}

	/**
	 * The sections of the spacing, the screen reader excerpt and the buttons.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function layout_sections(): array {
		$sr_excerpt = [
			'position'    => 'absolute',
			'width'       => '1px',
			'height'      => '1px',
			'padding'     => '0',
			'margin'      => '-1px',
			'overflow'    => 'hidden',
			'clip'        => 'rect(0, 0, 0, 0)',
			'white-space' => 'nowrap',
			'border'      => '0',
		];

		return [
			new Kadence_Blocks_Css_Selector_Section( Kadence_Blocks_Show_More_Selector::root() ),
			new Kadence_Blocks_Css_Measure_Section( 'margin', 'margin', $this->device_keys( 'margin' ) ),
			new Kadence_Blocks_Css_Measure_Section( 'padding', 'padding', $this->device_keys( 'padding' ) ),
			new Kadence_Blocks_Css_Rule_Section( Kadence_Blocks_Show_More_Selector::excerpt(), $sr_excerpt ),
			new Kadence_Blocks_Css_Rule_Section( Kadence_Blocks_Show_More_Selector::buttons(), [ 'margin-top' => '1em' ] ),
			new Kadence_Blocks_Css_Rule_Section( Kadence_Blocks_Show_More_Selector::second_button(), [ 'display' => 'none' ] ),
		];
	}

	/**
	 * The arguments that tell the CSS builder where the desktop, tablet and mobile values and the unit are saved.
	 *
	 * @since TBD
	 *
	 * @param string $name The kind of spacing, `margin` or `padding`.
	 *
	 * @return array
	 */
	private function device_keys( string $name ): array {
		return [
			'desktop_key' => $name . 'Desktop',
			'tablet_key'  => $name . 'Tablet',
			'mobile_key'  => $name . 'Mobile',
			'unit_key'    => $name . 'Unit',
		];
	}

	/**
	 * The sections of the column while the content is closed: its height per device and its fade out.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function closed_sections(): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( Kadence_Blocks_Show_More_Selector::column() ),
			new Kadence_Blocks_Show_More_Max_Height( 'heightDesktop', 250 ),
			new Kadence_Blocks_Css_Static_Section( 'overflow-y', 'hidden' ),
			$this->device_height( 'heightTablet', 'tablet' ),
			$this->device_height( 'heightMobile', 'mobile' ),
			new Kadence_Blocks_Css_Enabled_Section( 'enableFadeOut', [ new Kadence_Blocks_Show_More_Fade_Out() ] ),
		];
	}

	/**
	 * The section of the height of the column on one device, when a height is saved for it.
	 *
	 * @since TBD
	 *
	 * @param string $attribute The attribute that stores the height.
	 * @param string $device    The device, `tablet` or `mobile`.
	 *
	 * @return Kadence_Blocks_Css_Section
	 */
	private function device_height( string $attribute, string $device ): Kadence_Blocks_Css_Section {
		return new Kadence_Blocks_Css_Enabled_Section(
			$attribute,
			[
				new Kadence_Blocks_Css_Device_Section(
					$device,
					[
						new Kadence_Blocks_Css_Selector_Section( Kadence_Blocks_Show_More_Selector::column() ),
						new Kadence_Blocks_Show_More_Max_Height( $attribute, null ),
					]
				),
			]
		);
	}

	/**
	 * The sections of the column and the buttons while the block is open.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function open_sections(): array {
		$second_button = new Kadence_Blocks_Css_Rule_Section( Kadence_Blocks_Show_More_Selector::open_second_button(), [ 'display' => 'none' ] );

		return [
			new Kadence_Blocks_Css_Rule_Section(
				Kadence_Blocks_Show_More_Selector::open_column(),
				[
					'max-height'         => 'none',
					'-webkit-mask-image' => 'none',
					'mask-image'         => 'none',
					'overflow-y'         => 'unset',
				]
			),
			new Kadence_Blocks_Css_Rule_Section( Kadence_Blocks_Show_More_Selector::open_first_button(), [ 'display' => 'none' ] ),
			new Kadence_Blocks_Css_Rule_Section( Kadence_Blocks_Show_More_Selector::open_second_button(), [ 'display' => 'inline-flex' ] ),
			new Kadence_Blocks_Css_Rule_Section( Kadence_Blocks_Show_More_Selector::open_full_width_second_button(), [ 'display' => 'block' ] ),
			new Kadence_Blocks_Css_Choice_Section( new Kadence_Blocks_Css_Switched_Off_Condition( 'showHideMore' ), [ $second_button ], [] ),
		];
	}

	/**
	 * The sections of the devices that start open.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function expanded_sections(): array {
		return [
			new Kadence_Blocks_Css_Enabled_Section( 'defaultExpandedDesktop', [ new Kadence_Blocks_Css_Device_Section( 'desktop', $this->expanded_rules() ) ] ),
			new Kadence_Blocks_Css_Enabled_Section(
				'defaultExpandedTablet',
				[
					new Kadence_Blocks_Css_Device_Section( 'tablet', $this->expanded_rules() ),
					new Kadence_Blocks_Css_Choice_Section( new Kadence_Blocks_Css_Empty_Condition( 'defaultExpandedMobile' ), [ new Kadence_Blocks_Css_Device_Section( 'mobile', $this->closed_again_rules() ) ], [] ),
				]
			),
			new Kadence_Blocks_Css_Enabled_Section( 'defaultExpandedMobile', [ new Kadence_Blocks_Css_Device_Section( 'mobile', $this->expanded_rules() ) ] ),
		];
	}

	/**
	 * The rules of a device that starts open: no height limit, no fade out and no button to open it.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function expanded_rules(): array {
		return [
			new Kadence_Blocks_Css_Rule_Section(
				Kadence_Blocks_Show_More_Selector::column(),
				[
					'max-height'         => 'none',
					'-webkit-mask-image' => 'none',
					'mask-image'         => 'none',
				]
			),
			new Kadence_Blocks_Css_Rule_Section( Kadence_Blocks_Show_More_Selector::expanded_first_button(), [ 'display' => 'none' ] ),
		];
	}

	/**
	 * The rules of mobile when only tablet starts open: the content is limited and faded again, and its button shows.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function closed_again_rules(): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( Kadence_Blocks_Show_More_Selector::column() ),
			new Kadence_Blocks_Show_More_Max_Height( 'heightDesktop', 250 ),
			new Kadence_Blocks_Css_Static_Section( 'overflow-y', 'hidden' ),
			new Kadence_Blocks_Css_Enabled_Section( 'enableFadeOut', [ new Kadence_Blocks_Show_More_Fade_Out() ] ),
			new Kadence_Blocks_Css_Rule_Section( Kadence_Blocks_Show_More_Selector::expanded_first_button(), [ 'display' => 'inline' ] ),
		];
	}
}
