<?php
/**
 * Class to Build the Header Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Header Block.
 *
 * @category class
 */
class Kadence_Blocks_Header_Block extends Kadence_Blocks_Abstract_Block {

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
	protected $block_name = 'header';

	/**
	 * Block determines in scripts need to be loaded for block.
	 *
	 * @var string
	 */
	protected $has_script = true;

	/**
	 * Instance of this class
	 *
	 * @var null
	 */
	private static $seen_refs = array();

	protected $header_attributes = array();

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
	 * @param array              $attributes      the blocks attributes.
	 * @param Kadence_Blocks_CSS $css             the css class for blocks.
	 * @param string             $unique_id       the blocks attr ID.
	 * @param string             $unique_style_id the blocks alternate ID for queries.
	 */
	public function build_css( $attributes, $css, $unique_id, $unique_style_id ) {

		$header_attributes = $this->get_attributes_with_defaults_cpt( $attributes['id'], 'kadence_header', '_kad_header_' );

		$css->set_style_id( 'kb-' . $this->block_name . $unique_style_id );

		$sizes = array( 'Desktop', 'Tablet', 'Mobile' );

		foreach ( $sizes as $size ) {
			$this->sized_dynamic_styles( $css, $header_attributes, $unique_id, $size );
		}
		$css->set_media_state( 'desktop' );
		$css->set_selector( '.wp-block-kadence-header' . $unique_id . ' .kb-header-container:hover' );
		$css->render_measure_range( $header_attributes, 'borderRadiusHover', 'border-radius', '', ['unit_key' => 'borderRadiusHoverUnit']);
		$css->set_media_state( 'tablet' );
		$css->render_measure_range( $header_attributes, 'borderRadiusHoverTablet', 'border-radius', '', ['unit_key' => 'borderRadiusHoverUnit']);
		$css->set_media_state( 'mobile' );
		$css->render_measure_range( $header_attributes, 'borderRadiusHoverMobile', 'border-radius', '', ['unit_key' => 'borderRadiusHoverUnit']);
		return $css->css_output();
	}

