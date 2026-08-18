import React from 'react';
import toast from 'react-hot-toast';
import Modal from 'components/Modal';
import { useDispatch } from 'react-redux';
import { IconFileCode } from '@tabler/icons';
import { closeApiSpecFile } from 'providers/ReduxStore/slices/apiSpec';

const CloseApiSpec = ({ onClose, apiSpec }) => {
  const dispatch = useDispatch();

  const onConfirm = () => {
    dispatch(closeApiSpecFile({ uid: apiSpec.uid }))
      .then(() => {
        toast.success('API 规范已关闭');
        onClose();
      })
      .catch(() => toast.error('关闭 API 规范时发生错误'));
  };

  return (
    <Modal size="sm" title="关闭 API 规范" confirmText="关闭" handleConfirm={onConfirm} handleCancel={onClose}>
      <div className="flex items-center">
        <IconFileCode size={18} strokeWidth={1.5} />
        <span className="ml-2 mr-4 font-semibold">{apiSpec.name}</span>
      </div>
      <div className="break-words text-xs mt-1">{apiSpec.pathname}</div>
      <div className="mt-4">
        确定要在 Bruno 中关闭 API 规范 <span className="font-semibold">{apiSpec.name}</span> 吗？
      </div>
      <div className="mt-4">
        它仍可在上述文件系统位置找到，稍后也可以重新打开。
      </div>
    </Modal>
  );
};

export default CloseApiSpec;
