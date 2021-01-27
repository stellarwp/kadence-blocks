<?php
/**
 * Creates minified css via PHP.
 *
 * @author  Carlos Rios - Edited by Ben Ritner for use in Kadence Blocks
 * @package  Kadence Blocks
 * @version  1.9
 */

/**
 * Class to create a minified css output.
 */
class Kadence_Blocks_CSS {

	/**
	 * The css selector that you're currently adding rules to
	 *
	 * @access protected
	 * @var string
	 */
	protected $_selector = '';

	/**
	 * Associative array of Google Fonts to load.
	 *
	 * Do not access this property directly, instead use the `get_google_fonts()` method.
	 *
	 * @var array
	 */
	protected static $google_fonts = array();

	/**
	 * Stores the final css output with all of its rules for the current selector.
	 *
	 * @access protected
	 * @var string
	 */
	protected $_selector_output = '';

	/**
	 * Can store a list of additional selector states which can be added and removed.
	 *
	 * @access protected
	 * @var array
	 */
	protected $_selector_states = array();

	/**
	 * Stores a list of css properties that require more formating
	 *
	 * @access private
	 * @var array
	 */
	private $_special_properties_list = array(
		'transition',
		'transition-delay',
		'transition-duration',
		'transition-property',
		'transition-timing-function',
		'flex',
		'content',
	);

	/**
	 * Stores all of the rules that will be added to the selector
	 *
	 * @access protected
	 * @var string
	 */
	protected $_css = '';

	/**
	 * The string that holds all of the css to output
	 *
	 * @access protected
	 * @var string
	 */
	protected $_output = '';

	/**
	 * Stores media queries
	 *
	 * @var null
	 */
	protected $_media_query = null;

	/**
	 * The string that holds all of the css to output inside of the media query
	 *
	 * @access protected
	 * @var string
	 */
	protected $_media_query_output = '';

	/**
	 * Sets a selector to the object and changes the current selector to a new one
	 *
	 * @access public
	 * @since  1.0
	 *
	 * @param  string $selector - the css identifier of the html that you wish to target.
	 * @return $this
	 */
	public function set_selector( $selector = '' ) {
		// Render the css in the output string everytime the selector changes.
		if ( '' !== $this->_selector ) {
			$this->add_selector_rules_to_output();
		}
		$this->_selector = $selector;
		return $this;
	}

	/**
	 * Wrapper for the set_selector method, changes the selector to add new rules
	 *
	 * @access public
	 * @since  1.0
	 *
	 * @see    set_selector()
	 * @param  string $selector the css selector.
	 * @return $this
	 */
	public function change_selector( $selector = '' ) {
		return $this->set_selector( $selector );
	}

	/**
	 * Adds a pseudo class to the selector ex. :hover, :active, :focus
	 *
	 * @access public
	 * @since  1.0
	 *
	 * @param  $state - the selector state
	 * @param  reset - if true the        $_selector_states variable will be reset
	 * @return $this
	 */
	public function add_selector_state( $state, $reset = true ) {
		if ( $reset ) {
			$this->reset_selector_states();
		}
		$this->_selector_states[] = $state;
		return $this;
	}

	/**
	 * Adds multiple pseudo classes to the selector
	 *
	 * @access public
	 * @since  1.0
	 *
	 * @param  array $states - the states you would like to add
	 * @return $this
	 */
	public function add_selector_states( $states = array() ) {
		$this->reset_selector_states();
		foreach ( $states as $state ) {
			$this->add_selector_state( $state, false );
		}
		return $this;
	}

	/**
	 * Removes the selector's pseudo classes
	 *
	 * @access public
	 * @since  1.0
	 *
	 * @return $this
	 */
	public function reset_selector_states() {
		$this->add_selector_rules_to_output();
		if ( ! empty( $this->_selector_states ) ) {
			$this->_selector_states = array();
		}
		return $this;
	}

	/**
	 * Adds a new rule to the css output
	 *
	 * @access public
	 * @since  1.0
	 *
	 * @param  string $property - the css property.
	 * @param  string $value - the value to be placed with the property.
	 * @param  string $prefix - not required, but allows for the creation of a browser prefixed property.
	 * @return $this
	 */
	public function add_rule( $property, $value, $prefix = null ) {
		$format = is_null( $prefix ) ? '%1$s:%2$s;' : '%3$s%1$s:%2$s;';
		if ( $value && ! empty( $value ) ) {
			$this->_css .= sprintf( $format, $property, $value, $prefix );
		}
		return $this;
	}

