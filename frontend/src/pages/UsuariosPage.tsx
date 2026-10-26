import React, { useState } from 'react';
import { Card, Form, Input, Select, Button, Typography, message } from 'antd';
import { authService } from '../api/services';

const { Title, Text } = Typography;

const UsuariosPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: {
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    rol: string;
  }) => {
    setLoading(true);
    try {
      await authService.register(values);
      message.success('Usuario registrado exitosamente');
      form.resetFields();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Title level={4}>Registrar Usuario</Title>
      <Text type="secondary">
        Alta de nuevos usuarios del sistema (inspectores y administrativos).
      </Text>
      <Card style={{ marginTop: 16, maxWidth: 520 }}>
        <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark>
          <Form.Item
            name="nombre"
            label="Nombre"
            rules={[
              { required: true, message: 'El nombre es obligatorio' },
              { min: 2, message: 'Debe tener al menos 2 caracteres' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="apellido"
            label="Apellido"
            rules={[
              { required: true, message: 'El apellido es obligatorio' },
              { min: 2, message: 'Debe tener al menos 2 caracteres' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'El email es obligatorio' },
              { type: 'email', message: 'Email inválido' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Contraseña"
            rules={[
              { required: true, message: 'La contraseña es obligatoria' },
              { min: 6, message: 'Debe tener al menos 6 caracteres' },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="rol"
            label="Rol"
            rules={[{ required: true, message: 'Seleccione un rol' }]}
          >
            <Select
              options={[
                { value: 'inspector', label: 'Inspector' },
                { value: 'administrativo', label: 'Administrativo' },
              ]}
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              Registrar
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

export default UsuariosPage;
