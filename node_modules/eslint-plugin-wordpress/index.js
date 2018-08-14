/**
 * @fileoverview A collection of custom ESLint rules that help enforce JavaScript coding standard in the WordPress project.
 * @author Stephen Edgar
 * @copyright 2016 Stephen Edgar. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

var requireIndex = require('requireindex');

// -----------------------------------------------------------------------------
// Plugin Definition
// -----------------------------------------------------------------------------

// import all rules in /rules
module.exports.rules = requireIndex('./rules');
