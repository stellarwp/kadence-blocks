<?php
/**
 * Class to Build the Countup Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use KadenceWP\KadenceBlocks\Site_Styles\Contracts\Groups_Site_Styles;
use KadenceWP\KadenceBlocks\Site_Styles\Contracts\Supports_Site_Styles;

/**
 * Class to Build the Countup Block.
 *
 * @category class
 */
class Kadence_Blocks_Countup_Block extends Kadence_Blocks_Abstract_Block implements Supports_Site_Styles, Groups_Site_Styles {

	/**
	 * Instance of this class
	 *
	 * @var null
	 */
	private static $instance = null;

	/**
	 * Block name within this namespace.
	 *
	 * @var string
	 */
	protected $block_name = 'countup';

	/**
	 * Block determines in scripts need to be loaded for block.
	 *
	 * @var string
	 */
	protected $has_script = true;

	/**
	 * Block determines in scripts need to be loaded for block.
	 *
	 * @var string
	 */
	protected $has_style = false;

	/**
	 * Allowed HTML tags for the title.
	 *
	 * @var string[]
	 */
	protected $allowed_html_tags = [ 'heading', 'p', 'span', 'div' ];

	/**
	 * Instance Control
	 */
	public static function get_instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Builds CSS for block.
	 *
	 * @param array              $attributes the blocks attributes.
	 * @param Kadence_Blocks_CSS $css the css class for blocks.
	 * @param string             $unique_id the blocks attr ID.
	 * @param string             $unique_style_id the blocks alternate ID for queries.
	 */
	public function build_css( $attributes, $css, $unique_id, $unique_style_id ) {
		return Kadence_Blocks_Css_Builders::build( 'Kadence_Blocks_Countup_Css', $this, $this->block_name, $attributes, $css, $unique_id, $unique_style_id );
	}
	/**
	 * Render for block scripts block.
	 *
	 * @param array   $attributes the blocks attributes.
	 * @param boolean $inline true or false based on when called.
	 */
	public function render_scripts( $attributes, $inline = false ) {
		if ( $this->has_script ) {
			if ( ! wp_script_is( 'kadence-blocks-' . $this->block_name, 'enqueued' ) ) {
				$this->enqueue_script( 'kadence-blocks-' . $this->block_name );
			}
		}
	}
	/**
	 * Builds HTML for block.
	 *
	 * @since 3.7.12.1 Only allows the title tags available in the editor.
	 *
	 * @param array    $attributes     The block attributes.
	 * @param string   $unique_id      The block's unique ID.
	 * @param string   $content        The block's content.
	 * @param WP_Block $block_instance The instance of the WP_Block class that represents the block being rendered.
	 *
	 * @return string Returns the block output.
	 */
	public function build_html( $attributes, $unique_id, $content, $block_instance ) {
		if ( apply_filters( 'kadence-blocks-countup-static', false, $attributes, $block_instance ) ) {
			$prefix         = ( $attributes['prefix'] ?? '' );
			$suffix         = ( $attributes['suffix'] ?? '' );
			$start          = ( $attributes['start'] ?? 0 );
			$ending_number  = ( $attributes['end'] ?? 100 );
			$separator      = ( $attributes['separator'] ?? '' );
			$decimal        = ( $attributes['decimal'] ?? '' );
			$decimal_spaces = ( $attributes['decimalSpaces'] ?? 2 );
			$duration       = ( $attributes['duration'] ?? '2.5' );
			$countup_args   = [
				'class'         => 'wp-block-kadence-countup kb-count-up-' . $unique_id . ' kb-count-up',
				'data-start'    => $start,
				'data-end'      => $ending_number,
				'data-duration' => $duration,
				'data-prefix'   => $prefix,
				'data-suffix'   => $suffix,
			];
			if ( ! empty( $separator ) ) {
				$countup_args['data-separator'] = $separator;
			}
			if ( ! empty( $separator ) ) {
				$countup_args['data-separator'] = $separator;
			}
			if ( ! empty( $decimal ) ) {
				$countup_args['data-decimal']        = $decimal;
				$countup_args['data-decimal-spaces'] = $decimal_spaces;

			}
			foreach ( $countup_args as $key => $value ) {
				$countup_div_attributes[] = $key . '="' . esc_attr( $value ) . '"';
			}
			$countup_attributes = implode( ' ', $countup_div_attributes );
			$countup_content    = '<div class="kb-count-up-process kb-count-up-number">' . esc_html( $prefix . $ending_number . $suffix ) . '</div>';
			$countup_title      = '';
			if ( ! empty( $attributes['title'] ) && isset( $attributes['displayTitle'] ) && $attributes['displayTitle'] ) {
				$title_font = isset( $attributes['titleFont'][0] ) && is_array( $attributes['titleFont'][0] ) ? $attributes['titleFont'][0] : [];
				if ( empty( $title_font['htmlTag'] ) ) {
					$title_font['htmlTag'] = 'heading';
				}
				$title_tag     = $this->get_html_tag( $title_font, 'htmlTag', 'div', $this->allowed_html_tags, 'level' );
				$countup_title = '<' . esc_attr( $title_tag ) . ' class="kb-count-up-title">' . esc_html( $attributes['title'] ) . '</' . esc_attr( $title_tag ) . '>';
			}
			$content = sprintf( '<div %1$s>%2$s%3$s</div>', $countup_attributes, $countup_content, $countup_title );
		}
		return $content;
	}

