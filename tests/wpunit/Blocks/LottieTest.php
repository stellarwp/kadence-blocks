<?php

// cspell:ignore lottieinteractivity lottietest .

namespace Tests\wpunit\Blocks;

use Generator;
use Kadence_Blocks_Lottie_Block;
use Kadence_Blocks_Lottie_Sanitizer;
use Kadence_LottieAnimation_get_REST_Controller;
use Kadence_LottieAnimation_post_REST_Controller;
use Tests\Support\Classes\KadenceBlocksUnit;
use WP_REST_Request;

class LottieTest extends KadenceBlocksUnit {
	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'lottie';

	/**
	 * Post type for the form.
	 *
	 * @var string
	 */
	protected $post_type = 'kadence_lottie';

	/**
	 * Block instance.
	 *
	 * @var Kadence_Blocks_Lottie_Block
	 */
	protected $block;

	/**
	 * Sets up the block instance.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();
		$this->block = new Kadence_Blocks_Lottie_Block();
	}

	/**
	 * Restores the global post and current user changed by a test.
	 *
	 * @return void
	 */
	protected function tearDown(): void {
		unset( $GLOBALS['post'] );
		wp_set_current_user( 0 );
		parent::tearDown();
	}

	/**
	 * The Lottie custom post type is registered.
	 *
	 * @return void
	 */
	public function testLottieCptRegistered() {
		$this->assertTrue( $this->tester->is_cpt_registered( $this->post_type ), 'Lottie CPT is registered' );
	}

	/**
	 * The player and interactivity scripts are registered.
	 *
	 * @return void
	 */
	public function testIsScriptRegistered() {
		$this->block->register_scripts();

		$this->assertTrue( wp_script_is( 'kadence-blocks-lottieinteractivity-js', 'registered' ),
			'Lottie interactivity registered' );
		$this->assertTrue( wp_script_is( 'kadence-blocks-dotlottie-player-js', 'registered' ),
			'Lottie interactivity registered' );
	}

	/**
	 * The sanitizer removes string expressions but keeps numeric easing handles named `x`.
	 *
	 * @dataProvider expressionProvider
	 *
	 * @param array $input    The decoded Lottie data.
	 * @param array $expected The data expected after sanitizing.
	 *
	 * @return void
	 */
	public function testSanitizerStripsOnlyStringExpressions( array $input, array $expected ): void {
		$this->assertSame( $expected, Kadence_Blocks_Lottie_Sanitizer::strip_expressions( $input ) );
	}

	/**
	 * The sanitizer removes expressions from decoded JSON objects, not only arrays.
	 *
	 * @return void
	 */
	public function testSanitizerStripsExpressionsFromObjects(): void {
		$data = json_decode( '{"layers":[{"ks":{"o":{"a":0,"k":50,"x":"alert(1)"},"p":{"i":{"x":[0.5],"y":[1]}}}}]}' );

		$clean = Kadence_Blocks_Lottie_Sanitizer::strip_expressions( $data );

		$this->assertFalse( isset( $clean->layers[0]->ks->o->x ), 'Expression string is removed.' );
		$this->assertSame( [ 0.5 ], $clean->layers[0]->ks->p->i->x, 'Numeric easing handle is kept.' );
	}

	/**
	 * Creating an animation through the REST route requires the capability the post type itself uses.
	 *
	 * @return void
	 */
	public function testCreateAnimationRequiresEditThemeOptions(): void {
		$controller = new Kadence_LottieAnimation_post_REST_Controller();
		$request    = new WP_REST_Request( 'POST', '/kb-lottieanimation/v1/animations' );

		wp_set_current_user( static::factory()->user->create( [ 'role' => 'author' ] ) );
		$this->assertFalse( $controller->create_animation_permission_check( $request ), 'An author cannot create animations.' );

		wp_set_current_user( static::factory()->user->create( [ 'role' => 'administrator' ] ) );
		$this->assertTrue( $controller->create_animation_permission_check( $request ), 'An administrator can create animations.' );
	}

