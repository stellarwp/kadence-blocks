<?php

namespace Tests\wpunit\Blocks;

use Kadence_Blocks_Countup_Block;
use Tests\Support\Classes\KadenceBlocksUnit;

class CountupTest extends KadenceBlocksUnit {
	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'countup';

	/**
	 * Block instance.
	 *
	 * @var Kadence_Blocks_Countup_Block
	 */
	protected $block;

	public function testIsScriptRegistered() {
		$this->block->register_scripts();

		$this->assertTrue( wp_script_is( 'kadence-countup', 'registered' ), 'Count up library is registered' );
		$this->assertTrue( wp_script_is( 'kadence-blocks-countup', 'registered' ), 'Count up script is registered' );
	}

	protected function setUp(): void {
		parent::setUp();
		$this->block = new Kadence_Blocks_Countup_Block();
	}

	public function test_title_tag_keeps_valid_level_and_tag(): void {
		add_filter( 'kadence-blocks-countup-static', '__return_true' );

		$heading = [
			'htmlTag' => 'heading',
			'level'   => 3,
		];
		$tag     = [
			'htmlTag' => 'p',
			'level'   => 3,
		];

		$this->assertStringContainsString( '<h3 class="kb-count-up-title">', $this->render_title( 'valid_level', $heading ) );
		$this->assertStringContainsString( '<p class="kb-count-up-title">', $this->render_title( 'valid_tag', $tag ) );
	}

	public function test_title_tag_ignores_invalid_level_and_tag(): void {
		add_filter( 'kadence-blocks-countup-static', '__return_true' );

		$invalid_level = [
			'htmlTag' => 'heading',
			'level'   => 'x onfocus=alert(1)',
		];
		$invalid_tag   = [
			'htmlTag' => 'p onmouseover=alert(1)',
			'level'   => 2,
		];

		$this->assertStringContainsString( '<h2 class="kb-count-up-title">', $this->render_title( 'level_1', $invalid_level ) );
		$this->assertStringContainsString( '<div class="kb-count-up-title">', $this->render_title( 'tag_1', $invalid_tag ) );
	}

	private function render_title( string $unique_id, array $title_font ): string {
		$attributes = $this->block->get_attributes_with_defaults(
			$unique_id,
			[
				'uniqueID'     => $unique_id,
				'title'        => 'Count',
				'displayTitle' => true,
				'titleFont'    => [ $title_font ],
			]
		);

		return $this->block->build_html( $attributes, $unique_id, '', $this->generate_block_instance( 'kadence/countup', $attributes ) );
	}


}
