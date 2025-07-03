<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer;

use KadenceWP\KadenceBlocks\Asset\Asset;
use KadenceWP\KadenceBlocks\Optimizer\Nonce\Nonce;
use KadenceWP\KadenceBlocks\Optimizer\Translation\Text_Repository;

final class Asset_Loader {

	public const HANDLE = 'admin-kadence-optimizer';

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
	 * Enqueue the Optimizer JS.
	 *
	 * @action admin_print_styles-edit.php
	 * @action enqueue_block_editor_assets
	 *
	 * @return void
	 */
	public function enqueue(): void {
		$this->asset->enqueue_script( self::HANDLE, 'dist/kadence-optimizer' );

		// Add post list table optimizer status translations.
		wp_localize_script(
			self::HANDLE,
			'kbOptimizerL10n',
			$this->text_repository->all()
		);

		// TODO: probably move this into a new script.
		wp_localize_script(
			self::HANDLE,
			'kbOptimizer',
			[
				'token' => $this->nonce->create(),
			]
		);
	}
}
