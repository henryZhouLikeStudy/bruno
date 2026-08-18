import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import Modal from 'components/Modal';
import { disconnectCollectionFromGit } from 'providers/ReduxStore/slices/workspaces/actions';

const RemoveGitRemote = ({ collectionPath, collectionName, remoteUrl, onClose }) => {
  const dispatch = useDispatch();
  const activeWorkspaceUid = useSelector((state) => state.workspaces.activeWorkspaceUid);

  const handleConfirm = () => {
    dispatch(
      disconnectCollectionFromGit({
        workspaceUid: activeWorkspaceUid,
        collectionPath
      })
    )
      .then(() => {
        toast.success('Git 远程已移除');
        onClose();
      })
      .catch(() => {
        // toast already handled in the thunk
      });
  };

  return (
    <Modal
      size="md"
      title="移除 Git 远程"
      confirmText="移除"
      confirmButtonColor="primary"
      handleConfirm={handleConfirm}
      handleCancel={onClose}
    >
      <div className="text-sm leading-relaxed break-words">
        <p className="m-0">
          断开{' '}
          <span className="font-medium break-words" title={collectionName}>
            {collectionName}
          </span>{' '}
          与其 Git 远程的连接？
        </p>
        {remoteUrl ? (
          <p className="mt-2 mb-0 font-mono text-xs text-muted break-all">{remoteUrl}</p>
        ) : null}
        <p className="mt-3 mb-0 text-xs text-muted">
          这只会从 <span className="font-mono">workspace.yml</span> 中移除远程 URL，本地集合文件和任何 <span className="font-mono">.git</span> 文件夹保持不变。
        </p>
      </div>
    </Modal>
  );
};

export default RemoveGitRemote;
