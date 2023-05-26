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
import { getAllRecord } from '@/api/record';
const FormItem = Form.Item;
const { Title } = Typography;
const Option = Select.Option;
function RecordList() {
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
  const columns = useMemo(() => getColumns(), []);
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

    getAllRecord({ current, pageSize, ...formParams })
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

  return (
    <Card>
      <Title heading={6}>存取记录列表</Title>
      <SearchForm onSearch={handleSearch} />
      <PermissionWrapper
        requiredPermissions={[
          { resource: 'menu.list.searchTable', actions: ['write'] },
        ]}
      ></PermissionWrapper>
      <Table
        rowKey="id"
        loading={loading}
        onChange={onChangeTable}
        pagination={pagination}
        columns={columns}
        data={data}
      />
    </Card>
  );
}

export default RecordList;
