<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Image_Downloader;

final class Response_Formatter {

	/**
	 * Format already imported image responses.
	 *
	 * @param array<array{
	 *       collection_slug?: string,
	 *       image_type?: string,
	 *       images: array<int, array{
	 *            id: int,
	 *            width: int,
	 *            height: int,
	 *            alt: string,
	 *            url: string,
	 *            photographer: string,
	 *            photographer_url: string,
	 *            avg_color: string,
	 *            sizes: non-empty-array<int,array{name: string, src: string}>
	 *       }>
	 *      }> $collections
	 *
	 * @return array<array{id: int, url: string}>
	 */
	public function format( array $collections ): array {
		$formatted = [];

		foreach ( $collections as $images ) {
			foreach ( $images as $image ) {
				$formatted[] = [
					'id'  => $image['id'],
					'url' => reset( $image['sizes'] )['src'],
				];
			}
		}

		return $formatted;
	}

}
