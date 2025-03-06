import { Request, Response } from 'express';
import { makeGetDrinkByIdUseCase } from '../../services/factories/make-getDrinkById-use-case';

export async function getDrinkById(req: Request, res: Response): Promise<Response> {
    try {
        const { drinkId } = req.params;

        if (!drinkId) {
            return res.status(400).json({ message: 'Id do drink não informado' });
        }

        const id = parseInt(drinkId, 10);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'Id do drink inválido' });
        }

        const useCase = makeGetDrinkByIdUseCase();
        const drink = await useCase.execute(id);

        if (!drink) {
            return res.status(404).json({ message: 'Drink não encontrado' });
        }

        return res.status(200).json(drink);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao buscar drink' });
    }
}
