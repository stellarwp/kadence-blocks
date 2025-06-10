import { __ } from '@wordpress/i18n';
const { Fragment } = wp.element;
const { toggleFormat, registerFormatType } = wp.richText;
const { RichTextToolbarButton, RichTextShortcut } = wp.blockEditor;
import { useSelect } from '@wordpress/data';

const icon = (
	<svg
		viewBox="0 0 20 20"
		xmlns="http://www.w3.org/2000/svg"
		fillRule="evenodd"
		clipRule="evenodd"
		strokeLinejoin="round"
		strokeMiterlimit="1.414"
	>
		<path d="M10 2c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm-1-4h2v2h-2v-2zm0-6h2v4h-2V6z" />
	</svg>
);

const name = 'kadence/screen-reader-text';
const allowedBlocks = ['kadence/advancedheading'];

const kadenceScreenReaderText = {
	title: __('Screen Reader Text', 'kadence-blocks'),
	tagName: 'span',
	className: 'kb-screen-reader-text',
	edit({ isActive, value, onChange }) {
		const selectedBlock = useSelect((select) => {
			return select('core/block-editor').getSelectedBlock();
		}, []);
		if (undefined === selectedBlock?.name) {
			return null;
		}
		if (selectedBlock && !allowedBlocks.includes(selectedBlock.name)) {
			return null;
		}
		const onToggle = () => onChange(toggleFormat(value, { type: name }));

		return (
			<Fragment>
				<RichTextShortcut type="primary" character="r" onUse={onToggle} />
				<RichTextToolbarButton
					icon={icon}
					title={__('Screen Reader Text', 'kadence-blocks')}
					onClick={onToggle}
					isActive={isActive}
					shortcutType="access"
					shortcutCharacter="r"
					className={`toolbar-button-with-text toolbar-button__${name}`}
				/>
			</Fragment>
		);
	},
};

registerFormatType(name, kadenceScreenReaderText);
