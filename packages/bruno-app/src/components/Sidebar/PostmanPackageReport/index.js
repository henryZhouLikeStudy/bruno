import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {
  IconAlertTriangle,
  IconBan,
  IconCheck,
  IconCircleCheck,
  IconCode,
  IconCopy,
  IconLoader2,
  IconPackage,
  IconShieldLock,
  IconTerminal2
} from '@tabler/icons';
import Modal from 'components/Modal';
import Button from 'ui/Button';
import { saveCollectionSecurityConfig } from 'providers/ReduxStore/slices/collections/actions';
import { findCollectionByPathname } from 'utils/collections';
import StyledWrapper from './StyledWrapper';

const PackageList = ({ items }) => (
  <ul className="pkg-list">
    {items.map((name) => (
      <li key={name} className="pkg-list-item">
        <IconPackage size={12} strokeWidth={1.75} />
        <span>{name}</span>
      </li>
    ))}
  </ul>
);

// Renders "`a` and `b`" / "`a`, `b` and `c`" / "`a`, `b` and 3 more" as inline
// code spans for use inside a sentence.
const renderPackageExamples = (names = []) => {
  const shown = names.slice(0, 3);
  const remainder = names.length - shown.length;
  return shown.map((name, idx) => {
    let separator = '';
    if (idx > 0) {
      separator = idx === shown.length - 1 && remainder === 0 ? ' 和 ' : '、';
    }
    return (
      <Fragment key={name}>
        {separator}
        <code>{name}</code>
        {idx === shown.length - 1 && remainder > 0 ? ` 和另外 ${remainder} 个` : ''}
      </Fragment>
    );
  });
};

// Maps an install result's errorCode to a user-facing message. Falls back to a
// generic exit-code message for plain non-zero exits.
const getInstallFailureMessage = (result) => {
  switch (result?.errorCode) {
    case 'NPM_NOT_FOUND':
      return '在 PATH 中找不到 npm。请安装 Node.js/npm，然后重试或在终端中手动运行命令。';
    case 'TIMEOUT':
      return 'npm install 超时。请尝试在终端中手动运行该命令。';
    case 'SPAWN_FAILED':
    case 'SPAWN_ERROR':
      return '无法启动 npm install。请尝试在终端中手动运行该命令。';
    default:
      return `npm install 失败（退出码 ${result?.exitCode}）。请尝试使用上方的手动命令。`;
  }
};

