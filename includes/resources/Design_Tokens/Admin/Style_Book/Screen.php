<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Admin\Style_Book;

/**
 * Renders the Style Book admin screen mount point.
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
	private const ROOT_ID = 'kadence-style-book-root';

	/**
	 * The DOM id the React bundle mounts into.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_root_id(): string {
		return self::ROOT_ID;
	}

	/**
	 * Output the Style Book screen markup.
	 *
	 * @since TBD
	 *
	 * @return void
	 */
	public function render(): void {
		?>
		<div class="wrap kadence_blocks_dash kadence-style-book-wrap">
			<div class="kadence_blocks_dash_head_container">
				<div class="kadence_blocks_dash_wrap">
					<div id="<?php echo esc_attr( self::ROOT_ID ); ?>" class="kadence-style-book-root"></div>
				</div>
			</div>
		</div>
		<?php
	}
}
