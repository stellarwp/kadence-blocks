/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { BaseControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { Chip } from '../chip';
import './chips-input.scss';

export function ChipsInput(props) {
	const{
		id,
		tags,
		maxTags,
		selectedTags,
		children,
		placeholder,
		...baseProps
	} = props;

	const internalId = id ? `inspector-chips-input-control-${ id }` : '';
	const [ inputValue, setInputValue ] = useState('');

	function handleTagDelete(tag) {
    const newSelectedTags = [...tags];
    newSelectedTags.splice(newSelectedTags.indexOf(tag), 1);
    selectedTags(newSelectedTags);
	}

	function maybeUpdateTags() {
    const trimmedInput = inputValue.replace(',','').trim();
    const newSelectedItems = [...tags];
    const duplicatedValues = newSelectedItems.indexOf(trimmedInput);

    if (trimmedInput.length === 0) {
    	return;
    }

    if (duplicatedValues !== -1) {
      setInputValue('');
      return;
    }

    newSelectedItems.push(trimmedInput);
    selectedTags(newSelectedItems);
    setInputValue('');
	}
 
  function handleKeyDown(evt) {
    const isEnter = evt.key === 'Enter';
    const isComma = evt.key === ',';

    if (isEnter || isComma) {
      evt.preventDefault();
      maybeUpdateTags();
    }
  };

  function handleOnBlur(evt) {
    evt.preventDefault();
		maybeUpdateTags();
  }

  function handleInputChange(value) {
  	if (value !== ' ' && value !== ',') {
			setInputValue(value);
  	}
  }

	return (
		<BaseControl
			className={ 'stellarwp chips-input' }
			id={ internalId }
			{ ...baseProps }
		>
			<div className="components-chips-input-control">
				{ Array.isArray(tags) && tags.map( (tag, index) => (
					<Chip
						key={ index }
						text={ tag }
						onDelete={ () => handleTagDelete(tag) }
					/>
				)) }
				{ (Array.isArray(tags) && tags.length < maxTags) && (
					<input
						id={ internalId }
						className="components-chips-input-control__input"
						type="text"
						value={ inputValue }
						onKeyUp={ handleKeyDown }
						onBlur={ handleOnBlur }
						onChange={ (e) => handleInputChange(e.target.value) }
						placeholder={ (placeholder && tags.length < maxTags) ? placeholder : '' }
					/>
				) }
			</div>
		</BaseControl>
	)
}
