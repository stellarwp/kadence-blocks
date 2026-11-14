<?php
/**
 * Builds the CSS for the navigation block.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Builds the CSS for the navigation block by running one section after another.
 *
 * @since TBD
 */
final class Kadence_Blocks_Navigation_Css extends Kadence_Blocks_Css_Block_Builder {

	/**
	 * Whether the block has CSS to build.
	 *
	 * @since TBD
	 *
	 * @param array $attributes The block attributes.
	 *
	 * @return bool
	 */
	protected function applies( $attributes ): bool {
		return isset( $attributes['id'] );
	}

	/**
	 * Values worked out once from the attributes, for the sections to read.
	 *
	 * @since TBD
	 *
	 * @param array  $attributes The block attributes.
	 * @param string $unique_id The block unique id.
	 *
	 * @return array
	 */
	protected function derived( $attributes, $unique_id ): array {
		return [
			'post' => ( new Kadence_Blocks_Navigation_Plain_Attributes( new Kadence_Blocks_Css_Context_Post_Attributes( $this->context, 'kadence_navigation', '_kad_navigation_' ) ) )->for_post( $attributes['id'] ),
		];
	}

	/**
	 * The sections of the block CSS, in the order they are written.
	 *
	 * The sections share one CSS builder, its current selector and its media state, so their order matters.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	protected function sections(): array {
		return [
			new Kadence_Blocks_Css_Derived_Scope_Section(
				'post',
				array_merge(
					[ new Kadence_Blocks_Css_Sized_Dynamic_Section() ],
					$this->link_sections(),
					$this->container_sections(),
					$this->typography_sections()
				)
			),
		];
	}

	/**
	 * The sections of the spacing, the dropdown shadow and the states of the links, written as variables.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function link_sections(): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( '.wp-block-kadence-navigation{id}' ),
			$this->variable( 'marginLink', '--kb-nav-top-link-margin' ),
			$this->variable( 'paddingLink', '--kb-nav-top-link-padding' ),
			$this->variable( 'marginDropdown', '--kb-nav-dropdown-margin' ),
			$this->variable( 'paddingDropdown', '--kb-nav-dropdown-padding' ),
			$this->variable( 'marginDropdownLink', '--kb-nav-dropdown-link-margin' ),
			$this->variable( 'paddingDropdownLink', '--kb-nav-dropdown-link-padding' ),
			new Kadence_Blocks_Navigation_Dropdown_Shadow_Css(),
			new Kadence_Blocks_Css_Button_States_Section(
				[
					'colorBase'              => 'linkColor',
					'backgroundBase'         => 'background',
					'backgroundTypeBase'     => 'backgroundType',
					'backgroundGradientBase' => 'backgroundGradient',
					'borderBase'             => 'border',
					'borderRadiusBase'       => 'borderRadius',
					'borderRadiusUnitBase'   => 'borderRadiusUnit',
					'shadowBase'             => 'shadow',
					'renderAsVars'           => true,
					'varBase'                => '--kb-nav-top-link-',
				]
			),
		];
	}

	/**
	 * The sections of the spacing of the main container, which does not apply to the children.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function container_sections(): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( '.wp-block-kadence-navigation{id} > .navigation > .menu-container > .menu' ),
			$this->variable( 'margin', '--kb-nav-margin' ),
			$this->variable( 'padding', '--kb-nav-padding' ),
		];
	}

	/**
	 * The sections of the typography of the top level items, the dropdown links and their descriptions.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function typography_sections(): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( '.wp-block-kadence-navigation{id} > .navigation > .menu-container > .menu > .wp-block-kadence-navigation-link > .kb-link-wrap' ),
			new Kadence_Blocks_Css_Typography_Section( 'typography' ),
			new Kadence_Blocks_Css_Selector_Section( '.wp-block-kadence-navigation{id} .sub-menu > .wp-block-kadence-navigation-link > .kb-link-wrap > .kb-nav-link-content' ),
			new Kadence_Blocks_Css_Typography_Section( 'dropdownTypography' ),
			new Kadence_Blocks_Css_Selector_Section( '.wp-block-kadence-navigation{id} .menu-container > .menu > .wp-block-kadence-navigation-link > .kb-link-wrap .kb-nav-label-description' ),
			new Kadence_Blocks_Css_Typography_Section( 'descriptionTypography' ),
			new Kadence_Blocks_Css_Selector_Section( '.wp-block-kadence-navigation{id} .sub-menu > .menu-item > .kb-link-wrap .kb-nav-label-description' ),
			new Kadence_Blocks_Css_Typography_Section( 'dropdownDescriptionTypography' ),
		];
	}

	/**
	 * A measure written as a CSS variable, with its unit saved next to it.
	 *
	 * @since TBD
	 *
	 * @param string $attribute The attribute that stores the measure.
	 * @param string $variable  The CSS variable to write.
	 *
	 * @return Kadence_Blocks_Css_Section
	 */
	private function variable( string $attribute, string $variable ): Kadence_Blocks_Css_Section {
		return new Kadence_Blocks_Css_Measure_Section( $variable, $attribute, [ 'unit_key' => $attribute . 'Unit' ] );
	}
}