	/**
	 * Expression strings are removed from an animation before it is stored.
	 *
	 * @return void
	 */
	public function testCreateAnimationStoresNoExpressions(): void {
		wp_set_current_user( static::factory()->user->create( [ 'role' => 'administrator' ] ) );

		$request = new WP_REST_Request( 'POST', '/kb-lottieanimation/v1/animations' );
		$request->set_header( 'content-type', 'application/json' );
		$request->set_body(
			wp_json_encode(
				[
					'title'      => 'Expression test',
					'lottieFile' => [
						'layers' => [
							[
								'ks' => [
									'o' => [
										'a' => 0,
										'k' => 50,
										'x' => 'globalThis.fetch("/")',
									],
								],
							],
						],
					],
				]
			)
		);

		$result = ( new Kadence_LottieAnimation_post_REST_Controller() )->create_animation( $request );

		$this->assertArrayHasKey( 'value', $result );
		$stored = get_post_field( 'post_content', $result['value'] );
		$this->assertStringNotContainsString( 'globalThis', $stored, 'The expression is not stored.' );
		$this->assertStringContainsString( '"k":50', $stored, 'The rest of the animation is kept.' );
	}

	/**
	 * An animation stored before the fix is served without its expressions.
	 *
	 * @return void
	 */
	public function testGetAnimationStripsLegacyExpressions(): void {
		$post_id = wp_insert_post(
			[
				'post_title'   => 'Legacy',
				'post_type'    => $this->post_type,
				'post_status'  => 'publish',
				'post_content' => wp_slash( '{"layers":[{"ks":{"o":{"a":0,"k":50,"x":"globalThis.fetch(\"/\")"}}}]}' ),
			]
		);

		$request = new WP_REST_Request( 'GET', '/kb-lottieanimation/v1/animations/' . $post_id );
		$request->set_param( 'id', $post_id . '.json' );

		$response = ( new Kadence_LottieAnimation_get_REST_Controller() )->get_animation( $request );

		$data = $response->get_data();

		$this->assertStringNotContainsString( 'globalThis', wp_json_encode( $data ), 'The served animation has no expression.' );
		$this->assertSame( 50, $data->layers[0]->ks->o->k, 'The rest of the animation is kept.' );
	}

	/**
	 * An external URL chosen in a post by a user without `unfiltered_html` is not rendered.
	 *
	 * @return void
	 */
	public function testExternalUrlFromContributorPostIsNotRendered(): void {
		$html = $this->renderForAuthorRole( 'contributor', 'https://attacker.example/animation.json' );

		$this->assertStringNotContainsString( 'attacker.example', $html );
		$this->assertStringContainsString( '<dotlottie-player', $html, 'The player still renders with the default animation.' );
	}

	/**
	 * An external URL chosen in a post by a user with `unfiltered_html` is rendered.
	 *
	 * @return void
	 */
	public function testExternalUrlFromAdministratorPostIsRendered(): void {
		$html = $this->renderForAuthorRole( 'administrator', 'https://assets.example/animation.json' );

		$this->assertStringContainsString( 'src="https://assets.example/animation.json"', $html );
	}

	/**
	 * The animations REST route URL is rendered even when the post author lacks `unfiltered_html`.
	 *
	 * @return void
	 */
	public function testAnimationRouteUrlFromContributorPostIsRendered(): void {
		$url  = get_rest_url( null, 'kb-lottieanimation/v1/animations/1.json' );
		$html = $this->renderForAuthorRole( 'contributor', $url );

		$this->assertStringContainsString( 'src="' . esc_url( $url ) . '"', $html );
	}

	/**
	 * Other URLs on this site, such as media files, are not rendered for a contributor's post.
	 *
	 * @dataProvider siteUrlProvider
	 *
	 * @param string $path The path appended to the site URL.
	 *
	 * @return void
	 */
	public function testNonRouteSiteUrlFromContributorPostIsNotRendered( string $path ): void {
		$url  = ( 0 === strpos( $path, '?' ) ? home_url( '/' ) : home_url() ) . $path;
		$html = $this->renderForAuthorRole( 'contributor', $url );

		$this->assertStringNotContainsString( $path, $html );
	}

