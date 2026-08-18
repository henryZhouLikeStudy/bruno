import React from 'react';
import { IconAlertTriangle } from '@tabler/icons';
import Modal from 'components/Modal';
import Portal from 'components/Portal';
import Button from 'ui/Button';

const ConfirmCloseEnvironment = ({ onCancel, onCloseWithoutSave, onSaveAndClose, isGlobal, isDotEnv }) => {
  let settingsLabel = '集合环境设置';
  if (isDotEnv) {
    settingsLabel = '.env 文件';
  } else if (isGlobal) {
    settingsLabel = '全局环境设置';
  }

  return (
    <Portal>
      <Modal
        size="md"
        title="未保存的更改"
        disableEscapeKey={true}
        disableCloseOnOutsideClick={true}
        closeModalFadeTimeout={150}
        handleCancel={onCancel}
        hideFooter={true}
      >
        <div className="flex items-center font-normal">
          <IconAlertTriangle size={32} strokeWidth={1.5} className="text-yellow-600" />
          <h1 className="ml-2 text-lg font-medium">请稍候…</h1>
        </div>
        <div className="font-normal mt-4">
          您在{settingsLabel}中有未保存的更改。
        </div>

        <div className="flex justify-between mt-6">
          <div>
            <Button color="danger" onClick={onCloseWithoutSave} data-testid="env-unsaved-close-without-save">
              不保存
            </Button>
          </div>
          <div className="flex gap-2">
            <Button color="secondary" variant="ghost" onClick={onCancel} data-testid="env-unsaved-cancel">
              取消
            </Button>
            <Button onClick={onSaveAndClose} data-testid="env-unsaved-save-and-close">
              保存
            </Button>
          </div>
        </div>
      </Modal>
    </Portal>
  );
};

export default ConfirmCloseEnvironment;
