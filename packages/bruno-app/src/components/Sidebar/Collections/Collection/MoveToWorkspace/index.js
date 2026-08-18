import React, { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import Modal from 'components/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { moveCollectionToWorkspace } from 'providers/ReduxStore/slices/collections/actions';
import { findCollectionByUid, flattenItems, isItemARequest, hasRequestChanges } from 'utils/collections/index';
import filter from 'lodash/filter';
import brunoPath from 'utils/common/path';
import ConfirmMoveDrafts from './ConfirmMoveDrafts';
import StyledWrapper from './StyledWrapper';

const MoveToWorkspace = ({ onClose, collectionUid }) => {
  const dispatch = useDispatch();
  const collection = useSelector((state) => findCollectionByUid(state.collections.collections, collectionUid));
  const activeWorkspace = useSelector((state) =>
    state.workspaces.workspaces.find((w) => w.uid === state.workspaces.activeWorkspaceUid)
  );
  const [isMoving, setIsMoving] = useState(false);

  // Detect unsaved drafts in the collection
  const drafts = useMemo(() => {
    if (!collection) return [];
    const items = flattenItems(collection.items);
    return filter(items, (item) => isItemARequest(item) && hasRequestChanges(item));
  }, [collection]);

  const onConfirm = () => {
    if (!collection) {
      toast.error('未找到集合');
      onClose();
      return;
    }
    if (isMoving) {
      return;
    }
    setIsMoving(true);
    dispatch(moveCollectionToWorkspace(collection.uid))
      .then(() => {
        toast.success('集合已移入工作区');
        onClose();
      })
      .catch((err) => {
        toast.error(err?.message || '移动集合时发生错误');
        setIsMoving(false);
      });
  };

  if (!collection) {
    return <div>未找到集合</div>;
  }

  if (!activeWorkspace?.pathname) {
    return null;
  }

  // Save or discard unsaved drafts before moving
  if (drafts.length > 0) {
    return <ConfirmMoveDrafts onClose={onClose} collection={collection} collectionUid={collectionUid} />;
  }

  const targetLocation = brunoPath.join(activeWorkspace.pathname, 'collections');

  return (
    <StyledWrapper>
      <Modal
        size="sm"
        title="移入工作区"
        confirmText={isMoving ? '移动中...' : '移动'}
        confirmDisabled={isMoving}
        handleConfirm={onConfirm}
        handleCancel={onClose}
      >
        <p className="mb-4">
          这会将以下集合的文件移动到 {activeWorkspace?.name} 工作区。
        </p>
        <div className="collection-info-card">
          <div className="collection-name">{collection.name}</div>
          <div className="collection-path">{collection.pathname}</div>
        </div>
        <div className="mt-3 collection-info-card">
          <div className="collection-label">目标位置</div>
          <div className="collection-path">{targetLocation}</div>
        </div>
        <p className="mt-4 text-muted text-sm">
          集合将从新位置重新加载，因此所有打开的请求标签页都将关闭。
        </p>
      </Modal>
    </StyledWrapper>
  );
};

export default MoveToWorkspace;
