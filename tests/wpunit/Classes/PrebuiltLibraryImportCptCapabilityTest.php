<?php
// cspell:ignore sendinblue getresponse convertkit activecampaign -- form meta keys named after third-party services.

namespace Tests\wpunit\Classes;

use Generator;
use Kadence_Blocks_Prebuilt_Library_REST_Controller;
use ReflectionClass;
use Tests\wpunit\KadenceBlocksTestCase;
use WP_Post;

/**
 * Tests the post types created by a pattern import.
 */
class PrebuiltLibraryImportCptCapabilityTest extends KadenceBlocksTestCase {

	/**
	 * The imported post status matches the user's capabilities.
	 *
	 * @dataProvider postStatusProvider
	 *
	 * @param string $role            The role to import as.
	 * @param string $post_type       The imported post type.
	 * @param string $expected_status The expected post status.
	 *
	 * @return void
	 */
	public function testImportedPostStatusFollowsThePostTypeCapabilities( string $role, string $post_type, string $expected_status ): void {
		$this->act_as( $role );

		$this->import( [ $this->cpt_item( $post_type, 'Imported Item' ) ] );

		$post = $this->find_post( $post_type, 'Imported Item' );
		$this->assertInstanceOf( WP_Post::class, $post );
		$this->assertSame( $expected_status, $post->post_status );
	}

	/**
	 * Only presentation meta is imported when the user cannot publish forms.
	 *
	 * @dataProvider restrictedMetaKeyProvider
	 *
	 * @param string $meta_key The meta key.
	 *
	 * @return void
	 */
	public function testOnlyPresentationFormMetaIsImportedForUserWithoutFormCapabilities( string $meta_key ): void {
		$this->act_as( 'author' );

		$this->import( [ $this->cpt_item( 'kadence_form', 'Imported Form', [ $meta_key => [ [ 'value' => 'example' ] ] ] ) ] );

		$form = $this->find_post( 'kadence_form', 'Imported Form' );
		$this->assertInstanceOf( WP_Post::class, $form );
		$this->assertFalse( metadata_exists( 'post', $form->ID, $meta_key ) );
	}

	/**
	 * Form meta is sanitized when the user cannot publish forms.
	 *
	 * @return void
	 */
	public function testFormMetaIsSanitizedForUserWithoutFormCapabilities(): void {
		$this->act_as( 'author' );
		$messages = [
			'success' => '<b>Thanks</b><iframe src="https://example.com"></iframe>',
			'html'    => true,
		];

		$this->import( [ $this->cpt_item( 'kadence_form', 'Imported Form', [ '_kad_form_messages' => [ $messages ] ] ) ] );

		$form     = $this->find_post( 'kadence_form', 'Imported Form' );
		$expected = [
			'success' => wp_kses_post( $messages['success'] ),
			'html'    => $messages['html'],
		];
		$this->assertInstanceOf( WP_Post::class, $form );
		$this->assertNotSame( $messages['success'], $expected['success'] );
		$this->assertSame( $expected, get_post_meta( $form->ID, '_kad_form_messages', true ) );
	}

	/**
	 * A user who can publish forms gets a published form with all meta.
	 *
	 * @return void
	 */
	public function testImportedFormIsPublishedWithAllMetaForUserWithFormCapabilities(): void {
		$this->act_as( 'editor' );
		$email    = [ 'emailTo' => 'forms@example.com' ];
		$style    = [ 'size' => 'standard' ];
		$messages = [ 'success' => '<b>Thanks</b><iframe src="https://example.com"></iframe>' ];

		$this->import(
			[
				$this->cpt_item(
					'kadence_form',
					'Imported Form',
					[
						'_kad_form_email'    => [ $email ],
						'_kad_form_style'    => [ $style ],
						'_kad_form_messages' => [ $messages ],
					]
				),
			]
		);

		$form = $this->find_post( 'kadence_form', 'Imported Form' );
		$this->assertInstanceOf( WP_Post::class, $form );
		$this->assertSame( 'publish', $form->post_status );
		$this->assertSame( $email, get_post_meta( $form->ID, '_kad_form_email', true ) );
		$this->assertSame( $style, get_post_meta( $form->ID, '_kad_form_style', true ) );
		$this->assertSame( $messages, get_post_meta( $form->ID, '_kad_form_messages', true ) );
	}

