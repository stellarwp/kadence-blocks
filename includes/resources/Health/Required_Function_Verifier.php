<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Health;

use KadenceWP\KadenceBlocks\Notice\Notice_Handler;
use KadenceWP\KadenceBlocks\StellarWP\Uplink\Notice\Notice;

final class Required_Function_Verifier {

	/**
	 * An array indexed by PHP function names to check are enabled, where a true value is
	 *  they are required and a false value is they are suggested.
	 *
	 * @var array<string, bool>
	 */
	private array $function_map;

	private Notice_Handler $notice_handler;

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

		foreach ( $this->function_map as $function => $required ) {
			if ( function_exists( $function ) ) {
				continue;
			}

			$this->notice_handler->add( new Notice(
				$required ? Notice::ERROR : Notice::WARNING,
				sprintf(
					__( 'The <code>%s</code> function is disabled via PHP and is %s by Kadence Blocks. Ask your administrator to enable it.', 'kadence-blocks' ),
					$required ? __( 'required', 'kadence-blocks' ) : __( 'suggested', 'kadence-blocks' ),
					$function
				),
			) );
		}

		$this->notice_handler->display();
	}
}
