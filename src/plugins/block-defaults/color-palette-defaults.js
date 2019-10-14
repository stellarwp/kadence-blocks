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
const { withSelect, withDispatch } = wp.data;
const {
	compose,
} = wp.compose;
const kbColorUniqueIDs = [];
/**
 * Internal block libraries
 */
const { __, sprintf } = wp.i18n;
class KadenceColorDefault extends Component {
	constructor() {
		super( ...arguments );
		this.saveConfig = this.saveConfig.bind( this );
		this.saveKadenceColors = this.saveKadenceColors.bind( this );
		this.saveColors = this.saveColors.bind( this );
		this.state = {
			isSaving: false,
			kadenceColors: ( kadence_blocks_params.colors ? JSON.parse( kadence_blocks_params.colors ) : { palette: [], override: false } ),
			colors: '',
			themeColors: [],
			showMessage: false,
			classSat: 'first',
		};
	}
	componentDidMount() {
		if ( ! this.state.colors ) {
			this.setState( { colors: this.props.baseColors } );
		}
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
				this.setState( { isSaving: false, kadenceColors: config } );
				kadence_blocks_params.colors = JSON.stringify( config );
				this.props.updateSettings( { colors: this.state.colors } );
			} );
		}
	}
	saveKadenceColors( value, index ) {
		const { kadenceColors } = this.state;
		const newItems = kadenceColors.palette.map( ( item, thisIndex ) => {
			if ( parseInt( index ) === parseInt( thisIndex ) ) {
				item = { ...item, ...value };
			}

			return item;
		} );
		const newPal = kadenceColors;
		newPal.palette = newItems;
		this.setState( {
			kadenceColors: newPal,
		} );
	}
	saveColors( value, index ) {
		const { colors } = this.state;
		const newItems = colors.map( ( item, thisIndex ) => {
			if ( parseInt( index ) === parseInt( thisIndex ) ) {
				item = { ...item, ...value };
			}

			return item;
		} );
		this.setState( { colors: newItems } );
	}
	render() {
		const { kadenceColors, colors } = this.state;
		const colorRemove = ( undefined !== kadenceColors.override && true === kadenceColors.override ? 1 : 0 );
		return (
			<div className="kt-block-default-palette">
				{ colors && (
					<div className={ `components-color-palette palette-comp-${ this.state.classSat }` }>
						{ this.state.classSat === 'first' && (
							Object.keys( this.state.colors ).map( ( index ) => {
								let editable = false;
								let theIndex;
								const color = colors[ index ].color;
								const name = colors[ index ].name;
								const slug = colors[ index ].slug;
								if ( undefined !== slug && slug.substr( 0, 10 ) === 'kb-palette' ) {
									theIndex = findIndex( kadenceColors.palette, ( c ) => c.slug === slug );
									editable = true;
								}
								const style = { color };
								return (
									<div key={ index } className="components-color-palette__item-wrapper">
										{ editable && undefined !== theIndex && kadenceColors.palette[ theIndex ].color && (
											<AdvancedColorControlPalette
												nameValue={ ( kadenceColors.palette[ theIndex ].name ? kadenceColors.palette[ theIndex ].name : __( 'Color' ) + ' ' + theIndex + 1  ) }
												colorValue={ ( kadenceColors.palette[ theIndex ].color ? kadenceColors.palette[ theIndex ].color : '#ffffff' ) }
												onSave={ ( value, title ) => {
													this.saveKadenceColors( { color: value, name: title, slug: slug }, theIndex );
													this.saveColors( { color: value, name: title, slug: slug }, index );
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
							} )
						) }
						{ this.state.classSat === 'second' && (
							Object.keys( this.state.colors ).map( ( index ) => {
								let editable = false;
								let theIndex;
								const color = colors[ index ].color;
								const name = colors[ index ].name;
								const slug = colors[ index ].slug;
								if ( undefined !== slug && slug.substr( 0, 10 ) === 'kb-palette' ) {
									theIndex = findIndex( kadenceColors.palette, ( c ) => c.slug === slug );
									editable = true;
								}
								const style = { color };
								return (
									<div key={ index } className="components-color-palette__item-wrapper">
										{ editable && undefined !== theIndex && kadenceColors.palette[ theIndex ].color && (
											<AdvancedColorControlPalette
												nameValue={ ( kadenceColors.palette[ theIndex ].name ? kadenceColors.palette[ theIndex ].name : __( 'Color' ) + ' ' + theIndex + 1  ) }
												colorValue={ ( kadenceColors.palette[ theIndex ].color ? kadenceColors.palette[ theIndex ].color : '#ffffff' ) }
												onSave={ ( value, title ) => {
													this.saveKadenceColors( { color: value, name: title, slug: slug }, theIndex );
													this.saveColors( { color: value, name: title, slug: slug }, index );
													this.saveConfig();
													this.setState( { classSat: 'first' } );
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
							} )
						) }
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
						className={ this.state.isSaving ? 'kb-add-btn-is-saving' : 'kb-add-btn-is-active' }
						isPrimary
						disabled={ this.state.isSaving }
						onClick={ () => {
							if ( this.state.isSaving ) {
								return;
							}
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
								color: '#888888',
								name: __( 'Color' ) + ' ' + ( id ),
								slug: 'kb-palette-' + id,
							} );
							colors.push( {
								color: '#888888',
								name: __( 'Color' ) + ' ' + ( id ),
								slug: 'kb-palette-' + id,
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
									newColors = newKadenceColors.palette;
									this.setState( { showMessage: true } );
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
export default compose( [
	withSelect( ( select ) => {
		const { getSettings } = select( 'core/block-editor' );
		const settings = getSettings();
		return {
			baseColors: get( settings, [ 'colors' ], [] ),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const {
			updateSettings,
		} = dispatch( 'core/block-editor' );
		return {
			updateSettings,
		};
	} ),
] )( KadenceColorDefault );
