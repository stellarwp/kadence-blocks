/**
 * @fileoverview Require space after negation operators
 * @author Stephen Edgar
 * @copyright 2016 Stephen Edgar. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

var rule = require('../../rules/space-negation-operator');
var RuleTester = require('eslint').RuleTester;

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('space-negation-operator', rule, {

	valid: [
		{
			code: '! foo'
		}
	],

	invalid: [
		{
			code: '!foo',
			output: '!foo',
			errors: [{
				message: 'Negation operator "!" must be followed by whitespace.',
				type: 'UnaryExpression',
				line: 1,
				column: 1
			}]
		}
	]
});
