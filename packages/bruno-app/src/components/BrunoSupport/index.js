import React from 'react';
import Modal from 'components/Modal/index';
import { IconSpeakerphone, IconBrandTwitter, IconBrandGithub, IconBrandDiscord, IconBook } from '@tabler/icons';
import StyledWrapper from './StyledWrapper';

const BrunoSupport = ({ onClose }) => {
  return (
    <StyledWrapper>
      <Modal size="sm" title="支持" handleCancel={onClose} hideFooter={true}>
        <div className="collection-options">
          <div className="mt-2">
            <a href="https://docs.usebruno.com" target="_blank" className="flex items-end">
              <IconBook size={18} strokeWidth={2} />
              <span className="label ml-2">文档</span>
            </a>
          </div>
          <div className="mt-2">
            <a href="https://github.com/usebruno/bruno/issues" target="_blank" className="flex items-end">
              <IconSpeakerphone size={18} strokeWidth={2} />
              <span className="label ml-2">报告问题</span>
            </a>
          </div>
          <div className="mt-2">
            <a href="https://discord.com/invite/KgcZUncpjq" target="_blank" className="flex items-end">
              <IconBrandDiscord size={18} strokeWidth={2} />
              <span className="label ml-2">Discord 社区</span>
            </a>
          </div>
          <div className="mt-2">
            <a href="https://github.com/usebruno/bruno" target="_blank" className="flex items-end">
              <IconBrandGithub size={18} strokeWidth={2} />
              <span className="label ml-2">GitHub 仓库</span>
            </a>
          </div>
          <div className="mt-2">
            <a href="https://twitter.com/use_bruno" target="_blank" className="flex items-end">
              <IconBrandTwitter size={18} strokeWidth={2} />
              <span className="label ml-2">Twitter</span>
            </a>
          </div>
        </div>
      </Modal>
    </StyledWrapper>
  );
};

export default BrunoSupport;
