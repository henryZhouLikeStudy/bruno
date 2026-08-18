import React, { useEffect, useCallback, useMemo, useRef } from 'react';
import { useFormik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import { savePreferences, updateActivePreferencesTab } from 'providers/ReduxStore/slices/app';
import StyledWrapper from './StyledWrapper';
import * as Yup from 'yup';
import debounce from 'lodash/debounce';
import toast from 'react-hot-toast';
import get from 'lodash/get';
// Commented out while there are no active beta features. Re-enable this import when
// adding a beta feature its keys are then referenced as BETA_FEATURE_IDS.MY_FEATURE in the BETA_FEATURES array.
import { IconArrowRight, IconExternalLink } from '@tabler/icons';
import ToggleSwitch from 'components/ToggleSwitch';

import { BETA_FEATURES as BETA_FEATURE_IDS } from 'utils/beta-features';
import { getDocsUrlWithVersion } from 'utils/url';

/**
 * UI metadata for the Beta Features section in Preferences — one entry per toggle.
 * The whole tab is data-driven from this array: the form fields, validation schema,
 * initial values and the rendered checkboxes are all generated from it.
 *
 * Each entry has the shape { id, label, description }:
 *   - id          (required) the feature key. MUST be a value from BETA_FEATURES in
 *                 utils/beta-features.js (imported here as BETA_FEATURE_IDS). It is
 *                 used as the preference key (preferences.beta[id]), the form field
 *                 name and the checkbox id, so it must be stable and unique.
 *   - label       (required) short name shown next to the checkbox.
 *   - description (required) one-line explanation shown under the label.
 *   - docsUrl     (optional) URL to the documentation for the feature.
 *   - action      (optional) object with { label, tab } to render a button that navigates to a specific preferences tab. The label is the button text, and the tab is the tab key (e.g. 'ai', 'cache').
 *
 * To add a beta feature:
 *   1. Add its key to BETA_FEATURES in utils/beta-features.js (e.g. MY_FEATURE: 'my-feature').
 *   2. Add an entry to the array below using BETA_FEATURE_IDS.MY_FEATURE.
 *   3. Gate the feature in code with useBetaFeature(BETA_FEATURES.MY_FEATURE).
 *
 * When the array is empty, the Beta tab shows "No beta features are currently available",
 * so a feature can be hidden by simply removing or commenting out its entry.
 */
const BETA_FEATURES = [
  {
    id: BETA_FEATURE_IDS.AI_ASSISTANT,
    label: 'AI 助手',
    description:
      '直接从请求选项卡生成脚本、测试和文档。包含上下文聊天、脚本自动补全，并支持使用你自己的 API 密钥连接 OpenAI、Anthropic 和 OpenAI 兼容提供者。',
    action: { label: '前往 AI 设置', tab: 'ai' },
    docsUrl: 'https://link.usebruno.com/docs/ai'
  },
  {
    id: BETA_FEATURE_IDS.FILE_CACHE,
    label: '文件缓存',
    description:
      '通过在本地磁盘保留缓存，加快集合打开速度。可随时在缓存设置中开启或清除。',
    action: { label: '前往缓存设置', tab: 'cache' }
  },
  {
    id: BETA_FEATURE_IDS.AKAMAI_EDGEGRID,
    label: 'Akamai EdgeGrid',
    description:
      '使用 Akamai EdgeGrid 认证方案对请求签名。可在任意请求、文件夹或集合的认证类型下拉框中选择。',
    docsUrl: 'https://link.usebruno.com/docs/auth'
  },
  {
    id: BETA_FEATURE_IDS.MOCK_SERVER,
    label: 'Mock 服务器',
    description: '使用集合中定义的响应示例运行本地 Mock 服务器。为前端开发提供 Mock API 响应，无需真实后端。',
    toggle: true
  }
];

const Beta = ({ close }) => {
  const preferences = useSelector((state) => state.app.preferences);
  const dispatch = useDispatch();

  // Generate validation schema dynamically from beta features
  const generateValidationSchema = () => {
    const schemaShape = {};
    BETA_FEATURES.forEach((feature) => {
      schemaShape[feature.id] = Yup.boolean();
    });
    return Yup.object().shape(schemaShape);
  };

  // Generate initial values dynamically from beta features
  const generateInitialValues = () => {
    const initialValues = {};
    BETA_FEATURES.forEach((feature) => {
      initialValues[feature.id] = get(preferences, `beta.${feature.id}`, false);
    });
    return initialValues;
  };

  // BETA_FEATURES is static, so the schema never actually changes across renders
  const betaSchema = useMemo(() => generateValidationSchema(), []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: generateInitialValues(),
    validationSchema: betaSchema,
    onSubmit: async (values) => {
      try {
        const newPreferences = await betaSchema.validate(values, { abortEarly: true });
        handleSave(newPreferences);
      } catch (error) {
        console.error('Beta preferences validation error:', error.message);
      }
    }
  });

  const handleSave = useCallback((newBetaPreferences) => {
    dispatch(
      savePreferences({
        ...preferences,
        beta: {
          ...preferences.beta,
          ...newBetaPreferences
        }
      })
    )
      .catch((err) => console.log(err) && toast.error('更新测试版偏好设置失败'));
  }, [dispatch, preferences]);

  const handleSaveRef = useRef(handleSave);
  handleSaveRef.current = handleSave;

  const debouncedSave = useCallback(
    debounce((values) => {
      betaSchema.validate(values, { abortEarly: true })
        .then((validatedValues) => {
          handleSaveRef.current(validatedValues);
        })
        .catch((error) => {
        });
    }, 500),
    [betaSchema]
  );

  // Auto-save when form values change
  useEffect(() => {
    if (formik.dirty && formik.isValid) {
      debouncedSave(formik.values);
    }
    return () => {
      debouncedSave.flush();
    };
  }, [formik.values, formik.dirty, formik.isValid, debouncedSave]);

  const hasAnyBetaFeatures = BETA_FEATURES.length > 0;

  const goToTab = useCallback((tab) => {
    dispatch(updateActivePreferencesTab({ tab }));
  }, [dispatch]);

  return (
    <StyledWrapper>
      <div className="section-header">测试版功能</div>
      <form onSubmit={formik.handleSubmit}>
        <div className="mb-6">
          <p className="text-gray-500 dark:text-gray-400 mb-4 text-wrap">
            测试版功能是正式发布前可能会变化的实验性预览。欢迎试用并反馈。
          </p>
        </div>

        <div className="beta-feature-list">
          {BETA_FEATURES.map((feature) => (
            <div key={feature.id} className="beta-feature-item">
              <div className="beta-feature-header">
                <span className="beta-feature-title select-none font-medium" id={`${feature.id}-label`}>
                  {feature.label}
                </span>
              </div>
              <div className="beta-feature-description text-xs text-gray-500 dark:text-gray-400 flex">
                {feature.description}
                {feature.toggle && (
                  <div className="ml-auto">
                    <ToggleSwitch
                      size="xs"
                      isOn={formik.values[feature.id]}
                      handleToggle={() => formik.setFieldValue(feature.id, !formik.values[feature.id])}
                      data-testid="mock-server-beta-toggle"
                    />
                  </div>
                )}
              </div>
              {(feature.action || feature.docsUrl) && (
                <div className="beta-feature-links">
                  {feature.action && (
                    <button
                      type="button"
                      className="beta-feature-link"
                      onClick={() => goToTab(feature.action.tab)}
                    >
                      <span>{feature.action.label}</span>
                      <IconArrowRight size={14} strokeWidth={1.5} />
                    </button>
                  )}
                  {feature.docsUrl && (
                    <a
                      className="beta-feature-link"
                      href={getDocsUrlWithVersion(feature.docsUrl)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span>查看文档</span>
                      <IconExternalLink size={14} strokeWidth={1.5} />
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {!hasAnyBetaFeatures && (
          <div className="no-features-message">
            <p>当前没有可用的测试版功能</p>
          </div>
        )}
      </form>
    </StyledWrapper>
  );
};

export default Beta;
