import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Typography, Avatar, Dropdown, theme, Grid } from 'antd';
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
  TeamOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;
const { useBreakpoint } = Grid;

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario, logout, isAdmin, isInspector } = useAuth();
  const { token: themeToken } = theme.useToken();
  const screens = useBreakpoint();

  // Consideramos móvil si la pantalla es menor a tablet md (768px)
  const isMobile = screens.md === false;

  useEffect(() => {
    // Si cambia a resolución móvil, colapsar automáticamente
    if (isMobile) {
      setCollapsed(true);
    }
  }, [isMobile]);

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
          {
            key: '/usuarios',
            icon: <TeamOutlined />,
            label: 'Usuarios',
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
    <Layout style={{ minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Backdrop oscuro en móvil cuando el menú está abierto */}
      {isMobile && !collapsed && (
        <div
          onClick={() => setCollapsed(true)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            zIndex: 999,
            transition: 'opacity 0.2s',
          }}
        />
      )}

      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        collapsedWidth={isMobile ? 0 : 80}
        onBreakpoint={(broken) => {
          if (broken) {
            setCollapsed(true);
          }
        }}
        style={{
          background: themeToken.colorBgContainer,
          borderRight: `1px solid ${themeToken.colorBorderSecondary}`,
          ...(isMobile
            ? {
                position: 'fixed',
                height: '100vh',
                zIndex: 1000,
                left: 0,
                top: 0,
                bottom: 0,
                boxShadow: !collapsed ? '4px 0 16px rgba(0,0,0,0.2)' : 'none',
              }
            : {}),
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
          <Text strong style={{ fontSize: collapsed && !isMobile ? 14 : 16, color: themeToken.colorPrimary }}>
            {collapsed && !isMobile ? 'SIT' : 'Infracciones'}
          </Text>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => {
            navigate(key);
            if (isMobile) {
              setCollapsed(true);
            }
          }}
          style={{ borderRight: 0 }}
        />
      </Sider>

      <Layout style={{ minWidth: 0, minHeight: '100vh' }}>
        <Header
          style={{
            padding: isMobile ? '0 16px' : '0 24px',
            background: themeToken.colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: `1px solid ${themeToken.colorBorderSecondary}`,
            position: 'sticky',
            top: 0,
            zIndex: 100,
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
              {!isMobile && (
                <div style={{ lineHeight: 1.2 }}>
                  <Text strong style={{ display: 'block', fontSize: 13 }}>
                    {usuario?.nombre} {usuario?.apellido}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 11, textTransform: 'capitalize' }}>
                    {usuario?.rol}
                  </Text>
                </div>
              )}
            </div>
          </Dropdown>
        </Header>

        <Content
          style={{
            margin: isMobile ? '12px 8px' : 24,
            padding: isMobile ? '16px 12px' : 24,
            background: themeToken.colorBgContainer,
            borderRadius: isMobile ? 6 : themeToken.borderRadiusLG,
            minHeight: 280,
            minWidth: 0,
            overflowX: 'auto',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
