<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Admin\Feed;

use KadenceWP\KadenceBlocks\Design_Tokens\Admin\Feed\Responsive_Feed;
use Tests\Support\Classes\TestCase;

final class Responsive_FeedTest extends TestCase {

	private Responsive_Feed $feed;

	protected function setUp(): void {
		parent::setUp();

		$this->feed = new Responsive_Feed();
	}

	/**
	 * A stepped responsive leaf is surfaced with its base value and its raw per-breakpoint map, keyed by
	 * token id, so the editor hydrates the desktop / tablet / mobile inputs exactly as authored.
	 *
	 * @return void
	 */
	public function testItSurfacesASteppedResponsiveShape(): void {
		$document = [
			'semantic' => [
				'font-size' => [
					'control' => [
						'$type'       => 'dimension',
						'$value'      => '1.125rem',
						'$extensions' => [
							'com.kadence.designTokens' => [
								'responsive' => [
									'tablet' => '1.0625rem',
									'mobile' => '1rem',
								],
							],
						],
					],
				],
			],
		];

		$this->assertSame(
			[
				'semantic.font-size.control' => [
					'base'       => '1.125rem',
					'responsive' => [
						'tablet' => '1.0625rem',
						'mobile' => '1rem',
					],
				],
			],
			$this->feed->from_document( $document )
		);
	}

	/**
	 * A clamp leaf is surfaced with its base value and its raw min / preferred / max slots.
	 *
	 * @return void
	 */
	public function testItSurfacesAClampShape(): void {
		$document = [
			'semantic' => [
				'font-size' => [
					'control' => [
						'$type'       => 'dimension',
						'$value'      => 'clamp(1.1rem, 0.995rem + 0.326vw, 1.25rem)',
						'$extensions' => [
							'com.kadence.designTokens' => [
								'clamp' => [
									'min'       => '1.1rem',
									'preferred' => '0.995rem + 0.326vw',
									'max'       => '1.25rem',
								],
							],
						],
					],
				],
			],
		];

		$shape = $this->feed->from_document( $document );

		$this->assertArrayHasKey( 'semantic.font-size.control', $shape );
		$this->assertSame( '0.995rem + 0.326vw', $shape['semantic.font-size.control']['clamp']['preferred'] );
	}

	/**
	 * A flat responsive-capable leaf and a non-responsive-capable type are both absent from the map, so the
	 * editor falls back to the flat resolved value for them.
	 *
	 * @return void
	 */
	public function testItOmitsFlatAndNonCapableTokens(): void {
		$document = [
			'semantic' => [
				'font-size'   => [
					'control' => [
						'$type'  => 'dimension',
						'$value' => '1.125rem',
					],
				],
				'font-family' => [
					'control' => [
						'$type'  => 'fontFamily',
						'$value' => [ 'Inter', 'sans-serif' ],
					],
				],
			],
		];

		$this->assertSame( [], $this->feed->from_document( $document ) );
	}
}
