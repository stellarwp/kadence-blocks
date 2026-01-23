<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer;

use KadenceWP\KadenceBlocks\Asset\Asset;
use KadenceWP\KadenceBlocks\Optimizer\Nonce\Nonce;
use KadenceWP\KadenceBlocks\Optimizer\Translation\Text_Repository;

final class Asset_Loader {

	public const OPTIMIZER_SCRIPT_HANDLE = 'kadence-blocks-admin-optimizer';
	public const POST_LIST_STYLE_HANDLE  = 'kadence-blocks-post-list-table';

	private Asset $asset;
	private Text_Repository $text_repository;
	private Nonce $nonce;

	/**
	 * @param Asset           $asset
	 * @param Text_Repository $text_repository
	 * @param Nonce           $nonce
	 */
	public function __construct(
		Asset $asset,
		Text_Repository $text_repository,
		Nonce $nonce
	) {
		$this->asset           = $asset;
		$this->text_repository = $text_repository;
		$this->nonce           = $nonce;
	}

	/**
	 * Enqueue Optimizer scripts when editing a post in Gutenberg.
	 *
	 * @action enqueue_block_editor_assets
	 *
	 * @return void
	 */
	public function enqueue_block_editor_scripts(): void {
		$this->enqueue_optimizer_js();
	}

	/**
	 * Enqueue Optimizer scripts and the post list table column styles.
	 *
	 * @action admin_enqueue_scripts
	 *
	 * @param string $hook The current admin screen.
	 *
	 * @return void
	 */
	public function enqueue_post_list_table( string $hook ): void {
		if ( 'edit.php' !== $hook ) {
			return;
		}

		wp_register_style(
			self::POST_LIST_STYLE_HANDLE,
			$this->asset->get_url( 'includes/assets/css/post-list-table.min.css' ),
			[],
			KADENCE_BLOCKS_VERSION
		);

		wp_enqueue_style( self::POST_LIST_STYLE_HANDLE );

		$this->enqueue_optimizer_js();
	}

	/**
	 * Enqueue the Optimizer scripts.
	 *
	 * @action admin_enqueue_scripts
	 * @action enqueue_block_editor_assets
	 *
	 * @return void
	 */
	private function enqueue_optimizer_js(): void {
		$this->asset->enqueue_script( self::OPTIMIZER_SCRIPT_HANDLE, 'dist/kadence-optimizer' );

		// Add post list table optimizer status translations.
		wp_localize_script(
			self::OPTIMIZER_SCRIPT_HANDLE,
			'kbOptimizerL10n',
			$this->text_repository->all()
		);

		// TODO: probably move this into a new script.
		wp_localize_script(
			self::OPTIMIZER_SCRIPT_HANDLE,
			'kbOptimizer',
			[
				'token' => $this->nonce->create(),
			]
		);
	}
}
