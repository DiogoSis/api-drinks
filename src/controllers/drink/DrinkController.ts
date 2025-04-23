import { Request, Response } from 'express';
import { IDrinkService } from '../../interfaces/drink/IDrinkService';
import { NotFoundError } from '../../errors/AppError';
import { CreateDrinkDTOType, SearchDrinkDTOType, StockCheckDTOType, UpdateDrinkDTOType } from '../../dtos/drink.dto';

export class DrinkController {
  constructor(private drinkService: IDrinkService) {}

  async getDrinks(req: Request, res: Response) {
    const filters: SearchDrinkDTOType = {
      nome: req.query.nome as string,
      categoria: req.query.categoria as string,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10
    };

    const drinks = await this.drinkService.getAllDrinks(filters);
    return res.json(drinks);
  }

  async getDrink(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const drink = await this.drinkService.getDrinkById(id);

    if (!drink) {
      throw new NotFoundError(`Drink com ID ${id} não encontrado`);
    }

    return res.json(drink);
  }

  async createDrink(req: Request, res: Response) {
    const drinkData: CreateDrinkDTOType = req.body;
    const newDrink = await this.drinkService.createDrink(drinkData);
    return res.status(201).json(newDrink);
  }

  async updateDrink(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const drinkData: UpdateDrinkDTOType = req.body;
    
    const updatedDrink = await this.drinkService.updateDrink(id, drinkData);
    
    if (!updatedDrink) {
      throw new NotFoundError(`Drink com ID ${id} não encontrado`);
    }
    
    return res.json(updatedDrink);
  }

  async deleteDrink(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const success = await this.drinkService.deleteDrink(id);
    
    if (!success) {
      throw new NotFoundError(`Drink com ID ${id} não encontrado`);
    }
    
    return res.status(204).send();
  }

  async searchDrinks(req: Request, res: Response) {
    const name = req.query.name as string;
    
    if (!name) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Parâmetro de busca "name" é obrigatório' 
      });
    }
    
    const drinks = await this.drinkService.searchDrinksByName(name);
    return res.json(drinks);
  }

  async getDrinksByCategory(req: Request, res: Response) {
    const category = req.params.category;
    const drinks = await this.drinkService.getDrinksByCategory(category);
    return res.json(drinks);
  }

  async getDrinkRecipe(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const recipe = await this.drinkService.getDrinkRecipe(id);
    
    if (!recipe) {
      throw new NotFoundError(`Receita para drink com ID ${id} não encontrada`);
    }
    
    return res.json(recipe);
  }

  async checkDrinkStock(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { quantidade }: StockCheckDTOType = req.body;
    
    const stockCheck = await this.drinkService.checkDrinkStock(id, quantidade);
    
    if (!stockCheck) {
      throw new NotFoundError(`Drink com ID ${id} não encontrado`);
    }
    
    return res.json(stockCheck);
  }

  async calculateDrinkCost(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const cost = await this.drinkService.calculateDrinkCost(id);
    
    if (cost === null) {
      throw new NotFoundError(`Drink com ID ${id} não encontrado`);
    }
    
    return res.json({ id, cost });
  }

  async getRelatedDrinks(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const relatedDrinks = await this.drinkService.getRelatedDrinks(id);
    
    if (!relatedDrinks) {
      throw new NotFoundError(`Drink com ID ${id} não encontrado`);
    }
    
    return res.json(relatedDrinks);
  }
}
