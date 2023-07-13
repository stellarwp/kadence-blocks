import classNames from "classnames";

/**
 * Render the Photo component.
 *
 * @param {Object} props The component props.
 * @return {JSX.Element} The Photo component.
 */
export default function Result(props) {
	const { result } = props;

	const {
		url,
		alt,
		avg_color,
		photographer,
		sizes,
		photographer_url,
	} = result;

    if ( result && sizes ) {
        return (
            <div className="result-details-container">
                <img src={sizes[0].src} alt={alt} className={"img"} width="150px" height="150px"/>
                <hr />
                <div className="result-details">
                    <div class="result-detail" data-setting="photographer">
                        <label class="result-detail-label" for="result-detail-photographer" >Photographer:</label>
                        <div class="result-detail-value" id="result-detail-photographer"><a href={photographer_url} target="_blank">{photographer}</a></div>
                    </div>
                    <div class="result-detail" data-setting="alt">
                        <label class="result-detail-label" for="result-detail-alt" >Alt:</label>
                        <textarea class="result-detail-value" id="result-detail-alt" value={alt} rows="4" />
                    </div>
                    <div class="result-detail" data-setting="url">
                        <label class="result-detail-label" for="result-detail-url" >Url:</label>
                        <div class="result-detail-value" id="result-detail-url"><a href={url}>{url}</a></div>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className="result-details-container"></div>
        );
    }
}
