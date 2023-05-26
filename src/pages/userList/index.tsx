import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Table,
  Card,
  PaginationProps,
  Button,
  Notification,
  Space,
  Typography,
  Modal,
  Form,
  Input,
  Upload,
  Message,
  Spin,
} from '@arco-design/web-react';
import PermissionWrapper from '@/components/PermissionWrapper';
import { IconPlus, IconUpload } from '@arco-design/web-react/icon';
import SearchForm from './form';
import styles from './style/index.module.less';
import { getColumns } from './constants';
import {
  createUser,
  deleteUser,
  excelImporter,
  getAllUser,
  getUserInfo,
  resetPassword,
  updateUser,
} from '@/api/user';
import { FormInstance } from '@arco-design/web-react/es/Form';

const { Title } = Typography;

interface UserInfo {
  name?: string;
  username?: string;
  email?: string;
  studentId?: string;
  avatar?: string;
}

function UserList() {
  const tableCallback = async (record, type) => {
    switch (type) {
      case 'reset':
        setLoading(true);
        resetPassword({ id: record.id })
          .then((res) => {
            fetchData();
            Notification.success({
              title: '修改成功',
              content: `默认密码 ${res}!`,
            });
          })
          .catch((e) => {
            Message.error(`修改密码失败: ${e}`);
          })
          .finally(() => {
            setLoading(false);
          });
        break;
      case 'delete':
        deleteUser({ id: record.id })
          .then((res) => {
            fetchData();
            Message.success(`删除成功`);
          })
          .catch((e) => {
            Message.error(`修改密码失败: ${e}`);
          })
          .finally(() => {
            setLoading(false);
          });
        break;
      case 'update':
        setIsCreate(false);
        setVisible(true);
        setModalTitle('修改用户信息');
        setUserId(record.id);
        getUserInfo({ id: record.id })
          .then((res) => {
            //存store
            formRef.current.setFieldsValue(res);
          })
          .catch((e) => {
            Message.error(e);
          });
        break;
    }
  };

  const [data, setData] = useState([]);
  const [pagination, setPatination] = useState<PaginationProps>({
    sizeCanChange: true,
    showTotal: true,
    pageSize: 10,
    current: 1,
    pageSizeChangeResetCurrent: true,
  });
  const [loading, setLoading] = useState(true);
  const [formParams, setFormParams] = useState({});
  const columns = useMemo(() => getColumns(tableCallback), []);
  const [visible, setVisible] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [modalTitle, setModalTitle] = useState('创建用户');
  const [userId, setUserId] = useState('');
  const formRef = useRef<FormInstance>();

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize, JSON.stringify(formParams)]);

  function fetchData() {
    const { current, pageSize } = pagination;
    setLoading(true);

    getAllUser({ current, pageSize, ...formParams })
      .then((res) => {
        setData(res.list);
        setPatination({
          ...pagination,
          current,
          pageSize,
          total: res.total,
        });
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function onChangeTable({ current, pageSize }) {
    setPatination({
      ...pagination,
      current,
      pageSize,
    });
  }

  function handleSearch(params) {
    setPatination({ ...pagination, current: 1 });
    setFormParams(params);
  }

  const onOk = () => {
    formRef.current.validate().then((values) => {
      const { name, username, email, studentId } = values;
      setLoading(true);
      if (isCreate) {
        createUser({
          name,
          username,
          email,
          studentId,
        })
          .then((res) => {
            fetchData();
            Notification.success({
              title: '创建成功',
              content: `默认密码 ${res}!`,
            });
          })
          .catch((e) => {
            Message.error('新增失败: ' + e);
          })
          .finally(() => {
            setLoading(false);
            setVisible(false);
          });
      } else {
        updateUser({
          name,
          username,
          email,
          studentId,
          id: userId,
        })
          .then((res) => {
            fetchData();
            Message.success('修改成功');
          })
          .catch((e) => {
            Message.error('修改失败: ' + e);
          })
          .finally(() => {
            setLoading(false);
            setVisible(false);
          });
      }
      formRef.current.clearFields();
    });
  };
  const onCancel = () => {
    setVisible(false);
    formRef.current.clearFields();
  };

  const handleUpload = async (file) => {
    const formData = new FormData();
    setLoading(true);
    formData.append('file', file.originFile);
    excelImporter(formData)
      .then((res) => {
        console.log(res);
        Message.success('导入成功');
        fetchData();
      })
      .catch((e) => {
        Message.error('失败: ' + e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Card>
      <Title heading={6}>用户管理</Title>
      <SearchForm onSearch={handleSearch} />
      <PermissionWrapper
        requiredPermissions={[
          { resource: 'menu.list.searchTable', actions: ['write'] },
        ]}
      >
        <div className={styles['button-group']}>
          <Space>
            <Button
              onClick={() => {
                setIsCreate(true);
                setVisible(true);
                setModalTitle('创建用户');
                setUserId('');
              }}
              type={'primary'}
              icon={<IconPlus />}
            >
              创建用户
            </Button>
            <Upload
              limit={1}
              fileList={null}
              accept={'.xlsx'}
              onChange={(files) => handleUpload(files[0])}
            >
              <Button icon={<IconUpload />} status={'success'} type={'primary'}>
                导入用户
              </Button>
            </Upload>
          </Space>
        </div>
      </PermissionWrapper>
      <Spin loading={loading}>
        <Table
          rowKey="id"
          loading={loading}
          onChange={onChangeTable}
          pagination={pagination}
          columns={columns}
          data={data}
        />
      </Spin>
      <Modal
        title={modalTitle}
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
        autoFocus={false}
        focusLock={true}
      >
        <Form ref={formRef} autoComplete="off">
          <Form.Item rules={[{ required: true }]} field={'name'} label="姓名">
            <Input allowClear placeholder="请输入姓名..." />
          </Form.Item>
          <Form.Item
            rules={[{ required: true }]}
            field={'username'}
            label="用户名"
          >
            <Input allowClear placeholder="请输入用户名..." />
          </Form.Item>
          <Form.Item rules={[{ required: true }]} field={'email'} label="邮箱">
            <Input allowClear placeholder="请输入邮箱..." />
          </Form.Item>
          <Form.Item
            rules={[{ required: true }]}
            field={'studentId'}
            label="学号"
          >
            <Input allowClear placeholder="请输入学号..." />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}

export default UserList;
