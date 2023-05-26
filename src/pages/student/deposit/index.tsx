import React, { useEffect, useState } from 'react';
import { triggerBase64Download } from 'react-base64-downloader';
import {
  Steps,
  Form,
  Input,
  Select,
  Button,
  Typography,
  Space,
  Card,
  Image,
  Result,
  Message,
  Modal,
} from '@arco-design/web-react';
import styles from './style/index.module.less';
import { getLeafClassifyList } from '@/api/classify';
import { createCargo, updateCargo } from '@/api/cargo';

const Option = Select.Option;
const { Title, Paragraph } = Typography;

function Deposit() {
  const [current, setCurrent] = useState(1);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [leafClassifyList, setLeafClassifyList] = useState([]);
  const [imgUrl, setImgUrl] = useState('');
  const [visible, setVisible] = React.useState(false);

  const viewForm = () => {
    setVisible(true);
  };

  const reCreateForm = () => {
    form.resetFields();
    setCurrent(1);
  };

  const toNext = async () => {
    try {
      await form.validate();
      const nextCurrent = current + 1;
      if (nextCurrent == 3) {
        const values = form.getFields();
        const { name, classifyId } = values;
        setLoading(true);
        createCargo({
          name,
          classifyId,
        })
          .then((res) => {
            setImgUrl(res);
            Message.success('新增成功');
          })
          .catch((e) => {
            Message.error('新增失败: ' + e);
            setCurrent(1);
          })
          .finally(() => {
            setLoading(false);
          });
      }
      setCurrent(nextCurrent);
    } catch (_) {}
  };
  useEffect(() => {
    fetchClassifyData();
  }, []);
  const fetchClassifyData = () => {
    setLoading(true);
    getLeafClassifyList({})
      .then((res) => {
        setLeafClassifyList(res);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className={styles.container}>
      <Card loading={loading}>
        <Title heading={5}>{'存物品'}</Title>
        <div className={styles.wrapper}>
          <Steps current={current} lineless>
            <Steps.Step title={'基本信息'} description={'输入存入物品的信息'} />
            <Steps.Step
              title={'选择分类'}
              description={'请选择商品分类,系统会自动生成位置'}
            />
            <Steps.Step title={'完成存物品'} description={'存物品成功'} />
          </Steps>
          <Form form={form} className={styles.form}>
            {current === 1 && (
              <Form.Item noStyle>
                <Form.Item
                  label={'物品名'}
                  required
                  field="name"
                  rules={[
                    {
                      required: true,
                      message: '请输入物品名',
                    },
                    {
                      validator: (value: string, callback) => {
                        if (!/^[\u4e00-\u9fa5a-zA-Z0-9]{1,20}$/g.test(value)) {
                          callback('输入汉字、字母、数字，最多20字符组合');
                        }
                      },
                    },
                  ]}
                >
                  <Input placeholder={'输入汉字、字母或数字，最多20字符'} />
                </Form.Item>
              </Form.Item>
            )}
            {current === 2 && (
              <Form.Item
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
              </Form.Item>
            )}
            {current !== 3 ? (
              <Form.Item label=" ">
                <Space>
                  {current === 2 && (
                    <Button
                      size="large"
                      onClick={() => setCurrent(current - 1)}
                    >
                      上一步
                    </Button>
                  )}
                  {current !== 3 && (
                    <Button type="primary" size="large" onClick={toNext}>
                      下一步
                    </Button>
                  )}
                </Space>
              </Form.Item>
            ) : (
              <Form.Item noStyle>
                <Result
                  status="success"
                  title={'填写完毕'}
                  subTitle={'表单创建成功'}
                  extra={[
                    <Button
                      key="reset"
                      style={{ marginRight: 16 }}
                      onClick={viewForm}
                    >
                      查询二维码
                    </Button>,
                    <Button key="again" type="primary" onClick={reCreateForm}>
                      重新填写
                    </Button>,
                  ]}
                />
              </Form.Item>
            )}
          </Form>
        </div>
        {current === 3 && (
          <div className={styles['form-extra']}>
            <Title heading={6}>{'存取说明'}</Title>
            <Paragraph type="secondary">
              系统会根据选择的分类自动生成位置,及条形码,请妥善保管
            </Paragraph>
          </div>
        )}
      </Card>
      <Modal
        title="二维码"
        visible={visible}
        closeIcon={null}
        footer={
          <>
            <Button
              onClick={() => {
                setVisible(false);
              }}
            >
              关闭
            </Button>
            <Button
              onClick={() =>
                triggerBase64Download(
                  `data:image/png;base64,${imgUrl}`,
                  'qrcode'
                )
              }
              type="primary"
            >
              下载二维码
            </Button>
          </>
        }
        autoFocus={false}
        focusLock={true}
        escToExit={false}
        maskClosable={false}
      >
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Image
            width={200}
            src={`data:image/png;base64,${imgUrl}`}
            alt="lamp"
          />
        </div>
      </Modal>
    </div>
  );
}

export default Deposit;
