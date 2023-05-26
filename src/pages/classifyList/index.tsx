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
  Tree,
} from '@arco-design/web-react';
import PermissionWrapper from '@/components/PermissionWrapper';
import { IconDownload, IconPlus } from '@arco-design/web-react/icon';
import SearchForm from './form';
import styles from './style/index.module.less';
import { getColumns } from './constants';
import { FormInstance } from '@arco-design/web-react/es/Form';
import {
  createClassify,
  deleteClassify,
  getAllClassify,
  getClassifyDetail,
  updateClassify,
} from '@/api/classify';
import { getUserInfo } from '@/api/user';

const { Title } = Typography;

function ClassifyList() {
  const tableCallback = async (record, type) => {
    switch (type) {
      case 'delete':
        deleteClassify({ id: record.id })
          .then((res) => {
            fetchData();
            Message.success(`删除成功`);
          })
          .catch((e) => {
            Message.error(`${e}`);
          })
          .finally(() => {
            setLoading(false);
          });
        break;
      case 'update':
        setIsCreate(false);
        setVisible(true);
        setModalTitle('修改分类');
        setClassifyId(record.id);
        getClassifyDetail({ id: record.id })
          .then((res) => {
            formRef.current.setFieldsValue(res);
          })
          .catch((e) => {
            Message.error(e);
          });

        break;
      case 'create':
        setIsCreate(true);
        setVisible(true);
        setModalTitle('创建子分类');
        console.log(record.id);
        setClassifyId(record.id);
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
  const [isCreate, setIsCreate] = useState(false);
  const [modalTitle, setModalTitle] = useState('创建分类');
  const [classifyId, setClassifyId] = useState('');
  const [formParams, setFormParams] = useState({});
  const columns = useMemo(() => getColumns(tableCallback), []);
  const [visible, setVisible] = useState(false);
  const formRef = useRef<FormInstance>();

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize, JSON.stringify(formParams)]);

  function fetchData() {
    const { current, pageSize } = pagination;
    setLoading(true);

    getAllClassify({ current, pageSize, ...formParams })
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
      const { name } = values;
      setLoading(true);
      if (isCreate) {
        createClassify({
          name,
          parentId: classifyId ? classifyId : 0,
        })
          .then((res) => {
            fetchData();
            Message.success('创建成功');
          })
          .catch((e) => {
            Message.error('新增失败: ' + e);
          })
          .finally(() => {
            setLoading(false);
            setVisible(false);
            formRef.current.clearFields();
          });
      } else {
        updateClassify({
          name,
          id: classifyId,
        })
          .then((res) => {
            fetchData();
            Message.success('创建成功');
          })
          .catch((e) => {
            Message.error('新增失败: ' + e);
          })
          .finally(() => {
            setLoading(false);
            setVisible(false);
            formRef.current.clearFields();
          });
      }
    });
  };
  const onCancel = () => {
    setVisible(false);
    formRef.current.clearFields();
  };

  return (
    <>
      <Card>
        <Title heading={6}>分类管理</Title>
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
                  setModalTitle('创建分类');
                  setClassifyId('');
                }}
                type={'primary'}
                icon={<IconPlus />}
              >
                创建一级分类
              </Button>
            </Space>
          </div>
        </PermissionWrapper>
        <Table
          rowKey="id"
          loading={loading}
          onChange={onChangeTable}
          pagination={pagination}
          columns={columns}
          data={data}
        />
        <Modal
          title={modalTitle}
          visible={visible}
          onOk={onOk}
          onCancel={onCancel}
          autoFocus={false}
          focusLock={true}
        >
          <Form ref={formRef} autoComplete="off">
            <Form.Item
              rules={[{ required: true }]}
              field={'name'}
              label="分类名"
            >
              <Input allowClear placeholder="请输入分类名..." />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </>
  );
}

export default ClassifyList;
