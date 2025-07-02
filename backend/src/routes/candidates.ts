import { Router } from 'express';
import { CandidateController } from '../controllers/candidateController';
import { 
  validateCreateCandidate, 
  validateUpdateCandidate, 
  validateCandidateId,
  validatePagination 
} from '../middleware/validation';
import { authenticateToken, isRecruiter } from '../middleware/auth';
import { cvUpload, handleMulterError } from '../services/fileService';

const router = Router();

// Apply authentication to all candidate routes
router.use(authenticateToken);
router.use(isRecruiter);

/**
 * @swagger
 * /api/v1/candidates:
 *   get:
 *     summary: Obtener lista de candidatos
 *     tags: [Candidates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Número de elementos por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Término de búsqueda
 *     responses:
 *       200:
 *         description: Lista de candidatos
 *       401:
 *         description: No autorizado
 */
router.get('/', validatePagination, CandidateController.getAllCandidates);

/**
 * @swagger
 * /api/v1/candidates/stats:
 *   get:
 *     summary: Obtener estadísticas de candidatos
 *     tags: [Candidates]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas de candidatos
 *       401:
 *         description: No autorizado
 */
router.get('/stats', CandidateController.getCandidatesStats);

/**
 * @swagger
 * /api/v1/candidates:
 *   post:
 *     summary: Crear un nuevo candidato
 *     tags: [Candidates]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - phone
 *               - address
 *             properties:
 *               firstName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *               lastName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 200
 *     responses:
 *       201:
 *         description: Candidato creado exitosamente
 *       400:
 *         description: Error de validación
 *       409:
 *         description: El candidato ya existe
 *       401:
 *         description: No autorizado
 */
router.post('/', validateCreateCandidate, CandidateController.createCandidate);

/**
 * @swagger
 * /api/v1/candidates/{id}:
 *   get:
 *     summary: Obtener un candidato por ID
 *     tags: [Candidates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del candidato
 *     responses:
 *       200:
 *         description: Candidato encontrado
 *       404:
 *         description: Candidato no encontrado
 *       401:
 *         description: No autorizado
 */
router.get('/:id', validateCandidateId, CandidateController.getCandidateById);

/**
 * @swagger
 * /api/v1/candidates/{id}:
 *   put:
 *     summary: Actualizar un candidato
 *     tags: [Candidates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del candidato
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *               lastName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 200
 *     responses:
 *       200:
 *         description: Candidato actualizado exitosamente
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Candidato no encontrado
 *       401:
 *         description: No autorizado
 */
router.put('/:id', validateUpdateCandidate, CandidateController.updateCandidate);

/**
 * @swagger
 * /api/v1/candidates/{id}:
 *   delete:
 *     summary: Eliminar un candidato
 *     tags: [Candidates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del candidato
 *     responses:
 *       200:
 *         description: Candidato eliminado exitosamente
 *       404:
 *         description: Candidato no encontrado
 *       401:
 *         description: No autorizado
 */
router.delete('/:id', validateCandidateId, CandidateController.deleteCandidate);

/**
 * @swagger
 * /api/v1/candidates/{id}/cv:
 *   post:
 *     summary: Subir CV de un candidato
 *     tags: [Candidates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del candidato
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               cv:
 *                 type: string
 *                 format: binary
 *                 description: Archivo CV (PDF, DOCX, DOC)
 *     responses:
 *       200:
 *         description: CV subido exitosamente
 *       400:
 *         description: Error de validación de archivo
 *       404:
 *         description: Candidato no encontrado
 *       401:
 *         description: No autorizado
 */
router.post('/:id/cv', validateCandidateId, cvUpload, handleMulterError, CandidateController.uploadCV);

/**
 * @swagger
 * /api/v1/candidates/{id}/cv:
 *   get:
 *     summary: Descargar CV de un candidato
 *     tags: [Candidates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del candidato
 *     responses:
 *       200:
 *         description: Archivo CV
 *       404:
 *         description: CV no encontrado
 *       401:
 *         description: No autorizado
 */
router.get('/:id/cv', validateCandidateId, CandidateController.getCV);

/**
 * @swagger
 * /api/v1/candidates/{id}/cv:
 *   delete:
 *     summary: Eliminar CV de un candidato
 *     tags: [Candidates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del candidato
 *     responses:
 *       200:
 *         description: CV eliminado exitosamente
 *       404:
 *         description: Candidato no encontrado
 *       401:
 *         description: No autorizado
 */
router.delete('/:id/cv', validateCandidateId, CandidateController.deleteCV);

/**
 * @swagger
 * /api/v1/candidates/{id}/education:
 *   post:
 *     summary: Agregar educación a un candidato
 *     tags: [Candidates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del candidato
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - institution
 *               - year
 *               - level
 *             properties:
 *               title:
 *                 type: string
 *               institution:
 *                 type: string
 *               year:
 *                 type: integer
 *               level:
 *                 type: string
 *     responses:
 *       201:
 *         description: Educación agregada exitosamente
 *       404:
 *         description: Candidato no encontrado
 *       401:
 *         description: No autorizado
 */
router.post('/:id/education', validateCandidateId, CandidateController.addEducation);

/**
 * @swagger
 * /api/v1/candidates/{id}/experience:
 *   post:
 *     summary: Agregar experiencia a un candidato
 *     tags: [Candidates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del candidato
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - company
 *               - position
 *               - startDate
 *               - description
 *             properties:
 *               company:
 *                 type: string
 *               position:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Experiencia agregada exitosamente
 *       404:
 *         description: Candidato no encontrado
 *       401:
 *         description: No autorizado
 */
router.post('/:id/experience', validateCandidateId, CandidateController.addExperience);

export default router; 