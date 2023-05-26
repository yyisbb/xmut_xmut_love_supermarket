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
  Select,
} from '@arco-design/web-react';
import PermissionWrapper from '@/components/PermissionWrapper';
import { IconPlus } from '@arco-design/web-react/icon';
import SearchForm from './form';
import styles from './style/index.module.less';
import { getColumns } from './constants';
import { FormInstance } from '@arco-design/web-react/es/Form';
import {
  createLocation,
  deleteLocation,
  getAllLocation,
  getLocationDetail,
  updateLocation,
} from '@/api/location';
import { getLeafClassifyList } from '@/api/classify';
const FormItem = Form.Item;
const { Title } = Typography;
const Option = Select.Option;
function Locationist() {
  const tableCallback = async (record, type) => {
    switch (type) {
      case 'delete':
        //TODO 删除
        deleteLocation({ id: record.id })
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
        setModalTitle('修改用户分类');
        setLocationId(record.id);
        //TODO 数据回显
        getLocationDetail({ id: record.id })
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
  const [modalTitle, setModalTitle] = useState('创建位置');
  const formRef = useRef<FormInstance>();
  const [leafClassifyList, setLeafClassifyList] = useState([]);
  const [locationId, setLocationId] = useState(0);

  useEffect(() => {
    fetchData();
    fetchClassifyData();
  }, [pagination.current, pagination.pageSize, JSON.stringify(formParams)]);

  const fetchClassifyData = () => {
    getLeafClassifyList({})
      .then((res) => {
        setLeafClassifyList(res);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  function fetchData() {
    const { current, pageSize } = pagination;
    setLoading(true);

    getAllLocation({ current, pageSize, ...formParams })
      .then((res) => {
        setData(res.list);
        setPatination({
          ...pagination,
          current,
          pageSize,
          total: res.total,
        });
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
      const { name, classifyId } = values;
      setLoading(true);
      if (isCreate) {
        createLocation({
          name,
          classifyId,
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
          });
      } else {
        updateLocation({
          id: locationId,
          name,
          classifyId,
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

  return (
    <Card>
      <Title heading={6}>位置列表</Title>
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
                setModalTitle('创建位置');
              }}
              type={'primary'}
              icon={<IconPlus />}
            >
              创建位置
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
          <Form.Item rules={[{ required: true }]} field={'name'} label="位置名">
            <Input allowClear placeholder="请输入位置名..." />
          </Form.Item>
          <FormItem
            label="分类"
            field="classifyId"
            rules={[{ required: true }]}
          >
            <Select placeholder="请选择分类" allowClear>
              {leafClassifyList.map((option) => (
                <Option key={option.id} value={option.id}>
                  {option.name}
                </Option>
              ))}
            </Select>
          </FormItem>
        </Form>
      </Modal>
    </Card>
  );
}

export default Locationist;
