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

export function getColumns() {
  return [
    {
      title: '记录ID',
      dataIndex: 'id',
      render: (value) => <Text copyable>{value}</Text>,
    },
    {
      title: '账号',
      dataIndex: 'user',
      render: (value) => <Text copyable>{value.username}</Text>,
    },
    {
      title: '姓名',
      dataIndex: 'user',
      render: (value) => <Text copyable>{value.name}</Text>,
    },
    {
      title: '学号',
      dataIndex: 'user',
      render: (value) => <Text copyable>{value.studentId}</Text>,
    },
    {
      title: '邮箱',
      dataIndex: 'user',
      render: (value) => <Text copyable>{value.email}</Text>,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: (value) => <Text copyable>{value}</Text>,
    },
    {
      title: '货物名',
      dataIndex: 'cargo',
      render: (value) => <Text copyable>{value.name}</Text>,
    },
    {
      title: '位置',
      dataIndex: 'location',
      render: (value) => <Text copyable>{value.name}</Text>,
    },
  ];
}

export default () => ContentIcon;