	/**
	 * Adds browser prefixed rules, and other special rules to the css output
	 *
	 * @access public
	 * @since  1.0
	 *
	 * @param  string $property - the css property
	 * @param  string $value - the value to be placed with the property
	 * @return $this
	 */
	public function add_special_rules( $property, $value ) {
		// Switch through the property types and add prefixed rules.
		switch ( $property ) {
			case 'border-top-left-radius':
				$this->add_rule( $property, $value );
				$this->add_rule( $property, $value, '-webkit-' );
				$this->add_rule( 'border-radius-topleft', $value, '-moz-' );
				break;
			case 'border-top-right-radius':
				$this->add_rule( $property, $value );
				$this->add_rule( $property, $value, '-webkit-' );
				$this->add_rule( 'border-radius-topright', $value, '-moz-' );
				break;
			case 'border-bottom-left-radius':
				$this->add_rule( $property, $value );
				$this->add_rule( $property, $value, '-webkit-' );
				$this->add_rule( 'border-radius-bottomleft', $value, '-moz-' );
				break;
			case 'border-bottom-right-radius':
				$this->add_rule( $property, $value );
				$this->add_rule( $property, $value, '-webkit-' );
				$this->add_rule( 'border-radius-bottomright', $value, '-moz-' );
				break;
			case 'background-image':
				$this->add_rule( $property, sprintf( "url('%s')", $value ) );
			break;
			case 'content':
				$this->add_rule( $property, sprintf( '%s', $value ) );
			break;
			case 'flex':
				$this->add_rule( $property, $value );
				$this->add_rule( $property, $value, '-webkit-' );
			break;
			default:
				$this->add_rule( $property, $value );
				$this->add_rule( $property, $value, '-webkit-' );
				$this->add_rule( $property, $value, '-moz-' );
			break;
		}

		return $this;
	}

	/**
	 * Adds a css property with value to the css output
	 *
	 * @access public
	 * @since  1.0
	 *
	 * @param  string $property - the css property
	 * @param  string $value - the value to be placed with the property
	 * @return $this
	 */
	public function add_property( $property, $value ) {
		if ( in_array( $property, $this->_special_properties_list ) ) {
			$this->add_special_rules( $property, $value );
		} else {
			$this->add_rule( $property, $value );
		}
		return $this;
	}

	/**
	 * Adds multiple properties with their values to the css output
	 *
	 * @access public
	 * @since  1.0
	 *
	 * @param  array $properties - a list of properties and values
	 * @return $this
	 */
	public function add_properties( $properties ) {
		foreach ( (array) $properties as $property => $value ) {
			$this->add_property( $property, $value );
		}
		return $this;
	}

	/**
	 * Sets a media query in the class
	 *
	 * @since  1.1
	 * @param  string $value
	 * @return $this
	 */
	public function start_media_query( $value ) {
		// Add the current rules to the output
		$this->add_selector_rules_to_output();

		// Add any previous media queries to the output
		if ( $this->has_media_query() ) {
			$this->add_media_query_rules_to_output();
		}

		// Set the new media query
		$this->_media_query = $value;
		return $this;
	}

	/**
	 * Stops using a media query.
	 *
	 * @see    start_media_query()
	 *
	 * @since  1.1
	 * @return $this
	 */
	public function stop_media_query() {
		return $this->start_media_query( null );
	}

	/**
	 * Gets the media query if it exists in the class
	 *
	 * @since  1.1
	 * @return string|int|null
	 */
	public function get_media_query() {
		return $this->_media_query;
	}

	/**
	 * Checks if there is a media query present in the class
	 *
	 * @since  1.1
	 * @return boolean
	 */
	public function has_media_query() {
		if ( ! empty( $this->get_media_query() ) ) {
			return true;
		}

		return false;
	}

	/**
	 * Adds the current media query's rules to the class' output variable
	 *
	 * @since  1.1
	 * @return $this
	 */
	private function add_media_query_rules_to_output() {
		if ( ! empty( $this->_media_query_output ) ) {
			$this->_output .= sprintf( '@media all and %1$s{%2$s}', $this->get_media_query(), $this->_media_query_output );

			// Reset the media query output string.
			$this->_media_query_output = '';
		}

		return $this;
	}

