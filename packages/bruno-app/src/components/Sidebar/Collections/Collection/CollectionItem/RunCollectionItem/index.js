import React, { useState } from 'react';
import get from 'lodash/get';
import { uuid } from 'utils/common';
import Modal from 'components/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { addTab } from 'providers/ReduxStore/slices/tabs';
import { runCollectionFolder } from 'providers/ReduxStore/slices/collections/actions';
import { flattenItems } from 'utils/collections';
import StyledWrapper from './StyledWrapper';
import { areItemsLoading } from 'utils/collections';
import RunnerTags from 'components/RunnerResults/RunnerTags/index';
import { getRequestItemsForCollectionRun } from 'utils/collections/index';
import Button from 'ui/Button';

const RunCollectionItem = ({ collectionUid, item, onClose }) => {
  const dispatch = useDispatch();
  const [delay, setDelay] = useState('');

  const collection = useSelector((state) => state.collections.collections?.find((c) => c.uid === collectionUid));
  const isCollectionRunInProgress = collection?.runnerResult?.info?.status && (collection?.runnerResult?.info?.status !== 'ended');

  // tags for the collection run
  const tags = get(collection, 'runnerTags', { include: [], exclude: [] });

  const onSubmit = (recursive) => {
    dispatch(
      addTab({
        uid: uuid(),
        collectionUid: collection.uid,
        type: 'collection-runner'
      })
    );
    if (!isCollectionRunInProgress) {
      dispatch(runCollectionFolder(collection.uid, item ? item.uid : null, recursive, delay ? Number(delay) : null, tags));
    }
    onClose();
  };

  const handleViewRunner = (e) => {
    e.preventDefault();
    dispatch(
      addTab({
        uid: uuid(),
        collectionUid: collection.uid,
        type: 'collection-runner'
      })
    );
    onClose();
  };

  const isFolderLoading = areItemsLoading(item);

  const requestItemsForRecursiveFolderRun = getRequestItemsForCollectionRun({ recursive: true, tags, items: item ? item.items : collection.items });
  const totalRequestItemsCountForRecursiveFolderRun = requestItemsForRecursiveFolderRun.length;
  const shouldDisableRecursiveFolderRun = totalRequestItemsCountForRecursiveFolderRun <= 0;

  const requestItemsForFolderRun = getRequestItemsForCollectionRun({ recursive: false, tags, items: item ? item.items : collection.items });
  const totalRequestItemsCountForFolderRun = requestItemsForFolderRun.length;
  const shouldDisableFolderRun = totalRequestItemsCountForFolderRun <= 0;

  return (
    <StyledWrapper>
      <Modal size="md" title="集合运行器" hideFooter={true} handleCancel={onClose}>
        <div>
          <div className="mb-1">
            <span className="font-medium">运行</span>
            <span className="ml-1 text-xs">（{totalRequestItemsCountForFolderRun} 个请求）</span>
          </div>
          <div className="mb-3 description">仅运行此文件夹中的请求。</div>
          <div className="mb-1">
            <span className="font-medium">递归运行</span>
            <span className="ml-1 text-xs">（{totalRequestItemsCountForRecursiveFolderRun} 个请求）</span>
          </div>
          <div className={`description ${isFolderLoading ? 'mb-2' : 'mb-6'}`}>将运行此文件夹及其所有子文件夹中的请求。</div>
          {isFolderLoading ? <div className="mb-8 warning">此文件夹中的请求仍在加载。</div> : null}
          {isCollectionRunInProgress ? <div className="mb-6 warning">集合运行已在进行中。</div> : null}

          <hr className="divider" />

          {/* Timings */}
          <div className="flex flex-col items-start gap-2 mb-8">
            <label htmlFor="runner-delay" className="block text-sm">请求间隔（毫秒）</label>
            <input
              id="runner-delay"
              type="number"
              className="textbox w-1/2"
              placeholder="例如 5"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              value={delay}
              onChange={(e) => setDelay(e.target.value)}
            />
          </div>

          {/* Tags for the collection run */}
          <RunnerTags collectionUid={collection.uid} className="mb-6" />

          <div className="flex justify-end bruno-modal-footer">
            <Button type="button" color="secondary" variant="ghost" onClick={onClose} className="mr-3">
              取消
            </Button>
            {
              isCollectionRunInProgress
                ? (
                    <Button type="submit" onClick={handleViewRunner}>
                      查看运行
                    </Button>
                  )
                : (
                    <>
                      <Button type="submit" disabled={shouldDisableRecursiveFolderRun} onClick={() => onSubmit(true)} className="mr-3">
                        递归运行
                      </Button>
                      <Button type="submit" disabled={shouldDisableFolderRun} onClick={() => onSubmit(false)}>
                        运行
                      </Button>
                    </>
                  )
            }
          </div>
        </div>
      </Modal>
    </StyledWrapper>
  );
};

export default RunCollectionItem;
