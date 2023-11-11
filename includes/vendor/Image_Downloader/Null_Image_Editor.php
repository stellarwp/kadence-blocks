<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Image_Downloader;

use KadenceWP\KadenceBlocks\Psr\Log\LoggerInterface;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\ImageDownloader\FileNameProcessor;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\ImageDownloader\Models\DownloadedImage;
use RuntimeException;
use WP_Error;
use WP_Image_Editor;

/**
 * Normally the WP_Image_Editor will create all the different thumbnail sizes on the server,
 * however, we simply return the data of the images that have already been downloaded with
 * the concurrent image downloader.
 */
final class Null_Image_Editor extends WP_Image_Editor {

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

		// Fetch the currently downloaded images from the Importer.
		$this->images = kadence_blocks()->get( WordPress_Importer::class )->images();

		// Find the image WordPress is currently processing by matching the file name.
		foreach ( $this->images as $id => $images ) {
			// Grab the scaled image, or fallback to the largest size.
			$scaled_key = array_search( FileNameProcessor::SCALED_SIZE, array_column( $images, 'size' ), true );
			$scaled     = $images[ $scaled_key ] ?? end( $images );

			if ( $this->file !== $scaled->file ) {
				continue;
			}

			$this->image = $scaled;
			$this->id    = $id;
			break;
		}

		if ( $this->image === null ) {
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
	 * This is for old versions of WordPress.
	 *
	 * @inheritDoc
	 */
	public function multi_resize( $sizes ) {
		throw new RuntimeException( 'method not implemented' );
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
	 * @TODO This may still not be properly matching images, if only WordPress provided a thumbnail id...
	 *
	 * @param array{width?: int, height?: int, crop?: bool} $size_data
	 *
	 * @return WP_Error|array{path: string, file: string, width: int, height: int, mime-type: string, filesize: int}
	 * @throws \InvalidArgumentException
	 */
	public function make_subsize( $size_data ) {
		if ( ! isset( $size_data['width'] ) && ! isset( $size_data['height'] ) ) {
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

		$original_width  = $this->image->width;
		$original_height = $this->image->height;

		// Pexels has the ability to make images larger than their original size, but WordPress doesn't.
		if ( ( $original_width < $size_data['width'] ) || ( $original_height < $size_data['height'] ) ) {
			$original_width  = $original_width * 5;
			$original_height = $original_height * 5;
		}

		$dims = image_resize_dimensions( $original_width, $original_height, $size_data['width'], $size_data['height'], $size_data['crop'] );

		if ( $dims ) {
			[ $dst_x, $dst_y, $src_x, $src_y, $dst_w, $dst_h, $src_w, $src_h ] = $dims;
		} else {
			// Fallback to originally requested dimensions.
			$dst_w = $size_data['width'];
			$dst_h = $size_data['height'];
		}

		foreach ( $this->images[ $this->id ] as $image ) {
			// Account for slight variations between WordPress's calculations and Pexel's resizing.
			// TODO: This probably needs more work and testing to match images.
			if ( ! str_contains( $image->file, sprintf( '%dx%d', $dst_w, $dst_h ) ) &&
			     ! str_contains( $image->file, sprintf( '%dx%d', $dst_w - 1, $dst_h ) ) &&
			     ! str_contains( $image->file, sprintf( '%dx%d', $dst_w, $dst_h -1 ) ) &&
			     ! str_contains( $image->file, sprintf( '%dx%d', $dst_w -1 , $dst_h -1 ) ) &&
				! str_contains( $image->file, sprintf( '%dx%d', $size_data['width'], $size_data['height'] ) )
			) {
				continue;
			}

			$original    = $this->image;
			$this->image = $image;

			$saved = $this->save();

			$this->image = $original;

			return $saved;
		}

		kadence_blocks()->get( LoggerInterface::class )->error( 'Cannot match image to size data', [
			'file'             => $this->image->file,
			'file_max_width'   => $this->image->width,
			'file_max_height'  => $this->image->height,
			'requested_width'  => $size_data['width'],
			'requested_height' => $size_data['height'],
		] );

		return new WP_Error( 'image_subsize_create_error', __( 'Cannot resize the image.' ) );
	}
}
