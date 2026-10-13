<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Admin\Style_Library;

use Generator;
use KadenceWP\KadenceBlocks\Design_Tokens\Admin\Style_Library\Menu;
use Tests\Support\Classes\TestCase;

final class MenuTest extends TestCase {

	/**
	 * The body-class filter appends the Style Library class exactly once and leaves any
	 * existing classes on the string intact.
	 *
	 * @dataProvider bodyClassesProvider
	 *
	 * @param string $classes  The incoming space-separated body classes.
	 * @param string $expected The expected result after filtering.
	 *
	 * @return void
	 */
	public function testFilterBodyClassAppendsClassAndKeepsExistingClasses( string $classes, string $expected ): void {
		$menu = $this->container->get( Menu::class );

		$this->assertSame( $expected, $menu->filter_body_class( $classes ) );
	}

	/**
	 * The static accessor exposes the same class string the filter callback appends.
	 *
	 * @return void
	 */
	public function testGetBodyClassMatchesFilteredClass(): void {
		$menu = $this->container->get( Menu::class );

		$this->assertSame( 'foo ' . Menu::get_body_class(), $menu->filter_body_class( 'foo' ) );
	}

	/**
	 * Registering the body-class filter wires it onto WordPress' `admin_body_class` hook.
	 *
	 * @return void
	 */
	public function testRegisterBodyClassFilterHooksAdminBodyClass(): void {
		$menu = $this->container->get( Menu::class );

		$menu->register_body_class_filter();

		$this->assertSame( 10, has_filter( 'admin_body_class', [ $menu, 'filter_body_class' ] ) );

		remove_filter( 'admin_body_class', [ $menu, 'filter_body_class' ] );
	}

	/**
	 * The static accessor lists exactly the four core hooks that print admin notices inside
	 * #wpbody-content, in the form core defines them.
	 *
	 * @return void
	 */
	public function testGetAdminNoticeHooksListsAllFourCoreHooks(): void {
		$this->assertSame(
			[ 'admin_notices', 'all_admin_notices', 'user_admin_notices', 'network_admin_notices' ],
			Menu::get_admin_notice_hooks()
		);
	}

	/**
	 * Removing admin notices empties a notice hook even when a callback is already registered
	 * on it, for every one of the four core notice hooks.
	 *
	 * @dataProvider adminNoticeHooksProvider
	 *
	 * @param string $hook_name The notice hook to assert is emptied.
	 *
	 * @return void
	 */
	public function testRemoveAdminNoticesEmptiesEachNoticeHook( string $hook_name ): void {
		add_action( $hook_name, '__return_false' );

		$menu = $this->container->get( Menu::class );
		$menu->remove_admin_notices();

		$this->assertFalse( has_action( $hook_name ) );
	}

	/**
	 * Removing admin notices leaves a hook outside the four notice hooks untouched.
	 *
	 * @return void
	 */
	public function testRemoveAdminNoticesLeavesUnrelatedHookUntouched(): void {
		add_action( 'admin_init', '__return_false', 99 );

		$menu = $this->container->get( Menu::class );
		$menu->remove_admin_notices();

		$this->assertSame( 99, has_action( 'admin_init', '__return_false' ) );

		remove_action( 'admin_init', '__return_false', 99 );
	}

	/**
	 * Data for testFilterBodyClassAppendsClassAndKeepsExistingClasses.
	 *
	 * @return Generator
	 */
	public function bodyClassesProvider(): Generator {
		yield 'empty classes' => [
			'classes'  => '',
			'expected' => ' kadence-blocks-style-library-page',
		];

		yield 'single existing class' => [
			'classes'  => 'wp-admin',
			'expected' => 'wp-admin kadence-blocks-style-library-page',
		];

		yield 'multiple existing classes' => [
			'classes'  => 'wp-admin no-js kadence_page_kadence-blocks',
			'expected' => 'wp-admin no-js kadence_page_kadence-blocks kadence-blocks-style-library-page',
		];
	}

	/**
	 * Data for testRemoveAdminNoticesEmptiesEachNoticeHook: every hook name
	 * Menu::get_admin_notice_hooks() lists, so the provider cannot drift from the source it tests.
	 *
	 * @return Generator
	 */
	public function adminNoticeHooksProvider(): Generator {
		foreach ( Menu::get_admin_notice_hooks() as $hook_name ) {
			yield $hook_name => [ 'hook_name' => $hook_name ];
		}
	}
}
