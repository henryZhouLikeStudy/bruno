import React, { useRef, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { IconArrowBackUp, IconEdit } from '@tabler/icons';
import Modal from 'components/Modal';
import Help from 'components/Help';
import PathDisplay from 'components/PathDisplay/index';
import { createWorkspaceAction } from 'providers/ReduxStore/slices/workspaces/actions';
import { browseDirectory } from 'providers/ReduxStore/slices/collections/actions';
import { multiLineMsg } from 'utils/common/index';
import { formatIpcError } from 'utils/common/error';
import { sanitizeName, validateName, validateNameError } from 'utils/common/regex';
import get from 'lodash/get';

const CreateWorkspace = ({ onClose }) => {
  const inputRef = useRef();
  const dispatch = useDispatch();
  const workspaces = useSelector((state) => state.workspaces.workspaces);
  const preferences = useSelector((state) => state.app.preferences);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const defaultLocation = get(preferences, 'general.defaultLocation', '');

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      workspaceName: '',
      workspaceFolderName: '',
      workspaceLocation: defaultLocation
    },
    validationSchema: Yup.object({
      workspaceName: Yup.string()
        .trim()
        .min(1, '工作区名称不能为空')
        .max(255, '最多 255 个字符')
        .required('工作区名称是必填项')
        .test('unique-name', '已存在同名工作区', function (value) {
          if (!value) return true;

          return !workspaces.some((w) =>
            !w.isCreating && w.name && w.name.toLowerCase() === value.toLowerCase());
        }),
      workspaceFolderName: Yup.string()
        .min(1, '至少需要 1 个字符')
        .max(255, '最多 255 个字符')
        .test('is-valid-folder-name', function (value) {
          const isValid = validateName(value);
          return isValid ? true : this.createError({ message: validateNameError(value) });
        })
        .required('文件夹名称是必填项'),
      workspaceLocation: Yup.string().min(1, '位置是必填项').required('位置是必填项')
    }),
    onSubmit: async (values) => {
      if (isSubmitting) return;

      try {
        setIsSubmitting(true);

        await dispatch(createWorkspaceAction(values.workspaceName.trim(), values.workspaceFolderName, values.workspaceLocation));
        toast.success('工作区创建成功！');
        onClose();
      } catch (error) {
        toast.error(multiLineMsg('创建工作区时发生错误', formatIpcError(error)));
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  const browse = () => {
    dispatch(browseDirectory())
      .then((dirPath) => {
        if (typeof dirPath === 'string') {
          formik.setFieldValue('workspaceLocation', dirPath);
        }
      })
      .catch((error) => {
        formik.setFieldValue('workspaceLocation', '');
        console.error(error);
      });
  };

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  return (
    <Modal
      size="md"
      title="创建工作区"
      description="为你的新工作区命名，选择类型后即可开始。"
      confirmText={isSubmitting ? '创建中...' : '创建工作区'}
      handleConfirm={formik.handleSubmit}
      handleCancel={onClose}
      style="new"
      confirmDisabled={isSubmitting}
    >
      <div>
        <form className="bruno-form" onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label htmlFor="workspaceName" className="block font-semibold mb-2">
              名称
            </label>
            <input
              id="workspace-name"
              type="text"
              name="workspaceName"
              ref={inputRef}
              className="block textbox w-full"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              onChange={(e) => {
                const workspaceName = e.target.value;
                if (!isEditing) {
                  formik.setValues((values) => ({
                    ...values,
                    workspaceName,
                    workspaceFolderName: sanitizeName(workspaceName)
                  }));
                  return;
                }

                formik.handleChange(e);
              }}
              value={formik.values.workspaceName || ''}
            />
            {formik.touched.workspaceName && formik.errors.workspaceName ? (
              <div className="text-red-500 text-sm mt-1">{formik.errors.workspaceName}</div>
            ) : null}
          </div>

          {formik.values.workspaceName?.trim()?.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="workspaceFolderName" className="flex items-center font-semibold">
                  文件夹名称
                  <Help width="300">
                    <p>
                      用于存储工作区的文件夹名称。
                    </p>
                    <p className="mt-2">
                      你可以选择与工作区名称不同的文件夹名称，或符合文件系统规则的名称。
                    </p>
                  </Help>
                </label>
                {isEditing ? (
                  <IconArrowBackUp
                    className="cursor-pointer opacity-50 hover:opacity-80"
                    size={16}
                    strokeWidth={1.5}
                    onClick={() => setIsEditing(false)}
                  />
                ) : (
                  <IconEdit
                    className="cursor-pointer opacity-50 hover:opacity-80"
                    size={16}
                    strokeWidth={1.5}
                    onClick={() => setIsEditing(true)}
                  />
                )}
              </div>
              {isEditing ? (
                <input
                  id="workspace-folder-name"
                  type="text"
                  name="workspaceFolderName"
                  className="block textbox w-full"
                  onChange={formik.handleChange}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  value={formik.values.workspaceFolderName || ''}
                />
              ) : (
                <PathDisplay baseName={formik.values.workspaceFolderName} />
              )}
              {formik.touched.workspaceFolderName && formik.errors.workspaceFolderName ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.workspaceFolderName}</div>
              ) : null}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="workspaceLocation" className="font-semibold mb-2 flex items-center">
              位置
              <Help>
                <p>
                  Bruno 将工作区存储在你电脑的文件系统中。
                </p>
                <p className="mt-2">
                  选择你要存储该工作区的位置。
                </p>
              </Help>
            </label>
            <input
              id="workspace-location"
              type="text"
              name="workspaceLocation"
              readOnly={true}
              className="block textbox mt-2 w-full cursor-pointer"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              value={formik.values.workspaceLocation || ''}
              onClick={browse}
            />
            {formik.touched.workspaceLocation && formik.errors.workspaceLocation ? (
              <div className="text-red-500 text-sm mt-1">{formik.errors.workspaceLocation}</div>
            ) : null}
            <div className="mt-1">
              <span
                className="text-link cursor-pointer hover:underline"
                onClick={browse}
              >
                浏览
              </span>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CreateWorkspace;
