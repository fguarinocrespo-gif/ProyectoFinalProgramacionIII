import React, { useState } from 'react';
import { Layout, Menu, Button, Typography, Avatar, Dropdown, theme } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FileTextOutlined,
  CarOutlined,
  UserOutlined,
  DashboardOutlined,
  LogoutOutlined,
  WarningOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario, logout, isAdmin, isInspector } = useAuth();
  const { token: themeToken } = theme.useToken();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    ...(isAdmin
      ? [
          {
            key: '/dashboard',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
          },
        ]
      : []),
    {
      key: '/actas',
      icon: <FileTextOutlined />,
      label: 'Actas',
    },
    ...(isInspector
      ? [
          {
            key: '/actas/nueva',
            icon: <PlusOutlined />,
            label: 'Labrar Acta',
          },
        ]
      : []),
    {
      key: '/titulares',
      icon: <UserOutlined />,
      label: 'Titulares',
    },
    {
      key: '/vehiculos',
      icon: <CarOutlined />,
      label: 'Vehículos',
    },
    ...(isAdmin
      ? [
          {
            key: '/tipos-infraccion',
            icon: <WarningOutlined />,
            label: 'Tipos Infracción',
          },
        ]
      : []),
  ];

  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Cerrar sesión',
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          background: themeToken.colorBgContainer,
          borderRight: `1px solid ${themeToken.colorBorderSecondary}`,
        }}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: `1px solid ${themeToken.colorBorderSecondary}`,
          }}
        >
          <Text strong style={{ fontSize: collapsed ? 14 : 16, color: themeToken.colorPrimary }}>
            {collapsed ? 'SIT' : 'Infracciones'}
          </Text>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: themeToken.colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: `1px solid ${themeToken.colorBorderSecondary}`,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar style={{ backgroundColor: themeToken.colorPrimary }}>
                {usuario?.nombre?.[0]}
              </Avatar>
              <div style={{ lineHeight: 1.2 }}>
                <Text strong style={{ display: 'block', fontSize: 13 }}>
                  {usuario?.nombre} {usuario?.apellido}
                </Text>
                <Text type="secondary" style={{ fontSize: 11, textTransform: 'capitalize' }}>
                  {usuario?.rol}
                </Text>
              </div>
            </div>
          </Dropdown>
        </Header>
        <Content
          style={{
            margin: 24,
            padding: 24,
            background: themeToken.colorBgContainer,
            borderRadius: themeToken.borderRadiusLG,
            minHeight: 280,
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
