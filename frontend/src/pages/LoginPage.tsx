import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      message.success('Inicio de sesión exitoso');
      navigate('/actas');
    } catch (error: any) {
      message.error(
        error.response?.data?.message || 'Error al iniciar sesión'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Card
        style={{
          width: 420,
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          borderRadius: 16,
        }}
        styles={{ body: { padding: '40px 32px' } }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
          <div>
            <Title level={3} style={{ marginBottom: 4 }}>
              Sistema de Infracciones
            </Title>
            <Text type="secondary">Gestión de Tránsito Municipal</Text>
          </div>

          <Form
            name="login"
            onFinish={onFinish}
            size="large"
            layout="vertical"
            style={{ textAlign: 'left' }}
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Ingrese su email' },
                { type: 'email', message: 'Email inválido' },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Email" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Ingrese su contraseña' },
                { min: 6, message: 'Mínimo 6 caracteres' },
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Contraseña" />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                style={{ height: 44, borderRadius: 8, fontWeight: 600 }}
              >
                Iniciar Sesión
              </Button>
            </Form.Item>
          </Form>
        </Space>
      </Card>
    </div>
  );
};

export default LoginPage;
