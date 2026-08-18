import React from 'react';
import { IconAlertTriangle } from '@tabler/icons';
import Modal from 'components/Modal';
import Button from 'ui/Button';
import Portal from 'ui/Portal';

const ConfirmCollectionClose = ({ collection, onCancel, onCloseWithoutSave, onSaveAndClose }) => {
  return (
    <Portal>
      <Modal
        size="md"
        title="未保存的更改"
        confirmText="保存并关闭"
        cancelText="不保存直接关闭"
        disableEscapeKey={true}
        disableCloseOnOutsideClick={true}
        closeModalFadeTimeout={150}
        handleCancel={onCancel}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        hideFooter={true}
      >
        <div className="flex items-center font-normal">
          <IconAlertTriangle size={32} strokeWidth={1.5} className="text-yellow-600" />
          <h1 className="ml-2 text-lg font-medium">请稍候…</h1>
        </div>
        <div className="font-normal mt-4">
          集合 <span className="font-medium">{collection.name}</span> 的设置存在未保存的更改。
        </div>

        <div className="flex justify-between mt-6">
          <div>
            <Button color="danger" onClick={onCloseWithoutSave}>
              不保存
            </Button>
          </div>
          <div className="flex gap-2">
            <Button color="secondary" variant="ghost" onClick={onCancel}>
              取消
            </Button>
            <Button onClick={onSaveAndClose}>
              保存
            </Button>
          </div>
        </div>
      </Modal>
    </Portal>
  );
};

export default ConfirmCollectionClose;
