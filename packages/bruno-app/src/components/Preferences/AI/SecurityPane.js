import { useState } from 'react';
import { IconPlus, IconTrash } from '@tabler/icons';
import ToggleSwitch from 'components/ToggleSwitch';

const BUILT_IN_HEADER_EXAMPLES = [
  'Authorization',
  'Proxy-Authorization',
  'Cookie',
  'Set-Cookie',
  'X-API-Key',
  'X-Auth-Token',
  'X-Access-Token',
  'X-CSRF-Token'
];

const normalize = (raw) => String(raw || '').trim();

/**
 * Compact editor for a case-insensitive name list. Used for both custom
 * header names and custom variable names — the shape is identical.
 */

const CHIP_MAX_LENGTH = 200;
const CHIP_MAX_COUNT = 200;

const ChipListEditor = ({ list, placeholder, onChange, addTestId, inputTestId, removeTestIdPrefix }) => {
  const [draft, setDraft] = useState('');
  const values = Array.isArray(list) ? list : [];
  const atCapacity = values.length >= CHIP_MAX_COUNT;

  const handleAdd = () => {
    const value = normalize(draft);
    if (!value || value.length > CHIP_MAX_LENGTH || atCapacity) return;
    if (values.some((v) => v.toLowerCase() === value.toLowerCase())) {
      setDraft('');
      return;
    }
    onChange([...values, value]);
    setDraft('');
  };

  const handleRemove = (name) => {
    onChange(values.filter((v) => v !== name));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const trimmedDraft = normalize(draft);
  const draftTooLong = trimmedDraft.length > CHIP_MAX_LENGTH;
  const addDisabled = !trimmedDraft || draftTooLong || atCapacity;

  return (
    <>
      <div className="security-add-row flex items-center gap-2">
        <input
          type="text"
          className="security-input flex-1"
          placeholder={placeholder}
          value={draft}
          maxLength={CHIP_MAX_LENGTH}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={atCapacity}
          data-testid={inputTestId}
        />
        <button
          type="button"
          className="security-add-btn inline-flex items-center gap-1 text-[11px] font-medium"
          onClick={handleAdd}
          disabled={addDisabled}
          data-testid={addTestId}
        >
          <IconPlus size={13} strokeWidth={1.75} />
          添加
        </button>
      </div>

      {atCapacity && (
        <span className="security-sub text-[10.5px]">
          已达到 {CHIP_MAX_COUNT} 条上限。请移除一条后再添加。
        </span>
      )}

      {values.length > 0 && (
        <ul className="security-chip-list flex flex-wrap gap-1.5">
          {values.map((name) => (
            <li key={name} className="security-chip inline-flex items-center gap-1 min-w-0 max-w-full">
              <span className="security-chip-text">{name}</span>
              <button
                type="button"
                className="security-chip-remove"
                onClick={() => handleRemove(name)}
                aria-label={`移除 ${name}`}
                data-testid={removeTestIdPrefix ? `${removeTestIdPrefix}-${name}` : undefined}
              >
                <IconTrash size={11} strokeWidth={1.75} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

const SecurityPane = ({
  aiEnabled,
  redactHeaders,
  redactBody,
  redactVariables,
  redactResponse,
  customRedactedHeaders,
  customRedactedVariables,
  onToggleRedactHeaders,
  onToggleRedactBody,
  onToggleRedactVariables,
  onToggleRedactResponse,
  onChangeCustomRedactedHeaders,
  onChangeCustomRedactedVariables
}) => {
  if (!aiEnabled) {
    return (
      <div className="security-tab flex flex-col gap-3">
        <div className="ai-empty-notice px-3.5 py-3 text-xs">
          在配置选项卡中开启 AI 以配置脱敏。
        </div>
      </div>
    );
  }

  return (
    <div className="security-tab flex flex-col gap-3">
      <div className="ai-empty-notice px-3.5 py-3 text-xs">
        敏感数据会在上下文发送给 AI 提供者之前自动脱敏。如有需要可关闭保护，或添加要脱敏的自定义请求头和变量。
      </div>

      <div className="security-card">
        <div className="security-row flex items-center justify-between gap-3 px-3.5 py-3">
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-[12.5px] font-semibold">对敏感请求头值脱敏</span>
            <span className="security-sub text-[11px]">
              在请求上下文中对 Authorization、cookie、API 密钥等包含凭据的请求头进行掩码处理。
            </span>
          </div>
          <ToggleSwitch
            size="xs"
            isOn={redactHeaders}
            handleToggle={() => onToggleRedactHeaders(!redactHeaders)}
            data-testid="ai-security-headers-toggle"
          />
        </div>

        <div className="security-row flex items-center justify-between gap-3 px-3.5 py-3">
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-[12.5px] font-semibold">对敏感请求体键脱敏</span>
            <span className="security-sub text-[11px]">
              对 JSON 和 GraphQL 变量中 <code>password</code>、<code>*_token</code>、<code>secret</code> 等键下的值进行掩码。结构和非敏感字段仍会保留。
            </span>
          </div>
          <ToggleSwitch
            size="xs"
            isOn={redactBody}
            handleToggle={() => onToggleRedactBody(!redactBody)}
            data-testid="ai-security-body-toggle"
          />
        </div>

        <div className="security-row flex items-center justify-between gap-3 px-3.5 py-3">
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-[12.5px] font-semibold">对响应值脱敏</span>
            <span className="security-sub text-[11px]">
              仅发送响应结构——真实值替换为类型占位符（<code>&lt;string&gt;</code>、<code>&lt;number&gt;</code>）。关闭此选项以发送实际响应体。
            </span>
          </div>
          <ToggleSwitch
            size="xs"
            isOn={redactResponse}
            handleToggle={() => onToggleRedactResponse(!redactResponse)}
            data-testid="ai-security-response-toggle"
          />
        </div>

        <div className="security-row flex items-center justify-between gap-3 px-3.5 py-3">
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-[12.5px] font-semibold">对机密变量值脱敏</span>
            <span className="security-sub text-[11px]">
              对名称像机密的变量值进行掩码。明确标记为 <em>secret</em> 的变量始终会脱敏，不受此开关影响。
            </span>
          </div>
          <ToggleSwitch
            size="xs"
            isOn={redactVariables}
            handleToggle={() => onToggleRedactVariables(!redactVariables)}
            data-testid="ai-security-variables-toggle"
          />
        </div>
      </div>

      <div className="security-card">
        <div className="security-row flex flex-col gap-2 px-3.5 py-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-[12.5px] font-semibold">自定义脱敏请求头</span>
            <span className="security-sub text-[11px]">
              在默认列表之外始终进行掩码的精确、不区分大小写的请求头名称。
            </span>
          </div>
          <ChipListEditor
            list={customRedactedHeaders}
            placeholder="X-Custom-Token"
            onChange={onChangeCustomRedactedHeaders}
            inputTestId="ai-security-custom-header-input"
            addTestId="ai-security-custom-header-add"
            removeTestIdPrefix="ai-security-custom-header-remove"
          />
        </div>

        <div className="security-row flex flex-col gap-2 px-3.5 py-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-[12.5px] font-semibold">自定义脱敏变量</span>
            <span className="security-sub text-[11px]">
              Bruno 将变量列出给模型时，这些变量名对应的值始终会被掩码——用于你希望脱敏但尚未标记为 <em>secret</em> 的内容。
            </span>
          </div>
          <ChipListEditor
            list={customRedactedVariables}
            placeholder="MY_SESSION_TOKEN"
            onChange={onChangeCustomRedactedVariables}
            inputTestId="ai-security-custom-var-input"
            addTestId="ai-security-custom-var-add"
            removeTestIdPrefix="ai-security-custom-var-remove"
          />
        </div>

        <div className="security-row flex flex-col gap-1 px-3.5 py-3">
          <span className="text-[11px] font-medium security-sub">默认已覆盖</span>
          <div className="security-builtin flex flex-wrap gap-1.5">
            {BUILT_IN_HEADER_EXAMPLES.map((name) => (
              <span key={name} className="security-builtin-chip">{name}</span>
            ))}
            <span className="security-builtin-more text-[10.5px]">
              以及任何匹配 <code>token</code>、<code>secret</code>、<code>password</code> 或 <code>api_key</code> 的名称。
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityPane;
