import { IOrder } from './IOrder';
import { CreateOrderDTOType, UpdateOrderStatusDTOType } from '../../dtos/order.dto';

export interface IOrderService {
  createOrder(data: CreateOrderDTOType): Promise<IOrder>;
  getAllOrders(filters?: any): Promise<IOrder[]>;
  getOrderById(id: number): Promise<IOrder | null>;
  getOrdersByStatus(status: string, pagination?: { page: number; limit: number }): Promise<IOrder[]>;
  updateOrderStatus(id: number, data: UpdateOrderStatusDTOType): Promise<IOrder | null>;
  fulfillOrder(id: number, bartenderId: number): Promise<IOrder | null>;
  calculateOrderCost(id: number): Promise<number | null>;
}
