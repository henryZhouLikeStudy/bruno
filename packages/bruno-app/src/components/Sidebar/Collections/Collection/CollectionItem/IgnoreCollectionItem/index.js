import React from 'react';
import Modal from 'components/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { ignoreFolder, closeTabs } from 'providers/ReduxStore/slices/collections/actions';
import { recursivelyGetAllItemUids } from 'utils/collections';
import toast from 'react-hot-toast';

const IgnoreCollectionItem = ({ onClose, item, collectionUid }) => {
  const dispatch = useDispatch();
  const collection = useSelector((state) => state.collections.collections?.find((c) => c.uid === collectionUid));
  const isYamlCollection = collection?.format === 'yml' || Boolean(collection?.brunoConfig?.opencollection);
  const configFileName = isYamlCollection ? 'opencollection.yml' : 'bruno.json';

  const onConfirm = () => {
    dispatch(ignoreFolder(item.uid, collectionUid))
      .then(() => {
        const tabUids = [...recursivelyGetAllItemUids(item.items), item.uid];
        dispatch(closeTabs({ tabUids }));
        toast.success('文件夹已忽略');
      })
      .catch((error) => {
        console.error('Error ignoring folder', error);
        toast.error(error?.message || '忽略文件夹时出错');
      });
    onClose();
  };

  return (
    <Modal
      size="md"
      title="忽略文件夹"
      confirmText="忽略"
      handleConfirm={onConfirm}
      handleCancel={onClose}
    >
      忽略 <span className="font-medium">{item.name}</span> 会将其从此
      {' '}
      {isYamlCollection ? 'opencollection (YAML)' : 'Bruno (JSON)'}
      {' '}
      集合中隐藏，方法是将其添加到
      {' '}
      <span className="font-medium">{configFileName}</span>
      {' '}
      中的
      {' '}
      <span className="font-medium">ignore</span>
      {' '}
      列表。文件夹及其文件不会被删除。若要稍后恢复，请从
      {' '}
      <span className="font-medium">{configFileName}</span>
      {' '}
      中的
      {' '}
      <span className="font-medium">ignore</span>
      {' '}
      列表中删除对应条目。
    </Modal>
  );
};

export default IgnoreCollectionItem;
