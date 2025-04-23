import { PrismaClient } from '@prisma/client';
import { ISupplierRepository } from '../../interfaces/supplier/ISupplierRepository';
import { ISupplier } from '../../interfaces/supplier/ISupplier';
import { CreateSupplierDTOType, SupplierIngredientDTOType, UpdateSupplierDTOType } from '../../dtos/supplier.dto';

export class SupplierRepository implements ISupplierRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(pagination?: { page: number; limit: number }): Promise<ISupplier[]> {
    const suppliers = await this.prisma.fornecedor.findMany({
      skip: pagination?.page ? (pagination.page - 1) * (pagination.limit || 10) : undefined,
      take: pagination?.limit || undefined
    });
    
    return suppliers.map(supplier => this.mapSupplierToDTO(supplier));
  }

  async findById(id: number): Promise<ISupplier | null> {
    const supplier = await this.prisma.fornecedor.findUnique({
      where: { fornecedor_id: id }
    });
    
    if (!supplier) {
      return null;
    }
    
    return this.mapSupplierToDTO(supplier);
  }

  async create(data: CreateSupplierDTOType): Promise<ISupplier> {
    const supplier = await this.prisma.fornecedor.create({
      data: {
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        endereco: data.endereco,
        cnpj: data.cnpj,
        observacoes: data.observacoes
      }
    });
    
    return this.mapSupplierToDTO(supplier);
  }

  async update(id: number, data: UpdateSupplierDTOType): Promise<ISupplier | null> {
    const supplier = await this.prisma.fornecedor.findUnique({
      where: { fornecedor_id: id }
    });
    
    if (!supplier) {
      return null;
    }
    
    const updatedSupplier = await this.prisma.fornecedor.update({
      where: { fornecedor_id: id },
      data: {
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        endereco: data.endereco,
        cnpj: data.cnpj,
        observacoes: data.observacoes
      }
    });
    
    return this.mapSupplierToDTO(updatedSupplier);
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.$transaction(async (tx) => {
        // Remover relações com ingredientes
        await tx.fornecedoringrediente.deleteMany({
          where: { fornecedor_id: id }
        });
        
        // Remover movimentações de estoque relacionadas
        await tx.movimentacaoestoque.deleteMany({
          where: { fornecedor_id: id }
        });
        
        // Remover o fornecedor
        await tx.fornecedor.delete({
          where: { fornecedor_id: id }
        });
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao excluir fornecedor:', error);
      return false;
    }
  }

  async findByName(name: string): Promise<ISupplier[]> {
    const suppliers = await this.prisma.fornecedor.findMany({
      where: {
        nome: {
          contains: name,
          mode: 'insensitive'
        }
      }
    });
    
    return suppliers.map(supplier => this.mapSupplierToDTO(supplier));
  }

  async findIngredients(id: number): Promise<any[]> {
    const supplierIngredients = await this.prisma.fornecedoringrediente.findMany({
      where: { fornecedor_id: id },
      include: {
        ingrediente: {
          include: {
            unidademedida: true
          }
        }
      }
    });
    
    return supplierIngredients.map(si => ({
      ingredienteId: si.ingrediente.ingrediente_id,
      nome: si.ingrediente.nome,
      categoria: si.ingrediente.categoria,
      unidadeMedida: si.ingrediente.unidademedida?.abreviacao || 'un',
      precoUnitario: si.preco_unitario,
      prazoEntrega: si.prazo_entrega,
      observacoes: si.observacoes
    }));
  }

  async addIngredient(id: number, data: SupplierIngredientDTOType): Promise<any> {
    // Verificar se já existe relação
    const existingRelation = await this.prisma.fornecedoringrediente.findFirst({
      where: {
        fornecedor_id: id,
        ingrediente_id: data.ingredienteId
      }
    });
    
    if (existingRelation) {
      // Atualizar relação existente
      await this.prisma.fornecedoringrediente.update({
        where: {
          fornecedor_ingrediente_id: existingRelation.fornecedor_ingrediente_id
        },
        data: {
          preco_unitario: data.precoUnitario,
          prazo_entrega: data.prazoEntrega,
          observacoes: data.observacoes
        }
      });
    } else {
      // Criar nova relação
      await this.prisma.fornecedoringrediente.create({
        data: {
          fornecedor_id: id,
          ingrediente_id: data.ingredienteId,
          preco_unitario: data.precoUnitario,
          prazo_entrega: data.prazoEntrega,
          observacoes: data.observacoes
        }
      });
    }
    
    // Buscar ingrediente
    const ingredient = await this.prisma.ingrediente.findUnique({
      where: { ingrediente_id: data.ingredienteId },
      include: {
        unidademedida: true
      }
    });
    
    return {
      fornecedorId: id,
      ingredienteId: data.ingredienteId,
      nome: ingredient?.nome,
      categoria: ingredient?.categoria,
      unidadeMedida: ingredient?.unidademedida?.abreviacao || 'un',
      precoUnitario: data.precoUnitario,
      prazoEntrega: data.prazoEntrega,
      observacoes: data.observacoes
    };
  }

  async removeIngredient(supplierId: number, ingredientId: number): Promise<boolean> {
    try {
      await this.prisma.fornecedoringrediente.deleteMany({
        where: {
          fornecedor_id: supplierId,
          ingrediente_id: ingredientId
        }
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao remover ingrediente do fornecedor:', error);
      return false;
    }
  }

  private mapSupplierToDTO(supplier: any): ISupplier {
    return {
      id: supplier.fornecedor_id,
      nome: supplier.nome,
      email: supplier.email,
      telefone: supplier.telefone,
      endereco: supplier.endereco,
      cnpj: supplier.cnpj,
      observacoes: supplier.observacoes
    };
  }
}
