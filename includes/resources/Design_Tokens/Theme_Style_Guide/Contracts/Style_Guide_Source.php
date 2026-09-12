<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Theme_Style_Guide\Contracts;

/**
 * Where the active theme's Style Guide is read from.
 *
 * One implementation reads the Kadence theme (Style_Guide_Reader); tests hand the overlay a fake.
 * The snapshot is raw theme data — decoding the palette JSON aside, no interpretation happens here.
 * Picking the active palette set and turning it into token values is the mapper's job, so that
 * logic stays unit-testable without a theme.
 *
 * @since TBD
 */
interface Style_Guide_Source {

	/**
	 * The theme's Style Guide as raw data, or null when the source is not available (the Kadence theme is
	 * not active), so callers can tell "nothing to read" from "read, but empty".
	 *
	 * @since TBD
	 *
	 * @return array{palette: array<string, mixed>, settings: array<string, mixed>}|null
	 */
	public function snapshot(): ?array;
}
