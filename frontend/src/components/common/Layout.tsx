import React from 'react';
import { Layout as AntLayout, Spin } from 'antd';
import { useAuth } from '../../hooks/useAuth';
import Header from './Header';

const { Content } = AntLayout;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#f0f2f5'
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <AntLayout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Header />
      <Content style={{ 
        padding: '24px', 
        margin: '0',
        minHeight: 'calc(100vh - 64px)',
        background: '#f0f2f5'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto',
          background: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          minHeight: 'calc(100vh - 112px)',
          padding: '24px'
        }}>
          {children}
        </div>
      </Content>
    </AntLayout>
  );
};

export default Layout; 