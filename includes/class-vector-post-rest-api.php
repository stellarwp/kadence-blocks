<?php
/**
 * REST API Vector SVG controller
 */

use KadenceWP\KadenceBlocks\enshrined\svgSanitize\Sanitizer;
use KadenceWP\KadenceBlocks\enshrined\svgSanitize\data\AttributeInterface;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
/**
 * REST API Vector controller class.
 */
class Kadence_Vector_post_REST_Controller extends WP_REST_Controller {

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->namespace = 'kb-vector/v1';
		$this->rest_base = 'vectors';
	}

	/**
	 * Registers the routes for the objects of the controller.
	 *
	 * @see register_rest_route()
	 */
	public function register_routes() {
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base,
			array(
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => array( $this, 'create_vector' ),
					'permission_callback' => array( $this, 'create_vector_permission_check' ),
				),
			)
		);
	}
	/**
	 * Checks if a given request has access to search content.
	 *
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has search access, WP_Error object otherwise.
	 */
	public function create_vector_permission_check( $request ) {
		return current_user_can( 'edit_others_pages' );
	}

	/**
	 * Create a vector SVG post from object
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return Array
	 */
	public function create_vector( $request ) {
		$jsonParams = $request->get_json_params();

		if ( empty( $jsonParams['vectorSVG'] ) ) {
			return new WP_Error( 'invalid_svg', __( 'Vector contains invalid SVG', 'kadence-blocks' ), array( 'status' => 200 ) );
		}

		if ( ! empty( trim( $jsonParams['title'] ) ) ) {
			$title = trim( $jsonParams['title'] );
		} else {
			return array( 'error' => true, 'message' => __( 'Please enter a vector title', 'kadence-blocks' ) );
		}

		// Sanitize SVG
		$svg_content = $this->sanitize_svg_content($jsonParams['vectorSVG']);

		// Create post object
		$my_post = array(
			'post_title'     => $title,
			'post_content'   => $svg_content,
			'post_type'      => 'kadence_vector',
			'post_status'    => 'publish',
			'post_mime_type' => 'image/svg+xml',
		);

		$insert = wp_insert_post( $my_post, true );

		if ( is_wp_error( $insert ) ) {
			return array( 'error' => true, 'message' => $insert->get_error_message());
		}

		return array( 'value' => $insert, 'label' => $title );
	}

	/**
	 * Sanitize SVG content
	 *
	 * @param string $svg_content The SVG content.
	 * @return string Sanitized SVG content.
	 */
	private function sanitize_svg_content( $svg_content ) {
		$sanitizer = new Sanitizer();

		// Remove attributes that reference remote files
		$sanitizer->removeRemoteReferences( true );

		// Set the allowed attributes
		$allowedAttributes = new KadenceBlocksAllowedAttributes();
		$sanitizer->setAllowedAttrs( $allowedAttributes );

		// Pass it to the sanitizer and get it back clean
		return $sanitizer->sanitize( $svg_content );
	}
} 

/**
 * AllowedAttributes for custom SVGs.
 *
 * @package enshrined\svgSanitize\data
 */
class KadenceBlocksAllowedAttributes implements AttributeInterface {

