<?php declare( strict_types=1 );
// cspell:ignore unseed .

namespace Tests\Support\Classes;

use KadenceWP\KadenceBlocks\Design_Tokens\Theme_Buttons\Theme_Button_Styles_Overlay;

/**
 * Lets a test decide which button styles "the theme" offers, by answering the discovery filter and
 * flushing the overlay so every memo downstream rebuilds from the new signature.
 */
trait Seeds_Theme_Presets {

	/**
	 * The styles to answer with; null leaves discovery alone.
	 *
	 * @var array<string, array{label: string, class: string, values: array<string, mixed>, tokens?: array<string, mixed>}>|null
	 */
	private ?array $seeded_theme_styles = null;

	/**
	 * The filter callback: the seeded styles replace whatever the adapters found.
	 *
	 * @param array<string, mixed> $styles The discovered styles.
	 *
	 * @return array<string, mixed>
	 */
	public function answer_theme_styles( array $styles ): array {
		return $this->seeded_theme_styles ?? $styles;
	}

	/**
	 * Make discovery offer exactly these styles (unprefixed slugs), e.g. [ 'base' => [...], 'secondary' => [...] ].
	 * An empty array means "the theme offers nothing": the classic fallback is bypassed too, because the
	 * filter runs after it.
	 *
	 * @param array<string, array{label: string, class: string, values: array<string, mixed>, tokens?: array<string, mixed>}> $styles The styles.
	 *
	 * @return void
	 */
	protected function seed_theme_presets( array $styles ): void {
		$this->seeded_theme_styles = $styles;

		if ( ! has_filter( 'kadence_blocks_theme_button_styles', [ $this, 'answer_theme_styles' ] ) ) {
			add_filter( 'kadence_blocks_theme_button_styles', [ $this, 'answer_theme_styles' ], 100 );
		}

		$this->container->get( Theme_Button_Styles_Overlay::class )->flush();
	}

	/**
	 * A shortcut for the common shape: theme presets by unprefixed slug with today's classes and no values.
	 *
	 * @param string[] $slugs The unprefixed slugs to offer, from base, secondary.
	 *
	 * @return void
	 */
	protected function seed_theme_preset_slugs( array $slugs ): void {
		$known = [
			'base'      => [
				'label'  => 'Theme Base',
				'class'  => 'wp-block-button__link button kb-btn-global-inherit',
				'values' => [],
			],
			'secondary' => [
				'label'  => 'Theme Secondary',
				'class'  => 'wp-block-button__link button button-style-secondary kb-btn-global-inherit',
				'values' => [],
			],
		];

		$this->seed_theme_presets( array_intersect_key( $known, array_flip( $slugs ) ) );
	}

	/**
	 * Drop the seed and the filter; call from tearDown().
	 *
	 * @return void
	 */
	protected function unseed_theme_presets(): void {
		remove_filter( 'kadence_blocks_theme_button_styles', [ $this, 'answer_theme_styles' ], 100 );
		$this->seeded_theme_styles = null;
		$this->container->get( Theme_Button_Styles_Overlay::class )->flush();
	}
}
