<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Health;

use KadenceWP\KadenceBlocks\Notice\Notice_Handler;
use KadenceWP\KadenceBlocks\StellarWP\Uplink\Notice\Notice;

final class Required_Function_Verifier {

	/**
	 * An array indexed by PHP function names to check are enabled and the Notice
	 * type to render if they aren't.
	 *
	 * @var array<string, string>
	 */
	private array $function_map;

	private Notice_Handler $notice_handler;

	/**
	 * @param array<string, string> $function_map
	 */
	public function __construct( array $function_map, Notice_Handler $notice_handler ) {
		$this->function_map   = $function_map;
		$this->notice_handler = $notice_handler;
	}

	/**
	 * When on the Kadence Blocks settings page, show notices if any functions are disabled.
	 *
	 * @hook admin_notices
	 */
	public function verify_functions(): void {
		$screen = get_current_screen();

		if ( $screen && $screen->id !== 'toplevel_page_kadence-blocks' ) {
			return;
		}

		foreach ( $this->function_map as $function => $type ) {
			if ( function_exists( $function ) ) {
				continue;
			}

			$this->notice_handler->add( new Notice(
				$type,
				// translators: %1$s is the function name, %2$s is "required" or "suggested".
				sprintf(
					__( 'The "%1$s" function is disabled via PHP and is %2$s by Kadence Blocks. Ask your administrator to enable it.', 'kadence-blocks' ),
					$function,
					$type === Notice::ERROR ? __( 'required', 'kadence-blocks' ) : __( 'suggested', 'kadence-blocks' ),
				),
				true
			) );
		}

		$this->notice_handler->display();
	}
}
