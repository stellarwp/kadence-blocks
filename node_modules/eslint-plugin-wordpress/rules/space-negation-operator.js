/**
 * @fileoverview This rule shoud require or disallow spaces before or after unary operations.
 * @author Marcin Kumorek
 * @copyright 2014 Marcin Kumorek. All rights reserved.
 */
'use strict';

// -----------------------------------------------------------------------------
// Rule Definition
// -----------------------------------------------------------------------------

module.exports = function (context) {
	// -------------------------------------------------------------------------
	// Helpers
	// -------------------------------------------------------------------------

	/**
	* Check if the parent unary operator is '!' in order to know if it's '!!' convert to Boolean or just '!' negation
	* @param {ASTnode} node AST node
	* @returns {boolean} Whether or not the parent is unary '!' operator
	*/
	function isParentUnaryBangExpression(node) {
		return node && node.parent && node.parent.type === 'UnaryExpression' && node.parent.operator === '!';
	}

	/**
	* Checks UnaryExpression, UpdateExpression and NewExpression for spaces before and after the operator
	* @param {ASTnode} node AST node
	* @returns {void}
	*/
	function checkForSpaces(node) {
		var tokens = context.getFirstTokens(node, 2);
		var firstToken = tokens[0];
		var secondToken = tokens[1];

		if (node.prefix) {
			if (isParentUnaryBangExpression(node)) {
				return void 0;
			}
			if (firstToken.range[1] === secondToken.range[0]) {
				context.report(node, 'Negation operator "' + firstToken.value + '" must be followed by whitespace.');
			}
		} else {
			if (firstToken.range[1] === secondToken.range[0]) {
				context.report(node, 'Whitespace is required before "' + secondToken.value + '" negation operator.');
			}
		}
	}

	// -------------------------------------------------------------------------
	// Public
	// -------------------------------------------------------------------------

	return {
		UnaryExpression: checkForSpaces,
		UpdateExpression: checkForSpaces,
		NewExpression: checkForSpaces
	};
};
