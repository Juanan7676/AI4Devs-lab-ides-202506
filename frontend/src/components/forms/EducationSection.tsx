import React from 'react';
import { Form, Input, Select, InputNumber, Button, Row, Col, Card, Typography, Space, Divider } from 'antd';
import { PlusOutlined, DeleteOutlined, BookOutlined, BankOutlined, TrophyOutlined } from '@ant-design/icons';
import { EDUCATION_LEVELS } from '../../utils/constants';

const { Text } = Typography;
const { Option } = Select;

interface EducationSectionProps {
  form: any;
}

const EducationSection: React.FC<EducationSectionProps> = ({ form }) => {
  const currentYear = new Date().getFullYear();

  const addEducation = () => {
    const education = form.getFieldValue('education') || [];
    form.setFieldsValue({
      education: [...education, {}],
    });
  };

  const removeEducation = (index: number) => {
    const education = form.getFieldValue('education') || [];
    const newEducation = education.filter((_: any, i: number) => i !== index);
    form.setFieldsValue({
      education: newEducation,
    });
  };

  return (
    <Card 
      title={
        <span>
          <BookOutlined style={{ marginRight: 8 }} />
          Education
        </span>
      }
      style={{ marginBottom: 24 }}
      extra={
        <Button 
          type="dashed" 
          icon={<PlusOutlined />} 
          onClick={addEducation}
          size="small"
        >
          Add Education
        </Button>
      }
    >
      <Form.List name="education">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }, index) => (
              <div key={key}>
                <Row gutter={[16, 16]} align="middle">
                  <Col xs={24} sm={8}>
                    <Form.Item
                      {...restField}
                      name={[name, 'degree']}
                      label="Degree/Certificate"
                      rules={[
                        { required: true, message: 'Please enter degree' },
                        { min: 2, message: 'Degree must be at least 2 characters' },
                        { max: 100, message: 'Degree must be less than 100 characters' }
                      ]}
                    >
                      <Input 
                        prefix={<TrophyOutlined />} 
                        placeholder="e.g., Bachelor of Science"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} sm={8}>
                    <Form.Item
                      {...restField}
                      name={[name, 'institution']}
                      label="Institution"
                      rules={[
                        { required: true, message: 'Please enter institution' },
                        { min: 2, message: 'Institution must be at least 2 characters' },
                        { max: 100, message: 'Institution must be less than 100 characters' }
                      ]}
                    >
                      <Input 
                        prefix={<BankOutlined />} 
                        placeholder="e.g., University of Technology"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} sm={4}>
                    <Form.Item
                      {...restField}
                      name={[name, 'graduationYear']}
                      label="Graduation Year"
                      rules={[
                        { required: true, message: 'Please enter graduation year' },
                        { type: 'number', min: 1950, max: currentYear + 5, message: 'Invalid graduation year' }
                      ]}
                    >
                      <InputNumber
                        placeholder="2020"
                        min={1950}
                        max={currentYear + 5}
                        style={{ width: '100%' }}
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} sm={4}>
                    <Form.Item
                      {...restField}
                      name={[name, 'level']}
                      label="Level"
                      rules={[
                        { required: true, message: 'Please select education level' }
                      ]}
                    >
                      <Select
                        placeholder="Select level"
                        size="large"
                        style={{ width: '100%' }}
                      >
                        {EDUCATION_LEVELS.map(level => (
                          <Option key={level.value} value={level.value}>
                            {level.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} sm={24}>
                    <Form.Item
                      {...restField}
                      name={[name, 'description']}
                      label="Description (Optional)"
                    >
                      <Input.TextArea 
                        placeholder="Additional details about your education..."
                        rows={2}
                        showCount
                        maxLength={300}
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
                          removeEducation(index);
                        }}
                        size="small"
                      >
                        Remove Education
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
                <BookOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                <div>No education entries added yet</div>
                <Text type="secondary">Click "Add Education" to get started</Text>
              </div>
            )}
          </>
        )}
      </Form.List>
    </Card>
  );
};

export default EducationSection; 