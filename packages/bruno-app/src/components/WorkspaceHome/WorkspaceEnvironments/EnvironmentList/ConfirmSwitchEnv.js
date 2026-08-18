import React from 'react';
import { IconAlertTriangle } from '@tabler/icons';
import Modal from 'components/Modal';
import { createPortal } from 'react-dom';
import Button from 'ui/Button';
import { useTheme } from 'providers/Theme';

const ConfirmSwitchEnv = ({ onCancel }) => {
  const { theme } = useTheme();
  const warningColor = theme.status.warning.text;

  const modalContent = (
    <Modal
      size="md"
      title="未保存的更改"
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
        <IconAlertTriangle color={warningColor} size={32} strokeWidth={1.5} />
        <h1 className="ml-2 text-lg font-semibold">请稍候…</h1>
      </div>
      <div className="font-normal mt-4">当前环境有未保存的更改。</div>

      <div className="flex justify-end mt-6">
        <div>
          <Button color="warning" onClick={onCancel}>
            关闭
          </Button>
        </div>
      </div>
    </Modal>
  );

  return createPortal(modalContent, document.body);
};

export default ConfirmSwitchEnv;
