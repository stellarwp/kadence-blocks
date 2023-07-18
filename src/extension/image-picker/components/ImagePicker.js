import { 
	Spinner
} from '@wordpress/components';

import Masonry from 'react-masonry-css'
import InfiniteScroll from 'react-infinite-scroller';

import { API } from "../constants/API";
import { getImageDataSearch, getImageDataLoadMore } from "../functions/getImageData";
import Result from "./Result";
import ResultDetails from "./ResultDetails";
import SearchForm from "./SearchForm";

import { useMemo, useEffect, useState, useCallback, Fragment } from '@wordpress/element';
import { debounce } from 'lodash';

/**
 * Render the main ImagePicker application component.
 *
 * @param {Object}  props           The component props.
 * @param {string}  props.editor    Editor type.
 * @param {string}  props.provider  Image provider (eg Pexels).
 * @param {Array}   props.data      API results from the initial seeded / cached data.
 * @param {Element} props.container Image Picker container element.
 * @param {Object}  props.api_error API error object.
 * @return {JSX.Element}            ImagePicker component.
 */
export default function ImagePicker(props) {
	const {
		editor = "classic",
		provider,
		data,
		container,
		api_error = null,
		clientId = null,
	} = props;

	const delay = 250;
	const searchClass = "searching";
	const searchDefaults = {
		active: false,
		term: "",
		type: "",
		results: 0,
	};

    //seed initial state from props passed in
    const [dataState, setDataState] = useState( props.data.data );
    const [isLoading, setIsLoading] = useState( false );
    const [currentUserSelectionIndex, setCurrentUserSelectionIndex] = useState( 0 );
    const [query, setQuery] = useState( '' );

    const totalImages = 'undefined' != typeof( dataState.total ) ? dataState.total : 0;
    const page = 'undefined' != typeof( dataState.page ) ? dataState.page : 1;
    const hasMore = 'undefined' != typeof( dataState.images ) ? dataState.images.length < totalImages : false;

    const currentSelectedImage = 'undefined' != typeof( dataState.images ) ? ( ! isNaN( currentUserSelectionIndex ) ? dataState.images[currentUserSelectionIndex] : dataState.images[0] ) : {};

	// TODO reset everything when search changes
	useEffect( () => {
	}, [] );

	useEffect( () => {
        debouncedHandleSearch( query );
	}, [ query ] );

	/**
	 * Search submit handler.
	 *
	 * @param string query The query to search for.
	 */
	function handleSearch( query ) {
		if ( query && ! isLoading ) {
			getImageDataSearch( provider, dataState, query, setDataState, setIsLoading );
		}
	}

    const debouncedHandleSearch = useCallback( debounce( handleSearch, 500), [dataState, provider] );

	const loadMore = () => {
		if ( hasMore && ! isLoading ) {
			getImageDataLoadMore( provider, dataState, query, setDataState, setIsLoading );
		} else if ( ! hasMore ) {
            setIsLoading( false );
        }
	};

    const debouncedLoadMore = useCallback( debounce( loadMore, 500), [dataState, query, provider] );

    const breakpointCols = {
		default: 3,
		1900: 3,
		1600: 3,
		1200: 2,
		500: 1,
	}

    // A bit of a hacky way to detmermine if we're inside a gallery picker or not.
    // By looking for the create gallery button in our media frame.
	const isGalleryPicker = Boolean(container.closest(".media-frame").querySelector("#menu-item-gallery"));

	return (
        <Fragment>
            <div class="kadence-blocks-image-picker-contents">
                <div className="kadence-blocks-image-picker-search-container">
                    <SearchForm 
                        query={query}
                        setQuery={setQuery}
                    />
                </div>
                <div className="kadence-blocks-image-picker-scroll-container">
                    { 'undefined' != typeof( dataState.images ) && (
                        <InfiniteScroll
                            className="block-editor-block-patterns-list-wrap"
                            pageStart={0}
                            loadMore={debouncedLoadMore}
                            hasMore={hasMore}
                            loader={<Spinner />}
                            useWindow={false}
                            >
                                <Masonry
                                    breakpointCols={breakpointCols}
                                    className={ `kb-css-masonry kb-core-section-library` }
                                    columnClassName="kb-css-masonry_column"
                                >
                                    { dataState.images.map( ( image, index ) => {
                                        return (
                                            <Result 
                                                result={ image }
                                                setInactive={ false }
                                                index={ index }
                                                currentUserSelectionIndex={ currentUserSelectionIndex }
                                                setCurrentUserSelectionIndex={ setCurrentUserSelectionIndex }
                                            />
                                        );
                                    })}
                                </Masonry>
                        </InfiniteScroll>
                    )}
                    { 'undefined' == typeof( dataState.images ) && (
                        <div>No Results found for this search</div>
                    )}
                </div>
                <div class="kadence-blocks-image-picker-sidebar">
                    <ResultDetails
                        result={ currentSelectedImage }
                    />
                </div>
            </div>

            { ! isGalleryPicker &&
                <style>
                    {
                        `.media-frame-content {
                            bottom: 0;
                        }
                        .media-frame-toolbar {
                            display: none;
                        }`
                    }
                </style>
            }
        </Fragment>
    );
}