	/**
	 * Provides same-site URLs that are not the animations route.
	 *
	 * @return Generator
	 */
	public function siteUrlProvider(): Generator {
		yield 'media file' => [ 'path' => '/wp-content/uploads/2026/10/evil.json' ];
		yield 'dot segments through the route' => [ 'path' => '/wp-json/kb-lottieanimation/v1/animations/../../../../wp-content/uploads/evil.json' ];
		yield 'other rest route' => [ 'path' => '/wp-json/wp/v2/media/1' ];
	}

	/**
	 * URLs whose host differs between PHP and browsers are not rendered for a contributor's post.
	 *
	 * @dataProvider ambiguousUrlProvider
	 *
	 * @param string $url The animation URL.
	 *
	 * @return void
	 */
	public function testAmbiguousUrlFromContributorPostIsNotRendered( string $url ): void {
		$site_host = wp_parse_url( home_url(), PHP_URL_HOST );
		$html      = $this->renderForAuthorRole( 'contributor', str_replace( 'site.test', $site_host, $url ) );

		$this->assertStringNotContainsString( 'attacker.example', $html );
	}

	/**
	 * Provides URLs that PHP reads as this site but a browser sends elsewhere.
	 *
	 * @return Generator
	 */
	public function ambiguousUrlProvider(): Generator {
		yield 'backslash before credentials' => [ 'url' => 'https://attacker.example\\@site.test/a.json' ];
		yield 'backslash in path' => [ 'url' => 'https://site.test\\.attacker.example/a.json' ];
		yield 'tab in host' => [ 'url' => "https://attacker.example\t@site.test/a.json" ];
		yield 'javascript scheme' => [ 'url' => 'javascript://site.test/path' ];
	}

	/**
	 * A local animation id that is not alphanumeric never reaches the player URL.
	 *
	 * @dataProvider localFileValueProvider
	 *
	 * @param string $value    The stored local file value.
	 * @param bool   $expected Whether the value is used in the URL.
	 *
	 * @return void
	 */
	public function testLocalFileValueMustBeAlphanumeric( string $value, bool $expected ): void {
		$url = $this->block->getAnimationUrl(
			[
				'fileSrc'   => 'local',
				'fileUrl'   => '',
				'localFile' => [ [ 'value' => $value ] ],
			]
		);

		if ( $expected ) {
			$this->assertStringContainsString( 'animations/' . $value . '.json', $url );
		} else {
			$this->assertStringNotContainsString( $value, $url );
			$this->assertStringContainsString( 'lottiefiles.com', $url, 'The default animation is used.' );
		}
	}

	/**
	 * Provides local file values and whether they are accepted.
	 *
	 * @return Generator
	 */
	public function localFileValueProvider(): Generator {
		yield 'post id' => [
			'value'    => '123',
			'expected' => true,
		];
		yield 'path traversal' => [
			'value'    => '../../../uploads/evil',
			'expected' => false,
		];
		yield 'query string' => [
			'value'    => '1?x=y',
			'expected' => false,
		];
	}

	/**
	 * A missing local file does not raise a notice and falls back to the default animation.
	 *
	 * @return void
	 */
	public function testMissingLocalFileFallsBackToDefault(): void {
		$url = $this->block->getAnimationUrl(
			[
				'fileSrc'   => 'local',
				'fileUrl'   => '',
				'localFile' => [],
			]
		);

		$this->assertStringContainsString( 'lottiefiles.com', $url );
	}

