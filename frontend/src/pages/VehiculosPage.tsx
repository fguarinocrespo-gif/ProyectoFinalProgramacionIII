import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  message,
  Popconfirm,
  Typography,
  Tag,
  Tooltip,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, DollarOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { vehiculosService, titularesService } from '../api/services';
import { useAuth } from '../context/AuthContext';
import type { Vehiculo, Titular, DeudaVehiculo } from '../types';

const { Title } = Typography;

const VehiculosPage: React.FC = () => {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [titulares, setTitulares] = useState<Titular[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deudaModalOpen, setDeudaModalOpen] = useState(false);
  const [deudaInfo, setDeudaInfo] = useState<DeudaVehiculo | null>(null);
  const [editando, setEditando] = useState<Vehiculo | null>(null);
  const [form] = Form.useForm();
  const { isAdmin } = useAuth();

  const fetchVehiculos = async () => {
    setLoading(true);
    try {
      const [vRes, tRes] = await Promise.all([
        vehiculosService.listar(),
        titularesService.listar(),
      ]);
      setVehiculos(vRes.data);
      setTitulares(tRes.data);
    } catch {
      message.error('Error al cargar vehículos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehiculos();
  }, []);

  const handleSubmit = async (values: any) => {
    try {
      if (editando) {
        await vehiculosService.actualizar(editando._id, values);
        message.success('Vehículo actualizado');
      } else {
        await vehiculosService.crear(values);
        message.success('Vehículo creado');
      }
      setModalOpen(false);
      setEditando(null);
      form.resetFields();
      fetchVehiculos();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Error al guardar vehículo');
    }
  };

  const handleEdit = (vehiculo: Vehiculo) => {
    setEditando(vehiculo);
    form.setFieldsValue({
      ...vehiculo,
      titularId: typeof vehiculo.titularId === 'object' ? vehiculo.titularId._id : vehiculo.titularId,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await vehiculosService.eliminar(id);
      message.success('Vehículo eliminado');
      fetchVehiculos();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Error al eliminar');
    }
  };

  const handleVerDeuda = async (id: string) => {
    try {
      const res = await vehiculosService.obtenerDeuda(id);
      setDeudaInfo(res.data);
      setDeudaModalOpen(true);
    } catch {
      message.error('Error al obtener deuda');
    }
  };

  const columns: ColumnsType<Vehiculo> = [
    { title: 'Patente', dataIndex: 'patente', key: 'patente', width: 110 },
    { title: 'Marca', dataIndex: 'marca', key: 'marca' },
    { title: 'Modelo', dataIndex: 'modelo', key: 'modelo' },
    { title: 'Año', dataIndex: 'anio', key: 'anio', width: 80 },
    {
      title: 'Titular',
      key: 'titular',
      render: (_, record) => {
        const titular = record.titularId as Titular;
        return titular?.nombre ? `${titular.nombre} ${titular.apellido}` : '-';
      },
    },
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
                <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
              </Tooltip>
              <Popconfirm
                title="¿Eliminar este vehículo?"
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
          Vehículos
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
            Nuevo Vehículo
          </Button>
        )}
      </div>

      <Table
        columns={columns}
        dataSource={vehiculos}
        rowKey="_id"
        loading={loading}
        size="middle"
        pagination={{ pageSize: 10 }}
      />

      {/* Modal Crear/Editar */}
      <Modal
        title={editando ? 'Editar Vehículo' : 'Nuevo Vehículo'}
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
            name="patente"
            label="Patente"
            rules={[{ required: true, message: 'La patente es obligatoria' }]}
          >
            <Input placeholder="ABC123 o AB123CD" style={{ textTransform: 'uppercase' }} />
          </Form.Item>
          <Form.Item
            name="marca"
            label="Marca"
            rules={[{ required: true, message: 'La marca es obligatoria' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="modelo"
            label="Modelo"
            rules={[{ required: true, message: 'El modelo es obligatorio' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="anio"
            label="Año"
            rules={[{ required: true, message: 'El año es obligatorio' }]}
          >
            <InputNumber min={1900} max={new Date().getFullYear() + 1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="titularId"
            label="Titular"
            rules={[{ required: true, message: 'El titular es obligatorio' }]}
          >
            <Select
              placeholder="Seleccionar titular"
              showSearch
              optionFilterProp="label"
              options={titulares.map((t) => ({
                value: t._id,
                label: `${t.nombre} ${t.apellido} (${t.dni})`,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Deuda */}
      <Modal
        title="Deuda del Vehículo"
        open={deudaModalOpen}
        onCancel={() => setDeudaModalOpen(false)}
        footer={null}
      >
        {deudaInfo && (
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <strong>Vehículo:</strong> {(deudaInfo.vehiculo as any).patente} -{' '}
              {(deudaInfo.vehiculo as any).marca} {(deudaInfo.vehiculo as any).modelo}
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

export default VehiculosPage;
