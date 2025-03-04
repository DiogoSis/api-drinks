import { IDrink, IDrinkRepository, IDrinkService } from "../interfaces/drink";


export class DrinkService implements IDrinkService {
    private drinkRepository: IDrinkRepository;

    constructor(drinkRepository: IDrinkRepository){
        this.drinkRepository = drinkRepository;
    }

    async getAllDrinks(): Promise<IDrink[]> {
        return this.drinkRepository.findAll();
    }

    async getDrinkById(id: number): Promise<IDrink | null> {
        return this.drinkRepository.findById(id);
    }
}