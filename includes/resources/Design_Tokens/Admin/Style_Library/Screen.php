<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Admin\Style_Library;

/**
 * Renders the Style Library admin screen mount point.
 *
 * @since 3.8.0
 */
final class Screen {

	/**
	 * The DOM id the React bundle mounts into.
	 *
	 * @since 3.8.0
	 *
	 * @var string
	 */
	private const ROOT_ID = 'kadence-blocks-style-library-root';

	/**
	 * Output the Style Library screen markup.
	 *
	 * @since 3.8.0
	 * @since TBD Prints a notice about Global Styles in the Kadence theme's Full Site Editing mode.
	 *
	 * @return void
	 */
	public function render(): void {
		$this->render_fse_notice();
		?>
		<div class="wrap kadence_blocks_dash kadence-blocks-style-library-wrap">
			<div class="kadence_blocks_dash_head_container">
				<div class="kadence_blocks_dash_wrap">
					<div id="<?php echo esc_attr( self::ROOT_ID ); ?>" class="kadence-blocks-style-library-root"></div>
				</div>
			</div>
		</div>
		<?php
	}

	/**
	 * Print a notice that site-wide colors are managed in Global Styles while the Kadence theme
	 * runs in its Full Site Editing mode.
	 *
	 * @since TBD
	 *
	 * @return void
	 */
	private function render_fse_notice(): void {
		if ( ! kadence_blocks_is_fse_mode() ) {
			return;
		}

		$global_styles_link = sprintf(
			'<a href="%1$s">%2$s</a>',
			esc_url( add_query_arg( 'p', rawurlencode( '/styles' ), admin_url( 'site-editor.php' ) ) ),
			esc_html__( 'Global Styles', 'kadence-blocks' )
		);

		$message = sprintf(
			/* translators: %s: Link to Global Styles in the Site Editor. */
			esc_html__( 'This site uses the Kadence theme in Full Site Editing mode, so site-wide colors are managed in the Site Editor\'s %s.', 'kadence-blocks' ),
			$global_styles_link
		);

		wp_admin_notice(
			$message . ' ' . esc_html__( 'Style Library settings keep applying to the blocks that use them.', 'kadence-blocks' ),
			[
				'type'               => 'info',
				// Keeps core's common.js from moving the notice into the app's markup after its first heading.
				'additional_classes' => [ 'inline' ],
			]
		);
	}
}
