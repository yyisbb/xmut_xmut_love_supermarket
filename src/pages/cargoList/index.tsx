import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Table,
  Card,
  PaginationProps,
  Button,
  Space,
  Typography,
  Modal,
  Form,
  Input,
  Message,
  Select,
} from '@arco-design/web-react';
import PermissionWrapper from '@/components/PermissionWrapper';
import { IconPlus } from '@arco-design/web-react/icon';
import SearchForm from './form';
import styles from './style/index.module.less';
import { getColumns } from './constants';
import { FormInstance } from '@arco-design/web-react/es/Form';
import { getLeafClassifyList, updateClassify } from '@/api/classify';
import {
  createCargo,
  deleteCargo,
  getAllCargo,
  getCargoDetail,
  updateCargo,
} from '@/api/cargo';
const FormItem = Form.Item;
const { Title } = Typography;
const Option = Select.Option;
function Cargoist() {
  const tableCallback = async (record, type) => {
    switch (type) {
      case 'delete':
        deleteCargo({ id: record.id })
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
        setModalTitle('修改货物信息');
        setCargoId(record.id);
        //TODO 数据回显
        getCargoDetail({ id: record.id })
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
  const [cargoId, setCargoId] = useState(0);

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

    getAllCargo({ current, pageSize, ...formParams })
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
        createCargo({
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
        updateCargo({
          name,
          classifyId,
          id: cargoId,
        })
          .then((res) => {
            fetchData();
            Message.success('修改成功');
          })
          .catch((e) => {
            Message.error(`修改失败: ${e}`);
          })
          .finally(() => {
            setLoading(false);
            setVisible(false);
            formRef.current.clearFields();
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
      <Title heading={6}>货物列表</Title>
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
                setModalTitle('创建货物');
              }}
              type={'primary'}
              icon={<IconPlus />}
            >
              创建货物
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
          <Form.Item rules={[{ required: true }]} field={'name'} label="货物名">
            <Input allowClear placeholder="请输入货物名..." />
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

export default Cargoist;
