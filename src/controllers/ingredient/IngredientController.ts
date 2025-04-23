import { Request, Response } from 'express';
import { IIngredientService } from '../../interfaces/ingredient/IIngredientService';
import { NotFoundError } from '../../errors/AppError';
import { 
  CreateIngredientDTOType, 
  UpdateIngredientDTOType, 
  UpdateStockDTOType 
} from '../../dtos/ingredient.dto';

export class IngredientController {
  constructor(private ingredientService: IIngredientService) {}

  async getIngredients(req: Request, res: Response) {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const nome = req.query.nome as string;
    const categoria = req.query.categoria as string;
    
    const ingredients = await this.ingredientService.getAllIngredients({ 
      page, 
      limit, 
      nome, 
      categoria 
    });
    
    return res.json(ingredients);
  }

  async getIngredient(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const ingredient = await this.ingredientService.getIngredientById(id);
    
    if (!ingredient) {
      throw new NotFoundError(`Ingrediente com ID ${id} não encontrado`);
    }
    
    return res.json(ingredient);
  }

  async createIngredient(req: Request, res: Response) {
    const ingredientData: CreateIngredientDTOType = req.body;
    const newIngredient = await this.ingredientService.createIngredient(ingredientData);
    return res.status(201).json(newIngredient);
  }

  async updateIngredient(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const ingredientData: UpdateIngredientDTOType = req.body;
    
    const updatedIngredient = await this.ingredientService.updateIngredient(id, ingredientData);
    
    if (!updatedIngredient) {
      throw new NotFoundError(`Ingrediente com ID ${id} não encontrado`);
    }
    
    return res.json(updatedIngredient);
  }

  async deleteIngredient(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const success = await this.ingredientService.deleteIngredient(id);
    
    if (!success) {
      throw new NotFoundError(`Ingrediente com ID ${id} não encontrado`);
    }
    
    return res.status(204).send();
  }

  async getIngredientStock(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const stock = await this.ingredientService.getIngredientStock(id);
    
    if (!stock) {
      throw new NotFoundError(`Estoque para ingrediente com ID ${id} não encontrado`);
    }
    
    return res.json(stock);
  }

  async updateIngredientStock(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const stockData: UpdateStockDTOType = req.body;
    
    const updatedStock = await this.ingredientService.updateIngredientStock(id, stockData);
    
    if (!updatedStock) {
      throw new NotFoundError(`Ingrediente com ID ${id} não encontrado`);
    }
    
    return res.json(updatedStock);
  }

  async getLowStock(req: Request, res: Response) {
    const lowStockIngredients = await this.ingredientService.getLowStockIngredients();
    return res.json(lowStockIngredients);
  }

  async getIngredientSuppliers(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const suppliers = await this.ingredientService.getIngredientSuppliers(id);
    
    if (!suppliers) {
      throw new NotFoundError(`Ingrediente com ID ${id} não encontrado`);
    }
    
    return res.json(suppliers);
  }

  async getIngredientHistory(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const dataInicio = req.query.dataInicio as string;
    const dataFim = req.query.dataFim as string;
    
    const history = await this.ingredientService.getIngredientHistory(id, dataInicio, dataFim);
    
    if (!history) {
      throw new NotFoundError(`Ingrediente com ID ${id} não encontrado`);
    }
    
    return res.json(history);
  }
}
