import React from 'react';
import {
  IconFolder as IconFolderTabler,
  IconGitFork,
  IconLock,
  IconRocket
} from '@tabler/icons';
import StyledWrapper from './StyledWrapper';

const highlights = [
  {
    icon: IconFolderTabler,
    title: '仅文件系统',
    desc: '集合是你磁盘上的普通文件。没有云同步，没有专有锁定。'
  },
  {
    icon: IconGitFork,
    title: '支持 Git',
    desc: '每个请求都是一个可读文件。提交、分支、评审和协作都可以使用你已熟悉的工具。'
  },
  {
    icon: IconLock,
    title: '注重隐私',
    desc: '无需账户，无需登录。Bruno 完全离线运行，你的 API 密钥永远不会离开你的机器。'
  },
  {
    icon: IconRocket,
    title: '快速且轻量',
    desc: '为迅捷而生。没有臃肿的运行时，只有快速、专注的 API 探索和测试工具。'
  }
];

const WelcomeStep = () => (
  <StyledWrapper className="step-body">
    <div className="highlights">
      {highlights.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.title} className="highlight-item">
            <div className="highlight-icon">
              <Icon size={18} stroke={1.5} />
            </div>
            <div>
              <div className="highlight-title">{item.title}</div>
              <div className="highlight-desc">{item.desc}</div>
            </div>
          </div>
        );
      })}
    </div>
  </StyledWrapper>
);

export default WelcomeStep;
