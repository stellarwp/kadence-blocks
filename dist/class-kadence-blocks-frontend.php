<?php
/**
 * Enqueue CSS/JS of all the blocks.
 *
 * @since   1.0.0
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Enqueue CSS/JS of all the blocks.
 *
 * @category class
 */
class Kadence_Blocks_Frontend {

	/**
	 * Google fonts to gnqueue
	 *
	 * @var array
	 */
	public static $gfonts = array();

	/**
	 * Instance of this class
	 *
	 * @var null
	 */
	private static $instance = null;

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
	 * Class Constructor.
	 */
	public function __construct() {
		add_action( 'enqueue_block_assets', array( $this, 'blocks_assets' ) );
		add_action( 'wp_head', array( $this, 'frontend_inline_css' ), 80 );
		add_action( 'wp_head', array( $this, 'frontend_gfonts' ), 90 );
	}
	/**
	 * Enqueue Gutenberg block assets
	 *
	 * @since 1.0.0
	 */
	public function blocks_assets() {
		// If in the backend, bail out.
		if ( is_admin() ) {
			return;
		}
		wp_enqueue_style( 'kadence-blocks-style-css', KT_BLOCKS_URL . 'dist/blocks.style.build.css', array( 'wp-blocks' ), KT_BLOCKS_VERSION );
	}
	public function frontend_gfonts() {
		if ( empty( self::$gfonts ) ) {
			return;
		}
		$print_google_fonts = apply_filters( 'kadence_blocks_print_google_fonts', true );
		if ( ! $print_google_fonts ) {
			return;
		}
		$link    = '';
		$subsets = array();
		foreach ( self::$gfonts as $key => $gfont_values ) {
			if ( ! empty( $link ) ) {
				$link .= '%7C'; // Append a new font to the string.
			}
			$link .= $gfont_values['fontfamily'];
			if ( ! empty( $gfont_values['fontvariants'] ) ) {
				$link .= ':';
				$link .= implode( ',', $gfont_values['fontvariants'] );
			}
			if ( ! empty( $gfont_values['fontsubsets'] ) ) {
				foreach ( $gfont_values['fontsubsets'] as $subset ) {
					if ( ! in_array( $subset, $subsets ) ) {
						array_push( $subsets, $subset );
					}
				}
			}
		}
		if ( ! empty( $subsets ) ) {
			$link .= '&amp;subset=' . implode( ',', $subsets );
		}
		echo '<link href="//fonts.googleapis.com/css?family=' . esc_attr( str_replace( '|', '%7C', $link ) ) . ' " rel="stylesheet">';

	}
	/**
	 * Outputs extra css for blocks.
	 */
	public function frontend_inline_css() {
		if ( function_exists( 'the_gutenberg_project' ) && has_blocks( get_the_ID() ) ) {
			global $post;
			if ( ! is_object( $post ) ) {
				return;
			}
			$blocks = gutenberg_parse_blocks( $post->post_content );
			//print_r($blocks );
			if ( ! is_array( $blocks ) || empty( $blocks ) ) {
				return;
			}
			$css  = '<style type="text/css" media="all" id="kadence-blocks-frontend">';
			foreach ( $blocks as $indexkey => $block ) {
				if ( isset( $block['blockName'] ) ) {
					if ( 'kadence/rowlayout' === $block['blockName'] ) {
						if ( isset( $block['attrs'] ) && is_array( $block['attrs'] ) ) {
							$blockattr = $block['attrs'];
							if ( isset( $blockattr['uniqueID'] ) ) {
								// Create CSS for Row/Layout.
								$unique_id = $blockattr['uniqueID'];
								$css .= $this->row_layout_css( $blockattr, $unique_id );
								if ( isset( $block['innerBlocks'] ) && ! empty( $block['innerBlocks'] ) && is_array( $block['innerBlocks'] ) ) {
									$css .= $this->column_layout_cycle( $block['innerBlocks'] , $unique_id );
								}
							}
						}
					}
					if ( 'kadence/advancedheading' === $block['blockName'] ) {
						if ( isset( $block['attrs'] ) && is_array( $block['attrs'] ) ) {
							$blockattr = $block['attrs'];
							if ( isset( $blockattr['uniqueID'] ) ) {
								// Create CSS for Advanced Heading.
								$unique_id = $blockattr['uniqueID'];
								$css .= $this->blocks_advanced_heading( $blockattr, $unique_id );
							}
						}
					}
				}
				if ( isset( $block['innerBlocks'] ) && ! empty( $block['innerBlocks'] ) && is_array( $block['innerBlocks'] ) ) {
					$css .= $this->blocks_cycle_through( $block['innerBlocks'] );
				}
			}
			$css .= '</style>';
			echo $css;
		}
	}

