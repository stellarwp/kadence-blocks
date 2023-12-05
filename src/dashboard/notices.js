/**
 * WordPress dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { SnackbarList, NoticeList } from '@wordpress/components';

export default function Notices() {
	const notices = useSelect(
		( select ) =>
			select( 'core/notices' )
				.getNotices()
				.filter( ( notice ) => notice.type === 'snackbar' ),
		[]
	);
	const defaultNotices = useSelect(
		( select ) =>
			select( 'core/notices' )
				.getNotices()
				.filter( ( notice ) => notice.type === 'default' ),
		[]
	);
	const { removeNotice } = useDispatch( 'core/notices' );
	return (
		<>
			<NoticeList
				className="components-editor-notices__default"
				notices={ defaultNotices }
				onRemove={ removeNotice }
			/>
			<SnackbarList
				className="components-editor-notices__snackbar"
				notices={ notices }
				onRemove={ removeNotice }
			/>
		</>
	);
}
