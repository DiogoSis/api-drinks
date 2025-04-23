import { Router } from 'express';
import { validateRequest } from '../middlewares/validateRequest';
import { authMiddleware } from '../middlewares/authMiddleware';
import { 
  CreateUserDTO, 
  LoginDTO, 
  RefreshTokenDTO 
} from '../dtos/auth.dto';

const authRoutes = Router();

// Rotas de autenticação
authRoutes.post(
  '/register',
  validateRequest(CreateUserDTO),
  (req, res) => {
    // Implementação será feita no controller
  }
);

authRoutes.post(
  '/login',
  validateRequest(LoginDTO),
  (req, res) => {
    // Implementação será feita no controller
  }
);

authRoutes.post(
  '/refresh-token',
  validateRequest(RefreshTokenDTO),
  (req, res) => {
    // Implementação será feita no controller
  }
);

authRoutes.post(
  '/logout',
  authMiddleware,
  (req, res) => {
    // Implementação será feita no controller
  }
);

export default authRoutes;
