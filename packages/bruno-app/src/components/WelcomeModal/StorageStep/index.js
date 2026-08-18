import React from 'react';
import StyledWrapper from './StyledWrapper';

const StorageStep = ({ collectionLocation, onBrowse }) => (
  <StyledWrapper className="step-body">
    <div className="step-label">存储</div>
    <div className="step-title">要将集合存储在哪里？</div>
    <div className="step-description">
      Bruno 将集合作为普通文件保存在文件系统中，非常适合使用 Git 进行版本控制。
    </div>

    <div className="location-input-group">
      <div
        className="location-path-display"
        onClick={onBrowse}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onBrowse();
          }
        }}
        role="button"
        tabIndex={0}
      >
        {collectionLocation ? (
          <span className="path-text">{collectionLocation}</span>
        ) : (
          <span className="path-text path-placeholder">点击选择文件夹...</span>
        )}
        <span className="browse-label">浏览</span>
      </div>
    </div>
    <div className="location-hint">
      每个集合和工作区都会在该目录下拥有自己的文件夹。你可以稍后更改此设置。
    </div>
  </StyledWrapper>
);

export default StorageStep;
