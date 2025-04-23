import { PrismaClient } from '@prisma/client';
import { IIngredientRepository } from '../../interfaces/ingredient/IIngredientRepository';
import { IIngredient } from '../../interfaces/ingredient/IIngredient';
import { CreateIngredientDTOType, UpdateIngredientDTOType } from '../../dtos/ingredient.dto';

export class IngredientRepository implements IIngredientRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(filters?: any): Promise<IIngredient[]> {
    const where: any = {};
    
    if (filters?.nome) {
      where.nome = {
        contains: filters.nome,
        mode: 'insensitive'
      };
    }
    
    if (filters?.categoria) {
      where.categoria = filters.categoria;
    }
    
    const ingredients = await this.prisma.ingrediente.findMany({
      where,
      include: {
        unidademedida: true
      },
      skip: filters?.page ? (filters.page - 1) * (filters.limit || 10) : undefined,
      take: filters?.limit || undefined
    });
    
    return ingredients.map(ingredient => this.mapIngredientToDTO(ingredient));
  }

  async findById(id: number): Promise<IIngredient | null> {
    const ingredient = await this.prisma.ingrediente.findUnique({
      where: { ingrediente_id: id },
      include: {
        unidademedida: true
      }
    });
    
    if (!ingredient) {
      return null;
    }
    
    return this.mapIngredientToDTO(ingredient);
  }

  async create(data: CreateIngredientDTOType): Promise<IIngredient> {
    const ingredient = await this.prisma.ingrediente.create({
      data: {
        nome: data.nome,
        descricao: data.descricao,
        categoria: data.categoria,
        unidademedida_id: data.unidadeMedidaId,
        estoque_minimo: data.estoqueMinimo,
        estoque_atual: data.estoqueAtual,
        custo: data.custo
      },
      include: {
        unidademedida: true
      }
    });
    
    // Registrar movimentação inicial de estoque se houver
    if (data.estoqueAtual && data.estoqueAtual > 0) {
      await this.prisma.movimentacaoestoque.create({
        data: {
          ingrediente_id: ingredient.ingrediente_id,
          quantidade: data.estoqueAtual,
          tipo: 'entrada',
          motivo: 'Estoque inicial',
          data: new Date()
        }
      });
    }
    
    return this.mapIngredientToDTO(ingredient);
  }

  async update(id: number, data: UpdateIngredientDTOType): Promise<IIngredient | null> {
    const ingredient = await this.prisma.ingrediente.findUnique({
      where: { ingrediente_id: id }
    });
    
    if (!ingredient) {
      return null;
    }
    
    const updatedIngredient = await this.prisma.ingrediente.update({
      where: { ingrediente_id: id },
      data: {
        nome: data.nome,
        descricao: data.descricao,
        categoria: data.categoria,
        unidademedida_id: data.unidadeMedidaId,
        estoque_minimo: data.estoqueMinimo,
        custo: data.custo
      },
      include: {
        unidademedida: true
      }
    });
    
    return this.mapIngredientToDTO(updatedIngredient);
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.$transaction(async (tx) => {
        // Remover movimentações de estoque
        await tx.movimentacaoestoque.deleteMany({
          where: { ingrediente_id: id }
        });
        
        // Remover relações com fornecedores
        await tx.fornecedoringrediente.deleteMany({
          where: { ingrediente_id: id }
        });
        
        // Remover de receitas
        await tx.receitadrink.deleteMany({
          where: { ingrediente_id: id }
        });
        
        // Remover o ingrediente
        await tx.ingrediente.delete({
          where: { ingrediente_id: id }
        });
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao excluir ingrediente:', error);
      return false;
    }
  }

  async getStock(id: number): Promise<number> {
    const ingredient = await this.prisma.ingrediente.findUnique({
      where: { ingrediente_id: id },
      select: { estoque_atual: true }
    });
    
    return ingredient?.estoque_atual || 0;
  }

  async updateStock(id: number, quantity: number, motivo: string): Promise<boolean> {
    try {
      await this.prisma.$transaction(async (tx) => {
        // Buscar estoque atual
        const ingredient = await tx.ingrediente.findUnique({
          where: { ingrediente_id: id },
          select: { estoque_atual: true }
        });
        
        if (!ingredient) {
          throw new Error(`Ingrediente com ID ${id} não encontrado`);
        }
        
        // Calcular novo estoque
        const novoEstoque = Math.max(0, ingredient.estoque_atual + quantity);
        
        // Atualizar estoque
        await tx.ingrediente.update({
          where: { ingrediente_id: id },
          data: { estoque_atual: novoEstoque }
        });
        
        // Registrar movimentação
        await tx.movimentacaoestoque.create({
          data: {
            ingrediente_id: id,
            quantidade: Math.abs(quantity),
            tipo: quantity >= 0 ? 'entrada' : 'saida',
            motivo,
            data: new Date()
          }
        });
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao atualizar estoque:', error);
      return false;
    }
  }

  async findLowStock(): Promise<IIngredient[]> {
    const ingredients = await this.prisma.ingrediente.findMany({
      where: {
        estoque_atual: {
          lt: this.prisma.ingrediente.fields.estoque_minimo
        }
      },
      include: {
        unidademedida: true
      }
    });
    
    return ingredients.map(ingredient => this.mapIngredientToDTO(ingredient));
  }

  async findSuppliers(id: number): Promise<any[]> {
    const supplierIngredients = await this.prisma.fornecedoringrediente.findMany({
      where: { ingrediente_id: id },
      include: {
        fornecedor: true
      }
    });
    
    return supplierIngredients.map(si => ({
      fornecedorId: si.fornecedor.fornecedor_id,
      nome: si.fornecedor.nome,
      email: si.fornecedor.email,
      telefone: si.fornecedor.telefone,
      precoUnitario: si.preco_unitario,
      prazoEntrega: si.prazo_entrega,
      observacoes: si.observacoes
    }));
  }

  async findHistory(id: number, dataInicio?: string, dataFim?: string): Promise<any[]> {
    const where: any = { ingrediente_id: id };
    
    if (dataInicio) {
      where.data = {
        ...where.data,
        gte: new Date(dataInicio)
      };
    }
    
    if (dataFim) {
      where.data = {
        ...where.data,
        lte: new Date(dataFim)
      };
    }
    
    const movimentacoes = await this.prisma.movimentacaoestoque.findMany({
      where,
      orderBy: {
        data: 'desc'
      },
      include: {
        fornecedor: true
      }
    });
    
    return movimentacoes.map(mov => ({
      id: mov.movimentacao_id,
      data: mov.data,
      tipo: mov.tipo,
      quantidade: mov.quantidade,
      motivo: mov.motivo,
      fornecedor: mov.fornecedor ? {
        id: mov.fornecedor.fornecedor_id,
        nome: mov.fornecedor.nome
      } : null
    }));
  }

  private mapIngredientToDTO(ingredient: any): IIngredient {
    return {
      id: ingredient.ingrediente_id,
      nome: ingredient.nome,
      descricao: ingredient.descricao,
      categoria: ingredient.categoria,
      unidadeMedida: ingredient.unidademedida?.abreviacao || 'un',
      unidadeMedidaId: ingredient.unidademedida_id,
      estoqueMinimo: ingredient.estoque_minimo,
      estoqueAtual: ingredient.estoque_atual,
      custo: ingredient.custo
    };
  }
}
