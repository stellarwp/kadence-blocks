import { fieldBlocks } from '../../constants';

function getFormFields(blocks) {
	if (Array.isArray(blocks) && blocks.length) {
		var fields = [];
		blocks.forEach((block) => {
			var innerFields = [];
			if (fieldBlocks.includes(block.name)) {
				fields.push({
					uniqueID: block?.attributes?.uniqueID || '',
					name: block?.attributes?.inputName || '',
					label: block?.attributes?.label || block?.name.replace('kadence/advanced-form-', ''),
					type: block?.name.replace('kadence/advanced-form-', '') || '',
				});
			}

			if (
				'undefined' != typeof block.innerBlocks &&
				Array.isArray(block.innerBlocks) &&
				block.innerBlocks.length
			) {
				innerFields = getFormFields(block.innerBlocks);
			}

			fields = [...fields, ...innerFields];
		});

		return fields;
	}
}

export default getFormFields;
