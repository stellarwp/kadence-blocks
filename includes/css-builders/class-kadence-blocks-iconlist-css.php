<?php
/**
 * Builds the CSS for the iconlist block.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-block-context.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/iconlist/loader.php';

/**
 * Builds the CSS for the iconlist block.
 *
 * @since TBD
 */
final class Kadence_Blocks_Iconlist_Css {

	/**
	 * The selector of the icon list.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const BASE = '.wp-block-kadence-iconlist.kt-svg-icon-list-items{id}';

	/**
	 * What this builder needs from the block.
	 *
	 * @since TBD
	 *
	 * @var Kadence_Blocks_Css_Block_Context
	 */
	private $context;

	/**
	 * What the site offers.
	 *
	 * @since TBD
	 *
	 * @var Kadence_Blocks_Iconlist_Environment
	 */
	private $environment;

	/**
	 * Create the builder.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Block_Context $context What this builder needs from the block.
	 */
	public function __construct( Kadence_Blocks_Css_Block_Context $context ) {
		$this->context     = $context;
		$this->environment = new Kadence_Blocks_Iconlist_Site_Environment();
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
			$this->list_sections(),
			$this->column_sections(),
			$this->item_sections(),
			$this->link_sections()
		);
	}

	/**
	 * The sections of the list: its font, its margin, its padding and its gaps.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function list_sections(): array {
		return [
			new Kadence_Blocks_Iconlist_Google_Font_Css(),
			new Kadence_Blocks_Iconlist_Outer_Margin_Css(),
			new Kadence_Blocks_Css_Selector_Section( self::BASE . ' ul.kt-svg-icon-list:not(.this-prevents-issues):not(.this-stops-third-party-issues):not(.tijsloc)' ),
			new Kadence_Blocks_Css_Measure_Section( 'margin', 'listMargin' ),
			new Kadence_Blocks_Css_Measure_Section( 'padding', 'listPadding' ),
			new Kadence_Blocks_Iconlist_Gap_Css( 'column-gap', [ 'columnGap', 'tabletColumnGap', 'mobileColumnGap' ], true, '' ),
			new Kadence_Blocks_Css_Selector_Section( self::BASE . ' ul.kt-svg-icon-list' ),
			new Kadence_Blocks_Iconlist_Gap_Css( 'grid-row-gap', [ 'listGap', 'tabletListGap', 'mobileListGap' ], false, '5' ),
		];
	}

	/**
	 * The sections that put a margin between the items of a list with columns, on each device.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function column_sections(): array {
		$items = ' ul.kt-svg-icon-list .kt-svg-icon-list-item-wrap:not(:last-child)';

		return [
			$this->column_margin( 'desktop', 'desktopOnly', self::BASE . ':not(.kt-svg-icon-list-columns-1)' . $items ),
			$this->column_margin( 'tablet', 'tabletOnly', self::BASE . ':not(.kt-tablet-svg-icon-list-columns-1)' . $items ),
			$this->column_margin( 'mobile', 'mobile', self::BASE . ':not(.kt-mobile-svg-icon-list-columns-1)' . $items ),
			new Kadence_Blocks_Css_Device_Section( 'desktop', [] ),
		];
	}

	/**
	 * The section that removes the margin between the items on a device with several columns.
	 *
	 * @since TBD
	 *
	 * @param string $device   The device the columns are counted for.
	 * @param string $state    The media state the margin is written in.
	 * @param string $selector The selector of the items.
	 *
	 * @return Kadence_Blocks_Css_Section
	 */
	private function column_margin( $device, $state, $selector ): Kadence_Blocks_Css_Section {
		return new Kadence_Blocks_Css_Choice_Section(
			new Kadence_Blocks_Iconlist_Columns_Condition( $device ),
			[
				new Kadence_Blocks_Css_Device_Section(
					$state,
					[
						new Kadence_Blocks_Css_Selector_Section( $selector ),
						new Kadence_Blocks_Css_Static_Section( 'margin', '0px' ),
					]
				),
			],
			[]
		);
	}

	/**
	 * The sections of the icons and the text of the items, and of the stacked style.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function item_sections(): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( self::BASE . ' .kb-svg-icon-wrap' ),
			new Kadence_Blocks_Css_Responsive_Range_Section( 'iconSize', 'font-size', '' ),
			new Kadence_Blocks_Css_Sanitized_Color_Section( 'color', 'color' ),
			new Kadence_Blocks_Css_Enabled_Section(
				'listLabelGap',
				[
					new Kadence_Blocks_Css_Selector_Section( self::BASE . ' ul.kt-svg-icon-list .kt-svg-icon-list-item-wrap .kt-svg-icon-list-single' ),
					new Kadence_Blocks_Iconlist_Label_Gap_Css( $this->environment ),
				]
			),
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Iconlist_List_Styles_Condition(),
				[
					new Kadence_Blocks_Css_Selector_Section( [ '.kt-svg-icon-list-items{id} ul.kt-svg-icon-list .kt-svg-icon-list-item-wrap', '.kt-svg-icon-list-items{id} ul.kt-svg-icon-list .kt-svg-icon-list-item-wrap a' ] ),
					new Kadence_Blocks_Css_Scoped_Section( 'listStyles', [ new Kadence_Blocks_Css_Sanitized_Color_Section( 'color', 'color' ) ] ),
					new Kadence_Blocks_Css_Typography_Section( 'listStyles' ),
				],
				[]
			),
			new Kadence_Blocks_Iconlist_Legacy_Size_Css(),
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Css_Strict_Condition( 'style', 'stacked' ),
				[
					new Kadence_Blocks_Css_Selector_Section( self::BASE . ' ul.kt-svg-icon-list .kt-svg-icon-list-single' ),
					new Kadence_Blocks_Css_Sanitized_Color_Section( 'background-color', 'background' ),
					new Kadence_Blocks_Iconlist_Suffixed_Css( 'border-radius', 'borderRadius', '%', null ),
					new Kadence_Blocks_Css_Sanitized_Color_Section( 'border-color', 'border' ),
					new Kadence_Blocks_Iconlist_Suffixed_Css( 'border-width', 'borderWidth', 'px', '0px' ),
					new Kadence_Blocks_Css_Static_Section( 'border-style', 'solid' ),
					new Kadence_Blocks_Iconlist_Suffixed_Css( 'padding', 'padding', 'px', null ),
				],
				[]
			),
		];
	}

	/**
	 * The sections of the links in the items.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function link_sections(): array {
		$link = self::BASE . ' .wp-block-kadence-listitem a';
		$item = self::BASE . ' ul.kt-svg-icon-list .wp-block-kadence-listitem a';

		return [
			$this->underline( 'always', $link, 'underline' ),
			$this->underline( 'none', $link, 'none' ),
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Css_Strict_Condition( 'linkUnderline', 'hover' ),
				[
					new Kadence_Blocks_Css_Selector_Section( $link ),
					new Kadence_Blocks_Css_Static_Section( 'text-decoration', 'none' ),
					new Kadence_Blocks_Css_Selector_Section( $link . ':hover' ),
					new Kadence_Blocks_Css_Static_Section( 'text-decoration', 'underline' ),
				],
				[]
			),
			$this->link_color( 'linkColor', $item ),
			$this->link_color( 'linkHoverColor', $item . ':hover' ),
		];
	}

	/**
	 * The section that sets the text decoration of the links when the block asks for it.
	 *
	 * @since TBD
	 *
	 * @param string $mode     The value of the link underline setting that asks for it.
	 * @param string $selector The selector of the links.
	 * @param string $value    The text decoration.
	 *
	 * @return Kadence_Blocks_Css_Section
	 */
	private function underline( $mode, $selector, $value ): Kadence_Blocks_Css_Section {
		return new Kadence_Blocks_Css_Choice_Section(
			new Kadence_Blocks_Css_Strict_Condition( 'linkUnderline', $mode ),
			[
				new Kadence_Blocks_Css_Selector_Section( $selector ),
				new Kadence_Blocks_Css_Static_Section( 'text-decoration', $value ),
			],
			[]
		);
	}

	/**
	 * The section that colors the links when the block has the color.
	 *
	 * @since TBD
	 *
	 * @param string $attribute The attribute that stores the color.
	 * @param string $selector  The selector of the links.
	 *
	 * @return Kadence_Blocks_Css_Section
	 */
	private function link_color( $attribute, $selector ): Kadence_Blocks_Css_Section {
		return new Kadence_Blocks_Css_Enabled_Section(
			$attribute,
			[
				new Kadence_Blocks_Css_Selector_Section( $selector ),
				new Kadence_Blocks_Css_Sanitized_Color_Section( 'color', $attribute ),
			]
		);
	}
}
