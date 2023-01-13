/**
 * BLOCK: Kadence Block Template
 */
const { rest_url } = kadence_blocks_params;

/**
 * External dependencies
 */
import classnames from "classnames";
/**
 * Internal block libraries
 */
import { RichText, useBlockProps } from "@wordpress/block-editor";

function Save({ attributes }) {
	const { uniqueID, label, labelPosition, displayLabel } = attributes;
	const classes = classnames({
		"kb-progress-bar-container": true,
		[`kb-progress-bar-container${uniqueID}`]: true,
	});
	const blockProps = useBlockProps.save({
		className: classes,
	});
	return (
		<div {...blockProps}>
			{displayLabel && labelPosition === "above" && (
				<RichText.Content
					className={"kt-blocks-progress-label"}
					tagName={"span"}
					value={label}
				/>
			)}

			<div id={"kb-progress-bar" + uniqueID}></div>

			{displayLabel && labelPosition === "below" && (
				<RichText.Content
					className={"kt-blocks-progress-label"}
					tagName={"span"}
					value={label}
				/>
			)}
		</div>
	);
}
export default Save;
