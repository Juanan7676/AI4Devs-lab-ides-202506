import React from 'react';
import { Formik, Form as FormikForm, Field, ErrorMessage } from 'formik';
import { loginValidationSchema } from '../utils/validation';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Navigate } from 'react-router-dom';
import { Card, Input, Button, Typography, Alert } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { ROUTES } from '../utils/constants';

const { Title } = Typography;

const Login: React.FC = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | null>(null);

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5' }}>
      <Card style={{ width: 380, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>Recruiter Login</Title>
        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={loginValidationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setError(null);
            try {
              await login(values.username, values.password);
              navigate(ROUTES.DASHBOARD);
            } catch (err: any) {
              setError('Invalid username or password');
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <FormikForm>
              <div style={{ marginBottom: 16 }}>
                <Field name="username">
                  {({ field }: any) => (
                    <Input {...field} size="large" prefix={<UserOutlined />} placeholder="Username" autoFocus />
                  )}
                </Field>
                <div style={{ color: 'red', fontSize: 12 }}>
                  <ErrorMessage name="username" component="div" />
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <Field name="password">
                  {({ field }: any) => (
                    <Input.Password {...field} size="large" prefix={<LockOutlined />} placeholder="Password" />
                  )}
                </Field>
                <div style={{ color: 'red', fontSize: 12 }}>
                  <ErrorMessage name="password" component="div" />
                </div>
              </div>
              {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />}
              <Button
                type="primary"
                htmlType="submit"
                icon={<LoginOutlined />}
                size="large"
                block
                loading={isSubmitting || isLoading}
                disabled={isSubmitting || isLoading}
                style={{ marginTop: 8 }}
              >
                Log In
              </Button>
            </FormikForm>
          )}
        </Formik>
      </Card>
    </div>
  );
};

export default Login; 