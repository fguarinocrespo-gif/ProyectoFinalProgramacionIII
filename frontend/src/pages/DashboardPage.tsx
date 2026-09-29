import React, { useEffect, useState } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  DatePicker,
  Space,
  Table,
  Tag,
  message,
  Spin,
} from 'antd';
import {
  FileTextOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { dashboardService } from '../api/services';
import type { DashboardResumen } from '../types';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const estadoColors: Record<string, string> = {
  pendiente: 'orange',
  notificada: 'blue',
  pagada: 'green',
  en_descargo: 'purple',
  anulada: 'red',
};

const estadoLabels: Record<string, string> = {
  pendiente: 'Pendiente',
  notificada: 'Notificada',
  pagada: 'Pagada',
  en_descargo: 'En Descargo',
  anulada: 'Anulada',
};

const DashboardPage: React.FC = () => {
  const [resumen, setResumen] = useState<DashboardResumen | null>(null);
  const [loading, setLoading] = useState(true);
  const [fechas, setFechas] = useState<[string, string] | undefined>();

  const fetchResumen = async () => {
    setLoading(true);
    try {
      const res = await dashboardService.obtenerResumen(fechas?.[0], fechas?.[1]);
      setResumen(res.data);
    } catch {
      message.error('Error al cargar dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumen();
  }, [fechas]);

  if (loading && !resumen) {
    return (
      <div style={{ textAlign: 'center', padding: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  const actasPendientes =
    resumen?.actasPorEstado.find((a) => a._id === 'pendiente')?.cantidad || 0;
  const actasNotificadas =
    resumen?.actasPorEstado.find((a) => a._id === 'notificada')?.cantidad || 0;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>
          Dashboard
        </Title>
        <Space>
          <RangePicker
            onChange={(dates) => {
              if (dates && dates[0] && dates[1]) {
                setFechas([dates[0].toISOString(), dates[1].toISOString()]);
              } else {
                setFechas(undefined);
              }
            }}
          />
        </Space>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Actas"
              value={resumen?.totalActas || 0}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Recaudación Total"
              value={resumen?.recaudacion.totalRecaudado || 0}
              prefix={<DollarOutlined />}
              precision={0}
              valueStyle={{ color: '#52c41a' }}
              formatter={(val) => `$${Number(val).toLocaleString('es-AR')}`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pagos Realizados"
              value={resumen?.recaudacion.cantidadPagos || 0}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Actas Pendientes"
              value={actasPendientes + actasNotificadas}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Actas por Estado */}
        <Col xs={24} lg={12}>
          <Card title="Actas por Estado">
            <Table
              dataSource={resumen?.actasPorEstado || []}
              rowKey="_id"
              pagination={false}
              size="small"
              columns={[
                {
                  title: 'Estado',
                  dataIndex: '_id',
                  render: (estado: string) => (
                    <Tag color={estadoColors[estado]}>
                      {estadoLabels[estado] || estado}
                    </Tag>
                  ),
                },
                {
                  title: 'Cantidad',
                  dataIndex: 'cantidad',
                  align: 'right' as const,
                },
                {
                  title: 'Monto Total',
                  dataIndex: 'montoTotal',
                  align: 'right' as const,
                  render: (monto: number) => `$${monto.toLocaleString('es-AR')}`,
                },
              ]}
            />
          </Card>
        </Col>

        {/* Recaudación por Medio de Pago */}
        <Col xs={24} lg={12}>
          <Card title="Recaudación por Medio de Pago">
            <Table
              dataSource={resumen?.recaudacionPorMedio || []}
              rowKey="_id"
              pagination={false}
              size="small"
              columns={[
                {
                  title: 'Medio',
                  dataIndex: '_id',
                  render: (medio: string) => (
                    <Tag color={medio === 'contado' ? 'green' : 'blue'}>
                      {medio.toUpperCase()}
                    </Tag>
                  ),
                },
                {
                  title: 'Pagos',
                  dataIndex: 'cantidad',
                  align: 'right' as const,
                },
                {
                  title: 'Total',
                  dataIndex: 'total',
                  align: 'right' as const,
                  render: (total: number) => `$${total.toLocaleString('es-AR')}`,
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default DashboardPage;
