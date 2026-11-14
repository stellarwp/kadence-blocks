<?php
/**
 * Builds the CSS for the videopopup block.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Builds the CSS for the videopopup block by running one section after another.
 *
 * @since TBD
 */
final class Kadence_Blocks_Videopopup_Css extends Kadence_Blocks_Css_Block_Builder {

	/**
	 * Values worked out once from the attributes, for the sections to read.
	 *
	 * @since TBD
	 *
	 * @param array $attributes The block attributes.
	 *
	 * @return array
	 */
	protected function derived( $attributes ): array {
		return [ 'environment' => new Kadence_Blocks_Videopopup_Site_Environment() ];
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
	protected function sections(): array {
		return array_merge(
			[ new Kadence_Blocks_Videopopup_Assets_Css(), new Kadence_Blocks_Videopopup_Pro_Css() ],
			$this->width_sections(),
			$this->container_sections(),
			$this->popup_sections(),
			$this->vimeo_sections()
		);
	}

	/**
	 * The sections of the width of the video, and of the height of a custom ratio.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function width_sections(): array {
		return [
			new Kadence_Blocks_Css_Enabled_Section(
				'maxWidth',
				[ new Kadence_Blocks_Css_Selector_Section( '.kadence-video-popup{id} .kadence-video-popup-wrap' ), new Kadence_Blocks_Videopopup_Max_Width_Css() ]
			),
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Videopopup_Array_Condition( 'kadenceDynamic' ),
				[ $this->custom_ratio_section() ],
				[]
			),
			new Kadence_Blocks_Css_Enabled_Section(
				'maxWidth',
				[
					new Kadence_Blocks_Css_Selector_Section( '.kb-section-dir-horizontal > .kt-inside-inner-col > .kadence-video-popup{id}' ),
					new Kadence_Blocks_Videopopup_Column_Width_Css(),
				]
			),
		];
	}

	/**
	 * The section of the height of a custom ratio video, which follows the background image.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section
	 */
	private function custom_ratio_section(): Kadence_Blocks_Css_Section {
		$padding = new Kadence_Blocks_Css_Enabled_Section(
			'imageHeight',
			[
				new Kadence_Blocks_Css_Enabled_Section(
					'imgWidth',
					[
						new Kadence_Blocks_Css_Selector_Section( '.kadence-video-popup{id} .kadence-video-popup-wrap .kadence-video-intrinsic.kadence-video-set-ratio-custom' ),
						new Kadence_Blocks_Videopopup_Ratio_Padding_Css(),
					]
				),
			]
		);

		return new Kadence_Blocks_Css_Choice_Section(
			new Kadence_Blocks_Css_Strict_Condition( 'ratio', 'custom' ),
			[ new Kadence_Blocks_Css_Scoped_Section( 'background', [ $padding ] ) ],
			[]
		);
	}

	/**
	 * The sections of the padding, the margin and the background of the video.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function container_sections(): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( '.kadence-video-popup{id}' ),
			new Kadence_Blocks_Videopopup_Spacing_Css( 'padding' ),
			new Kadence_Blocks_Videopopup_Spacing_Css( 'margin' ),
			new Kadence_Blocks_Css_Scoped_Section(
				'background',
				[
					new Kadence_Blocks_Css_Enabled_Section(
						'color',
						[
							new Kadence_Blocks_Css_Selector_Section( '.kadence-video-popup{id} .kadence-video-popup-wrap .kadence-video-intrinsic' ),
							new Kadence_Blocks_Videopopup_Background_Color_Css(),
						]
					),
				]
			),
		];
	}

	/**
	 * The sections of the popup: the overlay, the buttons and the width of the video on each device.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function popup_sections(): array {
		$container = '.glightbox-container.kadence-popup-{id}';
		$buttons   = [ $container . ' .gclose', $container . ' .gnext', $container . ' .gprev' ];
		$arrows    = [ $container . ' .gclose path', $container . ' .gnext path', $container . ' .gprev path' ];

		return [
			new Kadence_Blocks_Css_Scoped_Section(
				'popup',
				[
					new Kadence_Blocks_Css_Choice_Section(
						new Kadence_Blocks_Css_Legacy_Condition( [ 'background', 'backgroundOpacity' ], [], [] ),
						[
							new Kadence_Blocks_Css_Selector_Section( '.glightbox-kadence-dark.kadence-popup-{id} .goverlay' ),
							new Kadence_Blocks_Css_Color_Section( 'background', 'background' ),
							new Kadence_Blocks_Css_Value_Section( 'opacity', 'backgroundOpacity' ),
							new Kadence_Blocks_Css_Selector_Section( $buttons ),
							new Kadence_Blocks_Css_Color_Section( 'background', 'closeBackground' ),
						],
						[]
					),
					new Kadence_Blocks_Css_Enabled_Section( 'closeColor', [ new Kadence_Blocks_Css_Selector_Section( $arrows ), new Kadence_Blocks_Css_Color_Section( 'fill', 'closeColor' ) ] ),
					$this->popup_width_section( 'maxWidth', null, true ),
					$this->popup_width_section( 'maxWidthTablet', 'tablet', true ),
					$this->popup_width_section( 'maxWidthMobile', 'mobile', false ),
				]
			),
		];
	}

	/**
	 * The section of the maximum width of the popup video on one device.
	 *
	 * @since TBD
	 *
	 * @param string      $attribute The attribute that stores the width.
	 * @param string|null $state     The media state to write in, or null to keep the current one.
	 * @param bool        $important Whether the value carries `!important`.
	 *
	 * @return Kadence_Blocks_Css_Section
	 */
	private function popup_width_section( $attribute, $state, $important ): Kadence_Blocks_Css_Section {
		$sections = [
			new Kadence_Blocks_Css_Selector_Section( [ '.glightbox-container.kadence-popup-{id} .gslide-video', '.glightbox-container.kadence-popup-{id} .gvideo-local' ] ),
			new Kadence_Blocks_Videopopup_Popup_Width_Css( $attribute, $important ),
		];

		if ( null !== $state ) {
			array_unshift( $sections, new Kadence_Blocks_Videopopup_Media_State_Css( $state ) );
		}

		return new Kadence_Blocks_Css_Enabled_Section( $attribute, $sections );
	}

	/**
	 * The sections that hide the play button of a private Vimeo video, after the media state is back to desktop.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function vimeo_sections(): array {
		return [
			new Kadence_Blocks_Videopopup_Media_State_Css( 'desktop' ),
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Videopopup_Private_Vimeo_Condition(),
				[
					new Kadence_Blocks_Css_Selector_Section( [ '.kadence-popup-{id} .vimeo-video .plyr__control--overlaid', '.kadence-popup-{id} .vimeo-video .plyr__poster' ] ),
					new Kadence_Blocks_Css_Static_Section( 'display', 'none !important' ),
				],
				[]
			),
		];
	}
}
