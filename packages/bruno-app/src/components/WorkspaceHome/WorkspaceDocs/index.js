import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { saveWorkspaceDocs } from 'providers/ReduxStore/slices/workspaces/actions';
import StyledWrapper from './StyledWrapper';
import { IconFileText, IconEdit, IconX, IconPlus } from '@tabler/icons';
import Button from 'ui/Button';
import toast from 'react-hot-toast';
import ActionIcon from 'ui/ActionIcon/index';
import { usePersistedState } from 'hooks/usePersistedState';
import { useTrackScroll } from 'hooks/useTrackScroll';
import DocsEditor from 'components/Documentation/DocsEditor';

const WorkspaceDocs = ({ workspace }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [localDocs, setLocalDocs] = useState(workspace?.docs || '');

  const wrapperRef = useRef(null);
  const [scroll, setScroll] = usePersistedState({ key: `workspace-docs-scroll-${workspace?.uid}`, default: 0 });
  useTrackScroll({
    ref: wrapperRef,
    selector: '.rich-text-editor-content',
    onChange: setScroll,
    enabled: !isEditing,
    initialValue: scroll
  });

  // `workspace` is keyed by uid at the call site, so switching workspaces
  // remounts this component and re-initializes localDocs/isEditing fresh
  // instead of needing an effect to reset them. localDocs is only seeded
  // from workspace.docs on mount and when edit mode is (re-)entered, so an
  // external update to workspace.docs while the user is mid-edit doesn't
  // silently overwrite their in-progress changes.
  const toggleViewMode = () => {
    setIsEditing((prev) => {
      const next = !prev;
      if (next) {
        setLocalDocs(workspace?.docs || '');
      }
      return next;
    });
  };

  const onEdit = (value) => {
    setLocalDocs(value);
  };

  const handleDiscardChanges = () => {
    setLocalDocs(workspace?.docs || '');
    toggleViewMode();
  };

  const onSave = async () => {
    if (!workspace) {
      toast.error('未找到工作区');
      return;
    }

    try {
      await dispatch(saveWorkspaceDocs(workspace.uid, localDocs));
      toast.success('文档保存成功');
      toggleViewMode();
    } catch (error) {
      console.error('Error saving workspace docs:', error);
      toast.error('保存文档失败');
    }
  };

  const handleAddDocumentation = () => {
    setIsEditing(true);
  };

  const hasDocs = localDocs && localDocs.trim().length > 0;

  return (
    <StyledWrapper className="h-full w-full flex flex-col">
      <div className="docs-header">
        <div className="docs-title">
          <IconFileText size={16} strokeWidth={1.5} />
          <span>文档</span>
        </div>
        {hasDocs && !isEditing && (
          <ActionIcon className="edit-btn" onClick={toggleViewMode}>
            <IconEdit size={16} strokeWidth={1.5} />
          </ActionIcon>
        )}
        {isEditing && (
          <ActionIcon className="edit-btn" onClick={handleDiscardChanges}>
            <IconX size={16} strokeWidth={1.5} />
          </ActionIcon>
        )}
      </div>

      <div className="docs-content" ref={wrapperRef}>
        {hasDocs || isEditing ? (
          <div className="editor-container">
            <div className="flex-1 min-h-0 flex flex-col">
              <DocsEditor
                docs={localDocs}
                onEdit={onEdit}
                onSave={onSave}
                isEditing={isEditing}
                collectionPath={workspace?.pathname || ''}
                onRequestEdit={toggleViewMode}
              />
            </div>
            {isEditing && (
              <div className="editor-actions">
                <Button onClick={onSave}>
                  保存
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon-wrapper">
              <IconFileText size={52} strokeWidth={1} />
            </div>
            <p className="empty-text">
              添加文档，帮助团队顺畅协作。
            </p>
            <p className="empty-subtext">你可以包含：</p>
            <ul className="suggestions-list">
              <li>项目概览</li>
              <li>安装说明</li>
              <li>关键工作流</li>
              <li>资源与常见问题</li>
            </ul>
            <Button color="light" size="sm" icon={<IconPlus size={14} strokeWidth={1.5} />} onClick={handleAddDocumentation}>
              添加文档
            </Button>
          </div>
        )}
      </div>
    </StyledWrapper>
  );
};

export default WorkspaceDocs;
