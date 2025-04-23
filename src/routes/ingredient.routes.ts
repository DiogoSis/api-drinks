import { Router } from 'express';
import { validateRequest } from '../middlewares/validateRequest';
import { authMiddleware } from '../middlewares/authMiddleware';
import { 
  CreateIngredientDTO, 
  UpdateIngredientDTO, 
  UpdateStockDTO,
  StockMovementDTO,
  StockAdjustmentDTO
} from '../dtos/ingredient.dto';

const ingredientRoutes = Router();

// Rotas de ingredientes
ingredientRoutes.get(
  '/',
  (req, res) => {
    // Implementação será feita no controller
  }
);

ingredientRoutes.get(
  '/:id',
  (req, res) => {
    // Implementação será feita no controller
  }
);

ingredientRoutes.get(
  '/:id/stock',
  (req, res) => {
    // Implementação será feita no controller
  }
);

ingredientRoutes.put(
  '/:id/stock',
  authMiddleware,
  validateRequest(UpdateStockDTO),
  (req, res) => {
    // Implementação será feita no controller
  }
);

ingredientRoutes.get(
  '/low-stock',
  (req, res) => {
    // Implementação será feita no controller
  }
);

ingredientRoutes.get(
  '/:id/suppliers',
  (req, res) => {
    // Implementação será feita no controller
  }
);

ingredientRoutes.get(
  '/:id/history',
  (req, res) => {
    // Implementação será feita no controller
  }
);

// Rotas de estoque
const stockRoutes = Router();

stockRoutes.post(
  '/movements',
  authMiddleware,
  validateRequest(StockMovementDTO),
  (req, res) => {
    // Implementação será feita no controller
  }
);

stockRoutes.post(
  '/adjustment',
  authMiddleware,
  validateRequest(StockAdjustmentDTO),
  (req, res) => {
    // Implementação será feita no controller
  }
);

stockRoutes.get(
  '/alerts',
  (req, res) => {
    // Implementação será feita no controller
  }
);

stockRoutes.get(
  '/history',
  (req, res) => {
    // Implementação será feita no controller
  }
);

export { ingredientRoutes, stockRoutes };