	/**
	 * The editor paints every Count Up value itself, inline, and the instance
	 * rule outranks core's, so every site value goes through the overlay.
	 *
	 * @since 3.9.0
	 */
	public function site_styles_overlay_attributes(): array {
		return array_merge( array_merge( ...$this->site_styles_attribute_groups() ), [ 'titleColor', 'numberColor' ] );
	}

	/**
	 * @inheritDoc
	 *
	 * @since 3.9.0
	 */
	public function site_styles_attributes_map(): array {
		return [];
	}

	/**
	 * @inheritDoc
	 *
	 * @since 3.9.0
	 */
	public function site_styles_supports(): array {
		return [];
	}

	/**
	 * @inheritDoc
	 *
	 * @since 3.9.0
	 */
	public function site_styles_selectors(): array {
		return [];
	}

	/**
	 * Each font keeps its size with its unit, each alignment and min height its
	 * devices, and each padding and margin its devices and unit, for the title
	 * and the number.
	 *
	 * @since 3.9.0
	 */
	public function site_styles_attribute_groups(): array {
		return [
			[ 'titleFont' ],
			[ 'titleAlign' ],
			[ 'titleMinHeight' ],
			[ 'titlePadding', 'titleTabletPadding', 'titleMobilePadding', 'titlePaddingType' ],
			[ 'titleMargin', 'titleTabletMargin', 'titleMobileMargin', 'titleMarginType' ],
			[ 'numberFont' ],
			[ 'numberAlign' ],
			[ 'numberMinHeight' ],
			[ 'numberPadding', 'numberTabletPadding', 'numberMobilePadding', 'numberPaddingType' ],
			[ 'numberMargin', 'numberTabletMargin', 'numberMobileMargin', 'numberMarginType' ],
		];
	}

	/**
	 * Registers scripts and styles.
	 */
	public function register_scripts() {

		// Skip calling parent because this block does not have a dedicated CSS file.
		// parent::register_scripts();

		// If in the backend, bail out.
		if ( is_admin() ) {
			return;
		}
		if ( apply_filters( 'kadence_blocks_check_if_rest', false ) && kadence_blocks_is_rest() ) {
			return;
		}
		wp_register_script( 'kadence-countup', KADENCE_BLOCKS_URL . 'includes/assets/js/countUp.min.js', [], KADENCE_BLOCKS_VERSION, true );
		wp_register_script( 'kadence-blocks-countup', KADENCE_BLOCKS_URL . 'includes/assets/js/kb-countup.min.js', [ 'kadence-countup' ], KADENCE_BLOCKS_VERSION, true );
	}
}

Kadence_Blocks_Countup_Block::get_instance();