	/**
	 * Builds css for inner columns
	 * 
	 * @param array $inner_blocks array of inner blocks.
	 */
	public function column_layout_cycle( $inner_blocks, $unique_id ) {
		$css = '';
		foreach ( $inner_blocks as $in_indexkey => $inner_block ) {
			if ( isset( $inner_block['blockName'] ) ) {
				if ( 'kadence/column' === $inner_block['blockName'] ) {
					if ( isset( $inner_block['attrs'] ) && is_array( $inner_block['attrs'] ) ) {
						$blockattr = $inner_block['attrs'];
						$csskey = $in_indexkey + 1;
						$css .= $this->column_layout_css( $blockattr, $unique_id, $csskey );
					}
				}
			}
		}
		return $css;
	}

	/**
	 * Builds css for inner blocks
	 * 
	 * @param array $inner_blocks array of inner blocks.
	 */
	function blocks_cycle_through( $inner_blocks ) {
		$css = '';
		foreach ( $inner_blocks as $in_indexkey => $inner_block ) {
			if ( isset( $inner_block['blockName'] ) ) {
				if ( 'kadence/rowlayout' === $inner_block['blockName'] ) {
					if ( isset( $inner_block['attrs'] ) && is_array( $inner_block['attrs'] ) ) {
						$blockattr = $inner_block['attrs'];
						if ( isset( $blockattr['uniqueID'] ) ) {
							// Create CSS for Row/Layout.
							$unique_id = $blockattr['uniqueID'];
							$css .= $this->row_layout_css( $blockattr, $unique_id );
						}
					}
				}
				if ( 'kadence/advancedheading' === $inner_block['blockName'] ) {
					if ( isset( $inner_block['attrs'] ) && is_array( $inner_block['attrs'] ) ) {
						$blockattr = $inner_block['attrs'];
						if ( isset( $blockattr['uniqueID'] ) ) {
							// Create CSS for Advanced Heading.
							$unique_id = $blockattr['uniqueID'];
							$css .= $this->blocks_advanced_heading( $blockattr, $unique_id );
						}
					}
				}
			}
			if ( isset( $inner_block['innerBlocks'] ) && ! empty( $inner_block['innerBlocks'] ) && is_array( $inner_block['innerBlocks'] ) ) {
				$css .= $this->blocks_cycle_through( $inner_block['innerBlocks'] );
			}
		}
		return $css;
	}
	/**
	 * Builds CSS for Advanced Heading block.
	 * 
	 * @param array  $attr the blocks attr.
	 * @param string $unique_id the blocks attr ID.
	 */
	function blocks_advanced_heading( $attr, $unique_id ) {
		$css = '';
		if ( isset( $attr['size'] ) || isset( $attr['lineHeight'] ) || isset( $attr['typography'] ) ) {
			$css .= '#kt-adv-heading' . $unique_id . ' {';
			if ( isset( $attr['size'] ) && ! empty( $attr['size'] ) ) {
				$css .= 'font-size:' . $attr['size'] . ( ! isset( $attr['sizeType'] ) ? 'px' : $attr['sizeType'] ) . ';';
			}
			if ( isset( $attr['lineHeight'] ) && ! empty( $attr['lineHeight'] ) ) {
				$css .= 'line-height:' . $attr['lineHeight'] . ( ! isset( $attr['lineType'] ) ? 'px' : $attr['lineType'] ) . ';';
			}
			if ( isset( $attr['typography'] ) && ! empty( $attr['typography'] ) ) {
				$css .= 'font-family:' . $attr['typography'] . ';';
			}
			$css .= '}';
		}
		if ( isset( $attr['googleFont'] ) && $attr['googleFont'] && ( ! isset( $attr['loadGoogleFont'] ) || $attr['loadGoogleFont'] == true ) && isset( $attr['typography'] ) ) {
			// Check if the font has been added yet
			if ( ! in_array( $attr['typography'], self::$gfonts, true ) ) {
				$add_font = array(
					'fontfamily' => $attr['typography'],
					'fontvariants' => ( isset( $attr['fontVariant'] ) && ! empty( $attr['fontVariant'] ) ? array( $attr['fontVariant'] ) : array() ),
					'fontsubsets' => ( isset( $attr['fontSubset'] ) && !empty( $attr['fontSubset'] ) ? array( $attr['fontSubset'] ) : array() ),
				);
				self::$gfonts[$attr['typography']] = $add_font;
			} else {
				if ( ! in_array( $attr['fontVariant'], self::$gfonts[ $attr['typography'] ]['fontvariants'], true ) ) {
					self::$gfonts[ $attr['typography'] ]['fontvariants'] = $attr['fontVariant'];
				}
				if ( ! in_array( $attr['fontSubset'], self::$gfonts[ $attr['typography'] ]['fontsubsets'], true ) ) {
					self::$gfonts[ $attr['typography'] ]['fontsubsets'] = $attr['fontSubset'];
				}
			}
		}
		if ( isset( $attr['tabSize'] ) || isset( $attr['tabLineHeight'] ) ) {
			$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
				$css .= '#kt-adv-heading' . $unique_id . ' {';
					if ( isset( $attr['tabSize'] ) ) {
						$css .= 'font-size:' . $attr['tabSize'] . ( ! isset( $attr['sizeType'] ) ? 'px' : $attr['sizeType'] ) . ';';
					}
					if ( isset( $attr['tabLineHeight'] ) ) {
						$css .= 'line-height:' . $attr['tabLineHeight'] . ( ! isset( $attr['lineType'] ) ? 'px' : $attr['lineType'] ) . ';';
					}
				$css .= '}';
			$css .= '}';
		}
		if ( isset( $attr['mobileSize'] ) || isset( $attr['mobileLineHeight'] ) ) {
			$css .= '@media (max-width: 767px) {';
				$css .= '#kt-adv-heading' . $unique_id . ' {';
					if ( isset( $attr['mobileSize'] ) ) {
						$css .= 'font-size:' . $attr['mobileSize'] . ( ! isset( $attr['sizeType'] ) ? 'px' : $attr['sizeType'] ) . ';';
					}
					if ( isset( $attr['mobileLineHeight'] ) ) {
						$css .= 'line-height:' . $attr['mobileLineHeight'] . ( ! isset( $attr['lineType'] ) ? 'px' : $attr['lineType'] ) . ';';
					}
				$css .= '}';
			$css .= '}';
		}
		return $css;
	}

