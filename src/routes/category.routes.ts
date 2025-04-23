import { Router } from 'express';
import { validateRequest } from '../middlewares/validateRequest';
import { authMiddleware } from '../middlewares/authMiddleware';
import { 
  CreateCategoryDTO, 
  UpdateCategoryDTO,
  CreateUnitDTO,
  UpdateUnitDTO
} from '../dtos/category.dto';

const categoryRoutes = Router();

// Rotas de categorias
categoryRoutes.get(
  '/',
  (req, res) => {
    // Implementação será feita no controller
  }
);

categoryRoutes.post(
  '/',
  authMiddleware,
  validateRequest(CreateCategoryDTO),
  (req, res) => {
    // Implementação será feita no controller
  }
);

categoryRoutes.put(
  '/:id',
  authMiddleware,
  validateRequest(UpdateCategoryDTO),
  (req, res) => {
    // Implementação será feita no controller
  }
);

categoryRoutes.delete(
  '/:id',
  authMiddleware,
  (req, res) => {
    // Implementação será feita no controller
  }
);

// Rotas de unidades de medida
const unitRoutes = Router();

unitRoutes.get(
  '/',
  (req, res) => {
    // Implementação será feita no controller
  }
);

unitRoutes.post(
  '/',
  authMiddleware,
  validateRequest(CreateUnitDTO),
  (req, res) => {
    // Implementação será feita no controller
  }
);

unitRoutes.put(
  '/:id',
  authMiddleware,
  validateRequest(UpdateUnitDTO),
  (req, res) => {
    // Implementação será feita no controller
  }
);

unitRoutes.delete(
  '/:id',
  authMiddleware,
  (req, res) => {
    // Implementação será feita no controller
  }
);

export { categoryRoutes, unitRoutes };
