/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { TokenField } from '../molecules/TokenField';
import { AddPrimitiveDialog } from './AddPrimitiveDialog';
import { DeletePrimitiveDialog } from './DeletePrimitiveDialog';
import { RenamePrimitiveDialog } from './RenamePrimitiveDialog';
import './token-group.scss';

/**
 * A schema group of editable tokens.
 *
 * When the group contains user-created tokens (`token.userCreated === true`),
 * each row renders inline rename and delete controls. A toolbar button lets the
 * user add a new custom color primitive to the group.
 *
 * @since TBD
 *
 * @param {object}   props                      Component props.
 * @param {string}   props.groupName            Display name for the group.
 * @param {object[]} props.tokens               Tokens belonging to this group.
 * @param {Record<string, string>} props.values Resolved values keyed by token id.
 * @param {Record<string, object>} [props.responsive] Authored responsive / clamp shapes keyed by token id.
 * @param {Function} props.onSave               Save handler passed to each field.
 * @param {Function} props.getFieldState        Field state accessor.
 * @param {boolean}  [props.isUserCreatedGroup] Whether this is the Custom Colors group.
 * @param {Function} [props.onCreatePrimitive]  Async create fn from useUserPrimitiveEditor.
 * @param {Function} [props.onDeletePrimitive]  Async delete fn from useUserPrimitiveEditor.
 * @param {Function} [props.onRenamePrimitive]  Async rename fn from useUserPrimitiveEditor.
 * @param {Function} [props.onFetchPreview]     Async preview fn from useUserPrimitiveEditor.
 * @param {Function} [props.onMutationSuccess]  Called after a successful mutation.
 * @return {JSX.Element} Token group section.
 */
export function TokenGroup({
	groupName,
	tokens,
	values,
	responsive,
	onSave,
	getFieldState,
	isUserCreatedGroup = false,
	onCreatePrimitive,
	onDeletePrimitive,
	onRenamePrimitive,
	onFetchPreview,
	onMutationSuccess,
}) {
	const [addOpen, setAddOpen] = useState(false);
	const [deleteToken, setDeleteToken] = useState(null);
	const [renameToken, setRenameToken] = useState(null);

	const showAddButton = isUserCreatedGroup && Boolean(onCreatePrimitive);

	return (
		<section className="kadence-blocks-style-library__token-group">
			{(groupName || showAddButton) && (
				<div className="kadence-blocks-style-library__token-group-header">
					{groupName && <h2 className="kadence-blocks-style-library__token-group-title">{groupName}</h2>}
					{showAddButton && (
						<Button
							variant="secondary"
							size="small"
							onClick={() => setAddOpen(true)}
							className="kadence-blocks-style-library__token-group-add"
						>
							{__('Add Color', 'kadence-blocks')}
						</Button>
					)}
				</div>
			)}

			<div className="kadence-blocks-style-library__token-group-list">
				{tokens.map((token) => (
					<div
						key={token.id}
						className={`kadence-blocks-style-library__token-row${token.userCreated ? ' kadence-blocks-style-library__token-row--user-created' : ''}`}
					>
						<TokenField
							token={token}
							value={values[token.id] ?? ''}
							responsive={responsive?.[token.id]}
							onSave={onSave}
							fieldState={getFieldState(token.id)}
						/>
						{token.userCreated && (
							<div className="kadence-blocks-style-library__token-row-controls">
								{onRenamePrimitive && (
									<Button variant="tertiary" size="small" onClick={() => setRenameToken(token)}>
										{__('Rename', 'kadence-blocks')}
									</Button>
								)}
								{onDeletePrimitive && (
									<Button
										variant="tertiary"
										size="small"
										isDestructive
										onClick={() => setDeleteToken(token)}
									>
										{__('Delete', 'kadence-blocks')}
									</Button>
								)}
							</div>
						)}
					</div>
				))}
			</div>

			{addOpen && onCreatePrimitive && (
				<AddPrimitiveDialog
					onCreate={async (payload) => {
						const result = await onCreatePrimitive(payload);

						if (result.ok) {
							onMutationSuccess?.({ type: 'create', payload });
						}

						return result;
					}}
					onClose={() => setAddOpen(false)}
				/>
			)}

			{deleteToken && onDeletePrimitive && onFetchPreview && (
				<DeletePrimitiveDialog
					token={deleteToken}
					onFetchPreview={onFetchPreview}
					onDelete={onDeletePrimitive}
					onSuccess={(id) => {
						onMutationSuccess?.({ type: 'delete', id });
						setDeleteToken(null);
					}}
					onClose={() => setDeleteToken(null)}
				/>
			)}

			{renameToken && onRenamePrimitive && (
				<RenamePrimitiveDialog
					token={renameToken}
					onRename={onRenamePrimitive}
					onSuccess={(data) => {
						onMutationSuccess?.({ type: 'rename', ...data });
						setRenameToken(null);
					}}
					onClose={() => setRenameToken(null)}
				/>
			)}
		</section>
	);
}
