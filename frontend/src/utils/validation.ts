import * as Yup from 'yup';
import { EDUCATION_LEVELS, MAX_FILE_SIZE, FILE_TYPES } from './constants';

export const candidateValidationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),
  
  lastName: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters'),
  
  email: Yup.string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  
  phone: Yup.string()
    .required('Phone number is required')
    .matches(/^[+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number'),
  
  address: Yup.string()
    .required('Address is required')
    .min(10, 'Address must be at least 10 characters')
    .max(200, 'Address must be less than 200 characters'),
  
  education: Yup.array().of(
    Yup.object().shape({
      degree: Yup.string()
        .required('Degree is required')
        .min(2, 'Degree must be at least 2 characters')
        .max(100, 'Degree must be less than 100 characters'),
      
      institution: Yup.string()
        .required('Institution is required')
        .min(2, 'Institution must be at least 2 characters')
        .max(100, 'Institution must be less than 100 characters'),
      
      graduationYear: Yup.number()
        .required('Graduation year is required')
        .min(1950, 'Graduation year must be after 1950')
        .max(new Date().getFullYear() + 5, 'Graduation year cannot be more than 5 years in the future'),
      
      level: Yup.string()
        .required('Education level is required')
        .oneOf(EDUCATION_LEVELS.map(level => level.value), 'Please select a valid education level'),
    })
  ).min(1, 'At least one education entry is required'),
  
  experience: Yup.array().of(
    Yup.object().shape({
      company: Yup.string()
        .required('Company name is required')
        .min(2, 'Company name must be at least 2 characters')
        .max(100, 'Company name must be less than 100 characters'),
      
      position: Yup.string()
        .required('Position is required')
        .min(2, 'Position must be at least 2 characters')
        .max(100, 'Position must be less than 100 characters'),
      
      startDate: Yup.date()
        .required('Start date is required')
        .max(new Date(), 'Start date cannot be in the future'),
      
      endDate: Yup.date()
        .nullable()
        .min(Yup.ref('startDate'), 'End date must be after start date')
        .max(new Date(), 'End date cannot be in the future'),
      
      description: Yup.string()
        .required('Description is required')
        .min(10, 'Description must be at least 10 characters')
        .max(500, 'Description must be less than 500 characters'),
      
      isCurrentPosition: Yup.boolean(),
    })
  ),
  
  cvFile: Yup.mixed()
    .nullable()
    .test('fileSize', 'File size must be less than 5MB', (value) => {
      if (!value) return true;
      return (value as File).size <= MAX_FILE_SIZE;
    })
    .test('fileType', 'Only PDF and DOCX files are allowed', (value) => {
      if (!value) return true;
      return FILE_TYPES.CV.includes((value as File).type);
    }),
});

export const loginValidationSchema = Yup.object().shape({
  username: Yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters'),
  
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
}); 