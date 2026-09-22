<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Admin\Style_Library;

/**
 * Renders the Style Library admin screen mount point.
 *
 * @since TBD
 */
final class Screen {

	/**
	 * The DOM id the React bundle mounts into.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const ROOT_ID = 'kadence-blocks-style-library-root';

	/**
	 * Output the Style Library screen markup.
	 *
	 * @since TBD
	 *
	 * @return void
	 */
	public function render(): void {
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
}
