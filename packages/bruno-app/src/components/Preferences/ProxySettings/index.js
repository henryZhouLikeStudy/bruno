import React, { useEffect, useCallback, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import debounce from 'lodash/debounce';
import toast from 'react-hot-toast';
import { savePreferences, refreshPacCache } from 'providers/ReduxStore/slices/app';

import StyledWrapper from './StyledWrapper';
import { useDispatch, useSelector } from 'react-redux';
import { IconEye, IconEyeOff, IconRefresh } from '@tabler/icons';
import { useState } from 'react';
import SystemProxy from './SystemProxy';

const ProxySettings = ({ close }) => {
  const preferences = useSelector((state) => state.app.preferences);
  const dispatch = useDispatch();

  const proxySchema = Yup.object({
    disabled: Yup.boolean().optional(),
    source: Yup.string().oneOf(['manual', 'pac', 'inherit']).required(),
    pac: Yup.object({
      source: Yup.string()
        .optional()
        .test('pac-url', '请输入有效的 PAC URL', (value) => {
          if (!value) return true;
          try {
            const u = new URL(value);
            return u.protocol === 'http:' || u.protocol === 'https:' || u.protocol === 'file:';
          } catch {
            return false;
          }
        })
        .max(2048)
        .nullable()
    }).optional(),
    config: Yup.object({
      protocol: Yup.string().required().oneOf(['http', 'https', 'socks4', 'socks5']),
      hostname: Yup.string().max(1024),
      port: Yup.number()
        .min(1)
        .max(65535)
        .typeError('端口必须在 1 到 65535 之间')
        .nullable()
        .transform((_, val) => (val ? Number(val) : null)),
      auth: Yup.object({
        disabled: Yup.boolean().optional(),
        username: Yup.string().max(1024),
        password: Yup.string().max(1024)
      }).optional(),
      bypassProxy: Yup.string().optional().max(1024)
    }).required()
  });

  const formik = useFormik({
    initialValues: {
      disabled: preferences.proxy.disabled || false,
      source: preferences.proxy.source || 'manual',
      pac: {
        source: preferences.proxy.pac?.source || ''
      },
      config: {
        protocol: preferences.proxy.config?.protocol || 'http',
        hostname: preferences.proxy.config?.hostname || '',
        port: preferences.proxy.config?.port || 0,
        auth: {
          disabled: preferences.proxy.config?.auth?.disabled || false,
          username: preferences.proxy.config?.auth?.username || '',
          password: preferences.proxy.config?.auth?.password || ''
        },
        bypassProxy: preferences.proxy.config?.bypassProxy || ''
      }
    },
    validationSchema: proxySchema,
    onSubmit: (values) => {
      onUpdate(values);
    }
  });

  const onUpdate = useCallback((values) => {
    proxySchema
      .validate(values, { abortEarly: true })
      .then((validatedProxy) => {
        dispatch(
          savePreferences({
            ...preferences,
            proxy: validatedProxy
          })
        ).catch(() => {
          toast.error('保存偏好设置失败');
        });
      })
      .catch((error) => {
      });
  }, [dispatch, preferences, proxySchema]);

  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;

  const debouncedSave = useCallback(
    debounce((values) => {
      onUpdateRef.current(values);
    }, 500),
    []
  );

  const handleRefreshPac = () => {
    dispatch(refreshPacCache())
      .then(() => toast.success('PAC 缓存已刷新'))
      .catch(() => toast.error('刷新 PAC 缓存失败'));
  };

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [proxyMode, setProxyMode] = useState(() => {
    if (preferences.proxy.disabled) return 'off';
    if (preferences.proxy.source === 'pac') return 'pac';
    if (preferences.proxy.source === 'inherit') return 'inherit';
    return 'manual';
  });
  const [pacInputMode, setPacInputMode] = useState(() =>
    preferences.proxy.pac?.source?.startsWith('file://') ? 'file' : 'url'
  );

  useEffect(() => {
    if (formik.dirty && formik.isValid) {
      // Don't auto-save PAC mode until a URL or file is actually selected.
      if (proxyMode === 'pac' && !formik.values.pac.source) return;
      debouncedSave(formik.values);
    }
    return () => {
      debouncedSave.flush();
    };
  }, [formik.values, formik.dirty, formik.isValid, debouncedSave, proxyMode]);

  return (
    <StyledWrapper>
      <div className="section-header">代理设置</div>
      <form className="bruno-form" onSubmit={formik.handleSubmit}>
        <div className="mb-3 flex items-center mt-2">
          <label className="settings-label" htmlFor="protocol">
            模式
          </label>
          <div className="flex items-center">
            <label className="flex items-center cursor-pointer" data-testid="off-proxy-mode">
              <input
                type="radio"
                name="mode"
                value="off"
                checked={proxyMode === 'off'}
                onChange={(e) => {
                  setProxyMode('off');
                  formik.setFieldValue('disabled', true);
                }}
                className="mr-1 cursor-pointer"
              />
              关闭
            </label>
            <label className="flex items-center ml-4 cursor-pointer" data-testid="manual-proxy-mode">
              <input
                type="radio"
                name="mode"
                value="manual"
                checked={proxyMode === 'manual'}
                onChange={(e) => {
                  setProxyMode('manual');
                  formik.setFieldValue('disabled', false);
                  formik.setFieldValue('source', 'manual');
                }}
                className="mr-1 cursor-pointer"
              />
              开启
            </label>
            <label className="flex items-center ml-4 cursor-pointer" data-testid="system-proxy-mode">
              <input
                type="radio"
                name="mode"
                value="inherit"
                checked={proxyMode === 'inherit'}
                onChange={(e) => {
                  setProxyMode('inherit');
                  formik.setFieldValue('disabled', false);
                  formik.setFieldValue('source', 'inherit');
                }}
                className="mr-1 cursor-pointer"
              />
              系统代理
            </label>
            <label className="flex items-center ml-4 cursor-pointer" data-testid="pac-proxy-mode">
              <input
                type="radio"
                name="mode"
                value="pac"
                checked={proxyMode === 'pac'}
                onChange={(e) => {
                  setProxyMode('pac');
                  formik.setFieldValue('disabled', false);
                  formik.setFieldValue('source', 'pac');
                }}
                className="mr-1 cursor-pointer"
              />
              PAC
            </label>
          </div>
        </div>
        {proxyMode === 'inherit' ? (
          <div className="mb-3 pt-1 text-muted system-proxy-settings">
            <SystemProxy />
          </div>
        ) : null}
        {proxyMode === 'manual' ? (
          <>
            <div className="mb-3 flex items-center">
              <label className="settings-label" htmlFor="protocol">
                协议
              </label>
              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="config.protocol"
                    value="http"
                    checked={formik.values.config.protocol === 'http'}
                    onChange={formik.handleChange}
                    className="mr-1"
                  />
                  HTTP
                </label>
                <label className="flex items-center ml-4">
                  <input
                    type="radio"
                    name="config.protocol"
                    value="https"
                    checked={formik.values.config.protocol === 'https'}
                    onChange={formik.handleChange}
                    className="mr-1"
                  />
                  HTTPS
                </label>
                <label className="flex items-center ml-4">
                  <input
                    type="radio"
                    name="config.protocol"
                    value="socks4"
                    checked={formik.values.config.protocol === 'socks4'}
                    onChange={formik.handleChange}
                    className="mr-1"
                  />
                  SOCKS4
                </label>
                <label className="flex items-center ml-4">
                  <input
                    type="radio"
                    name="config.protocol"
                    value="socks5"
                    checked={formik.values.config.protocol === 'socks5'}
                    onChange={formik.handleChange}
                    className="mr-1"
                  />
                  SOCKS5
                </label>
              </div>
            </div>
            <div className="mb-3 flex items-center">
              <label className="settings-label" htmlFor="config.hostname">
                主机名
              </label>
              <input
                id="config.hostname"
                type="text"
                name="config.hostname"
                className="block textbox"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                onChange={formik.handleChange}
                value={formik.values.config.hostname || ''}
              />
              {formik.touched.config?.hostname && formik.errors.config?.hostname ? (
                <div className="ml-3 text-red-500">{formik.errors.config.hostname}</div>
              ) : null}
            </div>
            <div className="mb-3 flex items-center">
              <label className="settings-label" htmlFor="config.port">
                端口
              </label>
              <input
                id="config.port"
                type="number"
                name="config.port"
                className="block textbox"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                onChange={formik.handleChange}
                value={formik.values.config.port}
              />
              {formik.touched.config?.port && formik.errors.config?.port ? (
                <div className="ml-3 text-red-500">{formik.errors.config.port}</div>
              ) : null}
            </div>
            <div className="mb-3 flex items-center">
              <label className="settings-label" htmlFor="config.auth.disabled">
                认证
              </label>
              <input
                id="config.auth.disabled"
                type="checkbox"
                name="config.auth.disabled"
                checked={!formik.values.config.auth.disabled}
                onChange={(e) => {
                  formik.setFieldValue('config.auth.disabled', !e.target.checked);
                }}
                className="mousetrap mr-0"
              />
            </div>
            <div>
              <div className="mb-3 flex items-center">
                <label className="settings-label" htmlFor="config.auth.username">
                  用户名
                </label>
                <input
                  id="config.auth.username"
                  type="text"
                  name="config.auth.username"
                  className="block textbox"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  value={formik.values.config.auth.username}
                  onChange={formik.handleChange}
                />
                {formik.touched.config?.auth?.username && formik.errors.config?.auth?.username ? (
                  <div className="ml-3 text-red-500">{formik.errors.config.auth.username}</div>
                ) : null}
              </div>
              <div className="mb-3 flex items-center">
                <label className="settings-label" htmlFor="config.auth.password">
                  密码
                </label>
                <div className="textbox flex flex-row items-center w-[13.2rem] h-[2.25rem] relative">
                  <input
                    id="config.auth.password"
                    type={passwordVisible ? `text` : 'password'}
                    name="config.auth.password"
                    className="outline-none w-[10.5rem] bg-transparent"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    value={formik.values.config.auth.password}
                    onChange={formik.handleChange}
                  />
                  <button
                    type="button"
                    className="btn btn-sm absolute right-0"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    {passwordVisible ? <IconEyeOff size={18} strokeWidth={2} /> : <IconEye size={18} strokeWidth={2} />}
                  </button>
                </div>
                {formik.touched.config?.auth?.password && formik.errors.config?.auth?.password ? (
                  <div className="ml-3 text-red-500">{formik.errors.config.auth.password}</div>
                ) : null}
              </div>
            </div>
            <div className="mb-3 flex items-center">
              <label className="settings-label" htmlFor="config.bypassProxy">
                代理绕过
              </label>
              <input
                id="config.bypassProxy"
                type="text"
                name="config.bypassProxy"
                className="block textbox"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                onChange={formik.handleChange}
                value={formik.values.config.bypassProxy || ''}
              />
              {formik.touched.config?.bypassProxy && formik.errors.config?.bypassProxy ? (
                <div className="ml-3 text-red-500">{formik.errors.config.bypassProxy}</div>
              ) : null}
            </div>
          </>
        ) : null}
        {proxyMode === 'pac' ? (
          <>
            <div className="mb-3">
              <div className="flex items-center">
                <label className="settings-label">PAC</label>
                <div className="pac-mode-toggle">
                  <button
                    type="button"
                    className={`pac-mode-btn ${pacInputMode === 'url' ? 'active' : ''}`}
                    onClick={() => {
                      setPacInputMode('url');
                      formik.setFieldValue('pac.source', '');
                    }}
                  >
                    URL
                  </button>
                  <button
                    type="button"
                    className={`pac-mode-btn ${pacInputMode === 'file' ? 'active' : ''}`}
                    onClick={() => {
                      setPacInputMode('file');
                      formik.setFieldValue('pac.source', '');
                    }}
                  >
                    文件
                  </button>
                </div>
                {pacInputMode === 'url' ? (
                  <input
                    id="pac.source"
                    type="text"
                    name="pac.source"
                    className="block textbox pac-source-input"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    onChange={formik.handleChange}
                    value={formik.values.pac.source || ''}
                    placeholder="https://example.com/proxy.pac"
                  />
                ) : (
                  <button
                    type="button"
                    className="textbox pac-source-input pac-file-btn"
                    onClick={() => {
                      window.ipcRenderer
                        .invoke('renderer:browse-pac-file')
                        .then((fileUrl) => {
                          if (fileUrl) {
                            formik.setFieldValue('pac.source', fileUrl);
                          }
                        })
                        .catch(() => toast.error('打开文件选择器失败'));
                    }}
                  >
                    {formik.values.pac.source
                      ? decodeURIComponent(formik.values.pac.source.split('/').pop())
                      : '选择文件'}
                  </button>
                )}
                {formik.touched.pac?.source && formik.errors.pac?.source ? (
                  <div className="ml-3 text-red-500">{formik.errors.pac.source}</div>
                ) : null}
              </div>
              <p className="pac-hint">
                {pacInputMode === 'url'
                  ? '输入 PAC 文件的 URL'
                  : '支持用于自动代理配置的 .pac 文件'}
              </p>
              {formik.values.pac.source ? (
                <span
                  className="text-link cursor-pointer hover:underline flex flex-row items-center w-fit mt-2"
                  onClick={handleRefreshPac}
                >
                  <IconRefresh size={14} strokeWidth={1.5} className="mr-1" />
                  重新获取
                </span>
              ) : null}
            </div>
          </>
        ) : null}
      </form>
    </StyledWrapper>
  );
};

export default ProxySettings;
