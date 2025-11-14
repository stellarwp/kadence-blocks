<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Rest;

/**
 * Schema definition class for the Performance Optimizer REST API endpoints.
 */
final class Schema {

	/**
	 * Get the parameter schema definitions for the REST API response.
	 *
	 * Defines the structure and validation rules for desktop/mobile viewport data,
	 * including sections, images, and performance metrics used by the optimizer.
	 *
	 * @return array Schema parameter definitions with type validation and descriptions.
	 */
	public function get_params(): array {
		// Definition for the 'section' object, reused for desktop and mobile.
		$section_properties = [
			'id'            => [
				'description' => __( 'The ID attribute of the section element.', 'kadence-blocks' ),
				'type'        => 'string',
			],
			'height'        => [
				'description' => __( 'The height of the section in pixels.', 'kadence-blocks' ),
				'type'        => 'number',
			],
			'tagName'       => [
				'description' => __( 'The HTML tag name of the section element.', 'kadence-blocks' ),
				'type'        => 'string',
			],
			'className'     => [
				'description' => __( 'The CSS classes assigned to this section.', 'kadence-blocks' ),
				'type'        => 'string',
			],
			'path'          => [
				'description' => __( 'The CSS selector path to the element.', 'kadence-blocks' ),
				'type'        => 'string',
			],
			'isAboveFold'   => [
				'description' => __( 'Whether the section is located above the fold.', 'kadence-blocks' ),
				'type'        => 'boolean',
			],
			'hasImages'     => [
				'description' => __( 'Whether the section contains any image elements.', 'kadence-blocks' ),
				'type'        => 'boolean',
			],
			'hasBackground' => [
				'description' => __( 'Whether the section has a background image.', 'kadence-blocks' ),
				'type'        => 'boolean',
			],
		];

		// Definition for the 'image' object.
		$image_properties = [
			'path'          => [
				'description' => __( 'The CSS selector path to the image element.', 'kadence-blocks' ),
				'type'        => 'string',
				'required'    => true,
			],
			'src'           => [
				'description' => __( 'The source URL of the image.', 'kadence-blocks' ),
				'type'        => 'string',
				'format'      => 'uri',
				'required'    => true,
			],
			'srcset'        => [
				'description' => __( 'An array of sources for different resolutions.', 'kadence-blocks' ),
				'type'        => 'array',
				'items'       => [
					'type'       => 'object',
					'properties' => [
						'url'   => [
							'type'     => 'string',
							'format'   => 'uri',
							'required' => true,
						],
						'width' => [
							'type'     => 'integer',
							'required' => true,
						],
					],
				],
			],
			'width'         => [
				'description' => __( 'The rendered width of the image in pixels.', 'kadence-blocks' ),
				'type'        => 'integer',
				'required'    => true,
			],
			'height'        => [
				'description' => __( 'The rendered height of the image in pixels.', 'kadence-blocks' ),
				'type'        => 'integer',
				'required'    => true,
			],
			'widthAttr'     => [
				'description' => __( 'The img element width attribute value.', 'kadence-blocks' ),
				'type'        => 'string',
				'required'    => false,
			],
			'heightAttr'    => [
				'description' => __( 'The img element height attribute value.', 'kadence-blocks' ),
				'type'        => 'string',
				'required'    => false,
			],
			'naturalWidth'  => [
				'description' => __( 'The intrinsic width of the image file in pixels.', 'kadence-blocks' ),
				'type'        => 'integer',
			],
			'naturalHeight' => [
				'description' => __( 'The intrinsic height of the image file in pixels.', 'kadence-blocks' ),
				'type'        => 'integer',
			],
			'aspectRatio'   => [
				'description' => __( 'The aspect ratio of the image.', 'kadence-blocks' ),
				'type'        => 'number',
			],
			'alt'           => [
				'description' => __( 'The alt text of the image.', 'kadence-blocks' ),
				'type'        => [ 'string', 'null' ],
			],
			'class'         => [
				'description' => __( 'The class attribute of the image element.', 'kadence-blocks' ),
				'type'        => [ 'string', 'null' ],
			],
			'loading'       => [
				'description' => __( 'The loading attribute of the image (e.g., \'lazy\', \'eager\', \'auto\').', 'kadence-blocks' ),
				'type'        => 'string',
			],
			'decoding'      => [
				'description' => __( 'The decoding hint for the image (e.g., \'async\', \'sync\', \'auto\').', 'kadence-blocks' ),
				'type'        => 'string',
			],
			'sizes'         => [
				'description' => __( 'The sizes attribute of the image.', 'kadence-blocks' ),
				'type'        => [ 'string', 'null' ],
			],
			'computedStyle' => [
				'description' => __( 'The computed CSS styles of the image element.', 'kadence-blocks' ),
				'type'        => 'object',
				'properties'  => [
					'width'          => [ 'type' => 'string' ],
					'height'         => [ 'type' => 'string' ],
					'objectFit'      => [ 'type' => 'string' ],
					'objectPosition' => [ 'type' => 'string' ],
				],
			],
			'optimalSizes'  => [
				'description' => __( 'A calculated optimal sizes string.', 'kadence-blocks' ),
				'type'        => 'string',
			],
		];

		// Definition for the viewport-specific data (desktop/mobile).
		$viewport_data_properties = [
			'criticalImages'   => [
				'description' => __( 'A list of above the fold image URLs.', 'kadence-blocks' ),
				'type'        => 'array',
				'items'       => [
					'type'   => 'string',
					'format' => 'uri',
				],
				'required'    => true,
			],
			'backgroundImages' => [
				'description' => __( 'A list of URLs for background images.', 'kadence-blocks' ),
				'type'        => 'array',
				'items'       => [
					'type'   => 'string',
					'format' => 'uri',
				],
				'required'    => true,
			],
			'sections'         => [
				'description' => __( 'An array of layout sections.', 'kadence-blocks' ),
				'type'        => 'array',
				'items'       => [
					'type'       => 'object',
					'properties' => $section_properties,
				],
				'required'    => true,
			],
		];

		// The main schema structure.
		return [
			'isStale' => [
				'description' => __( 'Whether this data is stale or expired.', 'kadence-blocks' ),
				'type'        => 'boolean',
				'required'    => false,
				'default'     => false,
			],
			'desktop' => [
				'description' => __( 'Performance and layout data for the desktop viewport.', 'kadence-blocks' ),
				'type'        => 'object',
				'properties'  => $viewport_data_properties,
				'required'    => true,
			],
			'mobile'  => [
				'description' => __( 'Performance and layout data for the mobile viewport.', 'kadence-blocks' ),
				'type'        => 'object',
				'properties'  => $viewport_data_properties,
				'required'    => true,
			],
			'images'  => [
				'description' => __( 'An array of all image objects found on the page.', 'kadence-blocks' ),
				'type'        => 'array',
				'items'       => [
					'type'       => 'object',
					'properties' => $image_properties,
				],
				'required'    => true,
			],
		];
	}

	/**
	 * Get the complete JSON Schema item definition.
	 *
	 * Returns a full JSON Schema (draft-07) compliant structure that can be used
	 * for REST API response validation and documentation generation.
	 *
	 * @return array Complete JSON Schema definition with metadata and property specifications.
	 */
	public function get_item_schema(): array {
		return [
			'$schema'    => 'http://json-schema.org/draft-07/schema#',
			'title'      => __( 'Page Analysis Data', 'kadence-blocks' ),
			'type'       => 'object',
			'properties' => $this->get_params(),
		];
	}
}
