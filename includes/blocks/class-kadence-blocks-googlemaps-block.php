<?php
/**
 * Class to Build the Google Maps Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Google Maps Block.
 *
 * @category class
 */
class Kadence_Blocks_Googlemaps_Block extends Kadence_Blocks_Abstract_Block {

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
	protected $block_name = 'googlemaps';

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
	 * @param array $attributes the blocks attributes.
	 * @param Kadence_Blocks_CSS $css the css class for blocks.
	 * @param string $unique_id the blocks attr ID.
	 * @param string $unique_style_id the blocks alternate ID for queries.
	 */
	public function build_css( $attributes, $css, $unique_id, $unique_style_id ) {

		$css->set_style_id( 'kb-' . $this->block_name . $unique_style_id );
		$css->set_selector( '.kb-google-maps-container' . $unique_id );

		/*
		 * Max-Width
		 */
		foreach ( [ 'Desktop', 'Tablet', 'Mobile' ] as $breakpoint ) {
			$css->set_media_state( strtolower( $breakpoint ) );

			if ( isset( $attributes[ 'width' . $breakpoint ] ) && is_numeric( $attributes[ 'width' . $breakpoint ] ) ) {
				$css->add_property( 'max-width', $attributes[ 'width' . $breakpoint ] . 'px' );
			}
			if ( $breakpoint !== 'Desktop' ) {
				$css->set_media_state( 'desktop' );
			}
		}

		/*
		 * Height
		 */
		foreach ( [ 'Desktop', 'Tablet', 'Mobile' ] as $breakpoint ) {
			if ( $breakpoint == 'Desktop' ) {
				$height = ( isset( $attributes[ 'height' . $breakpoint ] ) && is_numeric( $attributes[ 'height' . $breakpoint ] ) ? $attributes[ 'height' . $breakpoint ] : 450 );
				$css->add_property( 'height', $height . 'px' );
			} else {
				$css->set_media_state( strtolower( $breakpoint ) );
				if ( isset( $attributes[ 'height' . $breakpoint ] ) && is_numeric( $attributes[ 'height' . $breakpoint ] ) ) {
					$css->add_property( 'height', $attributes[ 'height' . $breakpoint ] . 'px' );
				}
				$css->set_media_state( 'desktop' );
			}
		}


		/*
		 * Margin
		 */
		$margin_args = array(
			'desktop_key' => 'marginDesktop',
			'tablet_key'  => 'marginTablet',
			'mobile_key'  => 'marginMobile',
			'unit_key'    => 'marginUnit',
		);
		$css->render_measure_output( $attributes, 'margin', 'margin', $margin_args );

		/*
		 * Padding
		 */
		$padding_args = array(
			'desktop_key' => 'paddingDesktop',
			'tablet_key'  => 'paddingTablet',
			'mobile_key'  => 'paddingMobile',
			'unit_key'    => 'paddingUnit',
		);
		$css->render_measure_output( $attributes, 'padding', 'padding', $padding_args );


		/*
		 * Align
		 */
		foreach ( [ 'Desktop', 'Tablet', 'Mobile' ] as $index => $breakpoint ) {
			$css->set_media_state( strtolower( $breakpoint ) );

			if ( ! empty( $attributes['textAlign'][ $index ] ) ) {
				if ( $attributes['textAlign'][ $index ] === 'center' ) {
					$css->add_property( 'margin-left', 'auto !important' );
					$css->add_property( 'margin-right', 'auto !important' );
				} elseif ( $attributes['textAlign'][ $index ] === 'left' ) {
					$css->add_property( 'margin-right', 'auto !important' );
				} elseif ( $attributes['textAlign'][ $index ] === 'right' ) {
					$css->add_property( 'margin-left', 'auto !important' );
				}
			}

			$css->set_media_state( 'desktop' );
		}

		/*
		 * Filters
		 */
		if ( isset( $attributes['mapFilter'] ) && $attributes['mapFilter'] !== 'standard' ) {
			$css->set_selector( '.kb-google-maps-container' . $unique_id );
			$filter_level = ( isset( $attributes['mapFilterAmount'] ) && is_numeric( $attributes['mapFilterAmount'] ) ? $attributes['mapFilterAmount'] : 50 );
			$css->add_property( 'filter', $attributes['mapFilter'] . '(' . $filter_level . '%)' );
		}

		return $css->css_output();
	}
	/**
	 * Return dynamically generated HTML for block
	 *
	 * @param $attributes
	 * @param $unique_id
	 * @param $content
	 * @param WP_Block $block_instance The instance of the WP_Block class that represents the block being rendered.
	 *
	 * @return mixed
	 */
	public function build_html( $attributes, $unique_id, $content, $block_instance ) {

		$updated_version = ! empty( $attributes['kbVersion'] ) && $attributes['kbVersion'] > 1 ? true : false;

		$style_id = 'kb-google-maps' . esc_attr( $unique_id );
		if ( ! wp_style_is( $style_id, 'enqueued' ) && apply_filters( 'kadence_blocks_render_inline_css', true, 'google_maps', $attributes ) ) {
			// If filter didn't run in header (which would have enqueued the specific css id ) then filter attributes for easier dynamic css.
			$attributes = apply_filters( 'kadence_blocks_google_maps_render_block_attributes', $attributes );
		}

		if ( isset( $attributes['apiType'] ) && $attributes['apiType'] === 'javascript' ) {
			$this->enqueue_script( 'kadence-blocks-googlemaps-init-js' );
			$this->enqueue_script( 'kadence-blocks-googlemaps-js' );
		}

		if ( $updated_version ) {
			$wrapper_args = array(
				'class' => 'kb-google-maps-container kb-google-maps-container' . $unique_id . ' ' . ( ! empty( $attributes['align'] ) ? 'align' . $attributes['align'] : '' ),
				'data-mapid' => $unique_id,
			);
			$wrapper_attributes = get_block_wrapper_attributes( $wrapper_args );

			$content = '<div ' . $wrapper_attributes . '>';

			if ( isset( $attributes['apiType'] ) && $attributes['apiType'] === 'javascript' ) {
				$content .= '<div id="kb-google-map' . $unique_id . '" style="width: 100%; height: 100%"></div>';
			} else {

				$mapQueryParams = array(
					'key'     => 'KADENCE_GOOGLE_MAPS_KEY',
					'zoom'    => $attributes['zoom'],
					'maptype' => $attributes['mapType'],
					'q'       => $attributes['location']
				);
				// translators: %s is the location.
				$title = sprintf( __( 'Google map of %s', 'kadence-blocks' ), $attributes['location'] );
				$content .= '<iframe width="100%" height="100%"
							style="border:0" loading="lazy"
							src="https://www.google.com/maps/embed/v1/place?' . http_build_query( $mapQueryParams ) . '"
							title="' . esc_attr( $title ) . '"></iframe>';
			}
			$content .= '</div>';
		}

		$snazzyStyles = [
			'shades_of_grey'         => "[{'featureType':'all','elementType':'labels.text.fill','stylers':[{'saturation':36},{'color':'#000000'},{'lightness':40}]},{'featureType':'all','elementType':'labels.text.stroke','stylers':[{'visibility':'on'},{'color':'#000000'},{'lightness':16}]},{'featureType':'all','elementType':'labels.icon','stylers':[{'visibility':'off'}]},{'featureType':'administrative','elementType':'geometry.fill','stylers':[{'color':'#000000'},{'lightness':20}]},{'featureType':'administrative','elementType':'geometry.stroke','stylers':[{'color':'#000000'},{'lightness':17},{'weight':1.2}]},{'featureType':'landscape','elementType':'geometry','stylers':[{'color':'#000000'},{'lightness':20}]},{'featureType':'poi','elementType':'geometry','stylers':[{'color':'#000000'},{'lightness':21}]},{'featureType':'road.highway','elementType':'geometry.fill','stylers':[{'color':'#000000'},{'lightness':17}]},{'featureType':'road.highway','elementType':'geometry.stroke','stylers':[{'color':'#000000'},{'lightness':29},{'weight':0.2}]},{'featureType':'road.arterial','elementType':'geometry','stylers':[{'color':'#000000'},{'lightness':18}]},{'featureType':'road.local','elementType':'geometry','stylers':[{'color':'#000000'},{'lightness':16}]},{'featureType':'transit','elementType':'geometry','stylers':[{'color':'#000000'},{'lightness':19}]},{'featureType':'water','elementType':'geometry','stylers':[{'color':'#000000'},{'lightness':17}]}]",
			'no_label_bright_colors' => '[{"featureType":"all","elementType":"all","stylers":[{"saturation":"32"},{"lightness":"-3"},{"visibility":"on"},{"weight":"1.18"}]},{"featureType":"administrative","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"saturation":"-70"},{"lightness":"14"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"saturation":"100"},{"lightness":"-14"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"off"},{"lightness":"12"}]}]',
			'clean_interface'        => '[{"featureType":"all","elementType":"labels.text","stylers":[{"color":"#878787"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f9f5ed"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"color":"#f5f5f5"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#c9c9c9"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#aee0f4"}]}]',
			'midnight_commander'     => '[{"featureType":"all","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"color":"#000000"},{"lightness":13}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#144b53"},{"lightness":14},{"weight":1.4}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#08304b"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#0c4152"},{"lightness":5}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#0b434f"},{"lightness":25}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#0b3d51"},{"lightness":16}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"}]},{"featureType":"transit","elementType":"all","stylers":[{"color":"#146474"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#021019"}]}]',
			'apple_maps_esque'       => '[{"featureType":"administrative.country","elementType":"labels.text","stylers":[{"lightness":"29"}]},{"featureType":"administrative.province","elementType":"labels.text.fill","stylers":[{"lightness":"-12"},{"color":"#796340"}]},{"featureType":"administrative.locality","elementType":"labels.text.fill","stylers":[{"lightness":"15"},{"saturation":"15"}]},{"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#fbf5ed"}]},{"featureType":"landscape.natural","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#fbf5ed"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi.attraction","elementType":"all","stylers":[{"visibility":"on"},{"lightness":"30"},{"saturation":"-41"},{"gamma":"0.84"}]},{"featureType":"poi.attraction","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"poi.business","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi.medical","elementType":"geometry","stylers":[{"color":"#fbd3da"}]},{"featureType":"poi.medical","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#b0e9ac"},{"visibility":"on"}]},{"featureType":"poi.park","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"poi.park","elementType":"labels.text.fill","stylers":[{"hue":"#68ff00"},{"lightness":"-24"},{"gamma":"1.59"}]},{"featureType":"poi.sports_complex","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.sports_complex","elementType":"geometry","stylers":[{"saturation":"10"},{"color":"#c3eb9a"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"visibility":"on"},{"lightness":"30"},{"color":"#e7ded6"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"on"},{"saturation":"-39"},{"lightness":"28"},{"gamma":"0.86"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffe523"},{"visibility":"on"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"visibility":"on"},{"saturation":"0"},{"gamma":"1.44"},{"color":"#fbc28b"}]},{"featureType":"road.highway","elementType":"labels","stylers":[{"visibility":"on"},{"saturation":"-40"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#fed7a5"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"gamma":"1.54"},{"color":"#fbe38b"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"visibility":"on"},{"gamma":"2.62"},{"lightness":"10"}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"visibility":"on"},{"weight":"0.50"},{"gamma":"1.04"}]},{"featureType":"transit.station.airport","elementType":"geometry.fill","stylers":[{"color":"#dee3fb"}]},{"featureType":"water","elementType":"geometry","stylers":[{"saturation":"46"},{"color":"#a4e1ff"}]}]',
			'cobalt'                 => '[{"featureType":"all","elementType":"all","stylers":[{"invert_lightness":true},{"saturation":10},{"lightness":30},{"gamma":0.5},{"hue":"#435158"}]}]',
			'avocado'                => '[{"featureType":"water","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#aee2e0"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#abce83"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"color":"#769E72"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#7B8758"}]},{"featureType":"poi","elementType":"labels.text.stroke","stylers":[{"color":"#EBF4A4"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"visibility":"simplified"},{"color":"#8dab68"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#5B5B3F"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"color":"#ABCE83"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#A4C67D"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#9BBF72"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#EBF4A4"}]},{"featureType":"transit","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"visibility":"on"},{"color":"#87ae79"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#7f2200"},{"visibility":"off"}]},{"featureType":"administrative","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"},{"visibility":"on"},{"weight":4.1}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#495421"}]},{"featureType":"administrative.neighborhood","elementType":"labels","stylers":[{"visibility":"off"}]}]',
			'night_mode'             => '[{elementType:"geometry",stylers:[{color:"#242f3e"}]},{elementType:"labels.text.stroke",stylers:[{color:"#242f3e"}]},{elementType:"labels.text.fill",stylers:[{color:"#746855"}]},{featureType:"administrative.locality",elementType:"labels.text.fill",stylers:[{color:"#d59563"}]},{featureType:"poi",elementType:"labels.text.fill",stylers:[{color:"#d59563"}]},{featureType:"poi.park",elementType:"geometry",stylers:[{color:"#263c3f"}]},{featureType:"poi.park",elementType:"labels.text.fill",stylers:[{color:"#6b9a76"}]},{featureType:"road",elementType:"geometry",stylers:[{color:"#38414e"}]},{featureType:"road",elementType:"geometry.stroke",stylers:[{color:"#212a37"}]},{featureType:"road",elementType:"labels.text.fill",stylers:[{color:"#9ca5b3"}]},{featureType:"road.highway",elementType:"geometry",stylers:[{color:"#746855"}]},{featureType:"road.highway",elementType:"geometry.stroke",stylers:[{color:"#1f2835"}]},{featureType:"road.highway",elementType:"labels.text.fill",stylers:[{color:"#f3d19c"}]},{featureType:"transit",elementType:"geometry",stylers:[{color:"#2f3948"}]},{featureType:"transit.station",elementType:"labels.text.fill",stylers:[{color:"#d59563"}]},{featureType:"water",elementType:"geometry",stylers:[{color:"#17263c"}]},{featureType:"water",elementType:"labels.text.fill",stylers:[{color:"#515c6d"}]},{featureType:"water",elementType:"labels.text.stroke",stylers:[{color:"#17263c"}]}]',
			'custom'                 => isset( $attributes['customSnazzy'] ) ? $attributes['customSnazzy'] : '[]'
		];

		// Replace API key with default or users set key.
		$user_google_maps_key = get_option( 'kadence_blocks_google_maps_api', '' );
		if ( empty( $user_google_maps_key ) ) {
			$content = str_replace( 'KADENCE_GOOGLE_MAPS_KEY', 'AIzaSyBAM2o7PiQqwk15LC1XRH2e_KJ-jUa7KYk', $content );
		} else {
			$content = str_replace( 'KADENCE_GOOGLE_MAPS_KEY', $user_google_maps_key, $content );
		}

		$zoom    = empty( $attributes['zoom'] ) ? 11 : $attributes['zoom'];
		$gMapLat = empty( $attributes['lat'] ) ? '37.8201' : $attributes['lat'];
		$gMapLng = empty( $attributes['lng'] ) ? '-122.4781' : $attributes['lng'];

		$content .= '<script>';
		$content .= 'function kb_google_map' . str_replace( '-', '_', $unique_id ) . '() {';
		$content .= ' let center = { lat: ' . $gMapLat . ', lng: ' . $gMapLng . '};';

		$content .= ' let map = new google.maps.Map(document.getElementById("kb-google-map' . $unique_id . '"), {
					    zoom: ' . $zoom . ',
					    center: center,';

		if ( ! empty( $attributes['mapStyle'] ) && $attributes['mapStyle'] !== 'standard' ) {
			$content .= 'styles: ' . $snazzyStyles[ $attributes['mapStyle'] ] . ',';
		}
		if ( isset( $attributes['mapType'] ) && $attributes['mapType'] === 'satellite' ) {
			$content .= 'mapTypeId: "satellite",';
		}

		$content .= '});';

		if ( ! isset( $attributes['showMarker'] ) || ( isset( $attributes['showMarker'] ) && $attributes['showMarker'] ) ) {
			$content .= 'let marker = new google.maps.Marker({';
			$content .= '   position: { lat: ' . $gMapLat . ', lng: ' . $gMapLng . '},';
			$content .= '    map: map,';
			$content .= '  });';
		}

		$content .= '}';
		$content .= '</script>';

		return $content;
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

		$google_maps_api_key = get_option( 'kadence_blocks_google_maps_api', 'missingkey' );
		wp_register_script( 'kadence-blocks-googlemaps-js', 'https://maps.googleapis.com/maps/api/js?key=' . $google_maps_api_key . '&callback=kbInitMaps', array( 'kadence-blocks-googlemaps-init-js' ), KADENCE_BLOCKS_VERSION, true );
		wp_register_script( 'kadence-blocks-googlemaps-init-js', KADENCE_BLOCKS_URL . 'includes/assets/js/kb-init-google-maps.min.js', array(), KADENCE_BLOCKS_VERSION, true );
	}


}

Kadence_Blocks_Googlemaps_Block::get_instance();
