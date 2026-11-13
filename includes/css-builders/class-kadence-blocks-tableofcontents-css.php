<?php
/**
 * Builds the CSS for the tableofcontents block.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-block-context.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once __DIR__ . '/tableofcontents/loader.php';

/**
 * Builds the CSS for the tableofcontents block by running one section after another.
 *
 * @since TBD
 */
final class Kadence_Blocks_Tableofcontents_Css {

	/**
	 * The selector of the block, where `{id}` stands for the block unique id.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const BASE = '.kb-table-of-content-nav.kb-table-of-content-id{id}';

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
		$input = new Kadence_Blocks_Css_Build_Input( $attributes, $css, $unique_id, $unique_style_id, $this->context );

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
			$this->container_sections(),
			$this->title_sections(),
			$this->content_sections(),
			$this->state_sections(),
			[
				new Kadence_Blocks_Css_Device_Section( 'tablet', $this->tablet_sections() ),
				new Kadence_Blocks_Css_Device_Section( 'mobile', $this->mobile_sections() ),
			]
		);
	}

	/**
	 * A section that sets a selector under the block.
	 *
	 * @since TBD
	 *
	 * @param string $suffix What follows the block selector.
	 *
	 * @return Kadence_Blocks_Css_Section
	 */
	private function selector( string $suffix ): Kadence_Blocks_Css_Section {
		return new Kadence_Blocks_Css_Selector_Section( self::BASE . $suffix );
	}

	/**
	 * The sections of the margin, the padding, the background, the border, the shadow and the width of the container.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function container_sections(): array {
		return [
			$this->selector( ' .kb-table-of-content-wrap' ),
			new Kadence_Blocks_Css_Measure_Section(
				'margin',
				'containerMargin',
				[
					'tablet_key' => 'containerTabletMargin',
					'mobile_key' => 'containerMobileMargin',
					'unit_key'   => 'containerMarginUnit',
				]
			),
			new Kadence_Blocks_Css_Measure_Section( 'padding', 'containerPadding', [ 'unit_key' => 'containerPaddingUnit' ] ),
			new Kadence_Blocks_Css_Color_Section( 'background-color', 'containerBackground' ),
			$this->border_choice( 'containerBorderColor', 'containerBorder', 'borderStyle' ),
			new Kadence_Blocks_Css_Measure_Section( 'border-radius', 'borderRadius', [ 'unit_key' => 'borderRadiusUnit' ] ),
			new Kadence_Blocks_Tableofcontents_Shadow(),
			new Kadence_Blocks_Tableofcontents_Max_Width(),
		];
	}

	/**
	 * The border saved the legacy way, or else the border styles.
	 *
	 * @since TBD
	 *
	 * @param string $color  The attribute that stores the border color.
	 * @param string $border The attribute that stores the border widths.
	 * @param string $styles The attribute that stores the border styles.
	 *
	 * @return Kadence_Blocks_Css_Section
	 */
	private function border_choice( string $color, string $border, string $styles ): Kadence_Blocks_Css_Section {
		return new Kadence_Blocks_Css_Choice_Section(
			new Kadence_Blocks_Tableofcontents_Border_Condition( $color, $border ),
			[
				new Kadence_Blocks_Css_Color_Section( 'border-color', $color ),
				new Kadence_Blocks_Css_Measure_Section( 'border-width', $border ),
			],
			[ new Kadence_Blocks_Css_Border_Styles_Section( $styles ) ]
		);
	}

