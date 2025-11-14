<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer;

use KadenceWP\KadenceBlocks\Optimizer\State;
use Tests\Support\Classes\TestCase;

final class StateTest extends TestCase {

	private State $state;

	protected function setUp(): void {
		parent::setUp();

		$this->state = $this->container->get( State::class );
	}

	public function testItUsesDefaultStateWithEmptySettings(): void {
		$this->assertSame( State::DEFAULT_STATE, $this->state->enabled() );
	}

	public function testItUsesDefaultStateWithMissingSetting(): void {
		$json = wp_json_encode(
			[
				'some_other_setting' => true,
			]
		);

		$result = update_option( 'kadence_blocks_settings', $json );

		$this->assertTrue( $result );
		$this->assertSame( State::DEFAULT_STATE, $this->state->enabled() );
	}

	public function testItIsDisabledWithSettingAsFalse(): void {
		$json = wp_json_encode(
			[
				State::SETTINGS_KEY => false,
			]
		);

		$result = update_option( 'kadence_blocks_settings', $json );

		$this->assertTrue( $result );
		$this->assertFalse( $this->state->enabled() );
	}

	public function testItIsDisabledWithInvalidValue(): void {
		$json = wp_json_encode(
			[
				State::SETTINGS_KEY => 'maybe',
			]
		);

		$result = update_option( 'kadence_blocks_settings', $json );

		$this->assertTrue( $result );
		$this->assertFalse( $this->state->enabled() );
	}

	public function testItIsDisabledWithInt(): void {
		$json = wp_json_encode(
			[
				State::SETTINGS_KEY => 0,
			]
		);

		$result = update_option( 'kadence_blocks_settings', $json );

		$this->assertTrue( $result );
		$this->assertFalse( $this->state->enabled() );
	}

	public function testItIsDisabledWithNo(): void {
		$json = wp_json_encode(
			[
				State::SETTINGS_KEY => 'no',
			]
		);

		$result = update_option( 'kadence_blocks_settings', $json );

		$this->assertTrue( $result );
		$this->assertFalse( $this->state->enabled() );
	}

	public function testItIsEnabledWithCorrectOptionKey(): void {
		$json = wp_json_encode(
			[
				State::SETTINGS_KEY => true,
			]
		);

		$result = update_option( 'kadence_blocks_settings', $json );

		$this->assertTrue( $result );
		$this->assertTrue( $this->state->enabled() );
	}

	public function testItIsEnabledWithInt(): void {
		$json = wp_json_encode(
			[
				State::SETTINGS_KEY => 1,
			]
		);

		$result = update_option( 'kadence_blocks_settings', $json );

		$this->assertTrue( $result );
		$this->assertTrue( $this->state->enabled() );
	}

	public function testItIsEnabledWithYes(): void {
		$json = wp_json_encode(
			[
				State::SETTINGS_KEY => 'yes',
			]
		);

		$result = update_option( 'kadence_blocks_settings', $json );

		$this->assertTrue( $result );
		$this->assertTrue( $this->state->enabled() );
	}
}
