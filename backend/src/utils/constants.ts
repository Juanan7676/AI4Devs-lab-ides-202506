export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
export const JWT_EXPIRES_IN = '24h';

export const FILE_SIZE_LIMIT = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword'
];

export const ALLOWED_FILE_EXTENSIONS = ['.pdf', '.docx', '.doc'];

export const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
export const RATE_LIMIT_MAX_REQUESTS = 100; // requests per window

export const PASSWORD_MIN_LENGTH = 8;
export const USERNAME_MIN_LENGTH = 3;

export const API_BASE_PATH = '/api/v1';

export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'No autorizado',
  FORBIDDEN: 'Acceso denegado',
  NOT_FOUND: 'Recurso no encontrado',
  VALIDATION_ERROR: 'Error de validación',
  INTERNAL_ERROR: 'Error interno del servidor',
  INVALID_CREDENTIALS: 'Credenciales inválidas',
  USER_ALREADY_EXISTS: 'El usuario ya existe',
  CANDIDATE_ALREADY_EXISTS: 'El candidato ya existe',
  FILE_TOO_LARGE: 'El archivo es demasiado grande',
  INVALID_FILE_TYPE: 'Tipo de archivo no válido',
  FILE_UPLOAD_ERROR: 'Error al subir el archivo'
} as const;

export const SUCCESS_MESSAGES = {
  USER_CREATED: 'Usuario creado exitosamente',
  USER_LOGGED_IN: 'Usuario autenticado exitosamente',
  CANDIDATE_CREATED: 'Candidato creado exitosamente',
  CANDIDATE_UPDATED: 'Candidato actualizado exitosamente',
  CANDIDATE_DELETED: 'Candidato eliminado exitosamente',
  CV_UPLOADED: 'CV subido exitosamente'
} as const; 