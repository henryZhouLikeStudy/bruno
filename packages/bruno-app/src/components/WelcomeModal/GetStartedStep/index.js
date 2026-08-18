import React from 'react';
import { IconPlus, IconDownload, IconFileImport, IconSend } from '@tabler/icons';
import StyledWrapper from './StyledWrapper';

const GetStartedStep = ({ onCreateCollection, onImportCollection, onOpenCollection, onStartRequest }) => (
  <StyledWrapper className="step-body">
    <div className="step-label">你的第一个集合</div>
    <div className="step-title">一切就绪！接下来做什么？</div>
    <div className="step-description">
      创建新集合以开始构建请求，或导入已有集合。
    </div>

    <div className="primary-actions">
      <button className="primary-action-card" onClick={onCreateCollection}>
        <div className="card-icon">
          <IconPlus size={20} stroke={1.5} />
        </div>
        <div className="card-title">创建集合</div>
        <div className="card-desc">从全新的 API 集合开始</div>
      </button>

      <button className="primary-action-card" onClick={onImportCollection}>
        <div className="card-icon">
          <IconDownload size={20} stroke={1.5} />
        </div>
        <div className="card-title">导入集合</div>
        <div className="card-desc">导入 Postman、OpenAPI/Swagger 或 Insomnia</div>
      </button>
    </div>

    <div className="secondary-actions">
      <button className="secondary-action" onClick={onOpenCollection}>
        <span className="secondary-icon">
          <IconFileImport size={16} stroke={1.5} />
        </span>
        <div>
          <div className="secondary-label">打开已有集合</div>
          <div className="secondary-desc">从文件系统打开 Bruno 集合</div>
        </div>
      </button>
      <button className="secondary-action" onClick={onStartRequest}>
        <span className="secondary-icon">
          <IconSend size={16} stroke={1.5} />
        </span>
        <div>
          <div className="secondary-label">从请求开始</div>
          <div className="secondary-desc">直接创建新的 HTTP 请求</div>
        </div>
      </button>
    </div>
  </StyledWrapper>
);

export default GetStartedStep;
