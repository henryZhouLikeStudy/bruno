import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconArrowRight, IconAlertTriangle } from '@tabler/icons';

import Modal from 'components/Modal';
import Portal from 'components/Portal';
import { findCollectionByUid, getCollectionVersion, isOpenCollectionFormat } from 'utils/collections/index';
import { saveCollectionVersion } from 'providers/ReduxStore/slices/collections/actions';
import StyledWrapper, { ModalTitle } from './StyledWrapper';

const CollectionNotFound = ({ onClose }) => (
  <Portal>
    <Modal size="sm" title="修改集合版本" confirmText="关闭" handleConfirm={onClose} hideCancel>
      <StyledWrapper className="w-[480px]">
        <div className="flex items-center gap-2 text-warning">
          <IconAlertTriangle size={16} className="shrink-0" />
          <span>未找到集合。它可能已被删除或不再可用。</span>
        </div>
      </StyledWrapper>
    </Modal>
  </Portal>
);

const ChangeCollectionVersion = ({ collectionUid, onClose }) => {
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const collection = useSelector((state) => findCollectionByUid(state.collections.collections, collectionUid));

  const currentVersion = getCollectionVersion(collection);
  const isYml = isOpenCollectionFormat(collection);
  const targetKey = isYml ? 'info.version' : 'collectionVersion';
  const targetFile = isYml ? 'opencollection.yml' : 'bruno.json';
  const [newVersion, setNewVersion] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const trimmedVersion = newVersion.trim();
  const canSubmit = useMemo(
    () => trimmedVersion.length > 0 && trimmedVersion !== currentVersion,
    [trimmedVersion, currentVersion]
  );

  const handleConfirm = () => {
    if (!canSubmit || isSaving) return;
    setIsSaving(true);
    dispatch(saveCollectionVersion(collectionUid, trimmedVersion))
      .then(() => onClose())
      .catch(() => setIsSaving(false));
  };

  if (!collection) {
    return <CollectionNotFound onClose={onClose} />;
  }

  return (
    <Portal>
      <Modal
        size="md"
        customHeader={<ModalTitle>修改集合版本</ModalTitle>}
        confirmText={isSaving ? '更新中...' : '更新版本'}
        cancelText="取消"
        handleConfirm={handleConfirm}
        handleCancel={onClose}
        confirmDisabled={!canSubmit || isSaving}
        dataTestId="change-version"
      >
        <StyledWrapper className="w-[560px]">
          <div className="subheader" data-testid="change-version-collection">
            集合：<span className="collection-name">{collection.name}</span>
          </div>

          <div className="version-card">
            <div className="version-row">
              <div className="version-col">
                <div className="col-label">当前版本</div>
                <div className="current-value" data-testid="change-version-current">
                  {currentVersion || <span className="text-muted italic">未设置</span>}
                </div>
              </div>

              <IconArrowRight size={18} className="arrow" stroke={1.5} />

              <div className="version-col">
                <div className="col-label">新版本</div>
                <input
                  ref={inputRef}
                  type="text"
                  className="textbox w-full new-version-input"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  placeholder="例如 v1.0.0"
                  maxLength={50}
                  value={newVersion}
                  onChange={(e) => setNewVersion(e.target.value)}
                  data-testid="change-version-input"
                />
              </div>
            </div>

            <p className="preview m-0" data-testid="change-version-preview">
              将 <strong>{targetKey}</strong> 在 {targetFile} 中从{' '}
              <span className="old">{currentVersion || <span className="text-muted italic not-set">（未设置）</span>}</span>
              <IconArrowRight size={13} className="preview-arrow" stroke={1.5} />
              <span className="new">{trimmedVersion || '…'}</span>
              更新
            </p>
          </div>
        </StyledWrapper>
      </Modal>
    </Portal>
  );
};

export default ChangeCollectionVersion;
