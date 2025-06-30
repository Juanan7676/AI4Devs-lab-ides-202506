import React from 'react';
import CandidateForm from '../components/forms/CandidateForm';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '../utils/constants';

const AddCandidate: React.FC = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  return <CandidateForm />;
};

export default AddCandidate; 