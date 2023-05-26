import React, { useEffect, useState } from 'react';
import JSONbig from 'json-bigint';

import {
  Typography,
  Card,
  Message,
  Modal,
  Button,
} from '@arco-design/web-react';
import styles from './style/index.module.less';
import QRCodeScanner from '@/components/QRCodeScanner';
import { createCargo, getCargoDetail, takeCargo } from '@/api/cargo';
import { Descriptions } from '@arco-design/web-react';

const { Title, Paragraph } = Typography;
interface Cargo {
  id?: bigint;
}
function Take() {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [obj, setObj] = useState<Cargo>({});

  const getScannerRes = (result: string) => {
    if (result) {
      const obj = JSONbig.parse(result);
      if (obj) {
        setObj(obj);
        //查询信息
        getCargoDetail({ id: obj.id })
          .then((res) => {
            //设置课程信息
            detailData.map((value) => {
              if (res[value.key]) {
                value.value = res[value.key];
              }
            });
            setVisible(true);
          })
          .catch((e) => {
            Message.error('查询货品信息失败: ' + e);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        Message.error('请更换二维码');
      }
    }
  };

  const [detailData, setDetailData] = useState([
    {
      key: 'name',
      label: '货品名',
      value: '',
    },
    {
      key: 'depositTime',
      label: '存入时间',
      value: '',
    },
    {
      key: 'locationName',
      label: '货品存入位置',
      value: '',
    },
    {
      key: 'classifyName',
      label: '货品分类',
      value: '',
    },
  ]);

  return (
    <div className={styles.container}>
      <Card loading={loading}>
        <Title heading={5}>{'取物品'}</Title>
        <QRCodeScanner onScan={getScannerRes} />
        <Modal
          title="识别成功"
          visible={visible}
          footer={
            <>
              <Button
                onClick={() => {
                  setVisible(false);
                }}
              >
                取消
              </Button>
              <Button
                onClick={() => {
                  setLoading(true);
                  console.log(obj);
                  takeCargo({
                    id: obj.id,
                  })
                    .then((res) => {
                      Message.success('取货成功');
                    })
                    .catch((e) => {
                      Message.error('取货失败: ' + e);
                    })
                    .finally(() => {
                      setLoading(false);
                      setVisible(false);
                      setObj({});
                    });
                }}
                type="primary"
              >
                取货
              </Button>
            </>
          }
          autoFocus={false}
          focusLock={true}
        >
          <Descriptions
            size={'small'}
            border
            column={1}
            colon=" :"
            title="货品信息"
            data={detailData}
          />
        </Modal>
      </Card>
    </div>
  );
}

export default Take;
