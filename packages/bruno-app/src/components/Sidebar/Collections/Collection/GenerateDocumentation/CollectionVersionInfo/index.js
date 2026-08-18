import React, { memo, Fragment } from 'react';

const CollectionVersionInfo = ({ name, version, folderCount = 0, requestCount = 0, environmentCount = 0 }) => {
  const folderLabel = '文件夹';
  const requestLabel = '请求';

  return (
    <div className="version-info" data-testid="version-info">
      <div className="version-line">
        <span className="collection-name" data-testid="collection-name">{name}</span>
        <span className="version-value" data-testid="version-value">{`版本：${version || '未设置'}`}</span>
      </div>
      <p className="version-summary" data-testid="version-summary">
        <span>{`${folderCount} ${folderLabel}`}</span>
        <span className="version-dot" aria-hidden="true" />
        <span>{`${requestCount} ${requestLabel}`}</span>
        {environmentCount === 0 ? (
          <Fragment>
            <span className="version-dot" aria-hidden="true" />
            <span>0 个环境</span>
          </Fragment>
        ) : null}
      </p>
    </div>
  );
};

export default memo(CollectionVersionInfo);
