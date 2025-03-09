import { Request, Response } from 'express';
import { IDrinkService } from '../interfaces/drink';


export class DrinkController {
    private drinkService: IDrinkService;

    constructor(drinkService: IDrinkService) {
        this.drinkService = drinkService;
    }

    async getDrinks (req: Request, res: Response) {
        try {
            const { drinkId } = req.query;

            if(drinkId) {
                const id = parseInt(drinkId as string, 10);
                const drink = await this.drinkService.getDrinkById(id);

                if(!drink) {
                    res.status(404).send({message: 'Drink não encontrado'});
                    return
                }

                res.json(drink);
                return;
            }
            const drinks = await this.drinkService.getAllDrinks();
            res.json(drinks);
        } catch (error) {
            console.error(error);
            res.status(500).send({message: 'Erro ao buscar drinks'});
        }
    }
}