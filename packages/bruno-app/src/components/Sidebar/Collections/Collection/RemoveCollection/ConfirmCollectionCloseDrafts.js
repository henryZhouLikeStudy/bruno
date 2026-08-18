import React, { useMemo } from 'react';
import filter from 'lodash/filter';
import { useDispatch, useSelector } from 'react-redux';
import { flattenItems, isItemARequest, hasRequestChanges, findCollectionByUid } from 'utils/collections';
import { saveRequest, saveMultipleRequests } from 'providers/ReduxStore/slices/collections/actions';
import { deleteRequestDraft } from 'providers/ReduxStore/slices/collections';
import { removeCollection } from 'providers/ReduxStore/slices/collections/actions';
import { IconAlertTriangle, IconDeviceFloppy } from '@tabler/icons';
import Modal from 'components/Modal';
import toast from 'react-hot-toast';
import Button from 'ui/Button';
import StyledWrapper from './StyledWrapper';

const MAX_UNSAVED_REQUESTS_TO_SHOW = 5;

const ConfirmCollectionCloseDrafts = ({ onClose, collection, collectionUid }) => {
  const dispatch = useDispatch();

  const latestCollection = useSelector((state) => findCollectionByUid(state.collections.collections, collectionUid));

  const activeCollection = latestCollection || collection;

  const currentDrafts = useMemo(() => {
    if (!activeCollection) return [];
    const items = flattenItems(activeCollection.items);
    return items
      ?.filter((item) => isItemARequest(item) && hasRequestChanges(item) && !item.isTransient)
      .map((item) => {
        return {
          ...item,
          collectionUid: collectionUid
        };
      });
  }, [activeCollection, collectionUid]);

  const currentTransientDrafts = useMemo(() => {
    if (!activeCollection) return [];
    const items = flattenItems(activeCollection.items);
    return items
      ?.filter((item) => isItemARequest(item) && hasRequestChanges(item) && item.isTransient)
      .map((item) => {
        return {
          ...item,
          collectionUid: collectionUid
        };
      });
  }, [activeCollection, collectionUid]);

  const allDrafts = useMemo(() => {
    return [...currentDrafts, ...currentTransientDrafts];
  }, [currentDrafts, currentTransientDrafts]);

  const handleSaveAll = () => {
    // If there are transient drafts, we can't proceed with batch save
    if (currentTransientDrafts.length > 0) {
      toast.error('请先保存或丢弃临时请求');
      return;
    }
    // Save only non-transient drafts
    if (currentDrafts.length > 0) {
      dispatch(saveMultipleRequests(currentDrafts))
        .then(() => {
          dispatch(removeCollection(collectionUid))
            .then(() => {
              toast.success('集合已从工作区移除');
              onClose();
            })
            .catch(() => toast.error('移除集合时发生错误'));
        })
        .catch(() => {
          toast.error('保存请求失败！');
        });
    } else {
      // No non-transient drafts, just remove the collection
      dispatch(removeCollection(collectionUid))
        .then(() => {
          toast.success('集合已从工作区移除');
          onClose();
        })
        .catch(() => toast.error('移除集合时发生错误'));
    }
  };

  const handleDiscardAll = () => {
    // Discard all drafts (both regular and transient)
    allDrafts.forEach((draft) => {
      dispatch(deleteRequestDraft({
        collectionUid: collectionUid,
        itemUid: draft.uid
      }));
    });

    // Then remove the collection
    dispatch(removeCollection(collectionUid))
      .then(() => {
        toast.success('Collection removed from workspace');
        onClose();
      })
      .catch(() => toast.error('An error occurred while removing the collection'));
  };

  const handleSaveTransient = (draft) => {
    dispatch(saveRequest(draft.uid, collectionUid));
  };

  if (!currentDrafts.length && !currentTransientDrafts.length) {
    return null;
  }

  return (
    <StyledWrapper>
      <Modal
        size="md"
        title="移除集合"
        confirmText="保存并移除"
        cancelText="不保存直接移除"
        handleCancel={onClose}
        disableEscapeKey={true}
        disableCloseOnOutsideClick={true}
        closeModalFadeTimeout={150}
        hideFooter={true}
      >
        <div className="flex items-center">
          <IconAlertTriangle size={32} strokeWidth={1.5} className="warning-text" />
          <h1 className="ml-2 text-lg font-medium">请稍候…</h1>
        </div>
        <p className="mt-4">
          你有 <span className="font-medium">{allDrafts.length}</span> 个请求存在未保存的更改。
        </p>

        {/* Regular (saved) requests with changes */}
        {currentDrafts.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">
              已保存的请求（{currentDrafts.length}）
            </p>
            <ul className="ml-2">
              {currentDrafts.slice(0, MAX_UNSAVED_REQUESTS_TO_SHOW).map((item) => {
                return (
                  <li key={item.uid} className="mt-1 text-xs draft-list-item">
                    • {item.filename || item.name}
                  </li>
                );
              })}
            </ul>
            {currentDrafts.length > MAX_UNSAVED_REQUESTS_TO_SHOW && (
              <p className="ml-2 mt-1 text-xs draft-list-item">
                ...还有 {currentDrafts.length - MAX_UNSAVED_REQUESTS_TO_SHOW} 个请求未显示
              </p>
            )}
          </div>
        )}

        {/* Transient (unsaved) requests */}
        {currentTransientDrafts.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">
              临时请求（{currentTransientDrafts.length}）
            </p>
            <p className="text-xs transient-hint mb-3">
              在关闭集合之前，需要逐个保存这些请求。
            </p>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {currentTransientDrafts.map((item) => {
                return (
                  <div
                    key={item.uid}
                    className="flex items-center justify-between py-2 px-3 transient-item"
                  >
                    <span className="text-sm transient-item-name truncate mr-3">{item.name}</span>
                    <Button
                      color="primary"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSaveTransient(item)}
                      icon={<IconDeviceFloppy size={14} strokeWidth={1.5} />}
                    >
                      保存
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex justify-between mt-6">
          <div>
            <Button color="danger" onClick={handleDiscardAll}>
              全部丢弃并移除
            </Button>
          </div>
          <div>
            <Button className="mr-2" color="secondary" variant="ghost" onClick={onClose}>
              取消
            </Button>
            <Button
              onClick={handleSaveAll}
              disabled={currentTransientDrafts.length > 0}
              title={currentTransientDrafts.length > 0 ? '请先保存或丢弃临时请求' : ''}
            >
              {currentDrafts.length > 1 ? '全部保存并移除' : '保存并移除'}
            </Button>
          </div>
        </div>
      </Modal>
    </StyledWrapper>
  );
};

export default ConfirmCollectionCloseDrafts;
