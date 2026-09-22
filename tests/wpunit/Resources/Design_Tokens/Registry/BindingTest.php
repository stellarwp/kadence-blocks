<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Registry;

use InvalidArgumentException;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Binding;
use Tests\Support\Classes\TestCase;

final class BindingTest extends TestCase {

	/**
	 * @return void
	 */
	public function testItParsesATokenReference(): void {
		$binding = Binding::from_array( 'button-bg', [ 'token' => 'semantic.color.button-bg' ] );

		$this->assertTrue( $binding->is_token_ref() );
		$this->assertSame( 'semantic.color.button-bg', $binding->token );
		$this->assertSame( [], $binding->projections );
	}

	/**
	 * @return void
	 */
	public function testItParsesInlineTargets(): void {
		$binding = Binding::from_array(
			'button-bg',
			[
				'kadence_slot' => 'palette3',
				'block_attr'   => 'background',
			]
		);

		$this->assertFalse( $binding->is_token_ref() );
		$this->assertNull( $binding->token );
		$this->assertSame(
			[
				'kadence_slot' => 'palette3',
				'block_attr'   => 'background',
			],
			$binding->projections
		);
	}

	/**
	 * @return void
	 */
	public function testItAcceptsTheBlockAttrTarget(): void {
		$binding = Binding::from_array( 'button-bg', [ 'block_attr' => 'background' ] );

		$this->assertSame( [ 'block_attr' => 'background' ], $binding->projections );
	}

	/**
	 * @return void
	 */
	public function testBlockAttrReturnsTheBoundAttributeOrNull(): void {
		$bound = Binding::from_array(
			'button-bg',
			[
				'token'      => 'semantic.color.button-bg',
				'block_attr' => 'background',
			]
		);
		$this->assertSame( 'background', $bound->block_attr() );

		// A binding with no block_attr target has no attribute to seed.
		$unbound = Binding::from_array( 'button-radius', [ 'css_var' => 'kb-btn-radius' ] );
		$this->assertNull( $unbound->block_attr() );
	}

	/**
	 * @return void
	 */
	public function testItAcceptsTheCssPropAndSelectorTargets(): void {
		$binding = Binding::from_array(
			'borderRadius',
			[
				'token'        => 'semantic.radius.media',
				'css_prop'     => 'border-radius',
				'css_selector' => ' img',
			]
		);

		$this->assertSame( 'border-radius', $binding->css_prop() );
		$this->assertSame( ' img', $binding->css_selector() );
	}

	/**
	 * @return void
	 */
	public function testCssPropAndSelectorReturnNullWhenAbsent(): void {
		// A binding with no css_prop/css_selector feeds no block-default rule.
		$binding = Binding::from_array( 'button-radius', [ 'css_var' => 'kb-btn-radius' ] );

		$this->assertNull( $binding->css_prop() );
		$this->assertNull( $binding->css_selector() );
		$this->assertNull( $binding->editor_css_selector() );
	}

	/**
	 * A declared editor_css_selector replaces css_selector for the editor build alone, for a block whose
	 * editor markup renders the bound property on a different descendant than its saved markup does.
	 *
	 * @return void
	 */
	public function testEditorCssSelectorOverridesTheFrontEndSelector(): void {
		$binding = Binding::from_array(
			'background',
			[
				'token'               => 'semantic.color.column-bg',
				'css_prop'            => 'background-color',
				'css_selector'        => '> .kt-inside-inner-col',
				'editor_css_selector' => '> .kadence-inner-column-inner',
			]
		);

		$this->assertSame( '> .kt-inside-inner-col', $binding->css_selector() );
		$this->assertSame( '> .kadence-inner-column-inner', $binding->editor_css_selector() );
	}

	/**
	 * With no editor_css_selector declared, the editor reuses the front-end selector — the right answer
	 * for every block whose two render paths agree, and what keeps the override opt-in.
	 *
	 * @return void
	 */
	public function testEditorCssSelectorFallsBackToTheFrontEndSelector(): void {
		$binding = Binding::from_array(
			'borderRadius',
			[
				'token'        => 'semantic.radius.media',
				'css_prop'     => 'border-radius',
				'css_selector' => ' img',
			]
		);

		$this->assertSame( ' img', $binding->editor_css_selector() );
	}

	/**
	 * @return void
	 */
	public function testItThrowsWhenEditorCssSelectorIsNotAString(): void {
		$this->expectException( InvalidArgumentException::class );

		Binding::from_array( 'background', [ 'editor_css_selector' => [] ] );
	}

	/**
	 * A declared css_state is exposed verbatim and marks the binding as a state binding, which is what tells
	 * the projectors it carries a declaration scoped to a UI state rather than the block's resting look.
	 *
	 * @return void
	 */
	public function testCssStateMarksTheBindingAsAStateBinding(): void {
		$binding = Binding::from_array(
			'backgroundHover',
			[
				'token'     => 'semantic.color.column-bg',
				'css_prop'  => 'background-color',
				'css_state' => ':hover > .kt-inside-inner-col',
			]
		);

		$this->assertSame( ':hover > .kt-inside-inner-col', $binding->css_state() );
		$this->assertTrue( $binding->is_state() );
	}