	/**
	 * Saving as a user without `unfiltered_html` removes external URLs, including from nested blocks.
	 *
	 * @return void
	 */
	public function testSavingAsContributorStripsExternalUrls(): void {
		wp_set_current_user( static::factory()->user->create( [ 'role' => 'contributor' ] ) );

		$same_site = get_rest_url( null, 'kb-lottieanimation/v1/animations/1.json' );
		$content   = '<!-- wp:group --><div class="wp-block-group">'
			. '<!-- wp:kadence/lottie {"uniqueID":"a1","fileUrl":"https://attacker.example/a.json"} /-->'
			. '<!-- wp:kadence/lottie {"uniqueID":"a2","fileUrl":"' . $same_site . '"} /-->'
			. '</div><!-- /wp:group -->';

		$saved = $this->block->strip_external_urls_on_save( [ 'post_content' => wp_slash( $content ) ] );

		$this->assertStringNotContainsString( 'attacker.example', $saved['post_content'] );
		$this->assertStringContainsString( 'a1', $saved['post_content'], 'The block is kept.' );
		$this->assertStringContainsString( 'animations/1.json', $saved['post_content'], 'The same-site URL is kept.' );
	}

	/**
	 * Saving as a contributor removes a media file URL on this site but keeps a plain-permalink animations route URL.
	 *
	 * @return void
	 */
	public function testSavingAsContributorKeepsOnlyAnimationRouteUrls(): void {
		wp_set_current_user( static::factory()->user->create( [ 'role' => 'contributor' ] ) );

		$this->setPlainPermalinks();

		$route   = get_rest_url( null, 'kb-lottieanimation/v1/animations/7' );
		$media   = home_url( '/wp-content/uploads/2026/10/evil.json' );
		$content = '<!-- wp:kadence/lottie {"uniqueID":"a1","fileUrl":"' . $media . '"} /-->'
			. '<!-- wp:kadence/lottie {"uniqueID":"a2","fileUrl":"' . $route . '"} /-->';

		$saved = $this->block->strip_external_urls_on_save( [ 'post_content' => wp_slash( $content ) ] );

		$this->assertStringNotContainsString( 'evil.json', $saved['post_content'], 'The media URL is removed.' );
		$this->assertStringContainsString( 'animations', $saved['post_content'], 'The route URL is kept.' );
		$this->assertStringContainsString( 'rest_route', $saved['post_content'], 'The plain-permalink form is used.' );
	}

	/**
	 * Saving as a user with `unfiltered_html` leaves external URLs alone.
	 *
	 * @return void
	 */
	public function testSavingAsAdministratorKeepsExternalUrls(): void {
		wp_set_current_user( static::factory()->user->create( [ 'role' => 'administrator' ] ) );

		$data  = [ 'post_content' => '<!-- wp:kadence/lottie {"uniqueID":"a1","fileUrl":"https://assets.example/a.json"} /-->' ];
		$saved = $this->block->strip_external_urls_on_save( $data );

		$this->assertSame( $data, $saved );
	}

	/**
	 * A contributor's saved post loses the external URL even when it is nested in a Query Loop.
	 *
	 * @return void
	 */
	public function testContributorPostSavedThroughCoreDoesNotKeepExternalUrl(): void {
		wp_set_current_user( static::factory()->user->create( [ 'role' => 'contributor' ] ) );

		$post_id = wp_insert_post(
			[
				'post_title'   => 'Loop',
				'post_status'  => 'draft',
				'post_content' => '<!-- wp:query --><div class="wp-block-query"><!-- wp:post-template -->'
					. '<!-- wp:kadence/lottie {"uniqueID":"a1","fileUrl":"https://attacker.example/a.json"} /-->'
					. '<!-- /wp:post-template --></div><!-- /wp:query -->',
			]
		);

		$this->assertStringNotContainsString( 'attacker.example', get_post_field( 'post_content', $post_id ) );
	}

	/**
	 * Non-numeric scroll frame values never reach the inline script.
	 *
	 * @return void
	 */
	public function testScrollFramesAreCastToNumbers(): void {
		$html = $this->renderForAuthorRole(
			'administrator',
			'https://assets.example/animation.json',
			[
				'onlyPlayOnScroll' => true,
				'startFrame'       => '1]});alert(1);//',
				'endFrame'         => '50',
			]
		);

		$this->assertStringNotContainsString( 'alert(1)', $html );
		$this->assertStringContainsString( 'frames: [1, 50]', $html );
	}

