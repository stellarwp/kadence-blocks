<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Lazy_Load;

use InvalidArgumentException;
use KadenceWP\KadenceBlocks\Optimizer\Path\Path;
use KadenceWP\KadenceBlocks\Optimizer\Path\Path_Factory;
use KadenceWP\KadenceBlocks\Optimizer\Response\Section;
use KadenceWP\KadenceBlocks\Optimizer\Response\WebsiteAnalysis;
use KadenceWP\KadenceBlocks\Optimizer\Store\Contracts\Store;
use KadenceWP\KadenceBlocks\Traits\Viewport_Trait;
use WP_HTML_Tag_Processor;

/**
 * Process section Optimization data to set content visibility on the Kadence row layout block.
 */
final class Element_Lazy_Loader {

	use Viewport_Trait;

	/**
	 * Sections cache for this request.
	 *
	 * @var array<int, Section>
	 */
	private ?array $sections;

	/**
	 * CSS classes that will exclude a section from being lazy loaded.
	 *
	 * @var string[]
	 */
	private array $excluded_classes;
	private Store $store;
	private ?Path $path;

	/**
	 * @param Store        $store The optimizer store.
	 * @param Path_Factory $path_factory The path factory.
	 * @param string[]     $excluded_classes CSS classes that will exclude a section from being
	 *     lazy loaded.
	 */
	public function __construct(
		Store $store,
		Path_Factory $path_factory,
		array $excluded_classes
	) {
		$this->store            = $store;
		$this->excluded_classes = $excluded_classes;

		try {
			$this->path = $path_factory->make();
		} catch ( InvalidArgumentException $e ) {
			$this->path = null;
		}
	}

	/**
	 * Add content-visibility CSS to below the fold Kadence row elements.
	 *
	 * @filter kadence_blocks_row_wrapper_args
	 *
	 * @param array<string, mixed> $args The wrapper div HTML attributes.
	 * @param array<string, mixed> $attributes The current block attributes.
	 *
	 * @return array<string, mixed>
	 */
	public function modify_row_layout_block_wrapper_args( array $args, array $attributes ): array {
		$unique_id = $attributes['uniqueID'] ?? false;

		if ( ! $unique_id ) {
			return $args;
		}

		$classes = (string) ( $args['class'] ?? '' );

		// Explode class string into array for exact matching.
		$class_list = array_filter( preg_split( '/\s+/', $classes ) );

		// Bypass lazy loading if we find an excluded class (exact match only).
		foreach ( $this->excluded_classes as $excluded_class ) {
			if ( in_array( $excluded_class, $class_list, true ) ) {
				return $args;
			}
		}

		$analysis = $this->get_analysis();

		if ( ! $analysis ) {
			return $args;
		}

		$sections = $this->get_sections( $analysis );

		foreach ( $sections as $section ) {
			// Search for the unique ID in the class attribute.
			if ( ! str_contains( $section->className, $unique_id ) ) {
				continue;
			}

			if ( $section->height <= 0 ) {
				continue;
			}

			$current_style = $args['style'] ?? '';

			// Prepend our content visibility style.
			$args['style'] = $this->prepend_style( $section->height, $current_style );
		}

		return $args;
	}

	/**
	 * Set content visibility on found kadence/column sections.
	 *
	 * @filter kadence_blocks_column_html
	 *
	 * @param string $html The kadence/column html.
	 *
	 * @return string
	 */
	public function modify_column_html( string $html ): string {
		$p = new WP_HTML_Tag_Processor( $html );

		if ( $p->next_tag( [ 'class' => 'wp-block-kadence-column' ] ) ) {
			$class_name = $p->get_attribute( 'class' );

			$analysis = $this->get_analysis();

			if ( ! $analysis ) {
				return $html;
			}

			$sections = $this->get_sections( $analysis );

			// Match the class attribute.
			foreach ( $sections as $section ) {
				if ( $section->className !== $class_name ) {
					continue;
				}

				if ( $section->height <= 0 ) {
					continue;
				}

				$current_style = (string) $p->get_attribute( 'style' );

				// Prepend content visibility style.
				$style = $this->prepend_style( $section->height, $current_style );

				$p->set_attribute( 'style', $style );

				return $p->get_updated_html();
			}
		}

		return $html;
	}

	/**
	 * Flush the memoization cache.
	 *
	 * @return void
	 */
	public function flush(): void {
		unset( $this->sections );
	}

	/**
	 * Get the analysis for this request.
	 *
	 * @return WebsiteAnalysis|null
	 */
	private function get_analysis(): ?WebsiteAnalysis {
		if ( ! $this->path ) {
			return null;
		}

		return $this->store->get( $this->path );
	}

	/**
	 * Get the below the fold sections for the current viewport.
	 *
	 * @param WebsiteAnalysis $analysis The analysis object.
	 *
	 * @return Section[]
	 */
	private function get_sections( WebsiteAnalysis $analysis ): array {
		return $this->sections ??= $this->is_mobile() ? $analysis->mobile->getBelowTheFoldSections() : $analysis->desktop->getBelowTheFoldSections();
	}

	/**
	 * Prepend the content-visibility styles to existing an existing style string.
	 *
	 * @param float  $height The section height.
	 * @param string $current_style The current style.
	 *
	 * @return string
	 */
	private function prepend_style( float $height, string $current_style ): string {
		return sprintf(
			'content-visibility: auto;contain-intrinsic-size: auto %dpx;%s',
			$height,
			$current_style
		);
	}
}
