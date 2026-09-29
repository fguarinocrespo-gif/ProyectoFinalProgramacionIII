import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Space,
  Select,
  DatePicker,
  Input,
  Tag,
  Typography,
  message,
} from 'antd';
import { EyeOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { actasService } from '../api/services';
import type { ActaInfraccion, Vehiculo, TipoInfraccion } from '../types';

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

const ActasPage: React.FC = () => {
  const [actas, setActas] = useState<ActaInfraccion[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 0 });
  const [filtroEstado, setFiltroEstado] = useState<string | undefined>();
  const [filtroPatente, setFiltroPatente] = useState('');
  const [filtroFechas, setFiltroFechas] = useState<[string, string] | undefined>();
  const navigate = useNavigate();

  const fetchActas = async (page = 1) => {
    setLoading(true);
    try {
      const params: any = { page, limit: 10 };
      if (filtroEstado) params.estado = filtroEstado;
      if (filtroPatente) params.patente = filtroPatente;
      if (filtroFechas) {
        params.desde = filtroFechas[0];
        params.hasta = filtroFechas[1];
      }
      const res = await actasService.listar(params);
      setActas(res.data.data);
      setPagination(res.data.pagination);
    } catch {
      message.error('Error al cargar actas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActas();
  }, []);

  const handleBuscar = () => {
    fetchActas(1);
  };

  const columns: ColumnsType<ActaInfraccion> = [
    { title: '#', dataIndex: 'numeroActa', key: 'numeroActa', width: 70 },
    {
      title: 'Patente',
      key: 'patente',
      width: 110,
      render: (_, record) => {
        const v = record.vehiculoId as Vehiculo;
        return v?.patente || '-';
      },
    },
    {
      title: 'Infracción',
      key: 'infraccion',
      ellipsis: true,
      render: (_, record) => {
        const t = record.tipoInfraccionId as TipoInfraccion;
        return t?.descripcion || '-';
      },
    },
    { title: 'Lugar', dataIndex: 'lugar', key: 'lugar', ellipsis: true },
    {
      title: 'Fecha',
      dataIndex: 'fechaHora',
      key: 'fechaHora',
      width: 130,
      render: (fecha: string) => dayjs(fecha).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Monto',
      dataIndex: 'monto',
      key: 'monto',
      width: 110,
      render: (monto: number) => `$${monto.toLocaleString('es-AR')}`,
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      width: 120,
      render: (estado: string) => (
        <Tag color={estadoColors[estado]}>{estadoLabels[estado] || estado}</Tag>
      ),
    },
    {
      title: 'Acciones',
      key: 'acciones',
      width: 80,
      render: (_, record) => (
        <Button
          size="small"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/actas/${record._id}`)}
        >
          Ver
        </Button>
      ),
    },
  ];

  return (
    <>
      <Title level={4} style={{ marginBottom: 16 }}>
        Actas de Infracción
      </Title>

      {/* Filtros */}
      <Space wrap style={{ marginBottom: 16 }}>
        <Select
          placeholder="Estado"
          allowClear
          style={{ width: 150 }}
          value={filtroEstado}
          onChange={(v) => setFiltroEstado(v)}
          options={Object.entries(estadoLabels).map(([value, label]) => ({ value, label }))}
        />
        <Input
          placeholder="Patente"
          style={{ width: 140 }}
          value={filtroPatente}
          onChange={(e) => setFiltroPatente(e.target.value)}
        />
        <RangePicker
          onChange={(dates) => {
            if (dates && dates[0] && dates[1]) {
              setFiltroFechas([
                dates[0].toISOString(),
                dates[1].toISOString(),
              ]);
            } else {
              setFiltroFechas(undefined);
            }
          }}
        />
        <Button type="primary" icon={<SearchOutlined />} onClick={handleBuscar}>
          Buscar
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={actas}
        rowKey="_id"
        loading={loading}
        size="middle"
        pagination={{
          current: pagination.page,
          total: pagination.total,
          pageSize: pagination.limit,
          showSizeChanger: false,
          showTotal: (total) => `Total: ${total} actas`,
          onChange: (page) => fetchActas(page),
        }}
      />
    </>
  );
};

export default ActasPage;
