<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Image_Downloader;

final class Pexels_ID_Registry {

	/**
	 * A reverse map of keyed post_id => pexels_id and pexels_id => post_id.
	 *
	 * @note A bit worried about memory issues here, but this is a more efficient
	 * query than making thousands of meta queries.
	 *
	 * @var array{post_ids: array<int, int>, pexels_ids: array<int, int>}
	 */
	private $ids = [];

	/**
	 * Returns a reverse map of keyed post_id => pexels_id and pexels_id => post_id.
	 *
	 * @return array{post_ids: array<int, int>, pexels_ids: array<int, int>}
	 */
	public function all(): array {
		global $wpdb;

		if ( ! empty( array_filter( $this->ids ) ) ) {
			return $this->ids;
		}

		/** @var array<int, array{post_id: string, pexels_id: string}> $hashes */
		$ids = $wpdb->get_results( $wpdb->prepare( "
			SELECT `post_id`, `meta_value` as pexels_id
			FROM $wpdb->postmeta
			WHERE `meta_key` = %s
			",
			Meta::PEXELS_ID
		), ARRAY_A );

		foreach ( $ids as $id ) {
			$this->ids['post_ids'][ (int) $id['post_id'] ]     = (int) $id['pexels_id'];
			$this->ids['pexels_ids'][ (int) $id['pexels_id'] ] = (int) $id['post_id'];
		}

		return $this->ids;
	}
}
