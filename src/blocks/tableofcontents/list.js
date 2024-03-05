const ENTRY_CLASS_NAME = 'kb-table-of-contents__entry';

export default function TableOfContentsList({ nestedHeadingList, wrapList = false, listTag = 'ul' }) {
	if (nestedHeadingList) {
		const ListTag = listTag;
		const childNodes = nestedHeadingList.map((childNode, index) => {
			const { anchor, content } = childNode.heading;

			const entry = anchor ? (
				<a className={ENTRY_CLASS_NAME} href={anchor}>
					{content}
				</a>
			) : (
				<a className={ENTRY_CLASS_NAME} href="#placeholder">
					{content}
				</a>
			);

			return (
				<li key={index}>
					{entry}
					{childNode.children ? (
						<TableOfContentsList nestedHeadingList={childNode.children} wrapList={true} listTag={listTag} />
					) : null}
				</li>
			);
		});

		return wrapList ? <ListTag className="kb-table-of-contents-list-sub">{childNodes}</ListTag> : childNodes;
	}
}
