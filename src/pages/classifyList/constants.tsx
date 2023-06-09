import React from 'react';
import { Button, Typography, Badge, Tag, Space } from '@arco-design/web-react';
import IconText from './icons/text.svg';
import IconHorizontalVideo from './icons/horizontal.svg';
import IconVerticalVideo from './icons/vertical.svg';

const { Text } = Typography;

const ContentIcon = [
  <IconText key={0} />,
  <IconHorizontalVideo key={1} />,
  <IconVerticalVideo key={2} />,
];

export function getColumns(
  callback: (record: Record<string, any>, type: string) => Promise<void>
) {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (value) => <Text copyable>{value}</Text>,
    },
    {
      title: '分类名',
      dataIndex: 'name',
      render: (value) => <Text copyable>{value}</Text>,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: (value) => <Text copyable>{value}</Text>,
    },
    {
      title: '操作',
      dataIndex: 'operations',
      headerCellStyle: { paddingLeft: '15px' },
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            status={'danger'}
            onClick={() => callback(record, 'delete')}
          >
            删除分类
          </Button>
          <Button
            type="primary"
            size="small"
            status={'warning'}
            onClick={() => callback(record, 'update')}
          >
            修改分类
          </Button>
          <Button
            type="primary"
            size="small"
            status={'warning'}
            onClick={() => callback(record, 'create')}
          >
            创建子分类
          </Button>
        </Space>
      ),
    },
  ];
}

export default () => ContentIcon;
