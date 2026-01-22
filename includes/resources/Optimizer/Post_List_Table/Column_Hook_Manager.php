<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Post_List_Table;

/**
 * Manages WordPress hooks for post list table columns.
 */
final class Column_Hook_Manager {

	/**
	 * @var Column_Registrar[]
	 */
	private array $columns;

	/**
	 * @param Column_Registrar[] $columns
	 */
	public function __construct( array $columns ) {
		$this->columns = $columns;
	}

	/**
	 * Register hooks for all columns on applicable post types.
	 *
	 * @return void
	 */
	public function register_hooks(): void {
		$post_types = $this->get_applicable_post_types();

		foreach ( $this->columns as $column ) {
			foreach ( $post_types as $post_type ) {
				$this->register_column_hooks( $column, $post_type );
			}
		}
	}

	/**
	 * Get post types that should have optimizer columns.
	 *
	 * @return string[]
	 */
	private function get_applicable_post_types(): array {
		$post_types = get_post_types(
			[
				'show_ui' => true,
			],
		);

		$post_types = array_filter( $post_types, static fn( $pt ): bool => is_post_type_viewable( $pt ) );

		/**
		 * @param string[] $excluded_post_types Post type names to exclude.
		 */
		$excluded = apply_filters(
			'kadence_blocks_excluded_optimizer_post_types',
			[
				'attachment',
				'advanced_page',
				'kadence_element',
				'kt_reviews',
				'kt_size_chart',
			]
		);

		return array_diff( $post_types, $excluded );
	}

	/**
	 * Register WordPress hooks for a specific column and post type.
	 *
	 * @param Column_Registrar $column The column to register.
	 * @param string           $post_type The post type name this will be applied to.
	 *
	 * @return void
	 */
	private function register_column_hooks( Column_Registrar $column, string $post_type ): void {
		add_filter(
			"manage_{$post_type}_posts_columns",
			[ $column, 'add_header' ]
		);

		add_action(
			"manage_{$post_type}_posts_custom_column",
			[ $column, 'render' ],
			10,
			2
		);

		add_filter(
			"manage_edit-{$post_type}_sortable_columns",
			[ $column, 'mark_sortable' ]
		);

		add_action(
			'pre_get_posts',
			[ $column, 'sort' ],
		);
	}
}