	/**
	 * Adds the current selector rules to the output variable
	 *
	 * @access private
	 * @since  1.0
	 *
	 * @return $this
	 */
	private function add_selector_rules_to_output() {
		if ( ! empty( $this->_css ) ) {
			$this->prepare_selector_output();
			$selector_output = sprintf( '%1$s{%2$s}', $this->_selector_output, $this->_css );

			if ( $this->has_media_query() ) {
				$this->_media_query_output .= $selector_output;
				$this->reset_css();
			} else {
				$this->_output .= $selector_output;
			}

			// Reset the css.
			$this->reset_css();
		}

		return $this;
	}

	/**
	 * Prepares the $_selector_output variable for rendering
	 *
	 * @access private
	 * @since  1.0
	 *
	 * @return $this
	 */
	private function prepare_selector_output() {
		if ( ! empty( $this->_selector_states ) ) {
			// Create a new variable to store all of the states.
			$new_selector = '';

			foreach ( (array) $this->_selector_states as $state ) {
				$format = end( $this->_selector_states ) === $state ? '%1$s%2$s' : '%1$s%2$s,';
				$new_selector .= sprintf( $format, $this->_selector, $state );
			}
			$this->_selector_output = $new_selector;
		} else {
			$this->_selector_output = $this->_selector;
		}
		return $this;
	}

	/**
	 * Generates the font family output.
	 *
	 * @param array $font an array of font settings.
	 * @return string
	 */
	public function render_font_family( $font_name, $google = false, $variant = null, $subset = null ) {
		if ( empty( $font_name ) ) {
			return false;
		}
		if ( 'inherit' === $font_name ) {
			$font_string = 'inherit';
		} else {
			$font_string = $font_name;
		}
		if ( isset( $google ) && true === $google ) {
			$this->maybe_add_google_font( $font_name, $variant, $subset );
		}
		if ( strpos( $font_string, '"') === false && strpos( $font_string, ',') === false && strpos( $font_string, ' ' ) !== false ) {
			$font_string = "'" . $font_string . "'";
		}
		return apply_filters( 'kadence_blocks_font_family_string', $font_string );
	}

