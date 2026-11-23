<?php

declare( strict_types=1 );

namespace Tests\wpunit\Resources\Site_Styles;

use KadenceWP\KadenceBlocks\Site_Styles\User_Data_Filter;
use Tests\Support\Classes\GutenbergThemeJsonData;
use Tests\Support\Classes\TestCase;
use WP_Block_Type_Registry;
use WP_Theme_JSON_Data;

/**
 * Covers the user Global Styles filter with core's data class and the Gutenberg plugin's.
 */
final class UserDataFilterTest extends TestCase {

	private const DATA = [
		'version'  => 3,
		'settings' => [ 'custom' => [ 'kadence' => [ 'singlebtn' => [ 'borderRadius' => [ 20, 20, 20, 20 ] ] ] ] ],
		'styles'   => [ 'blocks' => [ 'kadence/singlebtn' => [ 'color' => [ 'background' => '#cc0000' ] ] ] ],
	];

	private bool $registered = false;

	protected function setUp(): void {
		parent::setUp();

		// Core drops styles for unregistered blocks, which would pass the removal checks on its own.
		if ( ! WP_Block_Type_Registry::get_instance()->is_registered( 'kadence/singlebtn' ) ) {
			register_block_type( 'kadence/singlebtn' );
			$this->registered = true;
		}
	}

	protected function tearDown(): void {
		if ( $this->registered ) {
			unregister_block_type( 'kadence/singlebtn' );
		}

		parent::tearDown();
	}

	public function testCoreDataLosesTheKadenceValues(): void {
		$filtered = $this->container->get( User_Data_Filter::class )->filter( new WP_Theme_JSON_Data( self::DATA, 'custom' ) );

		$this->assertInstanceOf( WP_Theme_JSON_Data::class, $filtered );
		$this->assertArrayNotHasKey( 'kadence', $filtered->get_data()['settings']['custom'] ?? [] );
	}

	public function testGutenbergDataComesBackAsGutenbergDataWithoutTheKadenceValues(): void {
		add_filter( 'kadence_blocks_is_fse_mode', '__return_false' );

		$filtered = $this->container->get( User_Data_Filter::class )->filter( new GutenbergThemeJsonData( self::DATA, 'custom' ) );

		$this->assertInstanceOf( GutenbergThemeJsonData::class, $filtered );
		$this->assertArrayNotHasKey( 'kadence', $filtered->get_data()['settings']['custom'] ?? [] );
		$this->assertArrayNotHasKey( 'kadence/singlebtn', $filtered->get_data()['styles']['blocks'] ?? [] );
	}

	public function testFseModeKeepsTheBlockStyles(): void {
		add_filter( 'kadence_blocks_is_fse_mode', '__return_true' );

		$filtered = $this->container->get( User_Data_Filter::class )->filter( new WP_Theme_JSON_Data( self::DATA, 'custom' ) );

		$this->assertArrayNotHasKey( 'kadence', $filtered->get_data()['settings']['custom'] ?? [] );
		$this->assertSame( [ 'background' => '#cc0000' ], $filtered->get_data()['styles']['blocks']['kadence/singlebtn']['color'] ?? null );
	}

	/**
	 * In FSE mode, a design-token reference in a supported block's style renders as its CSS variable.
	 *
	 * @return void
	 */
	public function testFseModeRendersDesignTokenReferencesAsCssVariables(): void {
		$style = $this->filtered_style(
			[
				'color' => [
					'background' => '{primitive.color.notice.error}',
					'text'       => '#ffffff',
				],
			]
		);

		$this->assertSame( 'var(--kb-token--primitive--color--notice--error)', $style['color']['background'] ?? null );
		$this->assertSame( '#ffffff', $style['color']['text'] ?? null );
	}

	/**
	 * In FSE mode, a design-token reference in a supported block's tablet or mobile style renders as its CSS variable.
	 *
	 * @return void
	 */
	public function testFseModeRendersDesignTokenReferencesInResponsiveStates(): void {
		if ( ! method_exists( 'WP_Theme_JSON', 'get_viewport_media_queries' ) ) {
			$this->markTestSkipped( 'Responsive style states need WordPress 7.1.' );
		}

		$style = $this->filtered_style( [ '@mobile' => [ 'color' => [ 'background' => '{primitive.color.notice.error}' ] ] ] );

		$this->assertSame( 'var(--kb-token--primitive--color--notice--error)', $style['@mobile']['color']['background'] ?? null );
	}

	/**
	 * In FSE mode, a design token the active library doesn't define is left out, in either stored form, and a
	 * defined one stored as its CSS variable is kept.
	 *
	 * @return void
	 */
	public function testFseModeLeavesOutUndefinedDesignTokens(): void {
		$style = $this->filtered_style(
			[
				'color' => [
					'background' => '{primitive.color.notice.does-not-exist}',
					'text'       => 'var(--kb-token--primitive--color--notice--does-not-exist)',
					'gradient'   => 'var(--kb-token--primitive--color--notice--error)',
				],
			]
		);

		$this->assertArrayNotHasKey( 'background', $style['color'] ?? [] );
		$this->assertArrayNotHasKey( 'text', $style['color'] ?? [] );
		$this->assertSame( 'var(--kb-token--primitive--color--notice--error)', $style['color']['gradient'] ?? null );
	}

	/**
	 * In FSE mode, data with no Kadence values and no design-token references comes back as the same object.
	 *
	 * @return void
	 */
	public function testFseModeReturnsDataWithoutTokenReferencesAsIs(): void {
		add_filter( 'kadence_blocks_is_fse_mode', '__return_true' );

		$data = [
			'version' => 3,
			'styles'  => self::DATA['styles'],
		];

		$theme_json = new WP_Theme_JSON_Data( $data, 'custom' );

		$this->assertSame( $theme_json, $this->container->get( User_Data_Filter::class )->filter( $theme_json ) );
	}

	public function testUnchangedGutenbergDataIsReturnedAsIs(): void {
		$theme_json = new GutenbergThemeJsonData( [ 'version' => 3 ], 'custom' );

		$this->assertSame( $theme_json, $this->container->get( User_Data_Filter::class )->filter( $theme_json ) );
	}

	/**
	 * Runs a Single Button style through the filter in FSE mode.
	 *
	 * @param array<string, mixed> $style The block's style.
	 *
	 * @return array<string, mixed> The block's style after the filter.
	 */
	private function filtered_style( array $style ): array {
		add_filter( 'kadence_blocks_is_fse_mode', '__return_true' );

		$data = [
			'version' => 3,
			'styles'  => [ 'blocks' => [ 'kadence/singlebtn' => $style ] ],
		];

		return $this->container->get( User_Data_Filter::class )->filter( new WP_Theme_JSON_Data( $data, 'custom' ) )->get_data()['styles']['blocks']['kadence/singlebtn'] ?? [];
	}
}
