/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { TextareaControl } from '../textarea-control';
import { ProgressBar } from  '../progress-bar';
import './textarea-progress.scss';

export function TextareaProgress( props ) {
	const {
	  showProgressBar = true,
	  progressBarProps,
	  value,
	  initialHeight = 100,
	  ...rest
	} = props;
  const [ inputRef, setInputRef ] = useState( null );

	useEffect(() => {
	  if (inputRef) {
		  resizeTextarea(inputRef);
	  }
	}, [ inputRef, value ])

  function resizeTextarea(inputRef) {
	  if (inputRef) {
		  const textArea = inputRef.querySelector('textarea');
		  // We need to reset the height momentarily to get the correct scrollHeight for the textarea
      textArea.style.height = '0px';
      const newHeight = textArea.scrollHeight > initialHeight ? textArea.scrollHeight : initialHeight;

      // We then set the height directly, outside of the render loop
      // Trying to set this with state or a ref will product an incorrect value.
      textArea.style.height = newHeight + 'px';
	  }
  }

	return (
		<div className="stellarwp-textarea-progress">
			<TextareaControl ref={ setInputRef } { ...rest } value={ value } />
  		<ProgressBar styles={ ! showProgressBar ? { visibility: 'hidden' } : null } { ...progressBarProps } />
		</div>
	)
}

