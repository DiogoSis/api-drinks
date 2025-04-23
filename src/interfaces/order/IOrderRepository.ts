import { IOrder } from './IOrder';
import { CreateOrderDTOType } from '../../dtos/order.dto';

export interface IOrderRepository {
  findAll(filters?: any): Promise<IOrder[]>;
  findById(id: number): Promise<IOrder | null>;
  create(data: CreateOrderDTOType): Promise<IOrder>;
  findByStatus(status: string, pagination?: { page: number; limit: number }): Promise<IOrder[]>;
  updateStatus(id: number, status: string, observacao?: string): Promise<IOrder | null>;
  assignBartender(id: number, bartenderId: number): Promise<IOrder | null>;
}
