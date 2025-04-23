import { Request, Response } from 'express';
import { IOrderService } from '../../interfaces/order/IOrderService';
import { NotFoundError } from '../../errors/AppError';
import { 
  CreateOrderDTOType, 
  FulfillOrderDTOType, 
  UpdateOrderStatusDTOType 
} from '../../dtos/order.dto';

export class OrderController {
  constructor(private orderService: IOrderService) {}

  async createOrder(req: Request, res: Response) {
    const orderData: CreateOrderDTOType = req.body;
    const newOrder = await this.orderService.createOrder(orderData);
    return res.status(201).json(newOrder);
  }

  async getOrders(req: Request, res: Response) {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const status = req.query.status as string;
    const clienteNome = req.query.clienteNome as string;
    const dataInicio = req.query.dataInicio as string;
    const dataFim = req.query.dataFim as string;
    
    const orders = await this.orderService.getAllOrders({ 
      page, 
      limit, 
      status, 
      clienteNome, 
      dataInicio, 
      dataFim 
    });
    
    return res.json(orders);
  }

  async getOrder(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const order = await this.orderService.getOrderById(id);
    
    if (!order) {
      throw new NotFoundError(`Pedido com ID ${id} não encontrado`);
    }
    
    return res.json(order);
  }

  async getOrdersByStatus(req: Request, res: Response) {
    const status = req.params.status;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    
    const orders = await this.orderService.getOrdersByStatus(status, { page, limit });
    return res.json(orders);
  }

  async updateOrderStatus(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const statusData: UpdateOrderStatusDTOType = req.body;
    
    const updatedOrder = await this.orderService.updateOrderStatus(id, statusData);
    
    if (!updatedOrder) {
      throw new NotFoundError(`Pedido com ID ${id} não encontrado`);
    }
    
    return res.json(updatedOrder);
  }

  async fulfillOrder(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const fulfillData: FulfillOrderDTOType = req.body;
    
    const fulfilledOrder = await this.orderService.fulfillOrder(id, fulfillData.bartenderId);
    
    if (!fulfilledOrder) {
      throw new NotFoundError(`Pedido com ID ${id} não encontrado`);
    }
    
    return res.json(fulfilledOrder);
  }

  async calculateOrderCost(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const cost = await this.orderService.calculateOrderCost(id);
    
    if (cost === null) {
      throw new NotFoundError(`Pedido com ID ${id} não encontrado`);
    }
    
    return res.json({ id, cost });
  }
}
