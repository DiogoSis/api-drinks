import { DrinksRepository } from "../repositories/drinks-repository";

export class GetAllDrinks {

    constructor(private drinkRepository: DrinksRepository){}

    async execute() {
        return this.drinkRepository.findAll();
    }

}