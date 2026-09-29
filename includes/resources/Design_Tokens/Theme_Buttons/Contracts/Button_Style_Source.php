<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Theme_Buttons\Contracts;

/**
 * Where the button styles the active theme offers are read from.
 *
 * One implementation per kind of theme: the Kadence theme answers from its Customizer sections, a
 * block theme from its theme.json button data, and a classic theme with nothing readable gets the one
 * class-painted preset that keeps today's rendering. Tests hand discovery a fake.
 *
 * @since TBD
 */
interface Button_Style_Source {

	/**
	 * The button styles the active theme offers, keyed by unprefixed slug ("base", "secondary"). Each
	 * entry carries the label the preset is listed under, the classes the theme paints the button with,
	 * and the values the theme currently renders for it, for display (may be empty). An empty array means
	 * this source has nothing to offer, so the next one is asked.
	 *
	 * @since TBD
	 *
	 * @return array<string, array{label: string, class: string, values: array<string, mixed>}>
	 */
	public function styles(): array;
}
