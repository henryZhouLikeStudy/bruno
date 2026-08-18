import React from 'react';
import GradientCloseButton from './GradientCloseButton';
import StatusBadge from 'ui/StatusBadge';
import { IconVariable, IconSettings, IconRun, IconFolder, IconDatabase, IconWorld, IconHome, IconFileCode, IconConfetti, IconServer2 } from '@tabler/icons';
import OpenAPISyncIcon from 'components/Icons/OpenAPISync';

const SpecialTab = ({ handleCloseClick, type, tabName, handleDoubleClick, hasDraft }) => {
  const getTabInfo = (type, tabName) => {
    switch (type) {
      case 'collection-settings': {
        return (
          <>
            <IconSettings size={14} strokeWidth={1.5} className="special-tab-icon flex-shrink-0" />
            <span className="ml-1 tab-name">集合</span>
          </>
        );
      }
      case 'collection-overview': {
        return (
          <>
            <IconSettings size={14} strokeWidth={1.5} className="special-tab-icon flex-shrink-0" />
            <span className="ml-1 tab-name">概览</span>
          </>
        );
      }
      case 'folder-settings': {
        return (
          <>
            <IconFolder size={14} strokeWidth={1.5} className="special-tab-icon flex-shrink-0" />
            <span className="ml-1 tab-name">{tabName || '文件夹'}</span>
          </>
        );
      }
      case 'variables': {
        return (
          <>
            <IconVariable size={14} strokeWidth={1.5} className="special-tab-icon flex-shrink-0" />
            <span className="ml-1 tab-name">变量</span>
          </>
        );
      }
      case 'collection-runner': {
        return (
          <>
            <IconRun size={14} strokeWidth={1.5} className="special-tab-icon flex-shrink-0" />
            <span className="ml-1 tab-name">运行器</span>
          </>
        );
      }
      case 'environment-settings': {
        return (
          <>
            <IconDatabase size={14} strokeWidth={1.5} className="special-tab-icon flex-shrink-0" />
            <span className="ml-1 tab-name">环境</span>
          </>
        );
      }
      case 'global-environment-settings': {
        return (
          <>
            <IconWorld size={14} strokeWidth={1.5} className="special-tab-icon flex-shrink-0" />
            <span className="ml-1 tab-name">全局环境</span>
          </>
        );
      }
      case 'preferences': {
        return (
          <>
            <IconSettings size={14} strokeWidth={1.5} className="special-tab-icon flex-shrink-0" />
            <span className="ml-1 tab-name">首选项</span>
          </>
        );
      }
      case 'workspaceOverview': {
        return (
          <>
            <IconHome size={14} strokeWidth={1.5} className="special-tab-icon flex-shrink-0" />
            <span className="ml-1 tab-name">概览</span>
          </>
        );
      }
      case 'workspaceEnvironments': {
        return (
          <>
            <IconWorld size={14} strokeWidth={1.5} className="special-tab-icon flex-shrink-0" />
            <span className="ml-1 tab-name">环境</span>
          </>
        );
      }
      case 'openapi-sync': {
        return (
          <>
            <OpenAPISyncIcon size={14} className="special-tab-icon flex-shrink-0" />
            <span className="ml-1 tab-name mr-1">OpenAPI</span>
          </>
        );
      }
      case 'openapi-spec': {
        return (
          <>
            <IconFileCode size={14} strokeWidth={1.5} className="special-tab-icon flex-shrink-0" />
            <span className="ml-1 tab-name">API Spec</span>
          </>
        );
      }
      case 'mock-server': {
        return (
          <>
            <IconServer2 size={14} strokeWidth={1.5} className="special-tab-icon flex-shrink-0" />
            <span className="ml-1 tab-name mr-1">{tabName || '模拟服务器'}</span>
            <StatusBadge status="info" size="xs">测试版</StatusBadge>
          </>
        );
      }
      case 'changelog': {
        return (
          <>
            <IconConfetti size={14} strokeWidth={1.5} className="special-tab-icon flex-shrink-0" />
            <span className="ml-1 tab-name">更新日志</span>
          </>
        );
      }
    }
  };

  return (
    <>
      <div
        className="flex items-center tab-label"
        onDoubleClick={handleDoubleClick}
      >
        {getTabInfo(type, tabName)}
      </div>

      <GradientCloseButton hasChanges={hasDraft} onClick={handleCloseClick} />
    </>
  );
};

export default SpecialTab;
