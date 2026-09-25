<?php declare( strict_types=1 );

namespace Tests\Support\Classes;

use KadenceWP\KadenceBlocks\Design_Tokens\Theme_Buttons\Contracts\Button_Style_Source;

/**
 * A button style source the tests drive directly, so discovery can be exercised without a theme.
 */
final class Fake_Button_Style_Source implements Button_Style_Source {

	/**
	 * @var array<string, array{label: string, class: string, values: array<string, mixed>, tokens?: array<string, mixed>}>
	 */
	private array $styles;

	/**
	 * @param array<string, array{label: string, class: string, values: array<string, mixed>, tokens?: array<string, mixed>}> $styles The styles to return.
	 */
	public function __construct( array $styles = [] ) {
		$this->styles = $styles;
	}

	/**
	 * Replace the styles this source returns.
	 *
	 * @param array<string, array{label: string, class: string, values: array<string, mixed>, tokens?: array<string, mixed>}> $styles The new styles.
	 *
	 * @return void
	 */
	public function set( array $styles ): void {
		$this->styles = $styles;
	}

	/**
	 * @inheritDoc
	 */
	public function styles(): array {
		return $this->styles;
	}
}
