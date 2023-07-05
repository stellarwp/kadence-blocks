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
	 * CSS to enqueue
	 *
	 * @var array
	 */
	public static $styles = array();

	/**
	 * CSS to enqueue
	 *
	 * @var array
	 */
	public static $head_styles = array();

	/**
	 * CSS to enqueue
	 *
	 * @var array
	 */
	public static $custom_styles = array();

	/**
	 * The css group id.
	 *
	 * @access protected
	 * @var string
	 */
	protected $_style_id = '';

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
	 * The array that holds all of the css to output inside of the tablet media query
	 *
	 * @access protected
	 * @var array
	 */
	protected $_tablet_media_query = array();

	/**
	 * The array that holds all of the css to output inside of the tablet media query
	 *
	 * @access protected
	 * @var array
	 */
	protected $_tablet_only_media_query = array();

	/**
	 * The array that holds all of the css to output inside of the tablet media query
	 *
	 * @access protected
	 * @var array
	 */
	protected $_desktop_only_media_query = array();

	/**
	 * The array that holds all of the css to output inside of the mobile media query
	 *
	 * @access protected
	 * @var array
	 */
	protected $_mobile_media_query = array();

	/**
	 * The array that holds all of the css to output inside of the mobile media query
	 *
	 * @access protected
	 * @var array
	 */
	protected $_media_state = 'desktop';

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
	 * Stores all of the custom css.
	 *
	 * @access protected
	 * @var string
	 */
	protected $_css_string = '';

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
	 * Stores media queries
	 *
	 * @var null
	 */
	protected $media_queries = null;

	/**
	 * The singleton instance
	 */
	private static $instance = null;

	/**
	 * Spacing variables used in string based padding / margin.
	 */
	protected $spacing_sizes = array(
		'xxs' => 'var(--global-kb-spacing-xxs, 0.5rem)',
		'xs' => 'var(--global-kb-spacing-xs, 1rem)',
		'sm' => 'var(--global-kb-spacing-sm, 1.5rem)',
		'md' => 'var(--global-kb-spacing-md, 2rem)',
		'lg' => 'var(--global-kb-spacing-lg, 3rem)',
		'xl' => 'var(--global-kb-spacing-xl, 4rem)',
		'xxl' => 'var(--global-kb-spacing-xxl, 5rem)',
		'3xl' => 'var(--global-kb-spacing-3xl, 6.5rem)',
		'4xl' => 'var(--global-kb-spacing-4xl, 8rem)',
		'5xl' => 'var(--global-kb-spacing-5xl, 10rem)'
	);
	/**
	 * Font size variables used in string based font sizes.
	 */
	protected $font_sizes = array(
		'sm' => 'var(--global-kb-font-size-sm, 0.9rem)',
		'md' => 'var(--global-kb-font-size-md, 1.25rem)',
		'lg' => 'var(--global-kb-font-size-lg, 2rem)',
		'xl' => 'var(--global-kb-font-size-xl, 3rem)',
		'xxl' => 'var(--global-kb-font-size-xxl, 4rem)',
		'3xl' => 'var(--global-kb-font-size-xxxl, 5rem)',
	);
	/**
	 * Gaps variables used in string based gutters.
	 */
	protected $gap_sizes = array(
		'none' => 'var(--global-kb-gap-none, 0 )',
		'skinny' => 'var(--global-kb-gap-sm, 1rem)',
		'narrow' => '20px',
		'wide' => '40px',
		'widest' => '80px',
		'default' => 'var(--global-kb-gap-md, 2rem)',
		'wider' => 'var(--global-kb-gap-lg, 4rem)',
		'xs' => 'var(--global-kb-gap-xs, 0.5rem )',
		'sm' => 'var(--global-kb-gap-sm, 1rem)',
		'md' => 'var(--global-kb-gap-md, 2rem)',
		'lg' => 'var(--global-kb-gap-lg, 4rem)',
	);

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
		add_action( 'wp_enqueue_scripts', array( $this, 'frontend_block_css' ), 180 );
	}

	/**
	 * Render block CSS helper function
	 */
	public function frontend_block_css() {
		if ( ! empty( self::$styles ) ) {
			self::$head_styles = self::$styles;
			$output = '';
			foreach ( self::$styles as $key => $value ) {
				$output .= $value;
			}
			$custom_output = '';
			if ( ! empty( self::$custom_styles ) && is_array( self::$custom_styles ) ) {
				foreach ( self::$custom_styles as $c_key => $c_value ) {
					$custom_output .= $c_value;
				}
			}
			if ( ! empty( $output ) ) {
				wp_register_style( 'kadence_blocks_css', false );
				wp_enqueue_style( 'kadence_blocks_css' );
				wp_add_inline_style( 'kadence_blocks_css', $output );
			}
			if ( ! empty( $custom_output ) ) {
				wp_register_style( 'kadence_blocks_custom_css', false );
				wp_enqueue_style( 'kadence_blocks_custom_css' );
				wp_add_inline_style( 'kadence_blocks_custom_css', $custom_output );
			}
		}
	}
	/**
	 * Sets a style id to keep a record of rendering.
	 *
	 * @access public
	 * @since  1.0
	 *
	 * @param  string $style_id - the css group id.
	 * @return $this
	 */
	public function set_style_id( $style_id = '' ) {
		if ( empty( $style_id ) ) {
			return;
		}
		// Render the css in the output string everytime the style_id changes.
		if ( ! isset( self::$styles[ $style_id ] ) ) {
			self::$styles[ $style_id ] = '';
		}
		$this->_style_id = $style_id;
		return $this;
	}

	/**
	 * Sets a style id to keep a record of rendering.
	 *
	 * @access public
	 * @since  1.0
	 *
	 * @param  string $style_id - the css group id.
	 * @return $this
	 */
	public function has_styles( $style_id = '' ) {
		if ( empty( $style_id ) ) {
			return false;
		}
		if ( isset( self::$styles[ $style_id ] ) ) {
			return true;
		}
		return false;
	}
	/**
	 * Sets a style id to keep a record of rendering.
	 *
	 * @access public
	 * @since  1.0
	 *
	 * @param  string $style_id - the css group id.
	 * @return $this
	 */
	public function has_header_styles( $style_id = '' ) {
		if ( empty( $style_id ) ) {
			return false;
		}
		if ( isset( self::$head_styles[ $style_id ] ) ) {
			return true;
		}
		return false;
	}
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
	 * Sets css string for final output.
	 *
	 * @param  string $string - the css string.
	 * @return $this
	 */
	public function add_css_string( $string ) {
		$string = str_replace( PHP_EOL, '', trim( $string ) );
		$this->_css_string .= $string;
		return $this;
	}
	/**
	 * Get media queries.
	 *
	 * @param  string $device - the device size.
	 * @return $this
	 */
	public function get_media_queries( $device ) {
		if ( ! isset( $this->media_queries[ $device ] ) ) {
			$media_query            = array();
			$media_query['mobile']  = apply_filters( 'kadence_mobile_media_query', '(max-width: 767px)' );
			$media_query['tablet']  = apply_filters( 'kadence_tablet_media_query', '(max-width: 1024px)' );
			$media_query['desktop'] = apply_filters( 'kadence_desktop_media_query', '(min-width: 1025px)' );
			$media_query['mobileReverse'] = apply_filters( 'kadence_mobile_reverse_media_query', '(min-width: 768px)' );
			$media_query['tabletOnly']    = apply_filters( 'kadence_tablet_only_media_query', '(min-width: 768px) and (max-width: 1024px)' );
			$this->media_queries    = $media_query;
		}
		return isset( $this->media_queries[ $device ] ) ? $this->media_queries[ $device ] : '';
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
	 * Check to see if variable contains a number including 0.
	 *
	 * @access public
	 *
	 * @param  string $value - the css property.
	 * @return boolean
	 */
	public function is_number( &$value ) {
		return isset( $value ) && is_numeric( $value );
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
			if ( 'mobile' === $this->_media_state ) {
				if ( ! isset( $this->_mobile_media_query[ $this->_selector ] ) ) {
					$this->_mobile_media_query[ $this->_selector ] = '';
				}
				$this->_mobile_media_query[ $this->_selector ] .= sprintf( $format, $property, $value, $prefix );
			} elseif ( 'tablet' === $this->_media_state ) {
				if ( ! isset( $this->_tablet_media_query[ $this->_selector ] ) ) {
					$this->_tablet_media_query[ $this->_selector ] = '';
				}
				$this->_tablet_media_query[ $this->_selector ] .= sprintf( $format, $property, $value, $prefix );
			} elseif ( 'tabletOnly' === $this->_media_state ) {
				if ( ! isset( $this->_tablet_only_media_query[ $this->_selector ] ) ) {
					$this->_tablet_only_media_query[ $this->_selector ] = '';
				}
				$this->_tablet_only_media_query[ $this->_selector ] .= sprintf( $format, $property, $value, $prefix );
			} elseif ( 'desktopOnly' === $this->_media_state ) {
				if ( ! isset( $this->_desktop_only_media_query[ $this->_selector ] ) ) {
					$this->_desktop_only_media_query[ $this->_selector ] = '';
				}
				$this->_desktop_only_media_query[ $this->_selector ] .= sprintf( $format, $property, $value, $prefix );
			} else {
				$this->_css .= sprintf( $format, $property, $value, $prefix );
			}
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
				$this->add_rule( $property, $value, '-webkit-' );
				$this->add_rule( $property, $value );
				break;
			case 'border-top-right-radius':
				$this->add_rule( $property, $value, '-webkit-' );
				$this->add_rule( $property, $value );
				break;
			case 'border-bottom-left-radius':
				$this->add_rule( $property, $value, '-webkit-' );
				$this->add_rule( $property, $value );
				break;
			case 'border-bottom-right-radius':
				$this->add_rule( $property, $value, '-webkit-' );
				$this->add_rule( $property, $value );
				break;
			case 'background-image':
				$this->add_rule( $property, sprintf( "url('%s')", $value ) );
				break;
			case 'content':
				$this->add_rule( $property, sprintf( '%s', $value ) );
				break;
			case 'flex':
				$this->add_rule( $property, $value, '-webkit-' );
				$this->add_rule( $property, $value );
				break;
			default:
				$this->add_rule( $property, $value, '-webkit-' );
				$this->add_rule( $property, $value, '-moz-' );
				$this->add_rule( $property, $value );
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
	public function add_property( $property, $value = null ) {
		if ( null === $value ) {
			return $this;
		}
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
	 * Sets a media query in the class
	 *
	 * @since  1.1
	 * @param  string $value
	 * @return $this
	 */
	public function set_media_state( $value ) {
		// Set the new media query
		$this->_media_state = $value;
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
		return apply_filters( 'kadence_blocks_font_family_string', $font_string, $font_name );
	}

	/**
	 * Generates the font family output.
	 *
	 * @param array $font an array of font settings.
	 * @return string
	 */
	public function render_font_weight( $weight ) {
		if ( empty( $weight ) ) {
			return false;
		}
		if ( 'inherit' === $weight ) {
			return false;
		}
		if ( 'regular' === $weight ) {
			$weight_string = 'normal';
		} else {
			$weight_string = $weight;
		}
		return $weight_string;
	}
	/**
	 * Generates the font output.
	 *
	 * @param array  $attributes an array of attributes.
	 * @param string $name the key for attributes of font.
	 * @param string $inherit an string to determine if the font should inherit.
	 * @return string
	 */
	public function render_typography( $attributes, $name = 'typography', $inherit = null ) {
		if ( empty( $attributes ) ) {
			return false;
		}
		if ( ! empty( $name ) && ! isset( $attributes[ $name ] ) ) {
			return false;
		}
		if ( ! empty( $name ) ) {
			$font = $attributes[ $name ];
		} elseif ( empty( $name ) ) {
			$font = $attributes;
		}
		if ( empty( $font ) ) {
			return false;
		}
		if ( ! is_array( $font ) ) {
			return false;
		}
		if ( isset( $font[0] ) && is_array( $font[0] ) && ! empty( $font[0] ) ) {
			$font = $font[0];
		}
		if ( isset( $font['style'] ) && ! empty( $font['style'] ) ) {
			$this->add_property( 'font-style', $font['style'] );
		}
		if ( isset( $font['weight'] ) && ! empty( $font['weight'] ) ) {
			$this->add_property( 'font-weight', $font['weight'] );
		}
		$size_type = ( isset( $font['sizeType'] ) && ! empty( $font['sizeType'] ) ? $font['sizeType'] : 'px' );
		$line_type = ( isset( $font['lineType'] ) ? $font['lineType'] : '' );
		$line_type = ( '-' !== $line_type ? $line_type : '' );
		$letter_type = ( isset( $font['letterSpacingType'] ) && ! empty( $font['letterSpacingType'] ) ? $font['letterSpacingType'] : 'px' );
		if ( isset( $font['size'] ) && isset( $font['size'][0] ) && ! empty( $font['size'][0] ) ) {
			$this->add_property( 'font-size', $this->get_font_size( $font['size'][0], $size_type ) );
		}
		if ( isset( $font['lineHeight'] ) && isset( $font['lineHeight']['desktop'] ) && ! empty( $font['lineHeight']['desktop'] ) ) {
			$this->add_property( 'line-height', $font['lineHeight']['desktop'] . $line_type );
		}
		// Numeric array.
		if ( isset( $font['lineHeight'] ) && isset( $font['lineHeight'][0] ) && ! empty( $font['lineHeight'][0] ) ) {
			$this->add_property( 'line-height', $font['lineHeight'][0] . $line_type );
		}
		if ( isset( $font['letterSpacing'] ) && is_array( $font['letterSpacing'] ) ) {
			if ( isset( $font['letterSpacing']['desktop'] ) && is_numeric( $font['letterSpacing']['desktop'] ) ) {
				$this->add_property( 'letter-spacing', $font['letterSpacing']['desktop'] . $letter_type );
			}
			if ( isset( $font['letterSpacing'][0] ) && is_numeric( $font['letterSpacing'][0] ) ) {
				$this->add_property( 'letter-spacing', $font['letterSpacing'][0] . $letter_type );
			}
		} elseif ( isset( $font['letterSpacing'] ) && is_numeric( $font['letterSpacing'] ) ) {
			$this->add_property( 'letter-spacing', $font['letterSpacing'] . $letter_type );
		}
		$family = ( isset( $font['family'] ) && ! empty( $font['family'] ) && 'inherit' !== $font['family'] ? $font['family'] : '' );
		if ( ! empty( $family ) ) {
			$google = isset( $font['google'] ) && $font['google'] ? true : false;
			$google = $google && ( isset( $font['loadGoogle'] ) && $font['loadGoogle'] || ! isset( $font['loadGoogle'] ) ) ? true : false;
			$this->add_property( 'font-family', $this->render_font_family( $font['family'], $google, ( isset( $font['variant'] ) ? $font['variant'] : '' ), ( isset( $font['subset'] ) ? $font['subset'] : '' ) ) );
		}
		if ( isset( $font['textTransform'] ) && ! empty( $font['textTransform'] ) ) {
			$this->add_property( 'text-transform', $font['textTransform'] );
		}
		if ( isset( $font['color'] ) && ! empty( $font['color'] ) ) {
			$this->add_property( 'color', $this->sanitize_color( $font['color'] ) );
		}
		// Tablet.
		$this->set_media_state( 'tablet' );
		if ( isset( $font['size'] ) && isset( $font['size'][1] ) && ! empty( $font['size'][1] ) ) {
			$this->add_property( 'font-size', $this->get_font_size( $font['size'][1], $size_type ) );
		}
		if ( isset( $font['lineHeight'] ) && isset( $font['lineHeight']['tablet'] ) && ! empty( $font['lineHeight']['tablet'] ) ) {
			$this->add_property( 'line-height', $font['lineHeight']['tablet'] . $line_type );
		}
		if ( isset( $font['lineHeight'] ) && isset( $font['lineHeight'][1] ) && ! empty( $font['lineHeight'][1] ) ) {
			$this->add_property( 'line-height', $font['lineHeight'][1] . $line_type );
		}
		if ( isset( $font['letterSpacing'] ) && isset( $font['letterSpacing']['tablet'] ) && is_numeric( $font['letterSpacing']['tablet'] ) ) {
			$this->add_property( 'letter-spacing', $font['letterSpacing']['tablet'] . $letter_type );
		}
		if ( isset( $font['letterSpacing'] ) && isset( $font['letterSpacing'][1] ) && is_numeric( $font['letterSpacing'][1] ) ) {
			$this->add_property( 'letter-spacing', $font['letterSpacing'][1] . $letter_type );
		}
		// Mobile.
		$this->set_media_state( 'mobile' );
		if ( isset( $font['size'] ) && isset( $font['size'][2] ) && ! empty( $font['size'][2] ) ) {
			$this->add_property( 'font-size', $this->get_font_size( $font['size'][2], $size_type ) );
		}
		if ( isset( $font['lineHeight'] ) && isset( $font['lineHeight']['mobile'] ) && ! empty( $font['lineHeight']['mobile'] ) ) {
			$this->add_property( 'line-height', $font['lineHeight']['mobile'] . $line_type );
		}
		if ( isset( $font['lineHeight'] ) && isset( $font['lineHeight'][2] ) && ! empty( $font['lineHeight'][2] ) ) {
			$this->add_property( 'line-height', $font['lineHeight'][2] . $line_type );
		}
		if ( isset( $font['letterSpacing'] ) && isset( $font['letterSpacing']['mobile'] ) && is_numeric( $font['letterSpacing']['mobile'] ) ) {
			$this->add_property( 'letter-spacing', $font['letterSpacing']['mobile'] . $letter_type );
		}
		if ( isset( $font['letterSpacing'] ) && isset( $font['letterSpacing'][2] ) && is_numeric( $font['letterSpacing'][2] ) ) {
			$this->add_property( 'letter-spacing', $font['letterSpacing'][2] . $letter_type );
		}
		$this->set_media_state( 'desktop' );
	}
	/**
	 * Generates the font output.
	 *
	 * @param array  $font an array of font settings.
	 * @param object $css an object of css output.
	 * @param string $inherit an string to determine if the font should inherit.
	 * @return string
	 */
	public function get_font_size( $size, $unit ) {
		if ( $this->is_variable_font_size_value( $size ) ) {
			return $this->get_variable_font_size_value( $size );
		}
		return $size . $unit;
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
			$css->add_property( 'font-size', $this->get_font_size( $font['size']['desktop'], $size_type ) );
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
			switch ( $color ) {
				case 'palette2':
					$fallback = '#2B6CB0';
					break;
				case 'palette3':
					$fallback = '#1A202C';
					break;
				case 'palette4':
					$fallback = '#2D3748';
					break;
				case 'palette5':
					$fallback = '#4A5568';
					break;
				case 'palette6':
					$fallback = '#718096';
					break;
				case 'palette7':
					$fallback = '#EDF2F7';
					break;
				case 'palette8':
					$fallback = '#F7FAFC';
					break;
				case 'palette9':
					$fallback = '#ffffff';
					break;
				default:
					$fallback = '#3182CE';
					break;
			}
			$color = 'var(--global-' . $color . ', ' . $fallback . ')';
		} elseif ( isset( $opacity ) && is_numeric( $opacity ) && 1 !== (int) $opacity ) {
			$color = kadence_blocks_hex2rgba( $color, $opacity );
		}
		return $color;
	}
	/**
	 * Generates the color output.
	 *
	 * @param string $color any color attribute.
	 * @return string
	 */
	public function sanitize_color( $color, $opacity = null ) {
		if ( empty( $color ) ) {
			return false;
		}
		if ( ! is_array( $color ) && strpos( $color, 'palette' ) === 0 ) {
			switch ( $color ) {
				case 'palette2':
					$fallback = '#2B6CB0';
					break;
				case 'palette3':
					$fallback = '#1A202C';
					break;
				case 'palette4':
					$fallback = '#2D3748';
					break;
				case 'palette5':
					$fallback = '#4A5568';
					break;
				case 'palette6':
					$fallback = '#718096';
					break;
				case 'palette7':
					$fallback = '#EDF2F7';
					break;
				case 'palette8':
					$fallback = '#F7FAFC';
					break;
				case 'palette9':
					$fallback = '#ffffff';
					break;
				default:
					$fallback = '#3182CE';
					break;
			}
			$color = 'var(--global-' . $color . ', ' . $fallback . ')';
		} elseif ( isset( $opacity ) && is_numeric( $opacity ) && 1 !== (int) $opacity ) {
			$color = $this->convert_hex( $color, $opacity );
		}
		return $color;
	}
	/**
	 * Generates the color output.
	 *
	 * @param array $attributes an array of attributes
	 * @param string $name Name of the color attribute
	 * @param string $field Name of CSS property to use
	 * @param string $opacityKey Key of opacity value in passed $attributes
	 *
	 * @return string
	 */
	public function render_color_output( $attributes, $name = 'color', $field = 'color', $opacityKey = '' ) {
		if ( empty( $attributes ) || empty( $name ) ) {
			return false;
		}
		if ( ! is_array( $attributes ) ) {
			return false;
		}
		if ( ! empty( $attributes[ $name ] ) && isset( $attributes[ $opacityKey ] ) ) {
			$this->add_property( $field, $this->sanitize_color( $attributes[ $name ], $attributes[ $opacityKey ] ) );
		} else if ( ! empty( $attributes[ $name ] ) ) {
			$this->add_property( $field, $this->sanitize_color( $attributes[ $name ] ) );
		}
	}
	/**
	 * Hex to RGBA
	 *
	 * @param string $hex string hex code.
	 * @param number $alpha alpha number.
	 */
	public function convert_hex( $hex, $alpha ) {
		if ( empty( $hex ) ) {
			return '';
		}
		if ( 'transparent' === $hex ) {
			return $hex;
		}
		$hex = str_replace( '#', '', $hex );
		if ( strlen( $hex ) == 3 ) {
			$r = hexdec( substr( $hex, 0, 1 ) . substr( $hex, 0, 1 ) );
			$g = hexdec( substr( $hex, 1, 1 ) . substr( $hex, 1, 1 ) );
			$b = hexdec( substr( $hex, 2, 1 ) . substr( $hex, 2, 1 ) );
		} else {
			$r = hexdec( substr( $hex, 0, 2 ) );
			$g = hexdec( substr( $hex, 2, 2 ) );
			$b = hexdec( substr( $hex, 4, 2 ) );
		}
		$rgba = 'rgba(' . $r . ', ' . $g . ', ' . $b . ', ' . $alpha . ')';
		return $rgba;
	}
	/**
	 * Generates the size output.
	 *
	 * @param array  $size an array of size settings.
	 * @param string $device the device this is showing on.
	 * @param bool   $render_zero if 0 should be rendered or not.
	 * @return string
	 */
	public function render_range( $attributes, $name = 'width', $property = 'width', $unit = 'px', $render_zero = true ) {
		if ( empty( $attributes ) || empty( $name ) ) {
			return false;
		}
		if ( ! is_array( $attributes ) ) {
			return false;
		}
		if ( ! isset( $attributes[ $name ] ) ) {
			return false;
		}
		if ( $render_zero ) {
			if ( ! is_numeric( $attributes[ $name ] ) ) {
				return false;
			}
		} else {
			if ( empty( $attributes[ $name ] ) ) {
				return false;
			}
		}
		$this->add_property( $property, $attributes[ $name ] . $unit );
	}
	/**
	 * Generates the measure range output.
	 *
	 * @param array  $attributes an array of attributes.
	 * @param string $name an string of the attribute name.
	 * @param string $property for the css string.
	 * @param string $unit the unit to use.
	 * @param array  $args an array of settings.
	 * @param bool   $render_zero if 0 should be rendered or not.
	 * @return string
	 */
	public function render_measure_range( $attributes, $name = 'width', $property = 'width', $unit = 'px', $args = array(), $render_zero = true ) {
		if ( empty( $attributes ) || empty( $name ) ) {
			return false;
		}
		if ( ! is_array( $attributes ) ) {
			return false;
		}
		if ( ! isset( $attributes[ $name ] ) ) {
			return false;
		}
		switch ( $property ) {
			case 'border-width':
				$prop_args = array(
					'first_prop'  => 'border-top-width',
					'second_prop' => 'border-right-width',
					'third_prop'  => 'border-bottom-width',
					'fourth_prop' => 'border-left-width',
				);
				break;
			case 'border-radius':
				$prop_args = array(
					'first_prop'  => 'border-top-left-radius',
					'second_prop' => 'border-top-right-radius',
					'third_prop'  => 'border-bottom-right-radius',
					'fourth_prop' => 'border-bottom-left-radius',
				);
				break;
			case 'position':
				$prop_args = array(
					'first_prop'  => 'top',
					'second_prop' => 'right',
					'third_prop'  => 'bottom',
					'fourth_prop' => 'left',
				);
				break;
			default:
				$prop_args = array(
					'first_prop'  => $property . '-top',
					'second_prop' => $property . '-right',
					'third_prop'  => $property . '-bottom',
					'fourth_prop' => $property . '-left',
				);
				break;
		}
		$defaults = array(
			'unit_key'    => $name . 'Type',
			'first_prop'  => $prop_args['first_prop'],
			'second_prop' => $prop_args['second_prop'],
			'third_prop'  => $prop_args['third_prop'],
			'fourth_prop' => $prop_args['fourth_prop'],
		);
		$args = wp_parse_args( $args, $defaults );
		$unit = ! empty( $attributes[ $args['unit_key'] ] ) ? $attributes[ $args['unit_key'] ] : $unit;
		if ( isset( $attributes[ $name ] ) && is_array( $attributes[ $name ] ) ) {
			if ( $render_zero && is_numeric( $attributes[ $name ][0] ) ) {
				$this->add_property( $args['first_prop'], $attributes[ $name ][0] . $unit );
			} else if ( ! $render_zero && ! empty( $attributes[ $name ][0] ) ) {
				$this->add_property( $args['first_prop'], $attributes[ $name ][0] . $unit );
			}
			if ( $render_zero && is_numeric( $attributes[ $name ][1] ) ) {
				$this->add_property( $args['second_prop'], $attributes[ $name ][1] . $unit );
			} else if ( ! $render_zero && ! empty( $attributes[ $name ][1] ) ) {
				$this->add_property( $args['second_prop'], $attributes[ $name ][1] . $unit );
			}
			if ( $render_zero && is_numeric( $attributes[ $name ][2] ) ) {
				$this->add_property( $args['third_prop'], $attributes[ $name ][2] . $unit );
			} else if ( ! $render_zero && ! empty( $attributes[ $name ][2] ) ) {
				$this->add_property( $args['third_prop'], $attributes[ $name ][2] . $unit );
			}
			if ( $render_zero && is_numeric( $attributes[ $name ][3] ) ) {
				$this->add_property( $args['fourth_prop'], $attributes[ $name ][3] . $unit );
			} else if ( ! $render_zero && ! empty( $attributes[ $name ][3] ) ) {
				$this->add_property( $args['fourth_prop'], $attributes[ $name ][3] . $unit );
			}
		}
	}
	/**
	 * Generates the shadow output.
	 *
	 * @param array  $shadow an array of shadow settings.
	 * @return string
	 */
	public function render_gap( $attributes, $name = 'gap', $property = 'gap', $unit_name = 'gapUnit' ) {
		if ( empty( $attributes ) || empty( $name ) ) {
			return false;
		}
		if ( ! is_array( $attributes ) ) {
			return false;
		}
		$unit = ! empty( $attributes[ $unit_name ] ) ? $attributes[ $unit_name ] : 'px';
		if ( isset( $attributes[ $name ][0] ) && '' !== $attributes[ $name ][0] ) {
			$this->add_property( $property, $this->get_gap_size( $attributes[ $name ][0], $unit ) );
		}
		if ( isset( $attributes[ $name ][1] ) && '' !== $attributes[ $name ][1] ) {
			$this->set_media_state( 'tablet' );
			$this->add_property( $property, $this->get_gap_size( $attributes[ $name ][1], $unit ) );
		}
		if ( isset( $attributes[ $name ][2] ) && '' !== $attributes[ $name ][2] ) {
			$this->set_media_state( 'mobile' );
			$this->add_property( $property, $this->get_gap_size( $attributes[ $name ][2], $unit ) );
		}
		$this->set_media_state( 'desktop' );
	}
	/**
	 * Generates the shadow output.
	 *
	 * @param array  $shadow an array of shadow settings.
	 * @return string
	 */
	public function render_row_gap( $attributes, $name = array( 'gap', 'tabletGap', 'mobileGap' ), $property = 'gap', $custom = '', $unit_name = 'gapUnit' ) {
		if ( empty( $attributes ) || empty( $name ) ) {
			return false;
		}
		if ( ! is_array( $attributes ) ) {
			return false;
		}
		$unit = ! empty( $attributes[ $unit_name ] ) ? $attributes[ $unit_name ] : 'px';
		if ( ! empty( $attributes[ $name[0] ] ) ) {
			if ( $attributes[ $name[0] ] === 'custom' ) {
				if ( $this->is_number( $attributes[ $custom ][0] ) ) {
					$this->add_property( $property, $attributes[ $custom ][0] . $unit );
				}
			} else {
				$this->add_property( $property, $this->get_variable_gap_value( $attributes[ $name[0] ] ) );
			}
		}
		if ( ! empty( $attributes[ $name[1] ] ) ) {
			$this->set_media_state( 'tablet' );
			if ( $attributes[ $name[1] ] === 'custom' ) {
				if ( $this->is_number( $attributes[ $custom ][1] ) ) {
					$this->add_property( $property, $attributes[ $custom ][1] . $unit );
				}
			} else {
				$this->add_property( $property, $this->get_variable_gap_value( $attributes[ $name[1] ] ) );
			}
		}
		if ( ! empty( $attributes[ $name[2] ] ) ) {
			$this->set_media_state( 'mobile' );
			if ( $attributes[ $name[2] ] === 'custom' ) {
				if ( $this->is_number( $attributes[ $custom ][2] ) ) {
					$this->add_property( $property, $attributes[ $custom ][2] . $unit );
				}
			} else {
				$this->add_property( $property, $this->get_variable_gap_value( $attributes[ $name[2] ] ) );
			}
		}
		$this->set_media_state( 'desktop' );
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
	 * Generates the border radius color output.
	 *
	 * @param array  $attributes an array of attributes.
	 * @param string $name an string of the attribute name.
	 * @return string
	 */
	public function render_border_radius( $attributes, $name = 'borderRadius', $unit = 'px' ) {
		if ( empty( $attributes ) || empty( $name ) ) {
			return false;
		}
		if ( ! is_array( $attributes ) ) {
			return false;
		}
		if ( isset( $attributes[ $name ] ) && is_array( $attributes[ $name ] ) ) {
			if ( isset( $attributes[ $name ][0] ) && is_numeric( $attributes[ $name ][0] ) ) {
				$this->add_property( 'border-top-left-radius', $attributes[ $name ][0] . $unit );
			}
			if ( isset( $attributes[ $name ][1] ) && is_numeric( $attributes[ $name ][1] ) ) {
				$this->add_property( 'border-top-right-radius', $attributes[ $name ][1] . $unit );
			}
			if ( isset( $attributes[ $name ][2] ) && is_numeric( $attributes[ $name ][2] ) ) {
				$this->add_property( 'border-bottom-right-radius', $attributes[ $name ][2] . $unit );
			}
			if ( isset( $attributes[ $name ][3] ) && is_numeric( $attributes[ $name ][3] ) ) {
				$this->add_property( 'border-bottom-left-radius', $attributes[ $name ][3] . $unit );
			}
		}
	}
	/**
	 * Generates the border color output.
	 *
	 * @param array  $attributes an array of attributes.
	 * @param string $name an string of the attribute name.
	 * @return string
	 */
	public function render_border_color( $attributes, $name = 'border' ) {
		if ( empty( $attributes ) || empty( $name ) ) {
			return false;
		}
		if ( ! is_array( $attributes ) ) {
			return false;
		}
		if ( isset( $attributes[ $name ] ) && is_array( $attributes[ $name ] ) ) {
			if ( ! empty( $attributes[ $name ][0] ) ) {
				$this->add_property( 'border-top-color', $this->sanitize_color( $attributes[ $name ][0] ) );
			}
			if ( ! empty( $attributes[ $name ][1] ) ) {
				$this->add_property( 'border-right-color', $this->sanitize_color( $attributes[ $name ][1] ) );
			}
			if ( ! empty( $attributes[ $name ][2] ) ) {
				$this->add_property( 'border-bottom-color', $this->sanitize_color( $attributes[ $name ][2] ) );
			}
			if ( ! empty( $attributes[ $name ][3] ) ) {
				$this->add_property( 'border-left-color', $this->sanitize_color( $attributes[ $name ][3] ) );
			}
		}
	}
	/**
	 * Generates the align output.
	 *
	 * @param array  $attributes an array of attributes.
	 * @param string $name an string of the attribute name.
	 * @return string
	 */
	public function render_align_by_margin( $attributes, $name = 'textAlign' ) {
		if ( empty( $attributes ) || empty( $name ) ) {
			return false;
		}
		if ( ! is_array( $attributes ) ) {
			return false;
		}
		if ( isset( $attributes[ $name ] ) && is_array( $attributes[ $name ] ) ) {
			if ( ! empty( $attributes[ $name ][0] ) ) {
				switch ( $attributes[ $name ][0] ) {
					case 'left':
						$this->add_property( 'margin-left', '0px' );
						$this->add_property( 'margin-right', 'auto' );
						break;
					case 'center':
						$this->add_property( 'margin-left', 'auto' );
						$this->add_property( 'margin-right', 'auto' );
						break;
					case 'right':
						$this->add_property( 'margin-left', 'auto' );
						$this->add_property( 'margin-right', '0px' );
						break;
				}
			}
			if ( ! empty( $attributes[ $name ][1] ) ) {
				$this->set_media_state( 'tablet' );
				switch ( $attributes[ $name ][1] ) {
					case 'left':
						$this->add_property( 'margin-left', '0px' );
						$this->add_property( 'margin-right', 'auto' );
						break;
					case 'center':
						$this->add_property( 'margin-left', 'auto' );
						$this->add_property( 'margin-right', 'auto' );
						break;
					case 'right':
						$this->add_property( 'margin-left', 'auto' );
						$this->add_property( 'margin-right', '0px' );
						break;
				}
			}
			if ( ! empty( $attributes[ $name ][2] ) ) {
				$this->set_media_state( 'mobile' );
				switch ( $attributes[ $name ][2] ) {
					case 'left':
						$this->add_property( 'margin-left', '0px' );
						$this->add_property( 'margin-right', 'auto' );
						break;
					case 'center':
						$this->add_property( 'margin-left', 'auto' );
						$this->add_property( 'margin-right', 'auto' );
						break;
					case 'right':
						$this->add_property( 'margin-left', 'auto' );
						$this->add_property( 'margin-right', '0px' );
						break;
				}
			}
			$this->set_media_state( 'desktop' );
		}
	}
	/**
	 * Generates the text align output.
	 *
	 * @param array  $attributes an array of attributes.
	 * @param string $name an string of the attribute name.
	 * @return string
	 */
	public function render_text_align( $attributes, $name = 'textAlign', $args = array() ) {
		if ( empty( $attributes ) || empty( $name ) ) {
			return false;
		}
		if ( ! is_array( $attributes ) ) {
			return false;
		}
		$defaults = array(
			'desktop_key' => '',
			'tablet_key'  => '',
			'mobile_key'  => '',
		);

		$args = wp_parse_args( $args, $defaults );
		if ( ! empty( $args['desktop_key'] ) && isset( $attributes[ $args['desktop_key'] ] ) ) {
			if ( ! empty( $attributes[ $args['desktop_key'] ] ) ) {
				$this->add_property( 'text-align', $attributes[ $args['desktop_key'] ] );
			}
		} else if ( isset( $attributes[ $name ] ) && is_array( $attributes[ $name ] ) ) {
			if ( ! empty( $attributes[ $name ][0] ) ) {
				$this->add_property( 'text-align', $attributes[ $name ][0] );
			}
		}
		if ( ! empty( $args['tablet_key'] ) && isset( $attributes[ $args['tablet_key'] ] ) ) {
			if ( ! empty( $attributes[ $args['tablet_key'] ] ) ) {
				$this->set_media_state( 'tablet' );
				$this->add_property( 'text-align', $attributes[ $args['tablet_key'] ] );
			}
		} else if ( isset( $attributes[ $name ] ) && is_array( $attributes[ $name ] ) ) {
			if ( ! empty( $attributes[ $name ][1] ) ) {
				$this->set_media_state( 'tablet' );
				$this->add_property( 'text-align', $attributes[ $name ][1] );
			}
		}
		if ( ! empty( $args['mobile_key'] ) && isset( $attributes[ $args['mobile_key'] ] ) ) {
			if ( ! empty( $attributes[ $args['mobile_key'] ] ) ) {
				$this->set_media_state( 'mobile' );
				$this->add_property( 'text-align', $attributes[ $args['mobile_key'] ] );
			}
		} else if ( isset( $attributes[ $name ] ) && is_array( $attributes[ $name ] ) ) {
			if ( ! empty( $attributes[ $name ][2] ) ) {
				$this->set_media_state( 'mobile' );
				$this->add_property( 'text-align', $attributes[ $name ][2] );
			}
		}
		$this->set_media_state( 'desktop' );
	}
	/**
	 * Generates the responsive range output.
	 *
	 * @param array  $attributes an array of attributes.
	 * @param string $name an string of the attribute name.
	 * @param string $property an string of the attribute name.
	 * @param string $unit an string of the attribute name.
	 * @return string
	 */
	public function render_responsive_range( $attributes, $name = 'width', $property = 'width', $unit = '' ) {
		if ( empty( $attributes ) || empty( $name ) ) {
			return false;
		}
		if ( ! is_array( $attributes ) ) {
			return false;
		}
		if ( empty( $unit ) ) {
			$unit = $name . 'Type';
		}
		$unit = ! empty( $attributes[ $unit ] ) ? $attributes[ $unit ] : 'px';
		if ( isset( $attributes[ $name ] ) && is_array( $attributes[ $name ] ) ) {
			if ( ! empty( $attributes[ $name ][0] ) ) {
				$this->add_property( $property, $attributes[ $name ][0] . $unit );
			}
			if ( ! empty( $attributes[ $name ][1] ) ) {
				$this->set_media_state( 'tablet' );
				$this->add_property( $property, $attributes[ $name ][1] . $unit );
			}
			if ( ! empty( $attributes[ $name ][2] ) ) {
				$this->set_media_state( 'mobile' );
				$this->add_property( $property, $attributes[ $name ][2] . $unit );
			}
			$this->set_media_state( 'desktop' );
		}
	}
	/**
	 * Generates the responsive range output.
	 *
	 * @param array  $attributes an array of attributes.
	 * @param string $name an string of the attribute name.
	 * @param string $property an string of the attribute name.
	 * @param string $unit an string of the attribute name.
	 * @return string
	 */
	public function render_responsive_size( $attributes, $name = array( 'width', 'tabletWidth', 'mobileWidth' ), $property = 'width', $unit = '' ) {
		if ( empty( $attributes ) || empty( $name ) ) {
			return false;
		}
		if ( ! is_array( $attributes ) ) {
			return false;
		}
		if ( empty( $unit ) ) {
			$unit = $name[0] . 'Type';
		}
		$unit = ! empty( $attributes[ $unit ] ) ? $attributes[ $unit ] : 'px';
		if ( ! empty( $attributes[ $name[0] ] ) ) {
			$this->add_property( $property, $attributes[ $name[0] ] . $unit );
		}
		if ( ! empty( $attributes[ $name[1] ] ) ) {
			$this->set_media_state( 'tablet' );
			$this->add_property( $property, $attributes[ $name[1] ] . $unit );
		}
		if ( ! empty( $attributes[ $name[2] ] ) ) {
			$this->set_media_state( 'mobile' );
			$this->add_property( $property, $attributes[ $name[2] ] . $unit );
		}
		$this->set_media_state( 'desktop' );
	}
	/**
	 * Generates the flex align output.
	 *
	 * @param array  $attributes an array of attributes.
	 * @param string $name an string of the attribute name.
	 * @return string
	 */
	public function render_flex_align( $attributes, $name = 'textAlign', $args = array() ) {
		if ( empty( $attributes ) || empty( $name ) ) {
			return false;
		}
		if ( ! is_array( $attributes ) ) {
			return false;
		}
		$defaults = array(
			'desktop_key' => '',
			'tablet_key'  => '',
			'mobile_key'  => '',
		);

		$args = wp_parse_args( $args, $defaults );
		if ( ! empty( $args['desktop_key'] ) && isset( $attributes[ $args['desktop_key'] ] ) ) {
			if ( ! empty( $attributes[ $args['desktop_key'] ] ) ) {
				switch ( $attributes[ $args['desktop_key'] ] ) {
					case 'left':
						$this->add_property( 'justify-content', 'flex-start' );
						break;
					case 'center':
						$this->add_property( 'justify-content', 'center' );
						break;
					case 'right':
						$this->add_property( 'justify-content', 'flex-end' );
						break;
					case 'space-between':
						$this->add_property( 'justify-content', 'space-between' );
						break;
				}
			}
		} else if ( isset( $attributes[ $name ] ) && is_array( $attributes[ $name ] ) ) {
			if ( ! empty( $attributes[ $name ][0] ) ) {
				switch ( $attributes[ $name ][0] ) {
					case 'left':
						$this->add_property( 'justify-content', 'flex-start' );
						break;
					case 'center':
						$this->add_property( 'justify-content', 'center' );
						break;
					case 'right':
						$this->add_property( 'justify-content', 'flex-end' );
						break;
					case 'space-between':
						$this->add_property( 'justify-content', 'space-between' );
						break;
				}
			}
		}
		if ( ! empty( $args['tablet_key'] ) && isset( $attributes[ $args['tablet_key'] ] ) ) {
			if ( ! empty( $attributes[ $args['tablet_key'] ] ) ) {
				$this->set_media_state( 'tablet' );
				switch ( $attributes[ $args['tablet_key'] ] ) {
					case 'left':
						$this->add_property( 'justify-content', 'flex-start' );
						break;
					case 'center':
						$this->add_property( 'justify-content', 'center' );
						break;
					case 'right':
						$this->add_property( 'justify-content', 'flex-end' );
						break;
					case 'space-between':
						$this->add_property( 'justify-content', 'space-between' );
						break;
				}
			}
		} else if ( isset( $attributes[ $name ] ) && is_array( $attributes[ $name ] ) ) {
			if ( ! empty( $attributes[ $name ][1] ) ) {
				$this->set_media_state( 'tablet' );
				switch ( $attributes[ $name ][1] ) {
					case 'left':
						$this->add_property( 'justify-content', 'flex-start' );
						break;
					case 'center':
						$this->add_property( 'justify-content', 'center' );
						break;
					case 'right':
						$this->add_property( 'justify-content', 'flex-end' );
						break;
					case 'space-between':
						$this->add_property( 'justify-content', 'space-between' );
						break;
				}
			}
		}
		if ( ! empty( $args['mobile_key'] ) && isset( $attributes[ $args['mobile_key'] ] ) ) {
			if ( ! empty( $attributes[ $args['mobile_key'] ] ) ) {
				$this->set_media_state( 'mobile' );
				switch ( $attributes[ $args['mobile_key'] ] ) {
					case 'left':
						$this->add_property( 'justify-content', 'flex-start' );
						break;
					case 'center':
						$this->add_property( 'justify-content', 'center' );
						break;
					case 'right':
						$this->add_property( 'justify-content', 'flex-end' );
						break;
					case 'space-between':
						$this->add_property( 'justify-content', 'space-between' );
						break;
				}
			}
		} else if ( isset( $attributes[ $name ] ) && is_array( $attributes[ $name ] ) ) {
			if ( ! empty( $attributes[ $name ][2] ) ) {
				$this->set_media_state( 'mobile' );
				switch ( $attributes[ $name ][2] ) {
					case 'left':
						$this->add_property( 'justify-content', 'flex-start' );
						break;
					case 'center':
						$this->add_property( 'justify-content', 'center' );
						break;
					case 'right':
						$this->add_property( 'justify-content', 'flex-end' );
						break;
					case 'space-between':
						$this->add_property( 'justify-content', 'space-between' );
						break;
				}
			}
		}
		$this->set_media_state( 'desktop' );
	}
	/**
	 * Generates the border styles output.
	 *
	 * @param array   $attributes an array of attributes.
	 * @param string  $name an string of the attribute name.
	 * @param boolean $single_styles if property values should be calculated to be output alone.
	 * @param array   $args an array of settings.
	 * @return string
	 */
	public function render_border_styles( $attributes, $name = 'borderStyle', $single_styles = false, $args = array() ) {

		if ( empty( $attributes ) || empty( $name ) ) {
			return false;
		}
		if ( ! is_array( $attributes ) ) {
			return false;
		}
		$defaults = array(
			'desktop_key' => $name,
			'tablet_key'  => 'tablet' . ucfirst( $name ),
			'mobile_key'  => 'mobile' . ucfirst( $name ),
			'unit_key'    => 'unit',
			'first_prop'  => 'border-top',
			'second_prop' => 'border-right',
			'third_prop'  => 'border-bottom',
			'fourth_prop' => 'border-left',
		);
		$args = wp_parse_args( $args, $defaults );

		$sides_prop_keys = array(
			'top' => 'first_prop',
			'right' => 'second_prop',
			'bottom' => 'third_prop',
			'left' => 'fourth_prop',
		);
		$sizes = array(
			'desktop',
			'tablet',
			'mobile',
		);

		foreach ( $sizes as $size ) {
			$this->set_media_state( $size );

			foreach ( $sides_prop_keys as $side => $prop_key ) {
				$width = $this->get_border_value( $attributes, $args, $side, $size, 'width', $single_styles );
				$color = $this->get_border_value( $attributes, $args, $side, $size, 'color', $single_styles );
				$style = $this->get_border_value( $attributes, $args, $side, $size, 'style', $single_styles );
				if ( $width ) {
					$this->add_property( $args[ $prop_key ], $width . ' ' . $style . ' ' . $color );
				} elseif ( $single_styles && $color ) {
					$this->add_property( $args[ $prop_key ] . '-color', $color );
					if ( $style ) {
						$this->add_property( $args[ $prop_key ] . '-style', $style );
					}
				} elseif ( $single_styles && $style ) {
					$desktop_width = $this->get_border_value( $attributes, $args, $side, 'desktop', 'width', $single_styles );
					$tablet_width = $this->get_border_value( $attributes, $args, $side, 'tablet', 'width', $single_styles );

					// Only need to output *just* the border-style if we're inheriting a width
					if( ( $size === 'tablet' && !empty( $desktop_width ) ) || ( $size === 'mobile' && !empty( $desktop_width ) && !empty( $tablet_width ) ) ) {
						$this->add_property( $args[ $prop_key ] . '-style', $style );
					}
				}
			}
		}

		$this->set_media_state( 'desktop' );
	}
	/**
	 * Gets a border value for a side and size.
	 * Checks for values in sizes above itself if the given size has none
	 *
	 * @param array  $attributes an array of attributes.
	 * @param array  $args an array of settings.
	 * @param string $given_side the side to retrieve a value for (desktop, tablet, mobile).
	 * @param string $given_size the size to retrieve a value for (top, right, bottom, left).
	 * @param string $given_value the name of the value to retreive (color, style, width).
	 * @param string $single_styles if this value is being calculated to be output alone.
	 * @return string
	 */
	public function get_border_value( $attributes, $args, $given_side, $given_size, $given_value, $single_styles ) {
		//border styles come in an array like this:
		// [
		// 	  "top": [ {{color}}, {{style}}, {{width}} ],
		// 	  "right": [ {{color}}, {{style}}, {{width}} ],
		// 	  "bottom": [ {{color}}, {{style}}, {{width}} ],
		// 	  "left": [ {{color}}, {{style}}, {{width}} ],
		// 	  "unit": "px"
		// ]
		// one for each size

		// key setup.
		$value_positions = array(
			'color' => 0,
			'style' => 1,
			'width' => 2,
		);
		$value_defaults = array(
			'color' => 'transparent',
			'style' => 'solid',
			'width' => '',
		);
		$size_keys = array(
			'mobile' => 'mobile_key',
			'tablet' => 'tablet_key',
			'desktop' => 'desktop_key',
		);
		$sized_values = array(
			'mobile' => '',
			'tablet' => '',
			'desktop' => '',
		);
		$sized_units = array(
			'mobile' => '',
			'tablet' => '',
			'desktop' => '',
		);

		// get the value for the given side for each size, load into array.
		foreach ($size_keys as $size => $size_key) {
			if ( isset( $attributes[ $args[$size_key] ][0] ) && is_array( $attributes[ $args[$size_key] ][0] ) ) {
				$border_values = $attributes[ $args[$size_key] ][0];
				$border_unit = ( ! empty( $border_values[$args['unit_key']] ) ? $border_values[$args['unit_key']] : '' );
				$border_value = ( $border_values[$given_side][$value_positions[$given_value]] ?? '' );
				$sized_units[$size] = $border_unit;
				$sized_values[$size] = $border_value;
			}
		}

		// return the value/unit for this size or a size above it.
		// if none is found return a default value.
		switch ( $given_size ) {
			case 'desktop':
				$return_value = $sized_values[$given_size];
				$return_unit= $sized_units[$given_size];
				break;
			case 'tablet':
				if( $given_value === 'width'){
					$return_value =  $this->is_number( $sized_values[$given_size] ) ? $sized_values[$given_size] : $sized_values['desktop'];
				} else {
					$return_value = $sized_values[$given_size] ?: $sized_values['desktop'];
				}
				$return_unit = $sized_units[$given_size] ?: $sized_units['desktop'];
				break;
			default:
				if( $given_value === 'width') {
					$return_value = $this->is_number( $sized_values[ $given_size ] ) ? $sized_values[ $given_size ] : ( $sized_values['tablet'] ?: $sized_values['desktop'] );
				} else {
					$return_value = $sized_values[$given_size] ?: $sized_values['tablet'] ?: $sized_values['desktop'];
				}
				$return_unit = $sized_units[$given_size] ?: $sized_units['tablet'] ?: $sized_units['desktop'];
				break;
		}

		// if color is not set and single styles is selected, don't return the default, instead return blank as to not override some inherited styles.
		if ( $given_value == 'color' && ! $return_value && $single_styles) {
			return '';
		}

		$return_value = '' !== $return_value ? $return_value : $value_defaults[ $given_value ];
		$return_unit = $return_unit ? $return_unit : 'px';

		// extra processing for specific values.
		if( $given_value == 'color') {
			$return_value = $this->sanitize_color($return_value);
		}
		if( $given_value == 'width') {
			$return_value = $this->is_number($return_value) ? $return_value . $return_unit : '';
		}

		return $return_value;
	}
	/**
	 * Generates the measure output.
	 *
	 * @param array  $attributes an array of attributes.
	 * @param string $name a string of the block attribute name.
	 * @param string $property a string of the css propery name.
	 * @param array  $args an array of settings.
	 * @return string
	 */
	public function render_measure_output( $attributes, $name = 'padding', $property = 'padding', $args = array() ) {
		if ( empty( $attributes ) || empty( $name ) ) {
			return false;
		}
		if ( ! is_array( $attributes ) ) {
			return false;
		}
		switch ( $property ) {
			case 'border-width':
				$prop_args = array(
					'first_prop'  => 'border-top-width',
					'second_prop' => 'border-right-width',
					'third_prop'  => 'border-bottom-width',
					'fourth_prop' => 'border-left-width',
				);
				break;
			case 'border-radius':
				$prop_args = array(
					'first_prop'  => 'border-top-left-radius',
					'second_prop' => 'border-top-right-radius',
					'third_prop'  => 'border-bottom-right-radius',
					'fourth_prop' => 'border-bottom-left-radius',
				);
				break;
			case 'position':
				$prop_args = array(
					'first_prop'  => 'top',
					'second_prop' => 'right',
					'third_prop'  => 'bottom',
					'fourth_prop' => 'left',
				);
				break;
			default:
				$prop_args = array(
					'first_prop'  => $property . '-top',
					'second_prop' => $property . '-right',
					'third_prop'  => $property . '-bottom',
					'fourth_prop' => $property . '-left',
				);
				break;
		}
		$defaults = array(
			'desktop_key' => $name,
			'tablet_key'  => 'tablet' . ucfirst( $name ),
			'mobile_key'  => 'mobile' . ucfirst( $name ),
			'unit_key'    => $name . 'Type',
			'first_prop'  => $prop_args['first_prop'],
			'second_prop' => $prop_args['second_prop'],
			'third_prop'  => $prop_args['third_prop'],
			'fourth_prop' => $prop_args['fourth_prop'],
		);

		$args = wp_parse_args( $args, $defaults );
		$unit = ! empty( $attributes[ $args['unit_key'] ] ) ? $attributes[ $args['unit_key'] ] : 'px';
		if ( isset( $attributes[ $args['desktop_key'] ] ) && is_array( $attributes[ $args['desktop_key'] ] ) ) {
			if ( $this->is_number( $attributes[ $args['desktop_key'] ][0] ) ) {
				$this->add_property( $args['first_prop'], $attributes[ $args['desktop_key'] ][0] . $unit );
			} else if ( 'position' === $property && ! empty( $attributes[ $args['desktop_key'] ][0] ) ) {
				$this->add_property( $args['first_prop'], $attributes[ $args['desktop_key'] ][0] );
			} else if ( ! empty( $attributes[ $args['desktop_key'] ][0] ) && $this->is_variable_value( $attributes[ $args['desktop_key'] ][0] ) ) {
				$this->add_property( $args['first_prop'], $this->get_variable_value( $attributes[ $args['desktop_key'] ][0] ) );
			}
			if ( isset( $attributes[ $args['desktop_key'] ][1] ) && is_numeric( $attributes[ $args['desktop_key'] ][1] ) ) {
				$this->add_property( $args['second_prop'], $attributes[ $args['desktop_key'] ][1] . $unit );
			} else if ( 'position' === $property && isset( $attributes[ $args['desktop_key'] ][1] ) && ! empty( $attributes[ $args['desktop_key'] ][1] ) ) {
				$this->add_property( $args['second_prop'], $attributes[ $args['desktop_key'] ][1] );
			} else if ( ! empty( $attributes[ $args['desktop_key'] ][1] ) && $this->is_variable_value( $attributes[ $args['desktop_key'] ][1] ) ) {
				$this->add_property( $args['second_prop'], $this->get_variable_value( $attributes[ $args['desktop_key'] ][1] ) );
			}
			if ( isset( $attributes[ $args['desktop_key'] ][2] ) && is_numeric( $attributes[ $args['desktop_key'] ][2] ) ) {
				$this->add_property( $args['third_prop'], $attributes[ $args['desktop_key'] ][2] . $unit );
			} else if ( 'position' === $property && isset( $attributes[ $args['desktop_key'] ][2] ) && ! empty( $attributes[ $args['desktop_key'] ][2] ) ) {
				$this->add_property( $args['third_prop'], $attributes[ $args['desktop_key'] ][2] );
			} else if ( ! empty( $attributes[ $args['desktop_key'] ][2] ) && $this->is_variable_value( $attributes[ $args['desktop_key'] ][2] ) ) {
				$this->add_property( $args['third_prop'], $this->get_variable_value( $attributes[ $args['desktop_key'] ][2] ) );
			}
			if ( isset( $attributes[ $args['desktop_key'] ][3] ) && is_numeric( $attributes[ $args['desktop_key'] ][3] ) ) {
				$this->add_property( $args['fourth_prop'], $attributes[ $args['desktop_key'] ][3] . $unit );
			} else if ( 'position' === $property && isset( $attributes[ $args['desktop_key'] ][3] ) && ! empty( $attributes[ $args['desktop_key'] ][3] ) ) {
				$this->add_property( $args['fourth_prop'], $attributes[ $args['desktop_key'] ][3] );
			} else if ( ! empty( $attributes[ $args['desktop_key'] ][3] ) && $this->is_variable_value( $attributes[ $args['desktop_key'] ][3] ) ) {
				$this->add_property( $args['fourth_prop'], $this->get_variable_value( $attributes[ $args['desktop_key'] ][3] ) );
			}
		}
		$this->set_media_state( 'tablet' );
		if ( isset( $attributes[ $args['tablet_key'] ] ) && is_array( $attributes[ $args['tablet_key'] ] ) ) {
			if ( isset( $attributes[ $args['tablet_key'] ][0] ) && is_numeric( $attributes[ $args['tablet_key'] ][0] ) ) {
				$this->add_property( $args['first_prop'], $attributes[ $args['tablet_key'] ][0] . $unit );
			} else if ( 'position' === $property && isset( $attributes[ $args['tablet_key'] ][0] ) && ! empty( $attributes[ $args['tablet_key'] ][0] ) ) {
				$this->add_property( $args['first_prop'], $attributes[ $args['tablet_key'] ][0] );
			} else if ( ! empty( $attributes[ $args['tablet_key'] ][0] ) && $this->is_variable_value( $attributes[ $args['tablet_key'] ][0] ) ) {
				$this->add_property( $args['first_prop'], $this->get_variable_value( $attributes[ $args['tablet_key'] ][0] ) );
			}
			if ( isset( $attributes[ $args['tablet_key'] ][1] ) && is_numeric( $attributes[ $args['tablet_key'] ][1] ) ) {
				$this->add_property( $args['second_prop'], $attributes[ $args['tablet_key'] ][1] . $unit );
			} else if ( 'position' === $property && isset( $attributes[ $args['tablet_key'] ][1] ) && ! empty( $attributes[ $args['tablet_key'] ][1] ) ) {
				$this->add_property( $args['second_prop'], $attributes[ $args['tablet_key'] ][1] );
			} else if ( ! empty( $attributes[ $args['tablet_key'] ][1] ) && $this->is_variable_value( $attributes[ $args['tablet_key'] ][1] ) ) {
				$this->add_property( $args['second_prop'], $this->get_variable_value( $attributes[ $args['tablet_key'] ][1] ) );
			}
			if ( isset( $attributes[ $args['tablet_key'] ][2] ) && is_numeric( $attributes[ $args['tablet_key'] ][2] ) ) {
				$this->add_property( $args['third_prop'], $attributes[ $args['tablet_key'] ][2] . $unit );
			} else if ( 'position' === $property && isset( $attributes[ $args['tablet_key'] ][2] ) && ! empty( $attributes[ $args['tablet_key'] ][2] ) ) {
				$this->add_property( $args['third_prop'], $attributes[ $args['tablet_key'] ][2] );
			} else if ( ! empty( $attributes[ $args['tablet_key'] ][2] ) && $this->is_variable_value( $attributes[ $args['tablet_key'] ][2] ) ) {
				$this->add_property( $args['third_prop'], $this->get_variable_value( $attributes[ $args['tablet_key'] ][2] ) );
			}
			if ( isset( $attributes[ $args['tablet_key'] ][3] ) && is_numeric( $attributes[ $args['tablet_key'] ][3] ) ) {
				$this->add_property( $args['fourth_prop'], $attributes[ $args['tablet_key'] ][3] . $unit );
			} else if ( 'position' === $property && isset( $attributes[ $args['tablet_key'] ][3] ) && ! empty( $attributes[ $args['tablet_key'] ][3] ) ) {
				$this->add_property( $args['fourth_prop'], $attributes[ $args['tablet_key'] ][3] );
			} else if ( ! empty( $attributes[ $args['tablet_key'] ][3] ) && $this->is_variable_value( $attributes[ $args['tablet_key'] ][3] ) ) {
				$this->add_property( $args['fourth_prop'], $this->get_variable_value( $attributes[ $args['tablet_key'] ][3] ) );
			}
		}
		$this->set_media_state( 'mobile' );
		if ( isset( $attributes[ $args['mobile_key'] ] ) && is_array( $attributes[ $args['mobile_key'] ] ) ) {
			if ( isset( $attributes[ $args['mobile_key'] ][0] ) && is_numeric( $attributes[ $args['mobile_key'] ][0] ) ) {
				$this->add_property( $args['first_prop'], $attributes[ $args['mobile_key'] ][0] . $unit );
			} else if ( 'position' === $property && isset( $attributes[ $args['mobile_key'] ][0] ) && ! empty( $attributes[ $args['mobile_key'] ][0] ) ) {
				$this->add_property( $args['first_prop'], $attributes[ $args['mobile_key'] ][0] );
			} else if ( ! empty( $attributes[ $args['mobile_key'] ][0] ) && $this->is_variable_value( $attributes[ $args['mobile_key'] ][0] ) ) {
				$this->add_property( $args['first_prop'], $this->get_variable_value( $attributes[ $args['mobile_key'] ][0] ) );
			}
			if ( isset( $attributes[ $args['mobile_key'] ][1] ) && is_numeric( $attributes[ $args['mobile_key'] ][1] ) ) {
				$this->add_property( $args['second_prop'], $attributes[ $args['mobile_key'] ][1] . $unit );
			} else if ( 'position' === $property && isset( $attributes[ $args['mobile_key'] ][1] ) && ! empty( $attributes[ $args['mobile_key'] ][1] ) ) {
				$this->add_property( $args['second_prop'], $attributes[ $args['mobile_key'] ][1] );
			} else if ( ! empty( $attributes[ $args['mobile_key'] ][1] ) && $this->is_variable_value( $attributes[ $args['mobile_key'] ][1] ) ) {
				$this->add_property( $args['second_prop'], $this->get_variable_value( $attributes[ $args['mobile_key'] ][1] ) );
			}
			if ( isset( $attributes[ $args['mobile_key'] ][2] ) && is_numeric( $attributes[ $args['mobile_key'] ][2] ) ) {
				$this->add_property( $args['third_prop'], $attributes[ $args['mobile_key'] ][2] . $unit );
			} else if ( 'position' === $property && isset( $attributes[ $args['mobile_key'] ][2] ) && ! empty( $attributes[ $args['mobile_key'] ][2] ) ) {
				$this->add_property( $args['third_prop'], $attributes[ $args['mobile_key'] ][2] );
			} else if ( ! empty( $attributes[ $args['mobile_key'] ][2] ) && $this->is_variable_value( $attributes[ $args['mobile_key'] ][2] ) ) {
				$this->add_property( $args['third_prop'], $this->get_variable_value( $attributes[ $args['mobile_key'] ][2] ) );
			}
			if ( isset( $attributes[ $args['mobile_key'] ][3] ) && is_numeric( $attributes[ $args['mobile_key'] ][3] ) ) {
				$this->add_property( $args['fourth_prop'], $attributes[ $args['mobile_key'] ][3] . $unit );
			} else if ( 'position' === $property && isset( $attributes[ $args['mobile_key'] ][3] ) && ! empty( $attributes[ $args['mobile_key'] ][3] ) ) {
				$this->add_property( $args['fourth_prop'], $attributes[ $args['mobile_key'] ][3] );
			} else if ( ! empty( $attributes[ $args['mobile_key'] ][3] ) && $this->is_variable_value( $attributes[ $args['mobile_key'] ][3] ) ) {
				$this->add_property( $args['fourth_prop'], $this->get_variable_value( $attributes[ $args['mobile_key'] ][3] ) );
			}
		}
		$this->set_media_state( 'desktop' );
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
	 * Generates the opacity css output.
	 *
	 * @param array $attributes an array of attributes.
	 * @param null|integer $name name of opacity attribute.
	 */
	public function render_opacity_from_100( $attributes, $name = null ) {
		if ( ! isset( $attributes[ $name ] ) || ! $this->is_number( $attributes[ $name ] ) ) {
			return;
		}
		if ( $attributes[ $name ] < 10 ) {
			$this->add_property( 'opacity', '0.0' . $attributes[ $name ] );
		} elseif ( $attributes[ $name ] >= 100 ) {
			$this->add_property( 'opacity', '1' );
		} else {
			$this->add_property( 'opacity', '0.' . $attributes[ $name ] );
		}
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
		// Prevent empty array in google fonts.
		if ( empty( $font_name ) ) {
			return;
		}
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
	 * Resets the css variable
	 *
	 * @access private
	 * @since  1.1
	 *
	 * @return void
	 */
	public function render_media_queries() {
		if ( isset( $this->_desktop_only_media_query ) && is_array( $this->_desktop_only_media_query ) && ! empty( $this->_desktop_only_media_query ) ) {
			$this->start_media_query( $this->get_media_queries( 'desktop' ) );
			foreach ( $this->_desktop_only_media_query as $selector => $string ) {
				$this->set_selector( $selector );
				$this->_css .= $string;
			}
			$this->stop_media_query();
		}
		if ( isset( $this->_tablet_media_query ) && is_array( $this->_tablet_media_query ) && ! empty( $this->_tablet_media_query ) ) {
			foreach ( $this->_tablet_media_query as $selector => $string ) {
				$this->start_media_query( $this->get_media_queries( 'tablet' ) );
				$this->set_selector( $selector );
				$this->_css .= $string;
			}
			$this->stop_media_query();
		}
		if ( isset( $this->_tablet_only_media_query ) && is_array( $this->_tablet_only_media_query ) && ! empty( $this->_tablet_only_media_query ) ) {
			$this->start_media_query( $this->get_media_queries( 'tabletOnly' ) );
			foreach ( $this->_tablet_only_media_query as $selector => $string ) {
				$this->set_selector( $selector );
				$this->_css .= $string;
			}
			$this->stop_media_query();
		}
		if ( isset( $this->_mobile_media_query ) && is_array( $this->_mobile_media_query ) && ! empty( $this->_mobile_media_query ) ) {
			$this->start_media_query( $this->get_media_queries( 'mobile' ) );
			foreach ( $this->_mobile_media_query as $selector => $string ) {
				$this->set_selector( $selector );
				$this->_css .= $string;
			}
			$this->stop_media_query();
		}
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
	 * Clears everything.
	 *
	 * @access public
	 * @since  1.0
	 *
	 * @return string
	 */
	public function clear() {
		$this->_selector = '';
		self::$google_fonts = array();
		$this->_selector_output = '';
		$this->_selector_states = array();
		$this->_tablet_media_query = array();
		$this->_desktop_only_media_query = array();
		$this->_tablet_only_media_query = array();
		$this->_mobile_media_query = array();
		$this->_media_state = 'desktop';
		$this->_css = '';
		$this->_css_string = '';
		$this->_output = '';
		$this->_media_query = null;
		$this->_media_query_output = '';
		$this->media_queries = null;
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
		if ( apply_filters( 'kadence_blocks_css_output_media_queries', true ) ) {
			$this->render_media_queries();
		}
		// Add current selector's rules to output
		$this->add_selector_rules_to_output();

		if ( class_exists( 'Kadence_Blocks_Google_Fonts' ) ) {
			$fonts_instance = Kadence_Blocks_Google_Fonts::get_instance();
			$fonts_instance->add_fonts( $this->fonts_output() );
		}
		// Output minified css.
		self::$styles[ $this->_style_id ] = $this->_output;
		if ( ! empty( $this->_css_string ) ) {
			if ( ! isset( self::$custom_styles[ $this->_style_id ] ) ) {
				self::$custom_styles[ $this->_style_id ] = '';
			}
			self::$custom_styles[ $this->_style_id ] = $this->_css_string;
		}
		$this->clear();
		return self::$styles[ $this->_style_id ] . ( isset( self::$custom_styles[ $this->_style_id ] ) ? self::$custom_styles[ $this->_style_id ] : '' );
	}
	/**
	 * Generates the gap output.
	 *
	 * @param string  $size a string or number with the gap size.
	 * @param string $unit a string with the unit type.
	 * @return string
	 */
	public function get_gap_size( $size, $unit ) {
		if ( $this->is_variable_gap_value( $size ) ) {
			return $this->get_variable_gap_value( $size );
		}
		return $size . $unit;
	}
	/**
	 * @param $value
	 *
	 * @return bool
	 */
	public function is_variable_gap_value( $value ) {
		return isset( $this->gap_sizes[ $value ] );
	}
	/**
	 * @param $value
	 *
	 * @return bool|string
	 */
	public function get_variable_gap_value( $value ) {
		if ( $this->is_variable_gap_value( $value ) ) {
			return $this->gap_sizes[ $value ];
		}

		return false;
	}
	/**
	 * @param $value
	 *
	 * @return bool
	 */
	public function is_variable_font_size_value( $value ) {
		return is_string( $value ) && isset( $this->font_sizes[ $value ] );
	}
	/**
	 * @param $value
	 *
	 * @return bool|string
	 */
	public function get_variable_font_size_value( $value ) {
		if ( $this->is_variable_font_size_value( $value ) ) {
			return $this->font_sizes[ $value ];
		}

		return false;
	}
	/**
	 * @param $value
	 *
	 * @return bool
	 */
	public function is_variable_value( $value ) {
		return is_string( $value ) && isset( $this->spacing_sizes[ $value ] );
	}

	/**
	 * @param $value
	 *
	 * @return int|string
	 */
	public function get_variable_value( $value ) {
		if( $this->is_variable_value( $value) ) {
			return $this->spacing_sizes[$value];
		}

		return 0;
	}

	/**
	 * @param array $sizes
	 *
	 * @return void
	 */
	public function set_spacing_sizes( $sizes ) {
		$this->spacing_sizes = $sizes;
	}
}
Kadence_Blocks_CSS::get_instance();
