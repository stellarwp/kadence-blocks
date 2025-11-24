<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer;

class State {

	public const SETTINGS_KEY = 'performance_optimizer_enabled';

	/**
	 * The default state of the Optimizer if no
	 * settings have been saved.
	 */
	public const DEFAULT_STATE = false;

	/**
	 * Whether the Optimizer is enabled.
	 *
	 * @return bool
	 */
	public function enabled(): bool {
		$settings_json = (string) get_option( 'kadence_blocks_settings', '' );

		if ( ! $settings_json ) {
			return self::DEFAULT_STATE;
		}

		$settings = json_decode( $settings_json, true );

		if ( ! is_array( $settings ) ) {
			return self::DEFAULT_STATE;
		}

		return filter_var(
			$settings[ self::SETTINGS_KEY ] ?? self::DEFAULT_STATE,
			FILTER_VALIDATE_BOOL,
			FILTER_NULL_ON_FAILURE
		) ?? self::DEFAULT_STATE;
	}
}