	/**
	 * A repeated import reuses the user's own pending post.
	 *
	 * @return void
	 */
	public function testRepeatedImportReusesTheUsersPendingPost(): void {
		$this->act_as( 'author' );
		$this->import( [ $this->cpt_item( 'kadence_form', 'Imported Form' ) ] );
		$this->import( [ $this->cpt_item( 'kadence_form', 'Imported Form' ) ] );

		$this->assertCount( 1, $this->find_posts( 'kadence_form', 'Imported Form' ) );

		$this->act_as( 'author' );
		$this->import( [ $this->cpt_item( 'kadence_form', 'Imported Form' ) ] );

		$this->assertCount( 2, $this->find_posts( 'kadence_form', 'Imported Form' ) );
	}

	/**
	 * A nested form is handled like a top-level one.
	 *
	 * @return void
	 */
	public function testNestedFormFollowsTheSameRules(): void {
		$this->act_as( 'author' );
		$style                 = [ 'size' => 'standard' ];
		$parent                = $this->cpt_item( 'kadence_form', 'Parent Form' );
		$parent['inner_posts'] = [
			$this->cpt_item(
				'kadence_form',
				'Nested Form',
				[
					'_kad_form_email' => [ [ 'emailTo' => 'forms@example.com' ] ],
					'_kad_form_style' => [ $style ],
				]
			),
		];

		$this->import( [ $parent ] );

		$nested = $this->find_post( 'kadence_form', 'Nested Form' );
		$this->assertInstanceOf( WP_Post::class, $nested );
		$this->assertSame( 'pending', $nested->post_status );
		$this->assertFalse( metadata_exists( 'post', $nested->ID, '_kad_form_email' ) );
		$this->assertSame( $style, get_post_meta( $nested->ID, '_kad_form_style', true ) );
	}

	/**
	 * A nested item of an unsupported post type is not created.
	 *
	 * @return void
	 */
	public function testNestedItemOfUnsupportedPostTypeIsNotCreated(): void {
		$this->act_as( 'administrator' );
		$parent                = $this->cpt_item( 'kadence_form', 'Parent Form' );
		$parent['inner_posts'] = [ $this->cpt_item( 'page', 'Nested Page' ) ];

		$this->import( [ $parent ] );

		$this->assertInstanceOf( WP_Post::class, $this->find_post( 'kadence_form', 'Parent Form' ) );
		$this->assertNull( $this->find_post( 'page', 'Nested Page' ) );
	}

	/**
	 * Roles and post types with the expected post status.
	 *
	 * @return Generator
	 */
	public function postStatusProvider(): Generator {
		yield 'author form' => [
			'role'            => 'author',
			'post_type'       => 'kadence_form',
			'expected_status' => 'pending',
		];
		yield 'author header' => [
			'role'            => 'author',
			'post_type'       => 'kadence_header',
			'expected_status' => 'pending',
		];
		yield 'author navigation' => [
			'role'            => 'author',
			'post_type'       => 'kadence_navigation',
			'expected_status' => 'pending',
		];
		yield 'editor header' => [
			'role'            => 'editor',
			'post_type'       => 'kadence_header',
			'expected_status' => 'pending',
		];
		yield 'administrator header' => [
			'role'            => 'administrator',
			'post_type'       => 'kadence_header',
			'expected_status' => 'publish',
		];
		yield 'administrator navigation' => [
			'role'            => 'administrator',
			'post_type'       => 'kadence_navigation',
			'expected_status' => 'publish',
		];
	}

