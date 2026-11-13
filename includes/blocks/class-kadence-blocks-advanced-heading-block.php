<?php
/**
 * Class to Build the Advanced Heading Block.
 *
 * @package Kadence Blocks
 */

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Active_Token_Library_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Preset_Resolver;
use KadenceWP\KadenceBlocks\Site_Styles\Contracts\Supports_Site_Styles;
use KadenceWP\KadenceBlocks\Utils\Cast;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Advanced Heading Block.
 *
 * @category class
 */
class Kadence_Blocks_Advancedheading_Block extends Kadence_Blocks_Abstract_Block implements Supports_Site_Styles {

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
	protected $block_name = 'advancedheading';

	/**
	 * Block determines in scripts need to be loaded for block.
	 *
	 * @var string
	 */
	protected $has_script = false;

	/**
	 * Allowed HTML tags for front end output.
	 *
	 * @var string[]
	 */
	protected $allowed_html_tags = array( 'heading', 'p', 'span', 'div' );

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
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-advancedheading-css.php';

		$bridge  = function ( $member, ...$args ) {
			return method_exists( $this, $member ) ? $this->$member( ...$args ) : $this->$member;
		};
		$builder = new Kadence_Blocks_Advancedheading_Css( new Kadence_Blocks_Css_Block_Context( $this->block_name, $bridge ) );

