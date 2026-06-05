<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Foundation_Presets;

use KadenceWP\KadenceBlocks\Design_Tokens\Foundation_Presets\Exception\Unknown_Preset_Exception;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Contracts\Baseline_Document;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Extensions;

/**
 * Reads the foundation-preset catalogue — the beginner on-ramp's "what can I pick?" surface.
 *
 * Foundation presets are best-practice bundles of PRIMITIVE values a non-expert chooses instead of
 * hand-authoring tokens: typographic type scales (minor third, major third, …) and starter color
 * palettes. They live in the shipped baseline under
 * `$extensions.<namespace>.foundationPresets.<group>.<slug>` and are read-only here — applying a choice
 * (which seeds the primitive layer as store overrides) is {@see Preset_Selector}.
 *
 * The baseline is the single source of truth; this class never holds its own copy of the catalogue.
 *
 * @since TBD
 */
final class Foundation_Presets {

	/**
	 * @var Baseline_Document The shipped, read-only baseline the catalogue is read from.
	 *
	 * @since TBD
	 */
	private Baseline_Document $baseline;

	/**
	 * @since TBD
	 *
	 * @param Baseline_Document $baseline The shipped baseline document.
	 */
	public function __construct( Baseline_Document $baseline ) {
		$this->baseline = $baseline;
	}

	/**
	 * The available preset group keys, e.g. ["typeScale", "colorPalette"].
	 *
	 * @since TBD
	 *
	 * @return string[]
	 */
	public function groups(): array {
		return array_keys( $this->catalogue() );
	}

	/**
	 * The selectable presets in a group as slug => label, with the structural "$default" key skipped.
	 *
	 * @since TBD
	 *
	 * @param string $group The preset group key.
	 *
	 * @throws Unknown_Preset_Exception When the group does not exist.
	 *
	 * @return array<string, string>
	 */
	public function options( string $group ): array {
		$options = [];

		foreach ( $this->group_set( $group ) as $slug => $preset ) {
			if ( $slug === Extensions::get_default_key() || ! is_array( $preset ) ) {
				continue;
			}

			$label = $preset[ Extensions::get_label_key() ] ?? '';

			$options[ (string) $slug ] = is_string( $label ) && $label !== '' ? $label : (string) $slug;
		}

		return $options;
	}

	/**
	 * The group's default preset slug, or an empty string when none is declared.
	 *
	 * @since TBD
	 *
	 * @param string $group The preset group key.
	 *
	 * @throws Unknown_Preset_Exception When the group does not exist.
	 *
	 * @return string
	 */
	public function default_for( string $group ): string {
		$default = $this->group_set( $group )[ Extensions::get_default_key() ] ?? '';

		return is_string( $default ) ? $default : '';
	}

	/**
	 * A preset's flat token map: primitive dot-path => raw value. This is what {@see Preset_Selector}
	 * turns into store overrides.
	 *
	 * @since TBD
	 *
	 * @param string $group  The preset group key.
	 * @param string $choice The preset slug within the group.
	 *
	 * @throws Unknown_Preset_Exception When the group or choice does not exist.
	 *
	 * @return array<string, mixed>
	 */
	public function tokens_for( string $group, string $choice ): array {
		$set = $this->group_set( $group );

		// "$default" names a preset, it is not one itself.
		if ( $choice === Extensions::get_default_key() || ! isset( $set[ $choice ] ) || ! is_array( $set[ $choice ] ) ) {
			throw Unknown_Preset_Exception::for_choice( $group, $choice );
		}

		$tokens = $set[ $choice ][ Extensions::get_tokens_key() ] ?? [];

		return is_array( $tokens ) ? $tokens : [];
	}

	/**
	 * The presets in a group (named presets plus the "$default" key), or throw when the group is unknown.
	 *
	 * @since TBD
	 *
	 * @param string $group The preset group key.
	 *
	 * @throws Unknown_Preset_Exception When the group does not exist.
	 *
	 * @return array<string, mixed>
	 */
	private function group_set( string $group ): array {
		$catalogue = $this->catalogue();

		if ( ! isset( $catalogue[ $group ] ) || ! is_array( $catalogue[ $group ] ) ) {
			throw Unknown_Preset_Exception::for_group( $group );
		}

		return $catalogue[ $group ];
	}

	/**
	 * The whole foundation-presets section from the baseline, or an empty array when absent.
	 *
	 * @since TBD
	 *
	 * @return array<string, mixed>
	 */
	private function catalogue(): array {
		$node = $this->baseline->document();

		foreach ( [ Extensions::get_extensions_key(), Extensions::get_namespace(), Extensions::get_section_foundation_presets() ] as $key ) {
			if ( ! is_array( $node ) || ! isset( $node[ $key ] ) ) {
				return [];
			}

			$node = $node[ $key ];
		}

		return is_array( $node ) ? $node : [];
	}
}
