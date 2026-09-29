<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Theme_Buttons;

/**
 * The button styles the active theme offers this request, and a signature that changes when they do.
 *
 * Memoizes discovery so the baseline decorator and the cache-version service read the same list. The
 * signature is what lets a Customizer save or a theme switch — which bumps no store version — invalidate
 * every resolved and projected cache that depends on the presets.
 *
 * @since TBD
 */
final class Theme_Button_Styles_Overlay {

	/**
	 * Where the styles are discovered.
	 *
	 * @since TBD
	 *
	 * @var Discovery
	 */
	private Discovery $discovery;

	/**
	 * Per-request memo of the discovered styles. Null until first read.
	 *
	 * @since TBD
	 *
	 * @var array<string, array{label: string, class: string, values: array<string, mixed>, tokens: array<string, mixed>}>|null
	 */
	private ?array $styles = null;

	/**
	 * @since TBD
	 *
	 * @param Discovery $discovery The theme button discovery.
	 */
	public function __construct( Discovery $discovery ) {
		$this->discovery = $discovery;
	}

	/**
	 * The discovered styles keyed by prefixed slug.
	 *
	 * @since TBD
	 *
	 * @return array<string, array{label: string, class: string, values: array<string, mixed>, tokens: array<string, mixed>}>
	 */
	public function styles(): array {
		if ( $this->styles === null ) {
			$this->styles = $this->discovery->styles();
		}

		return $this->styles;
	}

	/**
	 * A short fingerprint of styles(): empty when the theme offers nothing, so a cache key that folds it in
	 * is unchanged in that case.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public function signature(): string {
		$styles = $this->styles();

		if ( $styles === [] ) {
			return '';
		}

		ksort( $styles );

		return md5( (string) wp_json_encode( $styles ) );
	}

	/**
	 * Drop the per-request memo. Used by tests and by the hooks that fire when the theme's button data
	 * changes within a request.
	 *
	 * @since TBD
	 *
	 * @return void
	 */
	public function flush(): void {
		$this->styles = null;
	}
}
