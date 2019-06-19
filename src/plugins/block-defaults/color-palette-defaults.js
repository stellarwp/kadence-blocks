import get from 'lodash/get';
import map from 'lodash/map';
import uniqueId from 'lodash/uniqueId';
import findIndex from 'lodash/findIndex';
import AdvancedColorControlPalette from '../../advanced-color-control-palette';
const {
	Component,
	Fragment,
} = wp.element;
const {
	ToggleControl,
	Dashicon,
	Button,
	Tooltip,
} = wp.components;

const kbColorUniqueIDs = [];
/**
 * Internal block libraries
 */
const { __, sprintf } = wp.i18n;
class KadenceColorDefault extends Component {
	constructor() {
		super( ...arguments );
		this.saveConfig = this.saveConfig.bind( this );
		this.state = {
			isSaving: false,
			kadenceColors: ( kadence_blocks_params.colors ? JSON.parse( kadence_blocks_params.colors ) : { palette: [], override: false } ),
			colors: [],
			themeColors: [],
			showMessage: false,
		};
	}
	componentDidMount() {
		const settings = wp.data.select( 'core/block-editor' ).getSettings();
		this.setState( { colors: get( settings, [ 'colors' ], [] ) } );
		if ( undefined !== this.state.kadenceColors.palette && undefined !== this.state.kadenceColors.palette[ 0 ] ) {
			map( this.state.kadenceColors.palette, ( { slug } ) => {
				const theID = slug.substring( 11 );
				kbColorUniqueIDs.push( theID );
			} );
			if ( undefined !== this.state.kadenceColors.override && true === this.state.kadenceColors.override ) {
				this.setState( { showMessage: true } );
			}
		}
	}
	saveConfig() {
		if ( false === this.state.isSaving ) {
			this.setState( { isSaving: true } );
			const config = this.state.kadenceColors;
			const settingModel = new wp.api.models.Settings( { kadence_blocks_colors: JSON.stringify( config ) } );
			settingModel.save().then( response => {
				this.setState( { isSaving: false, kadenceColors: config, isOpen: false } );
				kadence_blocks_params.colors = JSON.stringify( config );
				wp.data.dispatch( 'core/block-editor' ).updateEditorSettings( { colors: this.state.colors } );
			} );
		}
	}
	render() {
		const { kadenceColors, colors, themeColors } = this.state;
		const colorRemove = ( undefined !== kadenceColors.override && true === kadenceColors.override ? 1 : 0 );
		return (
			<div className="kt-block-default-palette">
				{ colors && (
					<div className="components-color-palette">
						{ map( colors, ( { color, name, slug }, index ) => {
							let editable = false;
							let theIndex;
							if ( undefined !== slug && slug.substr( 0, 10 ) === 'kb-palette' ) {
								theIndex = findIndex( kadenceColors.palette, ( c ) => c.slug === slug );
								editable = true;
							} else if ( undefined === themeColors[ index ] ) {
								themeColors.push( colors[ index ] );
							}
							const style = { color };
							return (
								<div key={ color } className="components-color-palette__item-wrapper">
									{ editable && undefined !== theIndex && (
										<AdvancedColorControlPalette
											nameValue={ ( kadenceColors.palette[ theIndex ].name ? kadenceColors.palette[ theIndex ].name : __( 'Color' ) + ' ' + theIndex + 1  ) }
											colorValue={ ( kadenceColors.palette[ theIndex ].color ? kadenceColors.palette[ theIndex ].color : '#ffffff' ) }
											onSave={ ( value, title ) => {
												const newUpdate = kadenceColors;
												newUpdate.palette[ theIndex ] = {
													name: title,
													slug: slug,
													color: value,
												};
												const newColors = colors;
												newColors[ index ] = {
													name: title,
													slug: slug,
													color: value,
												};
												this.setState( { kadenceColors: newUpdate } );
												this.setState( { colors: newColors } );
												this.saveConfig();
											} }
										/>
									) }
									{ ! editable && (
										<Tooltip
											text={ name ||
											// translators: %s: color hex code e.g: "#f00".
											sprintf( __( 'Color code: %s' ), color )
											}>
											<div className="components-color-palette__item" style={ style }>
												<Dashicon icon="lock" />
											</div>
										</Tooltip>
									) }
								</div>
							);
						} ) }
						{ undefined !== kadenceColors.palette && undefined !== kadenceColors.palette[ colorRemove ] && (
							<div className="kt-colors-remove-last">
								<Tooltip text={ __( 'Remove Last Color' ) } >
									<Button
										type="button"
										isDestructive
										onClick={ () => {
											const removeKey = kadenceColors.palette.length - 1;
											const removeItem = ( undefined !== kadenceColors.palette[ removeKey ] ? kadenceColors.palette[ removeKey ] : kadenceColors.palette[ removeKey ] );
											kadenceColors.palette.pop();
											const theColorIndex = findIndex( colors, ( c ) => c.slug === removeItem.slug );
											colors.splice( theColorIndex, 1 );
											this.setState( { kadenceColors: kadenceColors } );
											this.setState( { colors: colors } );
											this.saveConfig();
										} }
										aria-label={ __( 'Remove Last Color' ) }
									>
										<Dashicon icon="editor-removeformatting" />
									</Button>
								</Tooltip>
							</div>
						) }
					</div>
				) }
				<div className="kt-colors-add-new">
					<Button
						type="button"
						isPrimary
						onClick={ () => {
							if ( undefined === kadenceColors.palette ) {
								kadenceColors.palette = [];
							}
							let id = uniqueId();
							if ( kbColorUniqueIDs.includes( id ) ) {
								id = kadenceColors.palette.length.toString();
								if ( kbColorUniqueIDs.includes( id ) ) {
									id = uniqueId( id );
									if ( kbColorUniqueIDs.includes( id ) ) {
										id = uniqueId( id );
										if ( kbColorUniqueIDs.includes( id ) ) {
											id = uniqueId( id );
											if ( kbColorUniqueIDs.includes( id ) ) {
												id = uniqueId( id );
												if ( kbColorUniqueIDs.includes( id ) ) {
													id = uniqueId( id );
												}
											}
										}
									}
								}
							}
							kbColorUniqueIDs.push( id );
							kadenceColors.palette.push( {
								name: __( 'Color' ) + ' ' + ( id ),
								slug: 'kb-palette-' + id,
								color: '#888888',
							} );
							colors.push( {
								name: __( 'Color' ) + ' ' + ( id ),
								slug: 'kb-palette-' + id,
								color: '#888888',
							} );
							this.setState( { kadenceColors: kadenceColors } );
							this.setState( { colors: colors } );
							this.saveConfig();
						} }
						aria-label={ __( 'Add Color' ) }
					>
						{ __( 'Add Color' ) }
					</Button>
				</div>
				{ undefined !== kadenceColors.palette && undefined !== kadenceColors.palette[ 0 ] && (
					<Fragment>
						<ToggleControl
							label={ __( 'Use only Kadence Blocks Colors?' ) }
							checked={ ( undefined !== kadenceColors.override ? kadenceColors.override : false ) }
							onChange={ ( value ) => {
								let newColors;
								const newKadenceColors = this.state.kadenceColors;
								if ( true === value ) {
									newColors = newKadenceColors.palette;
									newKadenceColors.override = true;
								} else {
									newKadenceColors.override = false;
									if ( undefined !== themeColors && undefined !== themeColors[ 0 ] && undefined !== themeColors[ 0 ].slug ) {
										newColors = themeColors.concat( newKadenceColors.palette );
									} else {
										newColors = newKadenceColors.palette;
										this.setState( { showMessage: true } );
									}
								}
								this.setState( { kadenceColors: newKadenceColors } );
								this.setState( { colors: newColors } );
								this.saveConfig();
							} }
						/>
						{ undefined !== kadenceColors.override && false === kadenceColors.override && true === this.state.showMessage && (
							<p className="kb-colors-show-notice">{ __( 'Refresh page to reload theme defined colors' ) }</p>
						) }
					</Fragment>
				) }
			</div>
		);
	}
}
export default KadenceColorDefault;