	/**
	 * Build up the dynamic styles for a size.
	 *
	 * @param string $size The size.
	 * @return array
	 */
	public function sized_dynamic_styles( $css, $attributes, $unique_id, $size = 'Desktop' ) {
		$sized_attributes = $css->get_sized_attributes_auto( $attributes, $size, false );
		$sized_attributes_inherit = $css->get_sized_attributes_auto( $attributes, $size );

		$bg = $sized_attributes['background'];
		$hover_bg = $sized_attributes['backgroundHover'];
		$bg_transparent = $sized_attributes['backgroundTransparent'];
		$hover_bg_transparent = $sized_attributes['backgroundTransparentHover'];
		$bg_sticky = $sized_attributes['backgroundSticky'];
		$hover_bg_sticky = $sized_attributes['backgroundStickyHover'];
		$border = $sized_attributes['border'];
		$typography = $sized_attributes['typography'];
		$min_height = ! empty( $sized_attributes['height'] ) && 'Desktop' === $size 
			? $sized_attributes['height'][0] 
			: ( 'Tablet' === $size 
				? $sized_attributes['height'][1] 
				: ('Mobile' === $size 
					? $sized_attributes['height'][2] 
					: '' 
				) 
			);
		$max_width = ! empty( $sized_attributes['width'] ) && 'Desktop' === $size 
			? $sized_attributes['width'][0] 
			: ( 'Tablet' === $size 
				? $sized_attributes['width'][1] 
				: ('Mobile' === $size 
					? $sized_attributes['width'][2] 
					: '' 
				) 
			);
		$css->set_media_state( strtolower( $size ) );
		// Normal state styles
		$css->set_selector( '.wp-block-kadence-header' . $unique_id . ' .kb-header-container' );
		$css->add_property( 'border-bottom', $css->render_border( $sized_attributes['border'], 'bottom' ) );
		$css->add_property( 'border-top', $css->render_border( $sized_attributes['border'], 'top' ) );
		$css->add_property( 'border-left', $css->render_border( $sized_attributes['border'], 'left' ) );
		$css->add_property( 'border-right', $css->render_border( $sized_attributes['border'], 'right' ) );
		$css->add_property( 'min-height', '' !== $min_height ? $min_height . $sized_attributes['heightUnit'] : '' );
		$css->add_property( 'max-width', '' !== $max_width ? $max_width . $sized_attributes['widthUnit'] : '' );
		$css->render_measure_range( $sized_attributes, 'borderRadius', 'border-radius', '', ['unit_key' => 'borderRadiusUnit']);
		$css->render_measure_output( $sized_attributes, 'margin', 'margin', '', ['unit_key' => 'marginUnit']);
		$css->render_measure_output( $sized_attributes, 'padding', 'padding', '', ['unit_key' => 'paddingUnit']);
		$css->render_typography( $sized_attributes );
		
		if ( $sized_attributes['isTransparent'] != '1' ) {
			$css->render_background( $bg, $css );
			//$css->render_border_styles($border, 'border');
			if ( '' !== $bg && ! empty( $bg['type'] ) && 'normal' === $bg['type'] && ! empty( $bg['image'] ) ) {
				$img_bg = array(
					'type' => 'image',
					'image' => array(
						'url' => ! empty($bg['image']) ? 'url("' . $bg['image'] . '")' : '',
						'imageID' => ! empty($bg['imageID']) ? $bg['imageID'] : '',
						'position' => ! empty($bg['position']) ? $bg['position'] : '',
						'attachment' => ! empty($bg['attachment']) ? $bg['attachment'] : '',
						'size' => ! empty($bg['size']) ? $bg['size'] : '',
						'repeat' => ! empty($bg['repeat']) ? $bg['repeat'] : '',
					)
				);
				$css->render_background( $img_bg, $css );
			}
		}

		//hover styles
		$css->set_selector( '.wp-block-kadence-header' . $unique_id . ' .kb-header-container:hover' );
		$css->add_property( 'border-bottom', $css->render_border( $sized_attributes['borderHover'], 'bottom' ) );
		$css->add_property( 'border-top', $css->render_border( $sized_attributes['borderHover'], 'top' ) );
		$css->add_property( 'border-left', $css->render_border( $sized_attributes['borderHover'], 'left' ) );
		$css->add_property( 'border-right', $css->render_border( $sized_attributes['borderHover'], 'right' ) );

		if ( $sized_attributes['isTransparent'] != '1' ) {
			$css->render_background( $hover_bg, $css );
			if ( '' !== $hover_bg && 'normal' === $hover_bg['type'] && ! empty( $hover_bg['image'] ) ) {
				$hover_img_bg = array(
					'type' => 'image',
					'image' => array(
						'url' 		 => ! empty($hover_bg['image']) ? 'url("' . $hover_bg['image'] . '")' : '',
						'imageID'    => ! empty($hover_bg['imageID']) ? $hover_bg['imageID'] : '',
						'position'   => ! empty($hover_bg['position']) ? $hover_bg['position'] : '',
						'attachment' => ! empty($hover_bg['attachment']) ? $hover_bg['attachment'] : '',
						'size' => ! empty($hover_bg['size']) ? $hover_bg['size'] : '',
						'repeat' => ! empty($hover_bg['repeat']) ? $hover_bg['repeat'] : '',
					)
				);
				$css->render_background( $hover_img_bg, $css );
			}
		}

		//transparent normal
		$css->set_selector( '.wp-block-kadence-header' . $unique_id . '.header-' . strtolower( $size ) . '-transparent .kb-header-container' );
		if ( $sized_attributes['isTransparent'] == '1' ) {
			$css->add_property( 'background-color', $css->render_color( ! empty( $bg_transparent['color'] ) ? $bg_transparent['color'] : '') );
			if ( '' !== $bg_transparent && 'normal' === $bg_transparent['type'] && ! empty( $bg_transparent['image'] ) ) {
				$css->add_property( 'background-image', 'url("' . $bg_transparent['image'] . '")' );
				$css->add_property( 'background-position', $bg_transparent['position'] );
				$css->add_property( 'background-size', $bg_transparent['size'] );
				$css->add_property( 'background-repeat', $bg_transparent['repeat'] );
				$css->add_property( 'background-attachment', $bg_transparent['attachment'] );
			}

			$css->add_property( 'border-bottom', $css->render_border( $sized_attributes['borderTransparent'], 'bottom' ) );
			$css->add_property( 'border-top', $css->render_border( $sized_attributes['borderTransparent'], 'top' ) );
			$css->add_property( 'border-left', $css->render_border( $sized_attributes['borderTransparent'], 'left' ) );
			$css->add_property( 'border-right', $css->render_border( $sized_attributes['borderTransparent'], 'right' ) );
		}

		//transparent hover
		$css->set_selector( '.wp-block-kadence-header' . $unique_id . '.header-' . strtolower( $size ) . '-transparent .kb-header-container:hover' );
		if ( $sized_attributes['isTransparent'] == '1' ) {
			$css->add_property( 'background-color', $css->render_color( ! empty( $hover_bg_transparent['color'] ) ? $hover_bg_transparent['color'] : '') );
			if ( '' !== $hover_bg_transparent && 'normal' === $hover_bg_transparent['type'] && ! empty( $hover_bg_transparent['image'] ) ) {
				$css->add_property( 'background-image', 'url("' . $hover_bg_transparent['image'] . '")' );
				$css->add_property( 'background-position', $hover_bg_transparent['position'] );
				$css->add_property( 'background-size', $hover_bg_transparent['size'] );
				$css->add_property( 'background-repeat', $hover_bg_transparent['repeat'] );
				$css->add_property( 'background-attachment', $hover_bg_transparent['attachment'] );
			}

			$css->add_property( 'top', '0px' );
			$css->add_property( 'border-bottom', $css->render_border( $sized_attributes['borderTransparentHover'], 'bottom' ) );
			$css->add_property( 'border-top', $css->render_border( $sized_attributes['borderTransparentHover'], 'top' ) );
			$css->add_property( 'border-left', $css->render_border( $sized_attributes['borderTransparentHover'], 'left' ) );
			$css->add_property( 'border-right', $css->render_border( $sized_attributes['borderTransparentHover'], 'right' ) );
		}

		//sticky normal
		$css->set_selector( '.wp-block-kadence-header' . $unique_id . ' .kb-header-container.item-is-stuck' );
		if ( $sized_attributes['isSticky'] == '1' ) {
			$css->add_property( 'background-color', $css->render_color( ! empty( $bg_sticky['color'] ) ? $bg_sticky['color'] : '') );
			if ( '' !== $bg_sticky && 'normal' === $hover_bg_sticky['type'] && ! empty( $bg_sticky['image'] ) ) {
				$css->add_property( 'background-image', 'url("' . $bg_sticky['image'] . '")' );
				$css->add_property( 'background-position', $bg_sticky['position'] );
				$css->add_property( 'background-size', $bg_sticky['size'] );
				$css->add_property( 'background-repeat', $bg_sticky['repeat'] );
				$css->add_property( 'background-attachment', $bg_sticky['attachment'] );
			}

			$css->add_property( 'border-bottom', $css->render_border( $sized_attributes['borderSticky'], 'bottom' ) );
			$css->add_property( 'border-top', $css->render_border( $sized_attributes['borderSticky'], 'top' ) );
			$css->add_property( 'border-left', $css->render_border( $sized_attributes['borderSticky'], 'left' ) );
			$css->add_property( 'border-right', $css->render_border( $sized_attributes['borderSticky'], 'right' ) );
		}

		//sticky hover
		$css->set_selector( '.wp-block-kadence-header' . $unique_id . ' .kb-header-container.item-is-stuck:hover' );
		if ( $sized_attributes['isSticky'] == '1' ) {
			$css->add_property( 'background-color', $css->render_color( ! empty( $hover_bg_sticky['color'] ) ? $hover_bg_sticky['color'] : '') );
			if ( '' !== $hover_bg_sticky && 'normal' === $hover_bg_sticky['type'] && ! empty( $hover_bg_sticky['image'] ) ) {
				$css->add_property( 'background-image', 'url("' . $hover_bg_sticky['image'] . '")' );
				$css->add_property( 'background-position', $hover_bg_sticky['position'] );
				$css->add_property( 'background-size', $hover_bg_sticky['size'] );
				$css->add_property( 'background-repeat', $hover_bg_sticky['repeat'] );
				$css->add_property( 'background-attachment', $hover_bg_sticky['attachment'] );
			}

			$css->add_property( 'top', '0px' );
			$css->add_property( 'border-bottom', $css->render_border( $sized_attributes['borderStickyHover'], 'bottom' ) );
			$css->add_property( 'border-top', $css->render_border( $sized_attributes['borderStickyHover'], 'top' ) );
			$css->add_property( 'border-left', $css->render_border( $sized_attributes['borderStickyHover'], 'left' ) );
			$css->add_property( 'border-right', $css->render_border( $sized_attributes['borderStickyHover'], 'right' ) );
		}
	}

