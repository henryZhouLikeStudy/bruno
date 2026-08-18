import React, { useMemo } from 'react';
import toast from 'react-hot-toast';
import Modal from 'components/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { IconAlertCircle } from '@tabler/icons';
import { removeCollection } from 'providers/ReduxStore/slices/collections/actions';
import { findCollectionByUid, flattenItems, isItemARequest, hasRequestChanges } from 'utils/collections/index';
import filter from 'lodash/filter';
import ConfirmCollectionCloseDrafts from './ConfirmCollectionCloseDrafts';
import StyledWrapper from './StyledWrapper';
import Portal from 'ui/Portal';

const RemoveCollection = ({ onClose, collectionUid }) => {
  const dispatch = useDispatch();
  const collection = useSelector((state) => findCollectionByUid(state.collections.collections, collectionUid));

  // Detect drafts in the collection
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
    dispatch(removeCollection(collection.uid))
      .then(() => {
        toast.success('集合已从工作区移除');
        onClose();
      })
      .catch(() => toast.error('移除集合时发生错误'));
  };

  if (!collection) {
    return <div>未找到集合</div>;
  }

  // If there are drafts, show the draft confirmation modal
  if (drafts.length > 0) {
    return <ConfirmCollectionCloseDrafts onClose={onClose} collection={collection} collectionUid={collectionUid} />;
  }

  // Otherwise, show the standard remove confirmation modal
  return (
    <StyledWrapper>
      <Portal>
        <Modal
          size="sm"
          title="移除集合"
          confirmText="移除"
          confirmButtonColor="danger"
          handleConfirm={onConfirm}
          handleCancel={onClose}
        >
          <p className="mb-4">确定要在 Bruno 中关闭以下集合吗？</p>
          <div className="collection-info-card">
            <div className="collection-name">{collection.name}</div>
            <div className="collection-path">{collection.pathname}</div>
          </div>
          <p className="mt-4 text-muted text-sm">
            它仍可在上述文件系统位置找到，稍后也可以重新打开。
          </p>
        </Modal>
      </Portal>
    </StyledWrapper>
  );
};

export default RemoveCollection;
