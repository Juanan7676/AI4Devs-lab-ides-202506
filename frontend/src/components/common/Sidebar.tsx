import React from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined, DashboardOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: ROUTES.DASHBOARD,
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => navigate(ROUTES.DASHBOARD),
    },
    {
      key: ROUTES.CANDIDATES,
      icon: <UserOutlined />,
      label: 'Candidatos',
      onClick: () => navigate(ROUTES.CANDIDATES),
    },
    {
      key: ROUTES.ADD_CANDIDATE,
      icon: <PlusOutlined />,
      label: 'Añadir Candidato',
      onClick: () => navigate(ROUTES.ADD_CANDIDATE),
    },
  ];

  return (
    <Sider width={220} style={{ background: '#fff', minHeight: '100vh' }}>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        style={{ height: '100%', borderRight: 0 }}
      />
    </Sider>
  );
};

export default Sidebar; 