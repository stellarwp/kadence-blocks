import { TypographyControls, MeasurementControls, PopColorControl } from '@kadence/components';
import { map, debounce } from 'lodash';
/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
const { Component, Fragment } = wp.element;
import { Button, PanelBody, ToggleControl, ButtonGroup } from '@wordpress/components';

class KadenceGlobalTypography extends Component {
	constructor() {
		super(...arguments);
		this.saveConfig = this.saveConfig.bind(this);
		this.saveConfigState = debounce(this.saveConfigState.bind(this));
		this.state = {
			isSaving: false,
			pPaddingControl: 'linked',
			pMarginControl: 'individual',
			globalStyles: kadence_blocks_params.global ? JSON.parse(kadence_blocks_params.global) : {},
			user: kadence_blocks_params.user ? kadence_blocks_params.user : 'admin',
		};
	}
	componentDidMount() {
		const typographyConfig =
			this.state.globalStyles && this.state.globalStyles.typography ? this.state.globalStyles.typography : {};
		if (typographyConfig.p && typographyConfig.p[0]) {
			if (
				typographyConfig.p[0].padding[0] === typographyConfig.p[0].padding[1] &&
				typographyConfig.p[0].padding[0] === typographyConfig.p[0].padding[2] &&
				typographyConfig.p[0].padding[0] === typographyConfig.p[0].padding[3]
			) {
				this.setState({ pPaddingControl: 'linked' });
			} else {
				this.setState({ pPaddingControl: 'individual' });
			}
			if (
				typographyConfig.p[0].margin[0] === typographyConfig.p[0].margin[1] &&
				typographyConfig.p[0].margin[0] === typographyConfig.p[0].margin[2] &&
				typographyConfig.p[0].margin[0] === typographyConfig.p[0].margin[3]
			) {
				this.setState({ pMarginControl: 'linked' });
			} else {
				this.setState({ pMarginControl: 'individual' });
			}
		}
	}
	saveConfig(settingID, settingArray) {
		this.setState({ isSaving: true });
		const config = kadence_blocks_params.global ? JSON.parse(kadence_blocks_params.global) : {};
		if (!config[settingID]) {
			config[settingID] = {};
		}
		config[settingID] = settingArray;
		const settingModel = new wp.api.models.Settings({ kadence_blocks_global: JSON.stringify(config) });
		settingModel.save().then((response) => {
			this.setState({ isSaving: false, globalStyles: config });
			kadence_blocks_params.global = JSON.stringify(config);
		});
	}
	saveConfigState(key, value) {
		const globalStyles = this.state.globalStyles;
		if (!globalStyles.typography) {
			globalStyles.typography = {};
		}
		globalStyles.typography[key] = value;
		this.setState({ globalStyles });
		this.saveConfig('typography', globalStyles.typography);
	}
	render() {
		const { globalStyles, pMarginControl, pPaddingControl } = this.state;
		const typographyConfig = globalStyles && globalStyles.typography ? globalStyles.typography : {};
		const pDefaultStyles = [
			{
				enable: false,
				color: '',
				size: [16, '', ''],
				sizeType: 'px',
				lineHeight: [1.5, '', ''],
				lineType: 'em',
				letterSpacing: '',
				textTransform: '',
				family: '',
				google: false,
				style: '',
				weight: '',
				variant: '',
				subset: '',
				loadGoogle: true,
				padding: ['', '', '', ''],
				paddingUnit: 'px',
				margin: ['', '', 1.5, ''],
				marginUnit: 'em',
			},
		];
		const h1DefaultStyles = [
			{
				enable: false,
				color: '',
				size: ['40', '', ''],
				sizeType: 'px',
				lineHeight: ['1.2', '', ''],
				lineType: 'em',
				letterSpacing: '',
				textTransform: '',
				family: '',
				google: false,
				style: '',
				weight: '',
				variant: '',
				subset: '',
				loadGoogle: true,
				padding: [0, 0, 0, 0],
				paddingUnit: 'px',
				margin: [0, 0, 2, 0],
				marginUnit: '%',
			},
		];
		const pStyles =
			undefined !== typographyConfig && undefined !== typographyConfig.p && undefined !== typographyConfig.p[0]
				? typographyConfig.p
				: pDefaultStyles;
		//const h1Styles = ( undefined !== typographyConfig && undefined !== typographyConfig[ 1 ] && typographyConfig[ 1 ] ? typographyConfig[ 1 ] : h1DefaultStyles );
		const saveParagraph = (value) => {
			const newUpdate = pStyles.map((item, index) => {
				if (0 === index) {
					item = { ...item, ...value };
				}
				return item;
			});
			this.saveConfigState('p', newUpdate);
		};
		const marginTypes = [
			{ key: 'px', name: 'px' },
			{ key: 'em', name: 'em' },
			{ key: '%', name: '%' },
			{ key: 'vh', name: 'vh' },
			{ key: 'rem', name: 'rem' },
		];
		const paddingTypes = [
			{ key: 'px', name: 'px' },
			{ key: 'em', name: 'em' },
			{ key: '%', name: '%' },
			{ key: 'vw', name: 'vw' },
			{ key: 'vh', name: 'vh' },
			{ key: 'rem', name: 'rem' },
		];
		return (
			<Fragment>
				<div className="kb-global-typography-container">
					<div className="kb-global-typography-label">
						<h2 className="kt-beside-color-label">{__('Body')}</h2>
						<ToggleControl
							checked={pStyles[0].enable}
							onChange={(value) => saveParagraph({ enable: value })}
						/>
					</div>
					{pStyles[0].enable && (
						<div className="kt-inner-sub-section">
							<PopColorControl
								label={__('Color')}
								value={pStyles[0].color ? pStyles[0].color : ''}
								default={''}
								onChange={(value) => saveParagraph({ color: value })}
							/>
							<TypographyControls
								fontSize={pStyles[0].size}
								onFontSize={(value) => saveParagraph({ size: value })}
								fontSizeType={pStyles[0].sizeType}
								onFontSizeType={(value) => saveParagraph({ sizeType: value })}
								lineHeight={pStyles[0].lineHeight}
								onLineHeight={(value) => saveParagraph({ lineHeight: value })}
								lineHeightType={pStyles[0].lineType}
								onLineHeightType={(value) => saveParagraph({ lineType: value })}
							/>
							<PanelBody title={__('Advanced Settings')} initialOpen={false}>
								<TypographyControls
									letterSpacing={pStyles[0].letterSpacing}
									onLetterSpacing={(value) => saveParagraph({ letterSpacing: value })}
									textTransform={pStyles[0].textTransform}
									onTextTransform={(value) => saveParagraph({ textTransform: value })}
									fontFamily={pStyles[0].family}
									onFontFamily={(value) => saveParagraph({ family: value })}
									onFontChange={(select) => {
										saveParagraph({
											family: select.value,
											google: select.google,
										});
									}}
									onFontArrayChange={(values) => saveParagraph(values)}
									googleFont={pStyles[0].google}
									onGoogleFont={(value) => saveParagraph({ google: value })}
									loadGoogleFont={pStyles[0].loadGoogle}
									onLoadGoogleFont={(value) => saveParagraph({ loadGoogle: value })}
									fontVariant={pStyles[0].variant}
									onFontVariant={(value) => saveParagraph({ variant: value })}
									fontWeight={pStyles[0].weight}
									onFontWeight={(value) => saveParagraph({ weight: value })}
									fontStyle={pStyles[0].style}
									onFontStyle={(value) => saveParagraph({ style: value })}
									fontSubset={pStyles[0].subset}
									onFontSubset={(value) => saveParagraph({ subset: value })}
								/>
								<ButtonGroup
									className="kt-size-type-options kt-row-size-type-options"
									aria-label={__('Padding Type', 'kadence-blocks')}
								>
									{map(paddingTypes, ({ name, key }) => (
										<Button
											key={key}
											className="kt-size-btn"
											isSmall
											isPrimary={pStyles[0].paddingUnit === key}
											aria-pressed={pStyles[0].paddingUnit === key}
											onClick={() => saveParagraph({ paddingUnit: key })}
										>
											{name}
										</Button>
									))}
								</ButtonGroup>
								<MeasurementControls
									label={__('Padding', 'kadence-blocks')}
									measurement={pStyles[0].padding}
									onChange={(value) => saveParagraph({ padding: value })}
									control={pPaddingControl}
									onControl={(value) => this.setState({ pPaddingControl: value })}
									min={0}
									max={pStyles[0].paddingUnit === 'em' || pStyles[0].paddingUnit === 'rem' ? 12 : 200}
									step={pStyles[0].paddingUnit === 'em' || pStyles[0].paddingUnit === 'rem' ? 0.1 : 1}
									allowEmpty={true}
								/>
								<ButtonGroup
									className="kt-size-type-options kt-row-size-type-options"
									aria-label={__('Margin Type', 'kadence-blocks')}
								>
									{map(marginTypes, ({ name, key }) => (
										<Button
											key={key}
											className="kt-size-btn"
											isSmall
											isPrimary={pStyles[0].marginUnit === key}
											aria-pressed={pStyles[0].marginUnit === key}
											onClick={() => saveParagraph({ marginUnit: key })}
										>
											{name}
										</Button>
									))}
								</ButtonGroup>
								<MeasurementControls
									label={__('Margin', 'kadence-blocks')}
									measurement={pStyles[0].margin}
									onChange={(value) => saveParagraph({ margin: value })}
									control={pMarginControl}
									onControl={(value) => this.setState({ pMarginControl: value })}
									min={0}
									max={pStyles[0].marginUnit === 'em' || pStyles[0].marginUnit === 'rem' ? 12 : 200}
									step={pStyles[0].marginUnit === 'em' || pStyles[0].marginUnit === 'rem' ? 0.1 : 1}
									allowEmpty={true}
								/>
							</PanelBody>
						</div>
					)}
				</div>
			</Fragment>
		);
	}
}
export default KadenceGlobalTypography;
