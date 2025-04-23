import { Router } from 'express';
import { validateRequest } from '../middlewares/validateRequest';
import { authMiddleware } from '../middlewares/authMiddleware';
import { 
  CreateOrderDTO, 
  UpdateOrderStatusDTO, 
  FulfillOrderDTO,
  SearchOrderDTO
} from '../dtos/order.dto';

const orderRoutes = Router();

// Rotas de pedidos
orderRoutes.post(
  '/',
  validateRequest(CreateOrderDTO),
  (req, res) => {
    // Implementação será feita no controller
  }
);

orderRoutes.get(
  '/',
  validateRequest(SearchOrderDTO),
  (req, res) => {
    // Implementação será feita no controller
  }
);

orderRoutes.get(
  '/:id',
  (req, res) => {
    // Implementação será feita no controller
  }
);

orderRoutes.get(
  '/status/:status',
  (req, res) => {
    // Implementação será feita no controller
  }
);

orderRoutes.put(
  '/:id/status',
  authMiddleware,
  validateRequest(UpdateOrderStatusDTO),
  (req, res) => {
    // Implementação será feita no controller
  }
);

orderRoutes.post(
  '/:id/fulfill',
  authMiddleware,
  validateRequest(FulfillOrderDTO),
  (req, res) => {
    // Implementação será feita no controller
  }
);

orderRoutes.get(
  '/:id/cost',
  (req, res) => {
    // Implementação será feita no controller
  }
);

export default orderRoutes;
