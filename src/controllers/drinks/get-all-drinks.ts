import { Request, Response } from "express";
import { makeGetAllDrinksUseCase } from "../../services/factories/make-getAllDrinks-use-case";

 export async function getAllDrinks(req: Request, res: Response) {
    try {
        const useCase = makeGetAllDrinksUseCase();
        const drinks = await useCase.execute();

        return res.status(200).json(drinks);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao buscar drinks' });
    }
};

