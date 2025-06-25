<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Post_List_Table;

use KadenceWP\KadenceBlocks\Optimizer\Post_List_Table\Contracts\Renderable;
use KadenceWP\KadenceBlocks\Optimizer\Post_List_Table\Contracts\Sort_Strategy;
use WP_Query;

/**
 * Registers Post List Table columns.
 */
final class Column_Registrar {

	private Column $column;
	private Sort_Strategy $sort_strategy;
	private Renderable $renderable;

	public function __construct(
		Column $column,
		Sort_Strategy $sort_strategy,
		Renderable $renderable
	) {
		$this->column        = $column;
		$this->sort_strategy = $sort_strategy;
		$this->renderable    = $renderable;
	}

	/**
	 * Add the column header to the table.
	 *
	 * @filter manage_{$post_type}_posts_columns
	 *
	 * @param string[] $columns The existing columns.
	 *
	 * @return string[]
	 */
	public function add_header( array $columns ): array {
		$columns[ $this->column->slug ] = $this->column->label;

		return $columns;
	}

	/**
	 * Mark the column as sortable.
	 *
	 * @filter manage_{$this->screen->id}_sortable_columns
	 *
	 * @param array $columns
	 *
	 * @return array
	 */
	public function mark_sortable( array $columns ): array {
		/* translators: %s: The column label */
		$ordered_by = sprintf( __( 'Table ordered by %s', 'kadence-blocks' ), $this->column->label );

		$columns[ $this->column->slug ] = [
			$this->column->slug,
			true,
			$this->column->label,
			$ordered_by,
			'desc',
		];

		return $columns;
	}

	/**
	 * Attempt to sort the column by its strategy.
	 *
	 * @action pre_get_posts
	 *
	 * @param WP_Query $query
	 *
	 * @return void
	 */
	public function sort( WP_Query $query ): void {
		$this->sort_strategy->sort( $query, $this->column );
	}

	/**
	 * Render the column value.
	 *
	 * @filter manage_{$post->post_type}_posts_custom_column
	 *
	 * @param string $slug
	 * @param int    $post_id
	 *
	 * @return void
	 */
	public function render( string $slug, int $post_id ): void {
		if ( $slug !== $this->column->slug ) {
			return;
		}

		$this->renderable->render( $post_id );
	}
}
