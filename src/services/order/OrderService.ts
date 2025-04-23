import { IOrderService } from '../../interfaces/order/IOrderService';
import { IOrderRepository } from '../../interfaces/order/IOrderRepository';
import { IDrinkRepository } from '../../interfaces/drink/IDrinkRepository';
import { IIngredientRepository } from '../../interfaces/ingredient/IIngredientRepository';
import { CreateOrderDTOType, UpdateOrderStatusDTOType } from '../../dtos/order.dto';
import { NotFoundError, ValidationError } from '../../errors/AppError';

export class OrderService implements IOrderService {
  constructor(
    private orderRepository: IOrderRepository,
    private drinkRepository: IDrinkRepository,
    private ingredientRepository: IIngredientRepository
  ) {}

  async createOrder(data: CreateOrderDTOType) {
    // Verificar se todos os drinks existem
    for (const item of data.itens) {
      const drink = await this.drinkRepository.findById(item.drinkId);
      if (!drink) {
        throw new NotFoundError(`Drink com ID ${item.drinkId} não encontrado`);
      }

      // Verificar estoque
      const stockCheck = await this.checkDrinkStock(item.drinkId, item.quantidade);
      if (!stockCheck.disponivel) {
        throw new ValidationError(`Estoque insuficiente para o drink ${drink.nome}`);
      }
    }

    // Criar pedido
    const order = await this.orderRepository.create(data);

    // Atualizar estoque (reduzir)
    for (const item of data.itens) {
      const drink = await this.drinkRepository.findById(item.drinkId);
      for (const ingrediente of drink.ingredientes) {
        const quantidadeNecessaria = ingrediente.quantidade * item.quantidade;
        await this.ingredientRepository.updateStock(
          ingrediente.id,
          -quantidadeNecessaria,
          `Consumo para pedido #${order.id}`
        );
      }
    }

    return order;
  }

  async getAllOrders(filters?: any) {
    return this.orderRepository.findAll(filters);
  }

  async getOrderById(id: number) {
    return this.orderRepository.findById(id);
  }

  async getOrdersByStatus(status: string, pagination?: { page: number; limit: number }) {
    return this.orderRepository.findByStatus(status, pagination);
  }

  async updateOrderStatus(id: number, data: UpdateOrderStatusDTOType) {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      return null;
    }

    return this.orderRepository.updateStatus(id, data.status, data.observacao);
  }

  async fulfillOrder(id: number, bartenderId: number) {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      return null;
    }

    if (order.status !== 'pendente') {
      throw new ValidationError(`Pedido com status ${order.status} não pode ser processado`);
    }

    // Atualizar status para "em_preparo"
    await this.orderRepository.updateStatus(id, 'em_preparo', `Atendido por bartender #${bartenderId}`);

    // Atribuir bartender
    return this.orderRepository.assignBartender(id, bartenderId);
  }

  async calculateOrderCost(id: number) {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      return null;
    }

    let totalCost = 0;

    for (const item of order.itens) {
      const drinkCost = await this.drinkRepository.calculateCost(item.drinkId);
      totalCost += drinkCost * item.quantidade;
    }

    return totalCost;
  }

  private async checkDrinkStock(drinkId: number, quantity: number) {
    const drink = await this.drinkRepository.findById(drinkId);
    if (!drink) {
      throw new NotFoundError(`Drink com ID ${drinkId} não encontrado`);
    }

    // Verificar disponibilidade de cada ingrediente
    const result = {
      disponivel: true,
      ingredientes: []
    };

    for (const ingrediente of drink.ingredientes) {
      const ingredienteEstoque = await this.ingredientRepository.getStock(ingrediente.id);
      const quantidadeNecessaria = ingrediente.quantidade * quantity;
      const disponivel = ingredienteEstoque >= quantidadeNecessaria;

      result.ingredientes.push({
        id: ingrediente.id,
        nome: ingrediente.nome,
        disponivel,
        quantidadeNecessaria,
        estoqueAtual: ingredienteEstoque
      });

      if (!disponivel) {
        result.disponivel = false;
      }
    }

    return result;
  }
}
