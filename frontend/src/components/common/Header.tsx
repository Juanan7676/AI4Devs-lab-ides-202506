import React from 'react';
import { Layout, Menu, Avatar, Dropdown, Button, Space, Typography } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined, BellOutlined } from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate(ROUTES.LOGIN);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => navigate('/settings'),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  const mainMenuItems = [
    {
      key: ROUTES.DASHBOARD,
      label: 'Dashboard',
      onClick: () => navigate(ROUTES.DASHBOARD),
    },
    {
      key: ROUTES.CANDIDATES,
      label: 'Candidates',
      onClick: () => navigate(ROUTES.CANDIDATES),
    },
    {
      key: ROUTES.ADD_CANDIDATE,
      label: 'Add Candidate',
      onClick: () => navigate(ROUTES.ADD_CANDIDATE),
    },
  ];

  return (
    <AntHeader style={{ 
      background: '#fff', 
      padding: '0 24px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          color: '#1890ff', 
          marginRight: '48px' 
        }}>
          ATS System
        </div>
        
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={mainMenuItems}
          style={{ 
            border: 'none', 
            background: 'transparent',
            flex: 1,
          }}
        />
      </div>

      <Space size="middle">
        <Button 
          type="text" 
          icon={<BellOutlined />} 
          size="large"
          style={{ color: '#666' }}
        />
        
        <Dropdown
          menu={{ items: userMenuItems }}
          placement="bottomRight"
          arrow
        >
          <Space style={{ cursor: 'pointer', padding: '8px' }}>
            <Avatar 
              size="default" 
              icon={<UserOutlined />} 
              style={{ backgroundColor: '#1890ff' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Text strong style={{ fontSize: '14px', lineHeight: '1' }}>
                {user?.firstName} {user?.lastName}
              </Text>
              <Text type="secondary" style={{ fontSize: '12px', lineHeight: '1' }}>
                {user?.role?.replace('_', ' ').toUpperCase()}
              </Text>
            </div>
          </Space>
        </Dropdown>
      </Space>
    </AntHeader>
  );
};

export default Header; 