	/**
	 * A binding that declares no css_state is a resting-state binding, so both its state accessors read null
	 * and it never reaches the preset projector's state layer.
	 *
	 * @return void
	 */
	public function testABindingWithoutACssStateIsNotAStateBinding(): void {
		$binding = Binding::from_array(
			'background',
			[
				'token'    => 'semantic.color.column-bg',
				'css_prop' => 'background-color',
			]
		);

		$this->assertNull( $binding->css_state() );
		$this->assertNull( $binding->editor_css_state() );
		$this->assertFalse( $binding->is_state() );
	}

	/**
	 * A declared editor_css_state replaces css_state for the editor build alone, for a block whose editor
	 * markup paints a different element than its saved markup does.
	 *
	 * @return void
	 */
	public function testEditorCssStateOverridesTheFrontEndState(): void {
		$binding = Binding::from_array(
			'backgroundHover',
			[
				'token'            => 'semantic.color.column-bg',
				'css_prop'         => 'background-color',
				'css_state'        => ':hover > .kt-inside-inner-col',
				'editor_css_state' => ':hover > .kadence-inner-column-inner',
			]
		);

		$this->assertSame( ':hover > .kt-inside-inner-col', $binding->css_state() );
		$this->assertSame( ':hover > .kadence-inner-column-inner', $binding->editor_css_state() );
	}

	/**
	 * With no editor_css_state declared, the editor reuses the front-end state selector — right for every
	 * block whose two render paths agree on the element, and what keeps the override opt-in.
	 *
	 * @return void
	 */
	public function testEditorCssStateFallsBackToTheFrontEndState(): void {
		$binding = Binding::from_array(
			'hColor',
			[
				'token'     => 'semantic.color.icon',
				'css_prop'  => 'color',
				'css_state' => ':hover *.kb-svg-icon-wrap',
			]
		);

		$this->assertSame( ':hover *.kb-svg-icon-wrap', $binding->editor_css_state() );
	}

	/**
	 * @return void
	 */
	public function testItThrowsWhenCssStateIsNotAString(): void {
		$this->expectException( InvalidArgumentException::class );

		Binding::from_array( 'backgroundHover', [ 'css_state' => [] ] );
	}

	/**
	 * @return void
	 */
	public function testItThrowsWhenEditorCssStateIsNotAString(): void {
		$this->expectException( InvalidArgumentException::class );

		Binding::from_array( 'backgroundHover', [ 'editor_css_state' => 42 ] );
	}

	/**
	 * @return void
	 */
	public function testItThrowsWhenCssPropIsNotAString(): void {
		$this->expectException( InvalidArgumentException::class );

		Binding::from_array( 'borderRadius', [ 'css_prop' => true ] );
	}

	/**
	 * @return void
	 */
	public function testItAcceptsACssVarTarget(): void {
		$binding = Binding::from_array( 'button-radius', [ 'css_var' => 'kb-btn-radius' ] );

		$this->assertSame( 'kb-btn-radius', $binding->css_var() );
		$this->assertSame( [ 'css_var' => 'kb-btn-radius' ], $binding->projections );
	}

	/**
	 * @return void
	 */
	public function testItIgnoresUnrecognisedKeys(): void {
		$binding = Binding::from_array(
			'button-bg',
			[
				'kadence_slot' => 'palette1',
				'bogus'        => 'x',
			] 
		);

		$this->assertSame( [ 'kadence_slot' => 'palette1' ], $binding->projections );
	}

	/**
	 * @return void
	 */
	public function testItAcceptsATokenReferenceWithAnInlineTarget(): void {
		// Both forms compose: a token reference plus a block_attr the token never carries.
		$binding = Binding::from_array(
			'button-bg',
			[
				'token'      => 'semantic.color.button-bg',
				'block_attr' => 'background',
			]
		);

		$this->assertTrue( $binding->is_token_ref() );
		$this->assertSame( 'semantic.color.button-bg', $binding->token );
		$this->assertSame( [ 'block_attr' => 'background' ], $binding->projections );
	}

	/**
	 * @return void
	 */
	public function testItThrowsOnAnEmptyTokenReference(): void {
		$this->expectException( InvalidArgumentException::class );

		Binding::from_array( 'button-bg', [ 'token' => '' ] );
	}

	/**
	 * @return void
	 */
	public function testItThrowsWhenNeitherFormIsPresent(): void {
		$this->expectException( InvalidArgumentException::class );

		Binding::from_array( 'button-bg', [] );
	}

	/**
	 * @return void
	 */
	public function testItThrowsWhenAStringTargetIsNotAString(): void {
		$this->expectException( InvalidArgumentException::class );

		Binding::from_array( 'button-bg', [ 'kadence_slot' => true ] );
	}

