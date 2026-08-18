import Modal from 'components/Modal/index';
import Portal from 'components/Portal/index';
import { useFormik } from 'formik';
import { copyGlobalEnvironment } from 'providers/ReduxStore/slices/global-environments';
import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';

const CopyEnvironment = ({ environment, onClose }) => {
  const dispatch = useDispatch();
  const inputRef = useRef();
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: environment.name + ' - Copy'
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(1, '至少需要 1 个字符')
        .max(50, '最多 50 个字符')
        .required('名称为必填项')
    }),
    onSubmit: (values) => {
      dispatch(copyGlobalEnvironment({ name: values.name, environmentUid: environment.uid }))
        .then(() => {
          toast.success('环境创建成功！');
          onClose();
        })
        .catch((error) => {
          toast.error('创建环境时出错');
          console.error(error);
        });
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
      <Modal size="sm" title="复制环境" confirmText="复制" handleConfirm={onSubmit} handleCancel={onClose}>
        <form className="bruno-form" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="environment-name" className="block font-semibold">
              新环境名称
            </label>
            <input
              id="environment-name"
              type="text"
              name="name"
              ref={inputRef}
              className="block textbox mt-2 w-full"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              onChange={formik.handleChange}
              value={formik.values.name || ''}
            />
            {formik.touched.name && formik.errors.name ? (
              <div className="text-red-500">{formik.errors.name}</div>
            ) : null}
          </div>
        </form>
      </Modal>
    </Portal>
  );
};

export default CopyEnvironment;
