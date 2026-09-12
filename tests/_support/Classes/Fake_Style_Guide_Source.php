<?php declare( strict_types=1 );
// cspell:ignore palette .

namespace Tests\Support\Classes;

use KadenceWP\KadenceBlocks\Design_Tokens\Theme_Style_Guide\Contracts\Style_Guide_Source;

/**
 * A Style Guide source the tests drive directly, so the overlay can be exercised without the Kadence
 * theme being active.
 */
final class Fake_Style_Guide_Source implements Style_Guide_Source {

	/**
	 * The snapshot to return, or null to model "the Kadence theme is not active".
	 *
	 * @var array{palette: array<string, mixed>, settings: array<string, mixed>}|null
	 */
	private ?array $snapshot;

	/**
	 * @param array{palette: array<string, mixed>, settings: array<string, mixed>}|null $snapshot The snapshot to return.
	 */
	public function __construct( ?array $snapshot = null ) {
		$this->snapshot = $snapshot;
	}

	/**
	 * A source whose active set carries the given slot colors.
	 *
	 * @param array<string, string> $colors Slot slug => color.
	 * @param string                $set    The palette set to put them in, and to mark active.
	 *
	 * @return self
	 */
	public static function with_palette( array $colors, string $set = 'palette' ): self {
		$entries = [];

		foreach ( $colors as $slug => $color ) {
			$entries[] = [
				'color' => $color,
				'name'  => strtoupper( $slug ),
				'slug'  => $slug,
			];
		}

		return new self(
			[
				'palette'  => [
					'active' => $set,
					$set     => $entries,
				],
				'settings' => [],
			]
		);
	}

	/**
	 * Replace the snapshot this source returns.
	 *
	 * @param array{palette: array<string, mixed>, settings: array<string, mixed>}|null $snapshot The new snapshot.
	 *
	 * @return void
	 */
	public function set( ?array $snapshot ): void {
		$this->snapshot = $snapshot;
	}

	/**
	 * @inheritDoc
	 */
	public function snapshot(): ?array {
		return $this->snapshot;
	}
}
