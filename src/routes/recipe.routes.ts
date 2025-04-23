import { Router } from 'express';
import { validateRequest } from '../middlewares/validateRequest';
import { authMiddleware } from '../middlewares/authMiddleware';
import { 
  CreateRecipeDTO, 
  UpdateRecipeDTO 
} from '../dtos/recipe.dto';

const recipeRoutes = Router();

// Rotas de receitas
recipeRoutes.get(
  '/',
  (req, res) => {
    // Implementação será feita no controller
  }
);

recipeRoutes.post(
  '/',
  authMiddleware,
  validateRequest(CreateRecipeDTO),
  (req, res) => {
    // Implementação será feita no controller
  }
);

recipeRoutes.put(
  '/:drinkId/:ingId',
  authMiddleware,
  validateRequest(UpdateRecipeDTO),
  (req, res) => {
    // Implementação será feita no controller
  }
);

recipeRoutes.delete(
  '/:drinkId/:ingId',
  authMiddleware,
  (req, res) => {
    // Implementação será feita no controller
  }
);

export default recipeRoutes;