	/**
	 * Generates the font output.
	 *
	 * @param array  $font an array of font settings.
	 * @param object $css an object of css output.
	 * @param string $inherit an string to determine if the font should inherit.
	 * @return string
	 */
	public function render_font( $font, $css, $inherit = null ) {
		if ( empty( $font ) ) {
			return false;
		}
		if ( ! is_array( $font ) ) {
			return false;
		}
		if ( isset( $font['style'] ) && ! empty( $font['style'] ) ) {
			$css->add_property( 'font-style', $font['style'] );
		}
		if ( isset( $font['weight'] ) && ! empty( $font['weight'] ) ) {
			$css->add_property( 'font-weight', $font['weight'] );
		}
		$size_type = ( isset( $font['sizeType'] ) && ! empty( $font['sizeType'] ) ? $font['sizeType'] : 'px' );
		if ( isset( $font['size'] ) && isset( $font['size']['desktop'] ) && ! empty( $font['size']['desktop'] ) ) {
			$css->add_property( 'font-size', $font['size']['desktop'] . $size_type );
		}
		$line_type = ( isset( $font['lineType'] ) && ! empty( $font['lineType'] ) ? $font['lineType'] : '' );
		$line_type = ( '-' !== $line_type ? $line_type : '' );
		if ( isset( $font['lineHeight'] ) && isset( $font['lineHeight']['desktop'] ) && ! empty( $font['lineHeight']['desktop'] ) ) {
			$css->add_property( 'line-height', $font['lineHeight']['desktop'] . $line_type );
		}
		$letter_type = ( isset( $font['spacingType'] ) && ! empty( $font['spacingType'] ) ? $font['spacingType'] : 'em' );
		if ( isset( $font['letterSpacing'] ) && isset( $font['letterSpacing']['desktop'] ) && ! empty( $font['letterSpacing']['desktop'] ) ) {
			$css->add_property( 'letter-spacing', $font['letterSpacing']['desktop'] . $letter_type );
		}
		$family = ( isset( $font['family'] ) && ! empty( $font['family'] ) && 'inherit' !== $font['family'] ? $font['family'] : '' );
		if ( ! empty( $family ) ) {
			if ( strpos( $family, '"') === false && strpos( $family, ',') === false && strpos( $family, ' ' ) !== false ) {
				$family = "'" . $family . "'";
			}
			$css->add_property( 'font-family', apply_filters( 'kadence_theme_font_family_string', $family ) );
			if ( isset( $font['google'] ) && true === $font['google'] ) {
				if ( ! empty( $inherit ) && 'body' === $inherit ) {
					$this->maybe_add_google_font( $font, $inherit );
				} else {
					$this->maybe_add_google_font( $font );
				}
			}
		}
		if ( isset( $font['transform'] ) && ! empty( $font['transform'] ) ) {
			$css->add_property( 'text-transform', $font['transform'] );
		}
		if ( isset( $font['color'] ) && ! empty( $font['color'] ) ) {
			$css->add_property( 'color', $this->render_color( $font['color'] ) );
		}
	}
	/**
	 * Generates the font height output.
	 *
	 * @param array  $font an array of font settings.
	 * @param string $device the device this is showing on.
	 * @return string
	 */
	public function render_font_height( $font, $device ) {
		if ( empty( $font ) ) {
			return false;
		}
		if ( ! is_array( $font ) ) {
			return false;
		}
		if ( ! isset( $font['lineHeight'] ) ) {
			return false;
		}
		if ( ! is_array( $font['lineHeight'] ) ) {
			return false;
		}
		if ( ! isset( $font['lineHeight'][ $device ] ) ) {
			return false;
		}
		if ( empty( $font['lineHeight'][ $device ] ) ) {
			return false;
		}
		$font_string = $font['lineHeight'][ $device ] . ( isset( $font['lineType'] ) && ! empty( $font['lineType'] ) ? $font['lineType'] : 'px' );

		return $font_string;
	}
	/**
	 * Outputs a string if set.
	 *
	 * @param array  $string a string setting.
	 * @param string $unit if needed add unit.
	 * @return string
	 */
	public function render_string( $string = null, $unit = null ) {
		if ( empty( $string ) ) {
			return false;
		}
		$string = $string . ( isset( $unit ) && ! empty( $unit ) ? $unit : '' );

		return $string;
	}
	/**
	 * Outputs a string if set.
	 *
	 * @param array  $number a string setting.
	 * @param string $unit if needed add unit.
	 * @return string
	 */
	public function render_number( $number = null, $unit = null ) {
		if ( ! is_numeric( $number ) ) {
			return false;
		}
		$number = $number . ( isset( $unit ) && ! empty( $unit ) ? $unit : '' );

		return $number;
	}
	/**
	 * Generates the color output.
	 *
	 * @param string $color any color attribute.
	 * @return string
	 */
	public function render_color( $color, $opacity = null ) {
		if ( empty( $color ) ) {
			return false;
		}
		if ( ! is_array( $color ) && strpos( $color, 'palette' ) === 0 ) {
			$color = 'var(--global-' . $color . ')';
		} elseif ( isset( $opacity ) && is_numeric( $opacity ) ) {
			$color = kadence_blocks_hex2rgba( $color, $opacity );
		}
		return $color;
	}
	/**
	 * Generates the size output.
	 *
	 * @param array  $size an array of size settings.
	 * @param string $device the device this is showing on.
	 * @param bool   $render_zero if 0 should be rendered or not.
	 * @return string
	 */
	public function render_range( $size, $device, $render_zero = true ) {
		if ( empty( $size ) ) {
			return false;
		}
		if ( ! is_array( $size ) ) {
			return false;
		}
		if ( ! isset( $size['size'] ) ) {
			return false;
		}
		if ( ! is_array( $size['size'] ) ) {
			return false;
		}
		if ( ! isset( $size['size'][ $device ] ) ) {
			return false;
		}
		if ( $render_zero ) {
			if ( ! is_numeric( $size['size'][ $device ] ) ) {
				return false;
			}
		} else {
			if ( empty( $size['size'][ $device ] ) ) {
				return false;
			}
		}
		$size_type   = ( isset( $size['unit'] ) && is_array( $size['unit'] ) && isset( $size['unit'][ $device ] ) && ! empty( $size['unit'][ $device ] ) ? $size['unit'][ $device ] : 'px' );
		$size_string = $size['size'][ $device ] . $size_type;

		return $size_string;
	}
	/**
	 * Generates the shadow output.
	 *
	 * @param array  $shadow an array of shadow settings.
	 * @return string
	 */
	public function render_shadow( $shadow ) {
		if ( empty( $shadow ) ) {
			return false;
		}
		if ( ! is_array( $shadow ) ) {
			return false;
		}
		if ( ! isset( $shadow['color'] ) ) {
			return false;
		}
		if ( ! isset( $shadow['opacity'] ) ) {
			return false;
		}
		if ( ! isset( $shadow['hOffset'] ) ) {
			return false;
		}
		if ( ! isset( $shadow['vOffset'] ) ) {
			return false;
		}
		if ( ! isset( $shadow['blur'] ) ) {
			return false;
		}
		if ( ! isset( $shadow['spread'] ) ) {
			return false;
		}
		if ( ! isset( $shadow['inset'] ) ) {
			return false;
		}
		if ( $shadow['inset'] ) {
			$shadow_string = 'inset ' . ( ! empty( $shadow['hOffset'] ) ? $shadow['hOffset'] : '0' ) . 'px ' . ( ! empty( $shadow['vOffset'] ) ? $shadow['vOffset'] : '0' ) . 'px ' . ( ! empty( $shadow['blur'] ) ? $shadow['blur'] : '0' ) . 'px ' . ( ! empty( $shadow['spread'] ) ? $shadow['spread'] : '0' ) . 'px ' . ( ! empty( $shadow['color'] ) ? $this->render_color( $shadow['color'], $shadow['opacity'] ) : $this->render_color( '#000000', $shadow['opacity'] ) );
		} else {
			$shadow_string =  ( ! empty( $shadow['hOffset'] ) ? $shadow['hOffset'] : '0' ) . 'px ' . ( ! empty( $shadow['vOffset'] ) ? $shadow['vOffset'] : '0' ) . 'px ' . ( ! empty( $shadow['blur'] ) ? $shadow['blur'] : '0' ) . 'px ' . ( ! empty( $shadow['spread'] ) ? $shadow['spread'] : '0' ) . 'px ' . ( ! empty( $shadow['color'] ) ? $this->render_color( $shadow['color'], $shadow['opacity'] ) : $this->render_color( '#000000', $shadow['opacity'] ) );
		}

		return $shadow_string;
	}
	/**
	 * Generates the measure output.
	 *
	 * @param array $measure an array of font settings.
	 * @return string
	 */
	public function render_measure( $measure, $unit = 'px' ) {
		if ( empty( $measure ) ) {
			return false;
		}
		if ( ! is_array( $measure ) ) {
			return false;
		}
		if ( ! isset( $measure[0] ) ) {
			return false;
		}
		if ( ! is_numeric( $measure[0] ) && ! is_numeric( $measure[1] ) && ! is_numeric( $measure[2] ) && ! is_numeric( $measure[3] ) ) {
			return false;
		}
		$size_string = ( is_numeric( $measure[0] ) ? $measure[0] : '0' ) . $unit . ' ' . ( is_numeric( $measure[1] ) ? $measure[1] : '0' ) . $unit . ' ' . ( is_numeric( $measure[2] ) ? $measure[2] : '0' ) . $unit . ' ' . ( is_numeric( $measure[3] ) ? $measure[3] : '0' ) . $unit;
		return $size_string;
	}
	/**
	 * Generates the background output.
	 *
	 * @param array  $background an array of background settings.
	 * @param object $css an object of css output.
	 */
	public function render_background( $background, $css ) {
		if ( empty( $background ) ) {
			return false;
		}
		if ( ! is_array( $background ) ) {
			return false;
		}
		$background_string = '';
		$type              = ( isset( $background['type'] ) && ! empty( $background['type'] ) ? $background['type'] : 'color' );
		$color_type        = '';
		if ( isset( $background['color'] ) && ! empty( $background['color'] ) ) {
			if ( strpos( $background['color'], 'palette' ) !== false ) {
				$color_type = 'var(--global-' . $background['color'] . ')';
			} else {
				$color_type = $background['color'];
			}
		}
		if ( 'image' === $type && isset( $background['image'] ) ) {
			$image_url = ( isset( $background['image']['url'] ) && ! empty( $background['image']['url'] ) ? $background['image']['url'] : '' );
			if ( ! empty( $image_url ) ) {
				$repeat            = ( isset( $background['image']['repeat'] ) && ! empty( $background['image']['repeat'] ) ? $background['image']['repeat'] : '' );
				$size              = ( isset( $background['image']['size'] ) && ! empty( $background['image']['size'] ) ? $background['image']['size'] : '' );
				$position          = ( isset( $background['image']['position'] ) && is_array( $background['image']['position'] ) && isset( $background['image']['position']['x'] ) && ! empty( $background['image']['position']['x'] ) && isset( $background['image']['position']['y'] ) && ! empty( $background['image']['position']['y'] ) ? ( $background['image']['position']['x'] * 100 ) . '% ' . ( $background['image']['position']['y'] * 100 ) . '%' : 'center' );
				$attachement       = ( isset( $background['image']['attachment'] ) && ! empty( $background['image']['attachment'] ) ? $background['image']['attachment'] : '' );
				$background_string = ( ! empty( $color_type ) ? $color_type . ' ' : '' ) . $image_url . ( ! empty( $repeat ) ? ' ' . $repeat : '' ) . ( ! empty( $position ) ? ' ' . $position : '' ) . ( ! empty( $size ) ? ' ' . $size : '' ) . ( ! empty( $attachement ) ? ' ' . $attachement : '' );
				$css->add_property( 'background-color', $color_type );
				$css->add_property( 'background-image', $image_url );
				$css->add_property( 'background-repeat', $repeat );
				$css->add_property( 'background-position', $position );
				$css->add_property( 'background-size', $size );
				$css->add_property( 'background-attachment', $attachement );
			} else {
				if ( ! empty( $color_type ) ) {
					$background_string = $color_type;
					$css->add_property( 'background-color', $color_type );
				}
			}
		} elseif ( 'gradient' === $type && isset( $background['gradient'] ) && ! empty( $background['gradient'] ) ) {
			$css->add_property( 'background', $background['gradient'] );
		} else {
			if ( ! empty( $color_type ) ) {
				$background_string = $color_type;
				$css->add_property( 'background', $color_type );
			}
		}
	}
	/**
	 * Generates the size output.
	 *
	 * @param array $size an array of size settings.
	 * @return string
	 */
	public function render_size( $size ) {
		if ( empty( $size ) ) {
			return false;
		}
		if ( ! is_array( $size ) ) {
			return false;
		}
		$size_number = ( isset( $size['size'] ) && ! empty( $size['size'] ) ? $size['size'] : '0' );
		$size_unit   = ( isset( $size['unit'] ) && ! empty( $size['unit'] ) ? $size['unit'] : 'em' );

		$size_string = $size_number . $size_unit;
		return $size_string;
	}
	/**
	 * Add google font to array.
	 *
	 * @param string $font_name the font name.
	 * @param string $variant the font variant.
	 * @param string $subset the font subset.
	 */
	public function maybe_add_google_font( $font_name, $font_variant = null, $subset = null ) {
		// Check if the font has been added yet.
		if ( ! array_key_exists( $font_name, self::$google_fonts ) ) {
			$add_font = array(
				'fontfamily'   => $font_name,
				'fontvariants' => ( isset( $font_variant ) && ! empty( $font_variant ) ? array( $font_variant ) : array() ),
				'fontsubsets'  => ( isset( $subset ) && ! empty( $subset ) ? array( $subset ) : array() ),
			);
			self::$google_fonts[ $font_name ] = $add_font;
		} else {
			if ( ! in_array( $font_variant, self::$google_fonts[ $font_name ]['fontvariants'], true ) ) {
				array_push( self::$google_fonts[ $font_name ]['fontvariants'], $font_variant );
			}
		}
	}

	/**
	 * Resets the css variable
	 *
	 * @access private
	 * @since  1.1
	 *
	 * @return void
	 */
	private function reset_css() {
		$this->_css = '';
		return;
	}

	/**
	 * Returns the google fonts array from the compiled css.
	 *
	 * @access public
	 * @since  1.0
	 *
	 * @return string
	 */
	public function fonts_output() {
		return self::$google_fonts;
	}

	/**
	 * Returns the minified css in the $_output variable
	 *
	 * @access public
	 * @since  1.0
	 *
	 * @return string
	 */
	public function css_output() {
		// Add current selector's rules to output
		$this->add_selector_rules_to_output();

		// Output minified css
		return $this->_output;
	}

}
