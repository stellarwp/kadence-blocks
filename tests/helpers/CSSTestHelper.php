<?php
namespace Tests\helpers;

use Sabberworm\CSS\Parser;
use Sabberworm\CSS\CSSList\AtRuleBlockList;
use Sabberworm\CSS\Rule\Rule;
use Sabberworm\CSS\RuleSet\DeclarationBlock;

class CSSTestHelper {
	private $css_parser;
	private $parsed_css;


	public function __construct($css_string) {
		$this->css_parser = new Parser($css_string);
		$this->parsed_css = $this->css_parser->parse();
		$this->kadence_css = new \Kadence_Blocks_CSS();
	}

	public function assertMediaQueryProperties($media_query, $selector, array $properties) {
		$media_query_string = $this->kadence_css->get_media_queries( $media_query );
		foreach ($this->parsed_css->getContents() as $content) {
			if ($content instanceof AtRuleBlockList && $content->atRuleName() === 'media') {
				$query_args = $content->atRuleArgs();
				if (strpos($query_args, $media_query_string) !== false) {
					foreach ($content->getContents() as $rule_set) {
						if ($rule_set instanceof DeclarationBlock) {
							$selector_list = $rule_set->getSelectors();
							$selector_string = implode(', ', array_map(function($sel) {
								return $sel->__toString();
							}, $selector_list));

							if ($selector_string === $selector) {
								$found_properties = [];
								foreach ($rule_set->getRules() as $rule) {
									$found_properties[$rule->getRule()] = $this->normalizeValue($rule->getValue());
								}

								foreach ($properties as $property => $expected_value) {
									$expected_value = $this->normalizeValue($expected_value);
									if (!isset($found_properties[$property]) || $found_properties[$property] !== $expected_value) {
										throw new \PHPUnit\Framework\ExpectationFailedException(
											sprintf(
												"Media query property '%s' mismatch.\nExpected: %s\nActual: %s\nFound properties: %s",
												$property,
												$expected_value,
												$found_properties[$property] ?? 'not found',
												print_r($found_properties, true)
											)
										);
									}
								}
								return true;
							}
						}
					}
				}
			}
		}

		throw new \PHPUnit\Framework\ExpectationFailedException(
			sprintf(
				"Media query '%s' with selector '%s' not found in CSS:\n%s",
				$media_query,
				$selector,
				$this->parsed_css->render()
			)
		);
	}

	/**
	 * Assert multiple CSS properties for a selector
	 */
	public function assertCSSPropertiesEqual($selector, array $properties) {
		$rules = $this->getRulesForSelector($selector);
		$found_properties = [];

		foreach ($rules as $rule) {
			$found_properties[$rule->getRule()] = $this->normalizeValue($rule->getValue());
		}

		foreach ($properties as $property => $expected_value) {
			$expected_value = $this->normalizeValue($expected_value);
			if (!isset($found_properties[$property]) || $found_properties[$property] !== $expected_value) {
				throw new \PHPUnit\Framework\ExpectationFailedException(
					sprintf(
						"Property '%s' mismatch.\nExpected: %s\nActual: %s\nFound properties: %s",
						$property,
						$expected_value,
						$found_properties[$property] ?? 'not found',
						print_r($found_properties, true)
					)
				);
			}
		}
		return true;
	}

	/**
	 * Get rules for a selector, excluding media queries
	 */
	private function getRulesForSelector($selector) {
		$rules = [];
		foreach ($this->parsed_css->getContents() as $content) {
			// Skip media queries
			if ($content instanceof AtRuleBlockList) {
				continue;
			}

			if ($content instanceof DeclarationBlock) {
				$selector_list = $content->getSelectors();
				$selector_string = implode(', ', array_map(function($sel) {
					return $sel->__toString();
				}, $selector_list));

				if ($selector_string === $selector) {
					$rules = array_merge($rules, $content->getRules());
				}
			}
		}
		return $rules;
	}

	private function normalizeValue($value): string {
		$value = is_object($value) && method_exists($value, '__toString')
			? $value->__toString()
			: (string) $value;

		// Remove all whitespace around operators and parentheses
		$value = preg_replace('/\s*([\(\),])\s*/', '$1', $value);

		// Normalize multiple spaces to single space
		$value = preg_replace('/\s+/', ' ', $value);

		// Trim any remaining whitespace
		return trim($value);
	}
}
