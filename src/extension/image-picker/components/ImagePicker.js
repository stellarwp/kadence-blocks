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
import { useSelect, useDispatch } from '@wordpress/data';
import { debounce, isEmpty } from 'lodash';

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
    // const [dataState, setDataState] = useState( props.data.data );
    // const [currentUserSelectionIndex, setCurrentUserSelectionIndex] = useState( 0 );
    const [isLoading, setIsLoading] = useState( false );

    const { imagePickerQuery, imagePickerSelection, imagePickerResults } = useSelect(
        ( select ) => {
            const imagePickerQuery = typeof select( 'kadenceblocks/data' ).getImagePickerQuery === "function" ? select( 'kadenceblocks/data' ).getImagePickerQuery() : '';
            const imagePickerSelection = typeof select( 'kadenceblocks/data' ).getImagePickerSelection === "function" ? select( 'kadenceblocks/data' ).getImagePickerSelection() : '';
            const imagePickerResults = typeof select( 'kadenceblocks/data' ).getImagePickerResults === "function" ? select( 'kadenceblocks/data' ).getImagePickerResults() : '';
            return {
                imagePickerQuery: imagePickerQuery,
                imagePickerSelection: imagePickerSelection,
                imagePickerResults: imagePickerResults,
            };
        },
        []
    );
	const { setImagePickerQuery } = useDispatch( 'kadenceblocks/data' );
	const { setImagePickerSelection } = useDispatch( 'kadenceblocks/data' );
	const { setImagePickerResults } = useDispatch( 'kadenceblocks/data' );


    console.log(1, imagePickerQuery, imagePickerSelection, imagePickerResults);

    const totalImages = 'undefined' != typeof( imagePickerResults.total ) ? imagePickerResults.total : 0;
    const page = 'undefined' != typeof( imagePickerResults.page ) ? imagePickerResults.page : 1;
    const hasMore = 'undefined' != typeof( imagePickerResults.images ) ? imagePickerResults.images.length < totalImages : false;

    const currentSelectedImage = 'undefined' != typeof( imagePickerResults.images ) ? ( ! isNaN( imagePickerSelection ) ? imagePickerResults.images[imagePickerSelection] : imagePickerResults.images[0] ) : {};

	useEffect( () => {
        if ( isEmpty( imagePickerResults ) || isEmpty( imagePickerQuery ) ) {
            setImagePickerQuery( '' );
            setImagePickerSelection( 0 );
            setImagePickerResults( props.data.data );
        }
	}, [] );

	useEffect( () => {
        debouncedHandleSearch( imagePickerQuery );
	}, [ imagePickerQuery ] );

	/**
	 * Search submit handler.
	 *
	 * @param string query The query to search for.
	 */
	function handleSearch( query ) {
		if ( query && ! isLoading ) {
            setImagePickerSelection( 0 );
			getImageDataSearch( provider, imagePickerResults, query, setImagePickerResults, setIsLoading );
		}
	}

    const debouncedHandleSearch = useCallback( debounce( handleSearch, 500), [imagePickerResults, provider] );

	const loadMore = () => {
		if ( hasMore && ! isLoading ) {
			getImageDataLoadMore( provider, imagePickerResults, imagePickerQuery, setImagePickerResults, setIsLoading );
		} else if ( ! hasMore ) {
            setIsLoading( false );
        }
	};

    const debouncedLoadMore = useCallback( debounce( loadMore, 500), [imagePickerResults, imagePickerQuery, provider] );

    const breakpointCols = {
		default: 4,
		1900: 4,
		1600: 4,
		1200: 3,
		500: 2,
	}

    // A bit of a hacky way to detmermine if we're inside a gallery picker or not.
    // By looking for the create gallery button in our media frame.
    const mediaFrame = container.closest(".media-frame");
	const isGalleryPicker = 'undefined' != typeof( mediaFrame ) && mediaFrame ? Boolean(mediaFrame.querySelector("#menu-item-gallery")) : false;

	return (
        <Fragment>
            <div class="kadence-blocks-image-picker-contents">
                <div className="kadence-blocks-image-picker-search-container">
                    <SearchForm 
                        query={imagePickerQuery}
                        setQuery={setImagePickerQuery}
                    />
                </div>
                <div className="kadence-blocks-image-picker-scroll-container">
                    { 'undefined' != typeof( imagePickerResults.images ) && (
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
                                    { imagePickerResults.images.map( ( image, index ) => {
                                        return (
                                            <Result 
                                                result={ image }
                                                setInactive={ false }
                                                index={ index }
                                                currentUserSelectionIndex={ imagePickerSelection }
                                                setCurrentUserSelectionIndex={ setImagePickerSelection }
                                            />
                                        );
                                    })}
                                </Masonry>
                        </InfiniteScroll>
                    )}
                    { 'undefined' == typeof( imagePickerResults.images ) && (
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
