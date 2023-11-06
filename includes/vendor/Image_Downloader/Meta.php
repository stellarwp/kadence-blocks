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
	public const IMAGE_HASH              = '_kadence_blocks_image_hash';

	public const DELETABLE = [
		self::PEXELS_PHOTOGRAPHER,
		self::PEXELS_PHOTOGRAPHER_URL,
		self::IMAGE_HASH,
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
			self::IMAGE_HASH              => $image->url ? sha1( $image->url ) : '',
		];

		foreach ( $meta as $meta_key => $value ) {
			if ( strlen( $value ) <= 0 ) {
				continue;
			}

			update_post_meta( $attachment_id, $meta_key, sanitize_text_field( $value ) );
		}
	}

	/**
	 * Delete image metadata when an attachment is deleted.
	 *
	 * @action delete_attachment
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
