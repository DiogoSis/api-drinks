import { PrismaClient } from '@prisma/client';
import { IOrderRepository } from '../../interfaces/order/IOrderRepository';
import { IOrder } from '../../interfaces/order/IOrder';
import { CreateOrderDTOType } from '../../dtos/order.dto';

export class OrderRepository implements IOrderRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(filters?: any): Promise<IOrder[]> {
    const where: any = {};
    
    if (filters?.status) {
      where.status = filters.status;
    }
    
    if (filters?.clienteNome) {
      where.cliente_nome = {
        contains: filters.clienteNome,
        mode: 'insensitive'
      };
    }
    
    if (filters?.dataInicio) {
      where.data_criacao = {
        ...where.data_criacao,
        gte: new Date(filters.dataInicio)
      };
    }
    
    if (filters?.dataFim) {
      where.data_criacao = {
        ...where.data_criacao,
        lte: new Date(filters.dataFim)
      };
    }
    
    const orders = await this.prisma.pedido.findMany({
      where,
      include: {
        itens_pedido: {
          include: {
            drink: true
          }
        },
        bartender: true
      },
      orderBy: {
        data_criacao: 'desc'
      },
      skip: filters?.page ? (filters.page - 1) * (filters.limit || 10) : undefined,
      take: filters?.limit || undefined
    });
    
    return orders.map(order => this.mapOrderToDTO(order));
  }

  async findById(id: number): Promise<IOrder | null> {
    const order = await this.prisma.pedido.findUnique({
      where: { pedido_id: id },
      include: {
        itens_pedido: {
          include: {
            drink: true
          }
        },
        bartender: true
      }
    });
    
    if (!order) {
      return null;
    }
    
    return this.mapOrderToDTO(order);
  }

  async create(data: CreateOrderDTOType): Promise<IOrder> {
    // Criar o pedido
    const order = await this.prisma.pedido.create({
      data: {
        cliente_nome: data.clienteNome,
        mesa: data.mesa,
        status: 'pendente',
        data_criacao: new Date()
      }
    });
    
    // Adicionar itens ao pedido
    for (const item of data.itens) {
      // Buscar preço do drink
      const drink = await this.prisma.drink.findUnique({
        where: { drink_id: item.drinkId }
      });
      
      const precoUnitario = drink?.preco || 0;
      
      await this.prisma.itempedido.create({
        data: {
          pedido_id: order.pedido_id,
          drink_id: item.drinkId,
          quantidade: item.quantidade,
          observacao: item.observacao,
          preco_unitario: precoUnitario,
          preco_total: precoUnitario * item.quantidade
        }
      });
    }
    
    // Calcular valor total
    const valorTotal = await this.calculateTotal(order.pedido_id);
    
    // Atualizar valor total
    await this.prisma.pedido.update({
      where: { pedido_id: order.pedido_id },
      data: { valor_total: valorTotal }
    });
    
    // Buscar o pedido completo
    return this.findById(order.pedido_id) as Promise<IOrder>;
  }

  async findByStatus(status: string, pagination?: { page: number; limit: number }): Promise<IOrder[]> {
    const orders = await this.prisma.pedido.findMany({
      where: { status },
      include: {
        itens_pedido: {
          include: {
            drink: true
          }
        },
        bartender: true
      },
      orderBy: {
        data_criacao: 'desc'
      },
      skip: pagination?.page ? (pagination.page - 1) * (pagination.limit || 10) : undefined,
      take: pagination?.limit || undefined
    });
    
    return orders.map(order => this.mapOrderToDTO(order));
  }

  async updateStatus(id: number, status: string, observacao?: string): Promise<IOrder | null> {
    const order = await this.prisma.pedido.findUnique({
      where: { pedido_id: id }
    });
    
    if (!order) {
      return null;
    }
    
    const updatedOrder = await this.prisma.pedido.update({
      where: { pedido_id: id },
      data: {
        status,
        observacao: observacao || order.observacao
      },
      include: {
        itens_pedido: {
          include: {
            drink: true
          }
        },
        bartender: true
      }
    });
    
    return this.mapOrderToDTO(updatedOrder);
  }

  async assignBartender(id: number, bartenderId: number): Promise<IOrder | null> {
    const order = await this.prisma.pedido.findUnique({
      where: { pedido_id: id }
    });
    
    if (!order) {
      return null;
    }
    
    const updatedOrder = await this.prisma.pedido.update({
      where: { pedido_id: id },
      data: {
        bartender_id: bartenderId
      },
      include: {
        itens_pedido: {
          include: {
            drink: true
          }
        },
        bartender: true
      }
    });
    
    return this.mapOrderToDTO(updatedOrder);
  }

  private async calculateTotal(orderId: number): Promise<number> {
    const items = await this.prisma.itempedido.findMany({
      where: { pedido_id: orderId }
    });
    
    return items.reduce((total, item) => total + item.preco_total, 0);
  }

  private mapOrderToDTO(order: any): IOrder {
    return {
      id: order.pedido_id,
      clienteNome: order.cliente_nome,
      mesa: order.mesa,
      status: order.status,
      observacao: order.observacao,
      dataCriacao: order.data_criacao,
      valorTotal: order.valor_total,
      bartender: order.bartender ? {
        id: order.bartender.usuario_id,
        nome: order.bartender.nome
      } : null,
      itens: order.itens_pedido.map((item: any) => ({
        id: item.item_pedido_id,
        drink: {
          id: item.drink.drink_id,
          nome: item.drink.nome,
          categoria: item.drink.categoria
        },
        quantidade: item.quantidade,
        observacao: item.observacao,
        precoUnitario: item.preco_unitario,
        precoTotal: item.preco_total
      }))
    };
  }
}
