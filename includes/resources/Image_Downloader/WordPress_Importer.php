<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Image_Downloader;

use KadenceWP\KadenceBlocks\Psr\Log\LoggerInterface;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\ImageDownloader\FileNameProcessor;
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
	 * @var LoggerInterface
	 */
	private $logger;

	/**
	 * @param Meta            $meta
	 * @param LoggerInterface $logger
	 */
	public function __construct( Meta $meta, LoggerInterface $logger ) {
		$this->meta   = $meta;
		$this->logger = $logger;
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

			return [ '\\KadenceWP\\KadenceBlocks\\Image_Downloader\\Image_Editor' ];
		}, 8, 1 );

		foreach ( $this->images as $id => $images ) {
			// Grab the scaled image, or fallback to the largest size.
			$scaled_key = array_search( FileNameProcessor::SCALED_SIZE, array_column( $images, 'size' ), true );

			if ( $scaled_key !== false ) {
				$scaled = $this->images[ $id ][ $scaled_key ] ?? end( $this->images[ $id ] );
			} else {
				$scaled = end( $this->images[ $id ] );
			}

			$info         = wp_check_filetype( $scaled->file );
			// Translators: %s is the photographer's name.
			$title        = sprintf( __( 'Photo by %s', 'kadence-blocks' ), $scaled->photographer );
			$filename     = $this->get_file_name( $scaled );
			$uploaded_url = $upload['url'] . "/$filename";

			$attachment = [
				'guid'           => $uploaded_url,
				'post_mime_type' => $info['type'],
				'post_title'     => $title,
				'post_content'   => '',
			];

			$attachment_id = wp_insert_attachment( $attachment, $scaled->file );

			if ( $attachment_id <= 0 ) {
				$this->logger->error( 'Failed to insert attachment', [
					'file' => $scaled->file
				] );

				continue;
			}

			wp_generate_attachment_metadata( $attachment_id, $scaled->file );

			$this->meta->add( $attachment_id, $scaled );

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
