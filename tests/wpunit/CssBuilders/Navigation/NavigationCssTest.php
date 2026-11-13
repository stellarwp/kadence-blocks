<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Navigation;

use Generator;
use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Block_Context;
use Kadence_Blocks_Css_Post_Attributes;
use Kadence_Blocks_Navigation_Css;
use Kadence_Blocks_Navigation_Dropdown_Shadow_Css;
use Kadence_Blocks_Navigation_Plain_Attributes;
use Tests\wpunit\CssBuilders\Entry_Build_Test_Case;

/**
 * The CSS of the navigation block, with the exact rules for a few navigations served by a fake post, and the classes it is made of.
 *
 * The matrix of the navigation serves real settings for post ids that no other case uses, and checks the CSS against the
 * original builder.
 */
final class NavigationCssTest extends Entry_Build_Test_Case {

	private const SHADOW = [
		'enable'  => true,
		'color'   => '#000000',
		'opacity' => 0.5,
		'spread'  => 1,
		'blur'    => 10,
		'hOffset' => 2,
		'vOffset' => 3,
		'inset'   => false,
	];

	protected function setUp(): void {
		parent::setUp();

		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-navigation-css.php';
	}

	/**
	 * The attributes of a post with every state of the link saved, as a post always has them.
	 *
	 * @param array<string, mixed> $post The attributes of the navigation post.
	 *
	 * @return array<string, mixed>
	 */
	private function with_button_states( array $post ): array {
		$states = [];

		foreach ( [ '', 'Hover', 'Active' ] as $state ) {
			$states = array_merge(
				$states,
				[
					'backgroundType' . $state     => '',
					'backgroundGradient' . $state => '',
					'borderRadiusUnit' . $state   => '',
					'shadow' . $state             => '',
				] 
			);

			foreach ( [ '', 'Tablet', 'Mobile' ] as $size ) {
				$states = array_merge(
					$states,
					[
						'linkColor' . $state . $size    => '',
						'background' . $state . $size   => '',
						'border' . $state . $size       => '',
						'borderRadius' . $state . $size => '',
					] 
				);
			}
		}

		return array_merge( $states, $post );
	}

	/**
	 * What the block answers when the builder calls it, with the calls it got.
	 *
	 * @param array<string, mixed>          $post  The attributes of the navigation post.
	 * @param array<int, array<int, mixed>> $calls The calls the builder made, filled while it builds.
	 *
	 * @return callable
	 */
	private function block( array $post, array &$calls ): callable {
		return static function ( string $member, ...$arguments ) use ( $post, &$calls ) {
			$calls[] = 'sized_dynamic_styles' === $member ? [ $member, $arguments[2], $arguments[3], $arguments[1]['marker'] ] : array_merge( [ $member ], $arguments );

			if ( 'get_attributes_with_defaults_cpt' === $member ) {
				return $post;
			}

			$arguments[0]->set_media_state( strtolower( $arguments[3] ) );
			$arguments[0]->set_selector( '.sized' . $arguments[2] );
			$arguments[0]->add_property( 'order', $arguments[3] );

			return null;
		};
	}

	/**
	 * The CSS of a navigation is written from the attributes of its post, which are plain lists, never from those of the block.
	 *
	 * @return void
	 */
	public function testBuildWritesTheAttributesOfThePost(): void {
		$calls = [];
		$post  = [
			'marker'         => 'post',
			'marginLink'     => [ 1, 2, 3, 4 ],
			'marginLinkUnit' => 'em',
			'padding'        => [ 5, 6, 7, 8 ],
			'dropdownShadow' => [ (object) self::SHADOW ],
			'typography'     => [
				(object) [
					'size'     => [ 20, '', '' ],
					'sizeType' => 'px',
				],
			],
			'linkColor'      => '#ff0000',
		];
		$css   = $this->build_entry( 'Kadence_Blocks_Navigation_Css', 'navigation', [ 'id' => 0 ], $this->block( $this->with_button_states( $post ), $calls ) );
		$root  = '.wp-block-kadence-navigationabc';
		$menu  = $root . ' > .navigation > .menu-container > .menu';

		$this->assertSameCss(
			'.sizedabc{order:Desktop;}'
			. '@media all and (max-width: 1024px){.sizedabc{order:Tablet;}}'
			. '@media all and (max-width: 767px){.sizedabc{order:Mobile;}}'
			. $root . '{--kb-nav-top-link-margin-top:1em;--kb-nav-top-link-margin-right:2em;--kb-nav-top-link-margin-bottom:3em;--kb-nav-top-link-margin-left:4em;--kb-nav-dropdown-box-shadow:2px 3px 10px 1px rgba(0, 0, 0, 0.5);--kb-nav-top-link-color:#ff0000;}'
			. $menu . '{--kb-nav-padding-top:5px;--kb-nav-padding-right:6px;--kb-nav-padding-bottom:7px;--kb-nav-padding-left:8px;}'
			. $menu . ' > .wp-block-kadence-navigation-link > .kb-link-wrap{font-size:20px;}',
			$css
		);
		$this->assertSame(
			[
				[ 'get_attributes_with_defaults_cpt', 0, 'kadence_navigation', '_kad_navigation_' ],
				[ 'sized_dynamic_styles', 'abc', 'Desktop', 'post' ],
				[ 'sized_dynamic_styles', 'abc', 'Tablet', 'post' ],
				[ 'sized_dynamic_styles', 'abc', 'Mobile', 'post' ],
			],
			$calls
		);
	}

