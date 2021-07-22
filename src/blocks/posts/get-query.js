export default function getQuery( blockAttributes, queryType ) {
	const {
		postType,
		taxType,
		offsetQuery,
		postTax,
		excludeTax,
		allowSticky,
		categories,
		tags,
		postsToShow,
		orderBy,
		order,
		postIds,
	} = blockAttributes;
	let theCurrentID = '';
	if ( wp.data.select( 'core/editor' ) ) {
		const { getCurrentPostId } = wp.data.select( 'core/editor' );
		theCurrentID = getCurrentPostId();
	}
	const query = {
		query: queryType,
		per_page: postsToShow,
		type: postType,
		offset: ( offsetQuery ? offsetQuery : 0 ),
		allow_sticky: ( allowSticky ? true : false ),
		exclude: ( excludeTax ? excludeTax : 'include' ),
		post_tax: ( postTax ? true : false ),
		tax_type: ( taxType ? taxType : '' ),
		post_id: theCurrentID
	};
	if ( categories && categories.length ) {
		const ids = categories.map( ( { value } ) => value );
		query.category = ids.join( ',' );
	}
	if ( tags && tags.length ) {
		const ids = tags.map( ( { value } ) => value );
		query.tags = ids.join( ',' );
	}
	if ( orderBy ) {
		query.order_by = orderBy;
	}
	if ( queryType === 'query' && order ) {
		query.order = order;
	}
	// if ( orderby ) {
	// 	if ( 'price_desc' === orderby ) {
	// 		query.orderby = 'price';
	// 		query.order = 'desc';
	// 	} else if ( 'price_asc' === orderby ) {
	// 		query.orderby = 'price';
	// 		query.order = 'asc';
	// 	} else if ( 'title' === orderby ) {
	// 		query.orderby = 'title';
	// 		query.order = 'asc';
	// 	} else if ( 'menu_order' === orderby ) {
	// 		query.orderby = 'menu_order';
	// 		query.order = 'asc';
	// 	} else {
	// 		query.orderby = orderby;
	// 	}
	// }

	// if ( attributes && attributes.length > 0 ) {
	// 	query.attribute_term = attributes.map( ( { id } ) => id ).join( ',' );
	// 	query.attribute = attributes[ 0 ].attr_slug;

	// 	if ( attrOperator ) {
	// 		query.attribute_operator = 'all' === attrOperator ? 'and' : 'in';
	// 	}
	// }

	// Toggle query parameters depending on block type.
	switch ( queryType ) {
		case 'individual':
			if ( postIds && postIds.length ) {
				query.include = postIds;
				query.per_page = postIds.length;
			}
			break;
	}

	return query;
}
