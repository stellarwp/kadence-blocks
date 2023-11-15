<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Image_Downloader;

use KadenceWP\KadenceBlocks\Psr\Log\LoggerInterface;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\ImageDownloader\FileNameProcessor;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\ImageDownloader\Models\DownloadedImage;
use KadenceWP\KadenceBlocks\Traits\Image_Size_Trait;
use RuntimeException;
use WP_Error;
use WP_Image_Editor;

/**
 * Normally the WP_Image_Editor will create all the different thumbnail sizes on the server,
 * however, we simply return the data of the images that have already been downloaded with
 * the concurrent image downloader.
 */
final class Image_Editor extends WP_Image_Editor {

	use Image_Size_Trait;

	/**
	 * The collection of all downloaded images.
	 *
	 * @var array<int, DownloadedImage[]>
	 */
	private $images = [];

	/**
	 * The current DownloadedImage being processed.
	 *
	 * @var DownloadedImage
	 */
	private $image;

	/**
	 * The current Pexels ID being processed.
	 *
	 * @var int
	 */
	private $id;

	/**
	 * @var LoggerInterface
	 */
	private $logger;

	/**
	 * Tests if this Image Editor is supported.
	 *
	 * @param array $args
	 *
	 * @return bool
	 */
	public static function test( $args = [] ): bool {
		return true;
	}

	/**
	 * We support all mime types because this editor is only loaded
	 * when the Image Downloader is executed.
	 *
	 * @param string $mime_type
	 *
	 * @return true
	 */
	public static function supports_mime_type( $mime_type ): bool {
		return true;
	}

	/**
	 * This is always called first, so basically an init method.
	 *
	 * @inheritDoc
	 */
	public function load() {
		if ( $this->file === null ) {
			return new WP_Error( 'error_loading_image', __( 'File cannot be null.' ) );
		}

		$this->logger = kadence_blocks()->get( LoggerInterface::class );

		// Fetch the currently downloaded images from the Importer.
		$this->images = kadence_blocks()->get( WordPress_Importer::class )->images();

		// Find the image WordPress is currently processing by matching the file name.
		foreach ( $this->images as $id => $images ) {
			// Grab the scaled image, or fallback to the largest size.
			$scaled_key = array_search( FileNameProcessor::SCALED_SIZE, array_column( $images, 'size' ), true );

			if ( $scaled_key !== false ) {
				$scaled = $images[ $scaled_key ] ?? end( $images );
			} else {
				$scaled = end( $images );
			}

			if ( $this->file !== $scaled->file ) {
				continue;
			}

			$this->image = $scaled;
			$this->id    = $id;
			break;
		}

		if ( $this->image === null ) {
			$this->logger->error( 'Cannot find downloaded file', [
				'file' => $this->file,
			] );

			return new WP_Error( 'error_loading_image', __( 'Cannot find downloaded file.' ), $this->file );
		}

		return true;
	}

	/**
	 * @inheritDoc
	 *
	 * @return array{path: string, file: string, width: int, height: int, mime-type: string, filesize: int}
	 */
	public function save( $destfilename = null, $mime_type = null ): array {
		$image_size = wp_getimagesize( $this->image->file );

		return [
			'path'      => $this->image->file,
			'file'      => wp_basename( $this->image->file ),
			'width'     => $image_size[0],
			'height'    => $image_size[1],
			'mime-type' => $image_size['mime'],
			'filesize'  => wp_filesize( $this->image->file ),
		];
	}

	/**
	 * Our images are already resized, just return true.
	 *
	 * @inheritDoc
	 */
	public function resize( $max_w, $max_h, $crop = false ) {
		return true;
	}

