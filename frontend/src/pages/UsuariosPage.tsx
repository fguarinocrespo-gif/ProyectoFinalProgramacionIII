import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Typography,
  Tag,
  notification,
  message,
} from 'antd';
import { PlusOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { authService } from '../api/services';
import type { Usuario } from '../types';

const { Title, Text } = Typography;

const rolColors: Record<string, string> = {
  administrativo: 'purple',
  inspector: 'blue',
};

const UsuariosPage: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const res = await authService.listarUsuarios();
      setUsuarios(res.data);
    } catch {
      message.error('Error al cargar la lista de usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleSubmit = async (values: {
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    rol: 'inspector' | 'administrativo';
  }) => {
    setSubmitting(true);
    try {
      await authService.register(values);
      notification.success({
        message: 'Usuario Registrado Exitosamente',
        description: `Se dio de alta a ${values.nombre} ${values.apellido} (${values.email}) con el rol de ${values.rol.toUpperCase()}. Ya puede iniciar sesión.`,
        duration: 5,
        placement: 'topRight',
      });
      setModalOpen(false);
      form.resetFields();
      fetchUsuarios();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Error al registrar usuario');
    } finally {
      setSubmitting(false);
    }
  };

  const columns: ColumnsType<Usuario> = [
    {
      title: 'Nombre y Apellido',
      key: 'nombreCompleto',
      render: (_, record) => (
        <span style={{ fontWeight: 500 }}>
          {record.nombre} {record.apellido}
        </span>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Rol',
      dataIndex: 'rol',
      key: 'rol',
      render: (rol: string) => (
        <Tag color={rolColors[rol] || 'default'} style={{ textTransform: 'capitalize' }}>
          {rol}
        </Tag>
      ),
    },
    {
      title: 'Estado',
      dataIndex: 'activo',
      key: 'activo',
      render: (activo: boolean) => (
        <Tag color={activo !== false ? 'green' : 'red'}>
          {activo !== false ? 'Activo' : 'Inactivo'}
        </Tag>
      ),
    },
    {
      title: 'Fecha de Alta',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (fecha: string) => (fecha ? dayjs(fecha).format('DD/MM/YYYY') : '-'),
    },
  ];

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div>
          <Title level={4} style={{ margin: 0 }}>
            <TeamOutlined style={{ marginRight: 8 }} />
            Usuarios del Sistema
          </Title>
          <Text type="secondary">
            Padrón de personal operativo con acceso habilitado al sistema.
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            form.resetFields();
            setModalOpen(true);
          }}
        >
          Registrar Usuario
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={usuarios}
        rowKey="_id"
        loading={loading}
        size="middle"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 'max-content' }}
      />

      <Modal
        title="Registrar Nuevo Usuario"
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText="Registrar"
        cancelText="Cancelar"
        confirmLoading={submitting}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark>
          <Form.Item
            name="nombre"
            label="Nombre"
            rules={[
              { required: true, message: 'El nombre es obligatorio' },
              { min: 2, message: 'Debe tener al menos 2 caracteres' },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Ej: Juan" />
          </Form.Item>
          <Form.Item
            name="apellido"
            label="Apellido"
            rules={[
              { required: true, message: 'El apellido es obligatorio' },
              { min: 2, message: 'Debe tener al menos 2 caracteres' },
            ]}
          >
            <Input placeholder="Ej: Pérez" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'El email es obligatorio' },
              { type: 'email', message: 'Email inválido' },
            ]}
          >
            <Input placeholder="ejemplo@sistema.com" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Contraseña"
            rules={[
              { required: true, message: 'La contraseña es obligatoria' },
              { min: 6, message: 'Debe tener al menos 6 caracteres' },
            ]}
          >
            <Input.Password placeholder="Mínimo 6 caracteres" />
          </Form.Item>
          <Form.Item
            name="rol"
            label="Rol de Acceso"
            rules={[{ required: true, message: 'Seleccione un rol' }]}
            initialValue="inspector"
          >
            <Select
              options={[
                { value: 'inspector', label: 'Inspector (Labrado y consulta de actas)' },
                { value: 'administrativo', label: 'Administrativo (Control total, pagos y descargos)' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UsuariosPage;
