import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Typography, Skeleton, List, Avatar, Statistic, Space } from 'antd';
import { PlusOutlined, UserOutlined, FileSearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/constants';
import candidateService from '../services/candidateService';
import { Candidate } from '../types/candidate';

const { Title } = Typography;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [recentCandidates, setRecentCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const statsData = await candidateService.getCandidateStats();
        const candidatesData = await candidateService.getCandidates(1, 5);
        setStats(statsData);
        setRecentCandidates(candidatesData.candidates);
      } catch (error) {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <Row gutter={[24, 24]} align="middle" justify="space-between" style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={16}>
          <Title level={2} style={{ margin: 0 }}>Recruiter Dashboard</Title>
        </Col>
        <Col xs={24} sm={12} md={8} style={{ textAlign: 'right' }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => navigate(ROUTES.ADD_CANDIDATE)}
            style={{ fontWeight: 'bold', minWidth: 180 }}
          >
            Añadir Candidato
          </Button>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card>
            {loading ? <Skeleton active paragraph={{ rows: 1 }} /> : (
              <Statistic title="Total Candidatos" value={stats?.total || 0} prefix={<UserOutlined />} />
            )}
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            {loading ? <Skeleton active paragraph={{ rows: 1 }} /> : (
              <Statistic title="Nuevos este mes" value={stats?.recent || 0} prefix={<FileSearchOutlined />} />
            )}
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            {loading ? <Skeleton active paragraph={{ rows: 1 }} /> : (
              <Statistic title="Por estado" value={Object.keys(stats?.byStatus || {}).length} />
            )}
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: 32 }} title="Candidatos recientes">
        {loading ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={recentCandidates}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={<span>{item.firstName} {item.lastName}</span>}
                  description={<span>{item.email} &bull; {item.phone}</span>}
                />
                <Space>
                  <Button size="small" onClick={() => navigate(`${ROUTES.CANDIDATES}/${item.id}`)}>
                    Ver Detalle
                  </Button>
                </Space>
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
};

export default Dashboard; 