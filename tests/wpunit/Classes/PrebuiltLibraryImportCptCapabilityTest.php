<?php
// cspell:ignore sendinblue getresponse convertkit activecampaign -- form meta keys named after third-party services.

namespace Tests\wpunit\Classes;

use Generator;
use Kadence_Blocks_Prebuilt_Library_REST_Controller;
use ReflectionClass;
use Tests\wpunit\KadenceBlocksTestCase;
use WP_Post;

/**
 * Verifies how the prebuilt-library import creates the posts a pattern depends on,
 * based on the current user's capabilities for the post type.
 */
class PrebuiltLibraryImportCptCapabilityTest extends KadenceBlocksTestCase {

	/**
	 * A user who cannot publish forms gets a pending form that keeps its presentation settings.
	 *
	 * @return void
	 */
	public function testImportedFormIsPendingForUserWithoutFormCapabilities(): void {
		$this->act_as( 'author' );
		$style = [ 'size' => 'standard' ];

		$this->import( [ $this->form_item( 'Imported Form', [ '_kad_form_style' => [ $style ] ] ) ] );

		$form = $this->find_post( 'kadence_form', 'Imported Form' );
		$this->assertInstanceOf( WP_Post::class, $form );
		$this->assertSame( 'pending', $form->post_status );
		$this->assertSame( $style, get_post_meta( $form->ID, '_kad_form_style', true ) );
	}

	/**
	 * A user who cannot publish forms does not import settings outside the presentation ones.
	 *
	 * @dataProvider restrictedMetaKeyProvider
	 *
	 * @param string $meta_key The meta key supplied with the form.
	 *
	 * @return void
	 */
	public function testRestrictedFormMetaIsNotImportedForUserWithoutFormCapabilities( string $meta_key ): void {
		$this->act_as( 'author' );

		$this->import( [ $this->form_item( 'Imported Form', [ $meta_key => [ [ 'value' => 'supplied' ] ] ] ) ] );

		$form = $this->find_post( 'kadence_form', 'Imported Form' );
		$this->assertInstanceOf( WP_Post::class, $form );
		$this->assertFalse( metadata_exists( 'post', $form->ID, $meta_key ) );
	}

	/**
	 * A user who cannot publish forms has the text of the kept settings filtered like post content.
	 *
	 * @return void
	 */
	public function testKeptFormMetaIsFilteredForUserWithoutFormCapabilities(): void {
		$this->act_as( 'author' );
		$messages = [
			'success' => '<b>Thanks</b><script>window.example = true;</script>',
			'html'    => true,
		];

		$this->import( [ $this->form_item( 'Imported Form', [ '_kad_form_messages' => [ $messages ] ] ) ] );

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
	 * A user who can publish forms gets a published form with every supplied setting.
	 *
	 * @return void
	 */
	public function testImportedFormIsPublishedWithAllMetaForUserWithFormCapabilities(): void {
		$this->act_as( 'editor' );
		$email    = [ 'emailTo' => 'forms@example.com' ];
		$style    = [ 'size' => 'standard' ];
		$messages = [ 'success' => '<b>Thanks</b><script>window.example = true;</script>' ];

		$this->import(
			[
				$this->form_item(
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
	 * A nested form follows the same rules as a top-level one.
	 *
	 * @return void
	 */
	public function testNestedFormFollowsTheSameRules(): void {
		$this->act_as( 'author' );
		$style                 = [ 'size' => 'standard' ];
		$parent                = $this->form_item( 'Parent Form' );
		$parent['inner_posts'] = [
			$this->form_item(
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
	 * A nested item is only created when its post type is one the import supports.
	 *
	 * @return void
	 */
	public function testNestedItemOfUnsupportedPostTypeIsNotCreated(): void {
		$this->act_as( 'administrator' );
		$parent                = $this->form_item( 'Parent Form' );
		$parent['inner_posts'] = [
			[
				'ID'           => 9002,
				'post_type'    => 'page',
				'post_title'   => 'Nested Page',
				'post_content' => '',
			],
		];

		$this->import( [ $parent ] );

		$this->assertInstanceOf( WP_Post::class, $this->find_post( 'kadence_form', 'Parent Form' ) );
		$this->assertNull( $this->find_post( 'page', 'Nested Page' ) );
	}

	/**
	 * Form meta keys that are not presentation settings.
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
	 * Builds a form item as a pattern supplies it.
	 *
	 * @param string                                $title The form title.
	 * @param array<string, array<int, array<mixed>>> $meta  The supplied meta, keyed by meta key.
	 *
	 * @return array{ID: int, post_type: string, post_title: string, post_content: string, meta: array<string, array<int, array<mixed>>>, inner_posts?: array<int, array<mixed>>}
	 */
	private function form_item( string $title, array $meta = [] ): array {
		return [
			'ID'           => 9001,
			'post_type'    => 'kadence_form',
			'post_title'   => $title,
			'post_content' => '<!-- wp:kadence/advanced-form /-->',
			'meta'         => $meta,
		];
	}

	/**
	 * Runs the import for a pattern holding the given form items.
	 *
	 * Built without the constructor so the test does not depend on the DI container.
	 *
	 * @param array<int, array{ID: int, post_type: string, post_title: string, post_content: string, meta: array<string, array<int, array<mixed>>>, inner_posts?: array<int, array<mixed>>}> $form_items The form items the pattern depends on.
	 *
	 * @return void
	 */
	private function import( array $form_items ): void {
		$controller = ( new ReflectionClass( Kadence_Blocks_Prebuilt_Library_REST_Controller::class ) )
			->newInstanceWithoutConstructor();

		$controller->process_cpt(
			'<!-- wp:kadence/advanced-form {"id":9001} /-->',
			[ 'kadence/advanced-form' => $form_items ],
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
		$posts = get_posts(
			[
				'post_type'   => $post_type,
				'title'       => $title,
				'post_status' => 'any',
				'numberposts' => 1,
			]
		);

		return $posts[0] ?? null;
	}
}
