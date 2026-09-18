<?php declare( strict_types=1 );
// cspell:ignore xxs xxl xxxl .

namespace Tests\wpunit\Resources\Design_Tokens\Registry;

use Generator;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use Tests\Support\Classes\TestCase;

final class Scale_Step_LabelsTest extends TestCase {

	/**
	 * Every scale step declares a full-word label rather than the uppercase form of its slug.
	 *
	 * @dataProvider scaleStepLabelProvider
	 *
	 * @param string $token_id The registered token id.
	 * @param string $expected The label the step must carry.
	 *
	 * @return void
	 */
	public function testScaleStepsUseFullWordLabels( string $token_id, string $expected ): void {
		$token = $this->declared_registry()->get( $token_id );

		$this->assertNotNull( $token, "Expected {$token_id} to be registered." );
		$this->assertSame( $expected, $token->label );
	}

	/**
	 * No declared token is labeled with the uppercase form of its own final id segment.
	 *
	 * Guards the whole registry rather than a fixed list, so a scale added later cannot quietly
	 * reintroduce a strtoupper() label. The declarations resolver still falls back to the uppercase
	 * slug for a step with no entry in its label map, which keeps such a step visible at render time;
	 * this test is what makes that fallback a bug to fix rather than a state to ship, so a new step
	 * failing here means its label is missing, not that the test is wrong.
	 *
	 * @return void
	 */
	public function testNoDeclaredTokenIsLabeledWithItsUppercaseSlug(): void {
		foreach ( $this->declared_registry()->all() as $token ) {
			$segments = explode( '.', $token->id );
			$slug     = (string) end( $segments );

			$this->assertNotSame(
				strtoupper( $slug ),
				$token->label,
				"Token {$token->id} is still labeled with its uppercase slug."
			);
		}
	}

	/**
	 * Sample steps from every scale, including the two spellings that mean the same step.
	 *
	 * @return Generator
	 */
	public function scaleStepLabelProvider(): Generator {
		yield 'spacing xxs' => [
			'token_id' => 'primitive.dimension.spacing.xxs',
			'expected' => '2X Small',
		];

		yield 'spacing 5xl' => [
			'token_id' => 'primitive.dimension.spacing.5xl',
			'expected' => '5X Large',
		];

		yield 'gap none keeps its own label' => [
			'token_id' => 'primitive.dimension.gap.none',
			'expected' => 'None',
		];

		yield 'border width sm' => [
			'token_id' => 'primitive.dimension.border-width.sm',
			'expected' => 'Small',
		];

		yield 'icon size lg' => [
			'token_id' => 'primitive.dimension.icon-size.lg',
			'expected' => 'Large',
		];

		yield 'shadow md' => [
			'token_id' => 'primitive.shadow.md',
			'expected' => 'Medium',
		];

		yield 'font size xxxl' => [
			'token_id' => 'primitive.dimension.font-size.xxxl',
			'expected' => '3X Large',
		];

		yield 'radius 2xl is unchanged' => [
			'token_id' => 'primitive.dimension.radius.2xl',
			'expected' => '2X Large',
		];

		yield 'radius full is unchanged' => [
			'token_id' => 'primitive.dimension.radius.full',
			'expected' => 'Full',
		];
	}

	/**
	 * A registry populated straight from the declarations file.
	 *
	 * Built per call rather than read from the container so a token another test leaked into the
	 * shared singleton cannot fail the registry-wide guard above.
	 *
	 * @return Token_Registry The registry holding exactly the declared tokens.
	 */
	private function declared_registry(): Token_Registry {
		$registry     = new Token_Registry();
		$declarations = require KADENCE_BLOCKS_PATH . 'includes/resources/Design_Tokens/Registry/declarations.php';

		foreach ( $declarations['tokens'] as $token ) {
			$registry->register( $token );
		}

		return $registry;
	}
}
