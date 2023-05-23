import React from 'react';
import { Button, Typography, Badge, Tag, Space } from '@arco-design/web-react';
import IconText from './icons/text.svg';
import IconHorizontalVideo from './icons/horizontal.svg';
import IconVerticalVideo from './icons/vertical.svg';
import dayjs from 'dayjs';
import styles from './style/index.module.less';

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
      title: '账号',
      dataIndex: 'username',
      render: (value) => <Text copyable>{value}</Text>,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      render: (value) => <Text copyable>{value}</Text>,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      render: (value) => <Text copyable>{value}</Text>,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: (value) => <Text copyable>{value}</Text>,
    },
    {
      title: '角色',
      dataIndex: 'access',
      render: (value) => <Text copyable>{value}</Text>,
    },
    {
      title: '操作',
      dataIndex: 'operations',
      headerCellStyle: { paddingLeft: '15px' },
      render: (_, record) => (
        <Space>
          {
            record.access!=='admin'? <Button
                  type="primary"
                  size="small"
                  status={'warning'}
                  onClick={() => callback(record, 'reset')}
              >
                重置密码
              </Button>:''
          }
          {
            record.access!=='admin'? <Button
                type="primary"
                size="small"
                status={'danger'}
                onClick={() => callback(record, 'delete')}
            >
              删除用户
            </Button>:''
          }
          {
            record.access!=='admin'? <Button
                type="primary"
                size="small"
                status={'default'}
                onClick={() => callback(record, 'update')}
            >
              修改用户
            </Button>:''
          }
        </Space>
      ),
    },
  ];
}

export default () => ContentIcon;