	/**
	 * A navigation block without a post has nothing to write, and does not even ask for the post.
	 *
	 * @dataProvider missingIdProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 *
	 * @return void
	 */
	public function testBuildWithoutPost( array $attributes ): void {
		$calls   = [];
		$context = new Kadence_Blocks_Css_Block_Context( 'navigation', $this->block( [], $calls ) );

		$this->assertNull( ( new Kadence_Blocks_Navigation_Css( $context ) )->build( $attributes, new Kadence_Blocks_CSS(), 'abc', 'abc-none' ) );
		$this->assertSame( [], $calls );
	}

	/**
	 * @return Generator
	 */
	public function missingIdProvider(): Generator {
		yield 'no id' => [ 'attributes' => [] ];

		yield 'an id that is nothing' => [ 'attributes' => [ 'id' => null ] ];
	}

	/**
	 * The shadow of the dropdown is only written when it is switched on.
	 *
	 * @dataProvider shadowProvider
	 *
	 * @param array<string, mixed> $attributes The attributes of the navigation post.
	 * @param string               $expected   The CSS expected.
	 *
	 * @return void
	 */
	public function testDropdownShadow( array $attributes, string $expected ): void {
		$this->assertSameCss( $expected, $this->write_section( new Kadence_Blocks_Navigation_Dropdown_Shadow_Css(), $attributes, 'abc', '.nav' ) );
	}

	/**
	 * @return Generator
	 */
	public function shadowProvider(): Generator {
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/navigation/loader.php';

		yield 'a shadow that is switched on' => [
			'attributes' => [ 'dropdownShadow' => [ self::SHADOW ] ],
			'expected'   => '.nav{--kb-nav-dropdown-box-shadow:2px 3px 10px 1px rgba(0, 0, 0, 0.5);}',
		];

		yield 'a shadow that is switched off' => [
			'attributes' => [ 'dropdownShadow' => [ array_merge( self::SHADOW, [ 'enable' => false ] ) ] ],
			'expected'   => '',
		];

		yield 'a shadow that does not say' => [
			'attributes' => [ 'dropdownShadow' => [ [ 'color' => '#000000' ] ] ],
			'expected'   => '',
		];

		yield 'a shadow that is text' => [
			'attributes' => [ 'dropdownShadow' => 'shadow' ],
			'expected'   => '',
		];

		yield 'no shadow' => [
			'attributes' => [],
			'expected'   => '',
		];
	}

	/**
	 * The attributes are plain lists whatever the post source hands over, and nothing when it cannot be turned into lists.
	 *
	 * @dataProvider plainProvider
	 *
	 * @param mixed      $saved    What the source hands over.
	 * @param array|null $expected The plain attributes.
	 *
	 * @return void
	 */
	public function testPlainAttributes( $saved, $expected ): void {
		$source = new class( $saved ) implements Kadence_Blocks_Css_Post_Attributes {
			/**
			 * @var mixed
			 */
			private $saved;

			/**
			 * @param mixed $saved What the source hands over.
			 */
			public function __construct( $saved ) {
				$this->saved = $saved;
			}

			/**
			 * @param int|string $post_id The post id.
			 *
			 * @return mixed
			 */
			public function for_post( $post_id ) {
				return [ $post_id => $this->saved ];
			}
		};

		$this->assertSame( $expected, ( new Kadence_Blocks_Navigation_Plain_Attributes( $source ) )->for_post( 5 ) );
	}

	/**
	 * @return Generator
	 */
	public function plainProvider(): Generator {
		yield 'an object is a list' => [
			'saved'    => (object) [ 'a' => (object) [ 'b' => 1 ] ],
			'expected' => [ 5 => [ 'a' => [ 'b' => 1 ] ] ],
		];

		yield 'lists stay lists' => [
			'saved'    => [ 'a', [ 'b' => 2 ] ],
			'expected' => [ 5 => [ 'a', [ 'b' => 2 ] ] ],
		];

		yield 'what cannot be encoded is nothing' => [
			'saved'    => INF,
			'expected' => null,
		];
	}
}
