import { Router } from "express";
import {getAllDrinks} from "./get-all-drinks";
import { getDrinkById } from "./get-drink-by-id";

const drinkRoutes = Router();

drinkRoutes.get("/", getAllDrinks);
drinkRoutes.get("/:id", getDrinkById);

export default drinkRoutes;