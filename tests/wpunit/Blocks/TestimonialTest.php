<?php

namespace Tests\wpunit\Blocks;

use Kadence_Blocks_Testimonial_Block;
use Tests\Support\Classes\KadenceBlocksUnit;

class TestimonialTest extends KadenceBlocksUnit {
	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'testimonial';

	/**
	 * Block instance.
	 *
	 * @var Kadence_Blocks_Testimonial_Block
	 */
	protected $block;

	protected function setUp(): void {
		parent::setUp();
		$this->block = new Kadence_Blocks_Testimonial_Block();
	}

	private const MEDIA_STYLES = [ [ 'width' => 60, 'backgroundSize' => 'cover' ] ];

	public function testIconColorIsEscaped() {
		$attributes = [ 'uniqueID' => '9_c', 'media' => 'icon', 'icon' => 'fe_star', 'ititle' => '', 'color' => 'red" onmouseover="alert(1)', 'isize' => 48 ];
		$html       = $this->invokeMethod( $this->block, 'render_media', [ $attributes, self::MEDIA_STYLES, 'inlineimage', 300 ] );

		$this->assertStringContainsString( 'kt-svg-testimonial-icon', $html );
		$this->assertStringNotContainsString( 'onmouseover="', $html );
	}

	public function testMediaImageUrlIsEscaped() {
		$attributes = [ 'uniqueID' => '9_u', 'media' => 'image', 'icon' => '', 'url' => 'https://x/a.jpg" onerror="alert(1)' ];
		$html       = $this->invokeMethod( $this->block, 'render_media', [ $attributes, self::MEDIA_STYLES, 'inlineimage', 300 ] );

		$this->assertStringContainsString( 'kt-testimonial-image', $html );
		$this->assertStringNotContainsString( 'onerror="', $html );
	}

	public function testGlobalIconClassIsEscaped() {
		$icon_styles = [ [ 'icon' => 'fe_aperture" onmouseover="alert(1)', 'stroke' => 2, 'title' => '' ] ];
		$html        = $this->invokeMethod( $this->block, 'render_icon', [ [ 'uniqueID' => '9_i' ], $icon_styles ] );

		$this->assertStringContainsString( 'kt-svg-testimonial-global-icon-icon-', $html );
		$this->assertStringNotContainsString( 'onmouseover="', $html );
	}

	public function testValidIconColorRendersUnchanged() {
		$attributes = [ 'uniqueID' => '9_c', 'media' => 'icon', 'icon' => 'fe_star', 'ititle' => '', 'color' => '#123456', 'isize' => 48 ];
		$html       = $this->invokeMethod( $this->block, 'render_media', [ $attributes, self::MEDIA_STYLES, 'inlineimage', 300 ] );

		$this->assertStringContainsString( 'color: #123456', $html );
	}
}