	/**
	 * The sections of the title.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function title_sections(): array {
		return array_merge(
			[
				$this->selector( ' .kb-table-of-contents-title-wrap' ),
				new Kadence_Blocks_Tableofcontents_Text_Property( 'text-align', 'titleAlign' ),
				new Kadence_Blocks_Css_Measure_Section( 'padding', 'titlePadding', [ 'unit_key' => 'titlePaddingType' ] ),
				$this->border_choice( 'titleBorderColor', 'titleBorder', 'titleBorderStyle' ),
				$this->selector( '.kb-collapsible-toc.kb-toc-toggle-hidden .kb-table-of-contents-title-wrap' ),
				new Kadence_Blocks_Css_Color_Section( 'border-color', 'titleCollapseBorderColor' ),
				new Kadence_Blocks_Css_Enabled_Section(
					'titleColor',
					[ $this->selector( ' .kb-table-of-contents-title-wrap' ), new Kadence_Blocks_Css_Color_Section( 'color', 'titleColor' ) ]
				),
				$this->selector( ' .kb-table-of-contents-title' ),
				new Kadence_Blocks_Css_Color_Section( 'color', 'titleColor' ),
			],
			$this->font_sections( 'title' )
		);
	}

	/**
	 * The sections of the content.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function content_sections(): array {
		return array_merge(
			[
				$this->selector( ' .kb-table-of-content-wrap .kb-table-of-content-list' ),
				new Kadence_Blocks_Css_Color_Section( 'color', 'contentColor' ),
			],
			$this->font_sections( 'content' ),
			[ new Kadence_Blocks_Css_Measure_Section( 'margin', 'contentMargin', [ 'unit_key' => 'contentMarginType' ] ) ]
		);
	}

	/**
	 * The sections of the font of the title or of the content on desktop.
	 *
	 * @since TBD
	 *
	 * @param string $prefix The start of the attribute names: `title` or `content`.
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function font_sections( string $prefix ): array {
		return [
			new Kadence_Blocks_Tableofcontents_Font_Size( $prefix, 0 ),
			new Kadence_Blocks_Tableofcontents_Line_Height( $prefix, 0 ),
			new Kadence_Blocks_Tableofcontents_Letter_Spacing( $prefix ),
			new Kadence_Blocks_Tableofcontents_Font_Family( $prefix ),
			new Kadence_Blocks_Tableofcontents_Text_Property( 'font-weight', $prefix . 'FontWeight' ),
			new Kadence_Blocks_Tableofcontents_Text_Property( 'font-style', $prefix . 'FontStyle' ),
			new Kadence_Blocks_Tableofcontents_Text_Property( 'text-transform', $prefix . 'TextTransform' ),
		];
	}

	/**
	 * The sections of the hover and active colors, the list gap and the background of the toggle icon.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function state_sections(): array {
		return [
			$this->selector( ' .kb-table-of-content-wrap .kb-table-of-content-list .kb-table-of-contents__entry:hover' ),
			new Kadence_Blocks_Css_Color_Section( 'color', 'contentHoverColor' ),
			$this->selector( ' .kb-table-of-content-wrap .kb-table-of-content-list .active > .kb-table-of-contents__entry' ),
			new Kadence_Blocks_Css_Color_Section( 'color', 'contentActiveColor' ),
			new Kadence_Blocks_Tableofcontents_List_Gap( 0, true ),
			new Kadence_Blocks_Css_Enabled_Section(
				'containerBackground',
				[
					new Kadence_Blocks_Css_Selector_Section( $this->icon_selectors() ),
					new Kadence_Blocks_Css_Color_Section( 'background-color', 'containerBackground' ),
				]
			),
		];
	}

	/**
	 * The selectors of the circle toggle icons, which share the container background.
	 *
	 * @since TBD
	 *
	 * @return string[]
	 */
	private function icon_selectors(): array {
		$selectors = [];

		foreach ( [ 'basiccircle', 'arrowcircle', 'xclosecircle' ] as $style ) {
			foreach ( [ 'after', 'before' ] as $part ) {
				$selectors[] = self::BASE . ' .kb-toggle-icon-style-' . $style . ' .kb-table-of-contents-icon-trigger:' . $part;
			}
		}

		return $selectors;
	}

	/**
	 * The sections of the title, the content and the list gap on tablet.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function tablet_sections(): array {
		return [
			$this->selector( ' .kb-table-of-contents-title' ),
			new Kadence_Blocks_Tableofcontents_Font_Size( 'title', 1 ),
			new Kadence_Blocks_Tableofcontents_Line_Height( 'title', 1 ),
			$this->selector( ' .kb-table-of-content-wrap .kb-table-of-content-list' ),
			new Kadence_Blocks_Tableofcontents_Font_Size( 'content', 1 ),
			new Kadence_Blocks_Tableofcontents_Line_Height( 'content', 1 ),
			new Kadence_Blocks_Tableofcontents_List_Gap( 1, false ),
		];
	}

	/**
	 * The sections of the title, the content and the list gap on mobile.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function mobile_sections(): array {
		return [
			$this->selector( ':not(.this-class-is-for-specificity):not(.class-is-for-specificity)' ),
			$this->selector( ' .kb-table-of-contents-title' ),
			new Kadence_Blocks_Tableofcontents_Font_Size( 'title', 2 ),
			new Kadence_Blocks_Tableofcontents_Mobile_Line_Height( 'title' ),
			$this->selector( ' .kb-table-of-content-wrap .kb-table-of-content-list' ),
			new Kadence_Blocks_Tableofcontents_Font_Size( 'content', 2 ),
			new Kadence_Blocks_Tableofcontents_Mobile_Line_Height( 'content' ),
			new Kadence_Blocks_Tableofcontents_List_Gap( 2, true ),
		];
	}
}
