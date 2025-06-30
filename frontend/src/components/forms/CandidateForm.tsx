import React, { useState } from 'react';
import { Form, Upload, Button, Card, Typography, Space, message } from 'antd';
import { UploadOutlined, FileTextOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { RcFile } from 'antd/es/upload';
import PersonalInfoSection from './PersonalInfoSection';
import EducationSection from './EducationSection';
import ExperienceSection from './ExperienceSection';
import { CandidateFormData, Candidate } from '../../types/candidate';
import { FILE_TYPES, MAX_FILE_SIZE, ROUTES } from '../../utils/constants';
import candidateService from '../../services/candidateService';

const { Title, Text } = Typography;

interface CandidateFormProps {
  initialValues?: Partial<Candidate>;
  isEditing?: boolean;
}

const CandidateForm: React.FC<CandidateFormProps> = ({ 
  initialValues = {}, 
  isEditing = false 
}) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);

  const beforeUpload = (file: RcFile) => {
    const isValidType = FILE_TYPES.CV.includes(file.type);
    const isValidSize = file.size <= MAX_FILE_SIZE;

    if (!isValidType) {
      message.error('You can only upload PDF or DOCX files!');
      return false;
    }

    if (!isValidSize) {
      message.error('File size must be less than 5MB!');
      return false;
    }

    setCvFile(file);
    message.success(`${file.name} file uploaded successfully.`);
    return false; // Prevent default upload behavior
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    
    try {
      const formData: CandidateFormData = {
        ...values,
        cvFile: cvFile || undefined,
      };

      if (isEditing && initialValues.id) {
        await candidateService.updateCandidate(initialValues.id, formData);
        message.success('Candidate updated successfully!');
      } else {
        await candidateService.createCandidate(formData);
        message.success('Candidate added successfully!');
      }

      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      console.error('Form submission error:', error);
      message.error('Failed to save candidate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.DASHBOARD);
  };

  const uploadProps = {
    beforeUpload,
    onRemove: () => setCvFile(null),
    accept: '.pdf,.docx',
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>
          {isEditing ? 'Edit Candidate' : 'Add New Candidate'}
        </Title>
        <Text type="secondary">
          {isEditing 
            ? 'Update the candidate information below' 
            : 'Fill in the candidate information below to add them to the system'
          }
        </Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          education: [{}],
          experience: [],
          ...initialValues,
        }}
        onFinish={handleSubmit}
        scrollToFirstError
      >
        {/* Personal Information Section */}
        <PersonalInfoSection form={form} />

        {/* Education Section */}
        <EducationSection form={form} />

        {/* Experience Section */}
        <ExperienceSection form={form} />

        {/* CV Upload Section */}
        <Card 
          title={
            <span>
              <FileTextOutlined style={{ marginRight: 8 }} />
              CV/Resume Upload
            </span>
          }
          style={{ marginBottom: 24 }}
        >
          <Form.Item
            name="cvFile"
            label="Upload CV/Resume"
            extra="Supported formats: PDF, DOCX (Max size: 5MB)"
          >
            <Upload {...uploadProps}>
              <Button 
                icon={<UploadOutlined />} 
                size="large"
                style={{ width: '100%', height: '60px' }}
              >
                Click to upload CV/Resume
              </Button>
            </Upload>
          </Form.Item>
          
          {cvFile && (
            <div style={{ 
              padding: '12px', 
              background: '#f6ffed', 
              border: '1px solid #b7eb8f', 
              borderRadius: '6px',
              marginTop: '12px'
            }}>
              <Text strong>Selected file:</Text> {cvFile.name} ({(cvFile.size / 1024 / 1024).toFixed(2)} MB)
            </div>
          )}
        </Card>

        {/* Form Actions */}
        <Card style={{ marginTop: 24 }}>
          <Space size="middle" style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button 
              size="large" 
              icon={<CloseOutlined />}
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="primary" 
              size="large" 
              icon={<SaveOutlined />}
              htmlType="submit"
              loading={loading}
            >
              {loading ? 'Saving...' : (isEditing ? 'Update Candidate' : 'Add Candidate')}
            </Button>
          </Space>
        </Card>
      </Form>
    </div>
  );
};

export default CandidateForm; 