	/**
	 * Builds Css for row layout block.
	 * 
	 * @param array  $attr the blocks attr.
	 * @param string $unique_id the blocks attr ID.
	 */
	function row_layout_css( $attr, $unique_id ) {
		$css = '';
		if ( isset( $attr['bgColor'] ) || isset( $attr['bgImg'] ) || isset( $attr['topMargin'] ) || isset( $attr['bottomMargin'] ) ) {
			$css .= '#kt-layout-id' . $unique_id . ' {';
			if ( isset( $attr['topMargin'] ) ) {
				$css .= 'margin-top:' . $attr['topMargin'] . 'px;';
			}
			if ( isset( $attr['bottomMargin'] ) ) {
				$css .= 'margin-bottom:' . $attr['bottomMargin'] . 'px;';
			}
			if ( isset( $attr['bgColor'] ) ) {
				$css .= 'background-color:' . $attr['bgColor'] . ';';
			}
			if ( isset( $attr['bgImg'] ) ) {
				$css .= 'background-image:url(' . $attr['bgImg'] . ');';
				$css .= 'background-size:' . ( isset( $attr['bgImgSize'] ) ? $attr['bgImgSize'] : 'cover' ) . ';';
				$css .= 'background-position:' . ( isset( $attr['bgImgPosition'] ) ? $attr['bgImgPosition'] : 'center center' ) . ';';
				$css .= 'background-attachment:' . ( isset( $attr['bgImgAttachment'] ) ? $attr['bgImgAttachment'] : 'scroll' ) . ';';
				$css .= 'background-repeat:' . ( isset( $attr['bgImgRepeat'] ) ? $attr['bgImgRepeat'] : 'no-repeat' ) . ';';
			}
			$css .= '}';
		}
		if ( isset( $attr['topPadding'] ) || isset( $attr['bottomPadding'] ) || isset( $attr['leftPadding'] ) || isset( $attr['rightPadding'] ) || isset( $attr['minHeight'] ) ||  isset( $attr['maxWidth'] ) ) {
			$css .= '#kt-layout-id' . $unique_id . ' > .kt-row-column-wrap {';
				if ( isset( $attr['topPadding'] ) ) {
					$css .= 'padding-top:' . $attr['topPadding'] . 'px;';
				}
				if ( isset( $attr['bottomPadding'] ) ) {
					$css .= 'padding-bottom:' . $attr['bottomPadding'] . 'px;';
				}
				if ( isset( $attr['leftPadding'] ) ) {
					$css .= 'padding-left:' . $attr['leftPadding'] . 'px;';
				}
				if ( isset( $attr['rightPadding'] ) ) {
					$css .= 'padding-right:' . $attr['rightPadding'] . 'px;';
				}
				if ( isset( $attr['minHeight'] ) ) {
					$css .= 'min-height:' . $attr['minHeight'] . 'px;';
				}
				if ( isset( $attr['maxWidth'] ) ) {
					$css .= 'max-width:' . $attr['maxWidth'] . 'px;';
					$css .= 'margin-left:auto;';
					$css .= 'margin-right:auto;';
				}
			$css .= '}';
		}
		if ( isset( $attr['overlay'] ) || isset( $attr['overlayBgImg'] ) || isset( $attr['overlaySecond'] ) ) {
			$css .= '#kt-layout-id' . $unique_id . ' > .kt-row-layout-overlay {';
				if ( isset( $attr['overlayOpacity'] ) ) {
					if ( $attr['overlayOpacity'] < 10 ) {
						$css .= 'opacity:0.0' . $attr['overlayOpacity'] . ';';
					} else if ( $attr['overlayOpacity'] >= 100 ) {
						$css .= 'opacity:1;';
					} else {
						$css .= 'opacity:0.' . $attr['overlayOpacity'] . ';';
					}
				}
				if ( isset( $attr['currentOverlayTab'] ) && 'grad' == $attr['currentOverlayTab'] ) {
					$type = ( isset( $attr['overlayGradType'] ) ? $attr['overlayGradType'] : 'linear');
					if ( 'radial' === $type ) {
						$angle = ( isset( $attr['overlayBgImgPosition'] ) ? 'at ' . $attr['overlayBgImgPosition'] : 'at center center' );
					} else {
						$angle = ( isset( $attr['overlayGradAngle'] ) ? $attr['overlayGradAngle'] . 'deg' : '180deg');
					}
					$loc = ( isset( $attr['overlayGradLoc'] ) ? $attr['overlayGradLoc'] : '0');
					$color = ( isset( $attr['overlay'] ) ? $attr['overlay'] : 'transparent');
					$locsecond = ( isset( $attr['overlayGradLocSecond'] ) ? $attr['overlayGradLocSecond'] : '100');
					$colorsecond = ( isset( $attr['overlaySecond'] ) ? $attr['overlaySecond'] : '#00B5E2');
					$css .= 'background-image: ' . $type . '-gradient(' . $angle. ', ' . $color . ' ' . $loc . '%, ' . $colorsecond . ' ' . $locsecond . '%);';
				} else {
					if ( isset( $attr['overlay'] ) ) {
						$css .= 'background-color:' . $attr['overlay'] . ';';
					}
					if ( isset( $attr['overlayBgImg'] ) ) {
						$css .= 'background-image:url(' . $attr['overlayBgImg'] . ');';
						$css .= 'background-size:' . ( isset( $attr['overlayBgImgSize'] ) ? $attr['overlayBgImgSize'] : 'cover' ) . ';';
						$css .= 'background-position:' . ( isset( $attr['overlayBgImgPosition'] ) ? $attr['overlayBgImgPosition'] : 'center center' ) . ';';
						$css .= 'background-attachment:' . ( isset( $attr['overlayBgImgAttachment'] ) ? $attr['overlayBgImgAttachment'] : 'scroll' ) . ';';
						$css .= 'background-repeat:' . ( isset( $attr['overlayBgImgRepeat'] ) ? $attr['overlayBgImgRepeat'] : 'no-repeat' ) . ';';
					}
				}
				if ( isset( $attr['overlayBlendMode'] ) ) {
					$css .= 'mix-blend-mode:' . $attr['overlayBlendMode'] . ';';
				}
			$css .= '}';
		}
		if ( isset( $attr['topPaddingM'] ) || isset( $attr['bottomPaddingM'] ) || isset( $attr['leftPaddingM'] ) || isset( $attr['rightPaddingM'] ) || isset( $attr['topMarginM'] ) || isset( $attr['bottomMarginM'] ) ) {
			$css .= '@media (max-width: 767px) {';
				if ( isset( $attr['topMarginM'] ) || isset( $attr['bottomMarginM'] ) ) {
					$css .= '#kt-layout-id' . $unique_id . ' {';
						if ( isset( $attr['topMarginM'] ) ) {
							$css .= 'margin-top:' . $attr['topMarginM'] . 'px;';
						}
						if ( isset( $attr['bottomMarginM'] ) ) {
							$css .= 'margin-bottom:' . $attr['bottomMarginM'] . 'px;';
						}
					$css .= '}';
				}
				if ( isset( $attr['topPaddingM'] ) || isset( $attr['bottomPaddingM'] ) || isset( $attr['leftPaddingM'] ) || isset( $attr['rightPaddingM'] ) ) {
					$css .= '#kt-layout-id' . $unique_id . ' > .kt-row-column-wrap {';
					if ( isset( $attr['topPaddingM'] ) ) {
						$css .= 'padding-top:' . $attr['topPaddingM'] . 'px;';
					}
					if ( isset( $attr['bottomPaddingM'] ) ) {
						$css .= 'padding-bottom:' . $attr['bottomPaddingM'] . 'px;';
					}
					if ( isset( $attr['leftPaddingM'] ) ) {
						$css .= 'padding-left:' . $attr['leftPaddingM'] . 'px;';
					}
					if ( isset( $attr['rightPaddingM'] ) ) {
						$css .= 'padding-right:' . $attr['rightPaddingM'] . 'px;';
					}
					$css .= '}';
				}
			
			$css .= '}';
		}
		return $css;
	}
	/**
	 * Builds CSS for column layout block.
	 * 
	 * @param array  $attr the blocks attr.
	 * @param string $unique_id the blocks parent attr ID.
	 * @param number $column_key the blocks key.
	 */
	function column_layout_css( $attr, $unique_id, $column_key ) {
		$css = '';
		if ( isset( $attr['topPadding'] ) || isset( $attr['bottomPadding'] ) || isset( $attr['leftPadding'] ) || isset( $attr['rightPadding'] ) || isset( $attr['topMargin'] ) || isset( $attr['bottomMargin'] ) ) {
			$css .= '#kt-layout-id' . $unique_id . ' > .kt-row-column-wrap > .inner-column-' . $column_key . ' > .kt-inside-inner-col {';
				if ( isset( $attr['topPadding'] ) ) {
					$css .= 'padding-top:' . $attr['topPadding'] . 'px;';
				}
				if ( isset( $attr['bottomPadding'] ) ) {
					$css .= 'padding-bottom:' . $attr['bottomPadding'] . 'px;';
				}
				if ( isset( $attr['leftPadding'] ) ) {
					$css .= 'padding-left:' . $attr['leftPadding'] . 'px;';
				}
				if ( isset( $attr['rightPadding'] ) ) {
					$css .= 'padding-right:' . $attr['rightPadding'] . 'px;';
				}
				if ( isset( $attr['topMargin'] ) ) {
					$css .= 'margin-top:' . $attr['topMargin'] . 'px;';
				}
				if ( isset( $attr['bottomMargin'] ) ) {
					$css .= 'margin-bottom:' . $attr['bottomMargin'] . 'px;';
				}
			$css .= '}';
		}
		if ( isset( $attr['topPaddingM'] ) || isset( $attr['bottomPaddingM'] ) || isset( $attr['leftPaddingM'] ) || isset( $attr['rightPaddingM'] ) || isset( $attr['topMarginM'] ) || isset( $attr['bottomMarginM'] ) ) {
			$css .= '@media (max-width: 767px) {';
				$css .= '#kt-layout-id' . $unique_id . ' > .kt-row-column-wrap > .inner-column-' . $column_key . ' > .kt-inside-inner-col {';
				if ( isset( $attr['topPaddingM'] ) ) {
					$css .= 'padding-top:' . $attr['topPaddingM'] . 'px;';
				}
				if ( isset( $attr['bottomPaddingM'] ) ) {
					$css .= 'padding-bottom:' . $attr['bottomPaddingM'] . 'px;';
				}
				if ( isset( $attr['leftPaddingM'] ) ) {
					$css .= 'padding-left:' . $attr['leftPaddingM'] . 'px;';
				}
				if ( isset( $attr['rightPaddingM'] ) ) {
					$css .= 'padding-right:' . $attr['rightPaddingM'] . 'px;';
				}
				if ( isset( $attr['topMarginM'] ) ) {
					$css .= 'margin-top:' . $attr['topMarginM'] . 'px;';
				}
				if ( isset( $attr['bottomMarginM'] ) ) {
					$css .= 'margin-bottom:' . $attr['bottomMarginM'] . 'px;';
				}
				$css .= '}';		
			$css .= '}';
		}
		return $css;
	}
}
Kadence_Blocks_Frontend::get_instance();