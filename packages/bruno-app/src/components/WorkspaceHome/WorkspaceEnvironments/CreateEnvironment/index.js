import React, { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import Portal from 'components/Portal';
import Modal from 'components/Modal';
import { addGlobalEnvironment } from 'providers/ReduxStore/slices/global-environments';
import { validateName, validateNameError } from 'utils/common/regex';

const CreateEnvironment = ({ onClose, onEnvironmentCreated }) => {
  const globalEnvs = useSelector((state) => state?.globalEnvironments?.globalEnvironments);

  const validateEnvironmentName = (name) => {
    const trimmedName = name?.toLowerCase().trim();
    return (globalEnvs || []).every((env) => env?.name?.toLowerCase().trim() !== trimmedName);
  };

  const dispatch = useDispatch();
  const inputRef = useRef();
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: ''
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(1, '至少需要 1 个字符')
        .max(255, '最多 255 个字符')
        .test('is-valid-filename', function (value) {
          const isValid = validateName(value);
          return isValid ? true : this.createError({ message: validateNameError(value) });
        })
        .required('名称为必填项')
        .test('duplicate-name', '全局环境已存在', validateEnvironmentName)
    }),
    onSubmit: (values) => {
      dispatch(addGlobalEnvironment({ name: values.name }))
        .then(() => {
          toast.success('全局环境创建成功！');
          onClose();
          // Call the callback if provided
          if (onEnvironmentCreated) {
            onEnvironmentCreated();
          }
        })
        .catch(() => toast.error('创建环境时出错'));
    }
  });

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const onSubmit = () => {
    formik.handleSubmit();
  };

  return (
    <Portal>
      <Modal
        size="md"
        title="创建全局环境"
        confirmText="创建"
        handleConfirm={onSubmit}
        handleCancel={onClose}
      >
        <form className="bruno-form" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="environment-name" className="block font-semibold">
              环境名称
            </label>
            <div className="flex items-center mt-2">
              <input
                id="environment-name"
                type="text"
                name="name"
                ref={inputRef}
                className="block textbox w-full"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                onChange={formik.handleChange}
                value={formik.values.name || ''}
              />
            </div>
            {formik.touched.name && formik.errors.name ? (
              <div className="text-red-500">{formik.errors.name}</div>
            ) : null}
          </div>
        </form>
      </Modal>
    </Portal>
  );
};

export default CreateEnvironment;