	/**
	 * Provides decoded Lottie data and the expected result after sanitizing.
	 *
	 * @return Generator
	 */
	public function expressionProvider(): Generator {
		yield 'string expression is removed' => [
			'input'    => [
				'o' => [
					'a' => 0,
					'k' => 50,
					'x' => 'alert(1)',
				],
			],
			'expected' => [
				'o' => [
					'a' => 0,
					'k' => 50,
				],
			],
		];

		yield 'numeric easing handle is kept' => [
			'input'    => [
				'i' => [
					'x' => [ 0.5 ],
					'y' => [ 1 ],
				],
			],
			'expected' => [
				'i' => [
					'x' => [ 0.5 ],
					'y' => [ 1 ],
				],
			],
		];

		yield 'array expression is removed' => [
			'input'    => [
				'o' => [
					'k' => 50,
					'x' => [ 'alert(1)', 'alert(2)' ],
				],
			],
			'expected' => [
				'o' => [
					'k' => 50,
				],
			],
		];

		yield 'nested array expression is removed' => [
			'input'    => [
				'o' => [
					'k' => 50,
					'x' => [ 0.5, [ 'alert(1)' ] ],
				],
			],
			'expected' => [
				'o' => [
					'k' => 50,
				],
			],
		];

		yield 'scalar easing handle is kept' => [
			'input'    => [
				'i' => [
					'x' => 0.5,
					'y' => 1,
				],
			],
			'expected' => [
				'i' => [
					'x' => 0.5,
					'y' => 1,
				],
			],
		];

		yield 'deeply nested expression is removed' => [
			'input'    => [
				'layers' => [
					[
						'ef' => [
							[
								'ef' => [
									[
										'v' => [
											'x' => 'evil()',
											'k' => 1,
										],
									],
								],
							],
						],
					],
				],
			],
			'expected' => [
				'layers' => [
					[
						'ef' => [
							[
								'ef' => [
									[
										'v' => [ 'k' => 1 ],
									],
								],
							],
						],
					],
				],
			],
		];

		yield 'data without expressions is unchanged' => [
			'input'    => [
				'v'      => '5.7.0',
				'fr'     => 30,
				'layers' => [],
			],
			'expected' => [
				'v'      => '5.7.0',
				'fr'     => 30,
				'layers' => [],
			],
		];
	}

	/**
	 * Switches the site to plain permalinks so the REST URL uses the `rest_route` query form.
	 *
	 * @return void
	 */
	private function setPlainPermalinks(): void {
		global $wp_rewrite;

		$wp_rewrite->set_permalink_structure( '' );
	}

	/**
	 * Renders the block as it appears in a post written by a user with the given role.
	 *
	 * @param string $role      The role of the post author.
	 * @param string $file_url  The external animation URL set on the block.
	 * @param array  $overrides Attributes that replace the defaults used for rendering.
	 *
	 * @return string The rendered block HTML.
	 */
	private function renderForAuthorRole( string $role, string $file_url, array $overrides = [] ): string {
		$author  = static::factory()->user->create( [ 'role' => $role ] );
		$post_id = static::factory()->post->create( [ 'post_author' => $author ] );

		$GLOBALS['post'] = get_post( $post_id );

		$unique_id  = 'lottietest01';
		$attributes = array_merge(
			[
				'uniqueID'         => $unique_id,
				'fileSrc'          => 'url',
				'fileUrl'          => $file_url,
				'loop'             => false,
				'playbackSpeed'    => 1,
				'showControls'     => false,
				'autoplay'         => true,
				'onlyPlayOnHover'  => false,
				'bouncePlayback'   => false,
				'delay'            => 0,
				'onlyPlayOnScroll' => false,
				'waitUntilInView'  => false,
			],
			$overrides
		);

		return $this->block->build_html( $attributes, $unique_id, '', $this->generate_block_instance( 'kadence/' . $this->block_name, $attributes ) );
	}
}
