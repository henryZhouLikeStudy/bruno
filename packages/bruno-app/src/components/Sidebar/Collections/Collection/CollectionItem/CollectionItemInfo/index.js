import React from 'react';
import Modal from 'components/Modal';
import Help from 'components/Help';

const CollectionItemInfo = ({ item, onClose }) => {
  const { name, filename, type } = item;

  return (
    <Modal
      size="md"
      title="信息"
      handleCancel={onClose}
      hideCancel={true}
      hideFooter={true}
    >
      <div className="w-fit flex flex-col h-full">
        <table className="w-full border-collapse">
          <tbody>
            <tr className="">
              <td className="py-2 px-2 text-left text-muted ">
                {type == 'folder' ? '文件夹名称' : '请求名称'}
              </td>
              <td className="py-2 px-2 text-nowrap truncate max-w-[500px]" title={name}>
                <span className="mr-2">:</span>{name}
              </td>
            </tr>
            <tr className="">
              <td className="py-2 px-2 text-left text-muted flex items-center">
                {type == 'folder' ? '文件夹名称' : '文件名称'}
                <small className="font-normal text-muted ml-1">（文件系统中）</small>
                {type == 'folder' ? (
                  <Help width="300">
                    <p>
                      文件系统上的文件夹名称。
                    </p>
                  </Help>
                ) : (
                  <Help width="300">
                    <p>
                      Bruno 将每个请求保存为集合文件夹中的一个文件。
                    </p>
                  </Help>
                )}
              </td>
              <td className="py-2 px-2 break-all text-nowrap truncate max-w-[500px]" title={filename}>
                <span className="mr-2">:</span>
                {filename}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Modal>
  );
};

export default CollectionItemInfo;
