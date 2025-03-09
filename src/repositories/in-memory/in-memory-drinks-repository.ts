import { IDrink, DrinksRepository } from "../drinks-repository";

export class InMemoryDrinkRepository implements DrinksRepository {
    findAll(): Promise<IDrink[]> {
        throw new Error("Method not implemented.");
    }
    findById(id: number): Promise<IDrink | null> {
        throw new Error("Method not implemented.");
    }
}