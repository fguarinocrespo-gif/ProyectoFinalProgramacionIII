import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  message,
  Typography,
  Space,
  Tag,
} from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { tiposInfraccionService } from '../api/services';
import type { TipoInfraccion } from '../types';

const { Title } = Typography;

const TiposInfraccionPage: React.FC = () => {
  const [tipos, setTipos] = useState<TipoInfraccion[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState<TipoInfraccion | null>(null);
  const [form] = Form.useForm();

  const fetchTipos = async () => {
    setLoading(true);
    try {
      const res = await tiposInfraccionService.listar();
      setTipos(res.data);
    } catch {
      message.error('Error al cargar tipos de infracción');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTipos();
  }, []);

  const handleSubmit = async (values: any) => {
    try {
      if (editando) {
        await tiposInfraccionService.actualizar(editando._id, values);
        message.success('Tipo actualizado');
      } else {
        await tiposInfraccionService.crear(values);
        message.success('Tipo creado');
      }
      setModalOpen(false);
      setEditando(null);
      form.resetFields();
      fetchTipos();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Error al guardar');
    }
  };

  const handleEdit = (tipo: TipoInfraccion) => {
    setEditando(tipo);
    form.setFieldsValue(tipo);
    setModalOpen(true);
  };

  const columns: ColumnsType<TipoInfraccion> = [
    { title: 'Código', dataIndex: 'codigo', key: 'codigo', width: 100 },
    { title: 'Descripción', dataIndex: 'descripcion', key: 'descripcion' },
    {
      title: 'Monto Base',
      dataIndex: 'montoBase',
      key: 'montoBase',
      width: 120,
      render: (monto: number) => `$${monto.toLocaleString('es-AR')}`,
    },
    {
      title: 'Estado',
      dataIndex: 'activo',
      key: 'activo',
      width: 90,
      render: (activo: boolean) => (
        <Tag color={activo ? 'green' : 'red'}>{activo ? 'Activo' : 'Inactivo'}</Tag>
      ),
    },
    {
      title: 'Acciones',
      key: 'acciones',
      width: 80,
      render: (_, record) => (
        <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
      ),
    },
  ];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>
          Tipos de Infracción
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditando(null);
            form.resetFields();
            form.setFieldsValue({ activo: true });
            setModalOpen(true);
          }}
        >
          Nuevo Tipo
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={tipos}
        rowKey="_id"
        loading={loading}
        size="middle"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editando ? 'Editar Tipo de Infracción' : 'Nuevo Tipo de Infracción'}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          setEditando(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="codigo"
            label="Código"
            rules={[{ required: true, message: 'El código es obligatorio' }]}
          >
            <Input placeholder="INF-001" />
          </Form.Item>
          <Form.Item
            name="descripcion"
            label="Descripción"
            rules={[{ required: true, message: 'La descripción es obligatoria' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="montoBase"
            label="Monto Base"
            rules={[{ required: true, message: 'El monto es obligatorio' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} prefix="$" />
          </Form.Item>
          <Form.Item name="activo" label="Activo" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TiposInfraccionPage;
