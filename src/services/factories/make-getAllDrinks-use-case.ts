import { PrismaDrinksRepository } from "../../repositories/prisma/prisma-drinks-repository";
import { GetAllDrinks } from "../get-all-drinks";

export function makeGetAllDrinksUseCase() {

    const prismaDrinkRepository = new PrismaDrinksRepository();
    const useCase = new GetAllDrinks(prismaDrinkRepository);

    return useCase;

}