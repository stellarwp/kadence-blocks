/**
 * Internal dependencies
 */
import FormFieldLabel from '../../label';

/**
 * WordPress dependencies
 */
import { TextControl, TextareaControl, SelectControl, ToggleControl, Button, Dashicon } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps, store as blockEditorStore } from '@wordpress/block-editor';
import { useSelect, useDispatch } from '@wordpress/data';
import {
	KadencePanelBody,
	InspectorControlTabs,
	ResponsiveRangeControls,
	DynamicTextInputControl,
	SelectParentBlock,
} from '@kadence/components';
import { useEffect, useState, useMemo } from '@wordpress/element';
import { getUniqueId, getPreviewSize } from '@kadence/helpers';
import classNames from 'classnames';
import { DuplicateField, FieldBlockAppender, FieldName, getUniqueFieldId } from '../../components';
import { times, get, filter } from 'lodash';
import { plus } from '@wordpress/icons';

function FieldSelect(props) {
	const { attributes, setAttributes, isSelected, clientId, context, name } = props;
	const {
		uniqueID,
		required,
		label,
		showLabel,
		placeholder,
		options,
		multiSelect,
		defaultValue,
		helpText,
		ariaDescription,
		maxWidth,
		maxWidthUnit,
		minWidth,
		minWidthUnit,
		defaultParameter,
		inputName,
		requiredMessage,
		kadenceDynamic,
	} = attributes;

	const [rerender, setRerender] = useState(0);

	function onOptionMoveUp(oldIndex) {
		return () => {
			if (oldIndex === 0) {
				return;
			}
			onOptionMove(oldIndex, oldIndex - 1);
		};
	}

	function onOptionMoveDown(oldIndex) {
		return () => {
			if (oldIndex === options.length - 1) {
				return;
			}
			onOptionMove(oldIndex, oldIndex + 1);
		};
	}

	function onOptionMove(oldIndex, newIndex) {
		if (!options) {
			return;
		}

		const tmpValue = options[newIndex];

		options.splice(newIndex, 1, options[oldIndex]);
		options.splice(oldIndex, 1, tmpValue);

		setAttributes({ options });
		setRerender(Math.random());
	}

	const removeOptionItem = (previousIndex) => {
		const amount = Math.abs(options.length);
		if (amount === 1) {
			return;
		}
		const currentItems = filter(options, (item, i) => previousIndex !== i);
		setAttributes({ options: currentItems });
	};

	const updateOption = (index, value) => {
		const newOptions = options.map((item, iteration) => {
			if (index === iteration) {
				item = { ...item, ...value };
			}
			return item;
		});

		setAttributes({
			options: newOptions,
		});
	};

	const isOptionSelected = (option) => {
		if (defaultValue !== '' && get(option, 'value', '') === defaultValue) {
			return true;
		}
	};

	const [activeTab, setActiveTab] = useState('general');
	const { previewDevice } = useSelect(
		(select) => {
			return {
				previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
			};
		},
		[clientId]
	);

	useEffect(() => {
		// Doesn't worry about if a filed is duplicated. Duplicated fields get a custom ID through the watch at the form level.
		const uniqueId = getUniqueFieldId(uniqueID, clientId);
		if (uniqueId !== uniqueID) {
			attributes.uniqueID = uniqueId;
			setAttributes({ uniqueID: uniqueId });
		}
	}, []);

	const previewMaxWidth = getPreviewSize(
		previewDevice,
		maxWidth && maxWidth[0] ? maxWidth[0] : '',
		maxWidth && maxWidth[1] ? maxWidth[1] : '',
		maxWidth && maxWidth[2] ? maxWidth[2] : ''
	);
	const previewMinWidth = getPreviewSize(
		previewDevice,
		minWidth && minWidth[0] ? minWidth[0] : '',
		minWidth && minWidth[1] ? minWidth[1] : '',
		minWidth && minWidth[2] ? minWidth[2] : ''
	);
	const classes = classNames({
		'kb-adv-form-field': true,
		'kb-adv-form-infield-type-input': true,
	});
	const blockProps = useBlockProps({
		className: classes,
		style: {
			maxWidth: '' !== previewMaxWidth ? previewMaxWidth + (maxWidthUnit ? maxWidthUnit : '%') : undefined,
			minWidth: '' !== previewMinWidth ? previewMinWidth + (minWidthUnit ? minWidthUnit : 'px') : undefined,
		},
	});
	const defaultPreview = useMemo(() => {
		if (
			undefined !== kadenceDynamic &&
			undefined !== kadenceDynamic.defaultValue &&
			undefined !== kadenceDynamic.defaultValue?.enable &&
			'' !== kadenceDynamic.defaultValue.enable &&
			true === kadenceDynamic.defaultValue.enable
		) {
			return kadenceDynamic?.defaultValue?.field ? '{' + kadenceDynamic.defaultValue.field + '}' : '';
		}
		return attributes?.defaultValue ? attributes.defaultValue : '';
	}, [kadenceDynamic, defaultValue]);

	return (
		<>
			<style>
				{isSelected && (
					<>
						{`.block-editor-block-popover__inbetween-container .block-editor-block-list__insertion-point.is-with-inserter { display: none }`}
						;
					</>
				)}
			</style>
			<div {...blockProps}>
				<DuplicateField clientId={clientId} name={name} attributes={attributes} />
				<InspectorControls>
					<SelectParentBlock
						label={__('View Form Settings', 'kadence-blocks')}
						clientId={clientId}
						parentSlug={'kadence/advanced-form'}
					/>
					<InspectorControlTabs
						panelName={'advanced-form-select'}
						setActiveTab={setActiveTab}
						activeTab={activeTab}
						allowedTabs={['general', 'advanced']}
					/>
					{activeTab === 'general' && (
						<>
							<KadencePanelBody
								title={__('Select Options', 'kadence-blocks')}
								initialOpen={true}
								panelName={'kb-adv-form-select-options'}
							>
								<div className="kb-adv-field-options-wrap">
									{times(options.length, (n) => (
										<div key={n} className="kb-adv-field-option">
											<TextControl
												className={'kb-option-text-control'}
												label={
													__('Option', 'kadence-blocks') +
													' ' +
													(n + 1) +
													' ' +
													__('label', 'kadence-blocks')
												}
												placeholder={__('Option', 'kadence-blocks')}
												value={undefined !== options[n].label ? options[n].label : ''}
												onChange={(text) => updateOption(n, { label: text })}
											/>
											<TextControl
												label={
													__('Option', 'kadence-blocks') +
													' ' +
													(n + 1) +
													' ' +
													__('value', 'kadence-blocks')
												}
												placeholder={options[n].label}
												value={undefined !== options[n].value ? options[n].value : ''}
												onChange={(text) => updateOption(n, { value: text })}
											/>
											<div className="kadence-blocks-list-item__control-menu">
												<Button
													icon="arrow-up"
													onClick={n === 0 ? undefined : onOptionMoveUp(n)}
													className="kadence-blocks-list-item__move-up"
													label={__('Move Item Up', 'kadence-blocks')}
													aria-disabled={n === 0}
													disabled={n === 0}
												/>
												<Button
													icon="arrow-down"
													onClick={n + 1 === options.length ? undefined : onOptionMoveDown(n)}
													className="kadence-blocks-list-item__move-down"
													label={__('Move Item Down', 'kadence-blocks')}
													aria-disabled={n + 1 === options.length}
													disabled={n + 1 === options.length}
												/>
												<Button
													icon="no-alt"
													onClick={() => removeOptionItem(n)}
													className="kadence-blocks-list-item__remove"
													label={__('Remove Item', 'kadence-blocks')}
													disabled={1 === options.length}
												/>
											</div>
										</div>
									))}
								</div>

								<Button
									className="kb-add-option"
									variant="primary"
									icon={plus}
									onClick={() => {
										const newOptions = options;
										newOptions.push({
											value: '',
											label: '',
										});
										setAttributes({ options: newOptions });
										setRerender(Math.random());
									}}
								>
									{__('Add Option', 'kadence-blocks')}
								</Button>

								<ToggleControl
									label={__('Multi Select', 'kadence-blocks')}
									checked={multiSelect}
									onChange={(value) => setAttributes({ multiSelect: value })}
									help={__(
										'Checkboxes are a preferred alternative due to their easier usability.',
										'kadence-blocks'
									)}
								/>
							</KadencePanelBody>

							<KadencePanelBody
								title={__('Field Controls', 'kadence-blocks')}
								initialOpen={true}
								panelName={'kb-adv-form-select-controls'}
							>
								<ToggleControl
									label={__('Required', 'kadence-blocks')}
									checked={required}
									onChange={(value) => setAttributes({ required: value })}
								/>
								<TextControl
									label={__('Field Label', 'kadence-blocks')}
									value={label}
									onChange={(value) => setAttributes({ label: value })}
								/>
								<ToggleControl
									label={__('Show Label', 'kadence-blocks')}
									checked={showLabel}
									onChange={(value) => setAttributes({ showLabel: value })}
								/>
								<TextareaControl
									label={__('Description', 'kadence-blocks')}
									help={__(
										'This will be displayed under the input and can be used to provide direction on how the field should be filled out.',
										'kadence-blocks'
									)}
									value={helpText}
									onChange={(value) => setAttributes({ helpText: value })}
								/>
								<TextControl
									label={__('Select Placeholder', 'kadence-blocks')}
									value={placeholder}
									onChange={(value) => setAttributes({ placeholder: value })}
								/>
								<DynamicTextInputControl
									label={__('Default Value', 'kadence-blocks')}
									value={defaultValue}
									preview={defaultPreview}
									onChange={(value) => setAttributes({ defaultValue: value })}
									dynamicAttribute={'defaultValue'}
									allowClear={true}
									isSelected={isSelected}
									attributes={attributes}
									setAttributes={setAttributes}
									name={name}
									clientId={clientId}
									context={context}
								/>
							</KadencePanelBody>
						</>
					)}

					{activeTab === 'advanced' && (
						<>
							<KadencePanelBody
								title={__('Field Width', 'kadence-blocks')}
								initialOpen={true}
								panelName={'kb-adv-form-select-width'}
							>
								<ResponsiveRangeControls
									label={__('Max Width', 'kadence-blocks')}
									value={undefined !== maxWidth && undefined !== maxWidth[0] ? maxWidth[0] : ''}
									onChange={(value) => {
										setAttributes({
											maxWidth: [
												value,
												undefined !== maxWidth && undefined !== maxWidth[1] ? maxWidth[1] : '',
												undefined !== maxWidth && undefined !== maxWidth[2] ? maxWidth[2] : '',
											],
										});
									}}
									tabletValue={undefined !== maxWidth && undefined !== maxWidth[1] ? maxWidth[1] : ''}
									onChangeTablet={(value) => {
										setAttributes({
											maxWidth: [
												undefined !== maxWidth && undefined !== maxWidth[0] ? maxWidth[0] : '',
												value,
												undefined !== maxWidth && undefined !== maxWidth[2] ? maxWidth[2] : '',
											],
										});
									}}
									mobileValue={undefined !== maxWidth && undefined !== maxWidth[2] ? maxWidth[2] : ''}
									onChangeMobile={(value) => {
										setAttributes({
											maxWidth: [
												undefined !== maxWidth && undefined !== maxWidth[0] ? maxWidth[0] : '',
												undefined !== maxWidth && undefined !== maxWidth[1] ? maxWidth[1] : '',
												value,
											],
										});
									}}
									min={0}
									max={maxWidthUnit === 'px' ? 2000 : 100}
									step={1}
									unit={maxWidthUnit ? maxWidthUnit : '%'}
									onUnit={(value) => {
										setAttributes({ maxWidthUnit: value });
									}}
									units={['px', '%', 'vw']}
								/>
								<ResponsiveRangeControls
									label={__('Min Width', 'kadence-blocks')}
									value={undefined !== minWidth && undefined !== minWidth[0] ? minWidth[0] : ''}
									onChange={(value) => {
										setAttributes({
											minWidth: [
												value,
												undefined !== minWidth && undefined !== minWidth[1] ? minWidth[1] : '',
												undefined !== minWidth && undefined !== minWidth[2] ? minWidth[2] : '',
											],
										});
									}}
									tabletValue={undefined !== minWidth && undefined !== minWidth[1] ? minWidth[1] : ''}
									onChangeTablet={(value) => {
										setAttributes({
											minWidth: [
												undefined !== minWidth && undefined !== minWidth[0] ? minWidth[0] : '',
												value,
												undefined !== minWidth && undefined !== minWidth[2] ? minWidth[2] : '',
											],
										});
									}}
									mobileValue={undefined !== minWidth && undefined !== minWidth[2] ? minWidth[2] : ''}
									onChangeMobile={(value) => {
										setAttributes({
											minWidth: [
												undefined !== minWidth && undefined !== minWidth[0] ? minWidth[0] : '',
												undefined !== minWidth && undefined !== minWidth[1] ? minWidth[1] : '',
												value,
											],
										});
									}}
									min={0}
									max={minWidthUnit === 'px' ? 2000 : 100}
									step={1}
									unit={minWidthUnit ? minWidthUnit : 'px'}
									onUnit={(value) => {
										setAttributes({ minWidthUnit: value });
									}}
									units={['px', '%', 'vw']}
								/>
							</KadencePanelBody>
							<KadencePanelBody
								title={__('Extra Settings', 'kadence-blocks')}
								initialOpen={false}
								panelName={'kb-adv-form-select-extra-settings'}
							>
								<FieldName
									value={inputName}
									uniqueID={uniqueID}
									onChange={(value) =>
										setAttributes({ inputName: value.replace(/[^a-z0-9-_]/gi, '') })
									}
								/>
								<TextControl
									label={__('Input aria description', 'kadence-blocks')}
									value={ariaDescription}
									onChange={(value) => setAttributes({ ariaDescription: value })}
									help={__(
										'This content will be hidden by default and exposed to screen readers as the aria-describedby attribute for this form field. Note that the normal description field will no longer be used for aria-describedby.',
										'kadence-blocks'
									)}
								/>
								{required && (
									<TextControl
										label={__('Field error message when required', 'kadence-blocks')}
										value={requiredMessage}
										onChange={(value) => setAttributes({ requiredMessage: value })}
										placeholder={
											(undefined !== label ? label : '') +
											' ' +
											__('is required', 'kadence-blocks')
										}
									/>
								)}
								<TextControl
									label={__('Populate with Parameter', 'kadence-blocks')}
									help={__(
										'Enter a parameter that can be used in the page url to dynamically populate the field.',
										'kadence-blocks'
									)}
									value={defaultParameter}
									onChange={(value) => setAttributes({ defaultParameter: value })}
								/>
							</KadencePanelBody>
						</>
					)}
				</InspectorControls>
				<>
					<FormFieldLabel
						required={required}
						label={label}
						showLabel={showLabel}
						setAttributes={setAttributes}
						isSelected={isSelected}
						name={name}
					/>

					{isSelected ? (
						<div className={'kb-form-multi'}>
							{times(options.length, (n) => (
								<div className={'inline-option-add-item'} key={n}>
									<input
										key={'text' + n}
										type={'text'}
										value={options[n].label}
										className={'ignore-field-styles'}
										onChange={(value) => updateOption(n, { label: value.target.value })}
									/>
									<Button onClick={() => removeOptionItem(n)}>
										<span className="dashicons dashicons-trash"></span>
									</Button>
								</div>
							))}

							<Button
								variant="primary"
								icon={plus}
								className={'kb-form-multi__add-option'}
								onClick={() => {
									const newOptions = options;
									newOptions.push({
										value: '',
										label: '',
									});
									setAttributes({ options: newOptions });
									setRerender(Math.random());
								}}
							>
								{__('Add Option', 'kadence-blocks')}
							</Button>
						</div>
					) : (
						<select multiple={multiSelect}>
							{times(options.length, (n) => (
								<option
									key={n}
									value={n}
									selected={isOptionSelected(options[n])}
									disabled={get(options[n], 'disabled', false)}
								>
									{options[n].label}
								</option>
							))}
						</select>
					)}

					{helpText && <span className="kb-form-field-help">{helpText}</span>}
				</>
				<FieldBlockAppender inline={true} className="kb-custom-inbetween-inserter" getRoot={clientId} />
			</div>
		</>
	);
}

export default FieldSelect;
