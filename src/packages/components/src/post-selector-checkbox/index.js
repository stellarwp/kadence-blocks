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
import { useEffect, useState, useRef } from '@wordpress/element';
import { Button, TabPanel, Spinner, CheckboxControl, PanelBody } from '@wordpress/components';
import { addQueryArgs } from '@wordpress/url';
import KadencePanelBody from '../panel-body';
import apiFetch from '@wordpress/api-fetch';

export default function PostSelectorCheckbox( { postType = 'posts', title = '', onSelect, initialOpen = true } ) {

	const PanelBodyTitle = title === '' ? __( 'Posts', 'kadence-blocks' ) : title;
	const [ selectedPosts, setSelectedPosts ] = useState( [] );
	const [ isLoading, setIsLoading ] = useState( true );
	const [ isLoadingMore, setIsLoadingMore ] = useState( false );
	const [ page, setPage ] = useState( 1 );
	const [ posts, setPosts ] = useState( [] );
	const [ hasMore, setHasMore ] = useState( false );
	const [ searchQuery, setSearchQuery ] = useState( '' );
	const [ tab, setTab ] = useState( 'recent' );

	const scrollableDivRef = useRef( null );

	useEffect( () => {
		getPosts();
	}, [ tab, page ] );

	useEffect( () => {
		const handleScroll = () => {
			const div = scrollableDivRef.current;
			if ( ( div.scrollTop + div.clientHeight + 25 ) >= div.scrollHeight ) {
				if ( !isLoading && !isLoadingMore && hasMore ) {
					setPage( page + 1 );
					setIsLoadingMore( true );

					// loadMore().finally(() => setIsLoading(false));
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

	const getPosts = () => {
		if ( !isLoadingMore ) {
			setIsLoading( true );
		}

		apiFetch( {
			path : addQueryArgs( `/wp/v2/${postType}`, {
				per_page: 20,
				orderby : tab === 'all' ? 'title' : 'date',
				order   : tab === 'all' ? 'asc' : 'desc',
				page,
			} ),
			parse: false,
		} )
			.then( ( response ) => {
				response.json().then( ( postResults ) => {

					if ( isLoadingMore ) {
						setPosts( ( prevPosts ) => [ ...prevPosts, ...postResults ] );
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
				}
				setIsLoading( false );
				setIsLoadingMore( false );
			} );
	};

	const handleSearch = () => {
		setIsLoading( true );

		apiFetch( {
			path: addQueryArgs( `/wp/v2/${postType}`, {
				search  : searchQuery,
				per_page: 20,
			} ),
		} )
			.then( ( searchResults ) => {
				setPosts( searchResults );
				setIsLoading( false );
			} )
			.catch( () => {
				setPosts( [] );
				setIsLoading( false );
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

	const Search = () => (
		<div>
			<input
				type="text"
				value={searchQuery}
				onChange={( e ) => setSearchQuery( e.target.value )}
				placeholder={__( 'Search posts...', 'kadence-blocks' )}
			/>
			<Button isPrimary onClick={handleSearch} size={'compact'}>
				{__( 'Search', 'kadence-blocks' )}
			</Button>
		</div>
	);

	const renderPosts = () => (
		<div>
			<div ref={scrollableDivRef}
				 style={{
					 maxHeight: '200px', overflowY: 'scroll', border: 'solid 1px #dcdcde', padding: '10px',
				 }}>
				{posts.map( ( post ) => (
					<div key={post.id}>
						<CheckboxControl
							label={post.title.rendered}
							checked={selectedPosts.some( ( p ) => p.id === post.id )}
							onChange={() => handleCheckboxChange( post )}
						/>
					</div>
				) )}
				{isLoadingMore && <div><Spinner/></div>}
			</div>

			<div style={{ marginTop: '10px', paddingTop: '10px' }}>
				<CheckboxControl
					label={__( 'Select All', 'kadence-blocks' )}
					checked={selectedPosts.length === posts.length}
					indeterminate={selectedPosts.length > 0 && selectedPosts.length < posts.length}
					onChange={handleSelectAll}
				/>
			</div>
		</div>
	);

	return (
		<KadencePanelBody title={PanelBodyTitle} initialOpen={initialOpen}>
			<TabPanel
				className="my-tab-panel"
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
				{( tab ) => (
					<>
						{isLoading ? (
							<Spinner/>
						) : (
							<>
								{tab.name === 'recent' && renderPosts()}
								{tab.name === 'all' && renderPosts()}
								{tab.name === 'search' && <Search/>}
							</>
						)}
					</>
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
		</KadencePanelBody>
	);
}