	/**
	 * Returns an array of attributes
	 *
	 * @return array
	 */
	public static function getAttributes() {
		return array(
			// HTML
			'about',
			'accept',
			'action',
			'align',
			'alt',
			'autocomplete',
			'background',
			'bgcolor',
			'border',
			'cellpadding',
			'cellspacing',
			'checked',
			'cite',
			'class',
			'clear',
			'color',
			'cols',
			'colspan',
			'coords',
			'crossorigin',
			'datetime',
			'default',
			'dir',
			'disabled',
			'download',
			'enctype',
			'encoding',
			'face',
			'for',
			'headers',
			'height',
			'hidden',
			'high',
			'href',
			'hreflang',
			'id',
			'integrity',
			'ismap',
			'label',
			'lang',
			'list',
			'loop',
			'low',
			'max',
			'maxlength',
			'media',
			'method',
			'min',
			'multiple',
			'name',
			'noshade',
			'novalidate',
			'nowrap',
			'open',
			'optimum',
			'pattern',
			'placeholder',
			'poster',
			'preload',
			'pubdate',
			'radiogroup',
			'readonly',
			'rel',
			'required',
			'rev',
			'reversed',
			'role',
			'rows',
			'rowspan',
			'spellcheck',
			'scope',
			'selected',
			'shape',
			'size',
			'sizes',
			'span',
			'srclang',
			'start',
			'src',
			'srcset',
			'step',
			'style',
			'summary',
			'tabindex',
			'title',
			'type',
			'usemap',
			'valign',
			'value',
			'version',
			'width',
			'xmlns',

			// SVG
			'accent-height',
			'accumulate',
			'additivive',
			'alignment-baseline',
			'ascent',
			'attributename',
			'attributetype',
			'azimuth',
			'basefrequency',
			'baseline-shift',
			'begin',
			'bias',
			'by',
			'class',
			'clip',
			'clip-path',
			'clip-rule',
			'color',
			'color-interpolation',
			'color-interpolation-filters',
			'color-profile',
			'color-rendering',
			'cx',
			'cy',
			'd',
			'dx',
			'dy',
			'diffuseconstant',
			'direction',
			'display',
			'divisor',
			'dur',
			'edgemode',
			'elevation',
			'end',
			'fill',
			'fill-opacity',
			'fill-rule',
			'filter',
			'filterUnits',
			'flood-color',
			'flood-opacity',
			'font-family',
			'font-size',
			'font-size-adjust',
			'font-stretch',
			'font-style',
			'font-variant',
			'font-weight',
			'fx',
			'fy',
			'g1',
			'g2',
			'glyph-name',
			'glyphref',
			'gradientunits',
			'gradienttransform',
			'height',
			'href',
			'id',
			'image-rendering',
			'in',
			'in2',
			'k',
			'k1',
			'k2',
			'k3',
			'k4',
			'kerning',
			'keypoints',
			'keysplines',
			'keytimes',
			'lang',
			'lengthadjust',
			'letter-spacing',
			'kernelmatrix',
			'kernelunitlength',
			'lighting-color',
			'local',
			'marker-end',
			'marker-mid',
			'marker-start',
			'markerheight',
			'markerunits',
			'markerwidth',
			'maskcontentunits',
			'maskunits',
			'max',
			'mask',
			'media',
			'method',
			'mode',
			'min',
			'name',
			'numoctaves',
			'offset',
			'operator',
			'opacity',
			'order',
			'orient',
			'orientation',
			'origin',
			'overflow',
			'paint-order',
			'path',
			'pathlength',
			'patterncontentunits',
			'patterntransform',
			'patternunits',
			'points',
			'preservealpha',
			'preserveaspectratio',
			'r',
			'rx',
			'ry',
			'radius',
			'refx',
			'refy',
			'repeatcount',
			'repeatdur',
			'restart',
			'result',
			'rotate',
			'scale',
			'seed',
			'shape-rendering',
			'specularconstant',
			'specularexponent',
			'spreadmethod',
			'stddeviation',
			'stitchtiles',
			'stop-color',
			'stop-opacity',
			'stroke-dasharray',
			'stroke-dashoffset',
			'stroke-linecap',
			'stroke-linejoin',
			'stroke-miterlimit',
			'stroke-opacity',
			'stroke',
			'stroke-width',
			'style',
			'surfacescale',
			'tabindex',
			'targetx',
			'targety',
			'transform',
			'text-anchor',
			'text-decoration',
			'text-rendering',
			'textlength',
			'type',
			'u1',
			'u2',
			'unicode',
			'values',
			'viewbox',
			'visibility',
			'vector-effect',
			'vert-adv-y',
			'vert-origin-x',
			'vert-origin-y',
			'width',
			'word-spacing',
			'wrap',
			'writing-mode',
			'xchannelselector',
			'ychannelselector',
			'x',
			'x1',
			'x2',
			'xmlns',
			'y',
			'y1',
			'y2',
			'z',
			'zoomandpan',

			// MathML
			'accent',
			'accentunder',
			'align',
			'bevelled',
			'close',
			'columnsalign',
			'columnlines',
			'columnspan',
			'denomalign',
			'depth',
			'dir',
			'display',
			'displaystyle',
			'fence',
			'frame',
			'height',
			'href',
			'id',
			'largeop',
			'length',
			'linethickness',
			'lspace',
			'lquote',
			'mathbackground',
			'mathcolor',
			'mathsize',
			'mathvariant',
			'maxsize',
			'minsize',
			'movablelimits',
			'notation',
			'numalign',
			'open',
			'rowalign',
			'rowlines',
			'rowspacing',
			'rowspan',
			'rspace',
			'rquote',
			'scriptlevel',
			'scriptminsize',
			'scriptsizemultiplier',
			'selection',
			'separator',
			'separators',
			'slope',
			'stretchy',
			'subscriptshift',
			'supscriptshift',
			'symmetric',
			'voffset',
			'width',
			'xmlns',

			// XML
			'xlink:href',
			'xml:id',
			'xlink:title',
			'xml:space',
			'xmlns:xlink',
		);
	}
}