		return $builder->build( $attributes, $css, $unique_id, $unique_style_id );
	}
	/**
	 * This block is conditionally dynamic. It's only rendered dynamically if the heading includes an icon.
	 *
	 * @param array    $attributes     The block attributes.
	 * @param string   $unique_id      The blocks attr ID.
	 * @param string   $content        The saved block markup.
	 * @param WP_Block $block_instance The instance of the WP_Block class that represents the block being rendered.
	 *
	 * @return string Returns the block output.
	 */
	public function build_html( $attributes, $unique_id, $content, $block_instance ) {

		if ( strpos( $content, 'kt-typed-text') !== false ) {
			$this->enqueue_script( 'kadence-blocks-' . $this->block_name );
		}
		if ( strpos( $content, 'kb-tooltips') !== false || ( ! empty( $attributes['icon'] ) && ! empty( $attributes['iconTooltip'] ) ) ) {
			$this->enqueue_script( 'kadence-blocks-tippy' );
		}

		$should_wrap_content = ! empty( $attributes['icon'] ) ||
		                       ( ! empty( $attributes['enableTextGradient'] ) && strpos( $content, 'kt-typed-text' ) === false );

		if ( $should_wrap_content ) {
			$tag_name     = $this->get_html_tag( $attributes, 'htmlTag', 'h2', $this->allowed_html_tags, 'level' );
			$text_content = $this->get_inner_content( $content, $tag_name );
			// Start empty.
			$content = '';
			$reveal_animation = ( ! empty( $attributes['kadenceAnimation'] ) && ( 'reveal-left' === $attributes['kadenceAnimation'] || 'reveal-right' === $attributes['kadenceAnimation'] || 'reveal-up' === $attributes['kadenceAnimation'] || 'reveal-down' === $attributes['kadenceAnimation'] ) ? true : false );
			$wrapper = $reveal_animation ? true : false;
			$icon_side = ! empty( $attributes['iconSide'] ) ? $attributes['iconSide'] : 'left';
			$classes = array( 'kt-adv-heading' . $unique_id, 'wp-block-kadence-advancedheading' );
			if ( ! empty( $attributes['icon'] ) ) {
				$classes[] = 'kt-adv-heading-has-icon';
			}
			if ( ! empty( $attributes['link'] ) && ! empty( $attributes['linkStyle'] ) ) {
				$classes[] = 'hls-' . $attributes['linkStyle'];
			}
			if ( ! empty( $attributes['className'] ) && ! $wrapper && empty( $attributes['link'] ) ) {
				$classes[] = $attributes['className'];
			}
			if ( ! empty( $attributes['colorClass'] ) ) {
				$classes[] = 'has-' . $attributes['colorClass'] . '-color';
				$classes[] = 'has-text-color';
			}
			if ( ! empty( $attributes['backgroundColorClass'] ) ) {
				$classes[] = 'has-' . $attributes['backgroundColorClass'] . '-background-color';
				$classes[] = 'has-background';
			}
			$content_args = array(
				'class' => implode( ' ', $classes ),
				'data-kb-block' => 'kb-adv-heading' . $unique_id,
			);
			if ( ! empty( $attributes['anchor'] ) ) {
				$content_args['id'] = $attributes['anchor'];
			}
			$content_args = kadence_apply_aos_wrapper_args( $attributes, $content_args );
			$inner_content_attributes = array();
			foreach ( $content_args as $key => $value ) {
				$inner_content_attributes[] = $key . '="' . esc_attr( $value ) . '"';
			}
			$inner_content_attributes = implode( ' ', $inner_content_attributes );
			$icon_left = '';
			$icon_right = '';
			if ( ! empty( $attributes['icon'] ) ) {
				if ( 'left' === $icon_side ) {
					$icon_left = $this->get_icon( $attributes );
				}
				if ( 'right' === $icon_side ) {
					$icon_right = $this->get_icon( $attributes );
				}
			}
			$content = sprintf( '<%1$s %2$s>%3$s<span class="kb-adv-text-inner">%4$s</span>%5$s</%1$s>', $tag_name, $inner_content_attributes, $icon_left, $text_content, $icon_right );
			if ( ! empty( $attributes['link'] ) ) {
				$link_classes = array( 'kb-advanced-heading-link', 'kt-adv-heading-link' . $unique_id );
				if ( ! empty( $attributes['linkStyle'] ) ) {
					$link_classes[] = 'hls-' . $attributes['linkStyle'];
				}
				if( ! $wrapper && !empty( $attributes['className'] ) ){
					$link_classes[] = $attributes['className'];
				}
				if ( ! empty( $attributes['class'] ) && ! $wrapper ) {
					$link_classes[] = $attributes['class'];
				}
				$link_args = array(
					'class' => implode( ' ', $link_classes ),
				);
				$link_args['href'] = esc_url( do_shortcode( $attributes['link'] ) );
				$rel_add = '';
				if ( ! empty( $attributes['linkTarget'] ) && $attributes['linkTarget'] ) {
					$link_args['target'] = '_blank';
					$rel_add .= 'noreferrer noopener';
				}
				if ( isset( $attributes['linkNoFollow'] ) && $attributes['linkNoFollow'] ) {
					if ( ! empty( $rel_add ) ) {
						$rel_add .= ' nofollow';
					} else {
						$rel_add .= 'nofollow';
					}
				}
				if ( isset( $attributes['linkSponsored'] ) && $attributes['linkSponsored'] ) {
					if ( ! empty( $rel_add ) ) {
						$rel_add .= ' sponsored';
					} else {
						$rel_add .= 'sponsored';
					}
				}
				if ( ! empty( $rel_add ) ) {
					$link_args['rel'] = $rel_add;
				}
				$link_attributes = array();
				foreach ( $link_args as $key => $value ) {
					$link_attributes[] = $key . '="' . esc_attr( $value ) . '"';
				}
				$link_attributes = implode( ' ', $link_attributes );
				$content = sprintf( '<a %1$s>%2$s</a>', $link_attributes, $content );
			}
			if ( $wrapper ) {
				$wrapper_classes = array( 'kb-adv-heading-wrap' . $unique_id, 'kadence-advanced-heading-wrapper' );
				if ( $reveal_animation ) {
					$wrapper_classes[] = 'kadence-heading-clip-animation';
				}
				if ( ! empty( $attributes['class'] ) && $wrapper ) {
					$wrapper_classes[] = $attributes['class'];
				}
				$wrapper_args = array(
					'class' => implode( ' ', $wrapper_classes ),
				);
				$wrapper_attributes = array();
				foreach ( $wrapper_args as $key => $value ) {
					$wrapper_attributes[] = $key . '="' . esc_attr( $value ) . '"';
				}
				$wrapper_attributes = implode( ' ', $wrapper_attributes );
				$content = sprintf( '<div %1$s>%2$s</div>', $wrapper_attributes, $content );
			}
		} elseif ( ! empty( $attributes['link'] ) && false !== strpos( $attributes['link'], '[' ) ) {
			// Plain heading: the dynamic link lives as a shortcode in the saved anchor's href.
			// In a query loop the saved markup is resolved once (with the first/queried post's
			// context) and the baked HTML is reused for every item, so the href is wrong for all
			// but the first post. Re-resolve from the (unbaked) link attribute in this per-post
			// render callback and overwrite the anchor's href, matching how the icon/gradient
			// path above and the single button block build their links.
			// esc_url_raw (not esc_url) because WP_HTML_Tag_Processor::set_attribute()
			// HTML-escapes the value itself; esc_url would double-encode ampersands.
			$resolved_link = esc_url_raw( do_shortcode( $attributes['link'] ) );
			$p             = new WP_HTML_Tag_Processor( $content );
			if ( $p->next_tag( [ 'tag_name' => 'a' ] ) ) {
				$p->set_attribute( 'href', $resolved_link );
				$content = $p->get_updated_html();
			}
		}

		return $content;
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
		wp_register_style( 'kadence-blocks-' . $this->block_name, false );
		$heading_css = <<<'CSS'
			.wp-block-kadence-advancedheading mark{background:transparent;border-style:solid;border-width:0}
			.wp-block-kadence-advancedheading mark.kt-highlight{color:#f76a0c;}
			.kb-adv-heading-icon{display: inline-flex;justify-content: center;align-items: center;}
			.is-layout-constrained > .kb-advanced-heading-link {display: block;}
		CSS;

		// Style to prevent padding conflict with WordPress core style for headings and paragraphs.
		// Reference: https://stellarwp.atlassian.net/browse/KAD-5283
		$heading_css .= '.wp-block-kadence-advancedheading.has-background{padding: 0;}';

		// Short term fix for an issue with heading wrapping.
		if ( class_exists( '\Kadence\Theme' ) ) {
			$heading_css .= <<<'CSS'
				.single-content .kadence-advanced-heading-wrapper h1,
				.single-content .kadence-advanced-heading-wrapper h2,
				.single-content .kadence-advanced-heading-wrapper h3,
				.single-content .kadence-advanced-heading-wrapper h4,
				.single-content .kadence-advanced-heading-wrapper h5,
				.single-content .kadence-advanced-heading-wrapper h6 {margin: 1.5em 0 .5em;}
				.single-content .kadence-advanced-heading-wrapper+* { margin-top:0;}
			CSS;
		}

		// Add screen reader text styles
		$heading_css .= '.kb-screen-reader-text{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);}';
		wp_add_inline_style( 'kadence-blocks-' . $this->block_name, $heading_css );

		wp_register_script( 'kadence-blocks-typed-js', KADENCE_BLOCKS_URL . 'includes/assets/js/typed.min.js', array(), KADENCE_BLOCKS_VERSION, true );
		wp_register_script( 'kadence-blocks-' . $this->block_name, KADENCE_BLOCKS_URL . 'includes/assets/js/kb-advanced-heading.min.js', array( 'kadence-blocks-typed-js' ), KADENCE_BLOCKS_VERSION, true );

		wp_register_script( 'kadence-blocks-popper', KADENCE_BLOCKS_URL . 'includes/assets/js/popper.min.js', array(), KADENCE_BLOCKS_VERSION, true );
		wp_register_script( 'kadence-blocks-tippy', KADENCE_BLOCKS_URL . 'includes/assets/js/kb-tippy.min.js', array( 'kadence-blocks-popper' ), KADENCE_BLOCKS_VERSION, true );
	}
	/**
	 * The editor paints the heading with inline styles and builds the markup around an icon from
	 * its attributes, so every style value goes through the overlay. The tag, the link, the icon
	 * and its tooltip, and the palette classes in the saved markup describe one heading and stay
	 * per heading, as do the attributes older headings migrate from when they are edited.
	 *
	 * @since 3.9.0
	 *
	 * @return list<string>
	 */
	public function site_styles_overlay_attributes(): array {
		return array_merge(
			[ 'align', 'tabletAlign', 'mobileAlign', 'maxWidth', 'maxWidthType', 'textOrientation', 'tabletTextOrientation', 'mobileTextOrientation' ],
			[ 'padding', 'tabletPadding', 'mobilePadding', 'paddingType', 'margin', 'tabletMargin', 'mobileMargin', 'marginType' ],
			[ 'fontSize', 'sizeType', 'fontHeight', 'fontHeightType', 'letterSpacing', 'tabletLetterSpacing', 'mobileLetterSpacing', 'letterSpacingType', 'textTransform' ],
			[ 'typography', 'googleFont', 'loadGoogleFont', 'loadItalic', 'fontSubset', 'fontVariant', 'fontWeight', 'fontStyle' ],
			[ 'background', 'enableTextGradient', 'textGradient', 'linkStyle', 'linkColor', 'linkHoverColor', 'enableTextShadow', 'textShadow', 'textShadowTablet', 'textShadowMobile' ],
			[ 'borderStyle', 'tabletBorderStyle', 'mobileBorderStyle', 'borderRadius', 'tabletBorderRadius', 'mobileBorderRadius', 'borderRadiusUnit' ],
			[ 'iconColor', 'iconColorHover', 'iconSide', 'iconPadding', 'tabletIconPadding', 'mobileIconPadding', 'iconPaddingUnit', 'iconSize', 'iconSizeUnit', 'iconVerticalAlign' ],
			[ 'markColor', 'markBG', 'markBGOpacity', 'enableMarkGradient', 'enableMarkBackgroundGradient', 'markGradient', 'markBackgroundGradient', 'markTextTransform' ],
			[ 'markSize', 'markSizeType', 'markLineHeight', 'markLineType', 'markLetterSpacing', 'markLetterSpacingType' ],
			[ 'markTypography', 'markGoogleFont', 'markLoadGoogleFont', 'markFontSubset', 'markFontVariant', 'markFontWeight', 'markFontStyle' ],
			[ 'markPadding', 'markTabPadding', 'markMobilePadding', 'markPaddingType' ],
			[ 'markBorderStyles', 'tabletMarkBorderStyles', 'mobileMarkBorderStyles', 'markBorderRadius', 'tabletMarkBorderRadius', 'mobileMarkBorderRadius', 'markBorderRadiusUnit' ],
			[ 'inlineImageWidth', 'inlineImageBorderStyles', 'tabletInlineImageBorderStyles', 'mobileInlineImageBorderStyles', 'inlineImageVerticalAlign', 'useRatio', 'ratio' ],
			[ 'inlineImageBorderRadius', 'tabletInlineImageBorderRadius', 'mobileInlineImageBorderRadius', 'inlineImageBorderRadiusUnit' ]
		);
	}

	/**
	 * @inheritDoc
	 *
	 * @since 3.9.0
	 */
	public function site_styles_attributes_map(): array {
		return [ 'color' => 'color.text' ];
	}

	/**
	 * The background is not core's: the design tokens' default rule for the heading sets it at
	 * the same specificity as core's rule and prints after it, so only an overlay value shows.
	 *
	 * @inheritDoc
	 *
	 * @since 3.9.0
	 */
	public function site_styles_supports(): array {
		return [
			'color' => [
				'background'                      => false,
				'text'                            => true,
				'gradients'                       => false,
				'__experimentalSkipSerialization' => true,
			],
		];
	}

	/**
	 * Core's default root, the block's class: the heading element on the front end, and the
	 * wrapper around it in the editor, where the color reaches the heading by inheritance.
	 *
	 * @since 3.9.0
	 */
	public function site_styles_selectors(): array {
		return [];
	}

	/**
	 * Get the text content.
	 *
	 * @param array $attributes the blocks attributes.
	 */
	private function get_inner_content( $string, $tagname ) {
		$pattern = "#<\s*?$tagname\b[^>]*>(.*?)</$tagname\b[^>]*>#s";
		preg_match( $pattern, $string, $matches );
		if ( isset( $matches[1] ) ) {
			return $matches[1];
		}
		return '';
	}

	/**
	 * Build the Icon.
	 *
	 * @param array $attributes the blocks attributes.
	 */
	private function get_icon( $attributes ) {
		$svg_icon   = '';
		$icon_side = ! empty( $attributes['iconSide'] ) ? $attributes['iconSide'] : 'left';
		if ( ! empty( $attributes['icon'] ) ) {
			$type         = substr( $attributes['icon'], 0, 2 );
			$line_icon    = ( ! empty( $type ) && 'fe' == $type ? true : false );
			$fill         = ( $line_icon ? 'none' : 'currentColor' );
			$stroke_width = false;

			if ( $line_icon ) {
				$stroke_width = 2;
			}
			$title = ( ! empty ( $attributes['iconTitle'] ) ? $attributes['iconTitle'] : '' );
			$hidden = ( empty( $title ) ? true : false );
			$svg_icon = Kadence_Blocks_Svg_Render::render( $attributes['icon'], $fill, $stroke_width, $title, $hidden );
		}
		$tooltip_placement = '';
		if ( ! empty( $attributes['iconTooltip'] ) && ! empty( $attributes['iconTooltipPlacement'] ) ) {
			$tooltip_placement = ' data-tooltip-placement="' . esc_attr( $attributes['iconTooltipPlacement'] ) . '"';
		}
		if ( ! empty( $attributes['iconTooltip'] ) && isset( $attributes['iconTooltipDash'] ) && $attributes['iconTooltipDash'] ) {
			$tooltip_placement = ' data-kb-tooltip-dash="border"';
		}
		return '<span class="kb-svg-icon-wrap kb-adv-heading-icon kb-svg-icon-' . esc_attr( $attributes['icon'] ) . ' kb-adv-heading-icon-side-' . esc_attr( $icon_side ) . '"' . ( ! empty( $attributes['iconTooltip'] ) ? ' data-kb-tooltip-content="' . esc_attr( $attributes['iconTooltip'] ) . '" tabindex="0"' . $tooltip_placement : '' ) . '>' . $svg_icon . '</span>';
	}

	/**
	 * Handles the text orientation by updating CSS properties based on the specified orientation.
	 *
	 * @param object $css The CSS processor object used to apply properties.
	 * @param string $textOrientation The specified text orientation. Possible values are 'horizontal', 'stacked', 'sideways-down', and 'sideways-up'.
	 * @return void
	 */
	private function handle_text_orientation($css, $textOrientation) {
		switch ($textOrientation) {
			case 'horizontal':
				$css->add_property('writing-mode', 'horizontal-tb');
				$css->add_property('text-orientation', 'mixed');
				break;
			case 'stacked':
				$css->add_property('writing-mode', 'vertical-lr');
				$css->add_property('text-orientation', 'upright');
				break;
			case 'sideways-down':
				$css->add_property('writing-mode', 'vertical-lr');
				$css->add_property('text-orientation', 'sideways');
				break;
			case 'sideways-up':
				$css->add_property('writing-mode', 'sideways-lr');
				$css->add_property('text-orientation', 'sideways');
				break;
		}
	}

	/**
	 * Handles the max-height property for CSS generation based on block attributes.
	 *
	 * @param object $css The CSS generator object.
	 * @param array $attributes The block attributes.
	 * @param int $deviceIndex The index representing the current device context.
	 * @param string $orientationKey The key that defines the orientation for the current context.
	 *
	 * @return void
	 */
	private function handle_max_height($css, $attributes, $deviceIndex, $orientationKey) {
		if (
			isset($attributes['maxHeight']) &&
			is_array($attributes['maxHeight']) &&
			!empty($attributes['maxHeight'][$deviceIndex]) &&
			$attributes[$orientationKey] !== 'horizontal'
		) {
			$css->add_property(
				'max-height',
				$attributes['maxHeight'][$deviceIndex] .
				( !isset($attributes['maxHeightType'][$deviceIndex]) ? 'px' : $attributes['maxHeightType'][$deviceIndex] )
			);
		}
	}

	/**
	 * Renders the text shadow styles across desktop, tablet, and mobile devices based on the provided attributes.
	 *
	 * @param array $attributes An array of attributes containing text shadow properties for different breakpoints (desktop, tablet, and mobile).
	 * @return void
	 */
	public function render_text_shadow( $attributes, $css ) {

		if (!empty($attributes['textShadow']) &&
			is_array($attributes['textShadow'][0]) &&
			(!empty($attributes['enableTextShadow']) || !empty($attributes['textShadow'][0]['enable']))
		) {
			$textShadow = $attributes['textShadow'][0] ?? [];
			$textShadow['hOffset'] = $textShadow['hOffset'] ?? 1;
			$textShadow['vOffset'] = $textShadow['vOffset'] ?? 1;
			$textShadow['blur']    = $textShadow['blur'] ?? 1;
			$textShadow['color']   = $textShadow['color'] ?? null;
			$textShadow['opacity'] = $textShadow['opacity'] ?? 1.0; // Default is 0.2, but if it's undefed they set it at a time when the block defaults it to 1.0
		}

		if (!empty($attributes['textShadowTablet']) && is_array($attributes['textShadowTablet'][0])) {
			$textShadowTablet = $attributes['textShadowTablet'][0] ?? [];
			$textShadowTablet['hOffset'] = $this->get_cascading_value(
				null, // No mobile value is considered here for tablet logic
				$textShadowTablet['hOffset'] ?? null,
				$attributes['textShadow'][0]['hOffset'] ?? null,
				1
			);
			$textShadowTablet['vOffset'] = $this->get_cascading_value(
				null,
				$textShadowTablet['vOffset'] ?? null,
				$attributes['textShadow'][0]['vOffset'] ?? null,
				1
			);
			$textShadowTablet['blur'] = $this->get_cascading_value(
				null,
				$textShadowTablet['blur'] ?? null,
				$attributes['textShadow'][0]['blur'] ?? null,
				1
			);
			$textShadowTablet['color'] = $this->get_cascading_value(
				null,
				$textShadowTablet['color'] ?? null,
				$attributes['textShadow'][0]['color'] ?? null,
				null // Default fallback value for color
			);
			$textShadowTablet['opacity'] = $this->get_cascading_value(
				null,
				$textShadowTablet['opacity'] ?? null,
				$attributes['textShadow'][0]['opacity'] ?? null,
				1
			);
		}
		if (!empty($attributes['textShadowMobile']) && is_array($attributes['textShadowMobile'][0])) {
			$textShadowMobile = $attributes['textShadowMobile'][0] ?? [];
			$textShadowMobile['hOffset'] = $this->get_cascading_value(
				$textShadowMobile['hOffset'] ?? null,
				$attributes['textShadowTablet'][0]['hOffset'] ?? null,
				$attributes['textShadow'][0]['hOffset'] ?? null,
				1
			);
			$textShadowMobile['vOffset'] = $this->get_cascading_value(
				$textShadowMobile['vOffset'] ?? null,
				$attributes['textShadowTablet'][0]['vOffset'] ?? null,
				$attributes['textShadow'][0]['vOffset'] ?? null,
				1
			);
			$textShadowMobile['blur'] = $this->get_cascading_value(
				$textShadowMobile['blur'] ?? null,
				$attributes['textShadowTablet'][0]['blur'] ?? null,
				$attributes['textShadow'][0]['blur'] ?? null,
				1
			);
			$textShadowMobile['color'] = $this->get_cascading_value(
				$textShadowMobile['color'] ?? null,
				$attributes['textShadowTablet'][0]['color'] ?? null,
				$attributes['textShadow'][0]['color'] ?? null,
				null
			);
			$textShadowMobile['opacity'] = $this->get_cascading_value(
				$textShadowMobile['opacity'] ?? null,
				$attributes['textShadowTablet'][0]['opacity'] ?? null,
				$attributes['textShadow'][0]['opacity'] ?? null,
				1
			);
		}

		$responsiveTextShadow = [$textShadow, $textShadowTablet ?? null, $textShadowMobile ?? null];

		foreach ($responsiveTextShadow as $key => $textShadow) {
			if (!empty($textShadow)) {
				if ( strpos($textShadow['color'], 'rgba') !== false ) {
					$shadow_string = ( ! empty( $textShadow['hOffset'] ) ? $textShadow['hOffset'] : '0' ) . 'px '
						. ( ! empty( $textShadow['vOffset'] ) ? $textShadow['vOffset'] : '0' ) . 'px '
						. ( ! empty( $textShadow['blur'] ) ? $textShadow['blur'] : '0' ) . 'px '
						. ( ! empty( $textShadow['color'] )
							? $css->render_color( $textShadow['color'] )
							: $css->render_color( '#000000', $textShadow['opacity'] )
						);
				} else {
					$shadow_string = ( ! empty( $textShadow['hOffset'] ) ? $textShadow['hOffset'] : '0' ) . 'px '
						. ( ! empty( $textShadow['vOffset'] ) ? $textShadow['vOffset'] : '0' ) . 'px '
						. ( ! empty( $textShadow['blur'] ) ? $textShadow['blur'] : '0' ) . 'px '
						. ( ! empty( $textShadow['color'] )
							? $css->render_color( $textShadow['color'], $textShadow['opacity'] )
							: $css->render_color( '#000000', $textShadow['opacity'] )
						);
				}

				switch ($key) {
					case 0: $css->set_media_state('desktop'); break;
					case 1: $css->set_media_state('tablet'); break;
					case 2: $css->set_media_state('mobile'); break;
				}

				$css->add_property('text-shadow', $shadow_string);
			}
		}
	}

	/**
	 * Retrieve the cascading value based on device-specific settings.
	 *
	 * @param mixed $mobile The value specifically set for mobile devices.
	 * @param mixed $tablet The value specifically set for tablet devices.
	 * @param mixed $default The default value if mobile and tablet values are not provided.
	 * @param mixed $fallback The fallback value if none of the other values are set.
	 */
	public function get_cascading_value($mobile, $tablet, $default, $fallback) {
		if (isset($mobile) && $mobile !== '') {
			return $mobile;
		} elseif (isset($tablet) && $tablet !== '') {
			return $tablet;
		} elseif (isset($default) && $default !== '') {
			return $default;
		}
		return $fallback;
	}
	/**
	 * Point font-family at its preset variable, but only when the active preset actually resolves one.
	 *
	 * Called only where the block's own `typography` attribute is empty, so a family a site owner picked
	 * per-instance always wins — this supplies the family a preset carries for a heading that has none of
	 * its own.
	 *
	 * The gate matters for the same reason it does on the Single Button's spacing bridge:
	 * `font-family: var(--kb-heading-font-family)` is not inert when the variable is undefined, it is
	 * invalid at computed-value time, which resets the property to its initial value rather than letting
	 * the heading inherit the theme's font. Emitting only when the preset resolves a family is what keeps
	 * a heading whose preset sets none looking exactly as it does today.
	 *
	 * The variable, not the literal: the preset projector sets `--kb-heading-font-family` per preset
	 * scope, so one rule follows whichever preset the heading is on. The binding deliberately declares no
	 * `css_prop`, which is what keeps font-family out of the block-default rule that every heading gets
	 * (see the declaration for why that would break theme inheritance).
	 *
	 * @since 3.8.0
	 *
	 * @param Kadence_Blocks_CSS   $css        The css object.
	 * @param array<string, mixed> $attributes The block attributes.
	 *
	 * @return void
	 */
	private function render_preset_typography( Kadence_Blocks_CSS $css, array $attributes ): void {
		try {
			$registry = kadence_blocks()->get( Token_Registry::class );
			$library  = kadence_blocks()->get( Active_Token_Library_Store::class );
			$resolver = kadence_blocks()->get( Preset_Resolver::class );

			// The container is typed `mixed`, and this runs on every heading render, so the services are
			// checked rather than assumed — a misconfigured container degrades to today's font.
			if (
				! $registry instanceof Token_Registry
				|| ! $library instanceof Active_Token_Library_Store
				|| ! $resolver instanceof Preset_Resolver
				|| ! $registry->is_active()
			) {
				return;
			}

			$slug     = $library->get();
			$selected = Cast::to_string( $attributes['kbPreset'] ?? '' );
			$preset   = $selected !== '' && $resolver->has_preset( 'kadence/advancedheading', $selected, $slug )
				? $selected
				: $resolver->default_preset( 'kadence/advancedheading', $slug );
			$values   = $resolver->resolve( 'kadence/advancedheading', $preset, $slug );
		} catch ( Throwable $e ) {
			// This runs in the render path, so a broken token graph must not take the page down with it —
			// the heading simply keeps the font it has today.
			return;
		}

		if ( ! isset( $values['typography'] ) ) {
			return;
		}

		$css->add_property( 'font-family', 'var(--kb-heading-font-family)' );

		// Enqueue the family as well as name it. The block's own loading is driven by the `typography`
		// attribute, which is empty in exactly the case this bridge fires, so without this a heading that
		// takes its family from a preset would render in a fallback face while the CSS asked for the real
		// one. The preset stores the family as a literal, which is the shape this expects.
		$family = Cast::to_string( $values['typography'] );

		if ( $family !== '' && 'inherit' !== $family ) {
			$variant = $this->preset_font_variant( $attributes, $values );

			$css->maybe_add_google_font( $family, $variant !== '' ? $variant : null );
		}
	}

	/**
	 * The Google variant to request alongside a preset's family, so the weight the page asks for is a
	 * face the browser actually has.
	 *
	 * A preset carries its family and its weight as two independent properties: the family arrives here,
	 * while the weight reaches the page as a `font-weight` declaration through its own binding. Asking
	 * for the family without its weight loads the upright default and leaves the browser to synthesize
	 * everything else — a heading set to 700 renders as a faked bold rather than the real face, which is
	 * the outcome narrowing the weight picker to a family's shipped weights exists to prevent.
	 *
	 * Precedence follows what actually renders. An explicit `fontVariant` on the block is a direct
	 * statement about the face and wins outright; a `fontWeight` the block sets itself comes next, since
	 * that is the weight the CSS above emits for it; the preset's own weight applies only when the block
	 * states neither.
	 *
	 * `presetFontVariant()` in `src/blocks/advancedheading/preset-font-variant.js` holds the JS twin of
	 * this mapping, so the editor's loader and this enqueue ask Google for the same face. Keep the two in
	 * step. A weight neither recognizes yields `''`, which asks for no variant and so leaves the family
	 * loading exactly as it did before this bridge existed.
	 *
	 * @since 3.8.0
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param array<string, mixed> $values     The active preset's resolved values.
	 *
	 * @return string The Google variant, or '' when nothing names a face to ask for.
	 */
	private function preset_font_variant( array $attributes, array $values ): string {
		if ( ! empty( $attributes['fontVariant'] ) ) {
			return Cast::to_string( $attributes['fontVariant'] );
		}

		$weight = ! empty( $attributes['fontWeight'] )
			? Cast::to_string( $attributes['fontWeight'] )
			: Cast::to_string( $values['fontWeight'] ?? '' );

		$weight = strtolower( trim( $weight ) );

		// `regular` rather than `400`: it is the v1 spelling the rest of this plugin already uses for the
		// upright default (see `render_font_weight()`), and the editor's `parseVariant` reads it as 400.
		if ( 'normal' === $weight || 'regular' === $weight || '400' === $weight ) {
			return 'regular';
		}

		if ( 'bold' === $weight ) {
			return '700';
		}

		return preg_match( '/^[1-9]00$/', $weight ) === 1 ? $weight : '';
	}
}

Kadence_Blocks_Advancedheading_Block::get_instance();
