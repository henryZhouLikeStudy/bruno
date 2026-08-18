import React from 'react';
import Portal from 'components/Portal/index';
import toast from 'react-hot-toast';
import Modal from 'components/Modal/index';
import { useDispatch } from 'react-redux';
import StyledWrapper from './StyledWrapper';
import { deleteGlobalEnvironment } from 'providers/ReduxStore/slices/global-environments';

const DeleteEnvironment = ({ onClose, environment }) => {
  const dispatch = useDispatch();
  const onConfirm = () => {
    dispatch(deleteGlobalEnvironment({ environmentUid: environment.uid }))
      .then(() => {
        toast.success('环境删除成功');
        onClose();
      })
      .catch(() => toast.error('删除环境时出错'));
  };

  return (
    <Portal>
      <StyledWrapper>
        <Modal
          size="md"
          title="删除环境"
          confirmText="删除"
          handleConfirm={onConfirm}
          handleCancel={onClose}
        >
          确定要删除 <span className="font-semibold">{environment.name}</span> 吗？
        </Modal>
      </StyledWrapper>
    </Portal>
  );
};

export default DeleteEnvironment;