const PostmanPackageReport = ({ report, collectionPath, onClose }) => {
  const dispatch = useDispatch();
  const collections = useSelector((state) => state.collections.collections);
  const collection = useMemo(
    () => findCollectionByPathname(collections, collectionPath),
    [collections, collectionPath]
  );
  const sandboxMode = collection?.securityConfig?.jsSandboxMode || 'safe';
  const isDeveloperMode = sandboxMode === 'developer';

  const [installing, setInstalling] = useState(false);
  const [installResult, setInstallResult] = useState(null);
  const [switchingMode, setSwitchingMode] = useState(false);
  const [copied, setCopied] = useState(false);

  const needsInstall = report?.needsInstall || [];
  const unsupported = report?.unsupported || [];
  const devMode = report?.devMode || [];

  const installCommand = useMemo(
    () => (needsInstall.length ? `npm install --save ${needsInstall.join(' ')}` : ''),
    [needsInstall]
  );

  const needsDevModeOnly
    = needsInstall.length === 0 && devMode.length > 0 && !isDeveloperMode;
  const hasActionable
    = needsInstall.length > 0 || unsupported.length > 0 || needsDevModeOnly;

  useEffect(() => {
    if (report && !hasActionable) onClose();
  }, [report, hasActionable, onClose]);

  if (!report || !hasActionable) return null;

  const installDone = installResult && installResult.success;
  const installFailed = installResult && !installResult.success;
  const installFailureMessage = installFailed ? getInstallFailureMessage(installResult) : '';

  const handleInstall = async () => {
    if (!collectionPath) {
      toast.error('无法安装：集合路径不可用。');
      return;
    }
    if (needsInstall.length === 0) return;

    setInstalling(true);
    setInstallResult(null);
    try {
      const result = await window.ipcRenderer.invoke(
        'renderer:install-postman-packages',
        collectionPath,
        needsInstall
      );
      setInstallResult(result);
      if (result.success) {
        toast.success(
          `已安装 ${needsInstall.length} 个包`
        );
      } else {
        toast.error('npm install 失败。详情请见下方。');
      }
    } catch (err) {
      console.error('Install failed:', err);
      setInstallResult({ success: false, stderr: err?.message || String(err), exitCode: -1 });
      toast.error('无法启动 npm install');
    } finally {
      setInstalling(false);
    }
  };

  const handleSwitchToDeveloperMode = () => {
    if (!collection?.uid) {
      toast.error('找不到要切换模式的导入集合。');
      return;
    }
    setSwitchingMode(true);
    dispatch(saveCollectionSecurityConfig(collection.uid, { jsSandboxMode: 'developer' }))
      .then(() => toast.success('开发者模式已启用'))
      .catch((err) => {
        console.error(err);
        toast.error('切换沙箱模式失败');
      })
      .finally(() => setSwitchingMode(false));
  };

  const handleCopyCommand = async () => {
    try {
      await navigator.clipboard.writeText(installCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error('无法复制到剪贴板');
    }
  };

  const isDismissAction = installDone || needsInstall.length === 0;
  const confirmText = installDone
    ? '完成'
    : installing
      ? '安装中…'
      : needsInstall.length > 0
        ? `安装 ${needsInstall.length} 个包`
        : '完成';
  const handleConfirm = isDismissAction ? onClose : handleInstall;

  return (
    <StyledWrapper>
      <Modal
        size="md"
        title="安装包"
        confirmText={confirmText}
        cancelText="跳过"
        hideCancel={installDone || (needsInstall.length === 0 && !installFailed)}
        confirmDisabled={installing}
        confirmButtonColor={isDismissAction ? 'secondary' : 'primary'}
        handleConfirm={handleConfirm}
        handleCancel={onClose}
        dataTestId="postman-package-report-modal"
        disableCloseOnOutsideClick
      >
        {needsInstall.length > 0 && (
          <div className="pkg-section">
            <div className="pkg-section-head">
              <span className="pkg-section-title">脚本中使用的包</span>
              <span className="pkg-section-count">{needsInstall.length}</span>
            </div>
            {!installing && !installDone && (
              <p className="pkg-section-help">
                这些 npm 包被导入集合中的脚本引用，但尚未安装在该集合的文件夹中。
              </p>
            )}
            <PackageList items={needsInstall} />

            {!installing && !installDone && (
              <div className="pkg-cmd-block">
                <div className="pkg-cmd-label">
                  <IconTerminal2 size={12} strokeWidth={1.75} />
                  <span>或手动安装</span>
                </div>
                <div className="pkg-cmd-row">
                  <code className="pkg-cmd-code">{installCommand}</code>
                  <button
                    type="button"
                    className="pkg-cmd-copy"
                    onClick={handleCopyCommand}
                    aria-label="复制命令"
                  >
                    {copied ? <IconCheck size={14} strokeWidth={1.75} /> : <IconCopy size={14} strokeWidth={1.5} />}
                  </button>
                </div>
              </div>
            )}

            {installing && (
              <div className="pkg-inline-status pkg-inline-info">
                <IconLoader2 size={14} strokeWidth={1.75} className="pkg-spin" />
                <span>正在安装 {needsInstall.length} 个包…</span>
              </div>
            )}

            {installDone && (
              <div className="pkg-inline-status pkg-inline-success">
                <IconCircleCheck size={14} strokeWidth={1.75} />
                <span>
                  已将 {(installResult.installed || needsInstall).length} 个包安装到此集合中。
                </span>
              </div>
            )}
          </div>
        )}

        {needsDevModeOnly && !installDone && !installing && (
          <div className="pkg-section pkg-devmode">
            <div className="pkg-devmode-head">
              <IconAlertTriangle size={18} strokeWidth={1.75} />
              <span className="pkg-devmode-title">脚本使用了需要开发者模式的库</span>
            </div>
            <p className="pkg-devmode-desc">
              你导入的脚本调用了 {renderPackageExamples(devMode)}
              ，这些库需要 <strong>开发者模式</strong> 才能运行。
            </p>
            <PackageList items={devMode} />
            <div className="pkg-devmode-trust">
              <IconShieldLock size={15} strokeWidth={1.75} />
              <span>请只对你信任的集合启用开发者模式。</span>
            </div>
            <Button
              color="primary"
              size="sm"
              loading={switchingMode}
              icon={<IconCode size={15} strokeWidth={2} />}
              onClick={handleSwitchToDeveloperMode}
              data-testid="switch-to-developer-mode"
            >
              切换到开发者模式
            </Button>
          </div>
        )}

        {unsupported.length > 0 && !installDone && !installing && (
          <div className="pkg-section pkg-section-danger">
            <div className="pkg-section-head">
              <IconBan size={14} strokeWidth={1.75} />
              <span className="pkg-section-title">Bruno 中不支持</span>
              <span className="pkg-section-count">{unsupported.length}</span>
            </div>
            <p className="pkg-section-help">
              这些 Postman 专用包没有对应的 Bruno 等价物。调用它们的脚本将在运行时失败。
            </p>
            <PackageList items={unsupported} />
          </div>
        )}

        {installDone && (
          isDeveloperMode ? (
            <div className="pkg-status pkg-status-success">
              <IconCircleCheck size={14} strokeWidth={1.75} />
              <span>
                此集合在 <strong>开发者模式</strong> 下运行——你的脚本可以立即使用这些包。
              </span>
            </div>
          ) : (
            <div className="pkg-section pkg-devmode">
              <div className="pkg-devmode-head">
                <IconAlertTriangle size={18} strokeWidth={1.75} />
                <span className="pkg-devmode-title">外部模块需要开发者模式</span>
              </div>
              <p className="pkg-devmode-desc">
                自定义 npm 包（例如 {renderPackageExamples(installResult.installed || needsInstall)}）
                已安装，但此集合当前在 <strong>安全模式</strong> 下运行。
              </p>
              <div className="pkg-devmode-trust">
                <IconShieldLock size={15} strokeWidth={1.75} />
                <span>请只对你信任的集合启用开发者模式。</span>
              </div>
              <Button
                color="primary"
                size="sm"
                loading={switchingMode}
                icon={<IconCode size={15} strokeWidth={2} />}
                onClick={handleSwitchToDeveloperMode}
                data-testid="switch-to-developer-mode"
              >
                切换到开发者模式
              </Button>
            </div>
          )
        )}

        {installFailed && (
          <div className="pkg-status pkg-status-danger" data-testid="postman-package-install-error">
            <div className="pkg-status-head">
              <IconAlertTriangle size={14} strokeWidth={1.75} />
              <span>{installFailureMessage}</span>
            </div>
            {(installResult.stderr || installResult.stdout) && (
              <pre className="pkg-status-log">
                {(installResult.stderr || installResult.stdout).slice(-1200)}
              </pre>
            )}
          </div>
        )}
      </Modal>
    </StyledWrapper>
  );
};

export default PostmanPackageReport;
