import { Router } from 'express';
import { config } from '../config';
import authRoutes from './auth.routes';
import drinkRoutes from './drink.routes';
import { ingredientRoutes, stockRoutes } from './ingredient.routes';
import orderRoutes from './order.routes';
import supplierRoutes from './supplier.routes';
import recipeRoutes from './recipe.routes';
import { categoryRoutes, unitRoutes } from './category.routes';
import { webhookRoutes, analyticsRoutes, monitoringRoutes } from './webhook.routes';
import { notFoundHandler } from '../middlewares/errorHandler';

const router = Router();
const apiPrefix = config.server.apiPrefix;

// Rotas de autenticação
router.use(`${apiPrefix}/auth`, authRoutes);

// Rotas de drinks
router.use(`${apiPrefix}/drinks`, drinkRoutes);

// Rotas de ingredientes e estoque
router.use(`${apiPrefix}/ingredients`, ingredientRoutes);
router.use(`${apiPrefix}/stock`, stockRoutes);

// Rotas de pedidos
router.use(`${apiPrefix}/orders`, orderRoutes);

// Rotas de fornecedores
router.use(`${apiPrefix}/suppliers`, supplierRoutes);

// Rotas de receitas
router.use(`${apiPrefix}/recipes`, recipeRoutes);

// Rotas de categorias e unidades
router.use(`${apiPrefix}/categories`, categoryRoutes);
router.use(`${apiPrefix}/units`, unitRoutes);

// Rotas de webhooks, analytics e monitoramento
router.use(`${apiPrefix}/webhooks`, webhookRoutes);
router.use(`${apiPrefix}/analytics`, analyticsRoutes);
router.use(`${apiPrefix}/health`, monitoringRoutes.get('/health'));
router.use(`${apiPrefix}/metrics`, monitoringRoutes.get('/metrics'));
router.use(`${apiPrefix}/logs`, monitoringRoutes.get('/logs'));

// Rota para tratamento de rotas não encontradas
router.use('*', notFoundHandler);

export default router;
