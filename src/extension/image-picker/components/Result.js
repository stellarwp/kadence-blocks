import classNames from "classnames";

/**
 * Render the Photo component.
 *
 * @param {Object} props The component props.
 * @return {JSX.Element} The Photo component.
 */
export default function Result(props) {
	const { 
		result,
		setInactive,
		index,
		currentUserSelectionIndex,
		setCurrentUserSelectionIndex
	} = props;

	const {
		url,
		alt,
		avg_color,
		photographer,
		sizes,
		photographer_url,
	} = result;

	const handleOnFocus = () => {
		setCurrentUserSelectionIndex( index );
	}
	const handleOnBlur = () => {
	}
	const resultButton = React.useRef(null)

	//console.log(1, resultButton, document.activeElement)

	const isCurrent = index == currentUserSelectionIndex;

	const activeClass = isCurrent ? 'active' : '';

	return (
		<article className={classNames("result", activeClass)}>
			<div className="img-wrap">
				<button
					ref={resultButton}
					className="photo-upload"
					data-alt={alt}
					title={'clicker'}
					onFocus={handleOnFocus}
					onBlur={handleOnBlur}
				>
					<img src={sizes[0].src} alt={alt} className={"img"} width="150px" height="150px"/>
				</button>
			</div>
		</article>
	);
}
