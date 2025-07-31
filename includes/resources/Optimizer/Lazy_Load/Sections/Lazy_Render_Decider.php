<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Lazy_Load\Sections;

use KadenceWP\KadenceBlocks\Optimizer\Analysis_Registry;

/**
 * Decide whether we should lazy render a section or not.
 */
class Lazy_Render_Decider {

	private Analysis_Registry $registry;

	/**
	 * A list of CSS classes that will bypass lazy rendering.
	 *
	 * @var string[]
	 */
	private array $excluded_classes;

	public function __construct(
		Analysis_Registry $registry,
		array $excluded_classes
	) {
		$this->registry         = $registry;
		$this->excluded_classes = $excluded_classes;
	}

	/**
	 * Whether we should lazy load a section.
	 *
	 * @param string[] $class_list The class of classes to check.
	 *
	 * @return bool
	 */
	public function should_lazy_render( array $class_list ): bool {
		foreach ( $this->excluded_classes as $excluded_class ) {
			if ( in_array( $excluded_class, $class_list, true ) ) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Get a section's height by a Kadence unique ID.
	 *
	 * @param string $unique_id The unique ID, e.g. 1722_f1b7a6-ea.
	 *
	 * @return float
	 */
	public function get_section_height_by_unique_id( string $unique_id ): float {
		foreach ( $this->registry->get_valid_sections() as $class_attr => $height ) {
			if ( str_contains( $class_attr, $unique_id ) ) {
				return $height;
			}
		}

		return 0.0;
	}

	/**
	 * Get a section's height by matching the complete class attribute value.
	 *
	 * @param string $class_attr The class attribute, e.g. `kb-row-layout-wrap kb-row-layout-id1722_ab152a-75 alignfull`.
	 *
	 * @return float
	 */
	public function get_section_height_by_class_attr( string $class_attr ): float {
		return $this->registry->get_valid_sections()[ $class_attr ] ?? 0.0;
	}
}
