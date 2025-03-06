import {DrinksRepository } from "../repositories/drinks-repository";

export class GetDrinkById {

    constructor(private drinkRepository: DrinksRepository){}

    async execute(id: number) {
        return this.drinkRepository.findById(id);
    }
}