import React, { useEffect, useState } from 'react';
import {
  Form,
  Select,
  Input,
  DatePicker,
  Button,
  Card,
  Typography,
  message,
  Space,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { actasService, vehiculosService, tiposInfraccionService } from '../api/services';
import type { Vehiculo, TipoInfraccion, Titular } from '../types';

const { Title, Text } = Typography;
const { TextArea } = Input;

const NuevaActaPage: React.FC = () => {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [tipos, setTipos] = useState<TipoInfraccion[]>([]);
  const [loading, setLoading] = useState(false);
  const [montoCalculado, setMontoCalculado] = useState<number | null>(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vRes, tRes] = await Promise.all([
          vehiculosService.listar(),
          tiposInfraccionService.listar(),
        ]);
        setVehiculos(vRes.data);
        setTipos(tRes.data.filter((t) => t.activo));
      } catch {
        message.error('Error al cargar datos');
      }
    };
    fetchData();
  }, []);

  const handleTipoChange = (tipoId: string) => {
    const tipo = tipos.find((t) => t._id === tipoId);
    setMontoCalculado(tipo?.montoBase || null);
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      await actasService.crear({
        vehiculoId: values.vehiculoId,
        tipoInfraccionId: values.tipoInfraccionId,
        lugar: values.lugar,
        fechaHora: values.fechaHora?.toISOString(),
        observaciones: values.observaciones || '',
      });
      message.success('Acta labrada exitosamente');
      navigate('/actas');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Error al labrar acta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Title level={4} style={{ marginBottom: 24 }}>
        Labrar Nueva Acta de Infracción
      </Title>

      <Card style={{ maxWidth: 700 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ fechaHora: dayjs() }}
        >
          <Form.Item
            name="vehiculoId"
            label="Vehículo"
            rules={[{ required: true, message: 'Seleccione un vehículo' }]}
          >
            <Select
              placeholder="Buscar por patente..."
              showSearch
              optionFilterProp="label"
              options={vehiculos.map((v) => {
                const titular = v.titularId as Titular;
                return {
                  value: v._id,
                  label: `${v.patente} - ${v.marca} ${v.modelo} (${titular?.nombre || ''} ${titular?.apellido || ''})`,
                };
              })}
            />
          </Form.Item>

          <Form.Item
            name="tipoInfraccionId"
            label="Tipo de Infracción"
            rules={[{ required: true, message: 'Seleccione el tipo de infracción' }]}
          >
            <Select
              placeholder="Seleccionar tipo..."
              showSearch
              optionFilterProp="label"
              onChange={handleTipoChange}
              options={tipos.map((t) => ({
                value: t._id,
                label: `${t.codigo} - ${t.descripcion} ($${t.montoBase.toLocaleString('es-AR')})`,
              }))}
            />
          </Form.Item>

          {montoCalculado !== null && (
            <div style={{ marginBottom: 16, padding: '8px 16px', background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 8 }}>
              <Text strong>Monto del acta: </Text>
              <Text style={{ fontSize: 18, color: '#52c41a' }}>
                ${montoCalculado.toLocaleString('es-AR')}
              </Text>
            </div>
          )}

          <Form.Item
            name="lugar"
            label="Lugar"
            rules={[{ required: true, message: 'Ingrese el lugar de la infracción' }]}
          >
            <Input placeholder="Ej: Av. Mitre y Calle 12, Avellaneda" />
          </Form.Item>

          <Form.Item
            name="fechaHora"
            label="Fecha y Hora"
            rules={[{ required: true, message: 'Seleccione fecha y hora' }]}
          >
            <DatePicker showTime format="DD/MM/YYYY HH:mm" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="observaciones" label="Observaciones">
            <TextArea rows={3} placeholder="Detalles adicionales de la infracción..." />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                Labrar Acta
              </Button>
              <Button onClick={() => navigate('/actas')}>Cancelar</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

export default NuevaActaPage;
