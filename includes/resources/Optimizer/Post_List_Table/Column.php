<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Post_List_Table;

use InvalidArgumentException;

/**
 * Represents a column in a post list table.
 */
final class Column {

	public string $slug;
	public string $label;
	public string $meta_key;

	/**
	 * @param string $slug The column slug.
	 * @param string $label The i18n friendly label.
	 * @param string $meta_key The meta key to sort by.
	 *
	 * @throws InvalidArgumentException If slug or label are empty or whitespace-only.
	 */
	public function __construct(
		string $slug,
		string $label,
		string $meta_key
	) {
		if ( empty( trim( $slug ) ) ) {
			throw new InvalidArgumentException( 'Column slug cannot be empty.' );
		}

		if ( empty( trim( $label ) ) ) {
			throw new InvalidArgumentException( 'Column label cannot be empty.' );
		}

		$this->slug     = $slug;
		$this->label    = $label;
		$this->meta_key = $meta_key;
	}
}
