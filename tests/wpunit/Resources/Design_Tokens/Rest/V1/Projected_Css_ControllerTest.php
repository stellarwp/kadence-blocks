<?php declare( strict_types=1 );
// cspell:ignore singlebtn .

namespace Tests\wpunit\Resources\Design_Tokens\Rest\V1;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Rest\V1\Projected_Css_Controller;
use Tests\Support\Classes\TestCase;
use WP_Error;
use WP_Http;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * Covers the projected-CSS controller: it aggregates every design-token editor projector into one CSS string
 * for the editor to re-inject live, keeps multi-set (multi-palette) support intact, and is capability-gated.
 */
final class Projected_Css_ControllerTest extends TestCase {

	private const BUTTON = 'kadence/singlebtn';

	/**
	 * @var Token_Store
	 */
	private Token_Store $store;

	/**
	 * @var Projected_Css_Controller
	 */
	private Projected_Css_Controller $controller;

	/**
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->store      = $this->container->get( Token_Store::class );
		$this->controller = $this->container->get( Projected_Css_Controller::class );
	}

	/**
	 * @return void
	 */
	protected function tearDown(): void {
		wp_set_current_user( 0 );

		parent::tearDown();
	}

	/**
	 * The aggregated CSS contains both the token vars and a stored variant's scoped retarget rule, proving it
	 * composes the token-var and variant projectors (not just one layer).
	 *
	 * @return void
	 */
	public function testItAggregatesTokenVarsAndAVariantsScopedRule(): void {
		$this->seedVariant( Token_Store::default_slug(), 'accent' );

		$css = $this->css();

		$this->assertStringContainsString( '--kb-token--', $css, 'The token vars layer should be present.' );
		$this->assertStringContainsString( 'kb-variant--accent', $css, 'The stored variant scoped rule should be present.' );
	}

	/**
	 * A second, non-default token set is emitted with its own namespaced vars and a per-set switch selector,
	 * proving multi-set (multi-palette) support survives the aggregation.
	 *
	 * @return void
	 */
	public function testItEmitsEveryTokenSetWithItsSwitchLayer(): void {
		$this->seedVariant( Token_Store::default_slug(), 'accent' );
		$this->seedVariant( 'dark', 'accent' );

		$css = $this->css();

		$this->assertStringContainsString( '--kb-token--dark--', $css, 'The non-default set should emit namespaced vars.' );
		$this->assertStringContainsString( 'data-kb-token-set', $css, 'The non-default set should emit a switch selector.' );
	}

	/**
	 * The aggregated CSS carries the EDITOR-scoped block-default rule for Advanced Heading — the shipped
	 * declaration's `editor_selector` re-targets the rule at the block's real heading element, scoped under
	 * `.editor-styles-wrapper` — not the bare front-end rule on the `useBlockProps()` wrapper div. Proves the
	 * live re-injection path (this endpoint) matches the selector the editor's own page-load enqueue used,
	 * rather than the front-end build.
	 *
	 * @return void
	 */
	public function testItServesTheEditorScopedBlockDefaultRuleForAdvancedHeadingNotTheFrontEndOne(): void {
		$css = $this->css();

		$this->assertStringContainsString(
			'.editor-styles-wrapper .wp-block-kadence-advancedheading .kadence-advancedheading-text{',
			$css,
			'The editor-scoped, re-targeted Advanced Heading rule should be present.'
		);
		$this->assertStringNotContainsString(
			'.wp-block-kadence-advancedheading{',
			$css,
			'The bare front-end Advanced Heading rule (on the wrapper div) should not be present.'
		);
	}

	/**
	 * The token-var layer's editor contribution is unchanged by the aggregation switch to `editor_css()`: the
	 * Css_Var projector is context-independent, so its editor build equals its front-end build and the
	 * `:root`/`--kb-token--` declarations still surface in the aggregated CSS.
	 *
	 * @return void
	 */
	public function testItStillContainsTheUnchangedTokenVarContributions(): void {
		$css = $this->css();

		$this->assertStringContainsString( ':root', $css, 'The token-var :root block should be present.' );
		$this->assertStringContainsString( '--kb-token--', $css, 'The token-var declarations should be present.' );
	}

	/**
	 * The read route is gated by the design-tokens capability: denied for a user without it, allowed for an
	 * administrator.
	 *
	 * @return void
	 */
	public function testTheRouteIsCapabilityGated(): void {
		$request = new WP_REST_Request( WP_REST_Server::READABLE );

		wp_set_current_user( $this->factory()->user->create( [ 'role' => 'subscriber' ] ) );
		$this->assertInstanceOf( WP_Error::class, $this->controller->get_item_permissions_check( $request ) );

		wp_set_current_user( $this->factory()->user->create( [ 'role' => 'administrator' ] ) );
		$this->assertTrue( $this->controller->get_item_permissions_check( $request ) );
	}

	/**
	 * With nothing stored the endpoint still returns a string (the baseline token vars), never an error, so a
	 * fetch failure never blocks the editor.
	 *
	 * @return void
	 */
	public function testItReturnsAStringWithAnEmptyStore(): void {
		$response = $this->controller->get_item( new WP_REST_Request( WP_REST_Server::READABLE ) );

		$this->assertInstanceOf( WP_REST_Response::class, $response );
		$this->assertSame( WP_Http::OK, $response->get_status() );
		$this->assertIsString( $response->get_data()['css'] );
	}

	/**
	 * The CSS string from a read of the resource.
	 *
	 * @return string
	 */
	private function css(): string {
		$response = $this->controller->get_item( new WP_REST_Request( WP_REST_Server::READABLE ) );

		return $response->get_data()['css'];
	}

	/**
	 * Persist a full-surface button variant into a token set's overrides document.
	 *
	 * @param string $slug    The token set slug to write into.
	 * @param string $variant The variant slug.
	 *
	 * @return void
	 */
	private function seedVariant( string $slug, string $variant ): void {
		$document = [
			'$extensions' => [
				'com.kadence.designTokens' => [
					'variants' => [
						self::BUTTON => [
							$variant => [
								'label'  => 'Accent',
								'tokens' => [
									'button-bg'         => '#ff0000',
									'button-text'       => '#ffffff',
									'button-bg-hover'   => '#cc0000',
									'button-text-hover' => '#ffffff',
									'button-radius'     => '1rem',
								],
							],
						],
					],
				],
			],
		];

		$this->store->save_document( (string) wp_json_encode( $document ), $slug );
	}
}
