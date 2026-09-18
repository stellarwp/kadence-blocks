<?php declare( strict_types=1 );

namespace Tests\Support\Classes;

use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Contracts\Baseline_Document;

/**
 * A controllable Baseline_Document for tests: returns whatever decoded document it is handed,
 * so a test can drive the Resolver's deep-merge and alias walk without the shipped baseline.json.
 */
final class Fake_Baseline_Document implements Baseline_Document {

	/**
	 * @var array<string, mixed>
	 */
	private array $document;

	/**
	 * @param array<string, mixed> $document
	 */
	public function __construct( array $document = [] ) {
		$this->document = $document;
	}

	public function has( string $id ): bool {
		$node = $this->document;

		foreach ( explode( '.', $id ) as $segment ) {
			if ( ! is_array( $node ) || ! isset( $node[ $segment ] ) ) {
				return false;
			}

			$node = $node[ $segment ];
		}

		return is_array( $node ) && array_key_exists( '$value', $node );
	}

	public function document(): array {
		return $this->document;
	}
}
