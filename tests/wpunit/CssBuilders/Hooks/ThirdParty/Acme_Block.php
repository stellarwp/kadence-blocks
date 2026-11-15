<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Hooks\ThirdParty;

/**
 * A block of another plugin: it does not extend anything of Kadence Blocks.
 */
final class Acme_Block {

	/**
	 * The CSS of the block, built by its own builder through the Kadence Blocks factory.
	 *
	 * @param array<string, mixed>   $attributes      The block attributes.
	 * @param \Kadence_Blocks_CSS    $css             The CSS builder.
	 * @param string                 $unique_id       The block unique id.
	 * @param string                 $unique_style_id The unique id used for the style handle.
	 *
	 * @return string|null
	 */
	public function build_css( $attributes, $css, $unique_id, $unique_style_id ) {
		return \Kadence_Blocks_Css_Builders::build( Acme_Box_Css::class, $this, 'acme-box', $attributes, $css, $unique_id, $unique_style_id );
	}
}
