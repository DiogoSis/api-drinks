import { GetDrinkById } from "../get-drink-by-id";
import { PrismaDrinksRepository } from "../../repositories/prisma/prisma-drinks-repository";

export function makeGetDrinkByIdUseCase() {

    const prismaDrinkRepository = new PrismaDrinksRepository();
    const useCase = new GetDrinkById(prismaDrinkRepository);

    return useCase;

}