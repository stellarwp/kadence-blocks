<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Registry;

use InvalidArgumentException;

/**
 * Immutable record that a block accepts variants. Skeleton for SOFT-3379: holds the block name and
 * the declared variant names. The $extensions…variants.<block> payload shape, $default handling and
 * validation are SOFT-3393.
 *
 * @since TBD
 */
final class Variant_Set {

	/**
	 * The block name.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	public string $block;

	/**
	 * The declared variant names.
	 *
	 * @since TBD
	 *
	 * @var string[]
	 */
	public array $variants;

	/**
	 * @param string   $block    The block name.
	 * @param string[] $variants The declared variant names.
	 */
	private function __construct( string $block, array $variants ) {
		$this->block    = $block;
		$this->variants = $variants;
	}

	/**
	 * Build a variant set from its declaration array.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $set The variant-set declaration.
	 *
	 * @throws InvalidArgumentException When "block" is missing or "variants" is not a list of strings.
	 *
	 * @return self
	 */
	public static function from_array( array $set ): self {
		// Require a present, non-empty string. Avoid empty() so a legitimate "0" block name is not
		// mistaken for a missing value, matching Token_Definition::from_array().
		if ( ! isset( $set['block'] ) || ! is_string( $set['block'] ) || $set['block'] === '' ) {
			throw new InvalidArgumentException( 'Variant-set declaration is missing required string "block".' );
		}

		$declared = $set['variants'] ?? [];
		if ( ! is_array( $declared ) ) {
			throw new InvalidArgumentException( 'Variant-set declaration "variants" must be an array of strings.' );
		}

		// Re-index to a list of validated strings: declarations may key variants (e.g. [ 2 => 'primary' ])
		// and the $variants property is documented as string[]. Full payload validation is SOFT-3393.
		$variants = [];
		foreach ( $declared as $variant ) {
			if ( ! is_string( $variant ) ) {
				throw new InvalidArgumentException( 'Variant-set declaration "variants" must contain only strings.' );
			}

			$variants[] = $variant;
		}

		return new self( $set['block'], $variants );
	}
}
