/**
 * Post Selector Checkbox
 */

/**
 * Import Css
 */
import './editor.scss';

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useState, useRef, useCallback, useMemo } from '@wordpress/element';
import { Button, TabPanel, Spinner, CheckboxControl, TextControl, PanelBody } from '@wordpress/components';
import { decodeEntities } from '@wordpress/html-entities';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '@wordpress/api-fetch';
import { debounce } from 'lodash';

export default function PostSelectorCheckbox( { postType = 'posts', title = '', onSelect, initialOpen = true, useForceState = false, forceOpen = false, onPanelBodyToggle } ) {

	const PanelBodyTitle = title === '' ? __( 'Posts', 'kadence-blocks' ) : title;
	const [ selectedPosts, setSelectedPosts ] = useState( [] );
	const [ isLoading, setIsLoading ] = useState( true );
	const [ isLoadingMore, setIsLoadingMore ] = useState( false );
	const [ page, setPage ] = useState( 1 );
	const [ posts, setPosts ] = useState( [] );
	const [ searchPosts, setSearchPosts ] = useState( [] );
	const [ hasMore, setHasMore ] = useState( false );
	const [ searchQuery, setSearchQuery ] = useState( '' );
	const [ tab, setTab ] = useState( 'recent' );

	const scrollableDivRef = useRef( null );
	const searchRef = useRef( null );

	function correctPostType( postType ) {
		if( postType === 'post' ) {
			return 'posts';
		} else if ( postType === 'page' ) {
			return 'pages';
		}

		return postType;
	}

	useEffect( () => {
		getPosts();
	}, [ tab, page ] );

	useEffect( () => {
		const handleScroll = () => {
			const div = scrollableDivRef.current;
			if ( ( div.scrollTop + div.clientHeight + 25 ) >= div.scrollHeight && tab !== 'search' ) {
				if ( !isLoading && !isLoadingMore && hasMore ) {
					setPage( page + 1 );
					setIsLoadingMore( true );
				}
			}
		};

		const div = scrollableDivRef.current;
		if ( div ) {
			div.addEventListener( 'scroll', handleScroll );
		}

		return () => {
			if ( div ) {
				div.removeEventListener( 'scroll', handleScroll );
			}
		};
	}, [ isLoading, isLoadingMore ] ); // loadMore

	const onTabSelect = ( tabName ) => {
		if ( tab !== tabName ) {
			setTab( tabName );
			setSearchQuery( '' );
			setSelectedPosts( [] );
			setPage( 1 );
		}
	};

	const getPosts = ( type = 'standard', query = '') => {
		if ( !isLoadingMore ) {
			setIsLoading( true );
		}

		const args = {
			per_page: 30,
			page
		};

		if( type === 'search' ) {
			args.search = query;
		} else if( postType === 'categories' ){

		} else {
			args.orderby = tab === 'all' ? 'title' : 'date';
			args.order = tab === 'all' ? 'asc' : 'desc';
		}


		apiFetch( {
			path : addQueryArgs( `/wp/v2/${ correctPostType(postType) }`, args),
			parse: false,
		} )
			.then( ( response ) => {
				response.json().then( ( postResults ) => {

					if ( isLoadingMore ) {
						setPosts( ( prevPosts ) => [ ...prevPosts, ...postResults ] );
					} else if( type === 'search' ) {
						setSearchPosts( postResults );
					} else {
						setPosts( postResults );
					}

					setIsLoading( false );
					setIsLoadingMore( false );

					const totalPages = response.headers.get( 'X-WP-TotalPages' );
					setHasMore( totalPages > page );
				} );
			} )
			.catch( () => {
				// Dont clear existing posts if we were loading more
				if ( !isLoadingMore ) {
					setPosts( [] );
					setSearchPosts( [] );
				}
				setIsLoading( false );
				setIsLoadingMore( false );
			} );
	};

	const handleCheckboxChange = ( post ) => {
		setSelectedPosts( ( prevSelected ) =>
			prevSelected.some( ( p ) => p.id === post.id )
				? prevSelected.filter( ( p ) => p.id !== post.id )
				: [ ...prevSelected, post ],
		);
	};

	const handleSelectAll = () => {
		if ( selectedPosts.length === posts.length ) {
			setSelectedPosts( [] );
		} else {
			setSelectedPosts( posts );
		}
	};

	const debouncedSearch = useMemo(() => debounce((value) => {
		getPosts('search', value);
	}, 300), []);

	// Wrap handleSearchChange with useCallback to prevent unnecessary re-renders
	const handleSearchChange = useCallback((value) => {
		setSearchQuery(value);
		debouncedSearch(value);
	}, [debouncedSearch]);

	const renderPosts = ( overridePosts = null ) => {
		const postsToRender = overridePosts || posts;

		return (
		<div>
			<div ref={scrollableDivRef} className={'posts-container'}>
				{postsToRender.map( ( post ) => (
					<div key={post.id}>
						<CheckboxControl
							label={ decodeEntities( postType === 'categories' ? post?.name : post?.title?.rendered ) }
							checked={selectedPosts.some( ( p ) => p.id === post.id )}
							onChange={() => handleCheckboxChange( post )}
						/>
					</div>
				) )}
				{isLoadingMore && <div><Spinner/></div>}
			</div>

			<div style={{ marginTop: '10px' }}>
				<CheckboxControl
					label={__( 'Select All', 'kadence-blocks' )}
					checked={selectedPosts.length === posts.length}
					indeterminate={selectedPosts.length > 0 && selectedPosts.length < posts.length}
					onChange={handleSelectAll}
				/>
			</div>
		</div>
	) };

	const panelBodyProps = {};

	if( useForceState ) {
		panelBodyProps.opened = forceOpen;
	} else {
		panelBodyProps.initialOpen = initialOpen;
	}

	if( onPanelBodyToggle ) {
		panelBodyProps.onToggle = onPanelBodyToggle;
	}


	return (
		<PanelBody className={'kb-post-selector-checkbox'} title={PanelBodyTitle} {...panelBodyProps}>
			<TabPanel
				className="tab-panel"
				activeClass="active-tab"
				onSelect={onTabSelect}
				tabs={[
					{
						name     : 'recent',
						title    : __( 'Recent', 'kadence-blocks' ),
						className: 'tab-one',
					},
					{
						name     : 'all',
						title    : __( 'All', 'kadence-blocks' ),
						className: 'all-tab',
					},
					{
						name     : 'search',
						title    : __( 'Search', 'kadence-blocks' ),
						className: 'search-tab',
					},
				]}
			>
				{(tab) => (
					<div className="tab-content-container">
							<div className="tab-content">
								{tab.name === 'recent' || tab.name === 'all' ? (
									<>{( isLoading ? <Spinner /> : renderPosts() ) }</>
								) : (
									<div className="search-container">
										<TextControl
											ref={searchRef}
											value={searchQuery}
											onChange={(value) => handleSearchChange(value)}
											placeholder={__('Search posts...', 'kadence-blocks')}
										/>
										<>{( isLoading ? <Spinner /> : renderPosts( searchPosts ) ) }</>
									</div>
								)}
							</div>
					</div>
				)}
			</TabPanel>
			<Button
				isPrimary
				onClick={() => {
					onSelect( selectedPosts );
					setSelectedPosts( [] );
				}}
			>
				{__( 'Add to Menu', 'kadence-blocks' )}
			</Button>
		</PanelBody>
	);
}
