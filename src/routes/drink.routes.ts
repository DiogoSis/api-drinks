import { Router } from 'express';
import { validateRequest } from '../middlewares/validateRequest';
import { authMiddleware } from '../middlewares/authMiddleware';
import { 
  CreateDrinkDTO, 
  UpdateDrinkDTO, 
  SearchDrinkDTO,
  StockCheckDTO
} from '../dtos/drink.dto';

const drinkRoutes = Router();

// Rotas de drinks
drinkRoutes.get(
  '/',
  validateRequest(SearchDrinkDTO),
  (req, res) => {
    // Implementação será feita no controller
  }
);

drinkRoutes.get(
  '/:id',
  (req, res) => {
    // Implementação será feita no controller
  }
);

drinkRoutes.post(
  '/',
  authMiddleware,
  validateRequest(CreateDrinkDTO),
  (req, res) => {
    // Implementação será feita no controller
  }
);

drinkRoutes.put(
  '/:id',
  authMiddleware,
  validateRequest(UpdateDrinkDTO),
  (req, res) => {
    // Implementação será feita no controller
  }
);

drinkRoutes.delete(
  '/:id',
  authMiddleware,
  (req, res) => {
    // Implementação será feita no controller
  }
);

drinkRoutes.get(
  '/search',
  validateRequest(SearchDrinkDTO),
  (req, res) => {
    // Implementação será feita no controller
  }
);

drinkRoutes.get(
  '/category/:category',
  (req, res) => {
    // Implementação será feita no controller
  }
);

drinkRoutes.get(
  '/:id/recipe',
  (req, res) => {
    // Implementação será feita no controller
  }
);

drinkRoutes.post(
  '/:id/stock-check',
  validateRequest(StockCheckDTO),
  (req, res) => {
    // Implementação será feita no controller
  }
);

drinkRoutes.post(
  '/:id/cost-calculation',
  (req, res) => {
    // Implementação será feita no controller
  }
);

drinkRoutes.get(
  '/:id/related',
  (req, res) => {
    // Implementação será feita no controller
  }
);

export default drinkRoutes;
