import React, { useEffect, useState } from 'react';
import {
  Card,
  Descriptions,
  Tag,
  Button,
  Typography,
  Space,
  message,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Divider,
  List,
  Spin,
} from 'antd';
import { ArrowLeftOutlined, DollarOutlined, FileTextOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import {
  actasService,
  pagosService,
  descargosService,
} from '../api/services';
import { useAuth } from '../context/AuthContext';
import type { ActaInfraccion, Vehiculo, TipoInfraccion, Titular, Pago, Descargo } from '../types';

const { Title, Text } = Typography;
const { TextArea } = Input;

const estadoColors: Record<string, string> = {
  pendiente: 'orange',
  notificada: 'blue',
  pagada: 'green',
  en_descargo: 'purple',
  anulada: 'red',
};

const DetalleActaPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [acta, setActa] = useState<ActaInfraccion | null>(null);
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [descargos, setDescargos] = useState<Descargo[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagoModalOpen, setPagoModalOpen] = useState(false);
  const [descargoModalOpen, setDescargoModalOpen] = useState(false);
  const [estadoModalOpen, setEstadoModalOpen] = useState(false);
  const [pagoForm] = Form.useForm();
  const [descargoForm] = Form.useForm();

  const fetchData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [actaRes, pagosRes, descargosRes] = await Promise.all([
        actasService.obtener(id),
        isAdmin ? pagosService.listar(id) : Promise.resolve({ data: [] }),
        isAdmin ? descargosService.listar(id) : Promise.resolve({ data: [] }),
      ]);
      setActa(actaRes.data);
      setPagos(pagosRes.data);
      setDescargos(descargosRes.data);
    } catch {
      message.error('Error al cargar el acta');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleRegistrarPago = async (values: any) => {
    try {
      await pagosService.registrar({
        actaId: id!,
        monto: values.monto,
        medioPago: values.medioPago,
        comprobante: values.comprobante || '',
      });
      message.success('Pago registrado exitosamente');
      setPagoModalOpen(false);
      pagoForm.resetFields();
      fetchData();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Error al registrar pago');
    }
  };

  const handleRegistrarDescargo = async (values: any) => {
    try {
      await descargosService.registrar({
        actaId: id!,
        motivo: values.motivo,
        documentacionAdjunta: values.documentacionAdjunta || '',
      });
      message.success('Descargo registrado exitosamente');
      setDescargoModalOpen(false);
      descargoForm.resetFields();
      fetchData();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Error al registrar descargo');
    }
  };

  const handleCambiarEstado = async (values: { estado: string }) => {
    try {
      await actasService.cambiarEstado(id!, values.estado);
      message.success('Estado actualizado');
      setEstadoModalOpen(false);
      fetchData();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Error al cambiar estado');
    }
  };

  const handleResolverDescargo = async (descargoId: string, estado: string) => {
    try {
      await descargosService.cambiarEstado(descargoId, estado);
      message.success(`Descargo ${estado}`);
      fetchData();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Error al resolver descargo');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!acta) {
    return <Text>Acta no encontrada</Text>;
  }

  const vehiculo = acta.vehiculoId as Vehiculo;
  const tipo = acta.tipoInfraccionId as TipoInfraccion;
  const titular = vehiculo?.titularId as Titular;
  const inspector = acta.inspectorId as any;
  const puedeRegistrarPago = ['pendiente', 'notificada'].includes(acta.estado);
  const puedeRegistrarDescargo = ['pendiente', 'notificada'].includes(acta.estado);

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/actas')}>
          Volver
        </Button>
      </Space>

      <Title level={4}>Acta #{acta.numeroActa}</Title>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Información del Acta */}
        <Card title="Información del Acta">
          <Descriptions column={{ xs: 1, sm: 2 }} bordered size="small">
            <Descriptions.Item label="N° Acta">{acta.numeroActa}</Descriptions.Item>
            <Descriptions.Item label="Estado">
              <Tag color={estadoColors[acta.estado]}>
                {acta.estado.replace('_', ' ').toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Fecha/Hora">
              {dayjs(acta.fechaHora).format('DD/MM/YYYY HH:mm')}
            </Descriptions.Item>
            <Descriptions.Item label="Lugar">{acta.lugar}</Descriptions.Item>
            <Descriptions.Item label="Infracción">
              {tipo?.codigo} - {tipo?.descripcion}
            </Descriptions.Item>
            <Descriptions.Item label="Monto">
              <Text strong style={{ fontSize: 16, color: '#cf1322' }}>
                ${acta.monto.toLocaleString('es-AR')}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="Inspector">
              {inspector?.nombre} {inspector?.apellido}
            </Descriptions.Item>
            {acta.observaciones && (
              <Descriptions.Item label="Observaciones" span={2}>
                {acta.observaciones}
              </Descriptions.Item>
            )}
          </Descriptions>
        </Card>

        {/* Información del Vehículo y Titular */}
        <Card title="Vehículo y Titular">
          <Descriptions column={{ xs: 1, sm: 2 }} bordered size="small">
            <Descriptions.Item label="Patente">{vehiculo?.patente}</Descriptions.Item>
            <Descriptions.Item label="Vehículo">
              {vehiculo?.marca} {vehiculo?.modelo} ({vehiculo?.anio})
            </Descriptions.Item>
            <Descriptions.Item label="Titular">
              {titular?.nombre} {titular?.apellido}
            </Descriptions.Item>
            <Descriptions.Item label="DNI">{titular?.dni}</Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Acciones (solo admin) */}
        {isAdmin && (
          <Card title="Acciones">
            <Space wrap>
              {puedeRegistrarPago && (
                <Button
                  type="primary"
                  icon={<DollarOutlined />}
                  onClick={() => {
                    pagoForm.setFieldsValue({ monto: acta.monto });
                    setPagoModalOpen(true);
                  }}
                >
                  Registrar Pago
                </Button>
              )}
              {puedeRegistrarDescargo && (
                <Button
                  icon={<FileTextOutlined />}
                  onClick={() => setDescargoModalOpen(true)}
                >
                  Registrar Descargo
                </Button>
              )}
              <Button onClick={() => setEstadoModalOpen(true)}>
                Cambiar Estado
              </Button>
            </Space>
          </Card>
        )}

        {/* Pagos */}
        {isAdmin && pagos.length > 0 && (
          <Card title="Pagos Registrados">
            <List
              dataSource={pagos}
              renderItem={(pago) => (
                <List.Item>
                  <List.Item.Meta
                    title={`$${pago.monto.toLocaleString('es-AR')} - ${pago.medioPago.toUpperCase()}`}
                    description={`Fecha: ${dayjs(pago.fechaPago).format('DD/MM/YYYY HH:mm')} | Comprobante: ${pago.comprobante || 'N/A'}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        )}

        {/* Descargos */}
        {isAdmin && descargos.length > 0 && (
          <Card title="Descargos">
            <List
              dataSource={descargos}
              renderItem={(descargo) => (
                <List.Item
                  actions={
                    descargo.estado === 'presentado'
                      ? [
                          <Button
                            key="aceptar"
                            type="primary"
                            size="small"
                            onClick={() => handleResolverDescargo(descargo._id, 'aceptado')}
                          >
                            Aceptar
                          </Button>,
                          <Button
                            key="rechazar"
                            danger
                            size="small"
                            onClick={() => handleResolverDescargo(descargo._id, 'rechazado')}
                          >
                            Rechazar
                          </Button>,
                        ]
                      : undefined
                  }
                >
                  <List.Item.Meta
                    title={
                      <>
                        Descargo{' '}
                        <Tag
                          color={
                            descargo.estado === 'aceptado'
                              ? 'green'
                              : descargo.estado === 'rechazado'
                                ? 'red'
                                : 'blue'
                          }
                        >
                          {descargo.estado.toUpperCase()}
                        </Tag>
                      </>
                    }
                    description={
                      <>
                        <div>{descargo.motivo}</div>
                        <div style={{ marginTop: 4, color: '#999' }}>
                          Fecha: {dayjs(descargo.fechaPresentacion).format('DD/MM/YYYY')}
                          {descargo.documentacionAdjunta &&
                            ` | Doc: ${descargo.documentacionAdjunta}`}
                        </div>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        )}
      </Space>

      {/* Modal Pago */}
      <Modal
        title="Registrar Pago"
        open={pagoModalOpen}
        onCancel={() => setPagoModalOpen(false)}
        onOk={() => pagoForm.submit()}
        okText="Registrar"
        cancelText="Cancelar"
      >
        <Form form={pagoForm} layout="vertical" onFinish={handleRegistrarPago}>
          <Form.Item
            name="monto"
            label="Monto"
            rules={[{ required: true, message: 'El monto es obligatorio' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} prefix="$" />
          </Form.Item>
          <Form.Item
            name="medioPago"
            label="Medio de Pago"
            rules={[{ required: true, message: 'Seleccione el medio de pago' }]}
          >
            <Select
              options={[
                { value: 'contado', label: 'Contado' },
                { value: 'tarjeta', label: 'Tarjeta' },
              ]}
            />
          </Form.Item>
          <Form.Item name="comprobante" label="N° Comprobante">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Descargo */}
      <Modal
        title="Registrar Descargo"
        open={descargoModalOpen}
        onCancel={() => setDescargoModalOpen(false)}
        onOk={() => descargoForm.submit()}
        okText="Registrar"
        cancelText="Cancelar"
      >
        <Form form={descargoForm} layout="vertical" onFinish={handleRegistrarDescargo}>
          <Form.Item
            name="motivo"
            label="Motivo"
            rules={[
              { required: true, message: 'El motivo es obligatorio' },
              { min: 10, message: 'Mínimo 10 caracteres' },
            ]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item name="documentacionAdjunta" label="Documentación adjunta">
            <Input placeholder="Nombre del archivo adjunto" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Cambio Estado */}
      <Modal
        title="Cambiar Estado del Acta"
        open={estadoModalOpen}
        onCancel={() => setEstadoModalOpen(false)}
        onOk={() => {
          const estadoSelect = document.getElementById('estado-select') as any;
          // Use form approach instead
        }}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleCambiarEstado}>
          <Form.Item
            name="estado"
            label="Nuevo Estado"
            rules={[{ required: true, message: 'Seleccione el estado' }]}
          >
            <Select
              options={[
                { value: 'pendiente', label: 'Pendiente' },
                { value: 'notificada', label: 'Notificada' },
                { value: 'pagada', label: 'Pagada' },
                { value: 'en_descargo', label: 'En Descargo' },
                { value: 'anulada', label: 'Anulada' },
              ]}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Actualizar
              </Button>
              <Button onClick={() => setEstadoModalOpen(false)}>Cancelar</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default DetalleActaPage;