	/**
	 * @return void
	 */
	public function testItThrowsWhenCssVarIsNotAString(): void {
		$this->expectException( InvalidArgumentException::class );

		Binding::from_array( 'button-radius', [ 'css_var' => false ] );
	}

	/**
	 * A binding parses control_attr into its own field, exposed via control_attr(), separate from the
	 * projection targets.
	 *
	 * @return void
	 */
	public function testItParsesTheControlAttrField(): void {
		$binding = Binding::from_array(
			'button-bg',
			[
				'kadence_slot' => 'palette-btn-bg',
				'control_attr' => 'background',
			]
		);

		$this->assertSame( 'background', $binding->control_attr() );
		// control_attr is editor-only metadata and must not leak into the projection targets.
		$this->assertArrayNotHasKey( 'control_attr', $binding->projections );
	}

	/**
	 * A binding parses responsive_attrs into a breakpoint => attribute map. The block names its per-device
	 * attributes by a prefix convention ("tabletBorderRadius"), which is not safely derivable, so it is
	 * declared rather than string-built.
	 *
	 * @return void
	 */
	public function testItParsesTheResponsiveAttrsField(): void {
		$binding = Binding::from_array(
			'button-radius',
			[
				'css_var'          => 'kb-btn-radius',
				'control_attr'     => 'borderRadius',
				'responsive_attrs' => [
					'tablet' => 'tabletBorderRadius',
					'mobile' => 'mobileBorderRadius',
				],
			]
		);

		$this->assertSame(
			[
				'tablet' => 'tabletBorderRadius',
				'mobile' => 'mobileBorderRadius',
			],
			$binding->responsive_attrs()
		);
		// Editor-only metadata, like control_attr: it must not leak into the projection targets.
		$this->assertArrayNotHasKey( 'responsive_attrs', $binding->projections );
	}

	/**
	 * A binding with no responsive_attrs declaration exposes an empty map, so a caller can iterate it
	 * unconditionally.
	 *
	 * @return void
	 */
	public function testABindingWithoutResponsiveAttrsExposesAnEmptyMap(): void {
		$binding = Binding::from_array( 'button-bg', [ 'kadence_slot' => 'palette-btn-bg' ] );

		$this->assertSame( [], $binding->responsive_attrs() );
	}

	/**
	 * An unknown breakpoint key in responsive_attrs is refused at registration, so a typo fails loudly
	 * rather than silently never capturing that device.
	 *
	 * @return void
	 */
	public function testAnUnknownResponsiveBreakpointIsRefused(): void {
		$this->expectException( InvalidArgumentException::class );

		Binding::from_array(
			'button-radius',
			[
				'css_var'          => 'kb-btn-radius',
				'responsive_attrs' => [ 'watch' => 'watchBorderRadius' ],
			]
		);
	}

	/**
	 * A binding with no control_attr declaration exposes null.
	 *
	 * @return void
	 */
	public function testControlAttrIsNullWhenAbsent(): void {
		$binding = Binding::from_array( 'button-bg', [ 'kadence_slot' => 'palette-btn-bg' ] );

		$this->assertNull( $binding->control_attr() );
	}

	/**
	 * An empty-string control_attr is rejected, matching the inline-target validation.
	 *
	 * @return void
	 */
	public function testItRejectsAnEmptyControlAttr(): void {
		$this->expectException( InvalidArgumentException::class );

		Binding::from_array(
			'button-bg',
			[
				'kadence_slot' => 'palette-btn-bg',
				'control_attr' => '',
			]
		);
	}

	/**
	 * A binding parses the composite-control axis into its own field, exposed via axis(), separate from
	 * the projection targets.
	 *
	 * @return void
	 */
	public function testItParsesTheAxisField(): void {
		$binding = Binding::from_array(
			'button-border-width',
			[
				'token'        => 'semantic.border-width.default',
				'control_attr' => 'borderStyle',
				'axis'         => 'border-width',
			]
		);

		$this->assertSame( 'border-width', $binding->axis() );
		// Editor-only metadata, like control_attr: it must not leak into the projection targets.
		$this->assertArrayNotHasKey( 'axis', $binding->projections );
	}

	/**
	 * A binding with no axis declaration exposes null — the ordinary case, where the control attribute
	 * holds the property's own value rather than one slot of a composite.
	 *
	 * @return void
	 */
	public function testAxisIsNullWhenAbsent(): void {
		$binding = Binding::from_array( 'button-bg', [ 'kadence_slot' => 'palette-btn-bg' ] );

		$this->assertNull( $binding->axis() );
	}

	/**
	 * An empty-string axis is rejected, matching the control_attr validation.
	 *
	 * @return void
	 */
	public function testItRejectsAnEmptyAxis(): void {
		$this->expectException( InvalidArgumentException::class );

		Binding::from_array(
			'button-border-width',
			[
				'token' => 'semantic.border-width.default',
				'axis'  => '',
			]
		);
	}
}
