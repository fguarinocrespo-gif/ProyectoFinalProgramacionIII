import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
  Typography,
  Tag,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { titularesService } from '../api/services';
import { useAuth } from '../context/AuthContext';
import type { Titular, DeudaTitular } from '../types';

const { Title } = Typography;

const TitularesPage: React.FC = () => {
  const [titulares, setTitulares] = useState<Titular[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deudaModalOpen, setDeudaModalOpen] = useState(false);
  const [deudaInfo, setDeudaInfo] = useState<DeudaTitular | null>(null);
  const [editando, setEditando] = useState<Titular | null>(null);
  const [form] = Form.useForm();
  const { isAdmin } = useAuth();

  const fetchTitulares = async () => {
    setLoading(true);
    try {
      const res = await titularesService.listar();
      setTitulares(res.data);
    } catch {
      message.error('Error al cargar titulares');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTitulares();
  }, []);

  const handleSubmit = async (values: any) => {
    try {
      if (editando) {
        await titularesService.actualizar(editando._id, values);
        message.success('Titular actualizado');
      } else {
        await titularesService.crear(values);
        message.success('Titular creado');
      }
      setModalOpen(false);
      setEditando(null);
      form.resetFields();
      fetchTitulares();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Error al guardar titular');
    }
  };

  const handleEdit = (titular: Titular) => {
    setEditando(titular);
    form.setFieldsValue(titular);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await titularesService.eliminar(id);
      message.success('Titular eliminado');
      fetchTitulares();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Error al eliminar');
    }
  };

  const handleVerDeuda = async (id: string) => {
    try {
      const res = await titularesService.obtenerDeuda(id);
      setDeudaInfo(res.data);
      setDeudaModalOpen(true);
    } catch {
      message.error('Error al obtener deuda');
    }
  };

  const columns: ColumnsType<Titular> = [
    { title: 'DNI', dataIndex: 'dni', key: 'dni', width: 100 },
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
    { title: 'Apellido', dataIndex: 'apellido', key: 'apellido' },
    { title: 'Domicilio', dataIndex: 'domicilio', key: 'domicilio', ellipsis: true },
    { title: 'Teléfono', dataIndex: 'telefono', key: 'telefono', width: 140 },
    {
      title: 'Acciones',
      key: 'acciones',
      width: 180,
      render: (_, record) => (
        <Space>
          <Tooltip title="Ver deuda">
            <Button
              size="small"
              icon={<DollarOutlined />}
              onClick={() => handleVerDeuda(record._id)}
            />
          </Tooltip>
          {isAdmin && (
            <>
              <Tooltip title="Editar">
                <Button
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(record)}
                />
              </Tooltip>
              <Popconfirm
                title="¿Eliminar este titular?"
                onConfirm={() => handleDelete(record._id)}
              >
                <Button size="small" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>
          Titulares
        </Title>
        {isAdmin && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditando(null);
              form.resetFields();
              setModalOpen(true);
            }}
          >
            Nuevo Titular
          </Button>
        )}
      </div>

      <Table
        columns={columns}
        dataSource={titulares}
        rowKey="_id"
        loading={loading}
        size="middle"
        pagination={{ pageSize: 10 }}
      />

      {/* Modal de Crear/Editar */}
      <Modal
        title={editando ? 'Editar Titular' : 'Nuevo Titular'}
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
            name="dni"
            label="DNI"
            rules={[
              { required: true, message: 'El DNI es obligatorio' },
              { min: 7, message: 'Mínimo 7 caracteres' },
              { max: 8, message: 'Máximo 8 caracteres' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="nombre"
            label="Nombre"
            rules={[{ required: true, message: 'El nombre es obligatorio' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="apellido"
            label="Apellido"
            rules={[{ required: true, message: 'El apellido es obligatorio' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="domicilio"
            label="Domicilio"
            rules={[{ required: true, message: 'El domicilio es obligatorio' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="telefono" label="Teléfono">
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ type: 'email', message: 'Email inválido' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal de Deuda */}
      <Modal
        title="Deuda del Titular"
        open={deudaModalOpen}
        onCancel={() => setDeudaModalOpen(false)}
        footer={null}
      >
        {deudaInfo && (
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <strong>Titular:</strong> {deudaInfo.titular.nombre} {deudaInfo.titular.apellido}
            </div>
            <div>
              <strong>DNI:</strong> {deudaInfo.titular.dni}
            </div>
            <div>
              <strong>Vehículos registrados:</strong>{' '}
              <Tag color="blue">{deudaInfo.cantidadVehiculos}</Tag>
            </div>
            <div>
              <strong>Actas pendientes:</strong>{' '}
              <Tag color="orange">{deudaInfo.cantidadActasPendientes}</Tag>
            </div>
            <div>
              <strong>Deuda total:</strong>{' '}
              <Tag color="red" style={{ fontSize: 16, padding: '4px 12px' }}>
                ${deudaInfo.deudaTotal.toLocaleString('es-AR')}
              </Tag>
            </div>
          </Space>
        )}
      </Modal>
    </>
  );
};

export default TitularesPage;
