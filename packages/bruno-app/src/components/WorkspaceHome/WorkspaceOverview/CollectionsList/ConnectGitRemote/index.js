import React, { useRef, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import Modal from 'components/Modal';
import { isGitRepositoryUrl } from 'utils/git';
import { connectCollectionToGit } from 'providers/ReduxStore/slices/workspaces/actions';

const ConnectGitRemote = ({ collectionPath, collectionName, initialUrl = '', onClose }) => {
  const dispatch = useDispatch();
  const inputRef = useRef();
  const activeWorkspaceUid = useSelector((state) => state.workspaces.activeWorkspaceUid);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      remoteUrl: initialUrl
    },
    validationSchema: Yup.object({
      remoteUrl: Yup.string()
        .trim()
        .required('Git 远程 URL 为必填项')
        .test('is-git-url', '请输入有效的 Git URL', (value) => isGitRepositoryUrl(value))
    }),
    onSubmit: (values) => {
      dispatch(
        connectCollectionToGit({
          workspaceUid: activeWorkspaceUid,
          collectionPath,
          remoteUrl: values.remoteUrl.trim()
        })
      )
        .then(() => {
          toast.success('Git 远程连接成功');
          onClose();
        })
        .catch(() => {
          // toast already handled in the thunk
        });
    }
  });

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const title = initialUrl ? '更新 Git 远程' : '连接 Git';
  const confirmText = initialUrl ? '更新' : '连接';

  return (
    <Modal size="md" title={title} confirmText={confirmText} handleConfirm={() => formik.handleSubmit()} handleCancel={onClose}>
      <form className="bruno-form" onSubmit={(e) => e.preventDefault()}>
        {collectionName ? (
          <div className="text-sm text-muted mb-3 leading-relaxed break-words space-y-2">
            <p className="m-0">
              正在将{' '}
              <span className="font-medium text-inherit break-words" title={collectionName}>
                {collectionName}
              </span>{' '}
              连接到 Git 远程仓库。
            </p>
            <p className="m-0">
              URL 仅保存在 <span className="font-mono">workspace.yml</span> 中，磁盘上的集合文件不会被修改。
            </p>
          </div>
        ) : null}
        <div>
          <label htmlFor="remoteUrl" className="block font-medium">
            Git 远程 URL
          </label>
          <input
            id="remoteUrl"
            type="text"
            name="remoteUrl"
            ref={inputRef}
            className="block textbox mt-2 w-full"
            placeholder="https://github.com/owner/repo"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            onChange={formik.handleChange}
            value={formik.values.remoteUrl || ''}
          />
          {formik.touched.remoteUrl && formik.errors.remoteUrl ? (
            <div className="text-red-500">{formik.errors.remoteUrl}</div>
          ) : null}
        </div>
      </form>
    </Modal>
  );
};

export default ConnectGitRemote;