	/**
	 * Form meta keys that are not presentation meta.
	 *
	 * @return Generator
	 */
	public function restrictedMetaKeyProvider(): Generator {
		yield 'actions' => [ 'meta_key' => '_kad_form_actions' ];
		yield 'email' => [ 'meta_key' => '_kad_form_email' ];
		yield 'auto email' => [ 'meta_key' => '_kad_form_autoEmail' ];
		yield 'webhook' => [ 'meta_key' => '_kad_form_webhook' ];
		yield 'redirect' => [ 'meta_key' => '_kad_form_redirect' ];
		yield 'entry' => [ 'meta_key' => '_kad_form_entry' ];
		yield 'mailerlite' => [ 'meta_key' => '_kad_form_mailerlite' ];
		yield 'fluentcrm' => [ 'meta_key' => '_kad_form_fluentcrm' ];
		yield 'sendinblue' => [ 'meta_key' => '_kad_form_sendinblue' ];
		yield 'mailchimp' => [ 'meta_key' => '_kad_form_mailchimp' ];
		yield 'getresponse' => [ 'meta_key' => '_kad_form_getresponse' ];
		yield 'convertkit' => [ 'meta_key' => '_kad_form_convertkit' ];
		yield 'activecampaign' => [ 'meta_key' => '_kad_form_activecampaign' ];
		yield 'unregistered key' => [ 'meta_key' => '_kad_form_unregistered' ];
	}

	/**
	 * Creates a user with the given role and makes it the current user.
	 *
	 * @param string $role The role to act as.
	 *
	 * @return void
	 */
	private function act_as( string $role ): void {
		wp_set_current_user( self::factory()->user->create( [ 'role' => $role ] ) );
	}

	/**
	 * Builds a pattern item.
	 *
	 * @param string                                  $post_type The post type.
	 * @param string                                  $title     The post title.
	 * @param array<string, array<int, array<mixed>>> $meta      The meta, keyed by meta key.
	 *
	 * @return array{ID: int, post_type: string, post_title: string, post_content: string, meta: array<string, array<int, array<mixed>>>, inner_posts?: array<int, array<mixed>>}
	 */
	private function cpt_item( string $post_type, string $title, array $meta = [] ): array {
		return [
			'ID'           => 9001,
			'post_type'    => $post_type,
			'post_title'   => $title,
			'post_content' => '',
			'meta'         => $meta,
		];
	}

	/**
	 * Imports a pattern with the given items.
	 *
	 * @param array<int, array{ID: int, post_type: string, post_title: string, post_content: string, meta: array<string, array<int, array<mixed>>>, inner_posts?: array<int, array<mixed>>}> $items The pattern items.
	 *
	 * @return void
	 */
	private function import( array $items ): void {
		$controller = ( new ReflectionClass( Kadence_Blocks_Prebuilt_Library_REST_Controller::class ) )
			->newInstanceWithoutConstructor();

		$controller->process_cpt(
			'<!-- wp:kadence/advanced-form {"id":9001} /-->',
			[ 'kadence/advanced-form' => $items ],
			''
		);
	}

	/**
	 * Finds a post of any status by type and title.
	 *
	 * @param string $post_type The post type.
	 * @param string $title     The post title.
	 *
	 * @return WP_Post|null The post, or null when none exists.
	 */
	private function find_post( string $post_type, string $title ): ?WP_Post {
		return $this->find_posts( $post_type, $title )[0] ?? null;
	}

	/**
	 * Finds every post of any status by type and title.
	 *
	 * @param string $post_type The post type.
	 * @param string $title     The post title.
	 *
	 * @return WP_Post[] The matching posts.
	 */
	private function find_posts( string $post_type, string $title ): array {
		return get_posts(
			[
				'post_type'   => $post_type,
				'title'       => $title,
				'post_status' => 'any',
				'numberposts' => -1,
			]
		);
	}
}