	/**
	 * Build HTML for dynamic blocks
	 *
	 * @param          $attributes
	 * @param          $unique_id
	 * @param          $content
	 * @param WP_Block $block_instance The instance of the WP_Block class that represents the block being rendered.
	 *
	 * @return mixed
	 */
	public function build_html( $attributes, $unique_id, $content, $block_instance ) {
		$header_block = get_post( $attributes['id'] );

		if ( ! $header_block || 'kadence_header' !== $header_block->post_type ) {
			return '';
		}

		if ( 'publish' !== $header_block->post_status || ! empty( $header_block->post_password ) ) {
			return '';
		}

		// Prevent a nav block from being rendered inside itself.
		if ( isset( self::$seen_refs[ $attributes['id'] ] ) ) {
			// WP_DEBUG_DISPLAY must only be honored when WP_DEBUG. This precedent
			// is set in `wp_debug_mode()`.
			$is_debug = WP_DEBUG && WP_DEBUG_DISPLAY;

			return $is_debug ?
				// translators: Visible only in the front end, this warning takes the place of a faulty block.
				__( '[block rendering halted]', 'kadence-blocks' ) :
				'';
		}
		self::$seen_refs[ $attributes['id'] ] = true;

		$header_attributes = $this->get_attributes_with_defaults_cpt( $attributes['id'], 'kadence_header', '_kad_header_' );
		$header_attributes = json_decode( json_encode( $header_attributes ), true );

		// Remove the advanced nav block so it doesn't try and render.
		$content = preg_replace( '/<!-- wp:kadence\/header {.*?} -->/', '', $header_block->post_content );
		$content = str_replace( '<!-- wp:kadence/header  -->', '', $content );
		$content = str_replace( '<!-- wp:kadence/header -->', '', $content );
		$content = str_replace( '<!-- /wp:kadence/header -->', '', $content );

		// Handle embeds for nav block.
		global $wp_embed;
		$content = $wp_embed->run_shortcode( $content );
		$content = $wp_embed->autoembed( $content );
		$content = do_blocks( $content );

		unset( self::$seen_refs[ $attributes['id'] ] );

		$name = ! empty( $attributes['name'] ) ? $attributes['name'] : '';

		// Inherit values.
		// Just getting a css class for access to methods.
		$css = Kadence_Blocks_CSS::get_instance();
		$is_sticky = $css->get_inherited_value( $header_attributes['isSticky'], $header_attributes['isStickyTablet'], $header_attributes['isStickyMobile'], 'Desktop' );
		$is_sticky_tablet = $css->get_inherited_value( $header_attributes['isSticky'], $header_attributes['isStickyTablet'], $header_attributes['isStickyMobile'], 'Tablet' );
		$is_sticky_mobile = $css->get_inherited_value( $header_attributes['isSticky'], $header_attributes['isStickyTablet'], $header_attributes['isStickyMobile'], 'Mobile' );
		$is_transparent = $css->get_inherited_value( $header_attributes['isTransparent'], $header_attributes['isTransparentTablet'], $header_attributes['isTransparentMobile'], 'Desktop' );
		$is_transparent_tablet = $css->get_inherited_value( $header_attributes['isTransparent'], $header_attributes['isTransparentTablet'], $header_attributes['isTransparentMobile'], 'Tablet' );
		$is_transparent_mobile = $css->get_inherited_value( $header_attributes['isTransparent'], $header_attributes['isTransparentTablet'], $header_attributes['isTransparentMobile'], 'Mobile' );

		$style =
			$is_sticky && $is_transparent
				? 'sticky-transparent'
				: ( $is_sticky
				? 'sticky '
				: ( $is_transparent
				? 'transparent'
				: 'standard' ) );
		$style_tablet =
			$is_sticky_tablet && $is_transparent_tablet
				? 'sticky-transparent'
				: ( $is_sticky_tablet
				? 'sticky '
				: ( $is_transparent_tablet
				? 'transparent'
				: 'standard' ) );
		$style_mobile =
		$is_sticky_mobile && $is_transparent_mobile
				? 'sticky-transparent'
				: ( $is_sticky_mobile
				? 'sticky '
				: ( $is_transparent_mobile
				? 'transparent'
				: 'standard' ) );

		$wrapper_classes = array( 'wp-block-kadence-header' . $unique_id );
		$wrapper_classes[] = $is_sticky ? 'header-desktop-sticky' : '';
		$wrapper_classes[] = $is_sticky_tablet ? 'header-tablet-sticky' : '';
		$wrapper_classes[] = $is_sticky_mobile ? 'header-mobile-sticky' : '';
		$wrapper_classes[] = $is_transparent ? 'header-desktop-transparent' : '';
		$wrapper_classes[] = $is_transparent_tablet ? 'header-tablet-transparent' : '';
		$wrapper_classes[] = $is_transparent_mobile ? 'header-mobile-transparent' : '';

		$wrapper_attributes = get_block_wrapper_attributes(
			array(
				'class'      => implode( ' ', $wrapper_classes ),
				'aria-label' => $name,
				'data-auto-transparent-spacing' => $header_attributes['autoTransparentSpacing'],
				'data-sticky' => $is_sticky,
				'data-sticky-tablet' => $is_sticky_tablet,
				'data-sticky-mobile' => $is_sticky_mobile,
				'data-transparent' => $is_transparent,
				'data-transparent-tablet' => $is_transparent_tablet,
				'data-transparent-mobile' => $is_transparent_mobile,
				'data-sticky-section' => $header_attributes['stickySection'] ?: 'main',
				'data-sticky-section-tablet' => $header_attributes['stickySectionTablet'] ?: 'main',
				'data-sticky-section-mobile' => $header_attributes['stickySectionMobile'] ?: 'main',
				'data-shrink-main' => $header_attributes['shrinkMain'],
				'data-shrink-main-height' => $header_attributes['shrinkMainHeight'] ?: '',
				'data-shrink-main-height-tablet' => $header_attributes['shrinkMainHeightTablet'] ?: '',
				'data-shrink-main-height-mobile' => $header_attributes['shrinkMainHeightMobile'] ?: '',
				'data-reveal-scroll-up' => $header_attributes['revealScrollUp'],
			)
		);

		return sprintf(
			'<div %1$s>%2$s</div>',
			$wrapper_attributes,
			$content
		);
	}

	/**
	 * Registers scripts and styles.
	 */
	public function register_scripts() {
		parent::register_scripts();
		// If in the backend, bail out.
		if ( is_admin() ) {
			return;
		}
		if ( apply_filters( 'kadence_blocks_check_if_rest', false ) && kadence_blocks_is_rest() ) {
			return;
		}

		wp_register_script( 'kadence-blocks-' . $this->block_name, KADENCE_BLOCKS_URL . 'includes/assets/js/kb-header-block.min.js', array(), KADENCE_BLOCKS_VERSION, true );

		wp_localize_script(
			'kadence-blocks-' . $this->block_name,
			'kadenceHeaderConfig',
			array(
				'screenReader' => array(
					'expand'     => __( 'Child menu', 'kadence' ),
					'expandOf'   => __( 'Child menu of', 'kadence' ),
					'collapse'   => __( 'Child menu', 'kadence' ),
					'collapseOf' => __( 'Child menu of', 'kadence' ),
				),
				'breakPoints' => array(
					'desktop' => 1024,
					'tablet' => 768,
				),
				'scrollOffset' => apply_filters( 'kadence_scroll_to_id_additional_offset', 0 ),
			),
		);
	}
}

Kadence_Blocks_Header_Block::get_instance();
