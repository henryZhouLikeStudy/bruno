import { useState } from 'react';
import { IconPlus, IconServer } from '@tabler/icons';
import SidebarSection from 'components/Sidebar/SidebarSection';
import MockServers from 'components/MockServer/Sidebar/MockServers';
import CreateMockServerModal from 'components/MockServer/CreateMockServerModal';
import ActionIcon from 'ui/ActionIcon';

const MockServersSection = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const sectionActions = (
    <ActionIcon
      label="创建 Mock 服务器"
      onClick={() => setCreateModalOpen(true)}
      data-testid="mock-servers-create-btn"
    >
      <IconPlus size={14} stroke={1.5} aria-hidden="true" />
    </ActionIcon>
  );

  return (
    <>
      {createModalOpen && (
        <CreateMockServerModal onClose={() => setCreateModalOpen(false)} />
      )}
      <SidebarSection
        id="mock-servers"
        title="Mock 服务器"
        icon={IconServer}
        actions={sectionActions}
        className="mock-servers-section"
      >
        <MockServers />
      </SidebarSection>
    </>
  );
};

export default MockServersSection;
