import { Request, Response } from 'express';
import { ISupplierService } from '../../interfaces/supplier/ISupplierService';
import { NotFoundError } from '../../errors/AppError';
import { 
  CreateSupplierDTOType, 
  SupplierIngredientDTOType, 
  UpdateSupplierDTOType 
} from '../../dtos/supplier.dto';

export class SupplierController {
  constructor(private supplierService: ISupplierService) {}

  async getSuppliers(req: Request, res: Response) {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    
    const suppliers = await this.supplierService.getAllSuppliers({ page, limit });
    return res.json(suppliers);
  }

  async getSupplier(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const supplier = await this.supplierService.getSupplierById(id);
    
    if (!supplier) {
      throw new NotFoundError(`Fornecedor com ID ${id} não encontrado`);
    }
    
    return res.json(supplier);
  }

  async createSupplier(req: Request, res: Response) {
    const supplierData: CreateSupplierDTOType = req.body;
    const newSupplier = await this.supplierService.createSupplier(supplierData);
    return res.status(201).json(newSupplier);
  }

  async updateSupplier(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const supplierData: UpdateSupplierDTOType = req.body;
    
    const updatedSupplier = await this.supplierService.updateSupplier(id, supplierData);
    
    if (!updatedSupplier) {
      throw new NotFoundError(`Fornecedor com ID ${id} não encontrado`);
    }
    
    return res.json(updatedSupplier);
  }

  async deleteSupplier(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const success = await this.supplierService.deleteSupplier(id);
    
    if (!success) {
      throw new NotFoundError(`Fornecedor com ID ${id} não encontrado`);
    }
    
    return res.status(204).send();
  }

  async searchSuppliers(req: Request, res: Response) {
    const name = req.query.name as string;
    
    if (!name) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Parâmetro de busca "name" é obrigatório' 
      });
    }
    
    const suppliers = await this.supplierService.searchSuppliersByName(name);
    return res.json(suppliers);
  }

  async getSupplierIngredients(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const ingredients = await this.supplierService.getSupplierIngredients(id);
    
    if (!ingredients) {
      throw new NotFoundError(`Fornecedor com ID ${id} não encontrado`);
    }
    
    return res.json(ingredients);
  }

  async addIngredientToSupplier(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const ingredientData: SupplierIngredientDTOType = req.body;
    
    const result = await this.supplierService.addIngredientToSupplier(id, ingredientData);
    
    if (!result) {
      throw new NotFoundError(`Fornecedor com ID ${id} não encontrado`);
    }
    
    return res.status(201).json(result);
  }

  async removeIngredientFromSupplier(req: Request, res: Response) {
    const supplierId = parseInt(req.params.id);
    const ingredientId = parseInt(req.params.ingId);
    
    const success = await this.supplierService.removeIngredientFromSupplier(supplierId, ingredientId);
    
    if (!success) {
      throw new NotFoundError(`Relação entre fornecedor ${supplierId} e ingrediente ${ingredientId} não encontrada`);
    }
    
    return res.status(204).send();
  }

  async getReplenishmentSuggestions(req: Request, res: Response) {
    const suggestions = await this.supplierService.getReplenishmentSuggestions();
    return res.json(suggestions);
  }
}
