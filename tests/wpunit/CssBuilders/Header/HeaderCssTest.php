<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Header;

use Generator;
use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Block_Context;
use Kadence_Blocks_Header_Backdrop_Condition;
use Kadence_Blocks_Header_Css;
use Kadence_Blocks_Header_Environment;
use Kadence_Blocks_Header_Site_Environment;
use ReflectionMethod;
use Tests\wpunit\CssBuilders\Entry_Build_Test_Case;

/**
 * The CSS of the header block, with the exact rules for a few headers served by a fake post, and the classes it is made of.
 *
 * The matrix of the header serves real settings for post ids that no other case uses, and checks the CSS against the
 * original builder. It cannot tell the backdrop filter, which is only written when Kadence Blocks Pro is active, so it is
 * pinned here with a fake environment.
 */
final class HeaderCssTest extends Entry_Build_Test_Case {

	private const CONTAINER = '.wp-block-kadence-headerabc .kb-header-container';

	protected function setUp(): void {
		parent::setUp();

		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-header-css.php';
	}

	/**
	 * What the block answers when the builder calls it, with the calls it got.
	 *
	 * @param array<string, mixed>              $header The attributes of the header post.
	 * @param array<int, array<int, mixed>>     $calls  The calls the builder made, filled while it builds.
	 *
	 * @return callable
	 */
	private function block( array $header, array &$calls ): callable {
		return static function ( string $member, ...$arguments ) use ( $header, &$calls ) {
			$calls[] = array_merge( [ $member ], array_slice( $arguments, $member === 'sized_dynamic_styles' ? 2 : 0 ) );

			if ( 'get_attributes_with_defaults_cpt' === $member ) {
				return $header;
			}

			$arguments[0]->set_media_state( strtolower( $arguments[3] ) );
			$arguments[0]->set_selector( '.sized' . $arguments[2] );
			$arguments[0]->add_property( 'order', $arguments[3] . ':' . $arguments[1]['marker'] );

			return null;
		};
	}

	/**
	 * The CSS of a header is written from the attributes of its post, never from those of the block.
	 *
	 * @return void
	 */
	public function testBuildWritesTheAttributesOfThePost(): void {
		$calls  = [];
		$header = [
			'marker'                   => 'post',
			'margin'                   => [ 1, 2, 3, 4 ],
			'marginUnit'               => 'em',
			'padding'                  => [ 5, 6, 7, 8 ],
			'paddingUnit'              => 'rem',
			'typography'               => [
				[
					'size'     => [ 20, '', '' ],
					'sizeType' => 'px',
				],
			],
			'pro_backdropFilterString' => 'blur(5px)',
		];
		$css    = $this->build_entry(
			'Kadence_Blocks_Header_Css',
			'header',
			[
				'id'     => 12,
				'margin' => [ 9, 9, 9, 9 ],
			],
			$this->block( $header, $calls ) 
		);

		$this->assertSameCss(
			'.sizedabc{order:Desktop:post;}'
			. '@media all and (max-width: 1024px){.sizedabc{order:Tablet:post;}}'
			. '@media all and (max-width: 767px){.sizedabc{order:Mobile:post;}}'
			. self::CONTAINER . '{margin-top:1em;margin-right:2em;margin-bottom:3em;margin-left:4em;padding-top:5rem;padding-right:6rem;padding-bottom:7rem;padding-left:8rem;font-size:20px;}',
			$css
		);
		$this->assertSame(
			[
				[ 'get_attributes_with_defaults_cpt', 12, 'kadence_header', '_kad_header_' ],
				[ 'sized_dynamic_styles', 'abc', 'Desktop' ],
				[ 'sized_dynamic_styles', 'abc', 'Tablet' ],
				[ 'sized_dynamic_styles', 'abc', 'Mobile' ],
			],
			$calls
		);
	}

