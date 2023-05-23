import React, { useState, useRef } from 'react';
import {
  Typography,
  Card,
  Form,
  Select,
  Input,
  Grid,
  Space,
  Button,
  Message, Modal,
} from '@arco-design/web-react';
import { FormInstance } from '@arco-design/web-react/es/Form';
import axios from 'axios';
import styles from './style/index.module.less';

function GroupForm() {
  const formRef = useRef<FormInstance>();
  const [loading, setLoading] = useState(false);

  function submit(data) {
    setLoading(true);
    axios
      .post('/api/groupForm', {
        data,
      })
      .then(() => {
        Message.success('提交成功');
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handleSubmit() {
    formRef.current.validate().then((values) => {
      submit(values);
    });
  }

  function handleReset() {
    formRef.current.resetFields();
  }

  return (
    <div className={styles.container}>
      <Form layout="vertical" ref={formRef} className={styles['form-group']}>
        <Card>
          <Typography.Title heading={6}>
            新增用户
          </Typography.Title>
          <Grid.Row gutter={80}>
            <Grid.Col span={8}>
              <Form.Item
                label={'用户名'}
              >
                <Input
                  placeholder={
                    '请输入用户名'
                  }
                />
              </Form.Item>
            </Grid.Col>
            <Grid.Col span={8}>
              <Form.Item
                  label={'姓名'}
              >
                <Input
                    placeholder={
                      '请输入姓名'
                    }
                />
              </Form.Item>
            </Grid.Col>
            <Grid.Col span={8}>
              <Form.Item
                label={'邮箱'}
              >
                <Input
                  placeholder={
                    '请输入邮箱'
                  }
                />
              </Form.Item>
            </Grid.Col>
          </Grid.Row>
        </Card>
      </Form>
      <div className={styles.actions}>
        <Space>
          <Button onClick={handleReset} size="large">
            重置
          </Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={loading}
            size="large"
          >
            提交
          </Button>
        </Space>
      </div>


    </div>
  );
}

export default GroupForm;
