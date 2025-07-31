<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer\Post_List_Table;

use KadenceWP\KadenceBlocks\Optimizer\Post_List_Table\Column;
use KadenceWP\KadenceBlocks\Optimizer\Post_List_Table\Column_Hook_Manager;
use KadenceWP\KadenceBlocks\Optimizer\Post_List_Table\Column_Registrar;
use KadenceWP\KadenceBlocks\Optimizer\Post_List_Table\Contracts\Renderable;
use Tests\Support\Classes\TestCase;

/**
 * Test the Column_Hook_Manager class.
 */
final class ColumnHookManagerTest extends TestCase {

	private Column_Hook_Manager $hook_manager;
	private Column_Registrar $column_registrar;
	private string $test_post_type;

	protected function setUp(): void {
		parent::setUp();

		// Create a test post type.
		$this->test_post_type = 'test_post_type';
		register_post_type(
			$this->test_post_type,
			[
				'public'  => true,
				'show_ui' => true,
			]
		);

		// Create a mock column registrar.
		$column = new Column( 'test_column', 'Test Column', 'test_meta_key' );

		/** @var Renderable $renderer */
		$renderer = $this->createMock( Renderable::class );

		$this->column_registrar = new Column_Registrar( $column, $renderer );
		$this->hook_manager     = new Column_Hook_Manager( [ $this->column_registrar ] );
	}

	protected function tearDown(): void {
		// Clean up the test post type.
		unregister_post_type( $this->test_post_type );

		parent::tearDown();
	}

	public function testRegisterHooksAddsFiltersAndActionsForViewablePostTypes(): void {
		$this->hook_manager->register_hooks();

		// Check that the column header filter was added.
		$this->assertTrue(
			has_filter( "manage_{$this->test_post_type}_posts_columns" ),
			'Column header filter should be registered for viewable post type'
		);

		// Check that the custom column action was added.
		$this->assertTrue(
			has_action( "manage_{$this->test_post_type}_posts_custom_column" ),
			'Custom column action should be registered for viewable post type'
		);

		// Check that the sortable columns filter was added.
		$this->assertTrue(
			has_filter( "manage_edit-{$this->test_post_type}_sortable_columns" ),
			'Sortable columns filter should be registered for viewable post type'
		);

		// Check that the pre_get_posts action was added.
		$this->assertTrue(
			has_action( 'pre_get_posts' ),
			'pre_get_posts action should be registered for sorting'
		);
	}

	public function testRegisterHooksSkipsAttachmentPostType(): void {
		// Register hooks.
		$this->hook_manager->register_hooks();

		// Attachment should be excluded by default.
		$this->assertFalse(
			has_filter( 'manage_attachment_posts_columns' ),
			'Column header filter should not be registered for attachment post type'
		);
	}

	public function testRegisterHooksRespectsExcludedPostTypesFilter(): void {
		// Add our test post type to the excluded list.
		add_filter(
			'kadence_blocks_excluded_optimizer_post_types',
			function ( array $excluded ): array {
				$excluded[] = $this->test_post_type;
				return $excluded;
			}
		);

		$this->hook_manager->register_hooks();

		// The excluded post type should not have hooks registered.
		$this->assertFalse(
			has_filter( "manage_{$this->test_post_type}_posts_columns" ),
			'Column header filter should not be registered for excluded post type'
		);

		// Clean up filter.
		remove_all_filters( 'kadence_blocks_excluded_optimizer_post_types' );
	}

	public function testRegisterHooksSkipsNonViewablePostTypes(): void {
		// Create a non-viewable post type.
		$non_viewable_type = 'non_viewable_type';
		register_post_type(
			$non_viewable_type,
			[
				'public'      => false,
				'show_ui'     => true,
				'can_export'  => false,
				'has_archive' => false,
			]
		);

		$this->hook_manager->register_hooks();

		// Non-viewable post type should not have hooks registered.
		$this->assertFalse(
			has_filter( "manage_{$non_viewable_type}_posts_columns" ),
			'Column header filter should not be registered for non-viewable post type'
		);

		// Clean up.
		unregister_post_type( $non_viewable_type );
	}

	public function testRegisterHooksWorksWithMultipleColumns(): void {
		// Create a second column registrar.
		$second_column = new Column( 'second_column', 'Second Column', 'second_column_key' );

		/** @var Renderable $renderer */
		$renderer = $this->createMock( Renderable::class );

		$second_registrar = new Column_Registrar( $second_column, $renderer );

		// Create hook manager with multiple columns.
		$multi_hook_manager = new Column_Hook_Manager( [ $this->column_registrar, $second_registrar ] );

		$multi_hook_manager->register_hooks();

		// Both columns should have their hooks registered.
		$this->assertTrue(
			has_filter( "manage_{$this->test_post_type}_posts_columns" ),
			'Column header filter should be registered for both columns'
		);

		// Check that we have multiple callbacks for the same hook.
		global $wp_filter;
		$callbacks = $wp_filter[ "manage_{$this->test_post_type}_posts_columns" ]->callbacks[10] ?? [];
		$this->assertGreaterThanOrEqual(
			2,
			count( $callbacks ),
			'Should have at least 2 callbacks registered for column headers'
		);
	}

	public function testRegisterHooksOnlyRegistersForPostTypesWithShowUI(): void {
		// Create a post type without show_ui.
		$no_ui_type = 'no_ui_type';
		register_post_type(
			$no_ui_type,
			[
				'public'  => true,
				'show_ui' => false,
			]
		);

		$this->hook_manager->register_hooks();

		// Post type without show_ui should not have hooks registered.
		$this->assertFalse(
			has_filter( "manage_{$no_ui_type}_posts_columns" ),
			'Column header filter should not be registered for post type without show_ui'
		);

		// Clean up.
		unregister_post_type( $no_ui_type );
	}

	public function testRegisterHooksWithEmptyColumnsArray(): void {
		$empty_hook_manager = new Column_Hook_Manager( [] );

		// Should not throw any errors.
		$empty_hook_manager->register_hooks();

		// No hooks should be registered for empty columns.
		$this->assertFalse(
			has_filter( "manage_{$this->test_post_type}_posts_columns" ),
			'No column header filters should be registered when no columns provided'
		);
	}
}
