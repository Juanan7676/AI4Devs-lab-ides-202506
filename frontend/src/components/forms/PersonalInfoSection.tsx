import React from 'react';
import { Form, Input, Row, Col, Card } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';

interface PersonalInfoSectionProps {
  form: any;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ form }) => {
  return (
    <Card 
      title={
        <span>
          <UserOutlined style={{ marginRight: 8 }} />
          Personal Information
        </span>
      }
      style={{ marginBottom: 24 }}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[
              { required: true, message: 'Please enter first name' },
              { min: 2, message: 'First name must be at least 2 characters' },
              { max: 50, message: 'First name must be less than 50 characters' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Enter first name"
              size="large"
            />
          </Form.Item>
        </Col>
        
        <Col xs={24} sm={12}>
          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[
              { required: true, message: 'Please enter last name' },
              { min: 2, message: 'Last name must be at least 2 characters' },
              { max: 50, message: 'Last name must be less than 50 characters' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Enter last name"
              size="large"
            />
          </Form.Item>
        </Col>
        
        <Col xs={24} sm={12}>
          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: 'Please enter email address' },
              { type: 'email', message: 'Please enter a valid email address' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="Enter email address"
              size="large"
            />
          </Form.Item>
        </Col>
        
        <Col xs={24} sm={12}>
          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[
              { required: true, message: 'Please enter phone number' },
              { 
                pattern: /^[+]?[1-9][\d]{0,15}$/, 
                message: 'Please enter a valid phone number' 
              }
            ]}
          >
            <Input 
              prefix={<PhoneOutlined />} 
              placeholder="Enter phone number"
              size="large"
            />
          </Form.Item>
        </Col>
        
        <Col xs={24}>
          <Form.Item
            name="address"
            label="Address"
            rules={[
              { required: true, message: 'Please enter address' },
              { min: 10, message: 'Address must be at least 10 characters' },
              { max: 200, message: 'Address must be less than 200 characters' }
            ]}
          >
            <Input.TextArea 
              placeholder="Enter full address"
              rows={3}
              showCount
              maxLength={200}
            />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};

export default PersonalInfoSection; 