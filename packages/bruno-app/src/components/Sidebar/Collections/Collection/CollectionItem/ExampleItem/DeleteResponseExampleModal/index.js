import React from 'react';
import Modal from 'components/Modal';
import Portal from 'components/Portal';
import { useDispatch } from 'react-redux';
import { deleteResponseExample } from 'providers/ReduxStore/slices/collections';
import { saveRequest, closeTabs } from 'providers/ReduxStore/slices/collections/actions';

const DeleteResponseExampleModal = ({ onClose, example, item, collection }) => {
  const dispatch = useDispatch();

  const onConfirm = (e) => {
    e.stopPropagation();
    dispatch(closeTabs({ tabUids: [example.uid] }));
    dispatch(deleteResponseExample({
      itemUid: item.uid,
      collectionUid: collection.uid,
      exampleUid: example.uid
    }));
    dispatch(saveRequest(item.uid, collection.uid, true))
      .then(() => {
        onClose();
      });
  };

  return (
    <Portal>
      <Modal
        size="sm"
        title="删除示例"
        confirmText="删除"
        handleConfirm={onConfirm}
        handleCancel={onClose}
        confirmButtonColor="danger"
      >
        确定要删除示例 <span className="font-medium">{example.name}</span> 吗？
      </Modal>
    </Portal>
  );
};

export default DeleteResponseExampleModal;
