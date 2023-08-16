/**
 *
 * MF Conditional Fields
 * A JavaScript library that show/hide form fields based on the values of other fields.
 *
 * Author: Ali Khallad
 * Author link: http://alikhallad.com
 * Source : https://github.com/bomsn/mf-conditional-fields
 * Version 1.0.4
 *
 */
"use strict";
const mfConditionalFields = (forms, options = {}) => {

	// Ensure the passed form(s) is in the correct format (array of elements)
	switch (typeof forms) {
		case 'string':
			forms = document.querySelectorAll(forms);
			break;
		case 'object':
			// Check if this is an object of objects 
			// ( special logic to handle the form elements provided by jQuery )

			if (Array.isArray(forms) === false && Object.prototype.hasOwnProperty.call(forms, "0")) {
				// Clean the object, make sure it only hold HTML FORM elements
				forms = Object.fromEntries(Object.entries(forms).filter(([key, val]) => {
					return !isNaN(key) && typeof val.elements !== "undefined";
				}))
				// Keep object values only ( this will convert our object to array )
				forms = Object.values(forms);
			} else {
				forms = Array.isArray(forms) ? forms : [forms];
			}
			break;
	}

	let theRules = options.rules || 'inline',
		isDynamic = options.dynamic || false,
		unsetHidden = options.unsetHidden || false,
		disableHidden = options.disableHidden || false,
		debug = options.debug || false,
		depth = options.depth || 3,
		fields = [], // To hold all available conditional fields
		triggers = [], // To hold every trigger field
		triggersListening = []; // To hold every trigger that has an eventlistener attached to it;

	console.log(2, forms, theRules, debug);

	let self = {
		/**
		 * Initialize a field by extracting the conditional rules and adding
		 * any associated trigger fields to the triggers array to be attached to
		 * an on "change" eventListener later
		 *
		 * @param field The field object
		 * @param formIndex Form index of the
		 */
		initField: (field, formIndex) => {
			console.log(3)

			let condition = field.getAttribute('data-conditional-rules');

			if (condition.length > 0) {
				condition = JSON.parse(condition);
				let container = 'container' in condition ? condition['container'] : '',
					action = 'action' in condition ? condition['action'] : 'show',
					logic = 'logic' in condition ? condition['logic'] : 'or',
					rules = 'rules' in condition ? condition['rules'] : [];

				// if a single rule is provided, insert it into an array
				if (typeof rules == "object" && typeof rules.length == "undefined") {
					rules = [rules];
				}

				// If rules are available, start a loop to implement each rule
				if (rules.length > 0) {
					for (let i = 0; rules.length > i; i++) {
						if ("group" in rules[i]) {
							// Store grouped rules triggers
							for (let r = 0; rules[i].group.length > r; r++) {
								if ("name" in rules[i].group[r] && !triggers[formIndex].includes(rules[i].group[r].name)) {
									triggers[formIndex].push(rules[i].group[r].name);
								}
							}
						} else {
							// Store normal rules triggers
							if ("name" in rules[i] && !triggers[formIndex].includes(rules[i].name)) {
								triggers[formIndex].push(rules[i].name);
							}
						}
					}

					field.removeAttribute('data-conditional-rules');

					field.mfConditionalContainerSelector = container;
					field.mfConditionalAction = action;
					field.mfConditionalLogic = logic;
					field.mfConditionalRules = rules;
					field.mfConditionalFormIndex = formIndex;

					self.updateField(field);
				}
			}

		},
		/**
		 * Update a field by checking the form for any triggers associated
		 * with it, then use the field conditional rules to compare the trigger value
		 * with the targeted values, and display or hide the field if there is a match
		 *
		 * @param field The field object
		 */
		updateField: (field, depthLevel = 1) => {
			console.log(4)

			let formIndex = field.mfConditionalFormIndex,
				action = field.mfConditionalAction,
				logic = field.mfConditionalLogic,
				rules = field.mfConditionalRules,
				isConditionMet = false;

			if (rules.length > 0) {

				for (let i = 0; rules.length > i; i++) {
					let isRuleMet = false;
					if ("group" in rules[i]) {
						// Evaluate grouped rules
						let relation = rules[i].relation || 'and',
							isGroupRulesMet = false;
						for (let r = 0; rules[i].group.length > r; r++) {
							isGroupRulesMet = self.evaluateRule(rules[i].group[r], formIndex);
							// Break out of this for loop if we have a final decision about this rule ( met or not )
							if (isGroupRulesMet == false && 'and' == relation) {
								isRuleMet = false;
								break;
							} else if (isGroupRulesMet && 'or' == relation) {
								isRuleMet = true;
								break;
							}

							isRuleMet = isGroupRulesMet;
						}

					} else {
						// Evaluate normal rules
						isRuleMet = self.evaluateRule(rules[i], formIndex);
					}

					// Break out of this for loop if we have a final decision about this rule, or rules group ( met or not )
					if (isRuleMet === false && 'and' == logic) {
						isConditionMet = false
						break;
					} else if (isRuleMet && 'or' == logic) {
						isConditionMet = true;
						break;
					}

					isConditionMet = isRuleMet;
				}

			}
			// Toggle the fields based on the value of `isConditionMet`
			if (isConditionMet) {
				console.log(5)
				self.toggleField(field, action, depthLevel);
			} else {
				console.log(6)
				if ('hide' == action) {
					action = 'show';
				} else if ('show' == action) {
					action = 'hide';
				} else if ('disable' == action) {
					action = 'enable';
				} else if ('enable' == action) {
					action = 'disable';
				} else {
					action = 'none';
				}
				self.toggleField(field, action, depthLevel);
			}
		},
		/**
		 * Show or hide the provided field based on the `action` provided
		 * then search for any dependant fields ( if the provided field is
		 * a trigger for another conditional field ) and show/hide accordingly
		 *
		 * @param field The field object
		 * @param action The action to perform ( show/hide )
		 */
		toggleField: (field, action, depthLevel) => {
			console.log(7)

			let formIndex = field.mfConditionalFormIndex,
				name = field.name,
				containerSelector = field.mfConditionalContainerSelector,
				container = null;

			// Check if this field is a trigger and re-evaluate dependant fields recursively
			// Ensure we don't go too deep to avoid memory leak
			if (depthLevel < depth) {
				if (triggers[formIndex].includes(name)) {
					let dependantFields = self.getDependantField(name, formIndex);
					if (dependantFields.length > 0) {
						for (let i = 0; dependantFields.length > i; i++) {
							if (action == 'hide') {
								// If we are hiding this field, make sure any conditional field associated are hidden as well
								self.toggleField(dependantFields[i], 'hide', depthLevel++);
							} else if (action == 'show') {
								/// If we are showing this field, make sure any conditional field associated are re-evaluated
								self.updateField(dependantFields[i], 'show', depthLevel++);
							}
						}
					}
				}
			}

			if (action == 'hide') {
				console.log(8, containerSelector, field)
				// Hide the field
				if (containerSelector == '') {
					field.setAttribute("hidden", true);
				} else {
					container = field.closest("" + containerSelector + "");
					console.log(8.1, container)
					if (container) {
						container.setAttribute("hidden", true);
					}
				}

				if (disableHidden) {
					field.setAttribute("disabled", "disabled");
				}
				if (unsetHidden) {
					if ('checkbox' == field.type || 'radio' == field.type) {
						field.checked = false;
					} else {
						field.value = '';
					}
				}

			} else if (action == 'disable') {

				field.setAttribute("disabled", "disabled");

			} else if (action == 'enable') {

				if (field.hasAttribute("disabled")) {
					field.removeAttribute("disabled");
				}

			} else if (action == 'show') {
				console.log(9)
				// Show the field
				if (containerSelector == '') {
					field.removeAttribute("hidden");
				} else {
					container = field.closest("" + containerSelector + "");
					if (container) {
						container.removeAttribute("hidden");
					}
				}

				if (disableHidden) {
					field.removeAttribute("disabled");
				}
			}

		},
		/**
		 * Find and return any conditional fields based on their trigger name attribute,
		 *
		 * @param name The name attribute of the trigger field
		 * @param formIndex The index of the form which holds this trigger
		 */
		getDependantField: (name, formIndex) => {
			let dependantFields = [];
			// Loop through available conditional fields and find any that are using a dependant on another field based on name attribute of the latter
			if (typeof fields[formIndex] !== "undefined") {
				for (let i = 0; fields[formIndex].length > i; i++) {
					// Only update the conditional fields associated with this trigger field
					if ("mfConditionalRules" in fields[formIndex][i]) {
						// Run a test to see if this field is dependant on the field with the supplied `name` attribute
						let isDependant = fields[formIndex][i]["mfConditionalRules"].some((rule) => {
							if ("group" in rule) {
								// Handle grouped rules
								for (let r = 0; rule.group.length > r; r++) {
									if (rule.group[r].name === name) {
										return true;
									}
								}
								return false;
							} else {
								// Handle normal rules
								return rule.name === name
							}
						});

						if (typeof (isDependant) !== "undefined" && isDependant !== false) {
							dependantFields.push(fields[formIndex][i]);
						}
					}
				}
			}
			return dependantFields;
		},
		/**
		 * Evaluate the provided rule to check if it's true or false
		 *
		 * @param rule the rule to evaluate
		 * @param formIndex index of the form where the evaluation should occur
		 */
		evaluateRule: (rule, formIndex) => {
			console.log(10)

			let name = rule.name,
				operator = rule.operator,
				value = rule.value;

			if (triggers[formIndex].includes(name)) {

				let trigger = forms[formIndex].querySelectorAll('[name="' + name + '"]'),
					triggerType, triggerValue, isRuleMet;

				if (trigger.length > 0) {
					triggerType = trigger[0].type;
					// Get the first element and assign it a trigger if it's not a radio or checkbox ( there is a possibility to have same name attribute on these )
					if (triggerType !== 'radio' && triggerType !== 'checkbox') {
						trigger = trigger[0];
					}
					// Get the trigger value(s)
					if (triggerType == 'radio' || triggerType == 'checkbox') {
						// Special logic for handling radios and checkboxs since they can have the same name attribute.
						triggerValue = [];
						for (let i = 0; i < trigger.length; i++) {
							if (trigger[i].checked) {
								triggerValue.push(trigger[i].value);
							}

							// Convert array to a string in the last loop iteration
							if (i === trigger.length - 1) {
								triggerValue = triggerValue.join('|');
							}
						}
					} else {
						triggerValue = trigger.value;
					}

					isRuleMet = self.compareValues(operator, triggerValue, value);
				}
				return isRuleMet;
			}

			return false;
		},
		/**
		 * Compare provided strings and return true if there is a match, return false otherwise.
		 *
		 * @param operator The opetrator to use for comparision
		 * @param searchVal the string to compare
		 * @param targetVal the string to compare against
		 */
		compareValues: (operator, searchVal, targetVal) => {

			searchVal = searchVal ? searchVal.toString().toLowerCase() : "",
				targetVal = targetVal ? targetVal.toString().toLowerCase() : "";

			switch (operator) {
				case "is":
					return targetVal === searchVal;
				case "isnot":
					return targetVal !== searchVal;
				case "greaterthan":
					return isNaN(searchVal) || isNaN(targetVal) ? false : Number(searchVal) > Number(targetVal);
				case "lessthan":
					return isNaN(searchVal) || isNaN(targetVal) ? false : Number(searchVal) < Number(targetVal);
				case "contains":
					return searchVal.includes(targetVal);
				case "doesnotcontain":
					return !searchVal.includes(targetVal);
				case "beginswith":
					return searchVal.startsWith(targetVal);
				case "doesnotbeginwith":
					return !searchVal.startsWith(targetVal);
				case "endswith":
					return searchVal.endsWith(targetVal);
				case "doesnotendwith":
					return !searchVal.endsWith(targetVal);
				case "isempty":
					return searchVal === "";
				case "isnotempty":
					return searchVal !== "";
			}

			return false;
		},
		/**
		 * Depending on the action provided, search the form for new fields,
		 * initialize them and attach relevant event listeners, or,
		 * remove the missing fields from `fields`, `triggers`, `triggersListening` variables
		 *
		 * @param formIndex The index of the form to update
		 */
		updateForm: async (formIndex, action = 'add') => {
			console.log(11)

			if (typeof forms[formIndex] == "undefined") {
				return false;
			}

			if (action == 'add') {
				try {
					let step1, step2;
					// Save any conditional field that are not initiated yet
					step1 = await new Promise((resolve, reject) => {
						let newConditionalFields = [];
						if (theRules == 'inline') {
							newConditionalFields = forms[formIndex].querySelectorAll('[data-conditional-rules]');
						} else {
							for (let r = 0; theRules.length > r; r++) {
								if ("field" in theRules[r]) {
									let theFields = forms[formIndex].elements[theRules[r]['field']];
									theFields = (theFields instanceof RadioNodeList) ? Array.from(theFields) : [theFields];
									for (let f = 0; theFields.length > f; f++) {
										if (typeof theFields[f] !== "undefined") {
											let theField = theFields[f];
											theField.setAttribute("data-conditional-rules", JSON.stringify(theRules[r]));
											newConditionalFields.push(theField);
										}
									}
									delete theRules[r]['field'];
								}
							}
							// clean `theRules` variable since we'll not need it anymore
							theRules = null;
						}
						// Add the available conditional fields to an array
						if (newConditionalFields.length > 0) {
							fields[formIndex] = fields[formIndex].concat(Array.prototype.slice.call(newConditionalFields));
							resolve(newConditionalFields);
						} else {
							reject("No conditional fields found on step 1");
						}
					});
					step2 = await new Promise((resolve, reject) => {
						if (step1.length > 0) {
							// Loop through each form fields
							for (let i = 0; step1.length > i; i++) {

								self.initField(step1[i], formIndex);

								// Resolve on the last field
								if (i === step1.length - 1) {
									resolve();
								}
							}
						} else {
							reject("No conditional fields to initialize on step 2");
						}
					});

					/*
					* After all tasks are finished, add necessary event listeners to the triggers, if available.
					* triggers are added from `self.initField()`
					*/
					if (triggers.length > 0) {
						// Loop through each name attributes in the triggrs array for the current form
						for (let n = 0; triggers[formIndex].length > n; n++) {
							if (!triggersListening[formIndex].includes(triggers[formIndex][n])) {
								let trigger = forms[formIndex].querySelectorAll('[name="' + triggers[formIndex][n] + '"]');

								// Make sure to catch multiple checkboxes (workaround)
								if (trigger.length === 0) {
									trigger = forms[formIndex].querySelectorAll('[type="checkbox"][name="' + triggers[formIndex][n] + '[]"]');
									if (trigger.length > 0) {
										let oldName = triggers[formIndex][n];
										// Replace the old name with the new one for the triggers so that the listener can work
										triggers[formIndex][n] = triggers[formIndex][n] + "[]";
										// Update all dependant field rules to include the `name` attribute appended with []
										let dependantFields = self.getDependantField(oldName, formIndex);
										if (dependantFields.length > 0) {
											for (let i = 0; dependantFields.length > i; i++) {
												if (dependantFields[i].mfConditionalRules.length > 0) {
													let nameUpdated = false;
													for (let r = 0; dependantFields[i].mfConditionalRules.length > r; r++) {
														if ("group" in dependantFields[i].mfConditionalRules[r]) {
															for (let rg = 0; dependantFields[i].mfConditionalRules[r].group.length > rg; rg++) {
																if (dependantFields[i].mfConditionalRules[r].group[rg].name == oldName) {
																	dependantFields[i].mfConditionalRules[r].group[rg].name = oldName + "[]";
																	nameUpdated = true;
																}
															}
														} else {
															if (dependantFields[i].mfConditionalRules[r].name == oldName) {
																dependantFields[i].mfConditionalRules[r].name = oldName + "[]";
																nameUpdated = true;
															}
														}
													}
													// If the field name attribute was changed, Update the field as a final step.
													if (nameUpdated) {
														self.updateField(dependantFields[i]);
													}
												}
											}
										}
									}
								}

								if (trigger.length > 0) {
									// Loop through the triggers found by querySelectorAll in the current form and assign them a Listener
									// usually there is only 1 element per name attribute. However, there might be multiple elements with same name, e.g. radios.
									for (let c = 0; trigger.length > c; c++) {
										// Assign form index to the element to be used later by the listener to retrieve associated fields
										trigger[c].mfConditionalFormIndex = formIndex;
										trigger[c].addEventListener("input", self.fieldListener, false);
									}
									triggersListening[formIndex].push(triggers[formIndex][n]);
								}
								// Remove reference to trigger
								trigger = null;
							}
						}
					}

					return true;

				} catch (err) {
					if (debug) {
						let prefix = 'formIndex: ' + formIndex;
						if (typeof forms[formIndex].getAttribute('id') !== "undefined") {
							prefix = 'formId: ' + forms[formIndex].getAttribute('id');
						}
						console.info(`${prefix} => ${err}`);
					}

					return false;
				}
			} else if (action == 'remove') {

				// Clean Fields
				fields[formIndex] = fields[formIndex].filter(formField => { return typeof (forms[formIndex].elements["" + formField.name + ""]) !== "undefined" });
				// Clean Triggers
				triggers[formIndex] = triggers[formIndex].filter(fieldName => { return typeof (forms[formIndex].elements["" + fieldName + ""]) !== "undefined" });
				// Clean Triggers Listening
				triggersListening[formIndex] = triggersListening[formIndex].filter(fieldName => { return typeof (forms[formIndex].elements["" + fieldName + ""]) !== "undefined" });

				return true;
			}

			return false;

		},
		/**
		 * Update any fields that are using this field as a trigger
		 *
		 * @param e The event object
		 */
		fieldListener: (e) => {
			console.log(12)

			let dependantFields = self.getDependantField(e.target.name, e.target.mfConditionalFormIndex);

			if (dependantFields.length > 0) {
				for (let i = 0; dependantFields.length > i; i++) {
					self.updateField(dependantFields[i]);
				}
			}
		},
		/**
		 * Depending on the event properties, update the a form associated form.
		 *
		 * @param e The event object
		 */
		formListener: (e) => {
			console.log(13)
			let formIndex = e.target.mfConditionalFormIndex,
				action = e.detail.action;

			self.updateForm(formIndex, action);
		}
	};



	/**
	 * Validate the supplied rules or rule type
	 */
	if (theRules == 'block') {
		let blockRules = document.getElementById('rules-mf-conditional-fields');

		if (typeof blockRules !== undefined) {
			theRules = JSON.parse(blockRules.innerHTML);
		} else {
			if (debug) {
				console.warn(`The rules element could not be found.`);
			}
			return false;
		}
	}

	if (theRules !== 'inline' && typeof theRules !== "object") {
		if (debug) {
			console.warn(`The supplied rules or rule type is not valid.`);
		}
		return false;
	}

	/**
	 * Run conditional logic processes if the form(s) is available
	 */
	if (forms.length > 0) {
		// Loop through available forms and initialize conditional logic
		for (let i = 0; forms.length > i; i++) {

			fields.push([]); // Add an empty array to  `field` to represent current form ( New fields can be added later if this is a dynamic form )
			triggers.push([]); // Add an empty array to  `triggers` to represent current form ( triggers to be added at a later stage if conditional fields are available or dynamically added )
			triggersListening.push([]); // Add an empty array to  `triggersListening` to represent current form ( triggerListening to be added at a later stage if conditional fields are available or dynamically added )
			forms[i].mfConditionalFormIndex = i; // assign the conditional form index to the form element ( Used to manage conditional logic for multiple forms   )
			self.updateForm(i);

		}

		/*
		* If the form(s) is dynmaic, add necessary event listeners to the form(s) element(s)
		*/
		if (isDynamic) {
			// Loop through the forms and add event listener ( mfConditionalFormUpdated needs to be created, then dispatched each time the form is updated with new fields )
			for (let e = 0; forms.length > e; e++) {
				forms[e].addEventListener("mfConditionalFormUpdated", self.formListener, false);
			}
		}

	} else {
		if (debug) {
			console.warn(`The supplied conditional form was not found`);
		}
		return false;
	}
}

if (typeof (window) !== 'undefined') {
    console.log(1.1);
	// Set megaForms as a browser global
	window.mfConditionalFields = mfConditionalFields;

}