	/**
	 * Create multiple smaller images from a single source.
	 *
	 * Attempts to create all sub-sizes and returns the meta data at the end.
	 *
	 * As of 5.3.0 the preferred way to do this is with `make_subsize()`. It creates
	 * the new images one at a time and allows for the meta data to be saved after
	 * each new image is created.
	 *
	 * @param array<string, array{width?: int, height?: int, crop?: bool}> $sizes
	 *
	 * @return array<string,array{path: string, file: string, width: int, height: int, mime-type: string, filesize: int}> An array of resized images' metadata by size.
	 *
	 * @throws \InvalidArgumentException
	 */
	public function multi_resize( $sizes ) {
		$this->logger->debug( 'Using old multi_resize method' );

		$metadata = [];

		foreach ( $sizes as $size => $size_data ) {
			$meta = $this->make_subsize( $size_data );

			if ( ! is_wp_error( $meta ) ) {
				$metadata[ $size ] = $meta;

				continue;
			}

			$this->logger->error( 'Unable to make image subsize', [
				'file'   => $this->image->file,
				'errors' => $meta->get_error_messages(),
			] );
		}

		return $metadata;
	}

	/**
	 * Our images are already cropped, just return true.
	 *
	 * @inheritDoc
	 */
	public function crop( $src_x, $src_y, $src_w, $src_h, $dst_w = null, $dst_h = null, $src_abs = false ) {
		return true;
	}

	/**
	 * @inheritDoc
	 */
	public function rotate( $angle ) {
		throw new RuntimeException( 'method not implemented' );
	}

	/**
	 * @inheritDoc
	 */
	public function flip( $horz, $vert ) {
		throw new RuntimeException( 'method not implemented' );
	}

	/**
	 * @inheritDoc
	 */
	public function stream( $mime_type = null ) {
		throw new RuntimeException( 'method not implemented' );
	}

	/**
	 * Find our already made sub-sized images in our image collection.
	 *
	 * @param array{width?: int, height?: int, crop?: bool} $size_data
	 *
	 * @return WP_Error|array{path: string, file: string, width: int, height: int, mime-type: string, filesize: int}
	 * @throws \InvalidArgumentException
	 */
	public function make_subsize( $size_data ) {
		if ( ! isset( $size_data['width'] ) && ! isset( $size_data['height'] ) ) {
			$this->logger->error( 'Cannot resize the image. Both width and height are not set.', [
				'file' => $this->image->file,
			] );

			return new WP_Error( 'image_subsize_create_error', __( 'Cannot resize the image. Both width and height are not set.' ) );
		}

		if ( ! isset( $size_data['width'] ) ) {
			$size_data['width'] = null;
		}

		if ( ! isset( $size_data['height'] ) ) {
			$size_data['height'] = null;
		}

		if ( ! isset( $size_data['crop'] ) ) {
			$size_data['crop'] = false;
		}

		$existing_sizes = $this->get_image_sizes();
		$thumbnail_id = '';

		// Find the thumbnail name based on the requested dimensions.
		foreach ( $existing_sizes as $existing_size ) {
			if ( $existing_size['width'] === $size_data['width'] && $existing_size['height'] === $size_data['height'] ) {
				$thumbnail_id = $existing_size['id'];
				break;
			}
		}

		if ( strlen( $thumbnail_id ) === 0 ) {
			$this->logger->error( 'Could not find thumbnail size', [
				'file'             => $this->image->file,
				'requested_width'  => $size_data['width'],
				'requested_height' => $size_data['height'],
			] );

			return new WP_Error( 'image_subsize_create_error', __( 'Cannot resize the image.' ) );
		}

		// Find the matching file for the requested thumbnail size and get its metadata.
		foreach ( $this->images[ $this->id ] as $key => $image ) {
			if ( $image->size !== $thumbnail_id ) {
				continue;
			}

			$original    = $this->image;
			$this->image = $image;

			$saved = $this->save();

			$this->image = $original;

			unset( $this->images[ $this->id ][ $key ] );

			return $saved;
		}

		$this->logger->error( 'Cannot match image to size data', [
			'file'             => $this->image->file,
			'file_max_width'   => $this->image->width,
			'file_max_height'  => $this->image->height,
			'requested_width'  => $size_data['width'],
			'requested_height' => $size_data['height'],
		] );

		return new WP_Error( 'image_subsize_create_error', __( 'Cannot resize the image.' ) );
	}

}
