<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Image_Downloader;

use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\ImageDownloader\Models\DownloadedImage;

/**
 * Manages Kadence/Pexels image meta.
 */
final class Meta {

	public const ATTACHMENT_ALT          = '_wp_attachment_image_alt';
	public const PEXELS_PHOTOGRAPHER     = '_pexels_photographer';
	public const PEXELS_PHOTOGRAPHER_URL = '_pexels_photographer_url';
	public const PEXELS_ID               = '_pexels_id';

	public const DELETABLE = [
		self::PEXELS_PHOTOGRAPHER,
		self::PEXELS_PHOTOGRAPHER_URL,
		self::PEXELS_ID,
	];

	/**
	 * Insert additional image metadata when downloaded images are added.
	 *
	 * @param int             $attachment_id
	 * @param DownloadedImage $image
	 *
	 * @return void
	 */
	public function add( int $attachment_id, DownloadedImage $image ): void {
		$meta = [
			self::ATTACHMENT_ALT          => $image->alt,
			self::PEXELS_PHOTOGRAPHER     => $image->photographer,
			self::PEXELS_PHOTOGRAPHER_URL => $image->photographer_url,
			self::PEXELS_ID               => $image->id,
		];

		foreach ( $meta as $meta_key => $value ) {
			if ( strlen( (string) $value ) <= 0 ) {
				continue;
			}

			update_post_meta( $attachment_id, $meta_key, wp_slash( sanitize_text_field( $value ) ) );
		}
	}

	/**
	 * Delete image metadata.
	 *
	 * @param int $attachment_id
	 *
	 * @return void
	 */
	public function delete( int $attachment_id ): void {
		foreach ( self::DELETABLE as $meta_key ) {
			delete_post_meta( $attachment_id, $meta_key );
		}
	}

}
