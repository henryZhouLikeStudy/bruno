import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { savePreferences, clearHttpHttpsAgentCache } from 'providers/ReduxStore/slices/app';
import toast from 'react-hot-toast';
import get from 'lodash/get';
import { IconEraser } from '@tabler/icons';
import { useTheme } from 'providers/Theme';
import ToggleSwitch from 'components/ToggleSwitch';
import ActionIcon from 'ui/ActionIcon';
import StyledWrapper from './StyledWrapper';
import { formatSize } from 'utils/common';

const Cache = () => {
  const preferences = useSelector((state) => state.app.preferences);
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const { ipcRenderer } = window;

  const fileCacheEnabled = get(preferences, 'cache.file.enabled', false);
  const sslSessionEnabled = get(preferences, 'cache.sslSession.enabled', false);

  const [fileCacheSize, setFileCacheSize] = useState(null);

  const refreshFileCacheSize = useCallback(() => {
    if (!ipcRenderer) return;
    ipcRenderer
      .invoke('renderer:get-file-cache-size')
      .then((size) => setFileCacheSize(size))
      .catch(() => setFileCacheSize(null));
  }, [ipcRenderer]);

  useEffect(() => {
    refreshFileCacheSize();
  }, [refreshFileCacheSize, fileCacheEnabled]);

  const persist = (next) => {
    dispatch(savePreferences({ ...preferences, cache: next })).catch(() => {
      toast.error('更新缓存偏好设置失败');
    });
  };

  const handleToggleFileCache = () => {
    persist({
      ...preferences.cache,
      file: { enabled: !fileCacheEnabled }
    });
  };

  const handleToggleSslSession = () => {
    const next = !sslSessionEnabled;
    persist({
      ...preferences.cache,
      sslSession: { enabled: next }
    });
    if (!next) {
      dispatch(clearHttpHttpsAgentCache()).catch(() => {});
    }
  };

  const handleClearFileCache = () => {
    if (!ipcRenderer) return;
    ipcRenderer
      .invoke('renderer:clear-file-cache')
      .then((size) => {
        setFileCacheSize(size);
        toast.success('文件缓存已清除');
      })
      .catch(() => toast.error('清除文件缓存失败'));
  };

  const handleClearSslSession = () => {
    dispatch(clearHttpHttpsAgentCache())
      .then(() => toast.success('SSL 会话缓存已清除'))
      .catch(() => toast.error('清除 SSL 会话缓存失败'));
  };

  return (
    <StyledWrapper className="w-full">
      <div className="cache-section-title">缓存</div>

      <div className="cache-item">
        <div className="cache-item-header">
          <div className="cache-item-title-group">
            <span className="cache-item-title">文件缓存</span>
            <span className="beta-badge">测试版</span>
          </div>
          <ToggleSwitch
            data-testid="cache.file.enabled"
            isOn={fileCacheEnabled}
            handleToggle={handleToggleFileCache}
            size="2xs"
            activeColor={theme.primary.solid}
          />
        </div>
        <div className="cache-item-body">
          <div className="cache-item-body-text">
            <p className="cache-item-description">
              通过缓存已打开的集合来加快工作区加载速度。集合变更时 Bruno 会自动刷新缓存。清除缓存不会影响你的原始文件。
            </p>
            <p className="cache-item-size">
              缓存大小 <strong>{fileCacheSize == null ? '—' : formatSize(fileCacheSize)}</strong>
            </p>
          </div>
          <ActionIcon
            label="清除缓存"
            onClick={handleClearFileCache}
            disabled={!fileCacheSize}
            colorOnHover={theme.colors.text.danger}
          >
            <IconEraser size={16} strokeWidth={1.5} />
          </ActionIcon>
        </div>
      </div>

      <div className="cache-item">
        <div className="cache-item-header">
          <div className="cache-item-title-group">
            <span className="cache-item-title">SSL 会话缓存</span>
          </div>
          <ToggleSwitch
            data-testid="sslSession.enabled"
            isOn={sslSessionEnabled}
            handleToggle={handleToggleSslSession}
            size="2xs"
            activeColor={theme.primary.solid}
          />
        </div>
        <div className="cache-item-body">
          <div className="cache-item-body-text">
            <p className="cache-item-description">
              在请求之间复用 TLS 会话和连接以加快握手速度。禁用时每个请求都会建立全新连接。
            </p>
          </div>
          <ActionIcon
            label="清除缓存"
            onClick={handleClearSslSession}
            colorOnHover={theme.colors.text.danger}
          >
            <IconEraser size={16} strokeWidth={1.5} />
          </ActionIcon>
        </div>
      </div>
    </StyledWrapper>
  );
};

export default Cache;
