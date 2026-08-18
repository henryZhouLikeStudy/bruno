import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Modal from 'components/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { IconAlertTriangle } from '@tabler/icons';
import { removeCollectionFromWorkspaceAction } from 'providers/ReduxStore/slices/workspaces/actions';
import { findCollectionByUid } from 'utils/collections/index';
import StyledWrapper from './StyledWrapper';

const DeleteCollection = ({ onClose, collectionUid, workspaceUid }) => {
  const dispatch = useDispatch();
  const [confirmText, setConfirmText] = useState('');
  const collection = useSelector((state) => findCollectionByUid(state.collections.collections, collectionUid));
  const workspace = useSelector((state) => state.workspaces.workspaces.find((w) => w.uid === workspaceUid));

  const isConfirmed = confirmText.toLowerCase() === 'delete';

  const onConfirm = async () => {
    if (!collection || !workspace) {
      toast.error('未找到集合或工作区');
      onClose();
      return;
    }

    try {
      await dispatch(removeCollectionFromWorkspaceAction(workspace.uid, collection.pathname, { deleteFiles: true }));
      toast.success(`已删除集合 "${collection.name}"`);
      onClose();
    } catch (error) {
      console.error('Error deleting collection:', error);
      toast.error(error.message || '删除集合时发生错误');
    }
  };

  if (!collection) {
    return null;
  }

  return (
    <StyledWrapper>
      <Modal
        size="sm"
        title="删除集合"
        confirmText="删除"
        cancelText="取消"
        confirmButtonColor="danger"
        confirmDisabled={!isConfirmed}
        handleConfirm={onConfirm}
        handleCancel={onClose}
      >
        <p className="modal-description">
          确定要永久删除 <strong>"{collection.name}"</strong> 吗？
        </p>
        <div className="collection-info-card">
          <div className="collection-name">{collection.name}</div>
          <div className="collection-path">{collection.pathname}</div>
        </div>
        <p className="warning-text">
          此操作无法撤销。集合文件将从磁盘永久删除。
        </p>
        <div className="delete-confirmation">
          <label htmlFor="delete-confirm-input">
            输入 <span className="delete-keyword">delete</span> 以确认
          </label>
          <input
            id="delete-confirm-input"
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="delete"
            autoComplete="off"
            autoFocus
          />
        </div>
      </Modal>
    </StyledWrapper>
  );
};

export default DeleteCollection;
