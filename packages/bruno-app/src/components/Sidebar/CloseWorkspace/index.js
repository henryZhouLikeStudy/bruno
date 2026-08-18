import React from 'react';
import toast from 'react-hot-toast';
import Modal from 'components/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { IconFolder } from '@tabler/icons';
import { closeWorkspaceAction } from 'providers/ReduxStore/slices/workspaces/actions';

const CloseWorkspace = ({ workspaceUid, onClose }) => {
  const dispatch = useDispatch();
  const { workspaces } = useSelector((state) => state.workspaces);
  const workspace = workspaces.find((w) => w.uid === workspaceUid);

  const onConfirm = async () => {
    try {
      if (!workspace) {
        toast.error('未找到工作区');
        onClose();
        return;
      }
      if (workspace.type === 'default') {
        toast.error('无法关闭默认工作区');
        onClose();
        return;
      }

      await dispatch(closeWorkspaceAction(workspace.uid));
      toast.success('工作区已关闭');
      onClose();
    } catch (error) {
      console.error('Error closing workspace:', error);
      toast.error('关闭工作区时发生错误');
    }
  };

  return (
    <Modal
      size="sm"
      title="关闭工作区"
      confirmText="关闭"
      handleConfirm={onConfirm}
      handleCancel={onClose}
    >
      <div className="flex items-center">
        <IconFolder size={18} strokeWidth={1.5} />
        <span className="ml-2 mr-4 font-semibold">{workspace?.name}</span>
      </div>
      {workspace?.pathname && (
        <div className="break-words text-xs mt-1">{workspace.pathname}</div>
      )}
      <div className="mt-4">
        确定要关闭工作区 <span className="font-semibold">{workspace?.name}</span> 吗？
      </div>
      <div className="mt-4">
        它仍可在上述文件系统位置找到，稍后也可以重新打开。
      </div>
    </Modal>
  );
};

export default CloseWorkspace;