	/**
	 * A header block without a post has nothing to write, and does not even ask for the post.
	 *
	 * @dataProvider missingIdProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 *
	 * @return void
	 */
	public function testBuildWithoutPost( array $attributes ): void {
		$calls   = [];
		$context = new Kadence_Blocks_Css_Block_Context( 'header', $this->block( [], $calls ) );

		$this->assertNull( ( new Kadence_Blocks_Header_Css( $context ) )->build( $attributes, new Kadence_Blocks_CSS(), 'abc', 'abc-none' ) );
		$this->assertSame( [], $calls );
	}

	/**
	 * @return Generator
	 */
	public function missingIdProvider(): Generator {
		yield 'no id' => [ 'attributes' => [] ];

		yield 'an id of zero' => [ 'attributes' => [ 'id' => 0 ] ];

		yield 'an empty id' => [ 'attributes' => [ 'id' => '' ] ];
	}

	/**
	 * The backdrop filter is written on the container, and on the stuck header, with what keeps it above its siblings.
	 *
	 * @return void
	 */
	public function testBackdropSections(): void {
		$unused   = [];
		$builder  = new Kadence_Blocks_Header_Css( new Kadence_Blocks_Css_Block_Context( 'header', $this->block( [], $unused ) ) );
		$method   = new ReflectionMethod( $builder, 'backdrop_sections' );
		$sections = $method->invoke( $builder );
		$css      = new Kadence_Blocks_CSS();
		$css->set_style_id( 'header-backdrop' );
		$input = $this->input( [ 'pro_backdropFilterString' => 'blur(5px)' ], $css );

		foreach ( $sections as $section ) {
			$section->write( $input );
		}

		$this->assertSameCss(
			'.wp-block-kadence-headerabc .kb-header-container:not(:has(.item-is-stuck)), .wp-block-kadence-headerabc .item-is-stuck{position:relative;z-index:10;backdrop-filter:blur(5px);}',
			$css->css_output()
		);
	}

	/**
	 * The backdrop filter needs a filter to write and Kadence Blocks Pro to apply it.
	 *
	 * @dataProvider backdropProvider
	 *
	 * @param array<string, mixed> $attributes The attributes of the header post.
	 * @param bool                 $has_pro    Whether Kadence Blocks Pro is active.
	 * @param bool                 $expected   Whether the condition is met.
	 *
	 * @return void
	 */
	public function testBackdropCondition( array $attributes, bool $has_pro, bool $expected ): void {
		$environment = new class( $has_pro ) implements Kadence_Blocks_Header_Environment {
			/**
			 * @var bool
			 */
			private $has_pro;

			/**
			 * @param bool $has_pro Whether Kadence Blocks Pro is active.
			 */
			public function __construct( bool $has_pro ) {
				$this->has_pro = $has_pro;
			}

			/**
			 * @return bool
			 */
			public function has_pro(): bool {
				return $this->has_pro;
			}
		};
		$input       = $this->input( $attributes, new Kadence_Blocks_CSS() )->with( 'environment', $environment );

		$this->assertSame( $expected, ( new Kadence_Blocks_Header_Backdrop_Condition() )->is_met( $input ) );
	}

	/**
	 * @return Generator
	 */
	public function backdropProvider(): Generator {
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/header/loader.php';

		yield 'a filter with Pro' => [
			'attributes' => [ 'pro_backdropFilterString' => 'blur(5px)' ],
			'has_pro'    => true,
			'expected'   => true,
		];

		yield 'a filter without Pro' => [
			'attributes' => [ 'pro_backdropFilterString' => 'blur(5px)' ],
			'has_pro'    => false,
			'expected'   => false,
		];

		yield 'an empty filter with Pro' => [
			'attributes' => [ 'pro_backdropFilterString' => '' ],
			'has_pro'    => true,
			'expected'   => false,
		];

		yield 'no filter with Pro' => [
			'attributes' => [],
			'has_pro'    => true,
			'expected'   => false,
		];
	}

	/**
	 * The site environment knows whether Kadence Blocks Pro is active.
	 *
	 * @return void
	 */
	public function testSiteEnvironment(): void {
		$this->assertSame( class_exists( 'Kadence_Blocks_Pro' ), ( new Kadence_Blocks_Header_Site_Environment() )->has_pro() );
	}
}
