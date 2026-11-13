<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Googlemaps;

use Generator;
use Kadence_Blocks_Css_Section;
use Kadence_Blocks_Googlemaps_Align_Css;
use Kadence_Blocks_Googlemaps_Filter_Css;
use Tests\wpunit\CssBuilders\Free_Section_Test_Case;

/**
 * The sections of the googlemaps CSS, one by one.
 */
final class GooglemapsSectionsTest extends Free_Section_Test_Case {

	private const SELECTOR = '.kb-google-maps-containerabc';

	/**
	 * A section writes the CSS expected for the attributes.
	 *
	 * @dataProvider sectionProvider
	 *
	 * @param Kadence_Blocks_Css_Section $section    The section under test.
	 * @param array<string, mixed>       $attributes The block attributes.
	 * @param string                     $expected   The CSS expected.
	 *
	 * @return void
	 */
	public function testSection( Kadence_Blocks_Css_Section $section, array $attributes, string $expected ): void {
		$this->assertSameCss( $expected, $this->write_section( $section, $attributes, 'abc', self::SELECTOR ) );
	}

	/**
	 * @return Generator
	 */
	public function sectionProvider(): Generator {
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/googlemaps/loader.php';

		yield from $this->alignProvider();
		yield from $this->filterProvider();
	}

	/**
	 * @return Generator
	 */
	private function alignProvider(): Generator {
		yield 'center margins are auto on both sides' => [
			'section'    => new Kadence_Blocks_Googlemaps_Align_Css( 0 ),
			'attributes' => [ 'textAlign' => [ 'center', 'left', 'right' ] ],
			'expected'   => self::SELECTOR . '{margin-left:auto !important;margin-right:auto !important;}',
		];
		yield 'left leaves the right margin auto' => [
			'section'    => new Kadence_Blocks_Googlemaps_Align_Css( 1 ),
			'attributes' => [ 'textAlign' => [ 'center', 'left', 'right' ] ],
			'expected'   => self::SELECTOR . '{margin-right:auto !important;}',
		];
		yield 'right leaves the left margin auto' => [
			'section'    => new Kadence_Blocks_Googlemaps_Align_Css( 2 ),
			'attributes' => [ 'textAlign' => [ 'center', 'left', 'right' ] ],
			'expected'   => self::SELECTOR . '{margin-left:auto !important;}',
		];
		yield 'another alignment writes nothing' => [
			'section'    => new Kadence_Blocks_Googlemaps_Align_Css( 0 ),
			'attributes' => [ 'textAlign' => [ 'justify' ] ],
			'expected'   => '',
		];
		yield 'an alignment that is not text writes nothing' => [
			'section'    => new Kadence_Blocks_Googlemaps_Align_Css( 0 ),
			'attributes' => [ 'textAlign' => [ [ 'center' ] ] ],
			'expected'   => '',
		];
		yield 'a missing device writes nothing' => [
			'section'    => new Kadence_Blocks_Googlemaps_Align_Css( 2 ),
			'attributes' => [ 'textAlign' => [ 'center' ] ],
			'expected'   => '',
		];
		yield 'a missing attribute writes nothing' => [
			'section'    => new Kadence_Blocks_Googlemaps_Align_Css( 0 ),
			'attributes' => [],
			'expected'   => '',
		];
	}

	/**
	 * @return Generator
	 */
	private function filterProvider(): Generator {
		yield 'the filter is written with its amount' => [
			'section'    => new Kadence_Blocks_Googlemaps_Filter_Css(),
			'attributes' => [
				'mapFilter'       => 'sepia',
				'mapFilterAmount' => 80,
			],
			'expected'   => self::SELECTOR . '{filter:sepia(80%);}',
		];
		yield 'a numeric text amount is kept as it is' => [
			'section'    => new Kadence_Blocks_Googlemaps_Filter_Css(),
			'attributes' => [
				'mapFilter'       => 'grayscale',
				'mapFilterAmount' => '12.5',
			],
			'expected'   => self::SELECTOR . '{filter:grayscale(12.5%);}',
		];
		yield 'the amount is 50 percent when it is not a number' => [
			'section'    => new Kadence_Blocks_Googlemaps_Filter_Css(),
			'attributes' => [
				'mapFilter'       => 'invert',
				'mapFilterAmount' => 'much',
			],
			'expected'   => self::SELECTOR . '{filter:invert(50%);}',
		];
		yield 'the amount is 50 percent when it is missing' => [
			'section'    => new Kadence_Blocks_Googlemaps_Filter_Css(),
			'attributes' => [ 'mapFilter' => 'blur' ],
			'expected'   => self::SELECTOR . '{filter:blur(50%);}',
		];
	}
}
