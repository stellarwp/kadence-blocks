<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Post_List_Table\Renderers;

use KadenceWP\KadenceBlocks\Optimizer\Nonce\Nonce;
use KadenceWP\KadenceBlocks\Optimizer\Post_List_Table\Contracts\Renderable;
use KadenceWP\KadenceBlocks\Optimizer\Response\WebsiteAnalysis;
use KadenceWP\KadenceBlocks\Optimizer\Store\Meta_Store;
use KadenceWP\KadenceBlocks\Optimizer\Translation\Text_Repository;

final class Optimizer_Renderer implements Renderable {

	private const ACTION_CLASS = 'action_class';
	private const ACTION_TEXT  = 'action_text';
	private const STATUS_TEXT  = 'status_text';

	private Meta_Store $store;
	private Text_Repository $text_repository;
	private Nonce $nonce;

	public function __construct(
		Meta_Store $store,
		Text_Repository $text_repository,
		Nonce $nonce
	) {
		$this->store           = $store;
		$this->text_repository = $text_repository;
		$this->nonce           = $nonce;
	}

	/**
	 * Display a link to run/remove optimization data if the current user has the correct permissions.
	 *
	 * @param int $post_id The post ID.
	 *
	 * @return void
	 */
	public function render( int $post_id ): void {
		if ( ! $this->is_post_optimizable( $post_id ) ) {
			echo esc_html( $this->text_repository->get( Text_Repository::NOT_OPTIMIZABLE ) );

			return;
		}

		$analysis    = $this->store->get( $post_id );
		$render_data = $this->get_render_data( $post_id, $analysis );

		// User can't perform an action, just show them the status.
		if ( ! $this->user_can_manage_optimization( $post_id, $analysis ) ) {
			echo esc_html( $render_data[ self::STATUS_TEXT ] );

			return;
		}

		$this->render_action_link( $post_id, $render_data );
	}

	/**
	 * Check if the post can be optimized.
	 *
	 * @param int $post_id The post ID.
	 *
	 * @return bool
	 */
	private function is_post_optimizable( int $post_id ): bool {
		$post_url = get_permalink( $post_id );
		$status   = get_post_status( $post_id );

		return $post_url && ! is_wp_error( $post_url ) && $status === 'publish';
	}

	/**
	 * Get the render data for the optimization action.
	 *
	 * @param int                  $post_id The post ID.
	 * @param WebsiteAnalysis|null $analysis The optimization analysis data.
	 *
	 * @return array{action_class: string, action_text: string, status_text: string}
	 */
	private function get_render_data( int $post_id, ?WebsiteAnalysis $analysis ): array {
		if ( ! $analysis ) {
			return [
				self::ACTION_CLASS => 'kb-optimize-post',
				self::ACTION_TEXT  => $this->text_repository->get( Text_Repository::RUN_OPTIMIZER ),
				self::STATUS_TEXT  => $this->text_repository->get( Text_Repository::NOT_OPTIMIZED ),
			];
		}

		$is_outdated = get_post_datetime( $post_id, 'modified', 'gmt' ) > $analysis->lastModified;

		if ( $is_outdated ) {
			return [
				self::ACTION_CLASS => 'kb-optimize-post',
				self::ACTION_TEXT  => $this->text_repository->get( Text_Repository::OPTIMIZATION_OUTDATED_RUN ),
				self::STATUS_TEXT  => $this->text_repository->get( Text_Repository::OPTIMIZATION_OUTDATED ),
			];
		}

		return [
			self::ACTION_CLASS => 'kb-remove-post-optimization',
			self::ACTION_TEXT  => $this->text_repository->get( Text_Repository::REMOVE_OPTIMIZATION ),
			self::STATUS_TEXT  => $this->text_repository->get( Text_Repository::OPTIMIZED ),
		];
	}

	/**
	 * Check if the current user can manage optimization for this post.
	 *
	 * @param int                  $post_id The post ID.
	 * @param WebsiteAnalysis|null $analysis The optimization analysis data.
	 *
	 * @return bool
	 */
	private function user_can_manage_optimization( int $post_id, ?WebsiteAnalysis $analysis ): bool {
		return $analysis
			? current_user_can( 'delete_post', $post_id )
			: current_user_can( 'edit_post', $post_id );
	}

	/**
	 * Render the action link for optimization management.
	 *
	 * @param int   $post_id The post ID.
	 * @param array $render_data The render data.
	 *
	 * @return void
	 */
	private function render_action_link( int $post_id, array $render_data ): void {
		$post_url = get_permalink( $post_id );

		printf(
			'<a href="#" class="%s" data-post-id="%d" data-post-url="%s" data-nonce="%s">%s</a>',
			esc_attr( $render_data[ self::ACTION_CLASS ] ),
			esc_attr( $post_id ),
			esc_attr( esc_url( $post_url ) ),
			esc_attr( $this->nonce->create() ),
			esc_html( $render_data[ self::ACTION_TEXT ] )
		);
	}
}
