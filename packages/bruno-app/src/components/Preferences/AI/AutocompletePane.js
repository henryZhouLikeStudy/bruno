import { IconChevronDown } from '@tabler/icons';
import ToggleSwitch from 'components/ToggleSwitch';
import { getPlatformModifierKey } from 'utils/common/platform';

/**
 * Autocomplete tab content. Sibling of the Configuration tab inside
 * Preferences > AI.
 *
 *   - master AI off          → notice only; the whole card is hidden
 *   - no provider configured → notice in the card body, controls disabled
 *   - no enabled model       → notice in the card body, controls disabled
 *   - everything on          → fully interactive
 */

const TRIGGER_MODES = [
  {
    value: 'aggressive',
    label: '积极',
    description: '每次按键后都建议'
  },
  {
    value: 'debounced',
    label: '防抖',
    description: '暂停输入后建议（默认）'
  },
  {
    value: 'manual',
    label: '手动',
    description: `仅在 ${getPlatformModifierKey()}+\\ 时`
  }
];

const AutocompletePane = ({
  aiEnabled,
  enabled,
  model,
  triggerMode,
  availableModels,
  hasConfiguredProvider,
  onToggleEnabled,
  onChangeModel,
  onChangeTriggerMode
}) => {
  if (!aiEnabled) {
    return (
      <div className="autocomplete-tab flex flex-col gap-3">
        <div className="ai-empty-notice px-3.5 py-3 text-xs">
          在配置选项卡中开启 AI 才能使用自动补全。
        </div>
      </div>
    );
  }

  const hasUsableModel = availableModels.length > 0;
  const isInteractive = enabled && hasUsableModel;
  const activeTrigger = TRIGGER_MODES.find((m) => m.value === (triggerMode || 'debounced'));

  // Surface the most actionable blocker first when the user can't actually
  // get suggestions yet.
  let blockerMessage = null;
  if (!hasConfiguredProvider) {
    blockerMessage = '在配置选项卡中添加一个提供者的 API 密钥以启用自动补全。';
  } else if (!hasUsableModel) {
    blockerMessage = '没有可用模型。请在配置中的提供者卡片上启用一个模型。';
  }

  return (
    <div className="autocomplete-tab flex flex-col gap-3">
      <div className="autocomplete-card">
        <div className="autocomplete-header flex items-center justify-between gap-3 px-3.5 py-3">
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-[12.5px] font-semibold">行内自动补全</span>
            <span className="autocomplete-sub text-[11px]">
              在请求前、请求后和测试脚本中显示幽灵文本建议
            </span>
          </div>
          <ToggleSwitch
            size="xs"
            isOn={enabled}
            handleToggle={() => onToggleEnabled(!enabled)}
            data-testid="ai-autocomplete-enabled-toggle"
          />
        </div>
      </div>

      <div className={`autocomplete-card ${enabled ? '' : 'dimmed'}`}>
        {blockerMessage && (
          <div className="autocomplete-blocker px-3.5 py-3 text-[11px]">
            {blockerMessage}
          </div>
        )}

        <div className="autocomplete-row flex items-center justify-between gap-3 px-3.5 py-3">
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-[11.5px] font-medium">模型</span>
            <span className="autocomplete-sub text-[10.5px]">
              {hasUsableModel
                ? '建议使用轻量模型以获得更快的速度'
                : '暂无可用的模型'}
            </span>
          </div>
          <div className="model-select-wrap relative inline-flex items-center">
            <select
              className="model-select"
              value={model || ''}
              disabled={!isInteractive}
              onChange={(e) => onChangeModel(e.target.value)}
              aria-label="自动补全模型"
              data-testid="ai-autocomplete-model-select"
            >
              <option value="">自动（最快可用）</option>
              {availableModels.map((m) => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
            <IconChevronDown size={12} strokeWidth={1.75} className="model-select-chevron" />
          </div>
        </div>

        <div className="autocomplete-row flex items-center justify-between gap-3 px-3.5 py-3">
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-[11.5px] font-medium">触发方式</span>
            <span className="autocomplete-sub text-[10.5px]">
              {activeTrigger?.description}
            </span>
          </div>
          <div className="trigger-pills inline-flex" role="radiogroup" aria-label="触发模式">
            {TRIGGER_MODES.map((m) => {
              const isSelected = (triggerMode || 'debounced') === m.value;
              return (
                <button
                  key={m.value}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  className={`trigger-pill ${isSelected ? 'selected' : ''}`}
                  disabled={!isInteractive}
                  onClick={() => onChangeTriggerMode(m.value)}
                  data-testid={`ai-autocomplete-trigger-${m.value}`}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="autocomplete-row px-3.5 py-3">
          <div className="flex flex-col gap-1">
            <span className="text-[11.5px] font-medium">按键映射</span>
            <div className="autocomplete-keymap text-[10.5px]">
              <kbd>Tab</kbd> 接受 · <kbd>{getPlatformModifierKey()}</kbd>+<kbd>→</kbd> 接受单词 · <kbd>Esc</kbd> 取消 · <kbd>{getPlatformModifierKey()}</kbd>+<kbd>\</kbd> 触发
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutocompletePane;
