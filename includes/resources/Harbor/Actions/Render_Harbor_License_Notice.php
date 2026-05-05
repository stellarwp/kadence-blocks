<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Harbor\Actions;

/**
 * Renders the Harbor (Liquid Web Software Manager) notice on legacy Uplink license forms.
 *
 * @since 3.7.0
 */
final class Render_Harbor_License_Notice {

	/**
	 * @var string
	 */
	private $product_name;

	/**
	 * @param string $product_name
	 */
	public function __construct( string $product_name ) {
		$this->product_name = $product_name;
	}

	/**
	 * Renders a Harbor notice below the save button on a Kadence Uplink license field.
	 *
	 * @since 3.7.0
	 *
	 * @return void
	 */
	public function __invoke(): void {
		$url = lw_harbor_get_license_page_url();
		if ( empty( $url ) ) {
			return;
		}
		?>
		<hr style="margin: 20px 0;"/>
		<h4><span class="dashicons dashicons-info" style="vertical-align: middle; margin-right: 4px;"></span><?php esc_html_e( 'Liquid Web Software Manager', 'kadence-blocks' ); ?></h4>
		<p class="tooltip description"><?php echo wp_kses(
			sprintf(
				/* translators: 1: product name, 2: URL to the Liquid Web Software Manager page. */
				__( '%1$s is now part of Liquid Web\'s software offerings. This field is still available for managing legacy licenses from your previous %1$s account. If you purchased a new plan through Liquid Web, your products are managed through the <a href="%2$s">Liquid Web Software Manager</a>.', 'kadence-blocks' ),
				esc_html( $this->product_name ),
				esc_url( $url )
			),
			[ 'a' => [ 'href' => [] ] ]
		); ?></p>
		<?php
	}

}
