<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Image_Downloader;

use Exception;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\ImageDownloader\Models\DownloadedImage;

final class WordPress_Importer {

	/**
	 * The image data, indexed by Pexels ID.
	 *
	 * @var array<int, DownloadedImage[]>
	 */
	private $images = [];

	/**
	 * Manages image metadata.
	 *
	 * @var Meta
	 */
	private $meta;

	/**
	 * @param Meta $meta
	 */
	public function __construct( Meta $meta ) {
		$this->meta = $meta;
	}

	/**
	 * @return array<int, DownloadedImage[]>
	 */
	public function images(): array {
		return $this->images;
	}

	/**
	 * Import already downloaded images into the WordPress media library.
	 *
	 * @param array<int, array<string, DownloadedImage>> $collections
	 *
	 * @return array<array{id: int, url: string}>
	 * @throws Exception
	 */
	public function import( array $collections ): array {
		$upload = wp_get_upload_dir();
		$stored = [];

		if ( ! function_exists( 'wp_generate_attachment_metadata' ) ) {
			include( ABSPATH . 'wp-admin/includes/image.php' );
		}

		// Combine thumbnail images under their Pexels ID.
		foreach ( $collections as $images ) {
			foreach ( $images as $image ) {
				$this->images[ $image->id ][] = $image;
			}
		}

		// Override the WP image editor with our custom null editor.
		$existing_editors = [];
		add_filter( 'wp_image_editors', static function ( $editors ) use ( &$existing_editors ) {
			$existing_editors = $editors;

			return [ '\\KadenceWP\\KadenceBlocks\\Image_Downloader\\Null_Image_Editor' ];
		}, 8, 1 );

		foreach ( $this->images as $id => $images ) {
			$largest = end( $this->images[ $id ] );

			$info         = wp_check_filetype( $largest->file );
			$title        = sprintf( __( 'Photo by %s', 'kadence-blocks' ), $largest->photographer );
			$filename     = $this->get_file_name( $largest );
			$uploaded_url = $upload['url'] . "/$filename";

			$attachment = [
				'guid'           => $uploaded_url,
				'post_mime_type' => $info['type'],
				'post_title'     => $title,
				'post_content'   => '',
			];

			$attachment_id = wp_insert_attachment( $attachment, $largest->file );

			if ( $attachment_id <= 0 ) {
				throw new Exception( 'Failed to insert attachment' );
			}

			wp_generate_attachment_metadata( $attachment_id, $largest->file );

			$this->meta->add( $attachment_id, $largest );

			$stored[] = [
				'id'  => $attachment_id,
				'url' => $uploaded_url,
			];
		}

		// Reset the original WP image editors.
		add_filter( 'wp_image_editors', static function () use ( $existing_editors ) {
			return $existing_editors;
		}, 9, 0 );

		return $stored;
	}

	/**
	 * Get the file name and extension from a server path.
	 *
	 * @param DownloadedImage $image
	 *
	 * @return string
	 */
	private function get_file_name( DownloadedImage $image ): string {
		return pathinfo( $image->file, PATHINFO_BASENAME );
	}

}
