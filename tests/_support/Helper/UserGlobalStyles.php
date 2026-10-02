<?php

declare( strict_types=1 );

namespace Helper;

use Codeception\Module;
use Codeception\TestInterface;
use WP_Theme_JSON_Resolver;

/**
 * Stores user-origin Global Styles (the site's `wp_global_styles` post) for a
 * test and deletes the post after it.
 */
final class UserGlobalStyles extends Module {

	/**
	 * The `wp_global_styles` post the test wrote, 0 when it wrote none.
	 */
	private int $post_id = 0;

	public function _after( TestInterface $test ): void {
		if ( 0 === $this->post_id ) {
			return;
		}

		wp_delete_post( $this->post_id, true );
		$this->post_id = 0;
		wp_clean_theme_json_cache();
	}

	/**
	 * Replaces the user Global Styles with the given data.
	 *
	 * The post is written as an administrator, like a save from the Site Editor:
	 * - it is tied to the theme through the `wp_theme` term, which is only
	 *   assigned when the current user may do so, and the resolver never finds a
	 *   post without it;
	 * - for a user without `unfiltered_html`, core's KSES filter removes all of
	 *   `settings.custom` from the saved content.
	 *
	 * @param array<string, mixed> $data Global Styles data without the `version` and
	 *                                   `isGlobalStylesUserThemeJSON` keys.
	 *
	 * @return int The post ID.
	 */
	public function store_user_global_styles( array $data ): int {
		$user_id = get_current_user_id();
		wp_set_current_user( $this->administrator_id() );

		$post = WP_Theme_JSON_Resolver::get_user_data_from_wp_global_styles( wp_get_theme(), true );

		$this->assertArrayHasKey( 'ID', $post, 'Could not create the user Global Styles post.' );

		$content = wp_json_encode(
			array_merge(
				[
					'version'                     => 3,
					'isGlobalStylesUserThemeJSON' => true,
				],
				$data
			)
		);

		$this->assertIsString( $content, 'Could not encode the Global Styles data.' );

		wp_update_post(
			[
				'ID'           => $post['ID'],
				'post_content' => wp_slash( $content ),
			]
		);

		wp_set_current_user( $user_id );

		$this->post_id = $post['ID'];
		wp_clean_theme_json_cache();

		return $this->post_id;
	}

	/**
	 * @return int An administrator's user ID, created when the site has none.
	 */
	private function administrator_id(): int {
		$admins = get_users(
			[
				'role'   => 'administrator',
				'number' => 1,
				'fields' => 'ID',
			]
		);

		if ( $admins ) {
			return absint( $admins[0] );
		}

		$user_id = wp_insert_user(
			[
				'user_login' => 'global-styles-admin',
				'user_pass'  => wp_generate_password(),
				'role'       => 'administrator',
			]
		);

		$this->assertIsInt( $user_id, 'Could not create an administrator.' );

		return $user_id;
	}
}
