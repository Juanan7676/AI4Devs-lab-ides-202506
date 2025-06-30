import React from 'react';
import { Form, Input, DatePicker, Checkbox, Button, Row, Col, Card, Typography, Space, Divider } from 'antd';
import { PlusOutlined, DeleteOutlined, BankOutlined, UserOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface ExperienceSectionProps {
  form: any;
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({ form }) => {
  const addExperience = () => {
    const experience = form.getFieldValue('experience') || [];
    form.setFieldsValue({
      experience: [...experience, {}],
    });
  };

  const removeExperience = (index: number) => {
    const experience = form.getFieldValue('experience') || [];
    const newExperience = experience.filter((_: any, i: number) => i !== index);
    form.setFieldsValue({
      experience: newExperience,
    });
  };

  const handleCurrentPositionChange = (checked: boolean, index: number) => {
    const experience = form.getFieldValue('experience') || [];
    if (checked) {
      experience[index].isCurrentPosition = true;
      experience[index].endDate = null;
    } else {
      experience[index].isCurrentPosition = false;
    }
    form.setFieldsValue({ experience });
  };

  return (
    <Card 
      title={
        <span>
          <BankOutlined style={{ marginRight: 8 }} />
          Work Experience
        </span>
      }
      style={{ marginBottom: 24 }}
      extra={
        <Button 
          type="dashed" 
          icon={<PlusOutlined />} 
          onClick={addExperience}
          size="small"
        >
          Add Experience
        </Button>
      }
    >
      <Form.List name="experience">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }, index) => (
              <div key={key}>
                <Row gutter={[16, 16]} align="middle">
                  <Col xs={24} sm={12}>
                    <Form.Item
                      {...restField}
                      name={[name, 'company']}
                      label="Company"
                      rules={[
                        { required: true, message: 'Please enter company name' },
                        { min: 2, message: 'Company name must be at least 2 characters' },
                        { max: 100, message: 'Company name must be less than 100 characters' }
                      ]}
                    >
                      <Input 
                        prefix={<BankOutlined />} 
                        placeholder="e.g., Tech Solutions Inc."
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} sm={12}>
                    <Form.Item
                      {...restField}
                      name={[name, 'position']}
                      label="Position"
                      rules={[
                        { required: true, message: 'Please enter position' },
                        { min: 2, message: 'Position must be at least 2 characters' },
                        { max: 100, message: 'Position must be less than 100 characters' }
                      ]}
                    >
                      <Input 
                        prefix={<UserOutlined />} 
                        placeholder="e.g., Senior Software Engineer"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} sm={8}>
                    <Form.Item
                      {...restField}
                      name={[name, 'startDate']}
                      label="Start Date"
                      rules={[
                        { required: true, message: 'Please select start date' }
                      ]}
                    >
                      <DatePicker
                        placeholder="Start Date"
                        style={{ width: '100%' }}
                        size="large"
                        format="YYYY-MM-DD"
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} sm={8}>
                    <Form.Item
                      {...restField}
                      name={[name, 'endDate']}
                      label="End Date"
                      dependencies={[[name, 'isCurrentPosition']]}
                    >
                      <DatePicker
                        placeholder="End Date"
                        style={{ width: '100%' }}
                        size="large"
                        format="YYYY-MM-DD"
                        disabled={form.getFieldValue(['experience', index, 'isCurrentPosition'])}
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} sm={8}>
                    <Form.Item
                      {...restField}
                      name={[name, 'isCurrentPosition']}
                      valuePropName="checked"
                      style={{ marginTop: 32 }}
                    >
                      <Checkbox 
                        onChange={(e) => handleCurrentPositionChange(e.target.checked, index)}
                      >
                        Current Position
                      </Checkbox>
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24}>
                    <Form.Item
                      {...restField}
                      name={[name, 'description']}
                      label="Job Description"
                      rules={[
                        { required: true, message: 'Please enter job description' },
                        { min: 10, message: 'Description must be at least 10 characters' },
                        { max: 500, message: 'Description must be less than 500 characters' }
                      ]}
                    >
                      <Input.TextArea 
                        placeholder="Describe your responsibilities, achievements, and key contributions..."
                        rows={4}
                        showCount
                        maxLength={500}
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24}>
                    <Space style={{ marginBottom: 16 }}>
                      <Button 
                        type="text" 
                        danger 
                        icon={<DeleteOutlined />} 
                        onClick={() => {
                          remove(name);
                          removeExperience(index);
                        }}
                        size="small"
                      >
                        Remove Experience
                      </Button>
                    </Space>
                  </Col>
                </Row>
                
                {index < fields.length - 1 && (
                  <Divider style={{ margin: '24px 0' }} />
                )}
              </div>
            ))}
            
            {fields.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                <BankOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                <div>No work experience added yet</div>
                <Text type="secondary">Click "Add Experience" to get started</Text>
              </div>
            )}
          </>
        )}
      </Form.List>
    </Card>
  );
};

export default ExperienceSection; 