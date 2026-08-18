import React, { useState, useRef, useEffect, forwardRef } from 'react';
import toast from 'react-hot-toast';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Modal from 'components/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { isItemAFolder } from 'utils/tabs';
import { cloneItem } from 'providers/ReduxStore/slices/collections/actions';
import { IconArrowBackUp, IconEdit, IconCaretDown } from '@tabler/icons';
import { sanitizeName, validateName, validateNameError } from 'utils/common/regex';
import Help from 'components/Help';
import PathDisplay from 'components/PathDisplay/index';
import path from 'utils/common/path';
import Portal from 'components/Portal';
import Dropdown from 'components/Dropdown';
import StyledWrapper from './StyledWrapper';
import Button from 'ui/Button';

const CloneCollectionItem = ({ collectionUid, item, onClose }) => {
  const dispatch = useDispatch();
  const collection = useSelector((state) => state.collections.collections?.find((c) => c.uid === collectionUid));
  const isFolder = isItemAFolder(item);
  const inputRef = useRef();
  const [isEditing, toggleEditing] = useState(false);
  const itemName = item?.name;
  const itemType = item?.type;
  const [showFilesystemName, toggleShowFilesystemName] = useState(false);

  const dropdownTippyRef = useRef();
  const onDropdownCreate = (ref) => (dropdownTippyRef.current = ref);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: `${itemName} 副本`,
      filename: `${sanitizeName(itemName)} 副本`
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(1, '至少需要 1 个字符')
        .max(255, '最多 255 个字符')
        .required('名称为必填项'),
      filename: Yup.string()
        .min(1, '至少需要 1 个字符')
        .max(255, '最多 255 个字符')
        .required('名称为必填项')
        .test('is-valid-name', function (value) {
          const isValid = validateName(value);
          return isValid ? true : this.createError({ message: validateNameError(value) });
        })
        .test('not-reserved', `文件名 "collection" 和 "folder" 在 bruno 中为保留名称`, (value) => !['collection', 'folder'].includes(value))
    }),
    onSubmit: (values) => {
      dispatch(cloneItem(values.name, values.filename, item.uid, collectionUid))
        .then(() => {
          toast.success('请求已克隆！');
          onClose();
        })
        .catch((err) => {
          toast.error(err ? err.message : '克隆请求时发生错误');
        });
    }
  });

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const AdvancedOptions = forwardRef((props, ref) => {
    return (
      <div ref={ref} className="flex mr-2 text-link cursor-pointer items-center">
        <button
          className="btn-advanced"
          type="button"
        >
          选项
        </button>
        <IconCaretDown className="caret ml-1" size={14} strokeWidth={2} />
      </div>
    );
  });

  return (
    <Portal>
      <StyledWrapper>
        <Modal
          size="md"
          title={`克隆${isFolder ? '文件夹' : '请求'}`}
          handleCancel={onClose}
          hideFooter
        >
          <form className="bruno-form" onSubmit={formik.handleSubmit}>
            <div>
              <label htmlFor="name" className="block font-medium">
                {isFolder ? '文件夹' : '请求'}名称
              </label>
              <input
                id="collection-item-name"
                type="text"
                name="name"
                placeholder="输入项目名称"
                ref={inputRef}
                className="block textbox mt-2 w-full"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                onChange={(e) => {
                  formik.setFieldValue('name', e.target.value);
                  !isEditing && formik.setFieldValue('filename', sanitizeName(e.target.value));
                }}
                value={formik.values.name || ''}
              />
              {formik.touched.name && formik.errors.name ? <div className="text-red-500">{formik.errors.name}</div> : null}
            </div>

            {showFilesystemName && (
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <label htmlFor="filename" className="flex items-center font-medium">
                    {isFolder ? '文件夹' : '文件'}名称 <small className="font-normal text-muted ml-1">（文件系统中）</small>
                    { isFolder ? (
                      <Help width="300">
                        <p>
                          你可以选择在文件系统中使用与应用中显示不同的文件夹名称进行保存。
                        </p>
                      </Help>
                    ) : (
                      <Help width="300">
                        <p>
                          Bruno 将每个请求保存为集合文件夹中的一个文件。
                        </p>
                        <p className="mt-2">
                          你可以选择与请求名称不同的文件名称，或选择与文件系统规则兼容的名称。
                        </p>
                      </Help>
                    )}
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
                  <div className="relative flex flex-row gap-1 items-center justify-between">
                    <input
                      id="file-name"
                      type="text"
                      name="filename"
                      placeholder={isFolder ? '文件夹名称' : '文件名称'}
                      className="!pr-10 block textbox mt-2 w-full"
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                      onChange={formik.handleChange}
                      value={formik.values.filename || ''}
                    />
                    {itemType !== 'folder' && <span className="absolute right-2 top-4 flex justify-center items-center file-extension">.{collection?.format || 'bru'}</span>}
                  </div>
                ) : (
                  <div className="relative flex flex-row gap-1 items-center justify-between">
                    <PathDisplay
                      baseName={formik.values.filename}
                    />
                  </div>
                )}
                {formik.touched.filename && formik.errors.filename ? (
                  <div className="text-red-500">{formik.errors.filename}</div>
                ) : null}
              </div>
            )}

            <div className="flex justify-between items-center mt-8 bruno-modal-footer">
              <div className="flex advanced-options">
                <Dropdown onCreate={onDropdownCreate} icon={<AdvancedOptions />} placement="bottom-start">
                  <div
                    className="dropdown-item"
                    key="show-filesystem-name"
                    onClick={(e) => {
                      dropdownTippyRef.current.hide();
                      toggleShowFilesystemName(!showFilesystemName);
                    }}
                  >
                    {showFilesystemName ? '隐藏文件系统名称' : '显示文件系统名称'}
                  </div>
                </Dropdown>
              </div>
              <div className="flex justify-end">
                <Button type="button" color="secondary" variant="ghost" onClick={onClose} className="mr-2">
                  取消
                </Button>
                <Button type="submit" data-testid="clone-item-button">
                  克隆
                </Button>
              </div>
            </div>
          </form>
        </Modal>
      </StyledWrapper>
    </Portal>
  );
};

export default CloneCollectionItem;
