<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer\Path;

use InvalidArgumentException;
use KadenceWP\KadenceBlocks\Optimizer\Path\Path_Factory;
use Tests\Support\Classes\OptimizerTestCase;

final class PathFactoryTest extends OptimizerTestCase {

	private Path_Factory $path_factory;

	protected function setUp(): void {
		parent::setUp();

		// Set pretty permalinks for post ID resolution.
		update_option( 'permalink_structure', '/%postname%/' );

		$this->path_factory = $this->container->get( Path_Factory::class );
	}

	public function testItHandlesRootPath(): void {
		$_SERVER['REQUEST_URI'] = '/';

		$path = $this->path_factory->make();

		$this->assertSame( '/', $path->path() );
		$this->assertNull( $path->post_id() );
	}

	public function testItStripsQueryString(): void {
		$_SERVER['REQUEST_URI'] = '/wp-login.php?redirect_to=/dashboard';

		$path = $this->path_factory->make();

		$this->assertSame( '/wp-login.php', $path->path() );
	}

	public function testItNormalizesMultipleSlashes(): void {
		$_SERVER['REQUEST_URI'] = '/wp//includes///file.php';

		$path = $this->path_factory->make();

		$this->assertSame( '/wp/includes/file.php', $path->path() );
	}

	public function testItNormalizesTripleSlashesAtStart(): void {
		$_SERVER['REQUEST_URI'] = '///wp-login.php';

		$path = $this->path_factory->make();

		$this->assertSame( '/wp-login.php', $path->path() );
	}

	public function testItHasEmptyPathWhenRequestUriMissing(): void {
		$this->expectException( InvalidArgumentException::class );
		$this->expectExceptionMessage( 'Cannot hash an empty path. Verify you are using this after the wp hook fired.' );

		unset( $_SERVER['REQUEST_URI'] );

		$this->path_factory->make();
	}

	public function testItHasEmptyPathWhenRequestUriEmpty(): void {
		$this->expectException( InvalidArgumentException::class );
		$this->expectExceptionMessage( 'Cannot hash an empty path. Verify you are using this after the wp hook fired.' );

		$_SERVER['REQUEST_URI'] = '';

		$this->path_factory->make();
	}

	public function testItNormalizesLeadingSlashesAndStripsQuery(): void {
		$_SERVER['REQUEST_URI'] = '///wp/wp-login.php?foo=bar';

		$path = $this->path_factory->make();

		$this->assertSame( '/wp/wp-login.php', $path->path() );
	}

	public function testItHandlesTrailingSlash(): void {
		$_SERVER['REQUEST_URI'] = '/wp-login.php/';

		$path = $this->path_factory->make();

		$this->assertSame( '/wp-login.php/', $path->path() );
	}

	public function testItAddsLeadingSlashWhenMissing(): void {
		$_SERVER['REQUEST_URI'] = 'page/subpage';

		$path = $this->path_factory->make();

		$this->assertSame( '/page/subpage', $path->path() );
	}

	public function testItHandlesPathOfZero(): void {
		$_SERVER['REQUEST_URI'] = '/0';

		$path = $this->path_factory->make();

		$this->assertSame( '/0', $path->path() );
	}

	public function testItStripsFragments(): void {
		$_SERVER['REQUEST_URI'] = '/page#section';

		$path = $this->path_factory->make();

		$this->assertSame( '/page', $path->path() );
	}

	public function testItHandlesQueryOnlyUri(): void {
		$this->expectException( InvalidArgumentException::class );
		$this->expectExceptionMessage( 'Cannot hash an empty path. Verify you are using this after the wp hook fired.' );

		$_SERVER['REQUEST_URI'] = '?query=value';

		$this->path_factory->make();
	}

	public function testItHandlesComplexQueryString(): void {
		$_SERVER['REQUEST_URI'] = '/page?foo=bar&baz=qux#anchor';

		$path = $this->path_factory->make();

		$this->assertSame( '/page', $path->path() );
	}

	public function testItHandlesUrlEncodedPath(): void {
		$_SERVER['REQUEST_URI'] = '/page%20with%20spaces/file.php';

		$path = $this->path_factory->make();

		$this->assertSame( '/page%20with%20spaces/file.php', $path->path() );
	}

	public function testItNormalizesMixedMultipleSlashes(): void {
		$_SERVER['REQUEST_URI'] = '//path///to////file.php';

		$path = $this->path_factory->make();

		$this->assertSame( '/path/to/file.php', $path->path() );
	}

	public function testItHandlesPathWithOnlySlashes(): void {
		$_SERVER['REQUEST_URI'] = '/////';

		$path = $this->path_factory->make();

		$this->assertSame( '/', $path->path() );
	}

	public function testItResolvesPostIdFromQueriedObject(): void {
		// Create a test post.
		$post_id = $this->factory()->post->create(
			[
				'post_title'  => 'Test Post',
				'post_status' => 'publish',
				'post_name'   => 'test-post',
			]
		);

		// Set up global $post object for get_post().
		global $post, $wp_query;
		$original_post               = $post ?? null;
		$original_queried_object_id  = $wp_query->queried_object_id ?? 0;
		$post                        = get_post( $post_id );
		$wp_query->queried_object    = $post;
		$wp_query->queried_object_id = $post_id;

		$_SERVER['REQUEST_URI'] = '/test-post/';

		$path = $this->path_factory->make();

		$this->assertSame( '/test-post/', $path->path() );
		$this->assertSame( $post_id, $path->post_id() );

		// Clean up.
		$post                        = $original_post;
		$wp_query->queried_object    = null;
		$wp_query->queried_object_id = $original_queried_object_id;
		wp_delete_post( $post_id, true );
	}


