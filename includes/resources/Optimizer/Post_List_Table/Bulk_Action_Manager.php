<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Post_List_Table;

/**
 * Adds actions to the Post List Table's "bulk actions" dropdown.
 */
final class Bulk_Action_Manager {

	public const OPTIMIZE_POSTS      = 'kb_optimize_posts';
	public const REMOVE_OPTIMIZATION = 'kb_optimize_remove';

	/**
	 * Add bulk actions to the post list table. These are then handled by the frontend js
	 * under Optimizer/assets/js/bulk-actions/index.js
	 *
	 * @filter bulk_actions-edit-post
	 * @filter bulk_actions-edit-page
	 *
	 * @param array<string, string|array<string, string>> $actions The existing actions.
	 *
	 * @return array<string, string|array<string, string>>
	 */
	public function register_actions( array $actions ): array {
		$actions[ __( 'KB Optimizer', 'kadence-blocks' ) ] = [
			self::OPTIMIZE_POSTS      => __( 'Optimize', 'kadence-blocks' ),
			self::REMOVE_OPTIMIZATION => __( 'Remove Optimization', 'kadence-blocks' ),
		];

		return $actions;
	}
}
