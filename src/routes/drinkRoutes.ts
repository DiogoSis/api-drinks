import { Router } from "express";
import { DrinkRepository } from "../repositories/drinkRepository";
import { DrinkService } from "../services/services";
import { DrinkController } from "../controllers/drinkController";



const router = Router();
const drinkRepository = new DrinkRepository();
const drinkService = new DrinkService(drinkRepository);
const drinkController = new DrinkController(drinkService);


router.get("/drink-list", (req, res) => drinkController.getDrinks(req, res) )

export default router;