import React, { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import path from 'utils/common/path';
import { browseDirectory } from 'providers/ReduxStore/slices/collections/actions';
import { cloneCollection } from 'providers/ReduxStore/slices/collections/actions';
import toast from 'react-hot-toast';
import Modal from 'components/Modal';
import { sanitizeName, validateName, validateNameError } from 'utils/common/regex';
import Help from 'components/Help';
import PathDisplay from 'components/PathDisplay';
import { useState } from 'react';
import { IconArrowBackUp, IconEdit } from '@tabler/icons';
import { findCollectionByUid } from 'utils/collections/index';
import get from 'lodash/get';

const CloneCollection = ({ onClose, collectionUid }) => {
  const inputRef = useRef();
  const dispatch = useDispatch();
  const [isEditing, toggleEditing] = useState(false);
  const collection = useSelector((state) => findCollectionByUid(state.collections.collections, collectionUid));
  const preferences = useSelector((state) => state.app.preferences);
  const workspaces = useSelector((state) => state.workspaces?.workspaces || []);
  const workspaceUid = useSelector((state) => state.workspaces?.activeWorkspaceUid);
  const activeWorkspace = workspaces.find((w) => w.uid === workspaceUid);
  const isDefaultWorkspace = activeWorkspace?.type === 'default';

  const defaultLocation = isDefaultWorkspace
    ? get(preferences, 'general.defaultLocation', '')
    : (activeWorkspace?.pathname ? path.join(activeWorkspace.pathname, 'collections') : '');
  const { name } = collection;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      collectionName: `${name} 副本`,
      collectionFolderName: `${sanitizeName(name)} 副本`,
      collectionLocation: defaultLocation
    },
    validationSchema: Yup.object({
      collectionName: Yup.string()
        .min(1, '至少需要 1 个字符')
        .max(255, '最多 255 个字符')
        .required('集合名称为必填项'),
      collectionFolderName: Yup.string()
        .min(1, '至少需要 1 个字符')
        .max(255, '最多 255 个字符')
        .test('is-valid-collection-name', function (value) {
          const isValid = validateName(value);
          return isValid ? true : this.createError({ message: validateNameError(value) });
        })
        .required('文件夹名称为必填项'),
      collectionLocation: Yup.string().min(1, '位置不能为空').required('位置为必填项')
    }),
    onSubmit: (values) => {
      dispatch(
        cloneCollection(
          values.collectionName,
          values.collectionFolderName,
          values.collectionLocation,
          collection?.pathname
        )
      )
        .then(() => {
          toast.success('集合已创建！');
          onClose();
        })
        .catch((e) => toast.error('创建集合时发生错误 - ' + e));
    }
  });

  const browse = () => {
    dispatch(browseDirectory())
      .then((dirPath) => {
        // When the user closes the dialog without selecting anything dirPath will be false
        if (typeof dirPath === 'string') {
          formik.setFieldValue('collectionLocation', dirPath);
        }
      })
      .catch((error) => {
        formik.setFieldValue('collectionLocation', '');
        console.error(error);
      });
  };

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const onSubmit = () => formik.handleSubmit();

  return (
    <Modal size="md" title="克隆集合" confirmText="创建" handleConfirm={onSubmit} handleCancel={onClose}>
      <form className="bruno-form" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor="collection-name" className="flex items-center font-medium">
            名称
          </label>
          <input
            id="collection-name"
            type="text"
            name="collectionName"
            ref={inputRef}
            className="block textbox mt-2 w-full"
            onChange={(e) => {
              formik.handleChange(e);
              !isEditing && formik.setFieldValue('collectionFolderName', sanitizeName(e.target.value));
            }}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            value={formik.values.collectionName || ''}
          />
          {formik.touched.collectionName && formik.errors.collectionName ? (
            <div className="text-red-500">{formik.errors.collectionName}</div>
          ) : null}

          <label htmlFor="collection-location" className="block font-medium mt-3">
            位置
          </label>
          <input
            id="collection-location"
            type="text"
            name="collectionLocation"
            readOnly={true}
            className="block textbox mt-2 w-full cursor-pointer"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            value={formik.values.collectionLocation || ''}
            onClick={browse}
          />
          {formik.touched.collectionLocation && formik.errors.collectionLocation ? (
            <div className="text-red-500">{formik.errors.collectionLocation}</div>
          ) : null}
          <div className="mt-1">
            <span
              className="text-link cursor-pointer hover:underline"
              onClick={browse}
            >
              浏览
            </span>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between">
              <label htmlFor="filename" className="flex items-center font-medium">
                文件夹名称
                <Help width="300">
                  <p>
                    用于存储集合的文件夹名称。
                  </p>
                  <p className="mt-2">
                    你可以选择与集合名称不同的文件夹名称，或选择与文件系统规则兼容的名称。
                  </p>
                </Help>
              </label>
              {isEditing ? (
                <IconArrowBackUp
                  className="cursor-pointer opacity-50 hover:opacity-80"
                  size={16}
                  strokeWidth={1.5}
                  onClick={() => toggleEditing(false)}
                />
              ) : (
                <IconEdit
                  className="cursor-pointer opacity-50 hover:opacity-80"
                  size={16}
                  strokeWidth={1.5}
                  onClick={() => toggleEditing(true)}
                />
              )}
            </div>
            {isEditing ? (
              <input
                id="collection-folder-name"
                type="text"
                name="collectionFolderName"
                className="block textbox mt-2 w-full"
                onChange={formik.handleChange}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                value={formik.values.collectionFolderName || ''}
              />
            ) : (
              <div className="relative flex flex-row gap-1 items-center justify-between">
                <PathDisplay
                  baseName={formik.values.collectionFolderName}
                />
              </div>
            )}

            {formik.touched.collectionFolderName && formik.errors.collectionFolderName ? (
              <div className="text-red-500">{formik.errors.collectionFolderName}</div>
            ) : null}
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default CloneCollection;