	public function testItReturnsNullPostIdWhenNoPostFound(): void {
		// Ensure queried object is not set.
		global $wp_query;
		$original_queried_object_id  = $wp_query->queried_object_id ?? 0;
		$wp_query->queried_object    = null;
		$wp_query->queried_object_id = 0;

		$_SERVER['REQUEST_URI'] = '/non-existent-page/';

		$path = $this->path_factory->make();

		$this->assertSame( '/non-existent-page/', $path->path() );
		$this->assertNull( $path->post_id() );

		// Clean up.
		$wp_query->queried_object_id = $original_queried_object_id;
	}

	public function testItReturnsNullPostIdForNonPostPaths(): void {
		// Ensure queried object is not set.
		global $wp_query;
		$original_queried_object_id  = $wp_query->queried_object_id ?? 0;
		$wp_query->queried_object    = null;
		$wp_query->queried_object_id = 0;

		$_SERVER['REQUEST_URI'] = '/wp-login.php';

		$path = $this->path_factory->make();

		$this->assertSame( '/wp-login.php', $path->path() );
		$this->assertNull( $path->post_id() );

		// Clean up.
		$wp_query->queried_object_id = $original_queried_object_id;
	}

	public function testItReturnsNullPostIdForTermQueriedObject(): void {
		// Create a category.
		$term_id = $this->factory()->term->create(
			[
				'taxonomy' => 'category',
				'name'     => 'Test Category',
			]
		);

		// Set queried object to the term (not a post).
		global $post, $wp_query;
		$original_post               = $post ?? null;
		$original_queried_object_id  = $wp_query->queried_object_id ?? 0;
		$term                        = get_term( $term_id );
		$post                        = null; // Ensure $post is null for term pages.
		$wp_query->queried_object    = $term;
		$wp_query->queried_object_id = $term_id;

		$_SERVER['REQUEST_URI'] = '/category/test-category/';

		$path = $this->path_factory->make();

		$this->assertSame( '/category/test-category/', $path->path() );
		// Should return null because term IDs are not post IDs.
		$this->assertNull( $path->post_id() );

		// Clean up.
		$post                        = $original_post;
		$wp_query->queried_object    = null;
		$wp_query->queried_object_id = $original_queried_object_id;
		wp_delete_term( $term_id, 'category' );
	}

	public function testItReturnsNullPostIdForUserQueriedObject(): void {
		// Create a user.
		$user_id = $this->factory()->user->create(
			[
				'user_login' => 'testauthor',
				'user_email' => 'testauthor@example.com',
			]
		);

		// Set queried object to the user (not a post).
		global $post, $wp_query;
		$user                        = get_userdata( $user_id );
		$post                        = null; // Ensure $post is null for user pages.
		$wp_query->queried_object    = $user;
		$wp_query->queried_object_id = $user_id;

		$_SERVER['REQUEST_URI'] = '/author/testauthor/';

		$path = $this->path_factory->make();

		$this->assertSame( '/author/testauthor/', $path->path() );
		// Should return null because user IDs are not post IDs.
		$this->assertNull( $path->post_id() );
	}

	public function testItResolvesPostIdForStaticFrontPage(): void {
		// Create a page to use as static front page.
		$front_page_id = $this->factory()->post->create(
			[
				'post_type'   => 'page',
				'post_title'  => 'Home Page',
				'post_status' => 'publish',
				'post_name'   => 'home',
			]
		);

		// Configure WordPress to use a static front page.
		update_option( 'show_on_front', 'page' );
		update_option( 'page_on_front', $front_page_id );

		// Set up queried object for front page.
		global $post, $wp_query;
		$post                        = get_post( $front_page_id );
		$wp_query->queried_object    = $post;
		$wp_query->queried_object_id = $front_page_id;

		$_SERVER['REQUEST_URI'] = '/';

		$path = $this->path_factory->make();

		$this->assertSame( '/', $path->path() );
		$this->assertSame( $front_page_id, $path->post_id() );
	}

	public function testItResolvesPostIdForPageForPosts(): void {
		// Create a page to use as the blog posts page.
		$blog_page_id = $this->factory()->post->create(
			[
				'post_type'   => 'page',
				'post_title'  => 'Blog',
				'post_status' => 'publish',
				'post_name'   => 'blog',
			]
		);

		// Create a static front page.
		$front_page_id = $this->factory()->post->create(
			[
				'post_type'   => 'page',
				'post_title'  => 'Home',
				'post_status' => 'publish',
				'post_name'   => 'home',
			]
		);

		// Configure WordPress to use static front page with separate blog page.
		update_option( 'show_on_front', 'page' );
		update_option( 'page_on_front', $front_page_id );
		update_option( 'page_for_posts', $blog_page_id );

		// Set up queried object for blog page.
		// Note: On the blog page, get_queried_object() returns the page_for_posts page.
		global $post, $wp_query;
		$post                        = get_post( $blog_page_id );
		$wp_query->queried_object    = $post;
		$wp_query->queried_object_id = $blog_page_id;

		$_SERVER['REQUEST_URI'] = '/blog/';

		$path = $this->path_factory->make();

		$this->assertSame( '/blog/', $path->path() );
		$this->assertSame( $blog_page_id, $path->post_id() );
	}
}
